import { Pricing } from '@/app/components/(app)/Plans'
export const runtime = 'edge'

export default async function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <div className="border rounded-lg overflow-hidden">
        <Pricing />
      </div>
    </div>
  )
}
