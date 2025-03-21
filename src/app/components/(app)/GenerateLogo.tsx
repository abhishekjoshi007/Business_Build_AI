"use client"
import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useTheme } from "next-themes"
import { Download, Loader2, RefreshCw, Image, Save, Moon, Sun } from "lucide-react"

const GenerateLogo: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [companyName, setCompanyName] = useState("")
  const [service, setService] = useState("")
  const [colors, setColors] = useState("")
  const [extraFeatures, setExtraFeatures] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getRandomSeed = () => Math.floor(Math.random() * 1_000_000_000)

  const handleGenerateLogo = async () => {
    if (!companyName && !customPrompt) {
      setError("Please enter a company name or custom prompt")
      return
    }

    setError("")
    setLoading(true)
    const seed = getRandomSeed()
    const prompt =
      customPrompt ||
      `Generate a modern logo for a company named ${companyName} that provides ${service || "services"}, using ${colors || "purple and white"} colors with ${extraFeatures || "minimalist design"}.`

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=640&height=640&seed=${seed}&model=flux&token=desktophut&negative_prompt=worst%20quality%2C%20blurry`

    try {
      const response = await axios.get(url, { responseType: "blob" })
      const imageUrl = URL.createObjectURL(response.data)
      setImageUrl(imageUrl)
    } catch (error) {
      console.error("Error fetching the image:", error)
      setError("Failed to generate logo. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-black  transition-colors duration-200">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400">AI Logo Generator</h1>
        
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-black rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-black dark:text-gray-200">Logo Details</h2>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 bg-">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-black dark:text-gray-300 mb-1"
                >
                  Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
                  Service/Industry
                </label>
                <input
                  id="service"
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="E.g., software development, retail, healthcare"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="colors" className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
                  Color Scheme
                </label>
                <input
                  id="colors"
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="E.g., purple and gold, blue gradient"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="extraFeatures"
                  className="block text-sm font-medium text-black dark:text-gray-300 mb-1"
                >
                  Design Style
                </label>
                <input
                  id="extraFeatures"
                  type="text"
                  value={extraFeatures}
                  onChange={(e) => setExtraFeatures(e.target.value)}
                  placeholder="E.g., minimalist, 3D, geometric, abstract"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="customPrompt"
                  className="block text-sm font-medium text-black dark:text-gray-300 mb-1"
                >
                  Custom AI Prompt
                </label>
                <textarea
                  id="customPrompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Or enter your own detailed prompt for the AI"
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave empty to use the fields above, or write your own prompt for complete control
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleGenerateLogo}
                disabled={loading}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Generating Logo...
                  </>
                ) : (
                  <>
                    <Image size={20} className="mr-2" />
                    Generate Logo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-black rounded-xl shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-black dark:text-gray-200 mb-4">Logo Preview</h2>

            {imageUrl ? (
              <div className="flex-1 flex flex-col">
                <div className="relative bg-gray-100 dark:bg-black border-black dark:border-white rounded-lg p-4 flex-1 flex items-center justify-center">
                  <div className="grid grid-cols-8 grid-rows-8 absolute inset-0 opacity-10">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-gray-300 dark:border-gray-600"></div>
                    ))}
                  </div>
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Logo for ${companyName || "Custom Design"}`}
                    className="max-w-full max-h-[300px] rounded-md shadow-lg"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={handleGenerateLogo}
                    className="flex-1 py-2 px-3 bg-gray-200 dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    <RefreshCw size={18} className="mr-2" />
                    Regenerate
                  </button>

                  <a
                    href={imageUrl}
                    download={`${companyName || "logo"}.png`}
                    className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Download size={18} className="mr-2" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-gray-100 dark:bg-black rounded-lg flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Image size={40} className="text-purple-500 dark:text-purple-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Fill in the details and click "Generate Logo" to create your custom logo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Pollinations AI • Images are generated using AI technology</p>
          <p className="mt-1">For commercial use, please verify the licensing requirements of the generated content</p>
        </div>
      </div>
    </div>
  )
}

export default GenerateLogo