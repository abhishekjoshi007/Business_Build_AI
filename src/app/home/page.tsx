import NavBar from '../components/(app)/navbar'
import HomeCards from '../components/HomeCards'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export default async function Page() {
    const session = (await getServerSession(authOptions)) as any
    if (!session) return redirect('/login')
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
