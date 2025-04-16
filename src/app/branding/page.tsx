import Branding from'@/components/(app)/Branding'
import NavBar from '../components/(app)/navbar'
export const runtime = 'edge'

export default async function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <NavBar/>
      <div className="border rounded-lg overflow-hidden">
        <Branding />
      </div>
    </div>
  )
}
