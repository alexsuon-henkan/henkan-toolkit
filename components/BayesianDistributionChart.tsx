"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import jstat from "jstat"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface BayesianDistributionChartProps {
  alpha: number
  beta: number
  alpha2?: number
  beta2?: number
}

export function BayesianDistributionChart({ alpha, beta, alpha2, beta2 }: BayesianDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 800
    const height = 400
    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth])

    const y = d3.scaleLinear().range([innerHeight, 0])

    const line = d3
      .line<[number, number]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))

    const generatePoints = (a: number, b: number) => {
      return d3.range(0, 1, 0.01).map((x) => [x, jstat.beta.pdf(x, a, b)])
    }

    const points1 = generatePoints(alpha, beta)
    const points2 = alpha2 !== undefined && beta2 !== undefined ? generatePoints(alpha2, beta2) : null

    y.domain([0, d3.max(points2 ? [...points1, ...points2] : points1, (d) => d[1]) as number])

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(-innerHeight)
          .tickFormat(() => ""),
      )

    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-innerWidth)
          .tickFormat(() => ""),
      )

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", 30)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Conversion Rate")

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -innerHeight / 2)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Probability Density")

    // Add distribution curves
    const area1 = d3
      .area<[number, number]>()
      .x((d) => x(d[0]))
      .y0(innerHeight)
      .y1((d) => y(d[1]))

    g.append("path").datum(points1).attr("fill", "rgba(76, 175, 80, 0.3)").attr("d", area1)

    g.append("path")
      .datum(points1)
      .attr("fill", "none")
      .attr("stroke", "#4CAF50")
      .attr("stroke-width", 2)
      .attr("d", line)

    if (points2) {
      const area2 = d3
        .area<[number, number]>()
        .x((d) => x(d[0]))
        .y0(innerHeight)
        .y1((d) => y(d[1]))

      g.append("path").datum(points2).attr("fill", "rgba(33, 150, 243, 0.3)").attr("d", area2)

      g.append("path")
        .datum(points2)
        .attr("fill", "none")
        .attr("stroke", "#2196F3")
        .attr("stroke-width", 2)
        .attr("d", line)
    }

    // Add legend
    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(points2 ? ["Variation A", "Variation B"] : ["Prior"])
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${width - 10},${i * 20 + 10})`)

    legend
      .append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", (d, i) => (i === 0 ? "#4CAF50" : "#2196F3"))

    legend
      .append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text((d) => d)
  }, [alpha, beta, alpha2, beta2])

  const handleZoomIn = () => setScale((prevScale) => Math.min(prevScale * 1.2, 5))
  const handleZoomOut = () => setScale((prevScale) => Math.max(prevScale / 1.2, 0.5))
  const handleResetZoom = () => setScale(1)

  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-white rounded-lg shadow-md">
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
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" />
      </div>
    </div>
  )
}
