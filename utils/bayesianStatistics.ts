import jstat from "jstat"

export function calculateBayesianResults(
  participantsA: number,
  conversionsA: number,
  participantsB: number,
  conversionsB: number,
  priorAlpha: number,
  priorBeta: number,
) {
  // Calculate posterior parameters
  const posteriorAlphaA = priorAlpha + conversionsA
  const posteriorBetaA = priorBeta + participantsA - conversionsA
  const posteriorAlphaB = priorAlpha + conversionsB
  const posteriorBetaB = priorBeta + participantsB - conversionsB

  // Calculate probability that B is better than A
  const probabilityBGreaterA = calculateProbabilityBGreaterA(
    posteriorAlphaA,
    posteriorBetaA,
    posteriorAlphaB,
    posteriorBetaB,
  )

  // Calculate expected lift
  const expectedLift =
    posteriorAlphaB / (posteriorAlphaB + posteriorBetaB) / (posteriorAlphaA / (posteriorAlphaA + posteriorBetaA)) - 1

  // Calculate 95% HDI (Highest Density Interval)
  const hdiLower = calculateHDI(posteriorAlphaA, posteriorBetaA, posteriorAlphaB, posteriorBetaB, 0.025)
  const hdiUpper = calculateHDI(posteriorAlphaA, posteriorBetaA, posteriorAlphaB, posteriorBetaB, 0.975)

  return {
    probabilityBGreaterA,
    expectedLift,
    hdiLower,
    hdiUpper,
    posteriorAlphaA,
    posteriorBetaA,
    posteriorAlphaB,
    posteriorBetaB,
  }
}

function calculateProbabilityBGreaterA(alphaA: number, betaA: number, alphaB: number, betaB: number) {
  let count = 0
  const iterations = 100000

  for (let i = 0; i < iterations; i++) {
    const sampleA = jstat.beta.sample(alphaA, betaA)
    const sampleB = jstat.beta.sample(alphaB, betaB)
    if (sampleB > sampleA) {
      count++
    }
  }

  return count / iterations
}

function calculateHDI(alphaA: number, betaA: number, alphaB: number, betaB: number, percentile: number) {
  const iterations = 100000
  const differences = []

  for (let i = 0; i < iterations; i++) {
    const sampleA = jstat.beta.sample(alphaA, betaA)
    const sampleB = jstat.beta.sample(alphaB, betaB)
    differences.push(sampleB - sampleA)
  }

  differences.sort((a, b) => a - b)
  return differences[Math.floor(percentile * iterations)]
}
