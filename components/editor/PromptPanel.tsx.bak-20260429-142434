'use client'

import { useEditor } from './EditorProvider'

export function PromptPanel() {
  const { state, dispatch } = useEditor()
  const prompt = state.present.prompt

  async function generatePrompt() {
    dispatch({ type: 'PROMPT_SET_STATUS', payload: 'loading' })
    const res = await fetch('/api/generate-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt),
    })
    const data = await res.json()
    dispatch({ type: 'PROMPT_SET_GENERATED', payload: data.prompt })
    dispatch({ type: 'PROMPT_SET_STATUS', payload: 'ready' })
  }

  return (
    <div className="panel-card">
      <h3>AI Prompt</h3>
      <label className="field"><span>Goal</span><input value={prompt.goal} onChange={(e) => dispatch({ type: 'PROMPT_SET_FIELD', payload: { key: 'goal', value: e.target.value } })} /></label>
      <label className="field"><span>Audience</span><input value={prompt.audience} onChange={(e) => dispatch({ type: 'PROMPT_SET_FIELD', payload: { key: 'audience', value: e.target.value } })} /></label>
      <label className="field"><span>Style</span><input value={prompt.style} onChange={(e) => dispatch({ type: 'PROMPT_SET_FIELD', payload: { key: 'style', value: e.target.value } })} /></label>
      <label className="field"><span>Notes</span><textarea rows={4} value={prompt.notes} onChange={(e) => dispatch({ type: 'PROMPT_SET_FIELD', payload: { key: 'notes', value: e.target.value } })} /></label>
      <button className="primary-btn" onClick={generatePrompt}>Generate prompt</button>
      <div className="output-card">{prompt.generatedPrompt || 'Generated prompt will appear here.'}</div>
    </div>
  )
}
