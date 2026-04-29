'use client'

import { useState } from 'react'
import { useEditor } from './EditorProvider'

export function PromptPanel() {
  const { state, dispatch } = useEditor()
  const { prompt, copy, document } = state.present
  const [busy, setBusy] = useState(false)

  async function generatePrompt() {
    setBusy(true)
    dispatch({ type: 'PROMPT_SET_STATUS', payload: 'generating' })

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: prompt.brief,
          tone: prompt.tone,
          audience: prompt.audience,
          format: document.format,
          headline: copy.headline,
          caption: copy.caption,
        }),
      })

      const data = await response.json()
      dispatch({ type: 'PROMPT_SET_GENERATED', payload: data.prompt ?? 'No prompt generated.' })
      dispatch({ type: 'PROMPT_SET_STATUS', payload: 'idle' })
    } catch {
      dispatch({ type: 'PROMPT_SET_GENERATED', payload: 'Prompt generation failed. Try again.' })
      dispatch({ type: 'PROMPT_SET_STATUS', payload: 'error' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="side-card">
      <div className="side-card-header">
        <div>
          <p className="panel-kicker">AI assistant</p>
          <h2>Prompt</h2>
        </div>
      </div>

      <div className="compact-form">
        <label>
          Brief
          <textarea
            value={prompt.brief}
            onChange={(e) =>
              dispatch({ type: 'PROMPT_SET_FIELD', payload: { key: 'brief', value: e.target.value } })
            }
          />
        </label>

        <label>
          Tone
          <input
            value={prompt.tone}
            onChange={(e) =>
              dispatch({ type: 'PROMPT_SET_FIELD', payload: { key: 'tone', value: e.target.value } })
            }
          />
        </label>

        <label>
          Audience
          <input
            value={prompt.audience}
            onChange={(e) =>
              dispatch({ type: 'PROMPT_SET_FIELD', payload: { key: 'audience', value: e.target.value } })
            }
          />
        </label>

        <button className="primary-button full-width" disabled={busy} onClick={generatePrompt}>
          {busy ? 'Generating...' : 'Generate prompt'}
        </button>

        {prompt.generatedPrompt && (
          <div className="prompt-output">{prompt.generatedPrompt}</div>
        )}
      </div>
    </section>
  )
}
