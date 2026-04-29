'use client'

import type { Dispatch } from 'react'
import type { EditorAction } from './types'

export function createInteractionController(dispatch: Dispatch<EditorAction>) {
  return {
    startDrag(layerId: string, x: number, y: number) {
      dispatch({ type: 'INTERACTION_START', payload: { layerId, kind: 'drag', x, y } })
    },
    move(x: number, y: number) {
      dispatch({ type: 'INTERACTION_MOVE', payload: { x, y } })
    },
    commit(x?: number, y?: number) {
      dispatch({ type: 'INTERACTION_COMMIT', payload: { x, y } })
    },
    cancel() {
      dispatch({ type: 'INTERACTION_CANCEL' })
    },
  }
}
