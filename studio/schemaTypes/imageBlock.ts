import { defineField, defineType } from 'sanity'

export const imageBlockType = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'width',
      title: 'Display Width',
      type: 'string',
      initialValue: 'text',
      options: {
        list: [
          { title: 'Small (480px)', value: 'small' },
          { title: 'Text column (800px)', value: 'text' },
          { title: 'Medium (1000px)', value: 'medium' },
          { title: 'Large (1400px)', value: 'large' },
          { title: 'Full width', value: 'full' },
          { title: 'Custom (use field below)', value: 'custom' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'customWidth',
      title: 'Custom Width',
      description:
        'Any CSS length: 500px, 60vw, 80%, 40rem. Only used when Display Width is set to Custom.',
      type: 'string',
      hidden: ({ parent }) => parent?.width !== 'custom',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { width?: string } | undefined;
          if (parent?.width !== 'custom') return true;
          if (!value) return 'Enter a value like 500px or 60vw';
          return /^\d+(\.\d+)?(px|vw|vh|%|rem|em)$/.test(value)
            ? true
            : 'Use a CSS length like 500px, 60vw, 80%, or 40rem';
        }),
    }),
  ],
})
