import { Chat } from '@/app/components/(app)/chat'
import Branding from'@/components/(app)/Branding'
export const runtime = 'edge'

export default async function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <div className="border rounded-lg overflow-hidden">
        <Branding />
      </div>
    </div>
  )
}
