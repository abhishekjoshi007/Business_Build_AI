import { Chat } from '@/app/components/(app)/chat'
import BrandName from '../../components/(app)/BrandName'
export const runtime = 'edge'

export default async function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <div className="border rounded-lg overflow-hidden">
        <BrandName />
      </div>
    </div>
  )
}
