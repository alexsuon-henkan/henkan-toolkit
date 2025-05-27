import { GuidesContent } from "./GuidesContent"
import { GuidesSidebar } from "./GuidesSidebar"
import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"

export const metadata = generateMetadata({
  title: "Guides | Henkan Toolkit",
  description:
    "Learn how to effectively use Henkan Toolkit with our comprehensive guides and best practices for A/B testing, statistical analysis, and data visualization.",
  keywords: ["guides", "tutorials", "A/B testing", "statistical analysis", "data visualization", "Henkan Toolkit"],
  pathname: "/guides",
  type: "article",
  publishedTime: "2023-02-01T00:00:00Z",
  modifiedTime: "2023-07-28T00:00:00Z",
})

export default function GuidesPage() {
  return (
    <>
      <SchemaOrgWebPage
        title="Guides | Henkan Toolkit"
        description="Learn how to effectively use Henkan Toolkit with our comprehensive guides and best practices for A/B testing, statistical analysis, and data visualization."
        pathname="/guides"
      />
      <div className="bg-white">
        <div className="max-w-8xl mx-auto flex">
          <GuidesSidebar />
          <GuidesContent />
        </div>
      </div>
    </>
  )
}
