"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Mail, Loader2, Download , FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { LetterPreview } from "@/app/lib/branding/letter"
import html2canvas from "html2canvas"

export default function BusinessLetterGenerator() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const letterRef = useRef<HTMLDivElement>(null)
  const [letterData, setLetterData] = useState<any>(null)
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    senderName: "",
    senderCompany: "",
    senderEmail: "",
    senderPhone: "",
    senderWebsite: "",
    style: "modern" as "modern" | "classic" | "minimalist" | "premium" | "corporate" | "executive",
    accentColor: "#6D28D9",
    includeLetterhead: true,
    includeSignature: true,
    dateFormat: "standard"
  })

  const [displayData, setDisplayData] = useState({
    senderName: "",
    senderCompany: "",
    senderEmail: "",
    senderPhone: "",
    senderWebsite: "",
    style: "modern" as "modern" | "classic" | "minimalist" | "premium" | "corporate" | "executive",
    accentColor: "#6D28D9",
    includeLetterhead: true,
    includeSignature: true,
    dateFormat: "standard"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDownload = async () => {
    if (!letterRef.current) return
    
    try {
      setDownloadLoading(true)
      
      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      })
      
      const link = document.createElement('a')
      link.download = `business-letter-${formData.senderName || 'design'}.png`
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
      const response = await fetch("/api/generate/letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

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
      setDisplayData(formData)
      setLetterData(data.result)
      setCreditsRemaining(data.creditsRemaining)
      setIsGenerated(true)
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
      <div className="flex items-center mb-8">
      <FileSpreadsheet className="w-8 h-8 text-purple-600 mr-3" />
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

                <div className="space-y-2">
                  <label htmlFor="senderPhone" className="block text-sm font-medium">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    id="senderPhone"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="senderWebsite" className="block text-sm font-medium">
                    Your Website
                  </label>
                  <input
                    type="url"
                    id="senderWebsite"
                    name="senderWebsite"
                    value={formData.senderWebsite}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>



            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-2">
                Letter Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Meeting Request"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="style" className="block text-sm font-medium">
                    Letter Style
                  </label>
                  <select
                    id="style"
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="premium">Premium</option>
                    <option value="corporate">Corporate</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="accentColor" className="block text-sm font-medium">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    id="accentColor"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    className="w-full h-10 px-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dateFormat" className="block text-sm font-medium">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="standard">Standard (January 1, 2024)</option>
                    <option value="formal">Formal (1st January, 2024)</option>
                    <option value="iso">ISO (2024-01-01)</option>
                  </select>
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
                  "Generate Letter"
                )}
              </button>
            </div>
          </form>

          {isGenerated && letterData && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Your Generated Letter</h2>
              <div ref={letterRef} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white p-4">
                <LetterPreview data={displayData} />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDownload}
                  disabled={downloadLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                >
                  {downloadLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download as Image
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Print Letter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}