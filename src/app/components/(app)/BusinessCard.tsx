"use client"

import type React from "react"
import { useState, useRef } from "react"
import { CreditCard, Loader2, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { CardPreview } from "@/app/lib/branding/card"
import html2canvas from "html2canvas"
import { useSession } from "next-auth/react"

export default function BusinessCardGenerator() {
  const router = useRouter()
  const { update } = useSession() // Get the update function
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
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

  const [displayData, setDisplayData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    
    try {
      setDownloadLoading(true)
      
      // Use html2canvas to convert the card to an image
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      })
      
      // Create download link
      const link = document.createElement('a')
      link.download = `business-card-${formData.name || 'design'}.png`
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download image. Please try again.')
    } finally {
      setDownloadLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Call our backend API (modified version that doesn't use OpenAI)
      const response = await fetch("/api/generate/card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData) // Send the form data directly
      })

      if (response.status === 403) {
        router.push('/plans') 
        return
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      if (response.ok) {
        await update() // This will refetch the session with updated credits
      }
      // The response will contain the card data (no image URL needed now)
      const data = await response.json()
      setDisplayData(formData) // Update display data with current form data
      setIsGenerated(true) // Set isGenerated to true after successful generation
    } catch (error) {
      console.error("Error generating business card:", error)
      alert("Failed to generate business card. Please try again.")
    } finally {
      setLoading(false)
    } 
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="max-w-6xl mx-auto grid  gap-8">
        {/* Left Column - Form */}
        <div>
          <div className="flex items-center mb-8">
            <CreditCard className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl text-black dark:text-white font-bold">Business Card Generator</h1>
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
                    <option value="elegant">Elegant</option>
                    <option value="vintage">Gradient</option>
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
        </div>

        {/* Right Column - Preview */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Card Preview
          </h2>
          
          {isGenerated && (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-800 flex-1 flex flex-col">
              {/* Card Preview Container */}
              <div className="flex-1 flex items-center justify-center p-4 w-full h-full">
                <div 
                  ref={cardRef} 
                  className="w-full "
                >
                  <CardPreview data={displayData} />
                </div>
              </div>
              
              {/* Download Button */}
              <div className="mt-6">
                <button
                  onClick={handleDownload}
                  disabled={downloadLoading || !formData.name}
                  className="w-full py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-300 flex justify-center items-center gap-2"
                >
                  {downloadLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Card
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

