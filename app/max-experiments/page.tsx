import { MaxExperimentsCalculator } from "@/components/MaxExperimentsCalculator"
import { MaxExperimentsFAQModal } from "@/components/MaxExperimentsFAQModal"
import { generateMetadata } from "@/components/SEO"

export const metadata = generateMetadata({
  title: "Maximum Experiments Calculator | A/B Testing Toolkit",
  description: "Calculate how many A/B tests you can run per year based on your traffic and statistical requirements.",
  pathname: "/max-experiments",
})

export default function MaxExperimentsPage() {
  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Maximum Experiments Calculator</h1>
          <p className="text-gray-600 text-lg mb-6">
            Determine how many A/B tests you can run each year based on your traffic and statistical requirements
          </p>
          <div className="flex justify-center gap-4">
            <MaxExperimentsFAQModal />
          </div>
        </div>

        <MaxExperimentsCalculator />
      </div>
    </div>
  )
}
