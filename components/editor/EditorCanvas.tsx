$ErrorActionPreference = "Stop"

$projectRoot = "D:\Development\active\17_Photo-editor-architecture\creative-studio-full"
Set-Location $projectRoot

Write-Host "Installing Konva canvas dependencies..." -ForegroundColor Cyan
npm install konva react-konva use-image

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$targets = @(
  "components\editor\EditorCanvas.tsx",
  "components\editor\EditorToolbar.tsx",
  "app\globals.css"
)

foreach ($target in $targets) {
  if (Test-Path $target) {
    Copy-Item $target "$target.bak-$stamp"
  }
}

@'
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Text, Transformer, Image as KonvaImage, Group } from 'react-konva'
import type Konva from 'konva'
import useImage from 'use-image'
import { useEditor } from './EditorProvider'
import type { LayerRecord } from '@/lib/types'

type CanvasNode = Konva.Text | Konva.Rect | Konva.Group | Konva.Image

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function getStageSize(format: string) {
  if (format === 'story') return { width: 360, height: 640 }
  if (format === 'post') return { width: 540, height: 540 }
  return { width: 420, height: 594 }
}

function BackgroundImage({ src, width, height }: { src: string; width: number; height: number }) {
  const [image] = useImage(src, 'anonymous')

  return (
    <>
      <Rect width={width} height={height} fill="#111" />
      {image && (
        <KonvaImage
          image={image}
          width={width}
          height={height}
          listening={false}
          opacity={0.92}
        />
      )}
      <Rect
        width={width}
        height={height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: height }}
        fillLinearGradientColorStops={[0, 'rgba(0,0,0,0.04)', 1, 'rgba(0,0,0,0.46)']}
        listening={false}
      />
    </>
  )
}

function EditableCanvasLayer({
  layer,
  selected,
  stageWidth,
  stageHeight,
  onSelect,
  onChange,
}: {
  layer: LayerRecord
  selected: boolean
  stageWidth: number
  stageHeight: number
  onSelect: () => void
  onChange: (patch: Partial<LayerRecord>) => void
}) {
  const nodeRef = useRef<CanvasNode | null>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (!selected || !transformerRef.current || !nodeRef.current) return
    transformerRef.current.nodes([nodeRef.current])
    transformerRef.current.getLayer()?.batchDraw()
  }, [selected])

  const x = (layer.x / 100) * stageWidth
  const y = (layer.y / 100) * stageHeight
  const width = (layer.width / 100) * stageWidth
  const height = (layer.height / 100) * stageHeight
  const text = String(layer.data.text ?? layer.data.label ?? layer.type)

  function commitPosition(node: CanvasNode) {
    onChange({
      x: clamp((node.x() / stageWidth) * 100, 0, 98),
      y: clamp((node.y() / stageHeight) * 100, 0, 98),
    })
  }

  function commitTransform(node: CanvasNode) {
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    node.scaleX(1)
    node.scaleY(1)

    onChange({
      x: clamp((node.x() / stageWidth) * 100, 0, 98),
      y: clamp((node.y() / stageHeight) * 100, 0, 98),
      width: clamp(((width * scaleX) / stageWidth) * 100, 3, 100),
      height: clamp(((height * scaleY) / stageHeight) * 100, 3, 100),
      rotation: Math.round(node.rotation()),
    })
  }

  const common = {
    x,
    y,
    width,
    height,
    rotation: layer.rotation,
    draggable: !layer.locked,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => commitPosition(event.target as CanvasNode),
    onTransformEnd: (event: Konva.KonvaEventObject<Event>) => commitTransform(event.target as CanvasNode),
  }

  let node: React.ReactNode

  if (layer.type === 'badge') {
    node = (
      <Group ref={(nodeInstance) => { nodeRef.current = nodeInstance }} {...common}>
        <Rect width={width} height={height} fill="#ffffff" cornerRadius={18} shadowColor="black" shadowOpacity={0.12} shadowBlur={12} />
        <Text
          text={text}
          width={width}
          height={height}
          align="center"
          verticalAlign="middle"
          fill="#111111"
          fontSize={Math.max(14, height * 0.32)}
          fontStyle="bold"
        />
      </Group>
    )
  } else if (layer.type === 'logo') {
    node = (
      <Group ref={(nodeInstance) => { nodeRef.current = nodeInstance }} {...common}>
        <Rect width={width} height={height} stroke="#ffffff" dash={[8, 6]} cornerRadius={12} fill="rgba(255,255,255,0.12)" />
        <Text
          text={text}
          width={width}
          height={height}
          align="center"
          verticalAlign="middle"
          fill="#ffffff"
          fontSize={Math.max(12, height * 0.28)}
          fontStyle="bold"
        />
      </Group>
    )
  } else {
    node = (
      <Text
        ref={(nodeInstance) => { nodeRef.current = nodeInstance }}
        {...common}
        text={text}
        fill="#ffffff"
        fontSize={Math.max(18, height * 0.42)}
        fontStyle="bold"
        lineHeight={0.98}
        shadowColor="black"
        shadowOpacity={0.18}
        shadowBlur={10}
      />
    )
  }

  return (
    <>
      {node}
      {selected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          borderStroke="#ffffff"
          anchorStroke="#075f65"
          anchorFill="#ffffff"
          anchorSize={10}
          anchorCornerRadius={5}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox
            return newBox
          }}
        />
      )}
    </>
  )
}

