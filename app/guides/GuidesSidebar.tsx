"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"

const sidebarItems = [
  {
    title: "Getting Started",
    items: ["Introduction to A/B Testing", "Statistical Concepts", "Choosing the Right Calculator"],
  },
  {
    title: "A/B Testing Guides",
    items: [
      "Setting Up Your First Test",
      "Sample Size Planning",
      "Test Duration",
      "Analyzing Results",
      "Common Pitfalls",
    ],
  },
  {
    title: "Advanced Topics",
    items: ["Bayesian vs Frequentist", "Multiple Variation Testing", "Segmentation Analysis", "Sequential Testing"],
  },
  {
    title: "Best Practices",
    items: ["Test Planning", "Data Collection", "Statistical Significance", "Result Interpretation", "Implementation"],
  },
  {
    title: "Data Visualization",
    items: ["Sankey Diagrams", "Waterfall Charts", "Custom Visualizations"],
  },
]

export function GuidesSidebar() {
  const [openSections, setOpenSections] = useState<string[]>(["Getting Started"])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <nav className="w-64 h-screen overflow-y-auto p-6 border-r border-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guides</h1>
        <p className="text-sm text-gray-500 mt-2">Learn how to use Henkan Toolkit effectively</p>
      </div>
      {sidebarItems.map((section) => (
        <div key={section.title} className="mb-4">
          <button
            onClick={() => toggleSection(section.title)}
            className="flex items-center justify-between w-full text-left text-gray-600 hover:text-gray-900"
          >
            <span className="text-sm font-medium">{section.title}</span>
            {openSections.includes(section.title) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {openSections.includes(section.title) && (
            <ul className="mt-2 space-y-2">
              {section.items.map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-gray-600 hover:text-[#4CAF50] hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}
