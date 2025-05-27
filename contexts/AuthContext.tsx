"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/utils/supabase"

type AuthContextType = {
  user: User | null
  loading: boolean
  displayName: string | null
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, displayName: null })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState<string | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setDisplayName(session?.user?.user_metadata.display_name ?? null)
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, displayName }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
