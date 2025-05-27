"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateTestMetrics, type TestCalculationResult } from "@/utils/calculate-test-metrics"
import { WeeklyMDETable, type WeeklyMDEResult } from "./WeeklyMDETable"
import { DurationFAQModal } from "./DurationFAQModal"
import { Wand2 } from "lucide-react"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export type TestObjective = "derisk" | "increase" | "decrease" | "custom" | "unknown"

export default function DurationCalculator() {
  const [dailyVisitors, setDailyVisitors] = useState<string>("")
  const [conversionRate, setConversionRate] = useState<string>("")
  const [numberOfVariations, setNumberOfVariations] = useState<string>("2")
  const [testObjective, setTestObjective] = useState<TestObjective>("derisk")
  const [customMde, setCustomMde] = useState<string>("")
  const [advancedMode, setAdvancedMode] = useState(false)
  const [significanceLevel, setSignificanceLevel] = useState("0.95")
  const [statisticalPower, setStatisticalPower] = useState("0.8")
  const [results, setResults] = useState<WeeklyMDEResult[] | TestCalculationResult | null>(null)

  const handleCalculate = () => {
    const metrics = calculateTestMetrics(
      Number(dailyVisitors),
      Number(conversionRate) / 100,
      testObjective,
      customMde ? Number(customMde) / 100 : undefined,
      Number(significanceLevel),
      Number(statisticalPower),
      Number(numberOfVariations),
    )
    setResults(metrics)
  }

  const handleDemoMode = () => {
    try {
      setDailyVisitors("5000")
      setConversionRate("2.5")
      setNumberOfVariations("2")
      setTestObjective("increase")
      setCustomMde("")
      setAdvancedMode(false)
      setSignificanceLevel("0.95")
      setStatisticalPower("0.8")
      toast.success("Demo data generated for Duration Calculator!")
    } catch (error) {
      console.error("Error generating demo data:", error)
      toast.error("Failed to generate demo data")
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div id="duration-calculator-content">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Duration Calculator</h1>
          <p className="text-gray-600 mb-4">Calculate the required sample size and duration for your A/B test</p>
          <div className="flex justify-center items-center space-x-4">
            <DurationFAQModal />
            <Button
              onClick={handleDemoMode}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try Duration Demo
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="daily-visitors" className="text-sm font-medium mb-1">
                  Daily visitors (total for all variations)
                </Label>
                <Input
                  id="daily-visitors"
                  type="number"
                  placeholder="Enter number of daily visitors"
                  value={dailyVisitors}
                  onChange={(e) => setDailyVisitors(e.target.value)}
                  className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                />
              </div>
              <div>
                <Label htmlFor="conversion-rate" className="text-sm font-medium mb-1">
                  Current conversion rate (%)
                </Label>
                <Input
                  id="conversion-rate"
                  type="number"
                  step="0.01"
                  placeholder="Enter conversion rate (e.g., 5 for 5%)"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                  className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                />
              </div>
              <div>
                <Label htmlFor="variations" className="text-sm font-medium mb-1">
                  How many variations (including control) do you want to test?
                </Label>
                <Select value={numberOfVariations} onValueChange={setNumberOfVariations}>
                  <SelectTrigger
                    id="variations"
                    className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                  >
                    <SelectValue placeholder="Select number of variations" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6, 7].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <Label className="text-sm font-medium mb-1">Test Objective (Minimum Detectable Effect)</Label>
              <RadioGroup value={testObjective} onValueChange={(value: TestObjective) => setTestObjective(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="derisk" id="derisk" />
                  <Label htmlFor="derisk">De-risk launch (±0.1% change)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="increase" id="increase" />
                  <Label htmlFor="increase">Check for an increase (10% of baseline)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="decrease" id="decrease" />
                  <Label htmlFor="decrease">Check for a decrease (5% of baseline)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom MDE</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="unknown" />
                  <Label htmlFor="unknown">I don't know my MDE. Show me results by week.</Label>
                </div>
              </RadioGroup>
            </div>

            {testObjective === "custom" && (
              <div className="mb-8">
                <Label htmlFor="custom-mde" className="text-sm font-medium mb-1">
                  Custom MDE (%)
                </Label>
                <Input
                  id="custom-mde"
                  type="number"
                  step="0.01"
                  placeholder="Enter custom MDE percentage"
                  value={customMde}
                  onChange={(e) => setCustomMde(e.target.value)}
                  className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50] max-w-xs"
                />
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-2">
                <Switch checked={advancedMode} onCheckedChange={setAdvancedMode} id="advanced-mode" />
                <Label htmlFor="advanced-mode">Advanced Mode (Optional)</Label>
              </div>

              {advancedMode && (
                <div className="space-y-4 pl-6">
                  <div>
                    <Label htmlFor="significance" className="text-sm font-medium mb-1">
                      Significance Level (α)
                    </Label>
                    <Select value={significanceLevel} onValueChange={setSignificanceLevel}>
                      <SelectTrigger
                        id="significance"
                        className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50] max-w-xs"
                      >
                        <SelectValue placeholder="Select significance level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.9">90%</SelectItem>
                        <SelectItem value="0.95">95% (default)</SelectItem>
                        <SelectItem value="0.99">99%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="power" className="text-sm font-medium mb-1">
                      Statistical Power (1 - β)
                    </Label>
                    <Select value={statisticalPower} onValueChange={setStatisticalPower}>
                      <SelectTrigger
                        id="power"
                        className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50] max-w-xs"
                      >
                        <SelectValue placeholder="Select statistical power" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.8">80% (default)</SelectItem>
                        <SelectItem value="0.85">85%</SelectItem>
                        <SelectItem value="0.9">90%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handleCalculate} className="w-full bg-[#4CAF50] text-white hover:bg-[#45a049]">
              Calculate Test Metrics
            </Button>

            {results && (
              <div className="mt-8">
                {testObjective === "unknown" && Array.isArray(results) ? (
                  <WeeklyMDETable results={results} />
                ) : (
                  <Alert>
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>
                          <strong>Test Duration:</strong>{" "}
                          {(results as TestCalculationResult).durationInDays?.toLocaleString() ?? "N/A"} days
                        </p>
                        <p>
                          <strong>Sample Size per Variation:</strong>{" "}
                          {(results as TestCalculationResult).sampleSizePerVariation?.toLocaleString() ?? "N/A"}{" "}
                          visitors
                        </p>
                        <p>
                          <strong>Total Sample Size:</strong>{" "}
                          {(results as TestCalculationResult).totalSampleSize?.toLocaleString() ?? "N/A"} visitors
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How to Use This Duration Calculator */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">How to Use This Duration Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li className="text-gray-700">Enter the number of daily visitors to your website or app.</li>
              <li className="text-gray-700">Input your current conversion rate as a percentage.</li>
              <li className="text-gray-700">
                Select the number of variations you want to test, including the control.
              </li>
              <li className="text-gray-700">Choose your test objective or minimum detectable effect (MDE).</li>
              <li className="text-gray-700">
                If desired, adjust advanced settings like significance level and statistical power.
              </li>
              <li className="text-gray-700">
                Click "Calculate Test Metrics" to see the required sample size and test duration.
              </li>
              <li className="text-gray-700">
                Review the results, including test duration, sample size per variation, and total sample size.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Key Terms and Definitions */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Key Terms and Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              {[
                {
                  term: "Daily Visitors",
                  definition: "The average number of unique visitors to your website or app per day.",
                },
                {
                  term: "Conversion Rate",
                  definition:
                    "The percentage of visitors who complete a desired action (e.g., making a purchase, signing up).",
                },
                {
                  term: "Variations",
                  definition:
                    "The different versions of your website or app that you're testing, including the control.",
                },
                {
                  term: "Minimum Detectable Effect (MDE)",
                  definition:
                    "The smallest improvement in your conversion rate that you want to be able to detect with statistical significance.",
                },
                {
                  term: "Statistical Significance",
                  definition: "The likelihood that the difference between variations is not due to random chance.",
                },
                { term: "Statistical Power", definition: "The probability of detecting a true effect when it exists." },
                {
                  term: "Sample Size",
                  definition: "The number of visitors required for each variation to achieve statistical significance.",
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

        {/* Frequently Asked Questions */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "Why is test duration important in A/B testing?",
                  answer:
                    "Test duration is crucial because it ensures that you collect enough data to make statistically significant decisions. Running a test for too short a time may lead to unreliable results, while running it too long wastes resources and delays implementation of improvements.",
                },
                {
                  question: "How does the number of variations affect test duration?",
                  answer:
                    "More variations generally require a longer test duration. This is because each variation needs to receive enough traffic to reach statistical significance. The calculator adjusts the sample size and duration based on the number of variations you're testing.",
                },
                {
                  question: "What is a good Minimum Detectable Effect (MDE) to use?",
                  answer:
                    "The ideal MDE depends on your specific situation. A smaller MDE allows you to detect smaller changes but requires a larger sample size and longer test duration. For many businesses, an MDE of 2-5% is a good starting point, but you may adjust this based on your traffic volume and the potential impact of the change.",
                },
                {
                  question: "Can I stop my test early if I see significant results?",
                  answer:
                    "It's generally not recommended to stop a test early, even if you see significant results. The calculated duration ensures that your results are reliable and not due to random fluctuations. Stopping early increases the risk of making decisions based on false positives.",
                },
                {
                  question: "What should I do if the calculated test duration is too long for my needs?",
                  answer:
                    "If the test duration is longer than desired, you have a few options: 1) Increase your MDE, which will reduce the required sample size. 2) Reduce the number of variations you're testing. 3) Find ways to increase your daily traffic. 4) Consider running the test on a subset of your traffic if it's a high-impact change.",
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
