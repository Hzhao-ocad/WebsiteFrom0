import { defineField, defineType } from 'sanity'
import { WordLikePortableTextInput } from '../components/WordLikePortableTextInput.tsx'
import { StyledBlockRender } from '../components/StyledBlockRender.tsx'

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
      name: 'relatedWorks',
      title: 'You May Also Like',
      description: 'Other works to recommend at the bottom of this page. Leave empty to hide the section.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'work' }],
          options: {
            filter: ({ document }: { document: { _id?: string } }) => {
              const id = document?._id?.replace(/^drafts\./, '')
              return id
                ? { filter: '_id != $id && !(_id in path("drafts.**"))', params: { id } }
                : {}
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
