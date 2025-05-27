import type React from "react"
import Link from "next/link"

interface NavItem {
  name: string
  href: string
  description: string
}

const Navigation: React.FC = () => {
  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      description: "Go to the homepage",
    },
    {
      name: "Maximum Experiments Calculator",
      href: "/max-experiments",
      description: "Calculate how many A/B tests you can run per year",
    },
  ]

  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            <Link href={item.href}>
              <a>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
