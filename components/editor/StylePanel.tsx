'use client'

import { useMemo } from 'react'
import { useEditor } from './EditorProvider'

const fonts = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Trebuchet', value: 'Trebuchet MS, sans-serif' },
  { label: 'Courier', value: 'Courier New, monospace' },
  { label: 'Impact', value: 'Impact, sans-serif' },
]

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === 'number' ? value : fallback
}

export function StylePanel() {
  const { state, dispatch } = useEditor()
  const selectedLayerId = state.present.selection.selectedLayerId

  const layer = useMemo(
    () => state.present.layers.find((item) => item.id === selectedLayerId),
    [state.present.layers, selectedLayerId],
  )

  if (!layer) {
    return (
      <section className="side-card">
        <div className="side-card-header">
          <div>
            <p className="panel-kicker">Style</p>
            <h2>No layer selected</h2>
          </div>
        </div>
        <p className="muted-panel-copy">Select a text, badge, or logo layer to edit its style.</p>
      </section>
    )
  }

  function updateData(data: Record<string, unknown>) {
    if (!layer) return
    dispatch({ type: 'LAYER_UPDATE_DATA', payload: { id: layer.id, data } })
  }

  function updateLayer(patch: Record<string, unknown>) {
    if (!layer) return
    dispatch({ type: 'LAYER_UPDATE', payload: { id: layer.id, patch } })
  }

  const text = asString(layer.data.text, '')
  const color = asString(layer.data.color, '#ffffff')
  const backgroundColor = asString(layer.data.backgroundColor, '#ffffff')
  const fontFamily = asString(layer.data.fontFamily, 'Inter, sans-serif')
  const opacity = asNumber(layer.data.opacity, 1)

  return (
    <section className="side-card">
      <div className="side-card-header">
        <div>
          <p className="panel-kicker">Style</p>
          <h2>{layer.type} layer</h2>
        </div>
      </div>

      <div className="compact-form">
        <label>
          Text
          <textarea value={text} onChange={(event) => updateData({ text: event.target.value })} />
        </label>

        <label>
          Font
          <select value={fontFamily} onChange={(event) => updateData({ fontFamily: event.target.value })}>
            {fonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </label>

        <div className="two-field-grid">
          <label>
            Text color
            <input type="color" value={color} onChange={(event) => updateData({ color: event.target.value })} />
          </label>

          <label>
            Fill color
            <input type="color" value={backgroundColor} onChange={(event) => updateData({ backgroundColor: event.target.value })} />
          </label>
        </div>

        <label>
          Opacity
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(event) => updateData({ opacity: Number(event.target.value) })}
          />
        </label>

        <div className="two-field-grid">
          <label>
            Width
            <input type="number" value={layer.width} onChange={(event) => updateLayer({ width: Number(event.target.value) })} />
          </label>

          <label>
            Height
            <input type="number" value={layer.height} onChange={(event) => updateLayer({ height: Number(event.target.value) })} />
          </label>
        </div>

        <div className="two-field-grid">
          <label>
            X
            <input type="number" value={layer.x} onChange={(event) => updateLayer({ x: Number(event.target.value) })} />
          </label>

          <label>
            Y
            <input type="number" value={layer.y} onChange={(event) => updateLayer({ y: Number(event.target.value) })} />
          </label>
        </div>

        <label>
          Rotation
          <input type="number" value={layer.rotation} onChange={(event) => updateLayer({ rotation: Number(event.target.value) })} />
        </label>
      </div>
    </section>
  )
}
