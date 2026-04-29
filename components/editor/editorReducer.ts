import { createHistorySnapshot } from './editorInitialState'
import type { EditorAction, EditorHistorySnapshot, EditorSessionState, UndoableEditorState } from '@/lib/types'

function restoreSnapshot(base: EditorSessionState, snapshot: EditorHistorySnapshot): EditorSessionState {
  return {
    ...base,
    document: structuredClone(snapshot.document),
    branding: structuredClone(snapshot.branding),
    copy: structuredClone(snapshot.copy),
    layers: structuredClone(snapshot.layers),
    prompt: { ...base.prompt, generatedPrompt: snapshot.prompt.generatedPrompt },
  }
}

function shouldSnapshot(action: EditorAction) {
  return [
    'DOCUMENT_SET_FORMAT',
    'DOCUMENT_SET_BACKGROUND',
    'BRANDING_SET_MODE',
    'BRANDING_SET_ANCHOR',
    'COPY_SET_HEADLINE',
    'COPY_SET_CAPTION',
    'COPY_SET_CTA',
    'LAYER_ADD',
    'LAYER_UPDATE',
    'LAYER_UPDATE_DATA',
    'LAYER_REMOVE',
    'PROMPT_SET_GENERATED',
    'INTERACTION_COMMIT',
  ].includes(action.type)
}

export function editorReducer(state: UndoableEditorState, action: EditorAction): UndoableEditorState {
  if (action.type === 'UNDO') {
    if (!state.past.length) return state
    const previous = state.past[state.past.length - 1]
    return {
      past: state.past.slice(0, -1),
      present: restoreSnapshot(state.present, previous),
      future: [createHistorySnapshot(state.present), ...state.future],
    }
  }

  if (action.type === 'REDO') {
    if (!state.future.length) return state
    const nextSnapshot = state.future[0]
    return {
      past: [...state.past, createHistorySnapshot(state.present)].slice(-100),
      present: restoreSnapshot(state.present, nextSnapshot),
      future: state.future.slice(1),
    }
  }

  const p = state.present
  let next = p

  switch (action.type) {
    case 'HYDRATE_STATE':
      next = {
        ...p,
        ...action.payload,
        ui: {
          ...p.ui,
          hydrated: true,
          autosaveStatus: p.ui.autosaveStatus,
          persistenceMode: p.ui.persistenceMode,
        },
      }
      break

    case 'DOCUMENT_SET_FORMAT':
      next = {
        ...p,
        document: {
          ...p.document,
          format: action.payload.format,
          width: action.payload.width,
          height: action.payload.height,
        },
        copy: {
          ...p.copy,
          headline: action.payload.headline,
          caption: action.payload.caption,
        },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'DOCUMENT_SET_BACKGROUND':
      next = {
        ...p,
        document: {
          ...p.document,
          backgroundImage: action.payload.backgroundImage,
          backgroundPrompt: action.payload.backgroundPrompt ?? p.document.backgroundPrompt,
        },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'BRANDING_SET_MODE':
      next = {
        ...p,
        branding: { ...p.branding, logoPlacementMode: action.payload },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'BRANDING_SET_ANCHOR':
      next = {
        ...p,
        branding: {
          ...p.branding,
          preferredAnchor: action.payload,
          appliedAnchor: action.payload,
        },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'BRANDING_APPLY_AUTO_POSITION':
      next = {
        ...p,
        branding: { ...p.branding, appliedAnchor: action.payload.appliedAnchor },
      }
      break

    case 'COPY_SET_HEADLINE':
      next = {
        ...p,
        copy: { ...p.copy, headline: action.payload },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'COPY_SET_CAPTION':
      next = {
        ...p,
        copy: { ...p.copy, caption: action.payload },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'COPY_SET_CTA':
      next = {
        ...p,
        copy: { ...p.copy, cta: action.payload },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'LAYER_ADD':
      next = {
        ...p,
        layers: [...p.layers, action.payload],
        selection: { ...p.selection, selectedLayerId: action.payload.id },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'LAYER_UPDATE':
      next = {
        ...p,
        layers: p.layers.map((layer) =>
          layer.id === action.payload.id ? { ...layer, ...action.payload.patch } : layer
        ),
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'LAYER_UPDATE_DATA':
      next = {
        ...p,
        layers: p.layers.map((layer) =>
          layer.id === action.payload.id
            ? { ...layer, data: { ...layer.data, ...action.payload.data } }
            : layer
        ),
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'LAYER_REMOVE':
      next = {
        ...p,
        layers: p.layers.filter((layer) => layer.id !== action.payload.id),
        selection: { ...p.selection, selectedLayerId: null },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'LAYER_SELECT':
      next = {
        ...p,
        selection: { ...p.selection, selectedLayerId: action.payload },
      }
      break

    case 'PROMPT_SET_FIELD':
      next = {
        ...p,
        prompt: { ...p.prompt, [action.payload.key]: action.payload.value },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'PROMPT_SET_GENERATED':
      next = {
        ...p,
        prompt: { ...p.prompt, generatedPrompt: action.payload },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'PROMPT_SET_STATUS':
      next = {
        ...p,
        prompt: { ...p.prompt, generationStatus: action.payload },
      }
      break

    case 'MEMORY_UPDATE':
      next = {
        ...p,
        memory: { ...p.memory, [action.payload.key]: action.payload.value },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'INTERACTION_START':
      next = {
        ...p,
        interaction: {
          active: true,
          kind: action.payload.kind,
          layerId: action.payload.layerId,
          originX: action.payload.x,
          originY: action.payload.y,
          currentX: action.payload.x,
          currentY: action.payload.y,
        },
      }
      break

    case 'INTERACTION_MOVE':
      next = {
        ...p,
        interaction: {
          ...p.interaction,
          currentX: action.payload.x,
          currentY: action.payload.y,
        },
      }
      break

    case 'INTERACTION_COMMIT':
      next = {
        ...p,
        interaction: {
          active: false,
          kind: 'idle',
          layerId: null,
          originX: 0,
          originY: 0,
          currentX: 0,
          currentY: 0,
        },
        ui: { ...p.ui, hasLocalEdits: true },
      }
      break

    case 'INTERACTION_CANCEL':
      next = {
        ...p,
        interaction: {
          active: false,
          kind: 'idle',
          layerId: null,
          originX: 0,
          originY: 0,
          currentX: 0,
          currentY: 0,
        },
      }
      break

    case 'UI_SET_AUTOSAVE_STATUS':
      next = { ...p, ui: { ...p.ui, autosaveStatus: action.payload } }
      break

    case 'UI_SET_PERSISTENCE_MODE':
      next = { ...p, ui: { ...p.ui, persistenceMode: action.payload } }
      break

    case 'UI_SET_LAST_SAVED':
      next = { ...p, ui: { ...p.ui, lastSavedAt: action.payload } }
      break
  }

  if (next === p) return state

  if (!shouldSnapshot(action)) {
    return {
      ...state,
      present: next,
    }
  }

  return {
    past: [...state.past, createHistorySnapshot(p)].slice(-100),
    present: next,
    future: [],
  }
}
