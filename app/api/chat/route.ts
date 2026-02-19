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
    model: 'google/gemini-3-flash',
    stopWhen: stepCountIs(1),
    system: `
      Je bent de virtuele assistent van ${RESTAURANT_DATA.restaurant}.
      
      Het is vandaag: ${huidigeDatum}.

      DATA: ${JSON.stringify(RESTAURANT_DATA)}

      STRIKTE RICHTLIJNEN:
      1. Geef altijd ÉÉN volledig en doordacht antwoord. Blijf niet herhalen.
      2. Als de klant vraagt naar openingsuren, kijk dan specifiek naar de dag van vandaag (${huidigeDatum}) in de data. 
      3. Verzin nooit informatie. Als het niet in de JSON staat, bestaat het niet.
      4. Wees vriendelijk, behulpzaam en professioneel. Je bent een vertegenwoordiger van ${RESTAURANT_DATA.restaurant}.
    `,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
