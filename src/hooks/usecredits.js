// hooks/useCredits.ts
"use client"

import { useSession, update } from "next-auth/react"

export function useCredits() {
  const { data: session, update: updateSession } = useSession()

  const updateCredits = async (change) => {
    try {
      // Optimistic UI update
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          credits: (session?.user?.credits || 0) + change
        }
      })

      // Server sync
      const res = await fetch('/api/update-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change })
      })

      if (!res.ok) throw new Error("Credit update failed")

      const data = await res.json()
      
      // Final update with server-confirmed value
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          credits: data.credits
        }
      })

      return data.credits
    } catch (error) {
      // Revert on error
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          credits: (session?.user?.credits || 0) - change
        }
      })
      throw error
    }
  }

  return {
    credits: session?.user?.credits || 0,
    deductCredits: () => updateCredits(-1),
    addCredits: (amount) => updateCredits(amount),
    updateCredits
  }
}