"use client"

import { Phone, Mail, Globe, MapPin, Briefcase, User, ChevronRight } from "lucide-react"

interface CardData {
  name: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  address: string
  color: string
  style: string
}

// Helper function to ensure text is readable on any background
const getContrastColor = (hexColor: string): string => {
  // Default to dark text if no color provided
  if (!hexColor || hexColor === "#ffffff" || hexColor === "white") {
    return "#333333"
  }

  // Convert hex to RGB
  let r = 0,
    g = 0,
    b = 0

  // 3 digits
  if (hexColor.length === 4) {
    r = Number.parseInt(hexColor[1] + hexColor[1], 16)
    g = Number.parseInt(hexColor[2] + hexColor[2], 16)
    b = Number.parseInt(hexColor[3] + hexColor[3], 16)
  }
  // 6 digits
  else if (hexColor.length === 7) {
    r = Number.parseInt(hexColor.substring(1, 3), 16)
    g = Number.parseInt(hexColor.substring(3, 5), 16)
    b = Number.parseInt(hexColor.substring(5, 7), 16)
  }

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black or white based on luminance
  return luminance > 0.5 ? "#333333" : "#ffffff"
}

const ModernCard = ({ data }: { data: CardData }) => {
  const textColor = getContrastColor(data.color)
  const isLightColor = textColor === "#333333"

  return (
    <div className="aspect-[1.75] w-full bg-white rounded-lg shadow-lg overflow-hidden flex">
      {/* Left color bar */}
      <div className="w-1/6" style={{ backgroundColor: data.color }}></div>

      {/* Main content */}
      <div className="w-5/6 p-6 relative">
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-40 h-40 transform translate-x-20 -translate-y-20 rounded-full"
          style={{ backgroundColor: data.color, opacity: 0.1 }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-24 h-24 transform -translate-x-1/2 translate-y-12 rounded-full"
          style={{ backgroundColor: data.color, opacity: 0.05 }}
        />

        <div className="relative z-10">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: data.color }}>
            {data.name}
          </h2>
          <p className="text-gray-600 font-medium">{data.title}</p>

          <div className="mt-1 w-12 h-0.5" style={{ backgroundColor: data.color }}></div>

          <p className="text-gray-800 font-bold mt-3 flex items-center">
            <Briefcase className="w-4 h-4 mr-1" style={{ color: data.color }} />
            {data.company}
          </p>

          <div className="mt-4 space-y-2">
            {data.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" style={{ color: data.color }} />
                <span className="truncate">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" style={{ color: data.color }} />
                {data.phone}
              </div>
            )}
            {data.website && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-2" style={{ color: data.color }} />
                <span className="truncate">{data.website}</span>
              </div>
            )}
            {data.address && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" style={{ color: data.color }} />
                <span className="truncate">{data.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ClassicCard = ({ data }: { data: CardData }) => (
  <div
    className="aspect-[1.75] w-full bg-white rounded-lg shadow-lg p-6 border-t-8 relative"
    style={{ borderColor: data.color }}
  >
    {/* Decorative corner elements */}
    <div
      className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 rounded-tl-lg"
      style={{ borderColor: data.color }}
    ></div>
    <div
      className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 rounded-tr-lg"
      style={{ borderColor: data.color }}
    ></div>
    <div
      className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 rounded-bl-lg"
      style={{ borderColor: data.color }}
    ></div>
    <div
      className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 rounded-br-lg"
      style={{ borderColor: data.color }}
    ></div>

    <div className="text-center">
      <h2 className="text-2xl font-serif" style={{ color: data.color }}>
        {data.name}
      </h2>
      <p className="text-gray-600 italic">{data.title}</p>
      <div className="w-24 h-0.5 mx-auto my-3" style={{ backgroundColor: data.color }} />
      <p className="text-gray-800 font-bold">{data.company}</p>
    </div>

    <div className="mt-4 flex justify-center">
      <div className="grid grid-cols-1 gap-2 text-center">
        {data.email && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Mail className="w-3.5 h-3.5 mr-1.5" style={{ color: data.color }} />
            <span>{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Phone className="w-3.5 h-3.5 mr-1.5" style={{ color: data.color }} />
            <span>{data.phone}</span>
          </div>
        )}
        {data.website && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Globe className="w-3.5 h-3.5 mr-1.5" style={{ color: data.color }} />
            <span>{data.website}</span>
          </div>
        )}
        {data.address && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5 mr-1.5" style={{ color: data.color }} />
            <span>{data.address}</span>
          </div>
        )}
      </div>
    </div>
  </div>
)

