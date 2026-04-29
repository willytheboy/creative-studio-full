'use client'

import { useEditor } from './EditorProvider'

export function StatusBar() {
  const { state } = useEditor()
  return (
    <div className="status-bar">
      <span><strong>Persistence:</strong> {state.present.ui.persistenceMode}</span>
      <span><strong>Autosave:</strong> {state.present.ui.autosaveStatus}</span>
      <span><strong>Last saved:</strong> {state.present.ui.lastSavedAt ? new Date(state.present.ui.lastSavedAt).toLocaleTimeString() : '—'}</span>
    </div>
  )
}
