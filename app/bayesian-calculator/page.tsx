import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"
import { Sidebar } from "@/components/Sidebar"
import { Footer } from "@/components/Footer"
import BayesianCalculator from "@/components/BayesianCalculator"

export const metadata = generateMetadata({
  title: "Bayesian A/B Test Calculator",
  description:
    "Calculate your A/B test results using a Bayesian approach with our powerful Bayesian A/B Test Calculator.",
  keywords: ["A/B test", "Bayesian", "statistical analysis", "conversion rate"],
  pathname: "/bayesian-calculator",
  type: "article",
  publishedTime: "2023-02-01T00:00:00Z",
  modifiedTime: "2023-07-20T00:00:00Z",
})

export default function BayesianCalculatorPage() {
  return (
    <>
      <SchemaOrgWebPage
        title="Bayesian A/B Test Calculator | Henkan Toolkit"
        description="Calculate your A/B test results using a Bayesian approach with our powerful Bayesian A/B Test Calculator."
        pathname="/bayesian-calculator"
      />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-16">
          <main className="flex-1 p-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="max-w-6xl mx-auto">
                <BayesianCalculator />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
