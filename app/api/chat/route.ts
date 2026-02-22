import {
  convertToModelMessages,
  gateway,
  stepCountIs,
  streamText,
  UIMessage,
  tool,
  InferUITools,
  UIDataTypes,
} from 'ai';
import { MaximVercelProviderMetadata, wrapMaximAISDKModel } from '@maximai/maxim-js/vercel-ai-sdk';
import { z } from 'zod';

import { searchDocuments } from '@/lib/search';
import { getMaximLogger } from '@/lib/maxim';

const tools = {
  searchKnowledgeBase: tool({
    description:
      'Doorzoek de database voor informatie over het bedrijf zoals het menu, openingsuren of algemene bedrijfsinformatie.',
    inputSchema: z.object({
      query: z
        .string()
        .describe('Focus op kernwoorden zoals productnamen of categorieën voor de beste match.'),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 5, 0.35);
        if (results.length === 0) {
          console.log('Geen relevante informatie gevonden in de database');
          return 'Geen relevante informatie gevonden in de database';
        }

        const formattedResults = results.map((r, i) => `[${i + 1}] ${r.content}`).join('\n\n');
        console.info(formattedResults);

        return formattedResults;
      } catch (err) {
        console.error('Zoek error:', err);
        return 'Error bij het opzoeken: ' + err;
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const { messages, sessionId: bodySessionId }: { messages: ChatMessage[]; sessionId?: string } =
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
  const model = wrapMaximAISDKModel(gateway('openai/gpt-4.1-mini'), logger);

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
    model,
    tools,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `
      Je bent de virtuele assistent van De Friturie. 
      GEBRUIK de tool 'searchKnowledgeBase' om informatie te vinden.
      
      BELANGRIJKE REGELS:
      - Antwoord DIRECT met de informatie uit de database. Gebruik enkel de kennis die je hebt uit de database, verzin zelf niks.
      - Beantwoord altijd kort en bondig, en geef een antwoord op de vraag.
      - Geef simpelweg aan dat je het niet weet, zeg niet dat je beschikbare informatie raadpleegt of iets dergelijks.

      Vandaag is het: ${huidigeDatum}
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
