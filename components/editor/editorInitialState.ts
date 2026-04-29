import type { EditorHistorySnapshot, EditorSessionState, FormatKey, UndoableEditorState } from '@/lib/types'

export const formatPresets: Record<FormatKey, { width: number; height: number; label: string; headline: string; caption: string }> = {
  story: { width: 1080, height: 1920, label: 'Instagram Story', headline: 'Sunset dinner offer', caption: 'Vertical layout protecting the lower-right watermark zone.' },
  post: { width: 1080, height: 1080, label: 'Instagram Post', headline: 'Chef special tonight', caption: 'Square post with flexible lower-right branding.' },
  a3: { width: 3508, height: 4961, label: 'A3 Print', headline: 'Weekend brunch menu', caption: 'Poster layout with lower-right branding inside print-safe margins.' },
}

export function createEditorSession(format: FormatKey = 'story'): EditorSessionState {
  const preset = formatPresets[format]
  return {
    document: {
      id: crypto.randomUUID(),
      format,
      width: preset.width,
      height: preset.height,
      backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      backgroundPrompt: '',
    },
    branding: {
      logoUrl: '',
      logoPlacementMode: 'auto-manual',
      preferredAnchor: 'bottom-right-flex',
      appliedAnchor: 'bottom-right-flex',
      opacity: 0.82,
      scale: 1,
      safePadding: 20,
    },
    copy: { headline: preset.headline, caption: preset.caption, cta: 'Reserve now' },
    selection: { selectedLayerId: null, selectedPanel: 'canvas' },
    layers: [],
    prompt: {
      goal: 'Promote a weekend seafood dinner',
      audience: 'Young professionals and couples',
      style: 'Cinematic',
      notes: 'Leave safe empty space for the bottom-right watermark area.',
      generatedPrompt: '',
      generationStatus: 'idle',
    },
    memory: {
      name: '',
      title: '',
      address: '',
      phone: '',
      email: '',
      instagram: '',
      logoBehavior: 'Bottom-right default, flexible across sizes, manual override enabled',
    },
    interaction: { active: false, kind: 'idle', layerId: null, originX: 0, originY: 0, currentX: 0, currentY: 0 },
    ui: { autosaveStatus: 'idle', persistenceMode: 'memory-only', lastSavedAt: null, hydrated: false, hasLocalEdits: false },
  }
}

export function createHistorySnapshot(state: EditorSessionState): EditorHistorySnapshot {
  return {
    document: structuredClone(state.document),
    branding: structuredClone(state.branding),
    copy: structuredClone(state.copy),
    layers: structuredClone(state.layers),
    prompt: { generatedPrompt: state.prompt.generatedPrompt },
  }
}

export function createUndoableEditorState(format: FormatKey = 'story'): UndoableEditorState {
  return { past: [], present: createEditorSession(format), future: [] }
}
