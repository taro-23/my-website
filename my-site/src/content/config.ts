// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const productsCollection = defineCollection({
  type: 'content', // mdとmdxの両方をサポート
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
    demoUrl: z.string().optional(), // デモ版のダウンロードURL
  }),
});

export const collections = {
  products: productsCollection,
};