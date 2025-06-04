import { MaxExperimentsCalculator } from "@/components/MaxExperimentsCalculator"
import { generateMetadata } from "@/components/SEO"

export const metadata = generateMetadata({
  title: "Maximum Experiments Calculator | A/B Testing Toolkit",
  description: "Calculate how many A/B tests you can run per year based on your traffic and statistical requirements.",
  pathname: "/max-experiments",
})

export default function MaxExperimentsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Maximum Experiments Calculator</h1>
          <p className="text-muted-foreground text-lg">
            Determine your annual A/B testing capacity based on traffic, conversion rates, and desired statistical
            precision.
          </p>
        </div>

        <MaxExperimentsCalculator />
      </div>
    </div>
  )
}
