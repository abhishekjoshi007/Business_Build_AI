'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import GoogleAuthButton from './GoogleAuthButton'

export default function RegisterForm() {
  const router = useRouter()

  const [working, isWorking] = useState<boolean>(false)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  async function submit(e: any) {
    e.preventDefault()

    isWorking(true)

    if (!email) {
      toast.error('You must include your email!')
      return
    }
    if (!password) {
      toast.error('You must include your password!')
      return
    }
    if (password !== passwordConfirm) {
      toast.error('Your passwords must match!')
      return
    }

    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
    const body = await response.json()

    isWorking(false)

    if (!response.ok) {
      toast.error(body)
    }

    router.push('/login')
  }

  return (
    <div>
      <div className="mb-8">
        <Image
          className={`${working && 'animate-pulse'} mx-auto max-w-[150px]`}
          src="/ufo.svg"
          width={200}
          height={200}
          alt="logo"
        />

        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-200">
          Register for a FREE account
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Already a member?{' '}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Log in
          </Link>
        </p>
      </div>

      <form onSubmit={submit} method="POST" className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6 bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6 bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
          >
            Confirm Password
          </label>
          <div className="mt-2">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6 bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>
   
        <div>
          <button
            type="submit"
            disabled={working}
            className={`flex w-full justify-center rounded-md bg-purple-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 disabled:animate-pulse`}
          >
            Register
          </button>
        </div>
        <GoogleAuthButton/>
      </form>
    </div>
  )
}