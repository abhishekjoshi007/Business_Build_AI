"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import Link from "next/link"

export default function BusinessLetterGenerator() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    senderName: "",
    senderTitle: "",
    senderCompany: "",
    senderAddress: "",
    senderEmail: "",
    senderPhone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert("Sender information submitted successfully!")
    }, 2000)
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/branding"
            className="inline-flex items-center text-purple-600 hover:text-purple-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </div>

        <div className="flex items-center mb-8">
          <Mail className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl text-black dark:text-white font-bold">Business Letter Generator</h1>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-2">
                Sender Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="senderTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Job Title
                  </label>
                  <input
                    type="text"
                    id="senderTitle"
                    name="senderTitle"
                    value={formData.senderTitle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Marketing Director"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="senderCompany" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Company
                  </label>
                  <input
                    type="text"
                    id="senderCompany"
                    name="senderCompany"
                    value={formData.senderCompany}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="senderEmail"
                    name="senderEmail"
                    value={formData.senderEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="senderPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    id="senderPhone"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="senderAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Address
                  </label>
                  <textarea
                    id="senderAddress"
                    name="senderAddress"
                    value={formData.senderAddress}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="123 Business St, Suite 101, City, State, ZIP"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-md bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/25 flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Sender Information"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

