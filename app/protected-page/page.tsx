"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This is a protected page. Only authenticated users can see this.</div>
    </ProtectedRoute>
  )
}
