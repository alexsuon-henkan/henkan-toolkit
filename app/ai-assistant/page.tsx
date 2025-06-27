import { AIAssistant } from "@/components/AIAssistant"
import { SEO } from "@/components/SEO"

export default function AIAssistantPage() {
  return (
    <>
      <SEO
        title="AI Assistant - Banner & Modal Generator"
        description="Generate JavaScript code for website banners and modals using AI. Upload a screenshot and describe your component to get production-ready code."
        keywords="ai assistant, banner generator, modal generator, javascript code, a/b testing, web development"
      />
      <AIAssistant />
    </>
  )
}
