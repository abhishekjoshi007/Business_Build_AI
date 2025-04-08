// hooks/useSession.ts
'use client'

import { useEffect, useState } from 'react'

export default function useSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch session')
        }

        const data = await response.json()
        setSession(data)
      } catch (error) {
        console.error('Error fetching session:', error)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])
   console.log(session)
  return { session, loading }
}
