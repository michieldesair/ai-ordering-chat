import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai';

import { RESTAURANT_DATA } from '@/data/restaurant-data-example';

export const maxDuration = 30; // max response time

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const huidigeDatum = new Date().toLocaleDateString('nl-BE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    stopWhen: stepCountIs(1),
    system: `
      Je bent de virtuele assistent van ${RESTAURANT_DATA.restaurant}. Jouw enige taak is het informeren van klanten op basis van de verstrekte data.

      HUIDIGE CONTEXT:
      - Datum: ${huidigeDatum}
      - Tijd: ${new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })}
      - RESTAURANT DATA: ${JSON.stringify(RESTAURANT_DATA)}

      STRIKTE RICHTLIJNEN:
      1. NIET VERZINNEN: Als informatie (zoals een prijs of een specifieke snack) niet in de JSON-data staat, zeg je dat je die informatie niet hebt. Doe geen aannames.
      2. GEEN TRANSACTIES: Je kunt GEEN bestellingen verwerken, betalingen aannemen of acties uitvoeren. Als een klant wil bestellen, verwijs je ze naar het telefoonnummer of de fysieke zaak.
      3. ANTWOORD DIRECT: Vermijd inleidingen zoals "Vandaag op vrijdag...". Geef direct antwoord op de vraag. 
         - Vraag: "Tot hoelaat open?" 
         - Antwoord: "We zijn vandaag open tot 21:00."
      4. REKENEN MET TIJD: Gebruik de huidige tijd om te bepalen of de zaak open of gesloten is op dit moment.
      5. TONE-OF-VOICE: Professioneel, feitelijk en kort. Geen overdreven enthousiasme of "chatbot-praat".
      6. MARKDOWN: Gebruik enkel **vetgedrukte tekst** voor uren en prijzen om de leesbaarheid te vergroten. Gebruik geen tabellen tenzij de klant om een lijst vraagt.

      FOUTMELDING:
      Indien een klant iets vraagt wat buiten je data valt, antwoord je: "Ik heb helaas geen informatie over [onderwerp]. Je kunt het beste even contact opnemen met de zaak."
    `,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
