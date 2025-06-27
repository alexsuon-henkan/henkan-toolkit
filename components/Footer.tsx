import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t bg-background">
      <div className="max-w-screen-xl mx-auto container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 mb-8">
          <section className="col-span-2 md:col-span-1">
            <h2 className="font-bold mb-4 text-sm tracking-wider uppercase">Calculators</h2>
            <div className="space-y-2">
              <a href="/ab-test-calculator" className="block text-sm text-gray-600 hover:text-gray-900">
                Frequentist Calculator
              </a>
              <a href="/bayesian-calculator" className="block text-sm text-gray-600 hover:text-gray-900">
                Bayesian Calculator
              </a>
              <a href="/revenue-calculator" className="block text-sm text-gray-600 hover:text-gray-900">
                Revenue Calculator
              </a>
              <a href="/duration-calculator" className="block text-sm text-gray-600 hover:text-gray-900">
                Duration Calculator
              </a>
              <a href="/aov-calculator" className="block text-sm text-gray-600 hover:text-gray-900">
                AOV Calculator
              </a>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4 text-sm tracking-wider uppercase">Diagrams</h2>
            <div className="space-y-2">
              <a href="/sankey-diagram" className="block text-sm text-gray-600 hover:text-gray-900">
                Sankey Diagram
              </a>
              <a href="/waterfall-chart" className="block text-sm text-gray-600 hover:text-gray-900">
                Waterfall Chart
              </a>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4 text-sm tracking-wider uppercase">Support</h2>
            <div className="space-y-2">
              <a href="/documentation" className="block text-sm text-gray-600 hover:text-gray-900">
                Documentation
              </a>
              <a href="/guides" className="block text-sm text-gray-600 hover:text-gray-900">
                Guides
              </a>
              <a href="/api-status" className="block text-sm text-gray-600 hover:text-gray-900">
                API Status
              </a>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4 text-sm tracking-wider uppercase">System</h2>
            <div className="space-y-2">
              <a href="/logs" className="block text-sm text-gray-600 hover:text-gray-900">
                Logs
              </a>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4 text-sm tracking-wider uppercase">Company</h2>
            <div className="space-y-2">
              <a
                href="https://www.henkanpartners.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                About
              </a>
              <a
                href="https://www.henkanpartners.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                Blog
              </a>
              <a
                href="https://www.henkanpartners.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                Careers
              </a>
            </div>
          </section>
        </div>

        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Henkan. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
