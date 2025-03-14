import { getServerSession } from 'next-auth'
import SigninForm from '@/app/components/(marketing)/signin-form'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export const dynamic = 'force-dynamic'

export default async function SignIn() {
  const session = await getServerSession(authOptions)

  if (session) {
    return redirect('/home')
  }

  return (
    <div className="flex flex-1 flex-col justify-center bg-brand-light dark:bg-black px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96 bg-white dark:bg-black
       p-6 rounded-lg shadow-md">
        <SigninForm />
      </div>
    </div>
  )
}
