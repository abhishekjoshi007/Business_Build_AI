'use client'

import { useState, useEffect } from 'react'
import { UserUpdates, User } from '@/old.types/user'
import { OpenAIModels, OpenAIModelID } from '@/old.types/openai'
import { useUpdateUser, useUserProfile } from '@/lib/user'
import { ListSkeleton } from '@/ui/list-skeleton'
import { useRouter } from 'next/navigation'

interface AccountFormProps {
  user: User
}
export const AccountForm: React.FC<AccountFormProps> = ({ user }) => {
  const router = useRouter()
  const {
    data: userData,
    isLoading,
    isError,
  } = useUserProfile(user?._id, user !== undefined)
  console.log(userData)
  const [formState, setFormState] = useState({
    _id: '',
    email: '',
    model: OpenAIModels[OpenAIModelID.GPT_3_5],
  })

  useEffect(() => {
    if (userData) setFormState(userData)
  }, [userData])

  const updateUserMutation = useUpdateUser();

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModelId = e.target.value as OpenAIModelID
    const selectedModel = OpenAIModels[selectedModelId]
    setFormState((prevState) => ({ ...prevState, model: selectedModel }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({ ...prevState, email: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateUserMutation.mutate({
      id: user._id,
      updates: formState as UserUpdates,
    })
  }

  if (isLoading) return <ListSkeleton />

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-300 dark:border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            Your Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            This information will be not displayed publicly.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formState?.email}
                  onChange={handleEmailChange}
                  className="block w-full rounded-md border-0 bg-gray-50 dark:bg-white/5 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 dark:border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            Account Settings
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Choose your settings for this account.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="model"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                AI Model
              </label>
              <div className="mt-2">
                <select
                  id="model"
                  name="model"
                  className="block w-full rounded-md border-0 bg-gray-50 dark:bg-white/5 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                  value={formState?.model?.id}
                  onChange={handleModelChange}
                >
                  <option key="gpt-3.5-turbo-0613" value="gpt-3.5-turbo-0613">
                    GPT-3.5-Turbo
                  </option>
                  <option key="gpt-4-0613" value="gpt-4-0613">
                    GPT-4
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 dark:border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            Credits
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Your available credits and subscription options.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Available Credits</p>
                  <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{formState?.credits || 0}</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/plans')}
                  className="rounded-md bg-purple-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                >
                  Buy More Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
        >
          Save
        </button>
      </div>
    </form>
  )
}