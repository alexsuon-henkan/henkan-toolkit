"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"
import { Download, HelpCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import Head from "next/head"
import Script from "next/script"

const formatNumber = (num: number | null | undefined): string => {
  if (num == null) return "0"
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 })
}

const formatter = (value: any, name: string) => {
  if (typeof value === "number") {
    return [`$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name]
  } else {
    return ["N/A", name]
  }
}

export default function Results({ data }: { data: any }) {
  const [results, setResults] = useState<any>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "ascending" | "descending" }>({
    key: null,
    direction: "ascending",
  })
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const trafficChartRef = useRef(null)
  const revenueTrendsChartRef = useRef(null)
  const conversionRatesChartRef = useRef(null)

  useEffect(() => {
    const calculateResults = async () => {
      setIsLoading(true)
      try {
        console.log("Calculation data:", data) // Log input data for debugging
        const response = await fetch("/api/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }
        const calculatedResults = await response.json()
        console.log("Calculated results:", calculatedResults) // Log results for debugging
        if (!calculatedResults || Object.keys(calculatedResults).length === 0) {
          throw new Error("Empty or invalid results received")
        }
        setResults(calculatedResults)
      } catch (error) {
        console.error("Error calculating results:", error)
        toast.error(`Failed to calculate results: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    calculateResults()
  }, [data])

  if (isLoading) {
    return (
      <div className="text-center text-gray-600">
        <Spinner className="w-8 h-8 mx-auto mb-4" />
        Calculating results...
      </div>
    )
  }

  if (!results) {
    return <div className="text-center text-gray-600">No results available. Please try again.</div>
  }

  const { incrementalRevenue, incrementalConversions, adjustedTraffic, revenueOverTime } = results

  const formattedRevenueOverTime = revenueOverTime.map((item: any) => ({
    ...item,
    cumulativeRevenue: Number(item.cumulativeRevenue.toFixed(2)),
  }))

  const sortedData = [...formattedRevenueOverTime].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
    }
    return 0
  })

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const generatePDF = async () => {
    setIsPdfGenerating(true)
    // Implement PDF generation logic here
    setIsPdfGenerating(false)
  }

  return (
    <>
      <Head>
        <title>A/B Test Results | Revenue Impact Analysis</title>
        <meta
          name="description"
          content="Analyze the long-term revenue impact of your A/B test results. View detailed breakdowns of incremental revenue, conversions, and traffic adjustments."
        />
        <meta
          name="keywords"
          content="A/B testing, revenue analysis, conversion rate optimization, incremental revenue, traffic analysis"
        />
        <meta name="author" content="Henkan Toolkit" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com/ab-test-calculator/results" />
        <meta property="og:title" content="A/B Test Results | Revenue Impact Analysis" />
        <meta
          property="og:description"
          content="Analyze the long-term revenue impact of your A/B test results. View detailed breakdowns of incremental revenue, conversions, and traffic adjustments."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/ab-test-calculator/results" />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="A/B Test Results | Revenue Impact Analysis" />
        <meta
          name="twitter:description"
          content="Analyze the long-term revenue impact of your A/B test results. View detailed breakdowns of incremental revenue, conversions, and traffic adjustments."
        />
        <meta name="twitter:image" content="https://yourdomain.com/twitter-image.jpg" />
      </Head>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "A/B Test Results | Revenue Impact Analysis",
            description:
              "Analyze the long-term revenue impact of your A/B test results. View detailed breakdowns of incremental revenue, conversions, and traffic adjustments.",
            publisher: {
              "@type": "Organization",
              name: "Henkan Toolkit",
              logo: {
                "@type": "ImageObject",
                url: "https://yourdomain.com/logo.png",
              },
            },
            mainEntity: {
              "@type": "Dataset",
              name: "A/B Test Results",
              description:
                "Detailed analysis of A/B test results including incremental revenue, conversions, and traffic adjustments.",
              creator: {
                "@type": "Organization",
                name: "Henkan Toolkit",
              },
            },
          }),
        }}
      />
      <main id="results-container" className="space-y-12">
        <section aria-label="Input Data Recap">
          <Card className="border-0 shadow-md rounded-xl overflow-hidden mb-8">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="font-serif text-2xl">Input Data Recap</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-xl mb-4 text-green-700">Baseline Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Traffic:</span>
                      <span className="font-semibold">{formatNumber(data.monthlyTraffic)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversion Rate:</span>
                      <span className="font-semibold">{data.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Order Value:</span>
                      <span className="font-semibold">${formatNumber(data.aov)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-4 text-blue-700">Test Results</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uplift Percentage:</span>
                      <span className="font-semibold">{data.upliftPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Test Start Date:</span>
                      <span className="font-semibold">
                        {new Date(data.testStartDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        <section aria-label="Incremental Impact">
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="font-serif text-2xl">Incremental Impact</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-xl mb-4 text-green-700">Incremental Revenue</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">3 Months</span>
                      <span className="font-semibold text-lg">
                        $
                        {typeof incrementalRevenue.threeMonths === "number"
                          ? formatNumber(incrementalRevenue.threeMonths)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">6 Months</span>
                      <span className="font-semibold text-lg">
                        $
                        {typeof incrementalRevenue.sixMonths === "number"
                          ? formatNumber(incrementalRevenue.sixMonths)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">12 Months</span>
                      <span className="font-semibold text-lg">
                        $
                        {typeof incrementalRevenue.twelveMonths === "number"
                          ? formatNumber(incrementalRevenue.twelveMonths)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-4 text-blue-700">Incremental Conversions</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">3 Months</span>
                      <span className="font-semibold text-lg">
                        {typeof incrementalConversions.threeMonths === "number"
                          ? formatNumber(incrementalConversions.threeMonths)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">6 Months</span>
                      <span className="font-semibold text-lg">
                        {typeof incrementalConversions.sixMonths === "number"
                          ? formatNumber(incrementalConversions.sixMonths)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">12 Months</span>
                      <span className="font-semibold text-lg">
                        {typeof incrementalConversions.twelveMonths === "number"
                          ? formatNumber(incrementalConversions.twelveMonths)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        <section aria-label="Charts" className="space-y-8">
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <CardTitle className="font-serif text-2xl flex items-center">
                  Adjusted vs Baseline Monthly Traffic
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-5 w-5 text-gray-400 ml-2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Compares baseline traffic to adjusted traffic considering seasonality</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </CardTitle>
                <Button
                  onClick={() => {}} // Implement chart download functionality
                  variant="outline"
                  size="sm"
                  className="border-[#76B95B] text-[#76B95B] hover:bg-[#76B95B] hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Chart
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div ref={trafficChartRef} className="w-full h-[400px] bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adjustedTraffic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: "Traffic", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={formatter} labelFormatter={(label) => `Month: ${label}`} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="baseline" name="Baseline Traffic" fill="#76B95B" />
                    <Bar dataKey="adjusted" name="Adjusted Traffic" fill="#65A84A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <CardTitle className="font-serif text-2xl flex items-center">
                  Adjusted vs Baseline Monthly Conversion Rates
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-5 w-5 text-gray-400 ml-2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Compares baseline conversion rates to adjusted conversion rates considering seasonality</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </CardTitle>
                <Button
                  onClick={() => {}} // Implement chart download functionality
                  variant="outline"
                  size="sm"
                  className="border-[#76B95B] text-[#76B95B] hover:bg-[#76B95B] hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Chart
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div ref={conversionRatesChartRef} className="w-full h-[400px] bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: "Conversion Rate (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={formatter} labelFormatter={(label) => `Month: ${label}`} />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="conversionRate"
                      name="Adjusted Rate"
                      stroke="#76B95B"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey={() => data.conversionRate}
                      name="Baseline Rate"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <CardTitle className="font-serif text-2xl flex items-center">
                  Incremental and Cumulative Revenue Trends
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-5 w-5 text-gray-400 ml-2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Shows monthly incremental revenue and cumulative revenue over time</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </CardTitle>
                <Button
                  onClick={() => {}} // Implement chart download functionality
                  variant="outline"
                  size="sm"
                  className="border-[#76B95B] text-[#76B95B] hover:bg-[#76B95B] hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Chart
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div ref={revenueTrendsChartRef} className="w-full h-[400px] bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={formattedRevenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis
                      yAxisId="left"
                      label={{ value: "Incremental Revenue ($)", angle: -90, position: "insideLeft" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{ value: "Cumulative Revenue ($)", angle: 90, position: "insideRight" }}
                    />
                    <Tooltip formatter={formatter} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="incrementalRevenue" yAxisId="left" name="Incremental Revenue" fill="#76B95B" />
                    <Line
                      type="monotone"
                      dataKey="cumulativeRevenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      yAxisId="right"
                      name="Cumulative Revenue"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>
        <section aria-label="Detailed Analysis" className="mt-8">
          <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-serif text-2xl">Detailed Analysis</h3>
            <Button
              onClick={() => {}} // Implement table download functionality
              variant="outline"
              size="sm"
              className="border-[#76B95B] text-[#76B95B] hover:bg-[#76B95B] hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download Table
            </Button>
          </div>
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => requestSort("month")} className="cursor-pointer">
                    Month
                  </TableHead>
                  <TableHead onClick={() => requestSort("adjustedTraffic")} className="cursor-pointer text-right">
                    Traffic
                  </TableHead>
                  <TableHead onClick={() => requestSort("conversionRate")} className="cursor-pointer text-right">
                    Conv. Rate
                  </TableHead>
                  <TableHead onClick={() => requestSort("incrementalRevenue")} className="cursor-pointer text-right">
                    Inc. Revenue
                  </TableHead>
                  <TableHead onClick={() => requestSort("cumulativeRevenue")} className="cursor-pointer text-right">
                    Cum. Revenue
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <TableCell>{item.month}</TableCell>
                    <TableCell className="text-right">{formatNumber(item.adjustedTraffic)}</TableCell>
                    <TableCell className="text-right">
                      {typeof item.conversionRate === "number" ? `${item.conversionRate.toFixed(2)}%` : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${typeof item.incrementalRevenue === "number" ? formatNumber(item.incrementalRevenue) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${typeof item.cumulativeRevenue === "number" ? formatNumber(item.cumulativeRevenue) : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
        <Button
          className="w-full bg-[#76B95B] hover:bg-[#65A84A] text-white mt-8"
          onClick={generatePDF}
          disabled={isPdfGenerating}
        >
          {isPdfGenerating ? (
            <>Generating PDF...</>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download Analysis Report (PDF)
            </>
          )}
        </Button>
      </main>
    </>
  )
}
