import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"
import RevenueCalculatorPage from "./RevenueCalculatorPage"

export const metadata = generateMetadata({
  title: "Free Revenue Calculator",
  description:
    "Calculate the potential revenue impact of your A/B test results with our free Revenue Calculator. Sign in to access this powerful tool.",
  keywords: ["free revenue calculator", "A/B testing", "conversion rate optimization", "Henkan Toolkit"],
  pathname: "/revenue-calculator",
  type: "article",
  publishedTime: "2023-02-01T00:00:00Z",
  modifiedTime: "2023-07-20T00:00:00Z",
})

export default function Page() {
  return (
    <>
      <SchemaOrgWebPage
        title="Free Revenue Calculator | Henkan Toolkit"
        description="Calculate the potential revenue impact of your A/B test results with our free Revenue Calculator."
        pathname="/revenue-calculator"
      />
      <RevenueCalculatorPage />
    </>
  )
}
