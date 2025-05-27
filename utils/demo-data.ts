import type { TestObjective } from "../components/DurationCalculator"

export function generateDemoData() {
  const testObjectives: TestObjective[] = ["derisk", "increase", "decrease", "custom", "unknown"]
  const randomTestObjective = testObjectives[Math.floor(Math.random() * testObjectives.length)]

  return {
    dailyVisitors: Math.floor(Math.random() * (10000 - 1000) + 1000),
    conversionRate: (Math.random() * (10 - 1) + 1).toFixed(2),
    numberOfVariations: Math.floor(Math.random() * (7 - 2) + 2),
    testObjective: randomTestObjective,
    customMde: randomTestObjective === "custom" ? (Math.random() * (20 - 1) + 1).toFixed(2) : undefined,
  }
}
