export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <section>
            <h3 className="font-semibold mb-4 text-gray-900">Calculators</h3>
            <div className="space-y-2">
              <a href="/" className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors">
                Frequentist Calculator
              </a>
              <a
                href="/bayesian-calculator"
                className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors"
              >
                Bayesian Calculator
              </a>
              <a
                href="/revenue-calculator"
                className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors"
              >
                Revenue Calculator
              </a>
              <a
                href="/duration-calculator"
                className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors"
              >
                Duration Calculator
              </a>
              <a href="/aov-calculator" className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors">
                AOV Calculator
              </a>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-4 text-gray-900">Diagrams</h3>
            <div className="space-y-2">
              <a href="/sankey-diagram" className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors">
                Sankey Diagram
              </a>
              <a href="/waterfall-chart" className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors">
                Waterfall Chart
              </a>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-4 text-gray-900">Assistants</h3>
            <div className="space-y-2">
              <a
                href="/method-assistant"
                className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors"
              >
                Method Assistant
              </a>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-4 text-gray-900">Company</h3>
            <div className="space-y-2">
              <a
                href="https://www.henkanpartners.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors"
              >
                About
              </a>
              <a
                href="https://forms.gle/cXLVg45KjbVCqoxu8"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 hover:text-[#4CAF50] transition-colors"
              >
                Feedback
              </a>
            </div>
          </section>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Henkan Toolkit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
