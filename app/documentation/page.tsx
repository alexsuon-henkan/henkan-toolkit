import { DocsSidebar } from "./DocsSidebar"
import { DocsContent } from "./DocsContent"
import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"

export const metadata = generateMetadata({
  title: "Documentation",
  description:
    "Comprehensive documentation for the Henkan Toolkit, covering all features, calculators, and best practices for A/B testing and statistical analysis.",
  keywords: ["documentation", "user guide", "A/B testing", "statistical analysis", "Henkan Toolkit"],
  pathname: "/documentation",
  type: "article",
  publishedTime: "2023-01-01T00:00:00Z",
  modifiedTime: "2023-07-25T00:00:00Z",
})

export default function DocumentationPage() {
  return (
    <>
      <SchemaOrgWebPage
        title="Documentation | Henkan Toolkit"
        description="Comprehensive documentation for the Henkan Toolkit, covering all features, calculators, and best practices for A/B testing and statistical analysis."
        pathname="/documentation"
      />
      <div className="bg-white">
        <div className="max-w-8xl mx-auto flex">
          <DocsSidebar />
          <DocsContent />
        </div>
      </div>
    </>
  )
}
