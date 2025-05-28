"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  Clock,
  Play,
  Eye,
  AlertTriangle,
  Info,
  Library,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MethodLibrary } from "./MethodLibrary"

interface TopMethod {
  rank: number
  method: string
  type: "quant" | "quali" | "hybrid"
  reasoning: string
}

interface Timeline {
  beforeLaunch: string[]
  atLaunch: string[]
  afterLaunch: string[]
}

interface Recommendation {
  testingNeeded: boolean
  researchType: string
  topMethods: TopMethod[]
  timeline: Timeline
  requirements: string[]
  summary: string
}

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

export function MethodAssistant() {
  const [projectDescription, setProjectDescription] = useState("")
  const [cannotSplitUsers, setCannotSplitUsers] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLibrary, setShowLibrary] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectDescription.trim()) return

    setLoading(true)
    setError("")
    setRecommendation(null)

    try {
      const response = await fetch("/api/method-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectDescription,
          cannotSplitUsers,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get recommendation")
      }

      const data = await response.json()
      setRecommendation(data.recommendation)
    } catch (err) {
      setError("Failed to get recommendation. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Method Assistant
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                BETA
              </Badge>
            </CardTitle>
            <CardDescription>
              Describe your project and get AI-powered recommendations for the best testing methods to use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="project" className="text-sm font-medium mb-2 block">
                  Project Description
                </Label>
                <Textarea
                  id="project"
                  placeholder="Describe your project, feature, or change you want to test. For example: 'We're redesigning our checkout flow to reduce cart abandonment' or 'We want to test a new pricing page layout'..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* User Split Constraint Toggle */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="split-constraint" className="text-sm font-medium text-orange-900">
                        Cannot split users 50/50
                      </Label>
                      <Switch id="split-constraint" checked={cannotSplitUsers} onCheckedChange={setCannotSplitUsers} />
                    </div>
                    <p className="text-sm text-orange-700">
                      Enable this if you cannot randomly show different experiences to users (e.g., content platforms
                      like Netflix, news sites, or features that affect all users equally)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading || !projectDescription.trim()} className="flex-1">
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    "Get Testing Recommendations"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="flex items-center gap-1"
                >
                  <Library className="w-4 h-4" />
                  {showLibrary ? "Hide" : "View"} Method Library
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {showLibrary && (
          <MethodLibrary
            projectMethods={recommendation?.topMethods.map((m) => ({
              name: m.method,
              type: m.type as "quant" | "quali" | "hybrid",
              description: m.reasoning,
              category: "",
              relevance: 100 - (m.rank - 1) * 20, // Convert rank 1-5 to relevance 100-20
            }))}
          />
        )}

        {recommendation && (
          <div className="space-y-6">
            {/* Testing Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Testing Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Testing Needed:</span>
                    <Badge variant={recommendation.testingNeeded ? "default" : "secondary"}>
                      {recommendation.testingNeeded ? "Yes" : "No"}
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          <strong>Yes:</strong> Your project would benefit from testing to validate assumptions, measure
                          impact, or understand user behavior.
                          <br />
                          <strong>No:</strong> Testing may not be necessary (e.g., simple bug fixes, compliance changes,
                          or low-risk updates).
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium">Research Type:</span>
                    <Badge variant="outline">{recommendation.researchType}</Badge>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          <strong>Quantitative:</strong> Data-driven testing with numbers and statistics (A/B tests,
                          analytics).
                          <br />
                          <strong>Qualitative:</strong> Understanding user behavior and motivations (interviews,
                          usability tests).
                          <br />
                          <strong>Both:</strong> Combine numbers with insights for a complete picture.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {cannotSplitUsers && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Constraint:</span>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        No User Splitting
                      </Badge>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Traditional A/B testing is not possible. Recommendations focus on alternative methods like
                            time-based comparisons, geographic testing, or qualitative research.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  <p className="text-gray-600">{recommendation.summary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Testing Timeline
                </CardTitle>
                <CardDescription>Strategic sequence for your testing approach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Before Launch */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-blue-800">Before Launch</h3>
                    </div>
                    <ul className="space-y-2">
                      {recommendation.timeline.beforeLaunch.map((step, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* At Launch */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-green-800">At Launch</h3>
                    </div>
                    <ul className="space-y-2">
                      {recommendation.timeline.atLaunch.map((step, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* After Launch */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-purple-800">After Launch</h3>
                    </div>
                    <ul className="space-y-2">
                      {recommendation.timeline.afterLaunch.map((step, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top 5 Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Recommended Methods</CardTitle>
                <CardDescription>Ranked from most to least appropriate for your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendation.topMethods.map((method) => (
                    <div
                      key={method.rank}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                        {method.rank}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{method.method}</h3>
                          <Badge className={`${getTypeColor(method.type)} flex items-center gap-1`}>
                            {getTypeIcon(method.type)}
                            {method.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{method.reasoning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {recommendation.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Considerations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendation.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
