export function GuidesContent() {
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <section id="introduction-to-ab-testing" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Introduction to A/B Testing</h2>
        <p className="text-gray-600 mb-4">
          A/B testing, also known as split testing, is a method of comparing two versions of a webpage or app against
          each other to determine which one performs better. It is an essential tool for data-driven decision making in
          digital marketing, product development, and user experience design.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Key Components of A/B Testing</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Control (Version A): The current version of your page or element</li>
          <li>Variant (Version B): The new version you want to test</li>
          <li>Hypothesis: A clear statement of what you're testing and why</li>
          <li>Metrics: The key performance indicators you'll use to measure success</li>
          <li>Sample Size: The number of visitors included in your test</li>
          <li>Duration: The length of time your test will run</li>
        </ul>
      </section>

      <section id="statistical-concepts" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Statistical Concepts in A/B Testing</h2>
        <p className="text-gray-600 mb-4">
          Understanding key statistical concepts is crucial for interpreting A/B test results correctly and making
          informed decisions.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Important Statistical Terms</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>
            Statistical Significance: The likelihood that the difference between variants is not due to random chance
          </li>
          <li>Confidence Level: The probability that your results fall within a specified range of values</li>
          <li>
            P-value: The probability of obtaining test results at least as extreme as the observed results, assuming the
            null hypothesis is true
          </li>
          <li>Type I Error (False Positive): Incorrectly rejecting a true null hypothesis</li>
          <li>Type II Error (False Negative): Failing to reject a false null hypothesis</li>
          <li>Statistical Power: The probability of correctly rejecting a false null hypothesis</li>
        </ul>
      </section>

      <section id="setting-up-your-first-test" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Setting Up Your First A/B Test</h2>
        <p className="text-gray-600 mb-4">Follow these steps to set up your first A/B test using Henkan Toolkit:</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Define your hypothesis: Clearly state what you're testing and why</li>
          <li>Choose your metrics: Decide which key performance indicators you'll use to measure success</li>
          <li>Determine your sample size: Use our Duration Calculator to figure out how many visitors you need</li>
          <li>Create your variations: Develop the control (A) and variant (B) versions of your page or element</li>
          <li>Set up tracking: Ensure you're accurately tracking the right metrics for both variations</li>
          <li>Run your test: Launch your test and wait for it to gather sufficient data</li>
          <li>Analyze results: Use our A/B Test Calculator to interpret your results</li>
        </ol>
      </section>

      <section id="analyzing-results" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Analyzing A/B Test Results</h2>
        <p className="text-gray-600 mb-4">
          Proper analysis of your A/B test results is crucial for making informed decisions. Here's how to approach it:
        </p>
        <h3 className="text-2xl font-semibold mb-2">Steps for Analyzing Results</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>
            Check for statistical significance: Use our A/B Test Calculator to determine if your results are
            statistically significant
          </li>
          <li>
            Look at confidence intervals: Understand the range of plausible values for the true difference between
            variations
          </li>
          <li>
            Consider practical significance: Evaluate whether the observed difference is meaningful for your business
          </li>
          <li>Examine secondary metrics: Look at how the change affected other important metrics</li>
          <li>Segment your results: Analyze how different user groups responded to the variations</li>
          <li>
            Calculate potential impact: Use our Revenue Calculator to estimate the long-term impact of implementing the
            change
          </li>
        </ol>
      </section>

      <section id="common-pitfalls" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Common A/B Testing Pitfalls to Avoid</h2>
        <p className="text-gray-600 mb-4">Be aware of these common mistakes when conducting A/B tests:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Stopping tests too early: Avoid ending tests prematurely based on early results</li>
          <li>Testing too many variables: Focus on testing one change at a time for clear results</li>
          <li>
            Ignoring external factors: Be aware of seasonality, marketing campaigns, or other factors that might
            influence your results
          </li>
          <li>Neglecting sample size: Ensure you have a large enough sample size for reliable results</li>
          <li>
            Misinterpreting statistical significance: Remember that statistical significance doesn't always mean
            practical importance
          </li>
          <li>
            Not considering long-term effects: Some changes might have short-term benefits but long-term drawbacks
          </li>
        </ul>
      </section>

      <section id="advanced-topics" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Advanced A/B Testing Topics</h2>
        <p className="text-gray-600 mb-4">
          Once you're comfortable with basic A/B testing, consider exploring these advanced topics:
        </p>
        <h3 className="text-2xl font-semibold mb-2">Bayesian vs Frequentist Approaches</h3>
        <p className="text-gray-600 mb-4">
          Understand the differences between Bayesian and Frequentist statistical methods and when to use each approach.
          Our Bayesian A/B Test Calculator can help you apply Bayesian methods to your tests.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Multivariate Testing</h3>
        <p className="text-gray-600 mb-4">
          Learn how to test multiple variables simultaneously and analyze their interactions. This can be more complex
          but can yield deeper insights.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Sequential Testing</h3>
        <p className="text-gray-600 mb-4">
          Explore methods for continuously monitoring your tests and making decisions as data accumulates, rather than
          waiting for a fixed sample size.
        </p>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">A/B Testing Best Practices</h2>
        <p className="text-gray-600 mb-4">
          Follow these best practices to ensure the validity and reliability of your A/B tests:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Always start with a clear hypothesis</li>
          <li>Ensure your sample size is large enough for statistical significance</li>
          <li>Run tests for an appropriate duration to account for time-based variations</li>
          <li>Test only one variable at a time for clear cause-and-effect relationships</li>
          <li>Consider segmentation to understand how changes affect different user groups</li>
          <li>Be aware of external factors that might influence your results</li>
          <li>Use both statistical and practical significance when interpreting results</li>
          <li>Document your tests thoroughly for future reference and learning</li>
          <li>Continuously iterate and test to drive ongoing improvements</li>
        </ul>
      </section>

      <section id="case-studies" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">A/B Testing Case Studies</h2>
        <p className="text-gray-600 mb-4">
          Learn from real-world examples of successful A/B tests and how they impacted businesses:
        </p>
        <h3 className="text-2xl font-semibold mb-2">E-commerce Product Page Optimization</h3>
        <p className="text-gray-600 mb-4">
          An online retailer tested a new product page layout, resulting in a 15% increase in conversion rate. We'll
          examine their testing process, the changes made, and how they analyzed the results using Henkan Toolkit.
        </p>
        <h3 className="text-2xl font-semibold mb-2">SaaS Pricing Page Test</h3>
        <p className="text-gray-600 mb-4">
          A software company used A/B testing to optimize their pricing page, leading to a 25% increase in sign-ups for
          their premium plan. We'll explore how they set up the test, interpreted the results, and calculated the
          long-term revenue impact.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Email Subject Line Optimization</h3>
        <p className="text-gray-600 mb-4">
          A marketing team conducted an A/B test on email subject lines, improving their open rates by 30%. We'll
          discuss how they used segmentation to understand the impact on different user groups and how they applied
          these insights to future campaigns.
        </p>
      </section>

      <section id="data-visualization" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Data Visualization in A/B Testing</h2>
        <p className="text-gray-600 mb-4">
          Effective data visualization can help you better understand and communicate your A/B test results. Here's how
          to use Henkan Toolkit's visualization features:
        </p>
        <h3 className="text-2xl font-semibold mb-2">Sankey Diagrams</h3>
        <p className="text-gray-600 mb-4">
          Use Sankey diagrams to visualize user flows and conversion funnels. This can help you identify where users are
          dropping off and which paths lead to the most conversions.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Waterfall Charts</h3>
        <p className="text-gray-600 mb-4">
          Waterfall charts are excellent for showing how different factors contribute to overall conversion rate or
          revenue changes. Use them to break down the impact of various elements in your A/B tests.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Custom Visualizations</h3>
        <p className="text-gray-600 mb-4">
          Learn how to create custom visualizations tailored to your specific A/B testing needs using Henkan Toolkit's
          flexible charting options.
        </p>
      </section>

      <section id="conclusion" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
        <p className="text-gray-600 mb-4">
          A/B testing is a powerful tool for making data-driven decisions and improving your digital products. By
          following these guides and leveraging Henkan Toolkit's features, you'll be well-equipped to conduct effective
          A/B tests and drive meaningful improvements in your business metrics.
        </p>
        <p className="text-gray-600 mb-4">
          Remember to continually learn and iterate on your testing process, and don't hesitate to reach out to our
          support team if you need any assistance along the way.
        </p>
      </section>
    </main>
  )
}
