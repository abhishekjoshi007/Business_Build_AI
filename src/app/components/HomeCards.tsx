'use client'

import { Cpu, Code, FileText, Palette } from "lucide-react"
import { useSession } from "next-auth/react"
export default function ServicesPage() {
  const services = [
    {
      title: "AI Logo Generator",
      description: "Create unique, professional logos in seconds with our advanced AI technology.",
      icon: <Palette className="w-8 h-8 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=1200&auto=format&fit=crop",
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-500 hover:to-purple-700",
      link: "/logo",
    },
    {
      title: "AI Website Generator",
      description: "Build complete, responsive websites in minutes without any coding knowledge.",
      icon: <Code className="w-8 h-8 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-500 hover:to-purple-700",
      link: "/dashboard",
    },
    {
      title: "AI Content Generator",
      description: "Generate high-quality, SEO-optimized content for your blog, social media, or marketing campaigns.",
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1200&auto=format&fit=crop",
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-500 hover:to-purple-700",
      link: "/content",
    },
    {
      title: "AI Branding Generator",
      description: "Develop a complete brand identity including colors, typography, and design elements.",
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1200&auto=format&fit=crop",
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-500 hover:to-purple-700",
      link: "/branding",
    },
  ]
  const { data, status } = useSession()
  const user = data?.user

  if (!user) {
    return null
  }
  return (
    <div className="min-h-screen py-12 px-4 border-gray-900  bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 border border-gray-300 dark:border-gray-800 hover:border-purple-500/50"
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white dark:from-black via-transparent to-purple-100/50 dark:to-purple-900/50 z-10 
                  "
                ></div>
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className="absolute top-4 left-4 z-20 bg-white/50 dark:bg-black/50 p-2 rounded-full backdrop-blur-sm 
                  group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-all duration-300"
                >
                  {service.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl text-gray-600 dark:text-gray-400   font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                <a
                  href={service.link}
                  className={`block w-full py-2.5 rounded-md bg-gradient-to-r ${service.color} ${service.hoverColor} 
                    transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/25 text-center text-white`}
                >
                  Try Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}