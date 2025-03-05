
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function GoogleAuthButton() {
    const router = useRouter()
  const { data: session } = useSession()
  const handleGoogleSignIn = async () => {
    if (session) {
      console.log(session)
      router.push('/dashboard')
      return
    }
    const resp = await signIn('google')
    console.log(resp)
  }
    return (
      <div className=' mt-4 h-[100] w-[100] flex justify-center align-middle'>
        <button className='ml-3 rounded-md px-3 py-1 font-medium bg-red-500 text-white hover:bg-red-600' onClick={handleGoogleSignIn}>
        Sign In with Google
        </button>
       </div> 
    )
}

