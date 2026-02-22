import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai';
import { MaximVercelProviderMetadata, wrapMaximAISDKModel } from '@maximai/maxim-js/vercel-ai-sdk';
import { openai } from '@ai-sdk/openai';

import { RESTAURANT_DATA } from '@/data/restaurant-data-example';
import { getMaximLogger } from '@/lib/maxim';

export async function POST(req: Request) {
  const { messages, sessionId: bodySessionId }: { messages: UIMessage[]; sessionId?: string } =
    await req.json();

  const cookieHeader: string | null = req.headers.get('cookie');
  const cookieSessionId = cookieHeader
    ? cookieHeader
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('sessionId='))
        ?.split('=')[1]
    : null;
  const sessionId = bodySessionId || cookieSessionId || `session-${Date.now()}`;

  const logger = await getMaximLogger();
  if (!logger) {
    console.warn('Maxim logger is not available. Proceeding without logging.');
    throw new Error('Maxim logger not initialized');
  }
  const model = wrapMaximAISDKModel(openai('gpt-4o-mini'), logger);

  const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
  const messageCount = messages.length;
  const hasTools = messages.some((m) => m.parts.some((part) => part.type.includes('tool')));
  const lastUserContent = lastUserMessage?.parts?.find((part) => part.type === 'text')?.text || '';

  const huidigeDatum = new Date().toLocaleDateString('nl-BE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const result = streamText({
    model: model,
    messages: await convertToModelMessages(messages),
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
         - Controleer Geef aan als we vandaag gesloten zijn, bijvoorbeeld: "We zijn vandaag gesloten, maar we zijn morgen weer open van {openingsuren}."
      4. REKENEN MET TIJD: Gebruik de huidige tijd om te bepalen of de zaak open of gesloten is op dit moment.
      5. TONE-OF-VOICE: Professioneel, feitelijk en kort. Geen overdreven enthousiasme of "chatbot-praat".
      6. MARKDOWN: Gebruik enkel **vetgedrukte tekst** voor uren en prijzen om de leesbaarheid te vergroten. Gebruik geen tabellen tenzij de klant om een lijst vraagt.
      7. PRIJZEN: Geef een prijs alleen als deze expliciet in de data staat. Zeg anders dat je die informatie niet hebt. Geef prijzen in het volgende formaat: "€{prijs},-".
      8. SNACKS: Als een klant vraagt naar snacks, geef dan alleen de snacks weer die in de data staan. Geef alle prijzen weer zoals ze in de data staan, inclusief eventuele variaties (zoals "klein" of "groot").
      FOUTMELDING:
      Indien een klant iets vraagt wat buiten je data valt, antwoord je: "Ik heb helaas geen informatie over [onderwerp]. Je kunt het beste even contact opnemen met de zaak."
    `,
    providerOptions: {
      maxim: {
        sessionName: `ai-chat-${sessionId}`,
        sessionId: sessionId,
        traceName: `Chat Sessie - ${messageCount} ${messageCount === 1 ? 'bericht' : 'berichten'} - ${hasTools ? 'met tools' : 'zonder tools'}`,
        generationName: `GPT-4o-mini antwoord op: "${lastUserContent.slice(0, 50)}${lastUserContent.length > 50 ? '...' : ''}"`,
        sessionTags: {
          application: 'ai-ordering-chat',
          version: '1.0',
          environment: process.env.NODE_ENV || 'development',
          sessionId: sessionId,
        },
        traceTags: {
          endpoint: '/api/chat',
          type: 'chatbot',
          messageCount: messageCount.toString(),
          hasTools: hasTools.toString(),
          userQuery: lastUserContent.substring(0, 100),
          sessionId: sessionId,
        },
      } as MaximVercelProviderMetadata,
    },
  });

  return result.toUIMessageStreamResponse();
}
