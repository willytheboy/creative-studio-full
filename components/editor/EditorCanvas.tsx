'use client'

import { useEditor } from './EditorProvider'

function aspectRatio(width: number, height: number) {
  return `${width} / ${height}`
}

export function EditorCanvas() {
  const { state } = useEditor()
  const { document, copy, branding, layers } = state.present

  return (
    <div className="editor-card">
      <div className="canvas-wrap">
        <div className="artboard" style={{ aspectRatio: aspectRatio(document.width, document.height), backgroundImage: `url(${document.backgroundImage})` }}>
          <div className="overlay" />
          <div className="format-tag">{document.format.toUpperCase()}</div>
          <div className="copy-block">
            <h2>{copy.headline}</h2>
            <p>{copy.caption}</p>
            <div className="cta-chip">{copy.cta}</div>
          </div>
          <div className="guide-box" />
          <div className="logo-badge">LOGO · {branding.appliedAnchor}</div>
          {layers.map((layer) => (
            <div key={layer.id} className="layer-pill">{layer.type}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
