export type TemplateFormat = 'story' | 'post' | 'a3'

export type CreativeTemplateLayer = {
  type: 'text' | 'badge' | 'logo'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  text: string
  kind: string
}

export type CreativeTemplate = {
  id: string
  label: string
  description: string
  category: 'offer' | 'event' | 'menu' | 'print'
  format: TemplateFormat
  width: number
  height: number
  headline: string
  caption: string
  cta: string
  promptSeed: string
  layers: CreativeTemplateLayer[]
}

export const creativeTemplates = [
  {
    id: 'restaurant-offer',
    label: 'Restaurant offer',
    description: 'Square post for limited-time dining offers.',
    category: 'offer',
    format: 'post',
    width: 1080,
    height: 1080,
    headline: 'Chef’s Special Tonight',
    caption: 'A limited-time dining offer crafted for your evening crowd.',
    cta: 'Reserve now',
    promptSeed: 'Elegant restaurant food photography, warm lighting, premium but approachable, strong space for headline.',
    layers: [
      { type: 'text', x: 8, y: 52, width: 72, height: 12, rotation: 0, text: 'Chef’s Special Tonight', kind: 'headline' },
      { type: 'text', x: 8, y: 66, width: 70, height: 8, rotation: 0, text: 'A limited-time dining offer crafted for your evening crowd.', kind: 'caption' },
      { type: 'badge', x: 8, y: 82, width: 34, height: 7, rotation: 0, text: 'Reserve now', kind: 'cta' },
      { type: 'logo', x: 68, y: 88, width: 24, height: 7, rotation: 0, text: 'LOGO', kind: 'logo' },
    ],
  },
  {
    id: 'beach-event',
    label: 'Beach event',
    description: 'Vertical story for nightlife, music, and sunset campaigns.',
    category: 'event',
    format: 'story',
    width: 1080,
    height: 1920,
    headline: 'Sunset Sessions',
    caption: 'Music, cocktails, and a golden-hour crowd by the sea.',
    cta: 'Join tonight',
    promptSeed: 'Mediterranean beach club at sunset, warm golden light, premium hospitality mood, space for story text.',
    layers: [
      { type: 'text', x: 8, y: 58, width: 76, height: 12, rotation: 0, text: 'Sunset Sessions', kind: 'headline' },
      { type: 'text', x: 8, y: 70, width: 72, height: 8, rotation: 0, text: 'Music, cocktails, and a golden-hour crowd by the sea.', kind: 'caption' },
      { type: 'badge', x: 8, y: 83, width: 34, height: 6, rotation: 0, text: 'Join tonight', kind: 'cta' },
      { type: 'logo', x: 62, y: 91, width: 30, height: 5, rotation: 0, text: 'LOGO', kind: 'logo' },
    ],
  },
  {
    id: 'menu-highlight',
    label: 'Menu highlight',
    description: 'Square food post with strong headline and CTA.',
    category: 'menu',
    format: 'post',
    width: 1080,
    height: 1080,
    headline: 'New on the Menu',
    caption: 'Fresh ingredients, bold flavors, and a plate worth posting.',
    cta: 'Try it today',
    promptSeed: 'Close-up premium dish photography, natural textures, editorial restaurant style, clean negative space.',
    layers: [
      { type: 'text', x: 7, y: 12, width: 72, height: 10, rotation: 0, text: 'New on the Menu', kind: 'headline' },
      { type: 'text', x: 7, y: 25, width: 68, height: 8, rotation: 0, text: 'Fresh ingredients, bold flavors, and a plate worth posting.', kind: 'caption' },
      { type: 'badge', x: 7, y: 78, width: 34, height: 7, rotation: 0, text: 'Try it today', kind: 'cta' },
      { type: 'logo', x: 68, y: 88, width: 24, height: 7, rotation: 0, text: 'LOGO', kind: 'logo' },
    ],
  },
  {
    id: 'a3-announcement',
    label: 'A3 announcement',
    description: 'Print-ready announcement for venues and events.',
    category: 'print',
    format: 'a3',
    width: 2480,
    height: 3508,
    headline: 'Weekend Programme',
    caption: 'A polished print-ready announcement for events, offers, and venue updates.',
    cta: 'Scan for details',
    promptSeed: 'Premium printed event poster, Mediterranean venue mood, elegant composition, clear typographic zones.',
    layers: [
      { type: 'text', x: 8, y: 12, width: 74, height: 8, rotation: 0, text: 'Weekend Programme', kind: 'headline' },
      { type: 'text', x: 8, y: 23, width: 72, height: 7, rotation: 0, text: 'A polished print-ready announcement for events, offers, and venue updates.', kind: 'caption' },
      { type: 'badge', x: 8, y: 84, width: 38, height: 5, rotation: 0, text: 'Scan for details', kind: 'cta' },
      { type: 'logo', x: 64, y: 91, width: 28, height: 4, rotation: 0, text: 'LOGO', kind: 'logo' },
    ],
  },
] as const satisfies readonly CreativeTemplate[]

export type CreativeTemplateId = (typeof creativeTemplates)[number]['id']