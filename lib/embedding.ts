import { embed } from 'ai';

export async function generateEmbedding(text: string) {
  const input = text.replace('\n', '');

  const { embedding } = await embed({
    model: 'openai/text-embedding-3-small',
    value: input,
  });

  return embedding;
}
