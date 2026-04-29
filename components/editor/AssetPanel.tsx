'use client'

import { useRef } from 'react'
import { useEditor } from './EditorProvider'

function fileToObjectUrl(file: File) {
  return URL.createObjectURL(file)
}

export function AssetPanel() {
  const { state, dispatch } = useEditor()
  const backgroundInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  function uploadBackground(file?: File) {
    if (!file) return
    const url = fileToObjectUrl(file)

    dispatch({
      type: 'DOCUMENT_SET_BACKGROUND',
      payload: {
        backgroundImage: url,
        backgroundPrompt: `Uploaded background: ${file.name}`,
      },
    })
  }

  function uploadLogo(file?: File) {
    if (!file) return
    const url = fileToObjectUrl(file)

    dispatch({
      type: 'LAYER_ADD',
      payload: {
        id: crypto.randomUUID(),
        type: 'logo',
        x: 66,
        y: 88,
        width: 26,
        height: 8,
        rotation: 0,
        locked: false,
        visible: true,
        data: {
          text: file.name,
          kind: 'logo',
          src: url,
          color: '#ffffff',
          backgroundColor: 'transparent',
          fontFamily: 'Inter, sans-serif',
          opacity: 1,
        },
      },
    })

    dispatch({ type: 'LAYER_SELECT', payload: state.present.layers[state.present.layers.length - 1]?.id ?? null })
  }

  return (
    <div className="asset-panel">
      <input
        ref={backgroundInputRef}
        className="hidden-file-input"
        type="file"
        accept="image/*"
        onChange={(event) => uploadBackground(event.target.files?.[0])}
      />

      <input
        ref={logoInputRef}
        className="hidden-file-input"
        type="file"
        accept="image/*"
        onChange={(event) => uploadLogo(event.target.files?.[0])}
      />

      <button className="template-button" onClick={() => backgroundInputRef.current?.click()}>
        <span>Upload background</span>
        <small>Photo for post, story, or A3</small>
      </button>

      <button className="template-button" onClick={() => logoInputRef.current?.click()}>
        <span>Upload logo</span>
        <small>Add as editable logo layer</small>
      </button>
    </div>
  )
}
