'use client'

import { useEditor } from './EditorProvider'

export function EditorToolbar() {
  const { state, dispatch } = useEditor()
  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0
  const { document, layers } = state.present

  return (
    <header className="studio-topbar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">CS</div>
        <div>
          <p className="brand-title">Creative Studio Pro</p>
          <p className="brand-subtitle">{document.format.toUpperCase()} · {layers.length} layers · canvas export</p>
        </div>
      </div>

      <div className="toolbar-group" role="group" aria-label="History controls">
        <button className="ghost-button" disabled={!canUndo} onClick={() => dispatch({ type: 'UNDO' })}>Undo</button>
        <button className="ghost-button" disabled={!canRedo} onClick={() => dispatch({ type: 'REDO' })}>Redo</button>
      </div>

      <div className="toolbar-group toolbar-push">
        <button className="ghost-button">Templates</button>
        <button className="primary-button">Publish-ready</button>
      </div>
    </header>
  )
}
