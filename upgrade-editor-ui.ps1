$ErrorActionPreference = "Stop"

$projectRoot = "D:\Development\active\17_Photo-editor-architecture\creative-studio-full"
Set-Location $projectRoot

Write-Host "Upgrading editor UI..." -ForegroundColor Cyan

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$files = @(
  "components\editor\EditorShell.tsx",
  "components\editor\EditorToolbar.tsx",
  "components\editor\LayersPanel.tsx",
  "components\editor\MemoryPanel.tsx",
  "components\editor\PromptPanel.tsx",
  "app\page.tsx",
  "app\globals.css"
)

foreach ($file in $files) {
  $path = Join-Path $projectRoot $file
  if (Test-Path $path) {
    Copy-Item $path "$path.bak-$stamp"
  }
}

@"
'use client'

import { EditorCanvas } from './EditorCanvas'
import { EditorToolbar } from './EditorToolbar'
import { LayersPanel } from './LayersPanel'
import { MemoryPanel } from './MemoryPanel'
import { PromptPanel } from './PromptPanel'
import { FormatSwitcher } from './FormatSwitcher'
import { StatusBar } from './StatusBar'

export function EditorShell() {
  return (
    <main className="studio-shell">
      <EditorToolbar />

      <section className="studio-workspace" aria-label="Creative Studio workspace">
        <aside className="studio-left-panel" aria-label="Design tools">
          <div className="panel-section">
            <p className="panel-kicker">Formats</p>
            <FormatSwitcher />
          </div>

          <div className="panel-section">
            <p className="panel-kicker">Quick templates</p>
            <button className="template-button">Restaurant offer</button>
            <button className="template-button">Beach event</button>
            <button className="template-button">Menu highlight</button>
            <button className="template-button">A3 announcement</button>
          </div>

          <div className="panel-section">
            <p className="panel-kicker">Workflow</p>
            <StatusBar />
          </div>
        </aside>

        <section className="studio-stage" aria-label="Canvas area">
          <EditorCanvas />
        </section>

        <aside className="studio-right-panel" aria-label="Editor controls">
          <LayersPanel />
          <PromptPanel />
          <MemoryPanel />
        </aside>
      </section>
    </main>
  )
}
"@ | Set-Content ".\components\editor\EditorShell.tsx" -Encoding UTF8

@"
'use client'

import { useEditor } from './EditorProvider'

export function EditorToolbar() {
  const { state, dispatch } = useEditor()
  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0
  const { document } = state.present

  return (
    <header className="studio-topbar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">CS</div>
        <div>
          <p className="brand-title">Creative Studio</p>
          <p className="brand-subtitle">{document.format.toUpperCase()} · {document.width} × {document.height}</p>
        </div>
      </div>

      <div className="toolbar-group" role="group" aria-label="History controls">
        <button className="ghost-button" disabled={!canUndo} onClick={() => dispatch({ type: 'UNDO' })}>Undo</button>
        <button className="ghost-button" disabled={!canRedo} onClick={() => dispatch({ type: 'REDO' })}>Redo</button>
      </div>

      <div className="toolbar-group toolbar-push">
        <button className="ghost-button">Preview</button>
        <button className="primary-button">Export</button>
      </div>
    </header>
  )
}
"@ | Set-Content ".\components\editor\EditorToolbar.tsx" -Encoding UTF8

@"
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
"@ | Set-Content ".\components\editor\LayersPanel.tsx" -Encoding UTF8

@"
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
"@ | Set-Content ".\components\editor\MemoryPanel.tsx" -Encoding UTF8

@"
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
"@ | Set-Content ".\components\editor\PromptPanel.tsx" -Encoding UTF8

@"
import { EditorProvider } from '@/components/editor/EditorProvider'
import { EditorShell } from '@/components/editor/EditorShell'

export default function Home() {
  return (
    <EditorProvider>
      <EditorShell />
    </EditorProvider>
  )
}
"@ | Set-Content ".\app\page.tsx" -Encoding UTF8

@"
:root {
  --bg: #f3f0ea;
  --surface: #fbfaf7;
  --surface2: #f1eee7;
  --surface3: #e8e3d8;
  --text: #201d18;
  --muted: #716c62;
  --border: rgba(32, 29, 24, 0.12);
  --primary: #075f65;
  --primary2: #0b7880;
  --danger: #9f2f2f;
  --shadow: 0 18px 50px rgba(39, 31, 20, 0.12);
}

* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.studio-shell {
  height: 100vh;
  display: grid;
  grid-template-rows: 64px 1fr;
  overflow: hidden;
}

.studio-topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 18px;
  background: rgba(251, 250, 247, 0.88);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--text);
  color: white;
  font-weight: 800;
  letter-spacing: -0.06em;
}

.brand-title,
.brand-subtitle,
.panel-kicker {
  margin: 0;
}

.brand-title {
  font-weight: 800;
}

.brand-subtitle,
.panel-kicker,
.empty-note,
.layer-row small {
  color: var(--muted);
  font-size: 12px;
}

.panel-kicker {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
}

.toolbar-group {
  display: flex;
  gap: 8px;
}

.toolbar-push {
  margin-left: auto;
}

