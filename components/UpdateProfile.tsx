"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/utils/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UpdateProfile() {
  const { user, displayName: currentDisplayName } = useAuth()
  const [displayName, setDisplayName] = useState(currentDisplayName || "")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!user) {
      setError("You must be logged in to update your profile")
      return
    }

    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-4">
      <div>
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}
      <Button type="submit">Update Profile</Button>
    </form>
  )
}
