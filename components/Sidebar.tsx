"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Calculator, TrendingUp, DollarSign, GitBranch, BarChart, Sparkles, Clipboard } from "lucide-react"

const NavItem = ({ item, pathname }) => (
  <Link
    href={item.href}
    className={`flex items-center justify-between px-4 py-2 mt-1 text-sm text-gray-600 rounded-lg hover:bg-gray-100 ${
      pathname === item.href ? "bg-gray-100 text-[#4CAF50]" : ""
    }`}
  >
    <div className="flex items-center">
      <item.icon className="h-5 w-5" />
      <span className="ml-3 opacity-0 group-hover:opacity-100 whitespace-nowrap">{item.name}</span>
    </div>
    {item.isNew && (
      <div className="flex items-center opacity-0 group-hover:opacity-100">
        <Sparkles className="h-4 w-4 text-yellow-500" />
        <span className="ml-1 text-xs font-semibold text-yellow-500">NEW</span>
      </div>
    )}
  </Link>
)

const Divider = ({ className }) => <div className={className} />

const calculatorItems = [
  { name: "Frequentist Calculator", href: "/", icon: BarChart2 },
  { name: "Bayesian Calculator", href: "/bayesian-calculator", icon: Calculator },
  { name: "Revenue Calculator", href: "/revenue-calculator", icon: TrendingUp },
  { name: "Duration Calculator (MDE)", href: "/duration-calculator", icon: Calculator },
  { name: "AOV Calculator", href: "/aov-calculator", icon: DollarSign },
  { name: "Max Experiments", href: "/max-experiments", icon: Calculator, isNew: true },
]

const diagramItems = [
  { name: "Waterfall Chart", href: "/waterfall-chart", icon: BarChart },
  { name: "Sankey Diagram", href: "/sankey-diagram", icon: GitBranch },
]

const systemItems = [{ name: "Logs", href: "/logs", icon: Clipboard, isNew: true }]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ease-in-out hover:w-64 group w-16">
      <div className="h-full flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <nav className="mt-5 px-2 space-y-2">
            <span className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 block mb-2">
              Calculators
            </span>
            {calculatorItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} />
            ))}

            <Divider className="my-3 mx-4 group-hover:opacity-100 opacity-0 transition-opacity" />

            <span className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 block mb-2">
              Diagrams
            </span>
            {diagramItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} />
            ))}

            <Divider className="my-3 mx-4 group-hover:opacity-100 opacity-0 transition-opacity" />

            <span className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 block mb-2">
              System
            </span>
            {systemItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <span className="text-sm text-gray-500">v3.7</span>
        </div>
      </div>
    </div>
  )
}

// Also export as default for compatibility
export default Sidebar
