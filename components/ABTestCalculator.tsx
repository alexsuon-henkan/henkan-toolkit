"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import {
  calculateConversionRate,
  calculateZScore,
  calculateConfidence,
  calculateLift,
  generateNormalDistribution,
  calculateStandardError,
  calculateRequiredSampleSize,
  calculateObservedPower,
  calculateSRM,
} from "../utils/statistics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Wand2 } from "lucide-react"
import { ABTestFAQModal } from "./ABTestFAQModal"
import { toast } from "sonner"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const HENKAN_GREEN = "#4CAF50"

export default function ABTestCalculator() {
  const [participantsA, setParticipantsA] = useState<number>(500)
  const [conversionsA, setConversionsA] = useState<number | null>(100)
  const [participantsB, setParticipantsB] = useState<number>(500)
  const [conversionsB, setConversionsB] = useState<number | null>(120)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    calculateResults()
  }, [participantsA, conversionsA, participantsB, conversionsB])

  const calculateResults = () => {
    setError(null)

    if (participantsA <= 0 || participantsB <= 0) {
      setError("Number of participants must be greater than zero.")
      setResults(null)
      return
    }

    if (conversionsA === null || conversionsB === null || isNaN(conversionsA) || isNaN(conversionsB)) {
      setError("Number of conversions must be a valid number.")
      setResults(null)
      return
    }

    if (conversionsA < 0 || conversionsB < 0) {
      setError("Number of conversions cannot be negative.")
      setResults(null)
      return
    }

    if (conversionsA > participantsA || conversionsB > participantsB) {
      setError("Number of conversions cannot be greater than the number of participants.")
      setResults(null)
      return
    }

    try {
      const rateA = calculateConversionRate(conversionsA, participantsA)
      const rateB = calculateConversionRate(conversionsB, participantsB)
      const zScore = calculateZScore(rateA, rateB, participantsA, participantsB)
      const confidence = calculateConfidence(zScore)
      const lift = calculateLift(rateA, rateB)
      const seA = calculateStandardError(rateA, participantsA)
      const seB = calculateStandardError(rateB, participantsB)
      const requiredSampleSize = calculateRequiredSampleSize(rateA, rateB)
      const observedPower = calculateObservedPower(zScore)
      const srmPValue = calculateSRM(participantsA, participantsB)

      const distributionA = generateNormalDistribution(rateA, seA, rateA - 4 * seA, rateA + 4 * seA, 100)
      const distributionB = generateNormalDistribution(rateB, seB, rateB - 4 * seB, rateB + 4 * seB, 100)

      const improvementDistribution = generateNormalDistribution(
        lift,
        Math.sqrt(seA ** 2 + seB ** 2),
        lift - 8 * Math.sqrt(seA ** 2 + seB ** 2),
        lift + 8 * Math.sqrt(seA ** 2 + seB ** 2),
        100,
      )

      const percentile95A = rateA + 1.96 * seA

      setResults({
        rateA,
        rateB,
        confidence,
        lift,
        distributionA,
        distributionB,
        improvementDistribution,
        requiredSampleSize,
        zScore,
        pValue: 1 - confidence,
        percentile95A,
        observedPower,
        falsePositiveRate: 0.05,
        falseNegativeRate: 1 - observedPower,
        srmPValue,
      })
    } catch (err) {
      setError("An error occurred while calculating results. Please check your input values.")
      setResults(null)
    }
  }

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<number | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === "" ? null : Number(e.target.value)
      setter(value)
    }

  const conversionRateChartData = {
    datasets: [
      {
        label: "Variation A",
        data: results?.distributionA,
        borderColor: "#666666",
        backgroundColor: "rgba(102, 102, 102, 0.2)",
        fill: true,
        pointRadius: 0,
      },
      {
        label: "Variation B",
        data: results?.distributionB,
        borderColor: HENKAN_GREEN,
        backgroundColor: `${HENKAN_GREEN}33`,
        fill: true,
        pointRadius: 0,
      },
      {
        label: "Mean A",
        data: results
          ? [
              { x: results.rateA, y: 0 },
              {
                x: results.rateA,
                y: Math.max(...results.distributionA.map((d) => d[1]), ...results.distributionB.map((d) => d[1])),
              },
            ]
          : [],
        borderColor: "#666666",
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
      },
      {
        label: "Mean B",
        data: results
          ? [
              { x: results.rateB, y: 0 },
              {
                x: results.rateB,
                y: Math.max(...results.distributionA.map((d) => d[1]), ...results.distributionB.map((d) => d[1])),
              },
            ]
          : [],
        borderColor: HENKAN_GREEN,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
      },
      {
        label: "95th Percentile A",
        data: results
          ? [
              { x: results.percentile95A, y: 0 },
              {
                x: results.percentile95A,
                y: Math.max(...results.distributionA.map((d) => d[1]), ...results.distributionB.map((d) => d[1])),
              },
            ]
          : [],
        borderColor: "#666666",
        borderWidth: 2,
        borderDash: [2, 2],
        pointRadius: 0,
      },
    ],
  }

  const improvementChartData = {
    datasets: [
      {
        label: "Improvement",
        data: results?.improvementDistribution,
        borderColor: HENKAN_GREEN,
        backgroundColor: `${HENKAN_GREEN}33`,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
        title: {
          display: true,
          text: "Conversion Rate",
          font: {
            size: 14,
            weight: "normal",
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: "#E5E5E5",
        },
      },
      y: {
        type: "linear" as const,
        position: "left" as const,
        title: {
          display: true,
          text: "Probability Density",
          font: {
            size: 14,
            weight: "normal",
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: "#E5E5E5",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => {
            if (context[0].dataset.label.includes("Mean")) {
              return `${context[0].dataset.label}: ${(context[0].parsed.x * 100).toFixed(2)}%`
            }
            if (context[0].dataset.label.includes("95th Percentile")) {
              return `${context[0].dataset.label}: ${(context[0].parsed.x * 100).toFixed(2)}%`
            }
            return `Conversion Rate: ${(context[0].parsed.x * 100).toFixed(2)}%`
          },
          label: (context) => {
            if (context.dataset.label.includes("Mean") || context.dataset.label.includes("95th Percentile")) {
              return ""
            }
            return `Probability Density: ${context.parsed.y.toFixed(4)}`
          },
        },
      },
      legend: {
        labels: {
          filter: (item) => !item.text.includes("95th Percentile"),
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  }

  const handleDemoMode = () => {
    try {
      setParticipantsA(10000)
      setConversionsA(500)
      setParticipantsB(10000)
      setConversionsB(550)
      toast.success("Demo data generated for A/B Test Calculator!")
    } catch (error) {
      console.error("Error generating demo data:", error)
      toast.error("Failed to generate demo data")
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div id="ab-test-calculator-content">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Frequentist Calculator</h1>
          <p className="text-gray-600 mb-4">Calculate your A/B test results using the frequentist approach</p>
          <div className="flex justify-center items-center space-x-4">
            <ABTestFAQModal />
            <Button
              onClick={handleDemoMode}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try A/B Test Demo
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="participantsA" className="text-sm font-medium mb-1">
                  Participants A
                </Label>
                <Input
                  id="participantsA"
                  type="number"
                  value={participantsA}
                  onChange={(e) => setParticipantsA(Number(e.target.value))}
                  className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                />
              </div>
              <div>
                <Label htmlFor="conversionsA" className="text-sm font-medium mb-1">
                  Conversions A
                </Label>
                <Input
                  id="conversionsA"
                  type="number"
                  value={conversionsA === null ? "" : conversionsA}
                  onChange={handleInputChange(setConversionsA)}
                  className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                />
              </div>
              <div>
                <Label htmlFor="participantsB" className="text-sm font-medium mb-1">
                  Participants B
                </Label>
                <Input
                  id="participantsB"
                  type="number"
                  value={participantsB}
                  onChange={(e) => setParticipantsB(Number(e.target.value))}
                  className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                />
              </div>
              <div>
                <Label htmlFor="conversionsB" className="text-sm font-medium mb-1">
                  Conversions B
                </Label>
                <Input
                  id="conversionsB"
                  type="number"
                  value={conversionsB === null ? "" : conversionsB}
                  onChange={handleInputChange(setConversionsB)}
                  className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!error && results && (
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-serif text-xl mb-4">Executive Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Variation A CVR:</span>
                      <span className="text-lg">{(results.rateA * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Variation B CVR:</span>
                      <span className="text-lg">{(results.rateB * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Improvement</span>
                      <span className={`text-lg ${results.lift > 0 ? "text-green-600" : "text-red-600"}`}>
                        {results.lift > 0 ? "+" : ""}
                        {(results.lift * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Confidence Level</span>
                      <span className="text-lg">{(results.confidence * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    {results.confidence > 0.95
                      ? results.lift > 0
                        ? `You can deploy variation B with confidence. The ${(results.confidence * 100).toFixed(2)}% confidence level indicates strong evidence that the observed improvement of ${(results.lift * 100).toFixed(2)}% is not due to random chance. This surpasses the common threshold of 95% confidence used in A/B testing.`
                        : `You should NOT deploy variation B. The ${(results.confidence * 100).toFixed(2)}% confidence level indicates strong evidence that variation B performs worse than A, with a decrease of ${(results.lift * 100).toFixed(2)}%. This negative impact is statistically significant.`
                      : `You cannot make a conclusive decision. The ${(results.confidence * 100).toFixed(2)}% confidence level does not meet the typical 95% threshold for statistical significance. This means we can't rule out that the observed difference of ${(results.lift * 100).toFixed(2)}% might be due to random variation.`}
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-4">Conversion Rate Distribution</h3>
                  <Line data={conversionRateChartData} options={chartOptions} className="bg-white rounded-lg p-4" />
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-4">Improvement Distribution</h3>
                  <Line data={improvementChartData} options={chartOptions} className="bg-white rounded-lg p-4" />
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="bg-[#4CAF50] text-white p-4">
                    <h3 className="font-serif text-xl">Additional Insights</h3>
                  </div>
                  <div className="p-6">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      <AccordionItem value="key-results">
                        <AccordionTrigger className="text-lg font-medium text-[#4CAF50]">Key Results</AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-gray-50 p-4 rounded-lg mt-2">
                            <p className="mb-2">
                              <span className="font-medium">Lift:</span> {(results.lift * 100).toFixed(2)}%
                            </p>
                            <p>
                              <span className="font-medium">Significance:</span>{" "}
                              <span className={results.confidence > 0.95 ? "text-green-600" : "text-red-600"}>
                                {results.confidence > 0.95
                                  ? "Statistically Significant"
                                  : "Not Statistically Significant"}
                              </span>
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="statistics">
                        <AccordionTrigger className="text-lg font-medium text-[#4CAF50]">Statistics</AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-2">
                            <p>
                              <span className="font-medium">Z-Score:</span> {results.zScore.toFixed(4)}
                            </p>
                            <p>
                              <span className="font-medium">P-value:</span> {results.pValue.toFixed(4)}
                            </p>
                            <p>
                              <span className="font-medium">Observed Power:</span>{" "}
                              {(results.observedPower * 100).toFixed(1)}%
                            </p>
                            <p>
                              <span className="font-medium">False Positive Rate (Type I Error):</span>{" "}
                              {(results.falsePositiveRate * 100).toFixed(1)}%
                            </p>
                            <p>
                              <span className="font-medium">False Negative Rate (Type II Error):</span>{" "}
                              {(results.falseNegativeRate * 100).toFixed(1)}%
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="sample-size">
                        <AccordionTrigger className="text-lg font-medium text-[#4CAF50]">Sample Size</AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-gray-50 p-4 rounded-lg mt-2">
                            <p className="mb-2">
                              <span className="font-medium">Required Size:</span> {results.requiredSampleSize}{" "}
                              participants per variation
                            </p>
                            <p className="text-sm text-gray-600">(To achieve 80% power with 95% confidence level)</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="percentiles">
                        <AccordionTrigger className="text-lg font-medium text-[#4CAF50]">Percentiles</AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-gray-50 p-4 rounded-lg mt-2">
                            <p>
                              <span className="font-medium">95th Percentile (A):</span>{" "}
                              {(results.percentile95A * 100).toFixed(2)}%
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="srm">
                        <AccordionTrigger className="text-lg font-medium text-[#4CAF50]">
                          Sample Ratio Mismatch (SRM)
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-gray-50 p-4 rounded-lg mt-2">
                            <p className="mb-2">
                              <span className="font-medium">SRM p-value:</span> {results.srmPValue.toFixed(4)}
                            </p>
                            <p>
                              <span className="font-medium">Interpretation:</span>{" "}
                              {results.srmPValue < 0.05 ? (
                                <span className="text-red-600">
                                  Potential issue with randomization. The traffic split between variations is
                                  significantly different from expected.
                                </span>
                              ) : (
                                <span className="text-green-600">
                                  No significant SRM detected. The traffic split appears to be as expected.
                                </span>
                              )}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">How to Use This A/B Test Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li className="text-gray-700">
                Enter the number of participants for Variation A and B in the respective fields.
              </li>
              <li className="text-gray-700">Input the number of conversions for each variation.</li>
              <li className="text-gray-700">
                The calculator will automatically update the results as you enter the data.
              </li>
              <li className="text-gray-700">Review the Executive Summary for a quick overview of your test results.</li>
              <li className="text-gray-700">
                Examine the Conversion Rate Distribution and Improvement Distribution charts for visual representation.
              </li>
              <li className="text-gray-700">
                Check the Additional Insights section for more detailed statistical information.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Key Terms and Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              {[
                {
                  term: "Conversion Rate",
                  definition: "The percentage of participants who complete a desired action (e.g., making a purchase).",
                },
                {
                  term: "Z-Score",
                  definition:
                    "A measure of how many standard deviations below or above the population mean a raw score is.",
                },
                {
                  term: "P-Value",
                  definition:
                    "The probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true.",
                },
                {
                  term: "Confidence Level",
                  definition:
                    "The probability that the true value of a parameter falls within a specified range of values.",
                },
                {
                  term: "Statistical Significance",
                  definition:
                    "The likelihood that a relationship between two or more variables is caused by something other than chance.",
                },
                {
                  term: "Observed Power",
                  definition:
                    "The probability of detecting a statistically significant difference when there is a true difference between the variations. It indicates the test's ability to avoid Type II errors (false negatives).",
                },
                {
                  term: "False Positive Rate (Type I Error)",
                  definition:
                    "The probability of rejecting the null hypothesis when it is actually true. It's typically set at 5% (0.05) for most statistical tests.",
                },
                {
                  term: "False Negative Rate (Type II Error)",
                  definition:
                    "The probability of failing to reject the null hypothesis when it is actually false. It's related to the statistical power of the test.",
                },
                {
                  term: "Sample Ratio Mismatch (SRM)",
                  definition:
                    "A check to ensure that the traffic split between variations is as expected. An SRM indicates a potential issue with the randomization process in an A/B test.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <dt className="font-medium text-[#4CAF50] mb-1">{item.term}</dt>
                  <dd className="text-gray-700">{item.definition}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "What is an A/B test?",
                  answer:
                    "An A/B test is a randomized experiment with two variants, A and B, which are the control and treatment in the experiment. It's a way to compare two versions of a single variable to determine which performs better for a given goal.",
                },
                {
                  question: "How long should I run my A/B test?",
                  answer:
                    "The duration of an A/B test depends on several factors, including your sample size, the expected effect size, and your desired confidence level. Generally, it's recommended to run tests for at least two weeks and until you reach statistical significance.",
                },
                {
                  question: "What does statistical significance mean in A/B testing?",
                  answer:
                    "Statistical significance in A/B testing means that the difference observed between variations is likely not due to random chance. Typically, a result is considered statistically significant if the p-value is less than 0.05 (5% significance level).",
                },
                {
                  question: "Can I test more than two variations?",
                  answer:
                    "Yes, you can test more than two variations. This is often called A/B/n testing or multivariate testing. However, testing multiple variations requires larger sample sizes and may take longer to reach statistical significance.",
                },
                {
                  question: "How do I interpret the results of my A/B test?",
                  answer:
                    "To interpret your A/B test results, look at the confidence level and lift. If the confidence level is above 95% and there's a positive lift, you can be reasonably confident that the variation outperforms the control. Always consider practical significance alongside statistical significance.",
                },
              ].map((item, index) => (
                <AccordionItem
                  value={`item-${index + 1}`}
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <AccordionTrigger className="text-left font-medium text-gray-700 hover:text-[#4CAF50]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
