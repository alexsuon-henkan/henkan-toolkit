import { MethodAssistant } from "@/components/MethodAssistant"
import { SEO } from "@/components/SEO"

export default function MethodAssistantPage() {
  return (
    <>
      <SEO
        title="Method Assistant - AI-Powered Testing Recommendations"
        description="Get personalized testing method recommendations for your digital projects using AI analysis"
        keywords="testing methods, A/B testing, user research, experimentation, AI assistant"
      />
      <div className="min-h-screen bg-gray-50 pl-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Method Assistant</h1>
            <p className="text-gray-600 text-lg mb-6">
              Describe your project and get AI-powered recommendations on the best testing methods to use
            </p>
          </div>
          <MethodAssistant />
        </div>
      </div>
    </>
  )
}
