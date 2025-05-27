import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"
import AOVCalculatorPage from "./AOVCalculatorPage"

export const metadata = generateMetadata({
  title: "Free AOV Calculator",
  description:
    "Calculate and analyze your Average Order Value (AOV) with our free AOV Calculator. Sign in to access this powerful tool.",
  keywords: ["free AOV calculator", "average order value", "e-commerce analytics", "Henkan Toolkit"],
  pathname: "/aov-calculator",
  type: "article",
  publishedTime: "2023-02-01T00:00:00Z",
  modifiedTime: "2023-07-20T00:00:00Z",
})

export default function Page() {
  return (
    <>
      <SchemaOrgWebPage
        title="Free AOV Calculator | Henkan Toolkit"
        description="Calculate and analyze your Average Order Value (AOV) with our free AOV Calculator."
        pathname="/aov-calculator"
      />
      <AOVCalculatorPage />
    </>
  )
}