const MinimalistCard = ({ data }: { data: CardData }) => (
  <div className="aspect-[1.75] w-full bg-white rounded-lg shadow-lg p-8 relative">
    {/* Subtle dot pattern background */}
    <div className="absolute inset-0 opacity-5">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `radial-gradient(${data.color} 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
        }}
      ></div>
    </div>

    <div className="h-full flex flex-col justify-between relative z-10">
      <div>
        <h2 className="text-2xl font-light tracking-wide">{data.name}</h2>
        <p className="text-sm text-gray-500 mt-1">{data.title}</p>
      </div>

      <div>
        <div
          className="w-8 h-8 mb-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: data.color }}
        >
          <User className="w-4 h-4 text-white" />
        </div>

        <p className="text-lg font-medium mb-3" style={{ color: data.color }}>
          {data.company}
        </p>

        <div className="space-y-1 text-sm text-gray-600">
          {data.email && (
            <div className="flex items-center">
              <span className="w-4 mr-2 opacity-50">—</span>
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center">
              <span className="w-4 mr-2 opacity-50">—</span>
              <span>{data.phone}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center">
              <span className="w-4 mr-2 opacity-50">—</span>
              <span>{data.website}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center">
              <span className="w-4 mr-2 opacity-50">—</span>
              <span>{data.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)

const BoldCard = ({ data }: { data: CardData }) => {
  const textColor = getContrastColor(data.color)

  return (
    <div
      className="aspect-[1.75] w-full rounded-lg shadow-lg relative overflow-hidden"
      style={{ backgroundColor: data.color }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full transform -translate-x-24 translate-y-24" />

      {/* Diagonal stripes */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${textColor}, ${textColor} 2px, transparent 2px, transparent 10px)`,
          }}
        ></div>
      </div>

      <div className="relative z-10 h-full p-6" style={{ color: textColor }}>
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{data.name}</h2>
            <p className="text-lg opacity-90">{data.title}</p>

            <div className="flex items-center mt-3">
              <div className="w-8 h-1 bg-current opacity-50"></div>
              <ChevronRight className="w-4 h-4 mx-1 opacity-50" />
              <p className="text-xl font-bold">{data.company}</p>
            </div>
          </div>

          <div className="space-y-1.5 text-sm">
            {data.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 opacity-80" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 opacity-80" />
                <span>{data.phone}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 opacity-80" />
                <span>{data.website}</span>
              </div>
            )}
            {data.address && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 opacity-80" />
                <span>{data.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// New gradient style card
const GradientCard = ({ data }: { data: CardData }) => {
  const baseColor = data.color || "#6366f1"
  const textColor = getContrastColor(baseColor)

  // Create a lighter version of the color for gradient
  const lighterColor = baseColor === "#ffffff" ? "#f3f4f6" : baseColor

  return (
    <div
      className="aspect-[1.75] w-full rounded-lg shadow-lg overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${lighterColor} 0%, ${adjustColorBrightness(lighterColor, -30)} 100%)`,
      }}
    >
      {/* Card content */}
      <div className="h-full p-6 flex" style={{ color: textColor }}>
        {/* Left side with name and title */}
        <div className="w-2/5 border-r border-white border-opacity-20 pr-4 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{data.name}</h2>
            <p className="text-sm opacity-80 mt-1">{data.title}</p>
          </div>

          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <p className="font-bold text-center">{data.company}</p>
          </div>
        </div>

        {/* Right side with contact details */}
        <div className="w-3/5 pl-4 flex flex-col justify-center">
          <div className="space-y-2">
            {data.email && (
              <div className="flex items-center text-sm">
                <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                  <Mail className="w-3 h-3" />
                </div>
                <span className="truncate">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center text-sm">
                <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                  <Phone className="w-3 h-3" />
                </div>
                <span>{data.phone}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center text-sm">
                <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                  <Globe className="w-3 h-3" />
                </div>
                <span className="truncate">{data.website}</span>
              </div>
            )}
            {data.address && (
              <div className="flex items-center text-sm">
                <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="truncate">{data.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// New dark elegant card
const ElegantCard = ({ data }: { data: CardData }) => {
  const accentColor = data.color || "#6366f1"

  return (
    <div className="aspect-[1.75] w-full bg-gray-900 rounded-lg shadow-lg overflow-hidden relative">
      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-32 h-32"
        style={{
          background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
        }}
      ></div>

      <div
        className="absolute bottom-0 left-0 w-40 h-40"
        style={{
          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
        }}
      ></div>

      {/* Card content */}
      <div className="h-full p-6 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center">
            <div className="w-1 h-6 mr-3" style={{ backgroundColor: accentColor }}></div>
            <h2 className="text-2xl font-bold text-white">{data.name}</h2>
          </div>
          <p className="text-gray-400 ml-4 mt-1">{data.title}</p>

          <div className="mt-3 ml-4">
            <p className="text-lg font-medium" style={{ color: accentColor }}>
              {data.company}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {data.email && (
            <div className="flex items-center text-sm text-gray-300">
              <Mail className="w-4 h-4 mr-2" style={{ color: accentColor }} />
              <span className="truncate">{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center text-sm text-gray-300">
              <Phone className="w-4 h-4 mr-2" style={{ color: accentColor }} />
              <span>{data.phone}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center text-sm text-gray-300">
              <Globe className="w-4 h-4 mr-2" style={{ color: accentColor }} />
              <span className="truncate">{data.website}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="w-4 h-4 mr-2" style={{ color: accentColor }} />
              <span className="truncate">{data.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number): string {
  // Convert hex to RGB
  let r = Number.parseInt(hex.substring(1, 3), 16)
  let g = Number.parseInt(hex.substring(3, 5), 16)
  let b = Number.parseInt(hex.substring(5, 7), 16)

  // Adjust brightness
  r = Math.min(255, Math.max(0, r + (r * percent) / 100))
  g = Math.min(255, Math.max(0, g + (g * percent) / 100))
  b = Math.min(255, Math.max(0, b + (b * percent) / 100))

  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`
}

export const CardPreview = ({ data }: { data: CardData }) => {
  // Ensure we have a valid color
  const safeData = {
    ...data,
    color: data.color || "#6366f1", // Default to indigo if no color provided
  }

  const cards = {
    modern: ModernCard,
    classic: ClassicCard,
    minimalist: MinimalistCard,
    bold: BoldCard,
    gradient: GradientCard,
    elegant: ElegantCard,
  }

  const SelectedCard = cards[safeData.style as keyof typeof cards] || ModernCard
  return <SelectedCard data={safeData} />
}
