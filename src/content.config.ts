import { defineCollection, z } from 'astro:content';

const worksCollection = defineCollection({
  type: 'content', // 支持 Markdown 或 MDX
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    // 使用 string() 来支持公共文件夹的路径
    coverImage: z.string(), 
    galleryImages: z.array(z.string()).default([]).optional(),
    previewWebm: z.string().optional(),
    videoUrl: z.string().url().optional(),
    tags: z.array(z.string()),
    publishDate: z.date(),
    isFeatured: z.boolean().default(false),
    detailDescription: z.array(z.string()).default([]).optional(),
    heroDescription: z.string().optional(),
  }),
});

export const collections = {
  'works': worksCollection,
};