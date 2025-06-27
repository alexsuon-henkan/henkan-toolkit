"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calculator,
  Clock,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Beaker,
  Sparkles,
  TrendingUp,
  BarChart,
  FileText,
  HelpCircle,
  Activity,
  Brain,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navigation = [
  {
    name: "CALCULATORS",
    items: [
      {
        name: "Frequentist Calculator",
        href: "/",
        icon: Calculator,
        description: "Statistical significance testing",
      },
      {
        name: "Duration Calculator",
        href: "/duration-calculator",
        icon: Clock,
        description: "Test duration planning",
      },
      {
        name: "Revenue Calculator",
        href: "/revenue-calculator",
        icon: DollarSign,
        description: "Revenue impact analysis",
      },
      {
        name: "AOV Calculator",
        href: "/aov-calculator",
        icon: ShoppingCart,
        description: "Average order value testing",
      },
      {
        name: "Bayesian Calculator",
        href: "/bayesian-calculator",
        icon: BarChart3,
        description: "Bayesian A/B testing",
        badge: "BETA",
      },
      {
        name: "Max Experiments",
        href: "/max-experiments",
        icon: Beaker,
        description: "Concurrent testing limits",
      },
    ],
  },
  {
    name: "ASSISTANTS",
    items: [
      {
        name: "Method Assistant",
        href: "/method-assistant",
        icon: Brain,
        description: "AI testing methodology",
        badge: "AI",
      },
      {
        name: "AI Assistant",
        href: "/ai-assistant",
        icon: Sparkles,
        description: "Generate banner & modal code",
        badge: "NEW",
      },
    ],
  },
  {
    name: "VISUALIZATION TOOLS",
    items: [
      {
        name: "Sankey Diagram",
        href: "/sankey-diagram",
        icon: TrendingUp,
        description: "User flow visualization",
      },
      {
        name: "Waterfall Chart",
        href: "/waterfall-chart",
        icon: BarChart,
        description: "Metric breakdown analysis",
      },
    ],
  },
  {
    name: "RESOURCES",
    items: [
      {
        name: "Documentation",
        href: "/documentation",
        icon: FileText,
        description: "Complete guides",
      },
      {
        name: "Testing Guides",
        href: "/guides",
        icon: HelpCircle,
        description: "Best practices",
      },
      {
        name: "API Status",
        href: "/api-status",
        icon: Activity,
        description: "Service monitoring",
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r bg-white">
      <div className="p-4">
        <nav className="space-y-6">
          {navigation.map((section) => (
            <div key={section.name}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{section.name}</h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs",
                                  item.badge === "BETA" && "bg-purple-100 text-purple-800",
                                  item.badge === "AI" && "bg-blue-100 text-blue-800",
                                  item.badge === "NEW" && "bg-green-100 text-green-800",
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{item.description}</p>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
