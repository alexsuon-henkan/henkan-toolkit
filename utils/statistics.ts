import jstat from "jstat"

export function calculateConversionRate(conversions: number, participants: number): number {
  return conversions / participants
}

export function calculateZScore(rate1: number, rate2: number, n1: number, n2: number): number {
  const p1 = rate1
  const p2 = rate2
  const p = (p1 * n1 + p2 * n2) / (n1 + n2)
  return (p2 - p1) / Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2))
}

export function calculateConfidence(zScore: number): number {
  const pValue = 2 * (1 - jstat.normal.cdf(Math.abs(zScore), 0, 1))
  return 1 - pValue
}

export function calculateLift(rate1: number, rate2: number): number {
  return (rate2 - rate1) / rate1
}

export function generateNormalDistribution(
  mean: number,
  stdDev: number,
  start: number,
  end: number,
  steps: number,
): number[][] {
  const step = (end - start) / steps
  const distribution = []
  for (let x = start; x <= end; x += step) {
    const y = jstat.normal.pdf(x, mean, stdDev)
    distribution.push([x, y])
  }
  return distribution
}

export function calculateStandardError(rate: number, n: number): number {
  return Math.sqrt((rate * (1 - rate)) / n)
}

export function calculateRequiredSampleSize(rate1: number, rate2: number, power = 0.8, alpha = 0.05): number {
  const z_alpha = jstat.normal.inv(1 - alpha / 2, 0, 1)
  const z_beta = jstat.normal.inv(power, 0, 1)
  const p = (rate1 + rate2) / 2
  const q = 1 - p
  return Math.ceil(((z_alpha + z_beta) ** 2 * p * q * 2) / (rate1 - rate2) ** 2)
}

export function calculateObservedPower(zScore: number): number {
  return 1 - jstat.normal.cdf(-Math.abs(zScore) + 1.96, 0, 1)
}

export function calculateMannWhitneyU(
  group1: number[],
  group2: number[],
): { U: number; criticalU: number; z: number; p: number; significant: boolean } {
  const n1 = group1.length
  const n2 = group2.length

  if (n1 === 0 || n2 === 0) {
    throw new Error("Both groups must have at least one value.")
  }

  const combined = [...group1, ...group2].sort((a, b) => a - b)

  // Assign ranks with ties handled
  const ranks = new Map<number, number>()
  let currentRank = 1

  for (let i = 0; i < combined.length; i++) {
    const value = combined[i]
    if (!ranks.has(value)) {
      const tiedValues = combined.filter((v) => v === value)
      const averageRank = currentRank + (tiedValues.length - 1) / 2
      tiedValues.forEach(() => ranks.set(value, averageRank))
      currentRank += tiedValues.length
    }
  }

  // Calculate rank sums
  const rankSum1 = group1.reduce((sum, value) => sum + (ranks.get(value) || 0), 0)
  const rankSum2 = group2.reduce((sum, value) => sum + (ranks.get(value) || 0), 0)

  // Calculate U values
  const U1 = rankSum1 - (n1 * (n1 + 1)) / 2
  const U2 = rankSum2 - (n2 * (n2 + 1)) / 2

  // Use the smaller U value
  const U = Math.min(U1, U2)

  // Calculate z-score
  const meanU = (n1 * n2) / 2
  const stdDevU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12)
  const z = (U - meanU) / stdDevU

  // Calculate p-value (two-tailed)
  const p = 2 * (1 - jstat.normal.cdf(Math.abs(z), 0, 1))

  // Calculate critical U value (approximation)
  const criticalZ = jstat.normal.inv(0.975, 0, 1) // For p < 0.05, two-tailed
  const criticalU = meanU - criticalZ * stdDevU

  return {
    U: U,
    criticalU: criticalU,
    z,
    p,
    significant: U <= criticalU,
  }
}

export function calculateSRM(participantsA: number, participantsB: number): number {
  const totalParticipants = participantsA + participantsB
  const expectedRatio = 0.5 // Assuming a 50/50 split
  const observedRatioA = participantsA / totalParticipants
  const observedRatioB = participantsB / totalParticipants

  const chiSquared =
    totalParticipants *
    (Math.pow(observedRatioA - expectedRatio, 2) / expectedRatio +
      Math.pow(observedRatioB - expectedRatio, 2) / expectedRatio)

  return 1 - jstat.chisquare.cdf(chiSquared, 1)
}
