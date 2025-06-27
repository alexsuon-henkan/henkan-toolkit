import { AIAssistant } from "@/components/AIAssistant"
import { Toaster } from "@/components/ui/toaster"

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto py-10">
      <AIAssistant />
      <Toaster />
    </div>
  )
}
