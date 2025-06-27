"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calculator,
  Clock,
  DollarSign,
  ShoppingCart,
  Brain,
  TrendingUp,
  Sparkles,
  Zap,
  GitBranch,
  Activity,
  BookOpen,
  GraduationCap,
  Settings,
} from "lucide-react"

const navigation = [
  {
    name: "CALCULATORS",
    items: [
      {
        name: "Frequentist Calculator",
        href: "/ab-testing-calculator",
        icon: Calculator,
      },
      {
        name: "Duration Calculator",
        href: "/duration-calculator",
        icon: Clock,
      },
      {
        name: "Revenue Calculator",
        href: "/revenue-calculator",
        icon: DollarSign,
      },
      {
        name: "AOV Calculator",
        href: "/aov-calculator",
        icon: ShoppingCart,
      },
      {
        name: "Bayesian Calculator",
        href: "/bayesian-calculator",
        icon: Brain,
        badge: "BETA",
      },
      {
        name: "Max Experiments",
        href: "/max-experiments",
        icon: TrendingUp,
      },
    ],
  },
  {
    name: "ASSISTANTS",
    items: [
      {
        name: "Method Assistant",
        href: "/method-assistant",
        icon: Sparkles,
        badge: "AI",
      },
      {
        name: "AI Code Assistant",
        href: "/ai-assistant",
        icon: Zap,
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
        icon: GitBranch,
      },
      {
        name: "Waterfall Chart",
        href: "/waterfall-chart",
        icon: Activity,
      },
    ],
  },
  {
    name: "RESOURCES",
    items: [
      {
        name: "Documentation",
        href: "/documentation",
        icon: BookOpen,
      },
      {
        name: "Testing Guides",
        href: "/guides",
        icon: GraduationCap,
      },
      {
        name: "API Status",
        href: "/api-status",
        icon: Settings,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r bg-background">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((section) => (
              <div key={section.name}>
                <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">{section.name}</h2>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-2 py-0.5 text-xs font-medium",
                            item.badge === "BETA" && "bg-purple-100 text-purple-700",
                            item.badge === "AI" && "bg-blue-100 text-blue-700",
                            item.badge === "NEW" && "bg-green-100 text-green-700",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
