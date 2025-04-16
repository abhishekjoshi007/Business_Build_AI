import NavBar from '../components/(app)/navbar'
import HomeCards from '../components/HomeCards'
export const runtime = 'edge'

export default async function Page() {
  return (<>
    <NavBar/>
    <div className="prose prose-sm prose-invert max-w-none">
      <div className="border rounded-lg overflow-hidden">
        <HomeCards />
      </div>
    </div>
    </>
  )
}
