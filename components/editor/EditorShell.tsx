'use client'

import { EditorCanvas } from './EditorCanvas'
import { EditorToolbar } from './EditorToolbar'
import { LayersPanel } from './LayersPanel'
import { MemoryPanel } from './MemoryPanel'
import { PromptPanel } from './PromptPanel'
import { FormatSwitcher } from './FormatSwitcher'
import { StatusBar } from './StatusBar'
import { useEditor } from './EditorProvider'

type TemplateKey = 'restaurant' | 'beach' | 'menu' | 'a3'

const templates: Record<
  TemplateKey,
  {
    label: string
    format: 'story' | 'post' | 'a3'
    width: number
    height: number
    headline: string
    caption: string
    cta: string
    layers: Array<{
      type: 'text' | 'badge' | 'logo'
      x: number
      y: number
      width: number
      height: number
      rotation: number
      text: string
      kind: string
    }>
  }
> = {
  restaurant: {
    label: 'Restaurant offer',
    format: 'post',
    width: 1080,
    height: 1080,
    headline: 'Chef’s Special Tonight',
    caption: 'A limited-time dining offer crafted for your evening crowd.',
    cta: 'Reserve now',
    layers: [
      { type: 'text', x: 8, y: 52, width: 72, height: 12, rotation: 0, text: 'Chef’s Special Tonight', kind: 'headline' },
      { type: 'text', x: 8, y: 66, width: 70, height: 8, rotation: 0, text: 'A limited-time dining offer crafted for your evening crowd.', kind: 'caption' },
      { type: 'badge', x: 8, y: 82, width: 34, height: 7, rotation: 0, text: 'Reserve now', kind: 'cta' },
      { type: 'logo', x: 68, y: 88, width: 24, height: 7, rotation: 0, text: 'LOGO', kind: 'logo' },
    ],
  },
  beach: {
    label: 'Beach event',
    format: 'story',
    width: 1080,
    height: 1920,
    headline: 'Sunset Sessions',
    caption: 'Music, cocktails, and a golden-hour crowd by the sea.',
    cta: 'Join tonight',
    layers: [
      { type: 'text', x: 8, y: 58, width: 76, height: 12, rotation: 0, text: 'Sunset Sessions', kind: 'headline' },
      { type: 'text', x: 8, y: 70, width: 72, height: 8, rotation: 0, text: 'Music, cocktails, and a golden-hour crowd by the sea.', kind: 'caption' },
      { type: 'badge', x: 8, y: 83, width: 34, height: 6, rotation: 0, text: 'Join tonight', kind: 'cta' },
      { type: 'logo', x: 62, y: 91, width: 30, height: 5, rotation: 0, text: 'LOGO', kind: 'logo' },
    ],
  },
  menu: {
    label: 'Menu highlight',
    format: 'post',
    width: 1080,
    height: 1080,
    headline: 'New on the Menu',
    caption: 'Fresh ingredients, bold flavors, and a plate worth posting.',
    cta: 'Try it today',
    layers: [
      { type: 'text', x: 7, y: 12, width: 72, height: 10, rotation: 0, text: 'New on the Menu', kind: 'headline' },
      { type: 'text', x: 7, y: 25, width: 68, height: 8, rotation: 0, text: 'Fresh ingredients, bold flavors, and a plate worth posting.', kind: 'caption' },
      { type: 'badge', x: 7, y: 78, width: 34, height: 7, rotation: 0, text: 'Try it today', kind: 'cta' },
      { type: 'logo', x: 68, y: 88, width: 24, height: 7, rotation: 0, text: 'LOGO', kind: 'logo' },
    ],
  },
  a3: {
    label: 'A3 announcement',
    format: 'a3',
    width: 2480,
    height: 3508,
    headline: 'Weekend Programme',
    caption: 'A polished print-ready announcement for events, offers, and venue updates.',
    cta: 'Scan for details',
    layers: [
      { type: 'text', x: 8, y: 12, width: 74, height: 8, rotation: 0, text: 'Weekend Programme', kind: 'headline' },
      { type: 'text', x: 8, y: 23, width: 72, height: 7, rotation: 0, text: 'A polished print-ready announcement for events, offers, and venue updates.', kind: 'caption' },
      { type: 'badge', x: 8, y: 84, width: 38, height: 5, rotation: 0, text: 'Scan for details', kind: 'cta' },
      { type: 'logo', x: 64, y: 91, width: 28, height: 4, rotation: 0, text: 'LOGO', kind: 'logo' },
    ],
  },
}

function QuickTemplates() {
  const { dispatch } = useEditor()

  function applyTemplate(key: TemplateKey) {
    const template = templates[key]

    dispatch({
      type: 'TEMPLATE_APPLY',
      payload: {
        format: template.format,
        width: template.width,
        height: template.height,
        headline: template.headline,
        caption: template.caption,
        cta: template.cta,
        layers: template.layers.map((layer) => ({
          id: crypto.randomUUID(),
          type: layer.type,
          x: layer.x,
          y: layer.y,
          width: layer.width,
          height: layer.height,
          rotation: layer.rotation,
          locked: false,
          visible: true,
          data: {
            text: layer.text,
            kind: layer.kind,
          },
        })),
      },
    })
  }

  return (
    <div className="template-list">
      {(Object.keys(templates) as TemplateKey[]).map((key) => (
        <button key={key} className="template-button" onClick={() => applyTemplate(key)}>
          {templates[key].label}
        </button>
      ))}
    </div>
  )
}

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
            <QuickTemplates />
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
