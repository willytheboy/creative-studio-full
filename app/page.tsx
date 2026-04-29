import { EditorShell } from '@/components/editor/EditorShell'

export default function Page() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CS</div>
          <div>
            <h1>Creative Studio</h1>
            <p>Local-first editor for Story, Post, and A3 creatives</p>
          </div>
        </div>
        <div className="stack-list">
          <div className="note-card">Bottom-right watermark priority</div>
          <div className="note-card">Manual override ready</div>
          <div className="note-card">IndexedDB with memory fallback</div>
          <div className="note-card">Prompt route ready for ChatGPT images</div>
        </div>
      </aside>
      <section className="content">
        <div className="hero-card">
          <div>
            <div className="eyebrow">Editor</div>
            <h2>Build branded visuals with local memory and AI-assisted prompts.</h2>
          </div>
          <p>This app runs local-first, keeps editor state responsive in memory, and persists to IndexedDB when the browser allows it.</p>
        </div>
        <EditorShell />
      </section>
    </main>
  )
}
