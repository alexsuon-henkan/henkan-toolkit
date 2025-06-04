"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { InfoIcon, TrendingUp, BarChart3, ListChecks, BookOpen } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function MaxExperimentsCalculator() {
  const [dailyVisitors, setDailyVisitors] = useState<number>(10000)
  const [conversionRate, setConversionRate] = useState<number>(5)
  const [mde, setMde] = useState<number>(10)
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95)
  const [targetPower, setTargetPower] = useState<number>(80)
  const [parallelPercentage, setParallelPercentage] = useState<number>(0)

  const [maxExperiments, setMaxExperiments] = useState<number | null>(null)
  const [maxParallelExperiments, setMaxParallelExperiments] = useState<number | null>(null)
  const [sampleSize, setSampleSize] = useState<number | null>(null)
  const [annualVisitors, setAnnualVisitors] = useState<number | null>(null)
  const [falsePositiveRisk, setFalsePositiveRisk] = useState<number>(5)
  const [falseNegativeRisk, setFalseNegativeRisk] = useState<number>(20)
  const [annualFalsePositives, setAnnualFalsePositives] = useState<number | null>(null)
  const [mdeChartData, setMdeChartData] = useState<Array<{ mde: number; falseNegativeRisk: number }>>([])

  useEffect(() => {
    calculateMaxExperiments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calculateMaxExperiments = () => {
    const alpha = (100 - confidenceLevel) / 100
    setFalsePositiveRisk(alpha * 100)

    const zAlpha = getZScore(1 - alpha / 2)
    const zBeta = getZScore(targetPower / 100)

    const p1 = conversionRate / 100
    const p2 = p1 * (1 + mde / 100)

    // Ensure p1 and p2 are valid and different
    if (p1 <= 0 || p1 >= 1 || p2 <= 0 || p2 >= 1 || p1 === p2) {
      // Handle invalid inputs, perhaps set results to null or show an error
      setMaxExperiments(0)
      setMaxParallelExperiments(0)
      setSampleSize(0)
      setAnnualVisitors(dailyVisitors * 365) // Still show annual visitors
      setFalseNegativeRisk(100) // Max risk
      setAnnualFalsePositives(0)
      setMdeChartData([])
      return
    }
    const pAvg = (p1 + p2) / 2

    const calculatedSampleSizePerVariant = Math.ceil(
      (Math.pow(zAlpha + zBeta, 2) * pAvg * (1 - pAvg) * 2) / Math.pow(p2 - p1, 2),
    )

    const totalSampleSize = calculatedSampleSizePerVariant * 2
    const yearlyVisitors = dailyVisitors * 365
    const maxTests = totalSampleSize > 0 ? Math.floor(yearlyVisitors / totalSampleSize) : 0

    let maxTestsWithParallel = maxTests
    if (parallelPercentage > 0) {
      const parallelFactor = 1 + parallelPercentage / 100
      maxTestsWithParallel = Math.floor(maxTests * parallelFactor)
    }

    // Recalculate the actual power achieved with this sample size
    const standardizedEffect = Math.abs(p2 - p1) / Math.sqrt((pAvg * (1 - pAvg) * 2) / calculatedSampleSizePerVariant)
    const achievedPower = calculatePower(standardizedEffect, alpha)
    const calculatedFalseNegativeRisk = Math.max(0, Math.min(100, (1 - achievedPower) * 100))

    console.log("Debug calculations:", {
      p1,
      p2,
      pAvg,
      standardizedEffect,
      achievedPower,
      calculatedFalseNegativeRisk,
      sampleSizePerVariant: calculatedSampleSizePerVariant,
    })

    setFalseNegativeRisk(calculatedFalseNegativeRisk)
    const expectedFalsePositives = maxTests * alpha
    setAnnualFalsePositives(expectedFalsePositives)

    setSampleSize(totalSampleSize)
    setAnnualVisitors(yearlyVisitors)
    setMaxExperiments(maxTests)
    setMaxParallelExperiments(maxTestsWithParallel)

    generateMdeChartData(calculatedSampleSizePerVariant, p1, alpha)
  }

  const generateMdeChartData = (sampleSizePerVariant: number, baseConversionRate: number, alpha: number) => {
    const chartData = []
    if (sampleSizePerVariant <= 0) {
      setMdeChartData([])
      return
    }
    for (let mdePct = 1; mdePct <= 30; mdePct++) {
      const p1 = baseConversionRate
      const p2 = p1 * (1 + mdePct / 100)
      if (p1 <= 0 || p1 >= 1 || p2 <= 0 || p2 >= 1 || p1 === p2) continue
      const pAvg = (p1 + p2) / 2

      const standardizedEffect = Math.abs(p2 - p1) / Math.sqrt((pAvg * (1 - pAvg) * 2) / sampleSizePerVariant)
      const calculatedPower = calculatePower(standardizedEffect, alpha)
      const calculatedFalseNegativeRisk = 100 - calculatedPower * 100

      chartData.push({
        mde: mdePct,
        falseNegativeRisk: Math.max(0, Math.min(100, calculatedFalseNegativeRisk)), // Clamp between 0 and 100
      })
    }
    setMdeChartData(chartData)
  }

  // Simplified statistical functions to avoid syntax errors
  const calculatePower = (standardizedEffect: number, alpha: number): number => {
    const zAlpha = getZScore(1 - alpha / 2)
    const zBeta = standardizedEffect - zAlpha
    return normalCDF(zBeta)
  }

  const getZScore = (probability: number): number => {
    // Common values for better accuracy
    if (probability <= 0 || probability >= 1) return 0
    if (Math.abs(probability - 0.975) < 0.0001) return 1.96
    if (Math.abs(probability - 0.95) < 0.0001) return 1.645
    if (Math.abs(probability - 0.99) < 0.0001) return 2.326
    if (Math.abs(probability - 0.995) < 0.0001) return 2.576
    if (Math.abs(probability - 0.8) < 0.0001) return 0.84
    if (Math.abs(probability - 0.9) < 0.0001) return 1.28

    // Approximation for other values
    let x = probability
    if (x < 0.5) x = 1 - x

    const t = Math.sqrt(-2 * Math.log(1 - x))
    const c0 = 2.515517
    const c1 = 0.802853
    const c2 = 0.010328
    const d1 = 1.432788
    const d2 = 0.189269
    const d3 = 0.001308

    let z = t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t)
    if (probability < 0.5) z = -z

    return z
  }

  const normalCDF = (x: number): number => {
    // Approximation of the normal CDF
    if (x < -8) return 0
    if (x > 8) return 1

    let sum = 0
    let term = x
    let i = 3

    while (sum + term !== sum) {
      sum += term
      term = (term * x * x) / i
      i += 2
    }

    return 0.5 + (sum * Math.exp((-x * x) / 2)) / Math.sqrt(2 * Math.PI)
  }

  const formatNumber = (num: number | null) => {
    if (num === null || isNaN(num)) return "-"
    return new Intl.NumberFormat().format(Math.round(num))
  }

  const formatDecimal = (num: number | null) => {
    if (num === null || isNaN(num)) return "-"
    return num.toFixed(1)
  }

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      setter(numValue)
    }
  }

  const handleConfidenceLevelChange = (value: string) => {
    const newConfidenceLevel = Number(value)
    if (!isNaN(newConfidenceLevel)) {
      setConfidenceLevel(newConfidenceLevel)
      const alpha = (100 - newConfidenceLevel) / 100
      setFalsePositiveRisk(alpha * 100)
    }
  }

  const handleParallelChange = (value: number[]) => {
    setParallelPercentage(value[0])
  }

  const CustomRechartsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-lg text-sm">
          <p className="font-medium mb-1">MDE: {label}%</p>
          <p className="text-muted-foreground">False Negative Risk: {payload[0].value.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  const keyMetrics = [
    {
      title: "Sequential A/B Tests Per Year",
      value: formatNumber(maxExperiments),
      description: "Tests run one after another",
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
    },
    {
      title: "A/B Tests With Parallelization",
      value: formatNumber(maxParallelExperiments),
      description: `With ${parallelPercentage}% parallel tests`,
      icon: <BarChart3 className="w-5 h-5 text-primary" />,
    },
  ]

  const supportingMetrics = [
    { title: "Sample Size Required", value: formatNumber(sampleSize), description: "Total visitors needed per test" },
    { title: "Annual Traffic", value: formatNumber(annualVisitors), description: "Total visitors per year" },
    {
      title: "False Positive Risk",
      value: `${formatDecimal(falsePositiveRisk)}%`,
      description: "Risk of detecting an effect that doesn't exist",
    },
    {
      title: "False Negative Risk",
      value: `${formatDecimal(falseNegativeRisk)}%`,
      description: `Risk of missing a real effect of MDE ${mde}%`,
    },
    {
      title: "Expected False Positives",
      value: formatDecimal(annualFalsePositives),
      description: "Expected false positives per year",
    },
  ]

  const definitions = [
    {
      term: "Minimum Detectable Effect (MDE)",
      definition:
        "The smallest relative change in conversion rate that you want to be able to detect with confidence. A smaller MDE requires larger sample sizes.",
    },
    {
      term: "Statistical Power",
      definition:
        "The probability that your test will correctly identify a real effect when one exists. Higher power means lower risk of missing true effects (false negatives).",
    },
    {
      term: "Confidence Level",
      definition:
        "The probability that your test results are not due to random chance. A 95% confidence level means there's only a 5% chance of false positives.",
    },
    {
      term: "Sample Size",
      definition:
        "The total number of visitors needed for each A/B test to achieve your desired statistical power and confidence level.",
    },
    {
      term: "False Positive Risk (Type I Error)",
      definition:
        "The probability of concluding there's a significant effect when there actually isn't one. This is determined by your confidence level (1 - Confidence Level).",
    },
    {
      term: "False Negative Risk (Type II Error)",
      definition: "The probability of missing a real effect. This is determined by Statistical Power (1 - Power).",
    },
    {
      term: "Parallel Testing",
      definition:
        "Running multiple A/B tests simultaneously on different parts of your site or different user segments to increase testing velocity without interference.",
    },
    {
      term: "Annual Testing Capacity",
      definition:
        "The maximum number of A/B tests you can run in a year based on your traffic volume and required sample sizes.",
    },
  ]

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Input Parameters</CardTitle>
          <CardDescription>Adjust these values to match your specific context.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="daily-visitors" className="mb-2 flex items-center">
                Daily Traffic (visitors)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground ml-1.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The average number of daily visitors to your website or app.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="daily-visitors"
                type="number"
                value={dailyVisitors}
                onChange={(e) => handleInputChange(setDailyVisitors, e.target.value)}
                placeholder="e.g., 10000"
              />
            </div>
            <div>
              <Label htmlFor="conversion-rate" className="mb-2 flex items-center">
                Baseline Conversion Rate (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground ml-1.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current conversion rate for the metric you're testing.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="conversion-rate"
                type="number"
                value={conversionRate}
                onChange={(e) => handleInputChange(setConversionRate, e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <Label htmlFor="mde" className="mb-2 flex items-center">
                Minimum Detectable Effect (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground ml-1.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The smallest relative improvement you want to reliably detect.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="mde"
                type="number"
                value={mde}
                onChange={(e) => handleInputChange(setMde, e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <Label htmlFor="confidence-level" className="mb-2 flex items-center">
                Confidence Level (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground ml-1.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Desired probability of avoiding a false positive (Type I error). Common is 95%.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="confidence-level"
                type="number"
                value={confidenceLevel}
                onChange={(e) => handleConfidenceLevelChange(e.target.value)}
                placeholder="e.g., 95"
              />
            </div>
            <div>
              <Label htmlFor="target-power" className="mb-2 flex items-center">
                Statistical Power (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground ml-1.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Desired probability of detecting a true effect (avoiding false negative). Common is 80%.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="target-power"
                type="number"
                value={targetPower}
                onChange={(e) => handleInputChange(setTargetPower, e.target.value)}
                placeholder="e.g., 80"
              />
            </div>
            <div>
              <Label htmlFor="parallel-percentage" className="mb-2 flex items-center">
                Parallel Testing Uplift (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground ml-1.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Estimated percentage increase in test capacity due to running some tests in parallel.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center space-x-3 mt-2">
                <Slider
                  value={[parallelPercentage]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={handleParallelChange}
                  className="flex-grow"
                />
                <span className="w-12 text-right text-sm tabular-nums">{parallelPercentage}%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={calculateMaxExperiments} size="lg">
              Calculate Capacity
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Recalculate after changing input values to see updated results.
          </p>
        </CardContent>
      </Card>

      {maxExperiments !== null && (
        <>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Experimentation Capacity Results</CardTitle>
              <CardDescription>Based on your inputs, here's your estimated A/B testing capacity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {keyMetrics.map((metric) => (
                  <Card key={metric.title} className="bg-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                      {metric.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{metric.value}</div>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportingMetrics.map((metric) => (
                  <div key={metric.title} className="p-4 border rounded-lg bg-background">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">{metric.title}</h4>
                    <p className="text-xl font-semibold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">MDE vs. False Negative Risk</CardTitle>
              <CardDescription>
                This chart shows how the Minimum Detectable Effect (MDE) impacts the False Negative Risk (chance of
                missing a real effect) for your current sample size.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mdeChartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                    <XAxis
                      dataKey="mde"
                      unit="%"
                      name="MDE"
                      label={{
                        value: "Minimum Detectable Effect (%)",
                        position: "insideBottom",
                        offset: -15,
                        fontSize: 12,
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      unit="%"
                      name="Risk"
                      label={{
                        value: "False Negative Risk (%)",
                        angle: -90,
                        position: "insideLeft",
                        offset: 10,
                        fontSize: 12,
                      }}
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <RechartsTooltip content={<CustomRechartsTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="falseNegativeRisk"
                      strokeWidth={2}
                      stroke="#16a34a"
                      activeDot={{ r: 6, strokeWidth: 2, fill: "#16a34a" }}
                      name="False Negative Risk"
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <ListChecks className="w-5 h-5 mr-2 text-primary" /> How to Use This Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2.5 text-sm text-muted-foreground">
              <li>Enter your average daily traffic and baseline conversion rate.</li>
              <li>Set your desired Minimum Detectable Effect (MDE) - the smallest change you aim to detect.</li>
              <li>Configure your statistical confidence level (e.g., 95%) and power (e.g., 80%).</li>
              <li>Estimate any uplift from running tests in parallel using the slider.</li>
              <li>Click "Calculate Capacity" to view your annual testing potential and related metrics.</li>
              <li>Analyze the "MDE vs. False Negative Risk" chart to understand detection trade-offs.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary" /> Key Terms & Definitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {definitions.map((item) => (
                <AccordionItem value={item.term} key={item.term}>
                  <AccordionTrigger className="text-sm text-left hover:no-underline py-3">{item.term}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-3">{item.definition}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
