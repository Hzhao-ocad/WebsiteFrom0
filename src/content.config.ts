import { defineCollection, z } from 'astro:content';

const worksCollection = defineCollection({
  type: 'content', // 支持 Markdown 或 MDX
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    // 使用 image() 可以让 Astro 自动优化本地图片
    coverImage: image(), 
    galleryImages: z.array(image()).default([]).optional(),
    previewWebm: z.string().optional(),
    videoUrl: z.string().url().optional(),
    tags: z.array(z.string()),
    publishDate: z.date(),
    isFeatured: z.boolean().default(false),
  }),
});

export const collections = {
  'works': worksCollection,
};