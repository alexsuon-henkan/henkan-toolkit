"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface WaterfallData {
  name: string
  value: number
}

interface WaterfallChartProps {
  data: WaterfallData[]
  width?: number
  height?: number
}

export default function WaterfallChart({ data, width = 800, height = 600 }: WaterfallChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Calculate cumulative values
    let cumulative = 0
    const cumulativeData = data.map((d, i) => {
      const start = cumulative
      cumulative += d.value
      return {
        name: d.name,
        start: start,
        end: cumulative,
        value: d.value,
        isTotal: i === data.length - 1,
      }
    })

    // Set up scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.3)

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(0, d3.max(cumulativeData, (d) => d.end) as number)])
      .range([innerHeight, 0])

    // Draw bars
    g.selectAll(".bar")
      .data(cumulativeData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name) as number)
      .attr("y", (d) => (d.value >= 0 ? yScale(d.end) : yScale(d.start)))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => Math.abs(yScale(d.start) - yScale(d.end)))
      .attr("fill", (d, i) => {
        if (i === 0 || i === data.length - 1) return "#3B82F6" // Blue for start and end
        return d.value >= 0 ? "#66BB6A" : "#EF5350" // Green for positive, red for negative
      })

    // Draw connecting lines
    g.selectAll(".connector")
      .data(cumulativeData.slice(0, -1))
      .enter()
      .append("line")
      .attr("class", "connector")
      .attr("x1", (d) => (xScale(d.name) as number) + xScale.bandwidth())
      .attr("y1", (d) => yScale(d.end))
      .attr("x2", (d, i) => xScale(cumulativeData[i + 1].name) as number)
      .attr("y2", (d) => yScale(d.end))
      .attr("stroke", "#999")
      .attr("stroke-dasharray", "4")

    // Add labels
    g.selectAll(".label")
      .data(cumulativeData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (xScale(d.name) as number) + xScale.bandwidth() / 2)
      .attr("y", (d) => (d.value >= 0 ? yScale(d.end) - 5 : yScale(d.start) + 15))
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .text((d) => d.value.toLocaleString())

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")

    // Add y-axis
    g.append("g").call(d3.axisLeft(yScale))

    // Add y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - innerHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value")

    // Add legend
    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(["Start/End", "Increase", "Decrease"])
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`)

    legend
      .append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", (d) => {
        if (d === "Start/End") return "#3B82F6"
        if (d === "Increase") return "#66BB6A"
        return "#EF5350"
      })

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text((d) => d)
  }, [data, width, height])

  const handleZoomIn = () => setScale((prevScale) => Math.min(prevScale * 1.2, 5))
  const handleZoomOut = () => setScale((prevScale) => Math.max(prevScale / 1.2, 0.5))
  const handleResetZoom = () => setScale(1)

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
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
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="w-full h-full"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  )
}