.primary-button,
.ghost-button,
.template-button,
.danger-button {
  min-height: 38px;
  border-radius: 12px;
  padding: 0 14px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.primary-button {
  background: var(--primary);
  color: white;
  border-color: transparent;
}

.primary-button:hover {
  background: var(--primary2);
}

.danger-button {
  width: 100%;
  background: rgba(159, 47, 47, 0.08);
  color: var(--danger);
}

.full-width {
  width: 100%;
}

.studio-workspace {
  min-height: 0;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 360px;
}

.studio-left-panel,
.studio-right-panel {
  min-height: 0;
  overflow: auto;
  padding: 14px;
  border-right: 1px solid var(--border);
  background: rgba(251, 250, 247, 0.62);
}

.studio-right-panel {
  border-right: 0;
  border-left: 1px solid var(--border);
}

.studio-stage {
  min-width: 0;
  min-height: 0;
  display: grid;
  place-items: center;
  padding: 28px;
  background:
    radial-gradient(circle at top left, rgba(7, 95, 101, 0.12), transparent 30%),
    linear-gradient(135deg, #eee9df, #f7f4ed);
  overflow: auto;
}

.panel-section,
.side-card,
.editor-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 1px 0 rgba(255,255,255,0.7);
}

.panel-section {
  padding: 14px;
  margin-bottom: 12px;
}

.side-card {
  padding: 14px;
  margin-bottom: 12px;
}

.side-card h2 {
  margin: 2px 0 0;
  font-size: 17px;
}

.side-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.count-pill {
  min-width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--surface2);
  color: var(--muted);
  font-weight: 800;
  font-size: 12px;
}

.template-button {
  width: 100%;
  justify-content: flex-start;
  margin-top: 8px;
  text-align: left;
  background: var(--surface2);
}

.editor-card {
  width: min(86vw, 860px);
  padding: 14px;
  box-shadow: var(--shadow);
}

.canvas-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.canvas-actions button {
  min-height: 36px;
  border-radius: 999px;
  padding: 0 12px;
  border: 1px solid var(--border);
  background: var(--surface2);
}

.canvas-wrap {
  display: grid;
  place-items: center;
}

.artboard {
  width: min(100%, 560px);
  max-height: calc(100vh - 170px);
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 22px 80px rgba(0, 0, 0, 0.22);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.42));
  pointer-events: none;
}

.format-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 3;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.88);
  color: #111;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.copy-block {
  position: absolute;
  left: 8%;
  bottom: 10%;
  z-index: 3;
  color: white;
  max-width: 70%;
}

.copy-block h2 {
  margin: 0 0 8px;
  font-size: clamp(28px, 4vw, 54px);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.copy-block p {
  margin: 0 0 12px;
  font-weight: 600;
}

.cta-chip,
.logo-badge {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: white;
  color: #111;
  font-weight: 800;
}

.logo-badge {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 3;
  font-size: 12px;
}

.guide-box {
  position: absolute;
  inset: 6%;
  border: 1px dashed rgba(255,255,255,0.28);
  border-radius: 18px;
  pointer-events: none;
}

.editable-layer {
  position: absolute;
  z-index: 4;
  cursor: grab;
  touch-action: none;
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 16px;
  color: white;
  background: rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(8px);
  padding: 8px;
}

.editable-layer:active {
  cursor: grabbing;
}

.selected-layer {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}

.editable-content {
  min-height: 28px;
  outline: none;
  white-space: pre-wrap;
}

.layer-text .editable-content {
  font-size: clamp(18px, 3vw, 38px);
  font-weight: 850;
  line-height: 1.05;
}

.layer-badge {
  background: white;
  color: #111;
}

.layer-badge .editable-content {
  font-weight: 800;
  text-align: center;
}

.layer-logo {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  border-style: dashed;
}

.layer-logo .editable-content {
  text-align: center;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.layer-list {
  display: grid;
  gap: 8px;
}

.layer-row {
  width: 100%;
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface2);
  text-align: left;
}

.layer-row.active {
  background: rgba(7, 95, 101, 0.1);
  border-color: rgba(7, 95, 101, 0.28);
}

.layer-index {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.properties-panel {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.compact-form,
.properties-panel {
  display: grid;
  gap: 10px;
}

.compact-form label,
.properties-panel label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.compact-form input,
.compact-form textarea,
.properties-panel input,
.properties-panel textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface2);
  color: var(--text);
  padding: 10px;
  outline: none;
  text-transform: none;
  letter-spacing: 0;
  font-size: 14px;
  font-weight: 500;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.prompt-output {
  padding: 12px;
  border-radius: 12px;
  background: var(--surface2);
  color: var(--text);
  font-size: 13px;
  line-height: 1.45;
}

@media (max-width: 1100px) {
  .studio-workspace {
    grid-template-columns: 1fr;
    overflow: auto;
  }

  .studio-left-panel,
  .studio-right-panel {
    border: 0;
  }

  .studio-shell {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .studio-topbar {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .studio-stage {
    min-height: 70vh;
  }
}
"@ | Set-Content ".\app\globals.css" -Encoding UTF8

Write-Host "Running build..." -ForegroundColor Cyan
npm run build

Write-Host "Checking Git changes..." -ForegroundColor Cyan
git status

$changes = git status --porcelain
if ($changes) {
  git add .
  git commit -m "Upgrade editor workspace UI"
  git push
  Write-Host "Upgrade committed and pushed." -ForegroundColor Green
} else {
  Write-Host "No changes to commit." -ForegroundColor Yellow
}

Write-Host "Done. Run: npm run dev" -ForegroundColor Green
