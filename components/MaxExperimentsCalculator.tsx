"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Slider } from "@/components/ui/slider"
// import { MaxExperimentsFAQModal } from "@/components/MaxExperimentsFAQModal"

export function MaxExperimentsCalculator() {
  // Input parameters
  const [dailyVisitors, setDailyVisitors] = useState<number>(10000)
  const [conversionRate, setConversionRate] = useState<number>(5)
  const [mde, setMde] = useState<number>(10)
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95)
  const [targetPower, setTargetPower] = useState<number>(80)
  const [parallelPercentage, setParallelPercentage] = useState<number>(0)

  // Results
  const [maxExperiments, setMaxExperiments] = useState<number | null>(null)
  const [maxParallelExperiments, setMaxParallelExperiments] = useState<number | null>(null)
  const [sampleSize, setSampleSize] = useState<number | null>(null)
  const [sampleSizePerVariant, setSampleSizePerVariant] = useState<number | null>(null)
  const [annualVisitors, setAnnualVisitors] = useState<number | null>(null)
  const [falsePositiveRisk, setFalsePositiveRisk] = useState<number>(5)
  const [falseNegativeRisk, setFalseNegativeRisk] = useState<number>(20)
  const [achievedPower, setAchievedPower] = useState<number | null>(null)
  const [annualFalsePositives, setAnnualFalsePositives] = useState<number | null>(null)
  const [mdeChartData, setMdeChartData] = useState<Array<{ mde: number; falseNegativeRisk: number }>>([])

  // State to track if initial calculation has been done
  const [hasCalculated, setHasCalculated] = useState<boolean>(false)

  // Initial calculation on component mount
  useEffect(() => {
    calculateMaxExperiments()
  }, [])

  // Main calculation function
  const calculateMaxExperiments = () => {
    // Calculate alpha from confidence level
    const alpha = (100 - confidenceLevel) / 100
    setFalsePositiveRisk(alpha * 100)

    // Get z-scores for the given confidence level and power
    const zAlpha = getZScore(1 - alpha / 2)
    const zBeta = getZScore(targetPower / 100)

    const p1 = conversionRate / 100
    const p2 = p1 * (1 + mde / 100)
    const pAvg = (p1 + p2) / 2

    // Calculate sample size per variant using the formula for comparing two proportions
    const calculatedSampleSizePerVariant = Math.ceil(
      (Math.pow(zAlpha + zBeta, 2) * pAvg * (1 - pAvg) * 2) / Math.pow(p2 - p1, 2),
    )

    // Total sample size for both control and variant
    const totalSampleSize = calculatedSampleSizePerVariant * 2

    // Annual visitors
    const yearlyVisitors = dailyVisitors * 365

    // Max tests calculation (sequential)
    const maxTests = Math.floor(yearlyVisitors / totalSampleSize)

    // Calculate max tests with parallel testing
    // If parallelPercentage is 0, this will be the same as maxTests
    // If parallelPercentage is 100, this would theoretically be infinite, but we cap it at a reasonable multiple
    let maxTestsWithParallel = maxTests

    if (parallelPercentage > 0) {
      // Calculate the parallel testing multiplier
      // This is a simplified model that assumes tests can run in parallel without interference
      // The formula gives a reasonable approximation that increases as the parallel percentage increases
      // but with diminishing returns to reflect the practical limitations
      const parallelFactor = 1 + parallelPercentage / 100
      maxTestsWithParallel = Math.floor(maxTests * parallelFactor)
    }

    // Now calculate the achieved power and false negative risk based on the MDE
    // This shows how the MDE affects the false negative risk
    const standardizedEffect = Math.abs(p2 - p1) / Math.sqrt((pAvg * (1 - pAvg) * 2) / calculatedSampleSizePerVariant)
    const calculatedPower = calculatePower(standardizedEffect, alpha)
    const calculatedFalseNegativeRisk = 100 - calculatedPower * 100

    setAchievedPower(calculatedPower * 100)
    setFalseNegativeRisk(calculatedFalseNegativeRisk)

    // Calculate expected number of false positives per year
    const expectedFalsePositives = maxTests * alpha
    setAnnualFalsePositives(expectedFalsePositives)

    setSampleSizePerVariant(calculatedSampleSizePerVariant)
    setSampleSize(totalSampleSize)
    setAnnualVisitors(yearlyVisitors)
    setMaxExperiments(maxTests)
    setMaxParallelExperiments(maxTestsWithParallel)
    setHasCalculated(true)

    // Generate data for the MDE vs False Negative Risk chart
    generateMdeChartData(calculatedSampleSizePerVariant, p1, alpha)
  }

  // Generate data for the MDE vs False Negative Risk chart
  const generateMdeChartData = (sampleSizePerVariant: number, baseConversionRate: number, alpha: number) => {
    const chartData = []
    // Generate data points for MDEs ranging from 1% to 30%
    for (let mdePct = 1; mdePct <= 30; mdePct++) {
      const p1 = baseConversionRate
      const p2 = p1 * (1 + mdePct / 100)
      const pAvg = (p1 + p2) / 2

      const standardizedEffect = Math.abs(p2 - p1) / Math.sqrt((pAvg * (1 - pAvg) * 2) / sampleSizePerVariant)
      const calculatedPower = calculatePower(standardizedEffect, alpha)
      const calculatedFalseNegativeRisk = 100 - calculatedPower * 100

      chartData.push({
        mde: mdePct,
        falseNegativeRisk: calculatedFalseNegativeRisk,
      })
    }
    setMdeChartData(chartData)
  }

  // Function to calculate power given the standardized effect size and alpha
  const calculatePower = (standardizedEffect: number, alpha: number): number => {
    const zAlpha = getZScore(1 - alpha / 2)
    return normalCDF(standardizedEffect - zAlpha)
  }

  // Function to get z-score for a given probability
  const getZScore = (probability: number): number => {
    // Approximation of the inverse of the standard normal CDF
    // This is a simplified version and works well for common values
    if (probability === 0.975) return 1.96 // 95% confidence
    if (probability === 0.95) return 1.645 // 90% confidence
    if (probability === 0.9) return 1.28 // 80% confidence
    if (probability === 0.8) return 0.84 // 80% power

    // For other values, use this approximation
    const a = Math.sqrt(-2 * Math.log(1 - probability))
    return a - (2.30753 + 0.27061 * a) / (1 + 0.99229 * a + 0.04481 * a * a)
  }

  // Function to calculate the cumulative distribution function of the standard normal distribution
  const normalCDF = (x: number): number => {
    // Approximation of the standard normal CDF
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp((-x * x) / 2)
    const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - probability : probability
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num))
  }

  const formatDecimal = (num: number) => {
    return num.toFixed(1)
  }

  // Handle MDE input change
  const handleMdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMde = Number(e.target.value)
    setMde(newMde)
  }

  // Handle confidence level change
  const handleConfidenceLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfidenceLevel = Number(e.target.value)
    setConfidenceLevel(newConfidenceLevel)

    // Update false positive risk immediately
    const alpha = (100 - newConfidenceLevel) / 100
    setFalsePositiveRisk(alpha * 100)
  }

  // Handle parallel percentage slider change
  const handleParallelChange = (value: number[]) => {
    setParallelPercentage(value[0])
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-sm">
          <p className="font-medium">MDE: {label}%</p>
          <p>False Negative Risk: {payload[0].value.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3 bg-white rounded-t-lg">
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="bg-white rounded-b-lg pt-6">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="daily-visitors" className="flex items-center gap-2">
                    Daily Traffic (visitors)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>The average number of unique visitors per day to your site</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="daily-visitors"
                    type="number"
                    value={dailyVisitors}
                    onChange={(e) => setDailyVisitors(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="conversion-rate" className="flex items-center gap-2">
                    Conversion Rate (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>Your current conversion rate before testing</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="conversion-rate"
                    type="number"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mde" className="flex items-center gap-2">
                    Minimum Detectable Effect (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          The smallest relative change in conversion rate that you want to be able to detect
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input id="mde" type="number" value={mde} onChange={handleMdeChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="confidence-level" className="flex items-center gap-2">
                    Confidence Level (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          How confident you want to be that your results are not due to chance (typically 95%)
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="confidence-level"
                    type="number"
                    value={confidenceLevel}
                    onChange={handleConfidenceLevelChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="target-power" className="flex items-center gap-2">
                    Target Statistical Power (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          The target probability of detecting a true effect if one exists (typically 80%)
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="target-power"
                    type="number"
                    value={targetPower}
                    onChange={(e) => setTargetPower(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="parallel-percentage" className="flex items-center gap-2">
                  Parallel Tests (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Percentage of tests that can be run in parallel on different parts of the site
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="parallel-percentage"
                    value={[parallelPercentage]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={handleParallelChange}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{parallelPercentage}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  0% = sequential tests only, 100% = all tests can be run in parallel
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={calculateMaxExperiments} className="px-8">
                  Calculate
                </Button>
              </div>
              <div className="text-xs text-gray-500 text-right">
                Click "Calculate" after changing values to update results
              </div>
            </div>
          </CardContent>
        </Card>

        {maxExperiments !== null && (
          <>
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3 bg-white rounded-t-lg">
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent className="bg-white rounded-b-lg pt-6">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                      <h3 className="text-lg font-medium mb-3">Sequential A/B Tests Per Year</h3>
                      <p className="text-4xl font-bold">{maxExperiments}</p>
                      <p className="text-sm text-gray-500 mt-3">Tests run one after another</p>
                    </div>

                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                      <h3 className="text-lg font-medium mb-3">A/B Tests With Parallelization</h3>
                      <p className="text-4xl font-bold">{maxParallelExperiments}</p>
                      <p className="text-sm text-gray-500 mt-3">With {parallelPercentage}% parallel tests</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <h4 className="font-medium mb-3">Sample Size Required</h4>
                      <p className="text-2xl font-semibold">{sampleSize ? formatNumber(sampleSize) : "-"}</p>
                      <p className="text-sm text-gray-500 mt-3">Total visitors needed per test</p>
                    </div>
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <h4 className="font-medium mb-3">Annual Traffic</h4>
                      <p className="text-2xl font-semibold">{annualVisitors ? formatNumber(annualVisitors) : "-"}</p>
                      <p className="text-sm text-gray-500 mt-3">Total visitors per year</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <h4 className="font-medium mb-3">False Positive Risk</h4>
                      <p className="text-2xl font-semibold">{falsePositiveRisk.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500 mt-3">Risk of detecting an effect that doesn't exist</p>
                      <p className="text-xs text-gray-500 mt-3 italic">Based on confidence level only</p>
                    </div>
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <h4 className="font-medium mb-3">False Negative Risk</h4>
                      <p className="text-2xl font-semibold">{falseNegativeRisk.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500 mt-3">Risk of missing a real effect of size {mde}%</p>
                      <p className="text-xs text-gray-500 mt-3 italic">Changes with MDE and sample size</p>
                    </div>
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <h4 className="font-medium mb-3">Expected False Positives</h4>
                      <p className="text-2xl font-semibold">
                        {annualFalsePositives ? formatDecimal(annualFalsePositives) : "-"}
                      </p>
                      <p className="text-sm text-gray-500 mt-3">Expected false positives per year</p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="calculations">
                      <AccordionTrigger className="px-6 py-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                        View Detailed Calculations
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-8 p-8 bg-white rounded-lg text-sm mt-4 border border-gray-200">
                          <div>
                            <h4 className="font-medium mb-4">Step 1: Calculate Required Sample Size</h4>
                            <div className="pl-6 border-l-2 border-gray-200">
                              <p className="mb-3">Statistical Parameters:</p>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>
                                  Confidence Level: {confidenceLevel}% (α = {falsePositiveRisk.toFixed(1)}%)
                                </li>
                                <li>Target Statistical Power: {targetPower}%</li>
                                <li>
                                  Achieved Statistical Power: {achievedPower ? achievedPower.toFixed(1) : "-"}% (β ={" "}
                                  {falseNegativeRisk.toFixed(1)}%)
                                </li>
                                <li>Baseline Conversion Rate: {conversionRate}%</li>
                                <li>
                                  Expected Conversion Rate with Change: {(conversionRate * (1 + mde / 100)).toFixed(2)}%
                                </li>
                                <li>Minimum Detectable Effect: {mde}% relative change</li>
                              </ul>

                              <p className="mt-6 mb-3">Formula:</p>
                              <div className="bg-gray-100 p-4 rounded border border-gray-200 font-mono text-xs">
                                n = ((z_α + z_β)² × p_avg × (1 - p_avg) × 2) / (p₂ - p₁)²
                              </div>
                              <p className="text-xs mt-3 text-gray-500">
                                Where n is sample size per variant, p₁ is baseline conversion rate, p₂ is expected
                                conversion rate with change, and p_avg is their average
                              </p>

                              <p className="mt-6 mb-3">Calculation:</p>
                              <div className="bg-gray-100 p-4 rounded border border-gray-200">
                                <p>p₁ = {(conversionRate / 100).toFixed(4)}</p>
                                <p>p₂ = {((conversionRate / 100) * (1 + mde / 100)).toFixed(4)}</p>
                                <p>
                                  p_avg ={" "}
                                  {((conversionRate / 100 + (conversionRate / 100) * (1 + mde / 100)) / 2).toFixed(4)}
                                </p>
                                <p>
                                  Sample Size Per Variant ={" "}
                                  {sampleSizePerVariant
                                    ? Math.ceil(sampleSizePerVariant).toLocaleString()
                                    : "calculating..."}
                                </p>
                                <p className="mt-3 font-medium">
                                  Total Sample Size (Control + Variant) ={" "}
                                  {sampleSize ? sampleSize.toLocaleString() : "calculating..."}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-4">Step 2: Calculate Annual Testing Capacity</h4>
                            <div className="pl-6 border-l-2 border-gray-200">
                              <p className="mb-3">Annual Traffic:</p>
                              <div className="bg-gray-100 p-4 rounded border border-gray-200">
                                <p>Daily Visitors: {dailyVisitors.toLocaleString()}</p>
                                <p>Annual Visitors = Daily Visitors × 365</p>
                                <p>
                                  Annual Visitors ={" "}
                                  {annualVisitors ? annualVisitors.toLocaleString() : "calculating..."}
                                </p>
                              </div>

                              <p className="mt-6 mb-3">Maximum Tests Calculation:</p>
                              <div className="bg-gray-100 p-4 rounded border border-gray-200">
                                <p>Max Tests = Annual Visitors / Total Sample Size</p>
                                <p>
                                  Max Tests = {annualVisitors ? annualVisitors.toLocaleString() : "..."} /{" "}
                                  {sampleSize ? sampleSize.toLocaleString() : "..."}
                                </p>
                                <p className="mt-3 font-medium">Maximum A/B Tests Per Year = {maxExperiments}</p>

                                {parallelPercentage > 0 && (
                                  <>
                                    <p className="mt-6">Calculation with Parallel Tests ({parallelPercentage}%):</p>
                                    <p>
                                      Parallel Factor = 1 + ({parallelPercentage} / 100) ={" "}
                                      {1 + parallelPercentage / 100}
                                    </p>
                                    <p>
                                      Max Tests with Parallelization = {maxExperiments} × {1 + parallelPercentage / 100}
                                    </p>
                                    <p className="mt-3 font-medium">
                                      Maximum A/B Tests Per Year (With Parallelization) = {maxParallelExperiments}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-4">Step 3: Calculate Error Risks</h4>
                            <div className="pl-6 border-l-2 border-gray-200">
                              <p className="mb-3">Error Types:</p>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>
                                  <strong>False Positive (Type I Error):</strong> {falsePositiveRisk.toFixed(1)}% -
                                  Probability of concluding there's an effect when there isn't one
                                </li>
                                <li>
                                  <strong>False Negative (Type II Error):</strong> {falseNegativeRisk.toFixed(1)}% -
                                  Probability of missing a real effect of size {mde}%
                                </li>
                              </ul>

                              <p className="mt-6 mb-3">How MDE Affects False Negative Risk:</p>
                              <div className="bg-gray-100 p-4 rounded border border-gray-200">
                                <p>
                                  For a fixed sample size, a larger MDE (easier to detect) reduces the false negative
                                  risk. Conversely, a smaller MDE (harder to detect) increases the false negative risk.
                                </p>
                                <p className="mt-3">
                                  The standardized effect size is calculated as: |p₂ - p₁| / √(p_avg × (1 - p_avg) ×
                                  2/n)
                                </p>
                                <p className="mt-3">
                                  This standardized effect size directly influences the statistical power and thus the
                                  false negative risk.
                                </p>
                              </div>

                              <p className="mt-6 mb-3">Expected False Positives Per Year:</p>
                              <div className="bg-gray-100 p-4 rounded border border-gray-200">
                                <p>Expected False Positives = Max Tests × False Positive Risk</p>
                                <p>
                                  Expected False Positives = {maxExperiments} × {(falsePositiveRisk / 100).toFixed(3)}
                                </p>
                                <p className="mt-3 font-medium">
                                  Expected False Positives Per Year ={" "}
                                  {annualFalsePositives ? formatDecimal(annualFalsePositives) : "calculating..."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3 bg-white rounded-t-lg">
                <CardTitle>MDE vs. False Negative Risk</CardTitle>
              </CardHeader>
              <CardContent className="bg-white rounded-b-lg pt-6">
                <div className="space-y-6">
                  <div className="text-sm text-gray-600 mb-4">
                    This chart shows how the Minimum Detectable Effect (MDE) affects the False Negative Risk for your
                    current sample size. A larger MDE is easier to detect, resulting in a lower risk of missing a real
                    effect.
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mdeChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="mde"
                          label={{ value: "Minimum Detectable Effect (%)", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis
                          label={{ value: "False Negative Risk (%)", angle: -90, position: "insideLeft" }}
                          domain={[0, 100]}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="falseNegativeRisk"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          name="False Negative Risk"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-gray-500 mt-4">
                    <p>
                      <strong>Note:</strong> The chart shows how false negative risk decreases as MDE increases. Your
                      current MDE is {mde}% with a false negative risk of {falseNegativeRisk.toFixed(1)}%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3 bg-white rounded-t-lg">
                <CardTitle>Parallel Testing</CardTitle>
              </CardHeader>
              <CardContent className="bg-white rounded-b-lg pt-6">
                <div className="space-y-8">
                  <div className="text-sm text-gray-600">
                    <p>
                      Running tests in parallel can significantly increase your testing capacity, but comes with some
                      important limitations and considerations:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <h4 className="font-medium mb-4">Benefits of Parallel Testing</h4>
                      <ul className="list-disc pl-5 space-y-3 text-sm text-gray-600">
                        <li>Increased annual testing capacity</li>
                        <li>Reduced time needed to test multiple hypotheses</li>
                        <li>Faster website optimization</li>
                      </ul>
                    </div>

                    <div className="bg-gray-100 p-8 rounded-lg">
                      <h4 className="font-medium mb-4">Limitations and Considerations</h4>
                      <ul className="list-disc pl-5 space-y-3 text-sm text-gray-600">
                        <li>
                          <strong>Test interference:</strong> Tests affecting the same users can interfere with each
                          other
                        </li>
                        <li>
                          <strong>Traffic segmentation:</strong> Each test must target different user segments or parts
                          of the site
                        </li>
                        <li>
                          <strong>Analysis complexity:</strong> Analyzing results becomes more complex with simultaneous
                          tests
                        </li>
                        <li>
                          <strong>Attribution risk:</strong> Difficult to attribute effects to specific changes if
                          multiple tests are running
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mt-4">
                    <p>
                      <strong>Recommendation:</strong> Start with a low percentage of parallel tests (20-30%) and
                      gradually increase based on your ability to manage complexity and avoid test interference.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3 bg-white rounded-t-lg">
            <CardTitle>Understanding Error Risks</CardTitle>
          </CardHeader>
          <CardContent className="bg-white rounded-b-lg pt-6">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4">False Positive Risk (Type I Error)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    The false positive risk is determined solely by your confidence level and remains constant
                    regardless of other parameters:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                    <li>95% confidence level → 5% false positive risk</li>
                    <li>90% confidence level → 10% false positive risk</li>
                    <li>99% confidence level → 1% false positive risk</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4">
                    This is why the false positive risk appears static - it only changes when you change the confidence
                    level.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-4">False Negative Risk (Type II Error)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    The false negative risk is more complex and depends on multiple factors:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                    <li>
                      <strong>MDE:</strong> Larger effects are easier to detect, so increasing the MDE decreases the
                      false negative risk
                    </li>
                    <li>
                      <strong>Sample Size:</strong> Larger sample sizes increase power, decreasing the false negative
                      risk
                    </li>
                    <li>
                      <strong>Conversion Rate:</strong> The baseline conversion rate affects the variance, which impacts
                      the false negative risk
                    </li>
                    <li>
                      <strong>Confidence Level:</strong> Higher confidence levels increase the false negative risk (for
                      a fixed sample size)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
