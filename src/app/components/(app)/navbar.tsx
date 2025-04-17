"use client"

import { Fragment, useEffect, useState } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { IconMenu, IconUser, IconX, IconSun, IconMoon, IconChevronDown } from "@tabler/icons-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

export default function NavBar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const { data: session } = useSession()
  console.log(session)
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
    {
      name: "Branding Generator",
      href: "/branding",
      hasDropdown: true,
      dropdownItems: [
        { name: "Business Card", href: "/businesscard" },
        { name: "Business Letter", href: "/businessletter" },
        { name: "Brand Name ", href: "/brandname" },
      ],
    },
  ]
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleButtonClasses =
    theme === "light"
      ? "flex items-center justify-center rounded-full p-2 bg-brand text-white"
      : "flex items-center justify-center rounded-full p-2 bg-gray-300 text-black"

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name))
  }

  const handleMobileDropdownToggle = (name: string) => {
    setMobileOpenDropdown((prev) => (prev === name ? null : name))
  }

  return (
    <Disclosure as="nav" className="bg-nav-activeLight dark:bg-black">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
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
              <div className="flex flex-1 items-center justify-center sm:items-stretch md :justify-start">
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
                <div className="hidden md:flex sm:ml-6 items-center">
                  {/* Main navigation */}
                  <div className="flex space-x-1 md:space-x-4 items-center">
                    {mainNavigation.map((item) => (
                      <div key={item.name} className="relative">
                        {item.hasDropdown ? (
                          <div>
                            <button
                              onClick={() => handleDropdownToggle(item.name)}
                              className={classNames(
                                pathname === item.href
                                  ? theme === "dark"
                                    ? "bg-[#393E46] text-[#EEEEEE]"
                                    : "bg-[#00ADB5] text-[#222831]"
                                  : theme === "dark"
                                    ? "text-[#D1D5DB] hover:bg-[#374151] hover:text-[#F9FAFB]"
                                    : "text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]",
                                "rounded-md px-2 md:px-3 py-2 text-xs md:text-sm font-medium h-full flex items-center",
                              )}
                            >
                              {item.name}
                              <IconChevronDown className="ml-1 h-4 w-4" />
                            </button>
                            {openDropdown === item.name && (
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
                                      onClick={() => close()} // Close the menu after clicking
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
                              "block rounded-md px-2 md:px-3 py-2 text-xs md:text-sm font-medium h-full",
                            )}
                            aria-current={pathname === item.href ? "page" : undefined}
                            onClick={() => close()} // Close the menu after clicking
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
                {/* User profile section */}
                <div className="flex items-center space-x-3">
                  {/* Theme toggle button */}
                  {mounted && (
                    <button
                      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                      className={toggleButtonClasses}
                    >
                      {theme === "light" ? <IconMoon className="w-5 h-5" /> : <IconSun className="w-5 h-5" />}
                    </button>
                  )}

                  {/* Credits display */}
                  {session?.user?.credits && (
                    <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium">
                      <span>{session.user.credits} Credits</span>
                    </div>
                  )}

                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open user menu</span>
                        {session?.user?.image ? (
                          <img
                            src={session.user.image || "/placeholder.svg"}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div
                            className={classNames(
                              theme === "dark" ? "bg-[#393E46] text-[#EEEEEE]" : "bg-[#E5E7EB] text-[#222831]",
                              "flex rounded-full text-sm focus:outline-none p-2",
                            )}
                          >
                            <IconUser className="w-5 h-5" />
                          </div>
                        )}
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
                        {session?.user && (
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                            
                            {session.user.credits && (
                              <div className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                {session.user.credits} Credits
                              </div>
                            )}
                          </div>
                        )}
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
          </div>

          {/* Mobile menu with glassy effect */}
          <Disclosure.Panel className="sm:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {mainNavigation.map((item) => (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => handleMobileDropdownToggle(item.name)}
                          className={classNames(
                            pathname === item.href
                              ? theme === "dark"
                                ? "bg-[#393E46] text-[#EEEEEE]"
                                : "bg-[#00ADB5] text-[#222831]"
                              : theme === "dark"
                                ? "text-[#D1D5DB] hover:bg-[#374151] hover:text-[#F9FAFB]"
                                : "text-[#fff] hover:bg-[#E5E7EB] hover:text-[#1F2937]",
                            "w-full flex justify-between items-center rounded-md px-3 py-2 text-base font-medium",
                          )}
                        >
                          {item.name}
                          <IconChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${mobileOpenDropdown === item.name ? "transform rotate-180" : ""}`}
                          />
                        </button>
                        {mobileOpenDropdown === item.name && (
                          <div className="pl-4 space-y-1">
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
                                  "block rounded-md px-3 py-2 text-base font-medium",
                                )}
                                onClick={() => close()} // Close the menu after clicking
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
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
                          "block rounded-md px-3 py-2 text-base font-medium",
                        )}
                        aria-current={pathname === item.href ? "page" : undefined}
                        onClick={() => close()} // Close the menu after clicking
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              {/* Mobile user profile info */}
              {session?.user && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {session.user.image ? (
                      <img
                        src={session.user.image || "/placeholder.svg"}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <IconUser className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-base font-medium text-white">{session.user.name}</p>
                      <p className="text-sm text-gray-300 truncate">{session.user.email}</p>
                    </div>
                  </div>
                  {session.user.credits && (
                    <Link href="/plans">
                    <div className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium inline-block">
                      {session.user.credits} Credits
                    </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
