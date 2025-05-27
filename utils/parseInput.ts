export interface SankeyData {
  nodes: { name: string; displayName: string }[]
  links: { source: number; target: number; value: number }[]
}

export function parseInput(input: string): SankeyData {
  const lines = input.trim().split("\n")
  const nodes = new Map<string, { name: string; displayName: string }>()
  const links: { source: number; target: number; value: number }[] = []

  lines.forEach((line) => {
    const parts = line.split(",").map((s) => s.trim())
    if (parts.length !== 3) {
      throw new Error("Each line must have exactly three parts: source, target, value")
    }

    const [source, target, valueStr] = parts
    const value = Number(valueStr)

    if (isNaN(value)) {
      throw new Error("Invalid value in input")
    }

    // Extract name and display name for source
    const sourceMatch = source.match(/(.+?)$$(.*?)$$/)
    const sourceName = sourceMatch ? sourceMatch[1].trim() : source
    const sourceDisplay = sourceMatch ? sourceMatch[2].trim() : source

    // Extract name and display name for target
    const targetMatch = target.match(/(.+?)$$(.*?)$$/)
    const targetName = targetMatch ? targetMatch[1].trim() : target
    const targetDisplay = targetMatch ? targetMatch[2].trim() : target

    // Add nodes if they don't exist
    if (!nodes.has(sourceName)) {
      nodes.set(sourceName, { name: sourceName, displayName: sourceDisplay })
    }
    if (!nodes.has(targetName)) {
      nodes.set(targetName, { name: targetName, displayName: targetDisplay })
    }

    // Add link
    const sourceIndex = Array.from(nodes.keys()).indexOf(sourceName)
    const targetIndex = Array.from(nodes.keys()).indexOf(targetName)
    links.push({ source: sourceIndex, target: targetIndex, value })
  })

  return {
    nodes: Array.from(nodes.values()),
    links,
  }
}
