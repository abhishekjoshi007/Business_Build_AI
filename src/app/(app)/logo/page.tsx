import GenerateLogo from '@/app/components/(app)/GenerateLogo'


export default async function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <div className="border rounded-lg overflow-hidden">
        <GenerateLogo />
      </div>
    </div>
  )
}
