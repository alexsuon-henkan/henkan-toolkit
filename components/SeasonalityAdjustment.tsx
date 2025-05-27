"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const industries = [
  { name: "Travel", icon: "🧳" },
  { name: "E-commerce", icon: "🛒" },
  { name: "Hospitality", icon: "🏨" },
  { name: "Fashion", icon: "👗" },
  { name: "Food & Beverage", icon: "🍔" },
]

const industryData = {
  Travel: {
    trafficAdjustments: [0, 5, 10, 15, 20, 30, 40, 35, 25, 15, 5, 0],
  },
  "E-commerce": {
    trafficAdjustments: [5, 10, 0, 0, 5, -10, -20, -10, 0, 30, 50, 70],
  },
  Hospitality: {
    trafficAdjustments: [0, 5, 10, 15, 20, 25, 30, 30, 25, 15, 5, 0],
  },
  Fashion: {
    trafficAdjustments: [0, 5, 10, 15, 20, 25, 15, 10, 30, 35, 40, 45],
  },
  "Food & Beverage": {
    trafficAdjustments: [0, 5, 10, 15, 20, 25, 30, 30, 25, 20, 15, 10],
  },
}

export default function SeasonalityAdjustment({ data, updateData }) {
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [originalData, setOriginalData] = useState(null)

  useEffect(() => {
    if (!originalData) {
      setOriginalData({
        trafficAdjustments: { ...data.trafficAdjustments },
        monthlyConversionRates: { ...data.monthlyConversionRates },
      })
    }
  }, [data, originalData])

  const handleTrafficAdjustmentChange = (month, value) => {
    const newTrafficAdjustments = {
      ...data.trafficAdjustments,
      [month]: value === "" ? 0 : Number.parseFloat(value) || 0,
    }
    updateData({ trafficAdjustments: newTrafficAdjustments })
    recalculateConversionRates(newTrafficAdjustments)
  }

  const handleMonthlyConversionRateChange = (month, value) => {
    const newMonthlyConversionRates = {
      ...data.monthlyConversionRates,
      [month]: value === "" ? null : Number.parseFloat(value) || data.conversionRate || 0,
    }
    updateData({ monthlyConversionRates: newMonthlyConversionRates })
  }

  const selectIndustry = (industry) => {
    setSelectedIndustry(industry)
    if (industryData[industry] && industryData[industry].trafficAdjustments) {
      const newTrafficAdjustments = {}
      industryData[industry].trafficAdjustments.forEach((adjustment, index) => {
        newTrafficAdjustments[months[index]] = adjustment
      })
      updateData({ trafficAdjustments: newTrafficAdjustments })
      recalculateConversionRates(newTrafficAdjustments)
    } else {
      console.error(`No data found for industry: ${industry}`)
    }
  }

  const recalculateConversionRates = (trafficAdjustments) => {
    const baselineConversionRate = data.conversionRate
    const newMonthlyConversionRates = {}
    Object.entries(trafficAdjustments).forEach(([month, adjustment]) => {
      const trafficMultiplier = 1 + adjustment / 100
      newMonthlyConversionRates[month] = baselineConversionRate * (2 - trafficMultiplier)
    })
    updateData({ monthlyConversionRates: newMonthlyConversionRates })
  }

  const resetTrends = () => {
    if (originalData) {
      updateData({
        trafficAdjustments: { ...originalData.trafficAdjustments },
        monthlyConversionRates: { ...originalData.monthlyConversionRates },
      })
      setSelectedIndustry(null)
    }
  }

  const displayConversionRate = (month) => {
    const rate = data.monthlyConversionRates[month]
    if (rate === null || rate === undefined) return ""
    return rate === data.conversionRate ? "" : typeof rate === "number" ? rate.toFixed(2) : "0.00"
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Your Industry to Auto-Fill Seasonality Trends:</h3>
        <div className="flex flex-wrap items-center gap-2">
          {industries.map((industry) => (
            <Button
              key={industry.name}
              onClick={() => selectIndustry(industry.name)}
              variant={selectedIndustry === industry.name ? "default" : "outline"}
              className="px-4 py-2"
            >
              {industry.icon} {industry.name}
            </Button>
          ))}
          <Button onClick={resetTrends} variant="outline" className="px-4 py-2 ml-2">
            Reset Trends
          </Button>
        </div>
        <div className="mt-6 mb-4 text-sm text-gray-600">
          <p>
            <strong>Traffic Adjustment:</strong> Enter the percentage increase or decrease in traffic for each month
            (e.g., +20% for a 20% increase, -10% for a 10% decrease).
          </p>
          <p>
            <strong>Conversion Rate:</strong> Enter the actual conversion rate percentage for each month (e.g., 2.5 for
            2.5% conversion rate).
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-lg mb-3">Monthly Traffic Adjustments</h4>
              {months.map((month) => (
                <div key={month} className="space-y-2">
                  <Label htmlFor={`traffic-${month}`} className="text-sm font-medium mb-1">
                    {month}
                  </Label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              <Input
                                id={`traffic-${month}`}
                                type="number"
                                value={data.trafficAdjustments[month] === 0 ? "" : data.trafficAdjustments[month] || ""}
                                onChange={(e) => handleTrafficAdjustmentChange(month, e.target.value)}
                                className="w-full pr-8 pl-8 border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                              />
                              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">🚶</span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">%</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter traffic adjustment percentage (e.g., +20 for 20% increase)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium text-lg mb-3">Monthly Conversion Rates</h4>
              {months.map((month) => (
                <div key={month} className="space-y-2">
                  <Label htmlFor={`conversion-rate-${month}`} className="text-sm font-medium mb-1">
                    {month}
                  </Label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              <Input
                                id={`conversion-rate-${month}`}
                                type="number"
                                step="0.01"
                                value={displayConversionRate(month)}
                                onChange={(e) => handleMonthlyConversionRateChange(month, e.target.value)}
                                placeholder={`${typeof data.conversionRate === "number" ? data.conversionRate.toFixed(2) : "0.00"}%`}
                                className="w-full pr-8 pl-8 border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                              />
                              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">🎯</span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">%</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enter actual conversion rate percentage (e.g., 2.5 for 2.5%). Leave blank to use the
                              baseline rate of{" "}
                              {typeof data.conversionRate === "number" ? data.conversionRate.toFixed(2) : "0.00"}%
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
