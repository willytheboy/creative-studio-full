'use client'

import { useEditor } from './EditorProvider'
import { formatPresets } from './editorInitialState'
import type { FormatKey } from '@/lib/types'

export function FormatSwitcher() {
  const { state, dispatch } = useEditor()

  return (
    <div className="chip-row">
      {(Object.keys(formatPresets) as FormatKey[]).map((format) => {
        const preset = formatPresets[format]
        const active = state.present.document.format === format
        return (
          <button
            key={format}
            className={active ? 'chip active-chip' : 'chip'}
            onClick={() => dispatch({ type: 'DOCUMENT_SET_FORMAT', payload: { format, width: preset.width, height: preset.height, headline: preset.headline, caption: preset.caption } })}
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
