"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, CheckCircle, TrendingUp, Users, Zap, Clock, Play, Eye } from "lucide-react"

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
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
        body: JSON.stringify({ projectDescription }),
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Method Assistant
          </CardTitle>
          <CardDescription>
            Describe your project and get AI-powered recommendations for the best testing methods to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={loading || !projectDescription.trim()} className="w-full">
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Analyzing...
                </>
              ) : (
                "Get Testing Recommendations"
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

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
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Research Type:</span>
                  <Badge variant="outline">{recommendation.researchType}</Badge>
                </div>
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
  )
}
