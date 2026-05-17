import React from 'react'
import type { BlockStyleProps } from 'sanity'

const SIZE_STYLE: Record<string, React.CSSProperties> = {
  small: { fontSize: '0.85em', lineHeight: 1.6, fontWeight: 400 },
  normal: { fontSize: '1em', lineHeight: 1.6, fontWeight: 400 },
  h4: { fontSize: '1.15em', lineHeight: 1.4, fontWeight: 500, margin: '0.6em 0 0.3em' },
  h3: { fontSize: '1.4em', lineHeight: 1.3, fontWeight: 500, margin: '0.7em 0 0.35em' },
  h2: { fontSize: '1.75em', lineHeight: 1.25, fontWeight: 500, margin: '0.8em 0 0.4em' },
  h1: { fontSize: '2.2em', lineHeight: 1.2, fontWeight: 600, margin: '0.9em 0 0.45em' },
}

function parse(value: string): { size: keyof typeof SIZE_STYLE; align: 'left' | 'center' | 'right' } {
  const [a, b] = value.includes('-') ? value.split('-') : [value, 'left']
  const size = (a in SIZE_STYLE ? a : 'normal') as keyof typeof SIZE_STYLE
  const align = (b === 'center' || b === 'right' ? b : 'left') as 'left' | 'center' | 'right'
  return { size, align }
}

export function StyledBlockRender(props: BlockStyleProps) {
  const value = (props.value as string) || 'normal'
  const { size, align } = parse(value)
  return (
    <div style={{ ...SIZE_STYLE[size], textAlign: align }}>{props.children}</div>
  )
}
