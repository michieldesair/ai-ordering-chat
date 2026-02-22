import { z } from 'zod';

export const vectorSchema = z.object({
  id: z.string(),
  text_content: z.string(),
  type: z.string(),
  vector: z.string(),
});

export type Vector = z.infer<typeof vectorSchema>;
