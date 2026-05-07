import { defineField, defineType } from 'sanity'

export const workType = defineType({
  name: 'work',
  title: 'Work',
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
      name: 'description',
      title: 'Short Description',
      description: 'Shown on the works index card.',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: 'Used as the blurred hero background and the card thumbnail.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'previewVideo',
      title: 'Preview Video (.webm)',
      description: 'Short looping video that plays on hover in the works grid.',
      type: 'file',
      options: { accept: 'video/webm,video/mp4' },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Main Video URL (YouTube)',
      description: 'If provided, shown in the hero instead of the cover image.',
      type: 'url',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      description: 'Short blurb shown in the hero when there is no main video.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      description: 'People who collaborated on this work.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'collaborator',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Website URL',
              description: 'Link to the collaborator\'s website or profile.',
              type: 'url',
            }),
          ],
          preview: {
            select: { name: 'name', url: 'url' },
            prepare({ name, url }: { name: string; url?: string }) {
              return { title: name, subtitle: url || 'No website' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Content Body',
      description: 'Add text, images, or video embeds in any order.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Sub-heading', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
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
        {
          type: 'image',
          name: 'imageBlock',
          title: 'Image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
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
          preview: {
            select: { images: 'images' },
            prepare({ images }: { images?: unknown[] }) {
              const count = images?.length ?? 0
              return { title: 'Image Gallery', subtitle: `${count} image${count === 1 ? '' : 's'}` }
            },
          },
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
          preview: {
            select: { url: 'url' },
            prepare({ url }: { url: string }) {
              return { title: 'Video Embed', subtitle: url }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', date: 'publishDate' },
    prepare({ title, media, date }: { title: string; media: unknown; date: string }) {
      return { title, media, subtitle: date }
    },
  },
})
