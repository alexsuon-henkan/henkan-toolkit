import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"
import FrequentistCalculatorPage from "./FrequentistCalculatorPage"

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

export default function Page() {
  return (
    <>
      <SchemaOrgWebPage
        title="A/B Test Calculator | Henkan Toolkit"
        description="Calculate your A/B test results using the frequentist approach with our powerful A/B Test Calculator."
        pathname="/"
      />
      <FrequentistCalculatorPage />
    </>
  )
}
