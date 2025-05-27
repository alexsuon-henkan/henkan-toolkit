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
    let maxTestsWithParallel = maxTests

    if (parallelPercentage > 0) {
      const parallelFactor = 1 + parallelPercentage / 100
      maxTestsWithParallel = Math.floor(maxTests * parallelFactor)
    }

    // Calculate the achieved power and false negative risk based on the MDE
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
    if (probability === 0.975) return 1.96
    if (probability === 0.95) return 1.645
    if (probability === 0.9) return 1.28
    if (probability === 0.8) return 0.84

    const a = Math.sqrt(-2 * Math.log(1 - probability))
    return a - (2.30753 + 0.27061 * a) / (1 + 0.99229 * a + 0.04481 * a * a)
  }

  // Function to calculate the cumulative distribution function of the standard normal distribution
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

  // Handle MDE input change
  const handleMdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMde = Number(e.target.value)
    setMde(newMde)
  }

  // Handle confidence level change
  const handleConfidenceLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfidenceLevel = Number(e.target.value)
    setConfidenceLevel(newConfidenceLevel)

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
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
        <Card style={{ border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
          <CardHeader
            style={{
              paddingBottom: "12px",
              backgroundColor: "white",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent
            style={{
              backgroundColor: "white",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Label htmlFor="daily-visitors" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Daily Traffic (visitors)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Label htmlFor="conversion-rate" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Conversion Rate (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Label htmlFor="mde" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Minimum Detectable Effect (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Label htmlFor="confidence-level" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Confidence Level (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Label htmlFor="target-power" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Target Statistical Power (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Label htmlFor="parallel-percentage" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Parallel Tests (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
                      </TooltipTrigger>
                      <TooltipContent>
                        Percentage of tests that can be run in parallel on different parts of the site
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <Slider
                    id="parallel-percentage"
                    value={[parallelPercentage]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={handleParallelChange}
                    style={{ flex: 1 }}
                  />
                  <span style={{ width: "48px", textAlign: "right" }}>{parallelPercentage}%</span>
                </div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px", margin: 0 }}>
                  0% = sequential tests only, 100% = all tests can be run in parallel
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={calculateMaxExperiments} style={{ paddingLeft: "32px", paddingRight: "32px" }}>
                  Calculate
                </Button>
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "right" }}>
                Click "Calculate" after changing values to update results
              </div>
            </div>
          </CardContent>
        </Card>

        {maxExperiments !== null && (
          <>
            <Card style={{ border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <CardHeader
                style={{
                  paddingBottom: "12px",
                  backgroundColor: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent
                style={{
                  backgroundColor: "white",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  paddingTop: "24px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "32px",
                    }}
                  >
                    <div
                      style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px", textAlign: "center" }}
                    >
                      <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px", margin: 0 }}>
                        Sequential A/B Tests Per Year
                      </h3>
                      <p style={{ fontSize: "36px", fontWeight: "bold", margin: "12px 0" }}>{maxExperiments}</p>
                      <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "12px", margin: 0 }}>
                        Tests run one after another
                      </p>
                    </div>

                    <div
                      style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px", textAlign: "center" }}
                    >
                      <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px", margin: 0 }}>
                        A/B Tests With Parallelization
                      </h3>
                      <p style={{ fontSize: "36px", fontWeight: "bold", margin: "12px 0" }}>{maxParallelExperiments}</p>
                      <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "12px", margin: 0 }}>
                        With {parallelPercentage}% parallel tests
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "32px",
                    }}
                  >
                    <div style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: 0 }}>Sample Size Required</h4>
                      <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0" }}>
                        {sampleSize ? formatNumber(sampleSize) : "-"}
                      </p>
                      <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "12px", margin: 0 }}>
                        Total visitors needed per test
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: 0 }}>Annual Traffic</h4>
                      <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0" }}>
                        {annualVisitors ? formatNumber(annualVisitors) : "-"}
                      </p>
                      <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "12px", margin: 0 }}>
                        Total visitors per year
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "32px",
                    }}
                  >
                    <div style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: 0 }}>False Positive Risk</h4>
                      <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0" }}>
                        {falsePositiveRisk.toFixed(1)}%
                      </p>
                      <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "12px", margin: 0 }}>
                        Risk of detecting an effect that doesn't exist
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "12px",
                          fontStyle: "italic",
                          margin: 0,
                        }}
                      >
                        Based on confidence level only
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: 0 }}>False Negative Risk</h4>
                      <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0" }}>
                        {falseNegativeRisk.toFixed(1)}%
                      </p>
                      <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "12px", margin: 0 }}>
                        Risk of missing a real effect of size {mde}%
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "12px",
                          fontStyle: "italic",
                          margin: 0,
                        }}
                      >
                        Changes with MDE and sample size
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: 0 }}>Expected False Positives</h4>
                      <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0" }}>
                        {annualFalsePositives ? formatDecimal(annualFalsePositives) : "-"}
                      </p>
                      <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "12px", margin: 0 }}>
                        Expected false positives per year
                      </p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="calculations">
                      <AccordionTrigger style={{ padding: "24px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
                        View Detailed Calculations
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          style={{
                            padding: "32px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            fontSize: "14px",
                            marginTop: "16px",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            flexDirection: "column",
                            gap: "32px",
                          }}
                        >
                          <div>
                            <h4 style={{ fontWeight: "500", marginBottom: "16px", margin: 0 }}>
                              Step 1: Calculate Required Sample Size
                            </h4>
                            <div style={{ paddingLeft: "24px", borderLeft: "2px solid #e5e7eb" }}>
                              <p style={{ marginBottom: "12px", margin: 0 }}>Statistical Parameters:</p>
                              <ul
                                style={{
                                  listStyleType: "disc",
                                  paddingLeft: "20px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                }}
                              >
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

                              <p style={{ marginTop: "24px", marginBottom: "12px", margin: 0 }}>Formula:</p>
                              <div
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  padding: "16px",
                                  borderRadius: "6px",
                                  border: "1px solid #e5e7eb",
                                  fontFamily: "monospace",
                                  fontSize: "12px",
                                }}
                              >
                                n = ((z_α + z_β)² × p_avg × (1 - p_avg) × 2) / (p₂ - p₁)²
                              </div>
                              <p style={{ fontSize: "12px", marginTop: "12px", color: "#6b7280", margin: 0 }}>
                                Where n is sample size per variant, p₁ is baseline conversion rate, p₂ is expected
                                conversion rate with change, and p_avg is their average
                              </p>

                              <p style={{ marginTop: "24px", marginBottom: "12px", margin: 0 }}>Calculation:</p>
                              <div
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  padding: "16px",
                                  borderRadius: "6px",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <p style={{ margin: 0 }}>p₁ = {(conversionRate / 100).toFixed(4)}</p>
                                <p style={{ margin: 0 }}>
                                  p₂ = {((conversionRate / 100) * (1 + mde / 100)).toFixed(4)}
                                </p>
                                <p style={{ margin: 0 }}>
                                  p_avg ={" "}
                                  {((conversionRate / 100 + (conversionRate / 100) * (1 + mde / 100)) / 2).toFixed(4)}
                                </p>
                                <p style={{ margin: 0 }}>
                                  Sample Size Per Variant ={" "}
                                  {sampleSizePerVariant
                                    ? Math.ceil(sampleSizePerVariant).toLocaleString()
                                    : "calculating..."}
                                </p>
                                <p style={{ marginTop: "12px", fontWeight: "500", margin: 0 }}>
                                  Total Sample Size (Control + Variant) ={" "}
                                  {sampleSize ? sampleSize.toLocaleString() : "calculating..."}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 style={{ fontWeight: "500", marginBottom: "16px", margin: 0 }}>
                              Step 2: Calculate Annual Testing Capacity
                            </h4>
                            <div style={{ paddingLeft: "24px", borderLeft: "2px solid #e5e7eb" }}>
                              <p style={{ marginBottom: "12px", margin: 0 }}>Annual Traffic:</p>
                              <div
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  padding: "16px",
                                  borderRadius: "6px",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <p style={{ margin: 0 }}>Daily Visitors: {dailyVisitors.toLocaleString()}</p>
                                <p style={{ margin: 0 }}>Annual Visitors = Daily Visitors × 365</p>
                                <p style={{ margin: 0 }}>
                                  Annual Visitors ={" "}
                                  {annualVisitors ? annualVisitors.toLocaleString() : "calculating..."}
                                </p>
                              </div>

                              <p style={{ marginTop: "24px", marginBottom: "12px", margin: 0 }}>
                                Maximum Tests Calculation:
                              </p>
                              <div
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  padding: "16px",
                                  borderRadius: "6px",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <p style={{ margin: 0 }}>Max Tests = Annual Visitors / Total Sample Size</p>
                                <p style={{ margin: 0 }}>
                                  Max Tests = {annualVisitors ? annualVisitors.toLocaleString() : "..."} /{" "}
                                  {sampleSize ? sampleSize.toLocaleString() : "..."}
                                </p>
                                <p style={{ marginTop: "12px", fontWeight: "500", margin: 0 }}>
                                  Maximum A/B Tests Per Year = {maxExperiments}
                                </p>

                                {parallelPercentage > 0 && (
                                  <>
                                    <p style={{ marginTop: "24px", margin: 0 }}>
                                      Calculation with Parallel Tests ({parallelPercentage}%):
                                    </p>
                                    <p style={{ margin: 0 }}>
                                      Parallel Factor = 1 + ({parallelPercentage} / 100) ={" "}
                                      {1 + parallelPercentage / 100}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                      Max Tests with Parallelization = {maxExperiments} × {1 + parallelPercentage / 100}
                                    </p>
                                    <p style={{ marginTop: "12px", fontWeight: "500", margin: 0 }}>
                                      Maximum A/B Tests Per Year (With Parallelization) = {maxParallelExperiments}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 style={{ fontWeight: "500", marginBottom: "16px", margin: 0 }}>
                              Step 3: Calculate Error Risks
                            </h4>
                            <div style={{ paddingLeft: "24px", borderLeft: "2px solid #e5e7eb" }}>
                              <p style={{ marginBottom: "12px", margin: 0 }}>Error Types:</p>
                              <ul
                                style={{
                                  listStyleType: "disc",
                                  paddingLeft: "20px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                }}
                              >
                                <li>
                                  <strong>False Positive (Type I Error):</strong> {falsePositiveRisk.toFixed(1)}% -
                                  Probability of concluding there's an effect when there isn't one
                                </li>
                                <li>
                                  <strong>False Negative (Type II Error):</strong> {falseNegativeRisk.toFixed(1)}% -
                                  Probability of missing a real effect of size {mde}%
                                </li>
                              </ul>

                              <p style={{ marginTop: "24px", marginBottom: "12px", margin: 0 }}>
                                Expected False Positives Per Year:
                              </p>
                              <div
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  padding: "16px",
                                  borderRadius: "6px",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <p style={{ margin: 0 }}>Expected False Positives = Max Tests × False Positive Risk</p>
                                <p style={{ margin: 0 }}>
                                  Expected False Positives = {maxExperiments} × {(falsePositiveRisk / 100).toFixed(3)}
                                </p>
                                <p style={{ marginTop: "12px", fontWeight: "500", margin: 0 }}>
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

            <Card style={{ border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <CardHeader
                style={{
                  paddingBottom: "12px",
                  backgroundColor: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <CardTitle>MDE vs. False Negative Risk</CardTitle>
              </CardHeader>
              <CardContent
                style={{
                  backgroundColor: "white",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  paddingTop: "24px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ fontSize: "14px", color: "#4b5563", marginBottom: "16px" }}>
                    This chart shows how the Minimum Detectable Effect (MDE) affects the False Negative Risk for your
                    current sample size. A larger MDE is easier to detect, resulting in a lower risk of missing a real
                    effect.
                  </div>
                  <div style={{ height: "320px", width: "100%" }}>
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
                  <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "16px" }}>
                    <p style={{ margin: 0 }}>
                      <strong>Note:</strong> The chart shows how false negative risk decreases as MDE increases. Your
                      current MDE is {mde}% with a false negative risk of {falseNegativeRisk.toFixed(1)}%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card style={{ border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <CardHeader
                style={{
                  paddingBottom: "12px",
                  backgroundColor: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <CardTitle>Parallel Testing</CardTitle>
              </CardHeader>
              <CardContent
                style={{
                  backgroundColor: "white",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  paddingTop: "24px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <div style={{ fontSize: "14px", color: "#4b5563" }}>
                    <p style={{ margin: 0 }}>
                      Running tests in parallel can significantly increase your testing capacity, but comes with some
                      important limitations and considerations:
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "32px",
                    }}
                  >
                    <div style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "16px", margin: 0 }}>
                        Benefits of Parallel Testing
                      </h4>
                      <ul
                        style={{
                          listStyleType: "disc",
                          paddingLeft: "20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          fontSize: "14px",
                          color: "#4b5563",
                        }}
                      >
                        <li>Increased annual testing capacity</li>
                        <li>Reduced time needed to test multiple hypotheses</li>
                        <li>Faster website optimization</li>
                      </ul>
                    </div>

                    <div style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "16px", margin: 0 }}>
                        Limitations and Considerations
                      </h4>
                      <ul
                        style={{
                          listStyleType: "disc",
                          paddingLeft: "20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          fontSize: "14px",
                          color: "#4b5563",
                        }}
                      >
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

                  <div style={{ fontSize: "14px", color: "#4b5563", marginTop: "16px" }}>
                    <p style={{ margin: 0 }}>
                      <strong>Recommendation:</strong> Start with a low percentage of parallel tests (20-30%) and
                      gradually increase based on your ability to manage complexity and avoid test interference.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card style={{ border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
          <CardHeader
            style={{
              paddingBottom: "12px",
              backgroundColor: "white",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <CardTitle>Understanding Error Risks</CardTitle>
          </CardHeader>
          <CardContent
            style={{
              backgroundColor: "white",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}
              >
                <div>
                  <h3 style={{ fontWeight: "500", marginBottom: "16px", margin: 0 }}>
                    False Positive Risk (Type I Error)
                  </h3>
                  <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "16px", margin: 0 }}>
                    The false positive risk is determined solely by your confidence level and remains constant
                    regardless of other parameters:
                  </p>
                  <ul
                    style={{
                      listStyleType: "disc",
                      paddingLeft: "20px",
                      fontSize: "14px",
                      color: "#4b5563",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <li>95% confidence level → 5% false positive risk</li>
                    <li>90% confidence level → 10% false positive risk</li>
                    <li>99% confidence level → 1% false positive risk</li>
                  </ul>
                  <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "16px", margin: 0 }}>
                    This is why the false positive risk appears static - it only changes when you change the confidence
                    level.
                  </p>
                </div>

                <div>
                  <h3 style={{ fontWeight: "500", marginBottom: "16px", margin: 0 }}>
                    False Negative Risk (Type II Error)
                  </h3>
                  <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "16px", margin: 0 }}>
                    The false negative risk is more complex and depends on multiple factors:
                  </p>
                  <ul
                    style={{
                      listStyleType: "disc",
                      paddingLeft: "20px",
                      fontSize: "14px",
                      color: "#4b5563",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
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
