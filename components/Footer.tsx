export function Footer() {
  return (
    <footer className="bg-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-screen-xl mx-auto">
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

        <div className="border-t border-gray-200 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Henkan Toolkit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
