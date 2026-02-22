'use server';

import { db } from './db-config';
import { documents } from './db-schema';
import { generateEmbedding } from './embedding';

export async function addDocument(formData: FormData): Promise<void> {
  const content = formData.get('content');

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Content is required');
  }

  const embedding = await generateEmbedding(content);

  await db.insert(documents).values({
    content,
    embedding,
  });
}
