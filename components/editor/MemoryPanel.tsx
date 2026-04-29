'use client'

import { useEditor } from './EditorProvider'

export function MemoryPanel() {
  const { state, dispatch } = useEditor()
  const memory = state.present.memory
  return (
    <div className="panel-card">
      <h3>Local memory</h3>
      {(['name','title','address','phone','email','instagram','logoBehavior'] as const).map((key) => (
        <label key={key} className="field">
          <span>{key}</span>
          <input value={memory[key]} onChange={(e) => dispatch({ type: 'MEMORY_UPDATE', payload: { key, value: e.target.value } })} />
        </label>
      ))}
    </div>
  )
}
