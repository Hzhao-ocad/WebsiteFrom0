import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schemaTypes'

const PREVIEW_ORIGIN =
  process.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:4321'

const SINGLETON_TYPES = new Set(['textStyles'])
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'harry-zhao-portfolio',
  title: 'Harry Zhao Portfolio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Text Styles')
              .id('textStyles')
              .child(
                S.editor()
                  .id('textStyles')
                  .schemaType('textStyles')
                  .documentId('textStyles')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETON_TYPES.has(item.getId() ?? '')
            ),
          ]),
    }),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: PREVIEW_ORIGIN,
        preview: '/',
      },
      resolve: {
        locations: {
          work: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    {
                      title: (doc.title as string) ?? 'Untitled',
                      href: `/works/${doc.slug}?preview=1`,
                    },
                  ]
                : [],
            }),
          },
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : input,
  },
})