export function EditorCanvas() {
  const { state, dispatch } = useEditor()
  const { document, copy, layers, selection } = state.present
  const stageRef = useRef<Konva.Stage>(null)
  const [zoom, setZoom] = useState(1)

  const stageSize = useMemo(() => getStageSize(document.format), [document.format])

  function updateLayer(id: string, patch: Partial<LayerRecord>) {
    dispatch({ type: 'LAYER_UPDATE', payload: { id, patch } })
  }

  function addLayer(kind: 'headline' | 'caption' | 'cta' | 'logo') {
    const defaults = {
      headline: { type: 'text' as const, text: copy.headline, x: 8, y: 58, width: 72, height: 12 },
      caption: { type: 'text' as const, text: copy.caption, x: 8, y: 72, width: 70, height: 8 },
      cta: { type: 'badge' as const, text: copy.cta, x: 8, y: 84, width: 34, height: 7 },
      logo: { type: 'logo' as const, text: 'LOGO', x: 66, y: 90, width: 28, height: 6 },
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
        data: { text: defaults.text, kind },
      },
    })
  }

  function exportPng() {
    const uri = stageRef.current?.toDataURL({ pixelRatio: 3 })
    if (!uri) return

    const link = window.document.createElement('a')
    link.download = `creative-studio-${document.format}.png`
    link.href = uri
    link.click()
  }

  return (
    <div className="editor-card canvas-editor-card">
      <div className="canvas-actions">
        <button onClick={() => addLayer('headline')}>Headline</button>
        <button onClick={() => addLayer('caption')}>Caption</button>
        <button onClick={() => addLayer('cta')}>CTA</button>
        <button onClick={() => addLayer('logo')}>Logo</button>
        <span className="canvas-spacer" />
        <button onClick={() => setZoom((value) => clamp(value - 0.1, 0.5, 1.6))}>−</button>
        <button onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
        <button onClick={() => setZoom((value) => clamp(value + 0.1, 0.5, 1.6))}>+</button>
        <button className="primary-button small-primary" onClick={exportPng}>Export PNG</button>
      </div>

      <div className="konva-stage-wrap">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          scaleX={zoom}
          scaleY={zoom}
          className="konva-stage"
          onMouseDown={(event) => {
            if (event.target === event.target.getStage()) {
              dispatch({ type: 'LAYER_SELECT', payload: null })
            }
          }}
          onTouchStart={(event) => {
            if (event.target === event.target.getStage()) {
              dispatch({ type: 'LAYER_SELECT', payload: null })
            }
          }}
        >
          <Layer>
            <BackgroundImage src={document.backgroundImage} width={stageSize.width} height={stageSize.height} />
            {layers.map((layer) =>
              layer.visible ? (
                <EditableCanvasLayer
                  key={layer.id}
                  layer={layer}
                  selected={selection.selectedLayerId === layer.id}
                  stageWidth={stageSize.width}
                  stageHeight={stageSize.height}
                  onSelect={() => dispatch({ type: 'LAYER_SELECT', payload: layer.id })}
                  onChange={(patch) => updateLayer(layer.id, patch)}
                />
              ) : null
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
