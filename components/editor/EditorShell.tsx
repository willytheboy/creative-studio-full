'use client'

import { EditorProvider } from './EditorProvider'
import { StatusBar } from './StatusBar'
import { FormatSwitcher } from './FormatSwitcher'
import { EditorToolbar } from './EditorToolbar'
import { EditorCanvas } from './EditorCanvas'
import { LayersPanel } from './LayersPanel'
import { PromptPanel } from './PromptPanel'
import { MemoryPanel } from './MemoryPanel'

export function EditorShell() {
  return (
    <EditorProvider>
      <div className="page-grid">
        <div className="main-column">
          <StatusBar />
          <FormatSwitcher />
          <EditorToolbar />
          <EditorCanvas />
        </div>
        <div className="side-column">
          <LayersPanel />
          <PromptPanel />
          <MemoryPanel />
        </div>
      </div>
    </EditorProvider>
  )
}
