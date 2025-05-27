"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { InfoIcon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"

export function MaxExperimentsCalculator() {
  // All the existing state and logic remains the same...
  const [dailyVisitors, setDailyVisitors] = useState<number>(10000)
  const [conversionRate, setConversionRate] = useState<number>(5)
  const [mde, setMde] = useState<number>(10)
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95)
  const [targetPower, setTargetPower] = useState<number>(80)
  const [parallelPercentage, setParallelPercentage] = useState<number>(0)

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

  useEffect(() => {
    calculateMaxExperiments()
  }, [])

  // All calculation functions remain the same...
  const calculateMaxExperiments = () => {
    const alpha = (100 - confidenceLevel) / 100
    setFalsePositiveRisk(alpha * 100)

    const zAlpha = getZScore(1 - alpha / 2)
    const zBeta = getZScore(targetPower / 100)

    const p1 = conversionRate / 100
    const p2 = p1 * (1 + mde / 100)
    const pAvg = (p1 + p2) / 2

    const calculatedSampleSizePerVariant = Math.ceil(
      (Math.pow(zAlpha + zBeta, 2) * pAvg * (1 - pAvg) * 2) / Math.pow(p2 - p1, 2),
    )

    const totalSampleSize = calculatedSampleSizePerVariant * 2
    const yearlyVisitors = dailyVisitors * 365
    const maxTests = Math.floor(yearlyVisitors / totalSampleSize)

    let maxTestsWithParallel = maxTests
    if (parallelPercentage > 0) {
      const parallelFactor = 1 + parallelPercentage / 100
      maxTestsWithParallel = Math.floor(maxTests * parallelFactor)
    }

    const standardizedEffect = Math.abs(p2 - p1) / Math.sqrt((pAvg * (1 - pAvg) * 2) / calculatedSampleSizePerVariant)
    const calculatedPower = calculatePower(standardizedEffect, alpha)
    const calculatedFalseNegativeRisk = 100 - calculatedPower * 100

    setAchievedPower(calculatedPower * 100)
    setFalseNegativeRisk(calculatedFalseNegativeRisk)

    const expectedFalsePositives = maxTests * alpha
    setAnnualFalsePositives(expectedFalsePositives)

    setSampleSizePerVariant(calculatedSampleSizePerVariant)
    setSampleSize(totalSampleSize)
    setAnnualVisitors(yearlyVisitors)
    setMaxExperiments(maxTests)
    setMaxParallelExperiments(maxTestsWithParallel)

    generateMdeChartData(calculatedSampleSizePerVariant, p1, alpha)
  }

  const generateMdeChartData = (sampleSizePerVariant: number, baseConversionRate: number, alpha: number) => {
    const chartData = []
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

  const calculatePower = (standardizedEffect: number, alpha: number): number => {
    const zAlpha = getZScore(1 - alpha / 2)
    return normalCDF(standardizedEffect - zAlpha)
  }

  const getZScore = (probability: number): number => {
    if (probability === 0.975) return 1.96
    if (probability === 0.95) return 1.645
    if (probability === 0.9) return 1.28
    if (probability === 0.8) return 0.84

    const a = Math.sqrt(-2 * Math.log(1 - probability))
    return a - (2.30753 + 0.27061 * a) / (1 + 0.99229 * a + 0.04481 * a * a)
  }

  const normalCDF = (x: number): number => {
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

  const handleMdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMde(Number(e.target.value))
  }

  const handleConfidenceLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfidenceLevel = Number(e.target.value)
    setConfidenceLevel(newConfidenceLevel)
    const alpha = (100 - newConfidenceLevel) / 100
    setFalsePositiveRisk(alpha * 100)
  }

  const handleParallelChange = (value: number[]) => {
    setParallelPercentage(value[0])
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            fontSize: "14px",
          }}
        >
          <p style={{ fontWeight: "500", margin: 0 }}>MDE: {label}%</p>
          <p style={{ margin: 0 }}>False Negative Risk: {payload[0].value.toFixed(1)}%</p>
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="daily-visitors">
                    <div className="flex items-center space-x-2">
                      <span>Daily Traffic (visitors)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>The number of daily visitors to your website or app.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </Label>
                  <Input
                    id="daily-visitors"
                    type="number"
                    value={dailyVisitors}
                    onChange={(e) => setDailyVisitors(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="conversion-rate">
                    <div className="flex items-center space-x-2">
                      <span>Conversion Rate (%)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            The percentage of visitors who complete a desired action (e.g., purchase, sign-up).
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </Label>
                  <Input
                    id="conversion-rate"
                    type="number"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="mde">
                    <div className="flex items-center space-x-2">
                      <span>Minimum Detectable Effect (%)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            The smallest effect size that you want to be able to reliably detect.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </Label>
                  <Input id="mde" type="number" value={mde} onChange={handleMdeChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="confidence-level">
                    <div className="flex items-center space-x-2">
                      <span>Confidence Level (%)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            The probability that your test will correctly identify a real effect.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </Label>
                  <Input
                    id="confidence-level"
                    type="number"
                    value={confidenceLevel}
                    onChange={handleConfidenceLevelChange}
                  />
                </div>

                <div>
                  <Label htmlFor="target-power">
                    <div className="flex items-center space-x-2">
                      <span>Target Statistical Power (%)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            The probability that your test will correctly identify a real effect.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </Label>
                  <Input
                    id="target-power"
                    type="number"
                    value={targetPower}
                    onChange={(e) => setTargetPower(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="parallel-percentage">
                  <div className="flex items-center space-x-2">
                    <span>Parallel Tests (%)</span>
                    <InfoIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                  </div>
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[parallelPercentage]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={handleParallelChange}
                  />
                  <span className="w-12 text-right">{parallelPercentage}%</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  0% = sequential tests only, 100% = all tests can be run in parallel
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={calculateMaxExperiments}>Calculate</Button>
              </div>
              <div className="text-right text-sm text-gray-500">
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                      <h3 className="text-lg font-semibold mb-4">Sequential A/B Tests Per Year</h3>
                      <p className="text-4xl font-bold text-gray-800">{maxExperiments}</p>
                      <p className="text-sm text-gray-500 mt-2">Tests run one after another</p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                      <h3 className="text-lg font-semibold mb-4">A/B Tests With Parallelization</h3>
                      <p className="text-4xl font-bold text-gray-800">{maxParallelExperiments}</p>
                      <p className="text-sm text-gray-500 mt-2">With {parallelPercentage}% parallel tests</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-md font-semibold mb-2">Sample Size Required</h4>
                      <p className="text-2xl font-bold text-gray-800">{sampleSize ? formatNumber(sampleSize) : "-"}</p>
                      <p className="text-sm text-gray-500 mt-2">Total visitors needed per test</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-md font-semibold mb-2">Annual Traffic</h4>
                      <p className="text-2xl font-bold text-gray-800">
                        {annualVisitors ? formatNumber(annualVisitors) : "-"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">Total visitors per year</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-md font-semibold mb-2">False Positive Risk</h4>
                      <p className="text-2xl font-bold text-gray-800">{falsePositiveRisk.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500 mt-2">Risk of detecting an effect that doesn't exist</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-md font-semibold mb-2">False Negative Risk</h4>
                      <p className="text-2xl font-bold text-gray-800">{falseNegativeRisk.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500 mt-2">Risk of missing a real effect of size {mde}%</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-md font-semibold mb-2">Expected False Positives</h4>
                      <p className="text-2xl font-bold text-gray-800">
                        {annualFalsePositives ? formatDecimal(annualFalsePositives) : "-"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">Expected false positives per year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3 bg-white rounded-t-lg">
                <CardTitle>MDE vs. False Negative Risk</CardTitle>
              </CardHeader>
              <CardContent className="bg-white rounded-b-lg pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-gray-700">
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
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
