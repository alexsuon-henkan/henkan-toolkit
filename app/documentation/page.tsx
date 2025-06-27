import { generateMetadata, SchemaOrgWebPage } from "@/components/SEO"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calculator,
  Clock,
  DollarSign,
  ShoppingCart,
  Brain,
  Zap,
  BarChart3,
  TrendingUp,
  Bot,
  Sparkles,
  GitBranch,
  Activity,
} from "lucide-react"

export const metadata = generateMetadata({
  title: "Complete Documentation | A/B Testing Toolkit",
  description:
    "Comprehensive guide to all calculators, assistants, and visualization tools in the Henkan A/B Testing Toolkit.",
  keywords: ["A/B testing", "documentation", "calculators", "statistical analysis", "conversion optimization"],
  pathname: "/documentation",
  type: "article",
})

export default function DocumentationPage() {
  return (
    <>
      <SchemaOrgWebPage
        title="Complete Documentation | Henkan A/B Testing Toolkit"
        description="Comprehensive guide to all calculators, assistants, and visualization tools in the Henkan A/B Testing Toolkit."
        pathname="/documentation"
      />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Complete Toolkit Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about our A/B testing calculators, assistants, and visualization tools. From
              statistical significance to revenue impact analysis.
            </p>
          </div>

          {/* Calculators Section */}
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <Calculator className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Statistical Calculators</h2>
            </div>

            <div className="grid gap-8">
              {/* Frequentist Calculator */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                      Frequentist A/B Test Calculator
                    </CardTitle>
                    <Badge variant="default">Core Tool</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    The foundation of statistical A/B testing using the frequentist approach. Calculate statistical
                    significance, confidence levels, and determine if your test results are meaningful.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it calculates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Statistical significance (p-value)</li>
                        <li>Confidence level (95%, 99%, etc.)</li>
                        <li>Z-score and test statistics</li>
                        <li>Conversion rate lift percentage</li>
                        <li>Sample Ratio Mismatch (SRM) detection</li>
                        <li>Observed statistical power</li>
                        <li>False positive/negative rates</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Uses two-proportion z-test methodology</li>
                        <li>Calculates pooled standard error</li>
                        <li>Generates normal distribution curves</li>
                        <li>Provides visual probability distributions</li>
                        <li>Real-time calculation as you type</li>
                        <li>Comprehensive statistical breakdown</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Best for:</h4>
                    <p className="text-blue-800 text-sm">
                      Traditional hypothesis testing, regulatory compliance, academic research, and situations requiring
                      strict statistical rigor with clear significance thresholds.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Bayesian Calculator */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <Brain className="w-6 h-6 mr-2 text-purple-600" />
                      Bayesian A/B Test Calculator
                    </CardTitle>
                    <Badge variant="secondary">BETA</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Advanced Bayesian approach that incorporates prior knowledge and provides probability-based results.
                    More intuitive interpretation of test outcomes with continuous learning.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it calculates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Probability that B beats A</li>
                        <li>Expected lift with uncertainty</li>
                        <li>Highest Density Interval (HDI)</li>
                        <li>Posterior distributions</li>
                        <li>Prior belief incorporation</li>
                        <li>Credible intervals</li>
                        <li>Risk of being wrong</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Uses Beta-Binomial conjugate priors</li>
                        <li>Monte Carlo sampling for probabilities</li>
                        <li>Adjustable prior alpha/beta parameters</li>
                        <li>Visual posterior distribution charts</li>
                        <li>Continuous belief updating</li>
                        <li>No fixed sample size requirements</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Best for:</h4>
                    <p className="text-purple-800 text-sm">
                      Incorporating domain expertise, continuous monitoring, early decision making, and situations where
                      you want direct probability statements about your results.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Duration Calculator */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <Clock className="w-6 h-6 mr-2 text-green-600" />
                      Duration Calculator
                    </CardTitle>
                    <Badge variant="outline">Planning</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Plan your A/B tests before you start. Calculate required sample sizes, test duration, and understand
                    the trade-offs between statistical power and minimum detectable effects.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it calculates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Required sample size per variation</li>
                        <li>Total test duration in days</li>
                        <li>Weekly MDE breakdown tables</li>
                        <li>Statistical power requirements</li>
                        <li>Multiple variation support</li>
                        <li>Custom significance levels</li>
                        <li>Traffic allocation planning</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Power analysis calculations</li>
                        <li>Effect size determination</li>
                        <li>Multiple testing corrections</li>
                        <li>Traffic volume considerations</li>
                        <li>Seasonal adjustment factors</li>
                        <li>Risk tolerance balancing</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Best for:</h4>
                    <p className="text-green-800 text-sm">
                      Pre-test planning, resource allocation, timeline estimation, and understanding the statistical
                      requirements before launching your experiments.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Calculator */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <DollarSign className="w-6 h-6 mr-2 text-emerald-600" />
                      Revenue Impact Calculator
                    </CardTitle>
                    <Badge variant="outline">Business</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Translate your A/B test results into business impact. Calculate long-term revenue projections with
                    seasonality adjustments and performance decay modeling.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it calculates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Incremental revenue projections</li>
                        <li>3, 6, and 12-month forecasts</li>
                        <li>Seasonality-adjusted estimates</li>
                        <li>Performance decay modeling</li>
                        <li>Monthly breakdown analysis</li>
                        <li>Cumulative impact tracking</li>
                        <li>ROI calculations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Multi-step wizard interface</li>
                        <li>Baseline metrics collection</li>
                        <li>Test results integration</li>
                        <li>Seasonal pattern analysis</li>
                        <li>Decay curve application</li>
                        <li>Monte Carlo simulations</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Best for:</h4>
                    <p className="text-emerald-800 text-sm">
                      Business case development, stakeholder reporting, budget planning, and demonstrating the long-term
                      value of optimization efforts.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* AOV Calculator */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <ShoppingCart className="w-6 h-6 mr-2 text-orange-600" />
                      AOV (Average Order Value) Calculator
                    </CardTitle>
                    <Badge variant="outline">E-commerce</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Specialized calculator for e-commerce metrics using non-parametric statistical tests. Perfect for
                    analyzing average order value differences between test variations.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it calculates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Mann-Whitney U test results</li>
                        <li>Statistical significance for AOV</li>
                        <li>Median and mean comparisons</li>
                        <li>Effect size measurements</li>
                        <li>Distribution-free analysis</li>
                        <li>Rank-based statistics</li>
                        <li>Percentage difference calculations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Non-parametric statistical approach</li>
                        <li>Handles skewed distributions</li>
                        <li>CSV file upload support</li>
                        <li>Manual data entry options</li>
                        <li>Robust to outliers</li>
                        <li>No normality assumptions</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Best for:</h4>
                    <p className="text-orange-800 text-sm">
                      E-commerce A/B tests, revenue per visitor analysis, pricing experiments, and any metric with
                      non-normal distributions or significant outliers.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Max Experiments Calculator */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
                      Maximum Experiments Calculator
                    </CardTitle>
                    <Badge variant="outline">Capacity</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Determine your organization's A/B testing capacity. Calculate how many experiments you can run
                    annually based on traffic, statistical requirements, and parallel testing capabilities.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it calculates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Annual testing capacity</li>
                        <li>Sequential vs parallel testing</li>
                        <li>Traffic allocation optimization</li>
                        <li>False positive risk management</li>
                        <li>MDE vs sample size trade-offs</li>
                        <li>Resource planning metrics</li>
                        <li>Testing velocity projections</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Traffic volume analysis</li>
                        <li>Statistical power calculations</li>
                        <li>Multiple testing corrections</li>
                        <li>Parallel testing modeling</li>
                        <li>Risk tolerance balancing</li>
                        <li>Interactive parameter adjustment</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 mb-2">Best for:</h4>
                    <p className="text-indigo-800 text-sm">
                      Experimentation program planning, team capacity planning, roadmap prioritization, and optimizing
                      your testing infrastructure for maximum learning velocity.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-16" />

          {/* Assistants Section */}
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <Bot className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold">AI-Powered Assistants</h2>
            </div>

            <div className="grid gap-8">
              {/* Method Assistant */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
                      Method Assistant
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">AI</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Your AI-powered experimentation consultant. Get personalized recommendations for test methodologies,
                    statistical approaches, and experimental design based on your specific context and goals.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it provides:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Methodology recommendations</li>
                        <li>Statistical approach guidance</li>
                        <li>Sample size suggestions</li>
                        <li>Test design optimization</li>
                        <li>Risk assessment advice</li>
                        <li>Industry best practices</li>
                        <li>Troubleshooting support</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Natural language processing</li>
                        <li>Context-aware recommendations</li>
                        <li>Screenshot analysis capability</li>
                        <li>Interactive Q&A format</li>
                        <li>Personalized guidance</li>
                        <li>Real-time consultation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Best for:</h4>
                    <p className="text-blue-800 text-sm">
                      Getting expert advice on test design, choosing the right statistical method, troubleshooting
                      experimental issues, and learning A/B testing best practices.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistant */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <Zap className="w-6 h-6 mr-2 text-purple-600" />
                      AI Code Assistant
                    </CardTitle>
                    <Badge className="bg-purple-100 text-purple-800">NEW</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Generate ready-to-use JavaScript code for banners and modals. Upload a screenshot, describe your
                    idea, and get console-ready code for quick implementation and testing.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it generates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Information banners</li>
                        <li>Newsletter signup modals</li>
                        <li>Countdown timers</li>
                        <li>Exit-intent popups</li>
                        <li>Cookie consent banners</li>
                        <li>Promotional overlays</li>
                        <li>Custom interactive elements</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Claude 4 AI integration</li>
                        <li>Screenshot analysis</li>
                        <li>Natural language processing</li>
                        <li>Code generation & validation</li>
                        <li>Browser console compatibility</li>
                        <li>Copy-paste ready output</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Best for:</h4>
                    <p className="text-purple-800 text-sm">
                      Rapid prototyping, quick A/B test implementations, banner creation, modal development, and getting
                      a head start on front-end code (requires developer review).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-16" />

          {/* Visualization Tools Section */}
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <GitBranch className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Visualization Tools</h2>
            </div>

            <div className="grid gap-8">
              {/* Sankey Diagram */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <GitBranch className="w-6 h-6 mr-2 text-teal-600" />
                      Sankey Diagram Generator
                    </CardTitle>
                    <Badge variant="outline">Visualization</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Create beautiful flow diagrams to visualize user journeys, conversion funnels, and traffic
                    distribution across your website or application.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it creates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>User journey visualizations</li>
                        <li>Conversion funnel diagrams</li>
                        <li>Traffic flow analysis</li>
                        <li>A/B test traffic splits</li>
                        <li>Multi-step process flows</li>
                        <li>Revenue attribution maps</li>
                        <li>Custom flow diagrams</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>D3.js powered visualizations</li>
                        <li>Interactive node editing</li>
                        <li>Drag-and-drop interface</li>
                        <li>Real-time preview</li>
                        <li>Export capabilities</li>
                        <li>Responsive design</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-900 mb-2">Best for:</h4>
                    <p className="text-teal-800 text-sm">
                      Stakeholder presentations, funnel analysis, user journey mapping, and visualizing complex data
                      flows in an intuitive format.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Waterfall Chart */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center">
                      <Activity className="w-6 h-6 mr-2 text-cyan-600" />
                      Waterfall Chart Generator
                    </CardTitle>
                    <Badge variant="outline">Visualization</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Build waterfall charts to show cumulative effects, revenue breakdowns, and step-by-step metric
                    changes over time or across different segments.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What it creates:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Revenue impact breakdowns</li>
                        <li>Cumulative effect analysis</li>
                        <li>Performance change tracking</li>
                        <li>Budget allocation charts</li>
                        <li>Metric decomposition views</li>
                        <li>Before/after comparisons</li>
                        <li>Multi-factor analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Interactive chart builder</li>
                        <li>Custom data input</li>
                        <li>Automatic calculations</li>
                        <li>Color-coded segments</li>
                        <li>Export functionality</li>
                        <li>Responsive layouts</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-900 mb-2">Best for:</h4>
                    <p className="text-cyan-800 text-sm">
                      Financial reporting, performance analysis, showing incremental changes, and breaking down complex
                      metrics into understandable components.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Getting Started Section */}
          <section className="mb-16">
            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Getting Started Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Plan Your Test</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the Duration Calculator to determine sample size and timeline. Consult the Method Assistant
                      for experimental design advice.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-purple-600">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Run Your Test</h4>
                    <p className="text-sm text-muted-foreground">
                      Implement your variations using the AI Code Assistant for quick prototypes. Monitor progress and
                      collect data systematically.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-green-600">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Analyze Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Use Frequentist or Bayesian calculators for statistical analysis. Calculate business impact with
                      the Revenue Calculator.
                    </p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-muted-foreground">
                    Each tool is designed to work independently or as part of a complete experimentation workflow. Start
                    with any calculator that matches your current needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Technical Details Section */}
          <section>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Technical Implementation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Statistical Methods</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Frequentist:</strong> Two-proportion z-tests, normal approximation
                      </li>
                      <li>
                        <strong>Bayesian:</strong> Beta-binomial conjugate priors, Monte Carlo sampling
                      </li>
                      <li>
                        <strong>Non-parametric:</strong> Mann-Whitney U tests for skewed distributions
                      </li>
                      <li>
                        <strong>Power Analysis:</strong> Effect size calculations, sample size determination
                      </li>
                      <li>
                        <strong>Multiple Testing:</strong> Bonferroni corrections, false discovery rate control
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">AI Integration</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Method Assistant:</strong> OpenAI GPT-4 with custom prompts
                      </li>
                      <li>
                        <strong>Code Assistant:</strong> Anthropic Claude 4 with vision capabilities
                      </li>
                      <li>
                        <strong>Image Analysis:</strong> Multi-modal AI for screenshot interpretation
                      </li>
                      <li>
                        <strong>Code Generation:</strong> JavaScript output with validation
                      </li>
                      <li>
                        <strong>Safety:</strong> Content filtering and developer review recommendations
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Data Privacy & Security</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <strong>No Data Storage:</strong> All calculations are performed client-side or in stateless API
                      calls
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <strong>Secure Processing:</strong> Images and prompts are processed securely and not retained
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <strong>Open Source:</strong> All statistical methods are transparent and verifiable
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  )
}
