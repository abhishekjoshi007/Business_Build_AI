import { Chat } from '@/app/components/(app)/chat'
import ContentGenerator from'@/components/(app)/Content-generate'
export const runtime = 'edge'

export default async function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <div className="border rounded-lg overflow-hidden">
        <ContentGenerator />
      </div>
    </div>
  )
}
