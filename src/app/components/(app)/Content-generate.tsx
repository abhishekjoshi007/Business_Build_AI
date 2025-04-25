"use client"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Sparkles } from "lucide-react"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
type ContentType = "blog" | "social-post" | "script" | "article" | "email"
import { useSession } from "next-auth/react"

interface GeneratedContent {
  title: string
  type: ContentType
  content: string
  imageUrl: string
}

export default function AIContentGenerator() {
  const router = useRouter() 
     const { update } = useSession() // Get the update function
  const { theme } = useTheme()
  const [title, setTitle] = useState("")
  const [contentType, setContentType] = useState<ContentType | "">("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)

  const handleGenerate = async () => {
    if (!title || !contentType || !description) return

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          contentType,
          description,
        }),
      });

      if (response.status === 403) {
        router.push('/plans')
        return
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }
      if (response.ok) {
        await update() // This will refetch the session with updated credits
      }
      setGeneratedContent({
        title,
        type: contentType as ContentType,
        content: data.content,
        imageUrl: data.imageUrl,
      })

      // Optional: show the image prompt to users
    } catch (error) {
      console.error("Generation failed:", error)
      // Fallback with the description as content
      setGeneratedContent({
        title,
        type: contentType as ContentType,
        content: `This is a generated ${contentType} about "${title}".\n\n${description}`,
        imageUrl: `/placeholder.svg?height=300&width=600&text=AI+Generated+Image+for+${encodeURIComponent(
          title
        )}`,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const contentTypeLabels: Record<ContentType, string> = {
    blog: "Blog Post",
    "social-post": "Social Media Post",
    script: "Video/Podcast Script",
    article: "Article",
    email: "Email Newsletter",
  }

  return (
    <div className="space-y-8 p-4">
      {/* Fullscreen Loader */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin text-white w-16 h-16 mb-4" />
            <p className="text-white text-lg font-medium">Generating Content...</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Content Generator</h1>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Fill in the details below to generate AI-powered content. Once generated, you can edit and refine the content to
        match your needs.
      </p>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            What is the title of your content?
          </label>
          <input
            id="title"
            type="text"
            placeholder="E.g., 10 Tips for Productive Remote Work"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="content-type" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            What type of content do you want to create?
          </label>
          <select
            id="content-type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="" disabled>
              Select content type
            </option>
            <option value="blog">Blog Post</option>
            <option value="social-post">Social Media Post</option>
            <option value="script">Video/Podcast Script</option>
            <option value="article">Article</option>
            <option value="email">Email Newsletter</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Describe what you want the content to be about
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Example: A comprehensive guide for beginners about artificial intelligence and its applications in everyday
            life.
          </p>
          <textarea
            id="description"
            placeholder="Enter your content description here..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <button
            className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
              !title || !contentType || !description || isGenerating
                ? "bg-purple-300 dark:bg-purple-800 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
            }`}
            onClick={handleGenerate}
            disabled={!title || !contentType || !description }
          >
            {isGenerating ? (
              <>
                <Loader className="mr-2" />
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Content
              </>
            )}
          </button>
        </div>
      </div>

      {generatedContent && (
        <div className="mt-8 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Generated {contentTypeLabels[generatedContent.type]}
              </h3>
              <h2 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{generatedContent.title}</h2>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{generatedContent.content}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Generated Image</h4>
              <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                <img
                  src={generatedContent.imageUrl || "/placeholder.svg"}
                  alt={`AI generated image for ${generatedContent.title}`}
                  className="w-full h-auto"
                />
              </div>
            </div>

          
          </div>
        </div>
      )}
    </div>
  )
}