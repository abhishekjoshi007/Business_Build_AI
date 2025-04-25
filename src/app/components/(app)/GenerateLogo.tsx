"use client"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Download, Loader2, RefreshCw, Image, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface LogoData {
  imageUrl: string;
  seed: number;
  creditsRemaining?: number;
}

const GenerateLogo: React.FC = () => {
  const router = useRouter()
  const [companyName, setCompanyName] = useState("Alembic")
  const [industry, setIndustry] = useState("pharmaceuticals")
  const [colorScheme, setColorScheme] = useState("red and black")
  const [designStyle, setDesignStyle] = useState("minimalist")
  const [extraDetails, setExtraDetails] = useState("")
  const [logoData, setLogoData] = useState<LogoData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generationCount, setGenerationCount] = useState(0)
  const [credits, setCredits] = useState<number | null>(null)

  const handleGenerateLogo = async () => {
    const seed = Math.floor(Math.random() * 2147483647)
    if (!companyName && !extraDetails) {
      setError("Please enter a company name or extra details")
      return
    }
    setError("")
    setLoading(true)

    try {
      const basePrompt = `
        Create a professional business logo for "${companyName}"${industry ? ` in the ${industry} industry` : ""}.
        Style: ${designStyle}.
        Colors: ${colorScheme || "professional color palette"}.
        ${extraDetails}
      `.replace(/\n\s+/g, " ").trim()

      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: basePrompt,
          seed,
          width: 512,
          height: 512,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error?.details || 
          data.error?.message || 
          "Failed to generate logo. Please try again."
        )
      }

      if (!data.imageUrl) {
        throw new Error("No image URL returned from server")
      }

      setLogoData({
        imageUrl: data.imageUrl,
        seed: data.seed
      })
      setCredits(data.creditsRemaining)
      setGenerationCount(prev => prev + 1)
    } catch (error) {
      console.error("Logo generation error:", error)
      setError(error.message)
      if (error.message.includes('credits')) {
        router.push('/plans')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!logoData?.imageUrl) return
    
    fetch(logoData.imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${companyName || "logo"}-v${generationCount}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
      .catch(err => {
        console.error("Download error:", err)
        setError("Failed to download image")
      })
  }
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-black transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Input Form */}
<div className="bg-white dark:bg-black rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
            Business Logo Details
          </h2>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your business name"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Industry
                </label>
                <input
                  id="industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="E.g., finance, technology, healthcare"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="colorScheme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color Palette
                </label>
                <input
                  id="colorScheme"
                  type="text"
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  placeholder="E.g., blue and silver, warm tones"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="designStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Logo Style
                </label>
                <select
                  id="designStyle"
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="minimalist">Minimalist</option>
                  <option value="modern">Modern</option>
                  <option value="abstract">Abstract</option>
                  <option value="geometric">Geometric</option>
                  <option value="emblem">Emblem</option>
                  <option value="badge">Badge</option>
                  <option value="lettermark">Lettermark</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="extraDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Extra Details
            </label>
            <textarea
              id="extraDetails"
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              placeholder="Describe your perfect business logo..."
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              For professional designers: specify exact logo requirements
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGenerateLogo}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Creating Professional Logo...
                </>
              ) : (
                <>
                  <Image className="mr-2" size={20} />
                  Generate Business Logo
                </>
              )}
            </button>
          </div>
        </div>
        {/* Preview Section */}
        <div className="bg-white dark:bg-black rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Logo Preview</h2>
            {logoData && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Version #{generationCount}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-black px-2 py-1 rounded text-gray-500 dark:text-gray-400">
                  Seed: {logoData.seed}
                </span>
              </div>
            )}
          </div>

          {logoData ? (
            <div className="flex flex-col">
              <div className="relative bg-gray-100 dark:bg-black rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-gray-300 dark:border-gray-700"></div>
                  ))}
                </div>
                <img
                  src={logoData.imageUrl}  // Changed to imageUrl
                  alt={`Professional logo for ${companyName || "your business"}`}
                  className="max-w-full max-h-[300px] object-contain"
                  onError={() => setError("Failed to load logo image")}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGenerateLogo}
                  disabled={loading || (credits !== null && credits <= 0)}
                  className="flex-1 py-2 px-3 bg-gray-200 dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="mr-2" size={18} />
                  Generate Alternative
                </button>

                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  <Download className="mr-2" size={18} />
                  Download Logo
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-black rounded-lg flex flex-col items-center justify-center p-8 min-h-[300px]">
              <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Image size={40} className="text-purple-500 dark:text-purple-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {loading ? "Creating your professional logo..." : "Your business logo will appear here"}
              </p>
              {credits !== null && credits <= 0 && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                  You have no credits remaining. Please purchase more to generate logos.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateLogo