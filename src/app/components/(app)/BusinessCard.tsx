"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BusinessCardGenerator() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    color: "#6D28D9", // Default purple color
    style: "modern",
  })
  const [imageUrl, setImageUrl] = useState<string | null>(null) // State to store the generated image URL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    
    try {
      setLoading(true)
      // Fetch the image data
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `business-card-${formData.name || 'design'}.png`
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download image. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setImageUrl(null) // Reset the image URL before generating a new one
    try {
      // Construct the prompt for the image generation
      const prompt = `Generate a professional single-sided rectangular business card in ${formData.style} style with ${formData.color} as the primary color. 
      The card should be a simple rectangular design (3.5 x 2 inches proportion) without any mockup elements like shadows, hands, or backgrounds. 
      Include these details clearly arranged on the card:
      - Name: ${formData.name}
      - Title: ${formData.title}
      - Company: ${formData.company}
      - Email: ${formData.email}
      - Phone: ${formData.phone}
      ${formData.website ? `- Website: ${formData.website}` : ''}
      ${formData.address ? `- Address: ${formData.address}` : ''}
      
      The design should be clean, professional, and strictly single-sided with all text clearly readable. 
      Use a color palette based on ${formData.color} and maintain proper business card proportions. 
      Do not include any mockup elements - just the flat rectangular card design.`

      // Call our backend API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "image",
          prompt,
          imageSize: "1024x1024"
        })
      })
      if (response.status === 403) {
         router.push('/plans') 
         return
       }
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

    
      const generatedImageUrl = data.data[0].url
      setImageUrl(generatedImageUrl) // Set the generated image URL
    } catch (error) {
      console.error("Error generating business card:", error)
      alert("Failed to generate business card. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <CreditCard className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl text-black dark:text-white font-bold">AI Business Card Generator</h1>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Marketing Director"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Acme Inc."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe your company, its services, and what makes it unique..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Business Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="123 Business St, Suite 101, City, State, ZIP"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Select your brand color</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Card Style
                </label>
                <select
                  id="style"
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="bold">Bold</option>
                </select>
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
                  "Generate Business Card"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        {imageUrl && (
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Generated Business Card</h2>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={imageUrl}
                alt="Generated Business Card"
                className="w-full max-w-md rounded-md border border-gray-300 dark:border-gray-700"
              />
            <button
              onClick={handleDownload}
              disabled={loading}
              className="py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Downloading...
                </>
              ) : (
                "Download Business Card"
              )}
            </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

