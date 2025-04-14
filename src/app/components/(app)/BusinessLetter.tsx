"use client"

import { useState } from "react"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { redirect , useRouter } from 'next/navigation'
export default function BusinessLetterGenerator() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    senderName: "",
    senderCompany: "",
    senderEmail: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setImageUrl(null)

    try {
      const prompt = `Generate a professional business letter template on A4 size paper with these details:
      
      Letterhead:
      - Company: ${formData.senderCompany}
      - Name: ${formData.senderName}
      - Email: ${formData.senderEmail}
      
      The letter should include:
      1. Date line (show "[Date]")
      2. Recipient address block (show "[Recipient's Address]")
      
      Use a clean, professional design with black text on white background.
      Include subtle borders or divider lines if appropriate.
      Make sure all text is clearly readable.
      Do not include any content or body text - only the letterhead and address structure.`

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
      console.log(response.status)
      if (response.status === 403) {
         router.push('/plans')
         return 
      }
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }  

      const data = await response.json()
      if (data.error === 'Insufficient credits') {
        alert('You have run out of credits. Please contact support to get more credits.')
        return
      }
      setImageUrl(data.result)
      setCreditsRemaining(data.creditsRemaining)
    } catch (error) {
      console.error("Error generating letter:", error)
      alert("Failed to generate letter. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 dark:hover:text-purple-400">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="flex items-center mb-8">
          <Mail className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold">Business Letter Generator</h1>
          {creditsRemaining !== null && (
            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              Credits remaining: {creditsRemaining}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-2">
                Required Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label htmlFor="senderName" className="block text-sm font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="senderCompany" className="block text-sm font-medium">
                    Your Company
                  </label>
                  <input
                    type="text"
                    id="senderCompany"
                    name="senderCompany"
                    value={formData.senderCompany}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="senderEmail" className="block text-sm font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="senderEmail"
                    name="senderEmail"
                    value={formData.senderEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium flex justify-center items-center transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Letter...
                  </>
                ) : (
                  "Generate Sample Letter"
                )}
              </button>
            </div>
          </form>

          {imageUrl && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Your Generated Letter</h2>
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Generated business letter" 
                  className="w-full h-auto"
                />
              </div>
              <div className="flex justify-center">
                <a
                  href={imageUrl}
                  download="business-letter.png"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Download Letter
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}