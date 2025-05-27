"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface SignInWallProps {
  children: React.ReactNode
  toolName: string
}

export function SignInWall({ children, toolName }: SignInWallProps) {
  const { user } = useAuth()
  const router = useRouter()

  if (user) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="text-gray-600 mb-2">The {toolName} is completely free to use!</p>
        <p className="text-gray-600 mb-6">
          You just need to sign in or create an account to access it. This helps us improve our tools and provide you
          with a better experience.
        </p>
        <div className="space-y-4">
          <Button onClick={() => router.push("/login")} className="w-full">
            Sign In
          </Button>
          <Button onClick={() => router.push("/signup")} variant="outline" className="w-full">
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  )
}
