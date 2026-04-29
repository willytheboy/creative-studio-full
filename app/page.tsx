import { EditorProvider } from '@/components/editor/EditorProvider'
import { EditorShell } from '@/components/editor/EditorShell'

export default function Home() {
  return (
    <EditorProvider>
      <EditorShell />
    </EditorProvider>
  )
}
