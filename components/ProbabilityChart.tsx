"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface ProbabilityChartProps {
  probabilityBGreaterA: number
}

export function ProbabilityChart({ probabilityBGreaterA }: ProbabilityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 800
    const height = 100
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth])

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Add gradient for B > A
    const gradientB = g
      .append("linearGradient")
      .attr("id", "gradient-b")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", x(probabilityBGreaterA))
      .attr("y2", 0)

    gradientB.append("stop").attr("offset", "0%").attr("stop-color", "#4CAF50")

    gradientB.append("stop").attr("offset", "100%").attr("stop-color", "#81C784")

    // Add gradient for A > B
    const gradientA = g
      .append("linearGradient")
      .attr("id", "gradient-a")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", x(probabilityBGreaterA))
      .attr("y1", 0)
      .attr("x2", innerWidth)
      .attr("y2", 0)

    gradientA.append("stop").attr("offset", "0%").attr("stop-color", "#F44336")

    gradientA.append("stop").attr("offset", "100%").attr("stop-color", "#E57373")

    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", x(probabilityBGreaterA))
      .attr("height", innerHeight)
      .attr("fill", "url(#gradient-b)")

    g.append("rect")
      .attr("x", x(probabilityBGreaterA))
      .attr("y", 0)
      .attr("width", innerWidth - x(probabilityBGreaterA))
      .attr("height", innerHeight)
      .attr("fill", "url(#gradient-a)")

    g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(10, "%"))

    g.append("text")
      .attr("x", x(probabilityBGreaterA / 2))
      .attr("y", innerHeight / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .text(`${(probabilityBGreaterA * 100).toFixed(1)}%`)

    g.append("text")
      .attr("x", x(probabilityBGreaterA + (1 - probabilityBGreaterA) / 2))
      .attr("y", innerHeight / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .text(`${((1 - probabilityBGreaterA) * 100).toFixed(1)}%`)

    g.append("text").attr("x", 0).attr("y", -5).attr("text-anchor", "start").attr("fill", "currentColor").text("B > A")

    g.append("text")
      .attr("x", innerWidth)
      .attr("y", -5)
      .attr("text-anchor", "end")
      .attr("fill", "currentColor")
      .text("A > B")
  }, [probabilityBGreaterA])

  const handleZoomIn = () => setScale((prevScale) => Math.min(prevScale * 1.2, 5))
  const handleZoomOut = () => setScale((prevScale) => Math.max(prevScale / 1.2, 0.5))
  const handleResetZoom = () => setScale(1)

  return (
    <div className="relative w-full h-[150px] overflow-hidden bg-white rounded-lg shadow-md">
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
        <Button size="icon" variant="outline" onClick={handleZoomIn} aria-label="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={handleZoomOut} aria-label="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={handleResetZoom} aria-label="Reset zoom">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="w-full h-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          transition: "transform 0.2s ease-out",
        }}
      >
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 100" preserveAspectRatio="xMidYMid meet" />
      </div>
    </div>
  )
}
