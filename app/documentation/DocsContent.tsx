export function DocsContent() {
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <section id="introduction-to-henkan-toolkit" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Introduction to Henkan Toolkit</h2>
        <p className="text-gray-600 mb-4">
          Henkan Toolkit is a comprehensive suite of statistical analysis and data visualization tools designed to
          empower businesses in making data-driven decisions. Our toolkit includes a variety of calculators and diagrams
          that cater to different analytical needs.
        </p>
        <p className="text-gray-600 mb-4">
          Whether you're conducting A/B tests, analyzing revenue streams, or visualizing complex data flows, Henkan
          Toolkit provides the tools you need to gain valuable insights from your data.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Key Features</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Frequentist A/B Test Calculator</li>
          <li>Bayesian A/B Test Calculator</li>
          <li>Revenue Calculator</li>
          <li>Duration Calculator</li>
          <li>AOV (Average Order Value) Calculator</li>
          <li>Sankey Diagram Generator</li>
          <li>Waterfall Chart Generator</li>
        </ul>
      </section>

      <section id="getting-started" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-4">To get started with Henkan Toolkit, follow these simple steps:</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Sign up for a Henkan Toolkit account on our website</li>
          <li>Verify your email address and log in to your dashboard</li>
          <li>Choose the calculator or diagram you need from the main menu</li>
          <li>Input your data into the selected tool</li>
          <li>Analyze the results and gain insights</li>
        </ol>
        <p className="text-gray-600 mb-4">
          For more detailed instructions on each tool, refer to their specific sections in this documentation.
        </p>
      </section>

      <section id="frequentist-calculator" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequentist A/B Test Calculator</h2>
        <p className="text-gray-600 mb-4">
          The Frequentist A/B Test Calculator is a powerful tool for conducting A/B tests using classical statistical
          methods. It helps you determine if the differences observed between two variants are statistically
          significant.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Enter your sample sizes for control and variation groups</li>
          <li>Input the number of conversions for each group</li>
          <li>Set your desired confidence level (typically 95% or 99%)</li>
          <li>Click 'Calculate' to see your results</li>
        </ol>
        <h3 className="text-2xl font-semibold mb-2">Interpreting Results</h3>
        <p className="text-gray-600 mb-4">The calculator provides you with:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Conversion rates for each variant</li>
          <li>Relative lift in conversion rate</li>
          <li>Confidence interval for the difference in conversion rates</li>
          <li>P-value indicating statistical significance</li>
          <li>Recommended action based on the results</li>
        </ul>
        <p className="text-gray-600 mb-4">
          If the p-value is less than your chosen significance level (e.g., 0.05 for 95% confidence), you can conclude
          that the difference between variants is statistically significant.
        </p>
      </section>

      <section id="bayesian-calculator" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Bayesian A/B Test Calculator</h2>
        <p className="text-gray-600 mb-4">
          The Bayesian A/B Test Calculator offers an alternative approach to A/B testing, using Bayesian inference to
          provide probabilistic results. This method is particularly useful when you want to continuously monitor your
          tests or when you have prior information about conversion rates.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Enter the number of visitors and conversions for each variant</li>
          <li>Optionally, set prior alpha and beta parameters if you have prior knowledge</li>
          <li>Click 'Calculate' to see your results</li>
        </ol>
        <h3 className="text-2xl font-semibold mb-2">Interpreting Results</h3>
        <p className="text-gray-600 mb-4">The Bayesian Calculator provides:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Probability that each variant is the best</li>
          <li>Expected loss for choosing each variant</li>
          <li>Credible intervals for the conversion rates</li>
          <li>Posterior distribution visualization</li>
        </ul>
        <p className="text-gray-600 mb-4">
          These results allow you to make decisions based on the probability of each variant being the best, rather than
          relying solely on statistical significance.
        </p>
      </section>

      <section id="revenue-calculator" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Revenue Calculator</h2>
        <p className="text-gray-600 mb-4">
          The Revenue Calculator helps you estimate the potential revenue impact of implementing changes based on your
          A/B test results. This tool is crucial for translating statistical significance into business value.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Enter the current conversion rate and average order value</li>
          <li>Input the expected lift from your A/B test</li>
          <li>Specify the number of visitors per month</li>
          <li>Adjust for seasonality and performance decay if applicable</li>
          <li>Click 'Calculate' to see projected revenue increase</li>
        </ol>
        <h3 className="text-2xl font-semibold mb-2">Interpreting Results</h3>
        <p className="text-gray-600 mb-4">The calculator will provide:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Estimated additional monthly revenue</li>
          <li>Projected annual revenue increase</li>
          <li>Percentage increase in overall revenue</li>
          <li>Visualizations of revenue trends over time</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Use these projections to prioritize which A/B test results to implement and to estimate the ROI of your
          optimization efforts.
        </p>
      </section>

      <section id="duration-calculator" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Duration Calculator</h2>
        <p className="text-gray-600 mb-4">
          The Duration Calculator helps you determine how long you should run your A/B test to achieve statistically
          significant results. This tool is essential for planning your testing schedule and ensuring your results are
          reliable.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Enter your current conversion rate</li>
          <li>Specify the minimum detectable effect you want to measure</li>
          <li>Input your average daily visitors</li>
          <li>Set your desired statistical power and significance level</li>
          <li>Click 'Calculate' to see the recommended test duration</li>
        </ol>
        <h3 className="text-2xl font-semibold mb-2">Interpreting Results</h3>
        <p className="text-gray-600 mb-4">The calculator will provide:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Recommended test duration in days</li>
          <li>Total sample size required</li>
          <li>Minimum number of conversions needed</li>
          <li>Visualization of statistical power over time</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Use this information to plan your A/B tests and ensure you're not stopping tests too early or running them
          longer than necessary.
        </p>
      </section>

      <section id="aov-calculator" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">AOV Calculator</h2>
        <p className="text-gray-600 mb-4">
          The Average Order Value (AOV) Calculator helps you analyze and project changes in your average order value.
          This tool is valuable for understanding the impact of pricing strategies, upselling techniques, or product
          bundling on your overall revenue.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Enter your current AOV</li>
          <li>Input the number of orders per month</li>
          <li>Specify the expected percentage increase in AOV</li>
          <li>Adjust for any seasonal variations if applicable</li>
          <li>Click 'Calculate' to see the projected impact</li>
        </ol>
        <h3 className="text-2xl font-semibold mb-2">Interpreting Results</h3>
        <p className="text-gray-600 mb-4">The calculator will provide:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>New projected AOV</li>
          <li>Additional revenue per order</li>
          <li>Monthly and annual revenue increase</li>
          <li>Visualization of AOV trends over time</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Use these projections to evaluate the potential impact of strategies aimed at increasing your average order
          value.
        </p>
      </section>

      <section id="sankey-diagram" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Sankey Diagram Generator</h2>
        <p className="text-gray-600 mb-4">
          The Sankey Diagram Generator is a powerful visualization tool that displays the flow of data through a system.
          It's particularly useful for illustrating complex processes, such as user journeys or resource allocation.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Define your nodes (stages or categories)</li>
          <li>Input the values for each flow between nodes</li>
          <li>Customize colors and labels as needed</li>
          <li>Generate the diagram</li>
        </ol>
        <h3 className="text-2xl font-semibold mb-2">Interpreting Results</h3>
        <p className="text-gray-600 mb-4">Sankey Diagrams provide:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Visual representation of data flow magnitudes</li>
          <li>Clear view of major transfers or conversions in your process</li>
          <li>Insight into inefficiencies or bottlenecks</li>
          <li>Interactive elements for exploring complex flows</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Use Sankey Diagrams to identify areas for improvement in your processes or to communicate complex flows to
          stakeholders.
        </p>
      </section>

      <section id="waterfall-chart" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Waterfall Chart Generator</h2>
        <p className="text-gray-600 mb-4">
          Waterfall Charts are excellent for visualizing the cumulative effect of sequentially introduced positive or
          negative values. They're particularly useful for understanding financial statements, budget changes, or
          project resource allocation.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Define your starting value</li>
          <li>Input subsequent positive and negative values</li>
          <li>Label each step in your process</li>
          <li>Customize colors for increases and decreases</li>
          <li>Generate the chart</li>
        </ol>
        <h3 className="text-2xl font-semibold mb-2">Interpreting Results</h3>
        <p className="text-gray-600 mb-4">Waterfall Charts show:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>The impact of each step on the total</li>
          <li>Positive and negative contributions clearly differentiated</li>
          <li>The final net result after all steps</li>
          <li>Cumulative changes throughout the process</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Use Waterfall Charts to break down complex processes into understandable steps and visualize their individual
          impacts on the overall outcome.
        </p>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Best Practices for A/B Testing</h2>
        <p className="text-gray-600 mb-4">
          To ensure the validity and reliability of your A/B tests, consider the following best practices:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Clearly define your hypothesis before starting the test</li>
          <li>Ensure your sample size is large enough for statistical significance</li>
          <li>Run tests for an appropriate duration to account for time-based variations</li>
          <li>Test only one variable at a time for clear cause-and-effect relationships</li>
          <li>Consider segmentation to understand how changes affect different user groups</li>
          <li>Be aware of external factors that might influence your results</li>
          <li>Use both statistical and practical significance when interpreting results</li>
          <li>Document your tests thoroughly for future reference and learning</li>
        </ul>
      </section>

      <section id="faq" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Q: What's the difference between Frequentist and Bayesian approaches?
            </h3>
            <p className="text-gray-600">
              A: Frequentist methods focus on the probability of obtaining the observed data given a specific
              hypothesis, while Bayesian methods incorporate prior beliefs and update them based on the observed data.
              Frequentist approaches typically use p-values and confidence intervals, while Bayesian approaches use
              probability distributions and credible intervals.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Q: How long should I run my A/B test?</h3>
            <p className="text-gray-600">
              A: The duration of your A/B test depends on several factors, including your traffic volume, baseline
              conversion rate, and the minimum detectable effect you're looking for. Use our Duration Calculator to
              determine the appropriate test length for your specific situation.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Q: Can I stop a test early if I see significant results?</h3>
            <p className="text-gray-600">
              A: It's generally not recommended to stop a test early, even if you see significant results. Doing so can
              increase the risk of false positives. It's best to determine the test duration in advance and stick to it
              to ensure reliable results.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Q: How do I interpret the results of my A/B test?</h3>
            <p className="text-gray-600">
              A: Look at both statistical significance and practical significance. Consider the confidence intervals or
              credible intervals, not just point estimates. Also, think about the long-term impact and any potential
              trade-offs of implementing the winning variation.
            </p>
          </div>
        </div>
      </section>

      <section id="support" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Support and Resources</h2>
        <p className="text-gray-600 mb-4">For additional support and resources, please refer to the following:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>
            Our comprehensive{" "}
            <a href="/guides" className="text-blue-600 hover:underline">
              Guides section
            </a>{" "}
            for in-depth tutorials and best practices
          </li>
          <li>
            The{" "}
            <a href="/faq" className="text-blue-600 hover:underline">
              FAQ page
            </a>{" "}
            for quick answers to common questions
          </li>
          <li>
            Our{" "}
            <a href="/blog" className="text-blue-600 hover:underline">
              blog
            </a>{" "}
            for the latest updates, case studies, and industry insights
          </li>
          <li>
            Contact our support team at{" "}
            <a href="mailto:support@henkantoolkit.com" className="text-blue-600 hover:underline">
              support@henkantoolkit.com
            </a>{" "}
            for personalized assistance
          </li>
        </ul>
      </section>
    </main>
  )
}
