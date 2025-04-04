"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, Loader2 } from "lucide-react"

export default function BusinessCardGenerator() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setImageUrl(null) // Reset the image URL before generating a new one
    try {
      // Construct the prompt for the image generation
      const prompt = `Create a professional ${formData.style} style single-sided business card with ${formData.color} as the primary color. 
      Include the following details:
      - Name: ${formData.name}
      - Title: ${formData.title}
      - Company: ${formData.company}
      - Description: ${formData.description}
      - Email: ${formData.email}
      - Phone: ${formData.phone}${formData.website ? `  - Website: ${formData.website}` : ''}
      ${formData.address ? `  - Address: ${formData.address}` : ''}
      
      The design should be clean, professional, and match the ${formData.style} style. 
      Use a color scheme based on ${formData.color} and ensure all text is readable. The card must be strictly single-sided.`

      // Call the OpenAI API
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          n: 1, // Number of images to generate
          size: "1024x1024", // You might want to use "512x512" for business cards
          model: "dall-e-3", // Use the latest model
          quality: "standard", // Or "hd" for higher quality
          style: "natural" // Or "vivid" for more artistic
        })
      })

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
              <a
                href={imageUrl}
                download="business-card.png"
                className="py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-300"
              >
                Download Business Card
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

