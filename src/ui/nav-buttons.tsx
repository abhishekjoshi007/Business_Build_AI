'use client'

import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

interface LoginButtonProps {
  text: string
}

export const LoginButton = ({ text }: LoginButtonProps) => {
  return (
    <button
      className="border rounded py-2 flex w-52 items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-700 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={() => signIn()}
    >
      {text}
    </button>
  )
}

export const RegisterButton = () => {
  return (
    <Link
      href="/register"
      className="border rounded py-2 flex w-52 items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-700 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      Register
    </Link>
  )
}

export const LogoutButton = () => {
  return (
    <button
      className="border rounded py-2 flex w-52 items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  )
}