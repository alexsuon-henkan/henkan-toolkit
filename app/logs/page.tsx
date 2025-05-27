import type { Metadata } from "next"
import LogsContent from "@/components/LogsContent"

export const metadata: Metadata = {
  title: "Henkan Toolkit - Changelog",
  description: "View the latest updates and changes to the Henkan Toolkit.",
}

export default function LogsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LogsContent />
    </div>
  )
}
