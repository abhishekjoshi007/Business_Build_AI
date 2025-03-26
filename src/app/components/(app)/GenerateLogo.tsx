"use client"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Download, Loader2, RefreshCw, Image, Moon, Sun, Sparkles } from "lucide-react"

const GenerateLogo: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [colorScheme, setColorScheme] = useState("")
  const [designStyle, setDesignStyle] = useState("minimalist")
  const [customPrompt, setCustomPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generationCount, setGenerationCount] = useState(0)

  console.log(process.env.NEXT_PUBLIC_HF_API_KEY)
  const handleGenerateLogo = async () => {
    if (!companyName && !customPrompt) {
      setError("Please enter a company name or custom prompt");
      return;
    }
    setError("");
    setLoading(true);
    setGenerationCount((prev) => prev + 1);
  
    const basePrompt = customPrompt || `
      Create a professional business logo for "${companyName}"${industry ? ` in the ${industry} industry` : ""}.
      Style: ${designStyle}.
      Colors: ${colorScheme || "professional color palette"}.
      Must be: vector art style, clean edges, transparent background, centered, symmetrical.
      Design elements: abstract or symbolic representation, no photorealistic elements.
      Technical requirements: high contrast, scalable, works in single color.
      Avoid: text, signatures, watermarks, complex scenes, photographs.
      Purpose: professional business branding and identity.
    `.replace(/\n\s+/g, " ").trim();
  
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: basePrompt,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate logo");
      }
  
      // Get the image blob from the response
      const imageBlob = await response.blob();
      
      // Create a URL for the blob
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error generating logo:", error);
      setError(error.message || "Failed to generate logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400">
              Professional Logo Generator
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Advanced Logo Prompt
            </label>
            <textarea
              id="customPrompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your perfect business logo..."
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Logo Preview</h2>
            {imageUrl && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Version #{generationCount}
              </span>
            )}
          </div>

          {imageUrl ? (
            <div className="flex flex-col">
              <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-gray-300 dark:border-gray-700"></div>
                  ))}
                </div>
                <img
                  src={imageUrl}
                  alt={`Professional logo for ${companyName || "your business"}`}
                  className="max-w-full max-h-[300px] object-contain"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGenerateLogo}
                  disabled={loading}
                  className="flex-1 py-2 px-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="mr-2" size={18} />
                  Generate Alternative
                </button>

                <a
                  href={imageUrl}
                  download={`${companyName || "business-logo"}-v${generationCount}.png`}
                  className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  <Download className="mr-2" size={18} />
                  Download Logo
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg flex flex-col items-center justify-center p-8 min-h-[300px]">
              <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Image size={40} className="text-purple-500 dark:text-purple-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {loading ? "Creating your professional logo..." : "Your business logo will appear here"}
              </p>
            </div>
          )}
        </div>

        {/* Logo Design Tips */}

      </div>
    </div>
  )
}

export default GenerateLogo