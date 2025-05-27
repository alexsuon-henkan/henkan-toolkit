import type { Metadata } from "next"
import { fetchApiStatus } from "@/utils/api"
import { StatusTable } from "./StatusTable"

export const metadata: Metadata = {
  title: "API Status | Henkan Toolkit",
  description: "Current status of Henkan Toolkit API endpoints",
}

export const revalidate = 60 // Revalidate this page every 60 seconds

export default async function APIStatusPage() {
  const apiEndpoints = await fetchApiStatus()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Status</h1>
      <StatusTable apiEndpoints={apiEndpoints} />
      <p className="mt-4 text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
    </div>
  )
}
