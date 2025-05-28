import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LogChange {
  type: "added" | "removed" | "fixed" | "improved"
  title: string
  description: string
}

interface LogEntry {
  version: string
  date: string
  changes: LogChange[]
}

const logs: LogEntry[] = [
  {
    version: "v3.9",
    date: "May 28, 2025",
    changes: [
      {
        type: "added" as const,
        title: "Method Assistant with AI-Powered Recommendations",
        description:
          "Launched a new AI assistant that analyzes project descriptions and recommends the best testing methods from 40+ quantitative and qualitative approaches. Features strategic timeline planning and constraint handling.",
      },
      {
        type: "added" as const,
        title: "Comprehensive Method Library",
        description:
          "Added a complete database of 40 testing methods with relevance scoring, filtering, and detailed descriptions. Users can now see all available methods and understand why specific ones are recommended.",
      },
      {
        type: "added" as const,
        title: "User Splitting Constraints",
        description:
          "Added toggle for scenarios where traditional A/B testing isn't possible (like Netflix content testing). The AI adapts recommendations to focus on alternative methods like time-based comparisons and qualitative research.",
      },
      {
        type: "improved" as const,
        title: "Strategic Testing Timeline",
        description:
          "Method Assistant now provides 3-phase testing strategies: Before Launch (research/validation), At Launch (experiments/rollout), and After Launch (monitoring/impact analysis).",
      },
    ],
  },
  {
    version: "v3.8",
    date: "May 28, 2025",
    changes: [
      {
        type: "improved" as const,
        title: "Maximum Experiments Calculator Design Overhaul",
        description:
          "Completely redesigned the Maximum Experiments Calculator to match the visual consistency of other calculators with proper styling and layout.",
      },
      {
        type: "added" as const,
        title: "Comprehensive Documentation Sections",
        description:
          "Added 'How to Use This Calculator', 'Key Terms and Definitions', and FAQ sections to the Maximum Experiments Calculator, matching the design pattern of other tools.",
      },
      {
        type: "fixed" as const,
        title: "Production CSS Styling Issues",
        description:
          "Resolved critical styling differences between development and production environments that were causing calculators to appear unstyled in production.",
      },
      {
        type: "improved" as const,
        title: "UI Component Consistency",
        description:
          "Standardized the design system across all calculators to ensure consistent user experience and visual hierarchy.",
      },
      {
        type: "removed" as const,
        title: "Beta Badges from Navigation",
        description: "Removed beta badges from all navigation items as features have matured and stabilized.",
      },
    ],
  },
  {
    version: "v3.7",
    date: "May 21, 2025",
    changes: [
      {
        type: "added",
        title: "Maximum Experiments Calculator",
        description:
          "Added a new calculator to determine the maximum number of experiments that can be run given a certain budget and cost per experiment.",
      },
      {
        type: "improved",
        title: "Enhanced UI/UX Across All Tools",
        description:
          "Improved the user interface and user experience across all calculators with better spacing and visual hierarchy.",
      },
      {
        type: "fixed",
        title: "Mobile Responsiveness Issues",
        description: "Fixed various mobile responsiveness issues across different screen sizes.",
      },
    ],
  },
  {
    version: "v3.6",
    date: "May 14, 2025",
    changes: [
      {
        type: "added",
        title: "User Authentication System",
        description:
          "Implemented complete user authentication with Supabase including login, signup, and profile management.",
      },
      {
        type: "added",
        title: "Protected Routes",
        description: "Added protected routes for premium features and user-specific content.",
      },
      {
        type: "improved",
        title: "Performance Optimizations",
        description: "Improved the performance of all calculators with better state management and reduced re-renders.",
      },
    ],
  },
  {
    version: "v3.5",
    date: "April 30, 2025",
    changes: [
      {
        type: "added",
        title: "Comprehensive Documentation",
        description: "Added detailed documentation section with guides, API references, and best practices.",
      },
      {
        type: "added",
        title: "API Status Dashboard",
        description: "Implemented real-time API status monitoring and health checks.",
      },
      {
        type: "improved",
        title: "Error Handling",
        description: "Enhanced error handling across all components with better user feedback.",
      },
    ],
  },
  {
    version: "v3.4",
    date: "April 15, 2025",
    changes: [
      {
        type: "added",
        title: "Bayesian A/B Testing Calculator",
        description: "Introduced Bayesian statistical approach for A/B test analysis with probability distributions.",
      },
      {
        type: "added",
        title: "Interactive Probability Charts",
        description: "Added visual probability distribution charts for Bayesian analysis.",
      },
      {
        type: "improved",
        title: "Statistical Accuracy",
        description: "Enhanced statistical calculations with more precise algorithms and edge case handling.",
      },
    ],
  },
  {
    version: "v3.3",
    date: "March 28, 2025",
    changes: [
      {
        type: "added",
        title: "Waterfall Chart Generator",
        description: "Added waterfall chart visualization tool for conversion funnel analysis.",
      },
      {
        type: "added",
        title: "Sankey Diagram Tool",
        description: "Implemented Sankey diagram generator for user flow visualization.",
      },
      {
        type: "improved",
        title: "Data Visualization",
        description: "Enhanced all charts and graphs with better interactivity and customization options.",
      },
    ],
  },
  {
    version: "v3.2",
    date: "March 10, 2025",
    changes: [
      {
        type: "added",
        title: "CSV Data Import",
        description: "Added ability to import test data from CSV files for analysis.",
      },
      {
        type: "added",
        title: "Data Export Features",
        description: "Implemented export functionality for results in multiple formats (CSV, PDF, JSON).",
      },
      {
        type: "improved",
        title: "Input Validation",
        description: "Enhanced input validation with better error messages and real-time feedback.",
      },
    ],
  },
  {
    version: "v3.1",
    date: "February 20, 2025",
    changes: [
      {
        type: "added",
        title: "Dark Mode Support",
        description: "Implemented system-wide dark mode with automatic theme detection.",
      },
      {
        type: "improved",
        title: "Accessibility Enhancements",
        description: "Improved accessibility with better keyboard navigation, ARIA labels, and screen reader support.",
      },
      {
        type: "fixed",
        title: "Cross-browser Compatibility",
        description: "Fixed compatibility issues with Safari and older browser versions.",
      },
    ],
  },
  {
    version: "v3.0",
    date: "February 1, 2025",
    changes: [
      {
        type: "improved",
        title: "Complete UI Redesign",
        description: "Major redesign with modern UI components, improved navigation, and better user experience.",
      },
      {
        type: "added",
        title: "Advanced Statistical Methods",
        description:
          "Added support for sequential testing, multiple comparison corrections, and advanced power analysis.",
      },
      {
        type: "improved",
        title: "Performance Overhaul",
        description: "Completely rebuilt with Next.js 14 and React 18 for better performance and developer experience.",
      },
    ],
  },
  {
    version: "v2.8",
    date: "January 15, 2025",
    changes: [
      {
        type: "added",
        title: "Revenue Impact Calculator",
        description: "Added calculator to estimate revenue impact of A/B test results.",
      },
      {
        type: "added",
        title: "AOV (Average Order Value) Calculator",
        description: "Implemented specialized calculator for e-commerce AOV testing.",
      },
      {
        type: "improved",
        title: "Mobile Experience",
        description: "Enhanced mobile responsiveness and touch interactions.",
      },
    ],
  },
  {
    version: "v2.7",
    date: "December 20, 2024",
    changes: [
      {
        type: "added",
        title: "Test Duration Calculator",
        description: "Added tool to calculate optimal test duration based on traffic and effect size.",
      },
      {
        type: "added",
        title: "Seasonality Adjustments",
        description: "Implemented seasonality factors for more accurate duration calculations.",
      },
      {
        type: "improved",
        title: "Statistical Precision",
        description: "Enhanced statistical calculations with better handling of edge cases.",
      },
    ],
  },
  {
    version: "v2.6",
    date: "November 30, 2024",
    changes: [
      {
        type: "added",
        title: "Interactive Charts",
        description: "Added interactive charts for visualizing test results and statistical distributions.",
      },
      {
        type: "added",
        title: "Confidence Interval Visualization",
        description: "Implemented visual confidence intervals for better result interpretation.",
      },
      {
        type: "fixed",
        title: "Calculation Accuracy",
        description: "Fixed rounding errors in statistical calculations for edge cases.",
      },
    ],
  },
  {
    version: "v2.5",
    date: "November 10, 2024",
    changes: [
      {
        type: "added",
        title: "Sample Size Calculator",
        description: "Added dedicated sample size calculator with power analysis.",
      },
      {
        type: "added",
        title: "Effect Size Estimation",
        description: "Implemented tools for estimating minimum detectable effect sizes.",
      },
      {
        type: "improved",
        title: "User Interface",
        description: "Redesigned interface with better visual hierarchy and cleaner layout.",
      },
    ],
  },
  {
    version: "v2.4",
    date: "October 25, 2024",
    changes: [
      {
        type: "added",
        title: "Multi-variant Testing Support",
        description: "Extended calculator to support A/B/C and multivariate testing scenarios.",
      },
      {
        type: "added",
        title: "Statistical Power Analysis",
        description: "Added comprehensive power analysis tools for test planning.",
      },
      {
        type: "improved",
        title: "Input Validation",
        description: "Enhanced input validation with real-time feedback and error prevention.",
      },
    ],
  },
  {
    version: "v2.3",
    date: "October 5, 2024",
    changes: [
      {
        type: "added",
        title: "Conversion Rate Trends",
        description: "Added trending analysis for conversion rates over time.",
      },
      {
        type: "improved",
        title: "Results Interpretation",
        description: "Enhanced results display with clearer explanations and recommendations.",
      },
      {
        type: "fixed",
        title: "Edge Case Handling",
        description: "Fixed issues with very small sample sizes and extreme conversion rates.",
      },
    ],
  },
  {
    version: "v2.2",
    date: "September 20, 2024",
    changes: [
      {
        type: "added",
        title: "Historical Data Analysis",
        description: "Added ability to analyze historical A/B test data and trends.",
      },
      {
        type: "added",
        title: "Baseline Metrics Tracking",
        description: "Implemented baseline metrics comparison and tracking.",
      },
      {
        type: "improved",
        title: "Performance Optimization",
        description: "Optimized calculations for faster results with large datasets.",
      },
    ],
  },
  {
    version: "v2.1",
    date: "September 1, 2024",
    changes: [
      {
        type: "added",
        title: "Advanced Statistical Tests",
        description: "Added Chi-square, Fisher's exact test, and other advanced statistical methods.",
      },
      {
        type: "improved",
        title: "Calculation Engine",
        description: "Rebuilt calculation engine for better accuracy and performance.",
      },
      {
        type: "fixed",
        title: "Browser Compatibility",
        description: "Fixed compatibility issues with older browsers and mobile devices.",
      },
    ],
  },
  {
    version: "v2.0",
    date: "August 15, 2024",
    changes: [
      {
        type: "improved",
        title: "Complete Redesign",
        description: "Major redesign with modern UI framework and improved user experience.",
      },
      {
        type: "added",
        title: "Real-time Calculations",
        description: "Implemented real-time calculation updates as users type.",
      },
      {
        type: "added",
        title: "Results Export",
        description: "Added ability to export results in multiple formats.",
      },
    ],
  },
  {
    version: "v1.9",
    date: "July 30, 2024",
    changes: [
      {
        type: "added",
        title: "Confidence Level Customization",
        description: "Added ability to customize confidence levels (90%, 95%, 99%).",
      },
      {
        type: "improved",
        title: "Statistical Accuracy",
        description: "Improved statistical calculations with better precision.",
      },
      {
        type: "fixed",
        title: "Input Validation",
        description: "Fixed issues with negative numbers and invalid inputs.",
      },
    ],
  },
  {
    version: "v1.8",
    date: "July 10, 2024",
    changes: [
      {
        type: "added",
        title: "Two-tailed vs One-tailed Tests",
        description: "Added support for both one-tailed and two-tailed statistical tests.",
      },
      {
        type: "improved",
        title: "Results Display",
        description: "Enhanced results display with better formatting and explanations.",
      },
      {
        type: "fixed",
        title: "Calculation Bugs",
        description: "Fixed several edge cases in statistical calculations.",
      },
    ],
  },
  {
    version: "v1.7",
    date: "June 25, 2024",
    changes: [
      {
        type: "added",
        title: "Statistical Significance Testing",
        description: "Added comprehensive statistical significance testing with p-values.",
      },
      {
        type: "added",
        title: "Effect Size Calculations",
        description: "Implemented Cohen's d and other effect size measurements.",
      },
      {
        type: "improved",
        title: "User Interface",
        description: "Improved layout and visual design for better usability.",
      },
    ],
  },
  {
    version: "v1.6",
    date: "June 5, 2024",
    changes: [
      {
        type: "added",
        title: "Confidence Intervals",
        description: "Added confidence interval calculations for conversion rates.",
      },
      {
        type: "improved",
        title: "Input Handling",
        description: "Improved input handling with better validation and error messages.",
      },
      {
        type: "fixed",
        title: "Mobile Responsiveness",
        description: "Fixed mobile display issues and improved touch interactions.",
      },
    ],
  },
  {
    version: "v1.5",
    date: "May 20, 2024",
    changes: [
      {
        type: "added",
        title: "Relative Improvement Calculations",
        description: "Added relative improvement percentage calculations between variants.",
      },
      {
        type: "added",
        title: "Results Summary",
        description: "Implemented comprehensive results summary with key insights.",
      },
      {
        type: "improved",
        title: "Performance",
        description: "Optimized calculations for better performance with large numbers.",
      },
    ],
  },
  {
    version: "v1.4",
    date: "May 1, 2024",
    changes: [
      {
        type: "added",
        title: "Z-score Calculations",
        description: "Added Z-score calculations for statistical analysis.",
      },
      {
        type: "improved",
        title: "Error Handling",
        description: "Enhanced error handling with user-friendly error messages.",
      },
      {
        type: "fixed",
        title: "Decimal Precision",
        description: "Fixed decimal precision issues in conversion rate calculations.",
      },
    ],
  },
  {
    version: "v1.3",
    date: "April 15, 2024",
    changes: [
      {
        type: "added",
        title: "Standard Error Calculations",
        description: "Added standard error calculations for conversion rates.",
      },
      {
        type: "improved",
        title: "Input Validation",
        description: "Improved input validation to prevent invalid data entry.",
      },
      {
        type: "fixed",
        title: "Division by Zero",
        description: "Fixed division by zero errors when visitors count is zero.",
      },
    ],
  },
  {
    version: "v1.2",
    date: "April 1, 2024",
    changes: [
      {
        type: "added",
        title: "Conversion Rate Calculations",
        description: "Added automatic conversion rate calculations from visitors and conversions.",
      },
      {
        type: "improved",
        title: "User Interface",
        description: "Improved form layout and added better visual feedback.",
      },
      {
        type: "fixed",
        title: "Input Formatting",
        description: "Fixed issues with number formatting and decimal inputs.",
      },
    ],
  },
  {
    version: "v1.1",
    date: "March 15, 2024",
    changes: [
      {
        type: "added",
        title: "Basic Results Display",
        description: "Added results display showing conversion rates and basic statistics.",
      },
      {
        type: "improved",
        title: "Form Validation",
        description: "Improved form validation with real-time feedback.",
      },
      {
        type: "fixed",
        title: "Calculation Accuracy",
        description: "Fixed rounding errors in percentage calculations.",
      },
    ],
  },
  {
    version: "v1.0",
    date: "March 1, 2024",
    changes: [
      {
        type: "added",
        title: "Initial Release",
        description: "Basic A/B test calculator with simple conversion rate comparison.",
      },
      {
        type: "added",
        title: "Core Functionality",
        description: "Input fields for visitors and conversions for Control and Variant groups.",
      },
      {
        type: "added",
        title: "Basic Calculations",
        description: "Simple percentage calculations and basic statistical comparisons.",
      },
    ],
  },
]

