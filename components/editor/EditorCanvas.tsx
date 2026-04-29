'use client'

import { useRef } from 'react'
import { useEditor } from './EditorProvider'
import type { LayerRecord } from '@/lib/types'

function aspectRatio(width: number, height: number) {
  return `${width} / ${height}`
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function getLayerText(layer: LayerRecord) {
  return String(layer.data.text ?? layer.data.label ?? layer.type)
}

function EditableLayer({
  layer,
  selected,
  onSelect,
  onMove,
  onText,
}: {
  layer: LayerRecord
  selected: boolean
  onSelect: () => void
  onMove: (id: string, x: number, y: number) => void
  onText: (id: string, text: string) => void
}) {
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    layerX: 0,
    layerY: 0,
  })

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).isContentEditable) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      layerX: layer.x,
      layerY: layer.y,
    }
    onSelect()
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    onMove(layer.id, dragRef.current.layerX + dx / 4, dragRef.current.layerY + dy / 4)
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  if (!layer.visible) return null

  const text = getLayerText(layer)
  const src = typeof layer.data.src === 'string' ? layer.data.src : ''
  const color = typeof layer.data.color === 'string' ? layer.data.color : '#ffffff'
  const backgroundColor = typeof layer.data.backgroundColor === 'string' ? layer.data.backgroundColor : ''
  const fontFamily = typeof layer.data.fontFamily === 'string' ? layer.data.fontFamily : 'Inter, sans-serif'
  const opacity = typeof layer.data.opacity === 'number' ? layer.data.opacity : 1

  return (
    <div
      className={`editable-layer layer-${layer.type} ${selected ? 'selected-layer' : ''}`}
      style={{
        left: `${layer.x}%`,
        top: `${layer.y}%`,
        width: `${layer.width}%`,
        minHeight: `${layer.height}%`,
        transform: `rotate(${layer.rotation}deg)`,
        opacity,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onLostPointerCapture={() => {
        dragRef.current.active = false
      }}
      onClick={onSelect}
    >
      {src && (layer.type === 'logo' || layer.type === 'image') ? (
        <img className="editable-image-layer" src={src} alt={text} draggable={false} />
      ) : (
        <div
          className="editable-content"
          contentEditable
          suppressContentEditableWarning
          style={{
            color,
            backgroundColor: layer.type === 'badge' ? backgroundColor || 'rgba(255,255,255,0.92)' : backgroundColor || 'transparent',
            fontFamily,
          }}
          onBlur={(e) => onText(layer.id, e.currentTarget.innerText)}
        >
          {text}
        </div>
      )}
    </div>
  )
}

export function EditorCanvas() {
  const { state, dispatch } = useEditor()
  const { document, copy, branding, layers, selection } = state.present

  function moveLayer(id: string, x: number, y: number) {
    dispatch({
      type: 'LAYER_UPDATE',
      payload: {
        id,
        patch: {
          x: clamp(x, 0, 92),
          y: clamp(y, 0, 92),
        },
      },
    })
  }

  function updateLayerText(id: string, text: string) {
    dispatch({ type: 'LAYER_UPDATE_DATA', payload: { id, data: { text } } })
  }

  function addTextLayer(kind: 'headline' | 'caption' | 'cta' | 'logo') {
    const logoSrc = state.present.branding.logoUrl
    const defaults = {
      headline: { text: copy.headline, x: 8, y: 56, width: 62, height: 10, type: 'text' as const },
      caption: { text: copy.caption, x: 8, y: 70, width: 70, height: 8, type: 'text' as const },
      cta: { text: copy.cta, x: 8, y: 82, width: 36, height: 7, type: 'badge' as const },
      logo: { text: 'LOGO', x: 66, y: 90, width: 28, height: 6, type: 'logo' as const },
    }[kind]

    dispatch({
      type: 'LAYER_ADD',
      payload: {
        id: crypto.randomUUID(),
        type: defaults.type,
        x: defaults.x,
        y: defaults.y,
        width: defaults.width,
        height: defaults.height,
        rotation: 0,
        locked: false,
        visible: true,
        data: {
          text: defaults.text,
          kind,
          src: kind === 'logo' ? logoSrc : undefined,
          color: '#ffffff',
          backgroundColor: kind === 'cta' ? '#ffffff' : 'transparent',
          fontFamily: 'Inter, sans-serif',
          opacity: 1,
        },
      },
    })
  }

  const hasEditableLayers = layers.length > 0

  return (
    <div className="editor-card">
      <div className="canvas-actions">
        <button onClick={() => addTextLayer('headline')}>Add headline</button>
        <button onClick={() => addTextLayer('caption')}>Add caption</button>
        <button onClick={() => addTextLayer('cta')}>Add CTA</button>
        <button onClick={() => addTextLayer('logo')}>Add logo</button>
      </div>

      <div className="canvas-wrap">
        <div
          className="artboard"
          style={{
            aspectRatio: aspectRatio(document.width, document.height),
            backgroundImage: `url(${document.backgroundImage})`,
          }}
        >
          <div className="overlay" />
          <div className="format-tag">{document.format.toUpperCase()}</div>

          {!hasEditableLayers && (
            <>
              <div className="copy-block">
                <h2>{copy.headline}</h2>
                <p>{copy.caption}</p>
                <div className="cta-chip">{copy.cta}</div>
              </div>
              <div className="guide-box" />
              <div className="logo-badge">LOGO · {branding.appliedAnchor}</div>
            </>
          )}

          {layers.map((layer) => (
            <EditableLayer
              key={layer.id}
              layer={layer}
              selected={selection.selectedLayerId === layer.id}
              onSelect={() => dispatch({ type: 'LAYER_SELECT', payload: layer.id })}
              onMove={moveLayer}
              onText={updateLayerText}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
