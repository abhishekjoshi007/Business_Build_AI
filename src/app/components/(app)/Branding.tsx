"use client"

import { CreditCard, Mail, Lightbulb, ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function MoreServicesPage() {
  const services = [
    {
      title: "AI Business Card Generator",
      description: "Create professional business cards with customized designs and information.",
      icon: <CreditCard className="w-8 h-8 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1628891439478-c613e85af7d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBjYXJkfGVufDB8fDB8fHww",
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-500 hover:to-purple-700",
      link: "/businesscard",
    },
    {
      title: "AI Business Letter Generator",
      description: "Generate professional business letters for various purposes with perfect formatting.",
      icon: <Mail className="w-8 h-8 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=1200&auto=format&fit=crop",
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-500 hover:to-purple-700",
      link: "/businessletter",
    },
    {
      title: "AI Brand Name Generator",
      description: "Discover the perfect brand name for your business with our AI-powered generator.",
      icon: <Lightbulb className="w-8 h-8 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?q=80&w=1200&auto=format&fit=crop",
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-500 hover:to-purple-700",
      link: "/brandname",
    },
  ]

  const { data, status } = useSession()
  const user = data?.user

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="max-w-6xl mx-auto">
      
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 border border-gray-300 dark:border-gray-800 hover:border-purple-500/50"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white dark:from-black via-transparent to-purple-100/50 dark:to-purple-900/50 z-10"></div>
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
                <h3 className="text-xl text-gray-600 dark:text-gray-400 font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                <Link
                  href={service.link}
                  className={`block w-full py-2.5 rounded-md bg-gradient-to-r ${service.color} ${service.hoverColor} 
                    transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/25 text-center text-white`}
                >
                  Try Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

