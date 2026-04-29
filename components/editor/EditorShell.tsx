'use client'

import { EditorCanvas } from './EditorCanvas'
import { EditorToolbar } from './EditorToolbar'
import { LayersPanel } from './LayersPanel'
import { MemoryPanel } from './MemoryPanel'
import { PromptPanel } from './PromptPanel'
import { FormatSwitcher } from './FormatSwitcher'
import { StatusBar } from './StatusBar'
import { TemplatePanel } from './TemplatePanel'

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
            <TemplatePanel />
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
