import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LogsContent() {
  const updates = [
    {
      version: "v3.6",
      date: new Date().toISOString().slice(0, 10),
      changes: [
        {
          change: "Implemented Sample Ratio Mismatch (SRM) detection in A/B Test Calculator",
          definition:
            "Added a feature to detect potential issues with randomization in A/B tests by checking if the traffic split between variations is significantly different from expected.",
        },
        {
          change: "Improved A/B test calculator recommendation logic for negative lifts",
          definition:
            "Enhanced the calculator to provide more accurate advice when the variation performs worse than the control.",
        },
        {
          change: "Added Logs page to track updates and future features",
          definition: "Introduced a new section to keep users informed about recent changes and upcoming improvements.",
        },
        {
          change: "Reorganized navigation with clear categories",
          definition:
            "Restructured the sidebar menu to group similar tools together, improving user experience and discoverability.",
        },
        {
          change: "Removed Radar Chart from navigation and functionality",
          definition:
            "Streamlined the toolkit by removing the Radar Chart feature to focus on core A/B testing and analysis tools.",
        },
      ],
    },
    {
      version: "v3.4",
      date: "2024-02-03",
      changes: [
        {
          change: "Improved A/B test calculator recommendation logic for negative lifts",
          definition:
            "Enhanced the calculator to provide more accurate advice when the variation performs worse than the control.",
        },
        {
          change: "Added Logs page to track updates and future features",
          definition: "Introduced a new section to keep users informed about recent changes and upcoming improvements.",
        },
        {
          change: "Reorganized navigation with clear categories",
          definition:
            "Restructured the sidebar menu to group similar tools together, improving user experience and discoverability.",
        },
      ],
    },
    {
      version: "v3.3",
      date: "2024-01-15",
      changes: [
        {
          change: "Introduced AOV Calculator with Mann-Whitney U test",
          definition:
            "Added a new calculator for Average Order Value (AOV) analysis, utilizing the Mann-Whitney U test for statistical significance.",
        },
        {
          change: "Added support for CSV data upload in AOV Calculator",
          definition: "Users can now import their data from CSV files directly into the AOV Calculator.",
        },
        {
          change: "Enhanced error handling and validation in calculators",
          definition:
            "Improved error messages and input validation across all calculators for a smoother user experience.",
        },
      ],
    },
    {
      version: "v3.2",
      changes: [
        {
          change: "Launched Waterfall Chart generator",
          definition: "Added a new tool to generate Waterfall Charts for visualizing data changes over time.",
        },
        {
          change: "Implemented Sankey Diagram generator",
          definition:
            "Introduced a Sankey Diagram generator to visualize flows and relationships between different data points.",
        },
        {
          change: "Added zoom and drag controls for diagrams",
          definition: "Improved interactivity for charts and diagrams with zoom and drag functionalities.",
        },
      ],
    },
    {
      version: "v3.1",
      date: "2023-12-15",
      changes: [
        {
          change: "Added Duration Calculator",
          definition: "A new calculator to determine the duration of events or processes.",
        },
        {
          change: "Implemented weekly MDE table",
          definition: "Added a table to display Mean Daily Engagement (MDE) data on a weekly basis.",
        },
        {
          change: "Enhanced sample size calculations",
          definition: "Improved the accuracy and efficiency of sample size calculations for statistical analysis.",
        },
      ],
    },
    {
      version: "v3.0",
      changes: [
        {
          change: "Major UI overhaul with new design system",
          definition:
            "Completely redesigned the user interface with a new design system for improved aesthetics and usability.",
        },
        {
          change: "Introduced Revenue Calculator",
          definition: "Added a new calculator to project and analyze revenue based on various factors.",
        },
        {
          change: "Added seasonality adjustments",
          definition:
            "Implemented adjustments for seasonality in calculations to account for fluctuations throughout the year.",
        },
        {
          change: "Implemented decay modeling",
          definition:
            "Added decay modeling capabilities to account for the decline in the effect of certain variables over time.",
        },
      ],
    },
    {
      version: "v2.2",
      changes: [
        {
          change: "Enhanced A/B test visualization",
          definition: "Improved the visual representation of A/B test results for better understanding.",
        },
        {
          change: "Added confidence interval displays",
          definition:
            "Added clear displays of confidence intervals to provide a range of plausible values for the results.",
        },
        {
          change: "Improved statistical power calculations",
          definition: "Enhanced the accuracy and reliability of statistical power calculations.",
        },
      ],
    },
    {
      version: "v2.1",
      changes: [
        {
          change: "Added demo mode for all calculators",
          definition:
            "Introduced a demo mode to allow users to try out the calculators without needing to input their own data.",
        },
        {
          change: "Improved mobile responsiveness",
          definition: "Optimized the user interface for better performance and usability on mobile devices.",
        },
        {
          change: "Enhanced error messaging",
          definition: "Improved error messages to be more informative and user-friendly.",
        },
      ],
    },
    {
      version: "v2.0",
      changes: [
        {
          change: "Complete rewrite in Next.js",
          definition:
            "The application was completely rewritten using Next.js for improved performance and scalability.",
        },
        {
          change: "Introduced new statistical methods",
          definition: "Added new statistical methods to enhance the accuracy and robustness of the analysis.",
        },
        {
          change: "Added comprehensive FAQ sections",
          definition: "Added a comprehensive FAQ section to address common user questions and concerns.",
        },
      ],
    },
    {
      version: "v1.0",
      changes: [
        {
          change: "Initial release",
          definition: "The initial release of the Henkan Toolkit.",
        },
        {
          change: "Basic A/B test calculator",
          definition: "The initial release included a basic A/B test calculator.",
        },
        {
          change: "Simple statistical analysis",
          definition: "Basic statistical analysis capabilities were included in the initial release.",
        },
      ],
    },
  ]

  const futureFeatures = [
    {
      feature: "Bayesian A/B test calculator with prior distribution support",
      definition:
        "A new calculator that uses Bayesian statistics, allowing users to incorporate prior knowledge into their A/B test analysis.",
    },
    {
      feature: "Integration with Google Analytics and other analytics platforms",
      definition: "Ability to import data directly from popular analytics tools, streamlining the data input process.",
    },
    {
      feature: "Custom report generation with PDF export",
      definition:
        "Users will be able to create and download personalized PDF reports of their A/B test results and analyses.",
    },
    {
      feature: "Mobile app for on-the-go analysis",
      definition:
        "A dedicated mobile application to perform A/B test calculations and view results from smartphones and tablets.",
    },
    {
      feature: "Advanced multivariate testing support",
      definition:
        "Expand capabilities to analyze tests with multiple variables, allowing for more complex experimental designs.",
    },
    {
      feature: "Real-time collaboration features",
      definition:
        "Introduce tools for teams to work together on A/B test analysis in real-time, facilitating better communication and decision-making.",
    },
    {
      feature: "Custom dashboard creation",
      definition:
        "Allow users to build personalized dashboards with their most-used calculators and visualizations for quick access.",
    },
    {
      feature: "API access for programmatic calculations",
      definition:
        "Provide an API for developers to integrate Henkan Toolkit's calculations directly into their own applications or workflows.",
    },
  ]

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Update Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.map((update, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold flex items-center">
                {update.version}
                {index === 0 && <Badge className="ml-2">Latest</Badge>}
              </h3>
              {update.date && ["v3.6", "v3.5", "v3.4", "v3.3"].includes(update.version) && (
                <p className="text-sm text-gray-500 mb-2">{update.date}</p>
              )}
              <ul className="list-disc list-inside">
                {update.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="text-gray-700 mb-2">
                    <span className="font-medium">{change.change}</span>
                    <p className="mt-1 ml-6 text-sm text-gray-600">{change.definition}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upcoming Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {futureFeatures.map((feature, index) => (
              <li key={index} className="text-gray-700 mb-4 last:mb-0">
                <span className="font-medium">{feature.feature}</span>
                <p className="mt-1 ml-6 text-sm text-gray-600">{feature.definition}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
