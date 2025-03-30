import { Chat } from '@/app/components/(app)/chat'
import BusinessCard from '../../components/(app)/BusinessCard'
export const runtime = 'edge'

export default async function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <div className="border rounded-lg overflow-hidden">
        <BusinessCard />
      </div>
    </div>
  )
}
