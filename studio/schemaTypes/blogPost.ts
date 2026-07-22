import { defineField, defineType } from 'sanity'
import { StyledBlockRender } from '../components/StyledBlockRender.tsx'

export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      description: 'Main image for the blog post. Used as thumbnail on listing and hero on detail page.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short summary shown on the blog index page (max 300 characters).',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'body',
      title: 'Content Body',
      description: 'Add text and images in any order.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal', component: StyledBlockRender },
            { title: 'Normal Center', value: 'normal-center', component: StyledBlockRender },
            { title: 'Normal Right', value: 'normal-right', component: StyledBlockRender },
            { title: 'Heading 1', value: 'h1', component: StyledBlockRender },
            { title: 'Heading 1 Center', value: 'h1-center', component: StyledBlockRender },
            { title: 'Heading 1 Right', value: 'h1-right', component: StyledBlockRender },
            { title: 'Heading 2', value: 'h2', component: StyledBlockRender },
            { title: 'Heading 2 Center', value: 'h2-center', component: StyledBlockRender },
            { title: 'Heading 2 Right', value: 'h2-right', component: StyledBlockRender },
            { title: 'Heading 3', value: 'h3', component: StyledBlockRender },
            { title: 'Heading 3 Center', value: 'h3-center', component: StyledBlockRender },
            { title: 'Heading 3 Right', value: 'h3-right', component: StyledBlockRender },
            { title: 'Heading 4', value: 'h4', component: StyledBlockRender },
            { title: 'Heading 4 Center', value: 'h4-center', component: StyledBlockRender },
            { title: 'Heading 4 Right', value: 'h4-right', component: StyledBlockRender },
            { title: 'Small', value: 'small', component: StyledBlockRender },
            { title: 'Small Center', value: 'small-center', component: StyledBlockRender },
            { title: 'Small Right', value: 'small-right', component: StyledBlockRender },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        { type: 'imageBlock' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishDate',
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }: { title: string; subtitle: string; media: any }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Publish Date, New',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
  ],
})
