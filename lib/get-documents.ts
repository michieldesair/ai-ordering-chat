'use server';

import { db } from './db-config';
import { documents } from './db-schema';

export async function getDocuments() {
  return await db.select().from(documents);
}
