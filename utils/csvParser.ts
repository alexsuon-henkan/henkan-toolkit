export function parseCSV(content: string): number[] {
  const lines = content.split(/\r\n|\n/)
  const values: number[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine) {
      const lineValues = trimmedLine
        .split(",")
        .map((value) => {
          const parsedValue = Number.parseFloat(value.trim())
          return isNaN(parsedValue) ? null : parsedValue
        })
        .filter((value): value is number => value !== null)
      values.push(...lineValues)
    }
  }

  return values
}
