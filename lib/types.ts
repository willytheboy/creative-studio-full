export type FormatKey = 'story' | 'post' | 'a3'
export type LayerType = 'image' | 'logo' | 'text' | 'badge'
export type PersistenceMode = 'indexeddb' | 'memory-only'
export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'unavailable'
export type GenerationStatus = 'idle' | 'loading' | 'ready' | 'error'

export type LayerRecord = {
  id: string
  type: LayerType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  locked: boolean
  visible: boolean
  data: Record<string, unknown>
}

export type EditorSessionState = {
  document: {
    id: string
    format: FormatKey
    width: number
    height: number
    backgroundImage: string
    backgroundPrompt: string
  }
  branding: {
    logoUrl: string
    logoPlacementMode: 'auto-manual' | 'manual-only' | 'auto-only'
    preferredAnchor: 'bottom-right-flex' | 'bottom-left' | 'top-right' | 'top-left'
    appliedAnchor: string
    opacity: number
    scale: number
    safePadding: number
  }
  copy: {
    headline: string
    caption: string
    cta: string
  }
  selection: {
    selectedLayerId: string | null
    selectedPanel: 'canvas' | 'properties' | 'layers' | 'prompt' | 'memory'
  }
  layers: LayerRecord[]
  prompt: {
    goal: string
    audience: string
    style: string
    notes: string
    generatedPrompt: string
    generationStatus: GenerationStatus
  }
  memory: {
    name: string
    title: string
    address: string
    phone: string
    email: string
    instagram: string
    logoBehavior: string
  }
  interaction: {
    active: boolean
    kind: 'idle' | 'drag' | 'resize' | 'rotate'
    layerId: string | null
    originX: number
    originY: number
    currentX: number
    currentY: number
  }
  ui: {
    autosaveStatus: AutosaveStatus
    persistenceMode: PersistenceMode
    lastSavedAt: string | null
    hydrated: boolean
    hasLocalEdits: boolean
  }
}

export type EditorHistorySnapshot = {
  document: EditorSessionState['document']
  branding: EditorSessionState['branding']
  copy: EditorSessionState['copy']
  layers: EditorSessionState['layers']
  prompt: Pick<EditorSessionState['prompt'], 'generatedPrompt'>
}

export type UndoableEditorState = {
  past: EditorHistorySnapshot[]
  present: EditorSessionState
  future: EditorHistorySnapshot[]
}

export type EditorAction =
  | { type: 'HYDRATE_STATE'; payload: Partial<EditorSessionState> }
  | { type: 'DOCUMENT_SET_FORMAT'; payload: { format: FormatKey; width: number; height: number; headline: string; caption: string } }
  | { type: 'DOCUMENT_SET_BACKGROUND'; payload: { backgroundImage: string; backgroundPrompt?: string } }
  | { type: 'BRANDING_SET_MODE'; payload: EditorSessionState['branding']['logoPlacementMode'] }
  | { type: 'BRANDING_SET_ANCHOR'; payload: EditorSessionState['branding']['preferredAnchor'] }
  | { type: 'BRANDING_APPLY_AUTO_POSITION'; payload: { appliedAnchor: string } }
  | { type: 'COPY_SET_HEADLINE'; payload: string }
  | { type: 'COPY_SET_CAPTION'; payload: string }
  | { type: 'COPY_SET_CTA'; payload: string }
  | { type: 'LAYER_ADD'; payload: LayerRecord }
  | { type: 'LAYER_REMOVE'; payload: { id: string } }
  | { type: 'LAYER_SELECT'; payload: string | null }
  | { type: 'PROMPT_SET_FIELD'; payload: { key: 'goal' | 'audience' | 'style' | 'notes'; value: string } }
  | { type: 'PROMPT_SET_GENERATED'; payload: string }
  | { type: 'PROMPT_SET_STATUS'; payload: GenerationStatus }
  | { type: 'MEMORY_UPDATE'; payload: { key: keyof EditorSessionState['memory']; value: string } }
  | { type: 'INTERACTION_START'; payload: { layerId: string; kind: 'drag'; x: number; y: number } }
  | { type: 'INTERACTION_MOVE'; payload: { x: number; y: number } }
  | { type: 'INTERACTION_COMMIT'; payload?: { x?: number; y?: number } }
  | { type: 'INTERACTION_CANCEL' }
  | { type: 'UI_SET_AUTOSAVE_STATUS'; payload: AutosaveStatus }
  | { type: 'UI_SET_PERSISTENCE_MODE'; payload: PersistenceMode }
  | { type: 'UI_SET_LAST_SAVED'; payload: string | null }
  | { type: 'UNDO' }
  | { type: 'REDO' }
