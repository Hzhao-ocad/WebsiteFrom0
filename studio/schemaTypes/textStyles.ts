import { defineField, defineType } from 'sanity'

const hex = (Rule: any) =>
  Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, {
    name: 'hex color',
    invert: false,
  }).error('Use a hex color like #ffffff, #fff, or #ffffff80 (with alpha)')

const colorField = (name: string, title: string, initialValue: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description: 'Hex color (e.g. #ffffff or #ffffffcc for alpha).',
    initialValue,
    validation: hex,
  })

export const textStylesType = defineType({
  name: 'textStyles',
  title: 'Text Styles',
  type: 'document',
  fields: [
    colorField('small', 'Small Text Color', '#bfbfbf'),
    colorField('normal', 'Normal Text Color', '#cfcfcf'),
    colorField('h4', 'Heading 4 Color', '#ffffff'),
    colorField('h3', 'Heading 3 Color', '#ffffff'),
    colorField('h2', 'Heading 2 Color', '#ffffff'),
    colorField('h1', 'Heading 1 Color', '#ffffff'),
    colorField('blockquote', 'Quote Color', '#d9d9d9'),
    colorField('link', 'Link Color', '#fbbf24'),
  ],
  preview: {
    prepare() {
      return { title: 'Text Styles' }
    },
  },
})
