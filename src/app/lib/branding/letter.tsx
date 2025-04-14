"use client"

import { Mail, MapPin, Phone, Globe, Calendar, FileText, Building, User, Briefcase } from "lucide-react"

interface LetterData {
  senderName: string
  senderCompany: string
  senderEmail: string
  senderPhone?: string
  senderWebsite?: string
  style: string
  accentColor?: string
  includeLetterhead?: boolean
  includeSignature?: boolean
  dateFormat?: string
}

// Helper function to format the date based on the specified format
const formatDate = (format?: string) => {
  const date = new Date()

  switch (format) {
    case "formal":
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
        .format(date)
        .replace(/(\d+)/, "$1th")
    case "iso":
      return date.toISOString().split("T")[0]
    default: // standard
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
  }
}

// Modern Letter Style
const ModernLetter = ({ data }: { data: LetterData }) => {
  const formattedDate = formatDate(data.dateFormat)

  return (
    <div className="aspect-[0.707] w-full bg-white rounded-lg shadow-lg p-8 relative">
      {/* Company Header */}
      {data.includeLetterhead !== false && (
        <div className="text-left mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{data.senderCompany}</h2>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{data.senderEmail}</span>
            </div>
            {data.senderPhone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>{data.senderPhone}</span>
              </div>
            )}
            {data.senderWebsite && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                <span>{data.senderWebsite}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date */}
      <div className="text-gray-600 mb-6">{formattedDate}</div>

      {/* Blank Space for Recipient */}
      <div className="text-gray-800 mb-8 h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 italic">[Space for Recipient Details]</div>
      </div>

      {/* Placeholder for letter content */}
      <div className="text-gray-400 italic mb-8">[Your letter content would appear here]</div>

      {/* Sender's Name */}
      {data.includeSignature !== false && (
        <div className="mt-auto pt-8 border-t border-gray-200">
          <div className="text-gray-800 font-medium">{data.senderName}</div>
          <div className="text-gray-600">{data.senderCompany}</div>
        </div>
      )}
    </div>
  )
}

// Classic Letter Style
const ClassicLetter = ({ data }: { data: LetterData }) => {
  const formattedDate = formatDate(data.dateFormat)

  return (
    <div className="aspect-[0.707] w-full bg-white rounded-lg shadow-lg p-8 relative border-t-8 border-gray-800">
      {/* Letterhead */}
      {data.includeLetterhead !== false && (
        <div className="text-center mb-12 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-serif text-gray-800">{data.senderCompany}</h2>
          <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm text-gray-600">
            {data.senderEmail && <div>{data.senderEmail}</div>}
            {data.senderPhone && <div>{data.senderPhone}</div>}
            {data.senderWebsite && <div>{data.senderWebsite}</div>}
          </div>
        </div>
      )}

      {/* Date */}
      <div className="text-gray-600 mb-8 font-serif">{formattedDate}</div>

      {/* Recipient Address */}
      <div className="text-gray-800 mb-8 font-serif">
        {data.recipientName && <div>{data.recipientName}</div>}
        {data.recipientCompany && <div>{data.recipientCompany}</div>}
        {data.recipientAddress ? <div>{data.recipientAddress}</div> : <div>[Recipient's Address]</div>}
      </div>

      {/* Subject Line */}
      {data.subject && <div className="font-serif font-medium text-gray-800 mb-6 underline">{data.subject}</div>}

      {/* Placeholder for letter content */}
      <div className="text-gray-400 italic mb-8 font-serif">[Your letter content would appear here]</div>

      {/* Sender's Name */}
      {data.includeSignature !== false && (
        <div className="mt-auto pt-8 text-right">
          <div className="text-gray-800 font-serif">{data.senderName}</div>
          <div className="text-gray-600">{data.senderCompany}</div>
        </div>
      )}
    </div>
  )
}

// Minimalist Letter Style
const MinimalistLetter = ({ data }: { data: LetterData }) => {
  const formattedDate = formatDate(data.dateFormat)

  return (
    <div className="aspect-[0.707] w-full bg-white rounded-lg shadow-lg p-12 relative">
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        {data.includeLetterhead !== false && (
          <div className="mb-16">
            <h2 className="text-2xl font-light tracking-wide text-gray-800">{data.senderCompany}</h2>
            <div className="w-12 h-0.5 bg-gray-400 mt-4"></div>
            {(data.senderEmail || data.senderPhone || data.senderWebsite) && (
              <div className="mt-4 text-sm text-gray-500 font-light">
                {data.senderEmail && <div>{data.senderEmail}</div>}
                {data.senderPhone && <div>{data.senderPhone}</div>}
                {data.senderWebsite && <div>{data.senderWebsite}</div>}
              </div>
            )}
          </div>
        )}

        {/* Date */}
        <div className="text-gray-600 mb-8 font-light">{formattedDate}</div>

        {/* Recipient Address */}
        <div className="text-gray-800 mb-8 font-light">
          {data.recipientName && <div>{data.recipientName}</div>}
          {data.recipientCompany && <div>{data.recipientCompany}</div>}
          {data.recipientAddress ? <div>{data.recipientAddress}</div> : <div>[Recipient's Address]</div>}
        </div>

        {/* Subject Line */}
        {data.subject && <div className="font-normal text-gray-800 mb-6">{data.subject}</div>}

        {/* Placeholder for letter content */}
        <div className="text-gray-400 italic mb-8">[Your letter content would appear here]</div>

        {/* Footer */}
        {data.includeSignature !== false && (
          <div className="mt-auto pt-16">
            <div className="text-gray-800 font-medium">{data.senderName}</div>
            <div className="text-gray-500 text-sm mt-1">{data.senderCompany}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Premium Letter Style
const PremiumLetter = ({ data }: { data: LetterData }) => {
  const accentColor = data.accentColor || "#6d28d9" // Default to purple if no color provided
  const formattedDate = formatDate(data.dateFormat)

  return (
    <div className="aspect-[0.707] w-full bg-white rounded-lg shadow-xl p-0 relative overflow-hidden">
      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 rounded-full opacity-10"
        style={{ backgroundColor: accentColor }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-32 h-32 -ml-10 -mb-10 rounded-full opacity-10"
        style={{ backgroundColor: accentColor }}
      ></div>

      {/* Header with accent color */}
      {data.includeLetterhead !== false && (
        <div className="p-6 mb-8" style={{ backgroundColor: accentColor }}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{data.senderCompany}</h2>
              <div className="h-1 w-12 bg-white/50 mt-2 rounded-full"></div>
            </div>
            <div className="flex items-center bg-white/10 px-3 py-1 rounded-full text-white text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="px-8 pb-8">
        {/* Contact info */}
        {data.includeLetterhead !== false && (
          <div className="flex flex-wrap gap-4 mb-8 text-sm">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" style={{ color: accentColor }} />
              <span>{data.senderEmail}</span>
            </div>
            {data.senderPhone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" style={{ color: accentColor }} />
                <span>{data.senderPhone}</span>
              </div>
            )}
            {data.senderWebsite && (
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2" style={{ color: accentColor }} />
                <span>{data.senderWebsite}</span>
              </div>
            )}
          </div>
        )}

        {/* Recipient section */}
        <div className="mb-8">
          <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">To</div>
          <div className="p-4 border-l-2 bg-gray-50 rounded-r-md" style={{ borderColor: accentColor }}>
            <div className="text-gray-800">{data.recipientName || "[Recipient's Name]"}</div>
            {data.recipientCompany && <div className="text-gray-700">{data.recipientCompany}</div>}
            <div className="text-gray-600 mt-1">{data.recipientAddress || "[Recipient's Address]"}</div>
          </div>
        </div>

        {/* Subject line */}
        <div className="mb-8">
          <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Subject</div>
          <div className="font-medium text-gray-800">{data.subject || "[Letter Subject]"}</div>
        </div>

        {/* Placeholder for letter content */}
        <div className="mb-8 text-gray-400 text-sm italic">[Letter content would appear here]</div>

        {/* Signature area */}
        {data.includeSignature !== false && (
          <div className="mt-12 flex items-end justify-between">
            <div>
              <div className="h-0.5 w-16 mb-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
              <div className="text-gray-800 font-medium">{data.senderName}</div>
              <div className="text-gray-600 text-sm">{data.senderCompany}</div>
            </div>

            {/* QR code placeholder */}
            <div
              className="w-16 h-16 border-2 rounded-md flex items-center justify-center text-xs text-gray-400"
              style={{ borderColor: accentColor + "40" }}
            >
              QR Code
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Corporate Letter Style
const CorporateLetter = ({ data }: { data: LetterData }) => {
  const accentColor = data.accentColor || "#6d28d9"
  const formattedDate = formatDate(data.dateFormat)

  return (
    <div className="aspect-[0.707] w-full bg-white rounded-lg shadow-lg p-0 relative overflow-hidden">
      {/* Header */}
      {data.includeLetterhead !== false && (
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(45deg, ${accentColor} 25%, transparent 25%, transparent 50%, ${accentColor} 50%, ${accentColor} 75%, transparent 75%, transparent)`,
                backgroundSize: "10px 10px",
              }}
            ></div>
          </div>

          <div className="relative p-6 border-b-4" style={{ borderColor: accentColor }}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold" style={{ color: accentColor }}>
                  {data.senderCompany}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                  {data.senderEmail && (
                    <div className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1" />
                      <span>{data.senderEmail}</span>
                    </div>
                  )}
                  {data.senderPhone && (
                    <div className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1" />
                      <span>{data.senderPhone}</span>
                    </div>
                  )}
                  {data.senderWebsite && (
                    <div className="flex items-center">
                      <Globe className="w-3.5 h-3.5 mr-1" />
                      <span>{data.senderWebsite}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">{formattedDate}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="p-8">
        {/* Reference number */}
        <div className="mb-6 text-sm">
          <span className="font-medium text-gray-700">Ref:</span>{" "}
          {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </div>

        {/* Recipient */}
        <div className="mb-8">
          {data.recipientName && <div className="font-medium">{data.recipientName}</div>}
          {data.recipientCompany && <div className="font-medium">{data.recipientCompany}</div>}
          <div className="text-gray-700 mt-1">{data.recipientAddress || "[Recipient's Address]"}</div>
        </div>

        {/* Subject */}
        {data.subject && (
          <div className="mb-6">
            <div className="font-bold" style={{ color: accentColor }}>
              RE: {data.subject}
            </div>
          </div>
        )}

        {/* Salutation */}
        <div className="mb-6">Dear {data.recipientName?.split(" ")[0] || "Sir/Madam"},</div>

        {/* Placeholder for letter content */}
        <div className="mb-8 text-gray-400 italic">[Your letter content would appear here]</div>

        {/* Closing */}
        <div className="mb-2">Yours sincerely,</div>

        {/* Signature */}
        {data.includeSignature !== false && (
          <div className="mt-8">
            <div className="font-medium">{data.senderName}</div>
            <div className="text-gray-700">{data.senderCompany}</div>
            <div className="text-sm text-gray-600 mt-1">
              {data.senderEmail && <div>{data.senderEmail}</div>}
              {data.senderPhone && <div>{data.senderPhone}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Executive Letter Style
const ExecutiveLetter = ({ data }: { data: LetterData }) => {
  const accentColor = data.accentColor || "#6d28d9"
  const formattedDate = formatDate(data.dateFormat)

  return (
    <div className="aspect-[0.707] w-full bg-white rounded-lg shadow-lg relative overflow-hidden">
      {/* Side accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-16" style={{ backgroundColor: accentColor }}>
        <div className="h-full flex flex-col items-center justify-between py-8 text-white">
          <Building className="w-6 h-6" />
          <div className="writing-vertical-lr transform rotate-180 tracking-widest uppercase text-xs font-medium">
            {data.senderCompany.substring(0, 20)}
          </div>
          <FileText className="w-6 h-6" />
        </div>
      </div>

      {/* Content area */}
      <div className="ml-16 p-8">
        {/* Header */}
        {data.includeLetterhead !== false && (
          <div className="flex justify-between items-start mb-12 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold" style={{ color: accentColor }}>
                {data.senderCompany}
              </h2>
              <div className="grid grid-cols-1 gap-1 mt-2 text-sm text-gray-600">
                {data.senderEmail && <div>{data.senderEmail}</div>}
                {data.senderPhone && <div>{data.senderPhone}</div>}
                {data.senderWebsite && <div>{data.senderWebsite}</div>}
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-4 py-2 rounded-md bg-gray-100">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Date</div>
                <div className="font-medium">{formattedDate}</div>
              </div>
            </div>
          </div>
        )}

        {/* Recipient */}
        <div className="mb-8">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 mt-1 text-gray-400" />
            <div>
              <div className="font-medium">{data.recipientName || "[Recipient's Name]"}</div>
              {data.recipientCompany && (
                <div className="flex items-center gap-1 text-gray-700">
                  <Briefcase className="w-3 h-3" />
                  <span>{data.recipientCompany}</span>
                </div>
              )}
              <div className="text-gray-600 mt-1">{data.recipientAddress || "[Recipient's Address]"}</div>
            </div>
          </div>
        </div>

        {/* Subject */}
        {data.subject && (
          <div className="mb-8">
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {data.subject}
            </div>
          </div>
        )}

        {/* Placeholder for letter content */}
        <div className="mb-12 text-gray-400 italic">[Your letter content would appear here]</div>

        {/* Signature */}
        {data.includeSignature !== false && (
          <div className="mt-auto">
            <div className="inline-block">
              <div className="w-24 h-12 mb-2 flex items-end">
                <div className="w-full h-0.5 bg-gray-400"></div>
              </div>
              <div className="font-medium">{data.senderName}</div>
              <div className="text-sm text-gray-700">{data.senderCompany}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const LetterPreview = ({ data }: { data: LetterData }) => {
  const letters = {
    modern: ModernLetter,
    classic: ClassicLetter,
    minimalist: MinimalistLetter,
    premium: PremiumLetter,
    corporate: CorporateLetter,
    executive: ExecutiveLetter,
  }

  const SelectedLetter = letters[data.style as keyof typeof letters] || ModernLetter
  return <SelectedLetter data={data} />
}
