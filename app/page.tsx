import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"
import ABTestCalculator from "@/components/ABTestCalculator"

export const metadata = {
  ...generateMetadata({
    title: "A/B Test Calculator",
    description:
      "Calculate your A/B test results using the frequentist approach with our powerful A/B Test Calculator.",
    keywords: ["A/B test", "frequentist", "statistical significance", "conversion rate"],
    pathname: "/",
    type: "article",
    publishedTime: "2023-01-01T00:00:00Z",
    modifiedTime: "2023-07-15T00:00:00Z",
  }),
  verification: {
    google: "nYtosMBs_vrhT1XcID1r-axLFH7YYl3Anf13bQmWccA",
  },
}

export default function HomePage() {
  return (
    <div>
      <SchemaOrgWebPage
        title="A/B Test Calculator | Henkan Toolkit"
        description="Calculate your A/B test results using the frequentist approach with our powerful A/B Test Calculator."
        pathname="/"
      />
      <ABTestCalculator />
    </div>
  )
}
