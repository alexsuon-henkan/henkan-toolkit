export function generateABTestDemoData() {
  // Helper function for random number in range
  const randomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Generate participants (500-1000)
  const participantsA = randomInRange(500, 1000)
  const participantsB = randomInRange(500, 1000)

  // Generate conversion rates (10-20%)
  const conversionRateA = randomInRange(10, 20) / 100
  const conversionRateB = conversionRateA * (1 + randomInRange(5, 15) / 100) // 5-15% improvement

  // Calculate conversions
  const conversionsA = Math.round(participantsA * conversionRateA)
  const conversionsB = Math.round(participantsB * conversionRateB)

  return {
    participantsA,
    conversionsA,
    participantsB,
    conversionsB,
  }
}
