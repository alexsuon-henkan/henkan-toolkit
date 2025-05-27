import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"
import DurationCalculatorPage from "./DurationCalculatorPage"

export const metadata = generateMetadata({
  title: "A/B Test Duration Calculator",
  description: "Calculate the optimal duration for your A/B tests with our powerful Duration Calculator.",
  keywords: ["A/B test", "duration", "sample size", "statistical power", "Henkan Toolkit"],
  pathname: "/duration-calculator",
  type: "article",
  publishedTime: "2023-02-01T00:00:00Z",
  modifiedTime: "2023-07-20T00:00:00Z",
})

export default function Page() {
  return (
    <>
      <SchemaOrgWebPage
        title="A/B Test Duration Calculator | Henkan Toolkit"
        description="Calculate the optimal duration for your A/B tests with our powerful Duration Calculator."
        pathname="/duration-calculator"
      />
      <DurationCalculatorPage />
    </>
  )
}
