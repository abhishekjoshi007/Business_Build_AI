import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { LoginButton, RegisterButton } from '@/ui/nav-buttons'
import AlienInvasion from '@/ui/alien-invasion'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export default async function Page() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-8 bg-white dark:bg-black min-h-screen p-4">
      <h1 className="text-xl font-medium text-gray-800 dark:text-gray-300 mx-auto text-center">
        Build a complete website with Alien Technology (AI) in under a minute!
      </h1>

      <div className="space-y-6">
        {!session && (
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-lg gap-3 mx-auto">
            <div className="text-gray-800 dark:text-gray-300">
              <p className="mb-2">Have an account?</p>
              <LoginButton text="Sign In" />
            </div>

            <div className="text-gray-800 dark:text-gray-300">
              <p className="mb-2">Need an account?</p>
              <RegisterButton />
            </div>
          </div>
        )}
      </div>

      {session && (
        <div className="space-y-3">
          <Link
            href="/home"
            className="mx-auto border rounded py-2 flex w-52 items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      )}

      <AlienInvasion />
    </div>
  )
}