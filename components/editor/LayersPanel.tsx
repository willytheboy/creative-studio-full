'use client'

import { useEditor } from './EditorProvider'

export function LayersPanel() {
  const { state, dispatch } = useEditor()
  const { layers, selection } = state.present
  const selectedLayer = layers.find((layer) => layer.id === selection.selectedLayerId)

  function updateSelected(patch: Record<string, unknown>) {
    if (!selectedLayer) return
    dispatch({ type: 'LAYER_UPDATE', payload: { id: selectedLayer.id, patch } as never })
  }

  function updateSelectedData(data: Record<string, unknown>) {
    if (!selectedLayer) return
    dispatch({ type: 'LAYER_UPDATE_DATA', payload: { id: selectedLayer.id, data } as never })
  }

  return (
    <section className="side-card">
      <div className="side-card-header">
        <div>
          <p className="panel-kicker">Layers</p>
          <h2>Objects</h2>
        </div>
        <span className="count-pill">{layers.length}</span>
      </div>

      <div className="layer-list">
        {layers.length === 0 && (
          <p className="empty-note">Add text, CTA, or logo layers directly from the canvas.</p>
        )}

        {layers.map((layer, index) => (
          <button
            key={layer.id}
            className={selection.selectedLayerId === layer.id ? 'layer-row active' : 'layer-row'}
            onClick={() => dispatch({ type: 'LAYER_SELECT', payload: layer.id })}
          >
            <span className="layer-index">{index + 1}</span>
            <span>{String(layer.data.kind ?? layer.type)}</span>
            <small>{Math.round(layer.x)}, {Math.round(layer.y)}</small>
          </button>
        ))}
      </div>

      {selectedLayer && (
        <div className="properties-panel">
          <p className="panel-kicker">Properties</p>

          <label>
            Text
            <textarea
              value={String(selectedLayer.data.text ?? '')}
              onChange={(e) => updateSelectedData({ text: e.target.value })}
            />
          </label>

          <div className="property-grid">
            <label>
              X
              <input
                type="number"
                value={Math.round(selectedLayer.x)}
                onChange={(e) => updateSelected({ x: Number(e.target.value) })}
              />
            </label>
            <label>
              Y
              <input
                type="number"
                value={Math.round(selectedLayer.y)}
                onChange={(e) => updateSelected({ y: Number(e.target.value) })}
              />
            </label>
            <label>
              W
              <input
                type="number"
                value={Math.round(selectedLayer.width)}
                onChange={(e) => updateSelected({ width: Number(e.target.value) })}
              />
            </label>
            <label>
              H
              <input
                type="number"
                value={Math.round(selectedLayer.height)}
                onChange={(e) => updateSelected({ height: Number(e.target.value) })}
              />
            </label>
          </div>

          <label>
            Rotation
            <input
              type="range"
              min="-30"
              max="30"
              value={selectedLayer.rotation}
              onChange={(e) => updateSelected({ rotation: Number(e.target.value) })}
            />
          </label>

          <button
            className="danger-button"
            onClick={() => dispatch({ type: 'LAYER_REMOVE', payload: { id: selectedLayer.id } })}
          >
            Delete selected layer
          </button>
        </div>
      )}
    </section>
  )
}