const getChangeTypeBadge = (type: string) => {
  const variants = {
    added: "default",
    improved: "secondary",
    fixed: "destructive",
    removed: "outline",
  } as const

  const colors = {
    added: "bg-green-100 text-green-800 hover:bg-green-100",
    improved: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    fixed: "bg-red-100 text-red-800 hover:bg-red-100",
    removed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  } as const

  return (
    <Badge
      variant={variants[type as keyof typeof variants] || "default"}
      className={`${colors[type as keyof typeof colors] || ""} text-xs font-medium`}
    >
      {type.toUpperCase()}
    </Badge>
  )
}

const LogsContent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Changelog</h1>
        <p className="text-gray-600">Track the latest updates and improvements to Henkan Toolkit</p>
      </div>

      {logs.map((log, logIndex) => (
        <Card key={`${log.version}-${logIndex}`} className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-semibold text-gray-900">{log.version}</span>
              <span className="text-sm text-gray-500 font-normal">{log.date}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {log.changes.map((change, changeIndex) => (
                <div key={changeIndex} className="border-l-2 border-gray-100 pl-4 py-2">
                  <div className="flex items-start gap-3 mb-2">
                    {getChangeTypeBadge(change.type)}
                    <h4 className="font-medium text-gray-900 flex-1">{change.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed ml-0">{change.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default LogsContent
