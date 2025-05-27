export interface TestCalculationResult {
  sampleSizePerVariation: number
  totalSampleSize: number
  durationInDays: number
}

export interface WeeklyMDEResult {
  week: number
  mde: number
  visitorsPerVariant: number
}

export type CalculationResult = TestCalculationResult | WeeklyMDEResult[]

const zScores = {
  significance: {
    0.9: 1.645,
    0.95: 1.96,
    0.99: 2.576,
  },
  power: {
    0.8: 0.84,
    0.85: 1.04,
    0.9: 1.28,
  },
}

function calculateWeeklyMDE(
  dailyVisitors: number,
  conversionRate: number,
  Z_ALPHA: number,
  Z_BETA: number,
  numberOfVariations: number,
): WeeklyMDEResult[] {
  const results: WeeklyMDEResult[] = []

  for (let week = 1; week <= 12; week++) {
    const visitorsPerVariant = Math.floor((week * 7 * dailyVisitors) / numberOfVariations)
    const mde = Math.sqrt(
      (2 * Math.pow(Z_ALPHA + Z_BETA, 2) * conversionRate * (1 - conversionRate)) / visitorsPerVariant,
    )
    const mdePercentage = (mde / conversionRate) * 100

    results.push({
      week,
      mde: mdePercentage,
      visitorsPerVariant,
    })
  }

  return results
}

export function calculateTestMetrics(
  dailyVisitors: number,
  conversionRate: number,
  testObjective: "derisk" | "increase" | "decrease" | "custom" | "unknown",
  customMde?: number,
  significanceLevel = 0.95,
  statisticalPower = 0.8,
  numberOfVariations = 2,
): TestCalculationResult | WeeklyMDEResult[] {
  try {
    const Z_ALPHA = zScores.significance[significanceLevel as keyof typeof zScores.significance]
    const Z_BETA = zScores.power[statisticalPower as keyof typeof zScores.power]

    if (testObjective === "unknown") {
      return calculateWeeklyMDE(dailyVisitors, conversionRate, Z_ALPHA, Z_BETA, numberOfVariations)
    }

    let delta: number
    switch (testObjective) {
      case "derisk":
        delta = 0.001
        break
      case "increase":
        delta = 0.1 * conversionRate
        break
      case "decrease":
        delta = 0.05 * conversionRate
        break
      case "custom":
        delta = (customMde || 0.1) * conversionRate
        break
      default:
        throw new Error("Invalid test objective")
    }

    const sampleSizePerVariation = Math.ceil(
      (Math.pow(Z_ALPHA + Z_BETA, 2) * 2 * conversionRate * (1 - conversionRate)) / Math.pow(delta, 2),
    )

    const totalSampleSize = sampleSizePerVariation * numberOfVariations
    const durationInDays = Math.ceil(totalSampleSize / dailyVisitors)

    return {
      sampleSizePerVariation,
      totalSampleSize,
      durationInDays,
    }
  } catch (error) {
    console.error("Error in calculateTestMetrics:", error)
    return {
      sampleSizePerVariation: 0,
      totalSampleSize: 0,
      durationInDays: 0,
    }
  }
}
