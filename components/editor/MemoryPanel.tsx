'use client'

import { useEditor } from './EditorProvider'

const fields = [
  ['name', 'Name'],
  ['title', 'Title'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['address', 'Address'],
  ['instagram', 'Instagram'],
] as const

export function MemoryPanel() {
  const { state, dispatch } = useEditor()
  const memory = state.present.memory

  return (
    <section className="side-card">
      <div className="side-card-header">
        <div>
          <p className="panel-kicker">Persistent memory</p>
          <h2>Profile</h2>
        </div>
      </div>

      <div className="compact-form">
        {fields.map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              value={String(memory[key] ?? '')}
              onChange={(e) =>
                dispatch({ type: 'MEMORY_UPDATE', payload: { key, value: e.target.value } })
              }
            />
          </label>
        ))}
      </div>
    </section>
  )
}
