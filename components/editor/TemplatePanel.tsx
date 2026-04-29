'use client'

import { creativeTemplates } from '@/lib/templates'
import { useEditor } from './EditorProvider'

export function TemplatePanel() {
  const { dispatch } = useEditor()

  function applyTemplate(templateId: string) {
    const template = creativeTemplates.find((item) => item.id === templateId)
    if (!template) return

    dispatch({
      type: 'TEMPLATE_APPLY',
      payload: {
        format: template.format,
        width: template.width,
        height: template.height,
        headline: template.headline,
        caption: template.caption,
        cta: template.cta,
        layers: template.layers.map((layer) => ({
          id: crypto.randomUUID(),
          type: layer.type,
          x: layer.x,
          y: layer.y,
          width: layer.width,
          height: layer.height,
          rotation: layer.rotation,
          locked: false,
          visible: true,
          data: {
            text: layer.text,
            kind: layer.kind,
          },
        })),
      },
    })
  }

  return (
    <div className="template-list">
      {creativeTemplates.map((template) => (
        <button
          key={template.id}
          className="template-button"
          onClick={() => applyTemplate(template.id)}
          title={template.description}
        >
          <span>{template.label}</span>
          <small>{template.format.toUpperCase()} · {template.category}</small>
        </button>
      ))}
    </div>
  )
}