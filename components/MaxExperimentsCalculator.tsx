"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { InfoIcon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

// Self-contained Card components
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: "24px 24px 12px 24px",
      backgroundColor: "white",
    }}
  >
    {children}
  </div>
)

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3
    style={{
      fontSize: "18px",
      fontWeight: "600",
      margin: 0,
      color: "#111827",
    }}
  >
    {children}
  </h3>
)

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: "0 24px 24px 24px",
      backgroundColor: "white",
    }}
  >
    {children}
  </div>
)

// Self-contained Input components
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label
    htmlFor={htmlFor}
    style={{
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      display: "block",
      marginBottom: "6px",
    }}
  >
    {children}
  </label>
)

const Input = ({
  id,
  type,
  value,
  onChange,
}: {
  id?: string
  type: string
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "white",
      outline: "none",
      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    }}
    onFocus={(e) => {
      e.target.style.borderColor = "#3b82f6"
      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#d1d5db"
      e.target.style.boxShadow = "none"
    }}
  />
)

// Self-contained Button component
const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: "#111827",
      color: "white",
      padding: "10px 32px",
      borderRadius: "6px",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.15s ease-in-out",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#1f2937"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#111827"
    }}
  >
    {children}
  </button>
)

// Self-contained Slider component
const Slider = ({
  value,
  min,
  max,
  step,
  onValueChange,
}: {
  value: number[]
  min: number
  max: number
  step: number
  onValueChange: (value: number[]) => void
}) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([Number(e.target.value)])}
    style={{
      width: "100%",
      height: "6px",
      borderRadius: "3px",
      background: "#e5e7eb",
      outline: "none",
      cursor: "pointer",
    }}
  />
)

// Self-contained Tooltip component
const Tooltip = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: "relative", display: "inline-block" }}>{children}</div>
)

const TooltipTrigger = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "inline-block" }}>{children}</div>
)

const TooltipContent = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#1f2937",
      color: "white",
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      zIndex: 1000,
      marginBottom: "4px",
      opacity: 0,
      pointerEvents: "none",
      transition: "opacity 0.15s ease-in-out",
    }}
  >
    {children}
  </div>
)

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

// Self-contained Accordion components
const Accordion = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>

const AccordionItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px" }}>{children}</div>
)

const AccordionTrigger = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      style={{
        width: "100%",
        padding: "16px 24px",
        backgroundColor: "#f9fafb",
        border: "none",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        borderRadius: "6px",
        transition: "background-color 0.15s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f3f4f6"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#f9fafb"
      }}
    >
      {children}
    </button>
  )
}

const AccordionContent = ({ children }: { children: React.ReactNode }) => <div style={{ padding: "0" }}>{children}</div>

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
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card>
        <CardHeader>
          <CardTitle>Input Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
              <div>
                <Label htmlFor="daily-visitors">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Daily Traffic (visitors)
                    <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Conversion Rate (%)
                    <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Minimum Detectable Effect (%)
                    <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
                  </div>
                </Label>
                <Input id="mde" type="number" value={mde} onChange={handleMdeChange} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
              <div>
                <Label htmlFor="confidence-level">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Confidence Level (%)
                    <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Target Statistical Power (%)
                    <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
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
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Parallel Tests (%)
                  <InfoIcon style={{ height: "16px", width: "16px", color: "#9ca3af" }} />
                </div>
              </Label>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px" }}>
                <Slider value={[parallelPercentage]} min={0} max={100} step={5} onValueChange={handleParallelChange} />
                <span style={{ minWidth: "48px", textAlign: "right", fontSize: "14px" }}>{parallelPercentage}%</span>
              </div>
              <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px", margin: "8px 0 0 0" }}>
                0% = sequential tests only, 100% = all tests can be run in parallel
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <Button onClick={calculateMaxExperiments}>Calculate</Button>
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "right" }}>
              Click "Calculate" after changing values to update results
            </div>
          </div>
        </CardContent>
      </Card>

      {maxExperiments !== null && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}
                >
                  <div
                    style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px", textAlign: "center" }}
                  >
                    <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px", margin: "0 0 12px 0" }}>
                      Sequential A/B Tests Per Year
                    </h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold", margin: "12px 0", color: "#111827" }}>
                      {maxExperiments}
                    </p>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "12px 0 0 0" }}>
                      Tests run one after another
                    </p>
                  </div>

                  <div
                    style={{ backgroundColor: "#f3f4f6", padding: "32px", borderRadius: "8px", textAlign: "center" }}
                  >
                    <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px", margin: "0 0 12px 0" }}>
                      A/B Tests With Parallelization
                    </h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold", margin: "12px 0", color: "#111827" }}>
                      {maxParallelExperiments}
                    </p>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "12px 0 0 0" }}>
                      With {parallelPercentage}% parallel tests
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}
                >
                  <div style={{ backgroundColor: "#f3f4f6", padding: "24px", borderRadius: "8px" }}>
                    <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: "0 0 12px 0" }}>
                      Sample Size Required
                    </h4>
                    <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0", color: "#111827" }}>
                      {sampleSize ? formatNumber(sampleSize) : "-"}
                    </p>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "12px 0 0 0" }}>
                      Total visitors needed per test
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#f3f4f6", padding: "24px", borderRadius: "8px" }}>
                    <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: "0 0 12px 0" }}>Annual Traffic</h4>
                    <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0", color: "#111827" }}>
                      {annualVisitors ? formatNumber(annualVisitors) : "-"}
                    </p>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "12px 0 0 0" }}>Total visitors per year</p>
                  </div>
                </div>

                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}
                >
                  <div style={{ backgroundColor: "#f3f4f6", padding: "24px", borderRadius: "8px" }}>
                    <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: "0 0 12px 0" }}>
                      False Positive Risk
                    </h4>
                    <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0", color: "#111827" }}>
                      {falsePositiveRisk.toFixed(1)}%
                    </p>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "12px 0 0 0" }}>
                      Risk of detecting an effect that doesn't exist
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#f3f4f6", padding: "24px", borderRadius: "8px" }}>
                    <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: "0 0 12px 0" }}>
                      False Negative Risk
                    </h4>
                    <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0", color: "#111827" }}>
                      {falseNegativeRisk.toFixed(1)}%
                    </p>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "12px 0 0 0" }}>
                      Risk of missing a real effect of size {mde}%
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#f3f4f6", padding: "24px", borderRadius: "8px" }}>
                    <h4 style={{ fontWeight: "500", marginBottom: "12px", margin: "0 0 12px 0" }}>
                      Expected False Positives
                    </h4>
                    <p style={{ fontSize: "24px", fontWeight: "600", margin: "12px 0", color: "#111827" }}>
                      {annualFalsePositives ? formatDecimal(annualFalsePositives) : "-"}
                    </p>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "12px 0 0 0" }}>
                      Expected false positives per year
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>MDE vs. False Negative Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ fontSize: "14px", color: "#4b5563" }}>
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
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
