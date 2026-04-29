'use client'

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { editorReducer } from './editorReducer'
import { createUndoableEditorState } from './editorInitialState'
import { storageFacade } from '@/lib/storageFacade'
import { createInteractionController } from '@/lib/interactionController'
import type { EditorAction, UndoableEditorState } from '@/lib/types'

type EditorContextValue = {
  state: UndoableEditorState
  dispatch: React.Dispatch<EditorAction>
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  interaction: ReturnType<typeof createInteractionController>
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, createUndoableEditorState())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const mode = await storageFacade.init()
      if (cancelled) return
      dispatch({ type: 'UI_SET_PERSISTENCE_MODE', payload: mode })
      const restored = await storageFacade.loadWorkspace()
      if (cancelled) return
      if (restored.memory) dispatch({ type: 'HYDRATE_STATE', payload: { memory: restored.memory } })
      if (restored.project && !state.present.ui.hasLocalEdits) dispatch({ type: 'HYDRATE_STATE', payload: restored.project })
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(async () => {
      try {
        dispatch({ type: 'UI_SET_AUTOSAVE_STATUS', payload: 'saving' })
        await Promise.all([storageFacade.saveMemory(state.present.memory), storageFacade.saveProject(state.present)])
        dispatch({ type: 'UI_SET_AUTOSAVE_STATUS', payload: 'saved' })
        dispatch({ type: 'UI_SET_LAST_SAVED', payload: new Date().toISOString() })
      } catch {
        dispatch({ type: 'UI_SET_AUTOSAVE_STATUS', payload: 'unavailable' })
      }
    }, 500)
    return () => window.clearTimeout(t)
  }, [state.present])

  const value = useMemo(() => ({
    state,
    dispatch,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    interaction: createInteractionController(dispatch),
  }), [state])

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) throw new Error('useEditor must be used within EditorProvider')
  return context
}
