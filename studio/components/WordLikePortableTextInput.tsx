import React from 'react'
import { type PortableTextInputProps } from 'sanity'
import { PortableTextEditor } from '@portabletext/editor'
import { Button, Card, Flex, Select, Text } from '@sanity/ui'

type PortableTextBlock = {
  _key?: string
  style?: string
}

const ALIGNMENTS = ['left', 'center', 'right'] as const
type Align = (typeof ALIGNMENTS)[number]

const FONT_STEPS = ['small', 'normal', 'h4', 'h3', 'h2', 'h1'] as const
type Size = (typeof FONT_STEPS)[number]

const SIZE_OPTIONS: { value: Size; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h1', label: 'Heading 1' },
]

function getSelectedBlock(
  value: PortableTextBlock[] | undefined,
  editor: PortableTextEditor | null
) {
  if (!value || value.length === 0 || !editor) return null
  const selection = PortableTextEditor.getSelection(editor)
  const path = selection?.focus?.path ?? []
  const keyItem = path.find(
    (segment) => typeof segment === 'object' && segment !== null && '_key' in segment
  ) as { _key?: string } | undefined
  const blockKey = keyItem?._key
  if (!blockKey) return null
  return (value as PortableTextBlock[]).find((block) => block?._key === blockKey) ?? null
}

function parseStyle(style: string | undefined): { size: Size; align: Align } {
  if (!style) return { size: 'normal', align: 'left' }
  if (style.includes('-')) {
    const [size, align] = style.split('-')
    if ((ALIGNMENTS as readonly string[]).includes(align)) {
      return {
        size: ((FONT_STEPS as readonly string[]).includes(size) ? size : 'normal') as Size,
        align: align as Align,
      }
    }
  }
  return {
    size: ((FONT_STEPS as readonly string[]).includes(style) ? style : 'normal') as Size,
    align: 'left',
  }
}

function makeStyle(size: Size, align: Align): string {
  return align === 'left' ? size : `${size}-${align}`
}

export function WordLikePortableTextInput(props: PortableTextInputProps) {
  const editorRef = React.useRef<PortableTextEditor | null>(null)
  const [, setEditorTick] = React.useState(0)
  const editor = editorRef.current
  const currentBlock = getSelectedBlock(props.value as PortableTextBlock[], editor)
  const { size: currentSize, align: currentAlign } = parseStyle(currentBlock?.style)

  const handleEditorChange = React.useCallback(
    (change: unknown, nextEditor: PortableTextEditor) => {
      props.onEditorChange?.(change as never, nextEditor)
      setEditorTick((tick) => tick + 1)
    },
    [props]
  )

  const applyStyle = (size: Size, align: Align) => {
    if (!editor) return
    PortableTextEditor.focus(editor)
    PortableTextEditor.toggleBlockStyle(editor, makeStyle(size, align))
  }

  const setAlign = (align: Align) => applyStyle(currentSize, align)
  const setSize = (size: Size) => applyStyle(size, currentAlign)

  return (
    <Card padding={2} radius={2} border style={{ marginBottom: 8 }}>
      <Flex gap={3} align="center" wrap="wrap">
        <Flex gap={1} align="center">
          <Text size={1} muted style={{ marginRight: 6 }}>
            Size
          </Text>
          <Select
            value={currentSize}
            onChange={(event) => setSize(event.currentTarget.value as Size)}
            disabled={!editor}
            fontSize={1}
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Flex>

        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--card-border-color)' }} />

        <Flex gap={1} align="center">
          <Text size={1} muted style={{ marginRight: 6 }}>
            Align
          </Text>
          <Button
            type="button"
            text="Left"
            mode={currentAlign === 'left' ? 'default' : 'ghost'}
            tone={currentAlign === 'left' ? 'primary' : 'default'}
            onClick={() => setAlign('left')}
            disabled={!editor}
            title="Align left"
          />
          <Button
            type="button"
            text="Center"
            mode={currentAlign === 'center' ? 'default' : 'ghost'}
            tone={currentAlign === 'center' ? 'primary' : 'default'}
            onClick={() => setAlign('center')}
            disabled={!editor}
            title="Align center"
          />
          <Button
            type="button"
            text="Right"
            mode={currentAlign === 'right' ? 'default' : 'ghost'}
            tone={currentAlign === 'right' ? 'primary' : 'default'}
            onClick={() => setAlign('right')}
            disabled={!editor}
            title="Align right"
          />
        </Flex>
      </Flex>
      <div style={{ marginTop: 8 }}>
        {props.renderDefault({
          ...props,
          editorRef,
          onEditorChange: handleEditorChange,
        })}
      </div>
    </Card>
  )
}
