"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Lightbulb, Loader2 } from "lucide-react"
import Link from "next/link"

export default function BrandNameGenerator() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    industry: "",
    keywords: "",
    description: "",
    targetAudience: "",
    nameLength: "medium",
    nameStyle: "modern",
    avoidWords: "",
    mustInclude: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert("Brand names generated successfully!")
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
          <Lightbulb className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold">AI Brand Name Generator</h1>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Industry / Business Type
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Technology, Food, Fashion, etc."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="innovative, sustainable, premium, etc."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Business Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe your business, products, services, and what makes you unique..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Young professionals, parents, tech enthusiasts, etc."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nameLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Name Length
                </label>
                <select
                  id="nameLength"
                  name="nameLength"
                  value={formData.nameLength}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="short">Short (1-5 characters)</option>
                  <option value="medium">Medium (6-10 characters)</option>
                  <option value="long">Long (11+ characters)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="nameStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name Style
                </label>
                <select
                  id="nameStyle"
                  name="nameStyle"
                  value={formData.nameStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="playful">Playful</option>
                  <option value="technical">Technical</option>
                  <option value="abstract">Abstract</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="avoidWords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Words to Avoid (Optional)
                </label>
                <input
                  type="text"
                  id="avoidWords"
                  name="avoidWords"
                  value={formData.avoidWords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Separate with commas"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="mustInclude" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Must Include (Optional)
                </label>
                <input
                  type="text"
                  id="mustInclude"
                  name="mustInclude"
                  value={formData.mustInclude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Words or letters to include"
                />
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
                    Generating...
                  </>
                ) : (
                  "Generate Brand Names"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

