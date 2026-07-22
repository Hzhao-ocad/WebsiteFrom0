import { defineField, defineType } from 'sanity'
import { WordLikePortableTextInput } from '../components/WordLikePortableTextInput.tsx'
import { StyledBlockRender } from '../components/StyledBlockRender.tsx'

// "Notes" / "Field Notes" in the UI; the document type stays `post` and the
// route stays /notes/[slug]. Technical, behind-the-scenes writing that keeps
// long-tail SEO value on harryzhao.art and links to the projects it documents.
export const postType = defineType({
  name: 'post',
  title: 'Note',
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
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description:
        'One or two sentences. Used as the meta description and the card summary (aim for ~150 characters).',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          description: 'Describe the image for screen readers and search engines.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'relatedWork',
      title: 'Related Project',
      description: 'The project this note documents. Creates two-way links between the note and the work.',
      type: 'reference',
      to: [{ type: 'work' }],
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
      description: 'Add text, images, or video embeds in any order.',
      type: 'array',
      components: {
        input: WordLikePortableTextInput,
      },
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
        {
          type: 'object',
          name: 'imageGallery',
          title: 'Image Gallery',
          fields: [
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: 'caption',
                      title: 'Caption',
                      type: 'string',
                    }),
                  ],
                },
              ],
              validation: (Rule) => Rule.min(1),
            }),
          ],
        },
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed (YouTube)',
          fields: [
            defineField({
              name: 'url',
              title: 'YouTube URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', date: 'publishedAt' },
    prepare({ title, media, date }: { title: string; media: unknown; date: string }) {
      const subtitle = date ? new Date(date).toLocaleDateString() : 'Unpublished'
      return { title, media, subtitle }
    },
  },
})
