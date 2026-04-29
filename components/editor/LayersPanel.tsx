'use client'

import { useEditor } from './EditorProvider'

export function LayersPanel() {
  const { state, dispatch } = useEditor()
  return (
    <div className="panel-card">
      <h3>Layers</h3>
      <div className="stack-list">
        {state.present.layers.length === 0 && <div className="note-card">No layers yet.</div>}
        {state.present.layers.map((layer) => (
          <div key={layer.id} className="note-card row-between">
            <span>{layer.type} · {layer.id.slice(0, 6)}</span>
            <button onClick={() => dispatch({ type: 'LAYER_REMOVE', payload: { id: layer.id } })}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
