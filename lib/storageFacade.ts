'use client'

import { openDB } from 'idb'
import type { EditorSessionState, PersistenceMode } from './types'

const DB_NAME = 'creative-studio-local'
const DB_VERSION = 1
const STORES = {
  memory: 'memory',
  document: 'document',
  layers: 'layers',
  prompt: 'prompt',
} as const

class StorageFacade {
  private mode: PersistenceMode = 'memory-only'
  private memoryFallback: { memory: EditorSessionState['memory'] | null; project: Partial<EditorSessionState> | null } = { memory: null, project: null }

  async init(): Promise<PersistenceMode> {
    try {
      await this.db()
      this.mode = 'indexeddb'
    } catch {
      this.mode = 'memory-only'
    }
    return this.mode
  }

  private async db() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        Object.values(STORES).forEach((store) => {
          if (!db.objectStoreNames.contains(store)) db.createObjectStore(store)
        })
      },
    })
  }

  async loadWorkspace() {
    if (this.mode === 'memory-only') return { mode: this.mode, ...this.memoryFallback }
    try {
      const db = await this.db()
      const [memory, document, layers, prompt] = await Promise.all([
        db.get(STORES.memory, 'user-memory'),
        db.get(STORES.document, 'active-document'),
        db.get(STORES.layers, 'active-layers'),
        db.get(STORES.prompt, 'active-prompt'),
      ])
      return {
        mode: this.mode,
        memory: memory ?? null,
        project: document || layers || prompt ? { ...(document ?? {}), ...(layers ? { layers } : {}), ...(prompt ? { prompt } : {}) } : null,
      }
    } catch {
      this.mode = 'memory-only'
      return { mode: this.mode, ...this.memoryFallback }
    }
  }

  async saveMemory(memory: EditorSessionState['memory']) {
    if (this.mode === 'memory-only') {
      this.memoryFallback.memory = memory
      return
    }
    const db = await this.db()
    await db.put(STORES.memory, memory, 'user-memory')
  }

  async saveProject(state: EditorSessionState) {
    if (this.mode === 'memory-only') {
      this.memoryFallback.project = state
      return
    }
    const db = await this.db()
    const tx = db.transaction([STORES.document, STORES.layers, STORES.prompt], 'readwrite')
    await Promise.all([
      tx.objectStore(STORES.document).put({ document: state.document, branding: state.branding, copy: state.copy, selection: state.selection }, 'active-document'),
      tx.objectStore(STORES.layers).put(state.layers, 'active-layers'),
      tx.objectStore(STORES.prompt).put(state.prompt, 'active-prompt'),
      tx.done,
    ])
  }
}

export const storageFacade = new StorageFacade()
