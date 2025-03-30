'use client'

import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {
  IconAlien,
  IconMenu,
  IconUser,
  IconX,
  IconSun,
  IconMoon,
  IconChevronDown
} from '@tabler/icons-react'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  const pathname = usePathname()
  console.log(pathname)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isWebsiteDropdownOpen, setIsWebsiteDropdownOpen] = useState(false)

  // Define the main navigation items
  const mainNavigation = [
    {
      name: "Website Generator",
      href: "/dashboard",
      hasDropdown: true,
      dropdownItems: [
        { name: "Generate Website", href: "/dashboard" },
        { name: "Your Sites", href: "/sites" },
      ],
    },
    { name: "Logo Generator", href: "/logo", hasDropdown: false },
    { name: "Content Generator", href: "/content", hasDropdown: false },
    { name: "Branding Generator", href: "/branding", hasDropdown: false },
  ]

  // Set the navigation based on the current path
  const [navigation, setNavigation] = useState(mainNavigation)

  useEffect(() => {
    // Always use the main navigation with the 4 headings
    setNavigation(mainNavigation)
  }, [pathname])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Define a toggle button class to style the button based on the theme.
  const toggleButtonClasses =
    theme === "light"
      ? "flex items-center justify-center rounded-full p-2 bg-brand text-white"
      : "flex items-center justify-center rounded-full p-2 bg-gray-300 text-black"

  // Placeholder for signOut function. Replace with actual implementation.
  const signOut = () => {
    console.log("Sign out function called")
    // Add your sign-out logic here, e.g., using Firebase, Auth0, etc.
  }

  return (
    // Use custom light (bg-brand) and dark (bg-black) backgrounds.
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
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    {mounted && (
                      <img
                        src={theme === "light" ? "/White-logo.png" : "/logo.png"}
                        alt="Logo"
                        className="h-24 w-auto sm:h-32"
                      />
                    )}
                  </Link>
                </div>
                <div className="hidden sm:flex sm:ml-6 justify-center items-center">
                  <div className="flex justify-center space-x-4 items-center">
                    {navigation.map((item) => (
                      <div key={item.name} className="relative">
                        {item.hasDropdown ? (
                          <div>
                            <button
                              onClick={() => setIsWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
                              className={classNames(
                                pathname === item.href
                                  ? theme === "dark"
                                    ? "bg-[#393E46] text-[#EEEEEE]"
                                    : "bg-[#00ADB5] text-[#222831]"
                                  : theme === "dark"
                                    ? "text-[#D1D5DB] hover:bg-[#374151] hover:text-[#F9FAFB]"
                                    : "text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]",
                                "rounded-md px-3 py-2 text-sm font-medium h-full flex items-center",
                              )}
                            >
                              {item.name}
                              <IconChevronDown className="ml-1 h-4 w-4" />
                            </button>
                            {isWebsiteDropdownOpen && (
                              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  {item.dropdownItems?.map((dropdownItem) => (
                                    <Link
                                      key={dropdownItem.name}
                                      href={dropdownItem.href}
                                      className={classNames(
                                        pathname === dropdownItem.href
                                          ? theme === "dark"
                                            ? "bg-[#393E46] text-[#EEEEEE]"
                                            : "bg-[#00ADB5] text-[#222831]"
                                          : theme === "dark"
                                            ? "text-[#D1D5DB] hover:bg-[#374151] hover:text-[#F9FAFB]"
                                            : "text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]",
                                        "block px-4 py-2 text-sm",
                                      )}
                                    >
                                      {dropdownItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className={classNames(
                              pathname === item.href
                                ? theme === "dark"
                                  ? "bg-[#393E46] text-[#EEEEEE]"
                                  : "bg-[#00ADB5] text-[#222831]"
                                : theme === "dark"
                                  ? "text-[#D1D5DB] hover:bg-[#374151] hover:text-[#F9FAFB]"
                                  : "text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]",
                              "rounded-md px-3 py-2 text-xs font-medium  h-full",
                            )}
                            aria-current={pathname === item.href ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side: Theme toggle & user menu */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-3">
                {/* Theme toggle button */}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className={toggleButtonClasses}
                  >
                    {theme === "light" ? (
                      // When light, show moon icon (to allow switching to dark)
                      <IconMoon className="w-6 h-6" />
                    ) : (
                      // When dark, show sun icon (to allow switching to light)
                      <IconSun className="w-6 h-6" />
                    )}
                  </button>
                )}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button
                      className={classNames(
                        theme === "dark" ? "bg-[#393E46] text-[#EEEEEE]" : "bg-[#E5E7EB] text-[#222831]",
                        "flex rounded-full text-sm focus:outline-none p-2",
                      )}
                    >
                      <span className="sr-only">Open user menu</span>
                      <IconUser className="w-5 h-5" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/account"
                            className={classNames(
                              active ? "bg-gray-100 dark:bg-gray-700" : "",
                              "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
                            )}
                          >
                            Your Account
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={classNames(
                              active ? "bg-gray-100 dark:bg-gray-700" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile navigation links */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <Disclosure.Button
                        as="button"
                        onClick={() => setIsWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
                        className={classNames(
                          pathname === item.href
                            ? theme === "dark"
                              ? "bg-[#393E46] text-[#EEEEEE]"
                              : "bg-[#00ADB5] text-[#222831]"
                            : theme === "dark"
                              ? "text-[#D1D5DB] hover:bg-[#374151] hover:text-[#F9FAFB]"
                              : "text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]",
                          "block rounded-md px-3 py-2 text-base font-medium w-full text-left flex items-center justify-between",
                        )}
                      >
                        {item.name}
                        <IconChevronDown className="h-4 w-4" />
                      </Disclosure.Button>
                      {isWebsiteDropdownOpen && (
                        <div className="pl-4">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Disclosure.Button
                              key={dropdownItem.name}
                              as="a"
                              href={dropdownItem.href}
                              className={classNames(
                                pathname === dropdownItem.href
                                  ? theme === "dark"
                                    ? "bg-[#393E46] text-[#EEEEEE]"
                                    : "bg-[#00ADB5] text-[#222831]"
                                  : theme === "dark"
                                    ? "text-[#D1D5DB] hover:bg-[#374151] hover:text-[#F9FAFB]"
                                    : "text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]",
                                "block rounded-md px-3 py-2 text-base font-medium",
                              )}
                            >
                              {dropdownItem.name}
                            </Disclosure.Button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Disclosure.Button
                      as="a"
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? theme === "dark"
                            ? "bg-[#393E46] text-[#EEEEEE]"
                            : "bg-[#00ADB5] text-[#222831]"
                          : theme === "dark"
                            ? "text-[#D1D5DB] hover:bg-[#374151] hover:text-[#F9FAFB]"
                            : "text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]",
                        "block rounded-md px-3 py-2 text-base font-medium",
                      )}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  )}
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}