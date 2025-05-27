import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received data:", data) // Log received data

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No data provided")
    }

    // Validate required fields
    const requiredFields = [
      "monthlyTraffic",
      "conversionRate",
      "aov",
      "upliftPercentage",
      "trafficAdjustments",
      "monthlyConversionRates",
      "decay",
    ]
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    const calculatedResults = {
      incrementalRevenue: {
        threeMonths: calculateIncrementalRevenue(data, 3),
        sixMonths: calculateIncrementalRevenue(data, 6),
        twelveMonths: calculateIncrementalRevenue(data, 12),
      },
      incrementalConversions: {
        threeMonths: calculateIncrementalConversions(data, 3),
        sixMonths: calculateIncrementalConversions(data, 6),
        twelveMonths: calculateIncrementalConversions(data, 12),
      },
      adjustedTraffic: calculateAdjustedTraffic(data),
      revenueOverTime: calculateRevenueOverTime(data),
    }

    console.log("Calculated results:", calculatedResults) // Log calculated results

    return NextResponse.json(calculatedResults)
  } catch (error) {
    console.error("Error calculating results:", error)
    return NextResponse.json({ error: error.message || "Failed to calculate results" }, { status: 500 })
  }
}

function calculateIncrementalRevenue(data: any, months: number) {
  const revenueOverTime = calculateRevenueOverTime(data)
  return revenueOverTime.slice(0, months).reduce((sum, month) => sum + month.incrementalRevenue, 0)
}

function calculateIncrementalConversions(data: any, months: number) {
  const revenueOverTime = calculateRevenueOverTime(data)
  return revenueOverTime.slice(0, months).reduce((sum, month) => sum + month.incrementalConversions, 0)
}

function calculateAdjustedTraffic(data: any) {
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
  return months.map((month) => ({
    month,
    baseline: data.monthlyTraffic,
    adjusted: data.monthlyTraffic * (1 + (data.trafficAdjustments[month] || 0) / 100),
  }))
}

function calculateRevenueOverTime(data: any) {
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
  let cumulativeRevenue = 0
  return months.map((month, index) => {
    const adjustedTraffic = data.monthlyTraffic * (1 + (data.trafficAdjustments[month] || 0) / 100)
    const conversionRate = data.monthlyConversionRates[month] || data.conversionRate
    const baselineConversions = adjustedTraffic * (conversionRate / 100)
    const upliftedConversions = baselineConversions * (1 + data.upliftPercentage / 100)
    const incrementalConversions = upliftedConversions - baselineConversions

    let decayFactor = 1
    if (index < 3) {
      decayFactor = 1 - data.decay.threeMonths / 100
    } else if (index < 6) {
      decayFactor = 1 - data.decay.sixMonths / 100
    } else {
      decayFactor = 1 - data.decay.twelveMonths / 100
    }

    const incrementalRevenue = incrementalConversions * data.aov * decayFactor
    cumulativeRevenue += incrementalRevenue

    return {
      month,
      adjustedTraffic,
      conversionRate,
      incrementalConversions,
      incrementalRevenue,
      cumulativeRevenue,
    }
  })
}
