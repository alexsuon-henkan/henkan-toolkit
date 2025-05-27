"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Wand2, Info } from "lucide-react"
import { BayesianFAQModal } from "./BayesianFAQModal"
import { toast } from "sonner"
import { calculateBayesianResults } from "../utils/bayesianStatistics"
import { BayesianDistributionChart } from "./BayesianDistributionChart"
import { ProbabilityChart } from "./ProbabilityChart"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function BayesianCalculator() {
  const [participantsA, setParticipantsA] = useState<number>(500)
  const [conversionsA, setConversionsA] = useState<number | null>(100)
  const [participantsB, setParticipantsB] = useState<number>(500)
  const [conversionsB, setConversionsB] = useState<number | null>(120)
  const [priorAlpha, setPriorAlpha] = useState<number>(1)
  const [priorBeta, setPriorBeta] = useState<number>(1)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    calculateResults()
  }, [participantsA, conversionsA, participantsB, conversionsB, priorAlpha, priorBeta])

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

    if (priorAlpha <= 0 || priorBeta <= 0) {
      setError("Prior alpha and beta must be greater than zero.")
      setResults(null)
      return
    }

    try {
      const results = calculateBayesianResults(
        participantsA,
        conversionsA,
        participantsB,
        conversionsB,
        priorAlpha,
        priorBeta,
      )
      setResults(results)
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

  const handleDemoMode = () => {
    try {
      setParticipantsA(10000)
      setConversionsA(500)
      setParticipantsB(10000)
      setConversionsB(550)
      setPriorAlpha(1)
      setPriorBeta(1)
      toast.success("Demo data generated for Bayesian A/B Test Calculator!")
    } catch (error) {
      console.error("Error generating demo data:", error)
      toast.error("Failed to generate demo data")
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div id="bayesian-calculator-content">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Bayesian A/B Test Calculator</h1>
          <p className="text-gray-600 mb-4">Calculate your A/B test results using a Bayesian approach</p>
          <div className="flex justify-center items-center space-x-4">
            <BayesianFAQModal />
            <Button
              onClick={handleDemoMode}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try Bayesian Demo
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="input" className="space-y-4">
              <TabsList>
                <TabsTrigger value="input">Input Data</TabsTrigger>
                <TabsTrigger value="prior">Prior Distribution</TabsTrigger>
              </TabsList>
              <TabsContent value="input" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
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
              </TabsContent>
              <TabsContent value="prior" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="priorAlpha" className="text-sm font-medium mb-1 flex items-center">
                      Prior Alpha: {priorAlpha.toFixed(2)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Alpha represents the number of prior successes. Higher values indicate stronger prior
                              beliefs.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="priorAlpha"
                      min={0.01}
                      max={100}
                      step={0.01}
                      value={[priorAlpha]}
                      onValueChange={(value) => setPriorAlpha(value[0])}
                      className="[&_[role=slider]]:bg-[#4CAF50]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priorBeta" className="text-sm font-medium mb-1 flex items-center">
                      Prior Beta: {priorBeta.toFixed(2)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Beta represents the number of prior failures. Higher values indicate stronger prior
                              beliefs.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="priorBeta"
                      min={0.01}
                      max={100}
                      step={0.01}
                      value={[priorBeta]}
                      onValueChange={(value) => setPriorBeta(value[0])}
                      className="[&_[role=slider]]:bg-[#4CAF50]"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-1">Prior Distribution</Label>
                  <BayesianDistributionChart alpha={priorAlpha} beta={priorBeta} />
                </div>
                <Alert>
                  <AlertTitle>Understanding the Prior Distribution</AlertTitle>
                  <AlertDescription>
                    The prior distribution represents your initial beliefs about the conversion rate before seeing the
                    data. Adjust the Alpha and Beta values to reflect your prior knowledge. A uniform prior (Alpha =
                    Beta = 1) represents no prior knowledge. Higher values for Alpha and Beta represent stronger prior
                    beliefs and will have more influence on the final results.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!error && results && (
              <div className="space-y-8 mt-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-serif text-xl mb-4">Bayesian Analysis Results</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Probability B &gt; A:</span>
                      <span className="text-lg">{(results.probabilityBGreaterA * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Expected Lift:</span>
                      <span className={`text-lg ${results.expectedLift > 0 ? "text-green-600" : "text-red-600"}`}>
                        {results.expectedLift > 0 ? "+" : ""}
                        {(results.expectedLift * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">95% HDI Lower:</span>
                      <span className="text-lg">{(results.hdiLower * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">95% HDI Upper:</span>
                      <span className="text-lg">{(results.hdiUpper * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <AlertTitle>Interpreting the Results</AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">
                        The Highest Density Interval (HDI) shows the range where the true difference in conversion rates
                        is most likely to lie, with 95% probability. If the HDI doesn't include 0, it suggests a
                        meaningful difference between variations.
                      </p>
                      <p>
                        {results.probabilityBGreaterA > 0.95
                          ? `There is strong evidence (${(results.probabilityBGreaterA * 100).toFixed(
                              2,
                            )}% probability) that Variation B outperforms Variation A. The expected lift is ${(
                              results.expectedLift * 100
                            ).toFixed(2)}%, with a 95% HDI of [${(results.hdiLower * 100).toFixed(2)}%, ${(
                              results.hdiUpper * 100
                            ).toFixed(2)}%].`
                          : results.probabilityBGreaterA < 0.05
                            ? `There is strong evidence (${((1 - results.probabilityBGreaterA) * 100).toFixed(
                                2,
                              )}% probability) that Variation A outperforms Variation B. The expected lift for B is ${(
                                results.expectedLift * 100
                              ).toFixed(2)}%, with a 95% HDI of [${(results.hdiLower * 100).toFixed(2)}%, ${(
                                results.hdiUpper * 100
                              ).toFixed(2)}%].`
                            : `The results are inconclusive. There is a ${(results.probabilityBGreaterA * 100).toFixed(
                                2,
                              )}% probability that Variation B outperforms Variation A. The expected lift is ${(
                                results.expectedLift * 100
                              ).toFixed(2)}%, with a 95% HDI of [${(results.hdiLower * 100).toFixed(2)}%, ${(
                                results.hdiUpper * 100
                              ).toFixed(2)}%]. Consider running the test for longer or with a larger sample size.`}
                      </p>
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-4">Posterior Distributions</h3>
                  <BayesianDistributionChart
                    alpha={results.posteriorAlphaA}
                    beta={results.posteriorBetaA}
                    alpha2={results.posteriorAlphaB}
                    beta2={results.posteriorBetaB}
                  />
                  <Alert className="mt-4">
                    <AlertTitle>Understanding Posterior Distributions</AlertTitle>
                    <AlertDescription>
                      The posterior distributions show the updated beliefs about conversion rates after observing the
                      data. The overlap between the two distributions indicates the uncertainty in the difference
                      between the variations. Less overlap suggests a more significant difference.
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-4">Probability of Improvement</h3>
                  <ProbabilityChart probabilityBGreaterA={results.probabilityBGreaterA} />
                  <Alert className="mt-4">
                    <AlertTitle>Interpreting the Probability Chart</AlertTitle>
                    <AlertDescription>
                      This chart visualizes the probability that Variation B outperforms Variation A. The green area
                      represents the probability of B being better, while the red area shows the probability of A being
                      better. A larger green area indicates stronger evidence in favor of Variation B.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">How to Use This Bayesian A/B Test Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li className="text-gray-700">
                Enter the number of participants and conversions for Variations A and B.
              </li>
              <li className="text-gray-700">
                Adjust the prior distribution parameters if you have prior knowledge about conversion rates.
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Use the "Prior Distribution" tab to set Alpha and Beta values.</li>
                  <li>A uniform prior (Alpha = Beta = 1) represents no prior knowledge.</li>
                  <li>Higher values for Alpha and Beta represent stronger prior beliefs.</li>
                </ul>
              </li>
              <li className="text-gray-700">
                Review the Bayesian Analysis Results for a summary of your test outcomes.
              </li>
              <li className="text-gray-700">
                Examine the Posterior Distributions chart to visualize the updated beliefs about conversion rates.
              </li>
              <li className="text-gray-700">
                Check the Probability of Improvement chart for a clear representation of the likelihood that one
                variation outperforms the other.
              </li>
              <li className="text-gray-700">
                Use the Highest Density Interval (HDI) to understand the range of plausible values for the true
                difference in conversion rates.
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
                  term: "Prior Distribution",
                  definition:
                    "The initial belief about the conversion rates before seeing the data. It's defined by Alpha (successes) and Beta (failures) parameters.",
                },
                {
                  term: "Posterior Distribution",
                  definition:
                    "The updated belief about the conversion rates after observing the data. It combines the prior distribution with the observed data.",
                },
                {
                  term: "Highest Density Interval (HDI)",
                  definition:
                    "The range of values containing a specified probability mass (usually 95%) of the posterior distribution. It represents the most credible values for the parameter.",
                },
                {
                  term: "Expected Lift",
                  definition:
                    "The estimated percentage improvement of one variation over another, based on the posterior distributions.",
                },
                {
                  term: "Probability B > A",
                  definition:
                    "The likelihood that Variation B outperforms Variation A, calculated from the posterior distributions.",
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
                  question: "What is Bayesian A/B testing?",
                  answer:
                    "Bayesian A/B testing is an approach that uses Bayes' theorem to update the probability for a hypothesis as more evidence becomes available. It allows for incorporating prior knowledge and provides a more intuitive interpretation of results compared to frequentist methods.",
                },
                {
                  question: "How does Bayesian A/B testing differ from frequentist A/B testing?",
                  answer:
                    "Bayesian A/B testing provides direct probabilities about the performance of variations and allows for incorporating prior knowledge. It doesn't rely on p-values or the concept of statistical significance, which can be misinterpreted. Instead, it provides a full distribution of possible outcomes.",
                },
                {
                  question: "What do the prior alpha and beta values represent?",
                  answer:
                    "Prior alpha and beta are parameters of the Beta distribution used to represent prior knowledge about the conversion rates. Alpha represents the number of prior successes, while Beta represents the number of prior failures. If you don't have prior knowledge, you can use 1 for both (which represents a uniform prior). Higher values represent stronger prior beliefs.",
                },
                {
                  question: "How do I interpret the Highest Density Interval (HDI)?",
                  answer:
                    "The HDI shows the range where the true difference in conversion rates is most likely to lie, with a specified probability (usually 95%). If the HDI doesn't include 0, it suggests a meaningful difference between variations. A narrower HDI indicates more certainty about the true difference.",
                },
                {
                  question: "When should I use Bayesian A/B testing instead of frequentist methods?",
                  answer:
                    "Bayesian methods are particularly useful when you have prior knowledge about conversion rates, when you want to make decisions as data is collected (rather than waiting for a fixed sample size), or when you want to directly interpret the probability of one variation being better than another. They're also helpful when dealing with small sample sizes or when you need to account for uncertainty in a more nuanced way.",
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
