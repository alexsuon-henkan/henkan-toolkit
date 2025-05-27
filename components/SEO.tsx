import type { Metadata } from "next"
import { jsonLdScriptProps } from "react-schemaorg"
import type { WebSite, WebPage } from "schema-dts"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  pathname: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
}

export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
  pathname,
  type = "website",
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | Henkan Toolkit` : "Henkan Toolkit"
  const fullDescription =
    description ||
    "Powerful statistical tools and data visualization for informed decision-making in A/B testing and beyond."
  const fullKeywords = [
    ...(keywords || []),
    "A/B testing",
    "statistical analysis",
    "data visualization",
    "calculator",
    "Henkan Toolkit",
  ]
  const canonicalUrl = `https://www.henkantoolkit.com${pathname}`

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: [{ name: "Henkan Toolkit Team" }],
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl,
      siteName: "Henkan Toolkit",
      images: [
        {
          url: ogImage || "https://www.henkantoolkit.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Henkan Toolkit",
        },
      ],
      locale: "en_US",
      type: type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage || "https://www.henkantoolkit.com/twitter-image.jpg"],
      creator: "@HenkanToolkit",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-site-verification-code",
      yandex: "your-yandex-verification-code",
      bing: "your-bing-verification-code",
    },
  }
}

export function SchemaOrgWebsite() {
  return (
    <script
      {...jsonLdScriptProps<WebSite>({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Henkan Toolkit",
        url: "https://www.henkantoolkit.com",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://www.henkantoolkit.com/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      })}
    />
  )
}

export function SchemaOrgWebPage({ title, description, pathname }: SEOProps) {
  return (
    <script
      {...jsonLdScriptProps<WebPage>({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description: description,
        url: `https://www.henkantoolkit.com${pathname}`,
      })}
    />
  )
}

// Add an SEO component that combines the above functions
export function SEO(props: SEOProps) {
  return (
    <>
      <SchemaOrgWebsite />
      <SchemaOrgWebPage {...props} />
    </>
  )
}
