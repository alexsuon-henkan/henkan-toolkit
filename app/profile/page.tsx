"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { UpdateProfile } from "@/components/UpdateProfile"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 mx-auto">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Update Your Display Name</h2>
            <UpdateProfile />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
