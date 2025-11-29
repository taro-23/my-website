// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const audioFileSchema = z.object({
  title: z.string(),
  url: z.string(),
});

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    price: z.number(),
    type: z.enum(['Patch Pack', 'Sample Pack', 'Wavetable']),
    platform: z.array(z.string()),
    paid: z.boolean(),
    bundle: z.boolean(),
    image: z.string(),
    gumroadUrl: z.string(),
    date: z.string(),
    demoUrl: z.string().optional(),
    audioFiles: z.array(audioFileSchema).optional(),
  }),
});

export const collections = {
  products: productsCollection,
};