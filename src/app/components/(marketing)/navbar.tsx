'use client'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { IconAlien, IconMenu, IconX, IconSun, IconMoon } from '@tabler/icons-react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Home', href: '/', current: true },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleSignIn = async () => {
    if (session) {
      console.log(session)
      router.push('/dashboard')
      return
    }
    const resp = await signIn('google')
  }

  // Define a toggle button class to style the button based on the theme.
  const toggleButtonClasses =
    theme === 'light'
      ? 'flex items-center justify-center rounded-full p-2 bg-brand text-white'
      : 'flex items-center justify-center rounded-full p-2 bg-gray-300 text-black'

  return (
    <Disclosure as="nav" className="bg-nav-activeLight dark:bg-black">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <IconX className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <IconMenu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo and navigation links */}
              <div className="flex flex-1 items-center ">
                {/* Logo */}
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                  {mounted && (
                    <img
                      src={theme === 'light' ? '/White-logo.png' : '/logo.png'}
                      alt="Logo"
                      className="h-24 w-auto sm:h-32"
                    />
                  )}
                  </Link>
                </div>

                {/* Desktop navigation links */}
                <div className="hidden sm:block">
                  <div className="flex justify-start space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={pathname === item.href ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Register and Sign In buttons */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-3">
                {/* Theme toggle button */}
                {mounted && (
                  <button
                    onClick={() =>
                      setTheme(theme === 'light' ? 'dark' : 'light')
                    }
                    className={toggleButtonClasses}
                  >
                    {theme === 'light' ? (
                      // When light, show moon icon (to allow switching to dark)
                      <IconMoon className="w-6 h-6" />
                    ) : (
                      // When dark, show sun icon (to allow switching to light)
                      <IconSun className="w-6 h-6" />
                    )}
                  </button>
                )}
                <Link
                  href="/register"
                  className="rounded-md px-3 py-1 font-medium border border-indigo-700 mr-3 hover:border-indigo-800 hover:text-gray-200 text-sm sm:text-base"
                >
                  Register
                </Link>
                <button
                  className="hover:text-gray-200 text-sm sm:text-base"
                  onClick={() => signIn()}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Mobile navigation links */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}