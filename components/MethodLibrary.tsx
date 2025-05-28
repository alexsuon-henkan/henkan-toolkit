"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Zap, Search } from "lucide-react"

interface Method {
  name: string
  type: "quant" | "quali" | "hybrid"
  description: string
  category: string
  relevance?: number // 0-100 relevance score
}

const methods: Method[] = [
  // Quantitative/Data-driven
  {
    name: "A/B Test",
    type: "quant",
    category: "Randomized Experiments",
    description: "Compare two variants of a page/feature to see which performs better with randomly assigned users.",
  },
  {
    name: "A/A Test",
    type: "quant",
    category: "Randomized Experiments",
    description: "Run the same version on two groups to verify the quality and reliability of your testing setup.",
  },
  {
    name: "A/B/C/N Test",
    type: "quant",
    category: "Randomized Experiments",
    description: "Test multiple variations simultaneously to find the best performing option.",
  },
  {
    name: "Multivariate Test (MVT)",
    type: "quant",
    category: "Randomized Experiments",
    description: "Test multiple elements in combination to understand interaction effects between variables.",
  },
  {
    name: "Multi-Armed Bandit (MAB)",
    type: "quant",
    category: "Randomized Experiments",
    description: "Dynamically allocate more traffic to better-performing variations during the test.",
  },
  {
    name: "Personalisation Test",
    type: "quant",
    category: "Randomized Experiments",
    description: "Adapt experiences to different user segments based on their behavior or characteristics.",
  },
  {
    name: "Quasi-expérimentation",
    type: "quant",
    category: "Statistical Experiments",
    description: "Evaluate without true randomization, often using natural divisions like geography or time.",
  },
  {
    name: "Interrupted Time Series (ITS)",
    type: "quant",
    category: "Statistical Experiments",
    description: "Study effect over time by comparing metrics before and after an intervention.",
  },
  {
    name: "Propensity Score Matching",
    type: "quant",
    category: "Statistical Experiments",
    description:
      "Match similar users in different groups to correct for selection bias when randomization isn't possible.",
  },
  {
    name: "Regression Discontinuity Design (RDD)",
    type: "quant",
    category: "Statistical Experiments",
    description: "Exploit an arbitrary threshold to compare users just above and below a cutoff point.",
  },
  {
    name: "Feature Flag A/B Test",
    type: "quant",
    category: "Deployment Methods",
    description: "Use feature flags to enable a feature for a subset of users to test impact.",
  },
  {
    name: "Progressive Rollout",
    type: "quant",
    category: "Deployment Methods",
    description: "Gradually increase the percentage of users who see a new feature (e.g., 1% → 5% → 10%).",
  },
  {
    name: "Cookie-based Holdout",
    type: "quant",
    category: "Deployment Methods",
    description: "Deliberately withhold a feature from certain users to measure its impact.",
  },
  {
    name: "Geo Holdout Test",
    type: "quant",
    category: "Deployment Methods",
    description: "Compare performance between different geographic regions with and without a feature.",
  },
  {
    name: "Cross-device Test",
    type: "quant",
    category: "Deployment Methods",
    description: "Validate effect on specific devices by enabling a feature only on certain platforms.",
  },
  {
    name: "Shadow Testing",
    type: "quant",
    category: "Algorithm Testing",
    description: "Test an algorithm in the background without exposing results to users.",
  },
  {
    name: "Ghost Experiment",
    type: "quant",
    category: "Algorithm Testing",
    description: "Collect data on potential user actions without actually displaying the feature.",
  },
  {
    name: "Backtesting",
    type: "quant",
    category: "Algorithm Testing",
    description: "Simulate how a new algorithm would have performed using historical data.",
  },
  {
    name: "Fake Door Test",
    type: "quant",
    category: "Growth Testing",
    description: "Measure interest in a feature before building it by showing a non-functional UI element.",
  },
  {
    name: "Smoke Test",
    type: "quant",
    category: "Growth Testing",
    description: "Validate concept interest with minimal implementation before full development.",
  },
  {
    name: "Longitudinal Test",
    type: "quant",
    category: "Growth Testing",
    description: "Observe long-term impact by tracking metrics over extended periods (weeks/months).",
  },
  {
    name: "Holdback Permanent",
    type: "quant",
    category: "Growth Testing",
    description: "Keep a control group permanently unexposed to product changes to measure cumulative impact.",
  },

  // Qualitative/User Testing
  {
    name: "User Test Modéré",
    type: "quali",
    category: "User Testing",
    description: "Observe users completing tasks with a moderator present to ask questions and provide guidance.",
  },
  {
    name: "User Test Non Modéré",
    type: "quali",
    category: "User Testing",
    description: "Remote, unmoderated testing where users complete tasks on their own time and record feedback.",
  },
  {
    name: "Think Aloud Protocol",
    type: "quali",
    category: "User Testing",
    description: "Ask users to verbalize their thoughts while navigating through a product or feature.",
  },
  {
    name: "5-Second Test",
    type: "quali",
    category: "User Testing",
    description: "Show users a design for 5 seconds, then ask what they remember to test first impressions.",
  },
  {
    name: "First Click Test",
    type: "quali",
    category: "User Testing",
    description: "Analyze where users first click when trying to complete a task to evaluate intuitive navigation.",
  },
  {
    name: "Task Completion Test",
    type: "quali",
    category: "User Testing",
    description: "Measure if users can successfully complete specific tasks and identify pain points.",
  },
  {
    name: "Eye Tracking",
    type: "quali",
    category: "Observational Methods",
    description: "Track where users look on a page to understand visual attention and scanning patterns.",
  },
  {
    name: "Heatmaps & Clickmaps",
    type: "quali",
    category: "Observational Methods",
    description: "Visualize where users click, move, and scroll on your pages to identify interaction patterns.",
  },
  {
    name: "Session Replay",
    type: "quali",
    category: "Observational Methods",
    description: "Record and replay actual user sessions to observe real behavior and identify issues.",
  },
  {
    name: "Funnel Analysis",
    type: "hybrid",
    category: "Observational Methods",
    description: "Analyze where users drop off in multi-step processes to identify conversion bottlenecks.",
  },
  {
    name: "In-product Survey",
    type: "quali",
    category: "Feedback Methods",
    description: "Collect quick feedback directly within your product at relevant moments in the user journey.",
  },
  {
    name: "NPS / CSAT / CES",
    type: "hybrid",
    category: "Feedback Methods",
    description: "Measure satisfaction, loyalty, or effort using standardized survey methodologies.",
  },
  {
    name: "Bug Report intégré",
    type: "quali",
    category: "Feedback Methods",
    description: "Allow users to report issues directly through the interface with screenshots and context.",
  },
  {
    name: "Diary Study",
    type: "quali",
    category: "Hybrid Methods",
    description: "Have users document their experiences over days or weeks to understand long-term usage patterns.",
  },
  {
    name: "Click Test / Preference Test",
    type: "quali",
    category: "Hybrid Methods",
    description: "Ask users to choose between design options or where they would click to complete a task.",
  },
  {
    name: "Card Sorting",
    type: "quali",
    category: "Hybrid Methods",
    description: "Have users organize content into categories to inform information architecture decisions.",
  },
  {
    name: "Tree Testing",
    type: "quali",
    category: "Hybrid Methods",
    description: "Test navigation structure without visual design by asking users to find items in a site hierarchy.",
  },
  {
    name: "Customer Interview",
    type: "quali",
    category: "Hybrid Methods",
    description: "Conduct in-depth conversations with users to explore needs, frustrations, and behaviors.",
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "quant":
      return <TrendingUp className="w-4 h-4" />
    case "quali":
      return <Users className="w-4 h-4" />
    case "hybrid":
      return <Zap className="w-4 h-4" />
    default:
      return null
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "quant":
      return "bg-blue-100 text-blue-800"
    case "quali":
      return "bg-green-100 text-green-800"
    case "hybrid":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRelevanceBadge = (relevance?: number) => {
  if (relevance === undefined) return null

  if (relevance >= 80) {
    return <Badge className="bg-green-100 text-green-800">High Match</Badge>
  } else if (relevance >= 50) {
    return <Badge className="bg-yellow-100 text-yellow-800">Medium Match</Badge>
  } else {
    return <Badge className="bg-gray-100 text-gray-500">Low Match</Badge>
  }
}

interface MethodLibraryProps {
  projectMethods?: Method[]
}

export function MethodLibrary({ projectMethods }: MethodLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // If project methods are provided, merge them with the full list to show relevance
  const displayMethods = projectMethods
    ? methods.map((method) => {
        const projectMethod = projectMethods.find((pm) => pm.name === method.name)
        return projectMethod ? { ...method, relevance: projectMethod.relevance } : method
      })
    : methods

  // Filter methods based on search and active tab
  const filteredMethods = displayMethods.filter((method) => {
    const matchesSearch =
      method.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      method.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "quant") return matchesSearch && method.type === "quant"
    if (activeTab === "quali") return matchesSearch && method.type === "quali"
    if (activeTab === "hybrid") return matchesSearch && method.type === "hybrid"

    return matchesSearch
  })

  // Group methods by category
  const methodsByCategory = filteredMethods.reduce(
    (acc, method) => {
      if (!acc[method.category]) {
        acc[method.category] = []
      }
      acc[method.category].push(method)
      return acc
    },
    {} as Record<string, Method[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testing Method Library</CardTitle>
        <CardDescription>Explore all 40 testing methods available for your experimentation strategy</CardDescription>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search methods..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All Methods</TabsTrigger>
              <TabsTrigger value="quant" className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Quantitative
              </TabsTrigger>
              <TabsTrigger value="quali" className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Qualitative
              </TabsTrigger>
              <TabsTrigger value="hybrid" className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Hybrid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="max-h-[600px] overflow-y-auto">
        <div className="space-y-8">
          {Object.entries(methodsByCategory).map(([category, methods]) => (
            <div key={category}>
              <h3 className="font-medium text-lg mb-3">{category}</h3>
              <div className="space-y-3">
                {methods.map((method) => (
                  <div
                    key={method.name}
                    className={`p-3 border rounded-lg ${method.relevance && method.relevance >= 70 ? "border-green-200 bg-green-50" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{method.name}</h4>
                        <Badge className={`${getTypeColor(method.type)} flex items-center gap-1`}>
                          {getTypeIcon(method.type)}
                          {method.type}
                        </Badge>
                      </div>
                      {getRelevanceBadge(method.relevance)}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(methodsByCategory).length === 0 && (
            <div className="text-center py-8 text-gray-500">No methods found matching your search criteria</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
