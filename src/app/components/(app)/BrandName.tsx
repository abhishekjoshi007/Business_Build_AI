"use client"

import React, { useReducer, useState } from "react"
import { Lightbulb, Loader2 } from "lucide-react"
import { redirect, useRouter } from "next/navigation"

export default function BrandNameGenerator() {
  const router = useRouter()
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
  const [generatedNames, setGeneratedNames] = useState<string | null>(null) // State to store generated names

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedNames(null) // Reset the generated names before generating new ones

    try {
      const prompt = `Generate 10 creative brand name ideas for a ${formData.industry} business. 
      Keywords: ${formData.keywords}.
      Business description: ${formData.description}.
      Target audience: ${formData.targetAudience}.
      Name length: ${formData.nameLength}.
      Style: ${formData.nameStyle}.
      ${formData.avoidWords ? `Avoid: ${formData.avoidWords}.` : ''}
      ${formData.mustInclude ? `Must include: ${formData.mustInclude}.` : ''}
      Provide the names in a numbered list.`

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "text",
          prompt
        })
      })
 
      if (response.status === 403) {
       router.push('/plans')
        return
      }

      const data = await response.json()
     
      const names = data.result
      setGeneratedNames(names) // Set the generated names
    } catch (error) {
      console.error("Error generating brand names:", error)
      alert("Failed to generate brand names. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Lightbulb className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className=" text-black dark:text-white text-3xl font-bold">AI Brand Name Generator</h1>
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

        {/* Display Generated Names */}
        {generatedNames && (
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Generated Brand Names</h2>
            <pre className="whitespace-pre-wrap bg-white dark:bg-black text-black dark:text-gray-300">{generatedNames}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

