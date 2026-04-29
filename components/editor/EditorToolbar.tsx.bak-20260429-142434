'use client'

import { useEditor } from './EditorProvider'

export function EditorToolbar() {
  const { dispatch, undo, redo, canUndo, canRedo } = useEditor()

  return (
    <div className="toolbar">
      <button onClick={() => dispatch({ type: 'LAYER_ADD', payload: { id: crypto.randomUUID(), type: 'logo', x: 20, y: 20, width: 120, height: 48, rotation: 0, locked: false, visible: true, data: { label: 'YOUR LOGO' } } })}>Add logo layer</button>
      <button onClick={() => dispatch({ type: 'BRANDING_SET_ANCHOR', payload: 'bottom-right-flex' })}>Bottom-right</button>
      <button onClick={() => dispatch({ type: 'BRANDING_SET_MODE', payload: 'auto-manual' })}>Auto + manual</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  )
}
