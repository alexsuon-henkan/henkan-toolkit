"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as d3 from "d3"
import { sankey, sankeyLinkHorizontal } from "d3-sankey"
import type { SankeyData } from "../utils/parseInput"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react"

interface SankeyNode extends d3.SankeyNode<SankeyNode, SankeyLink> {
  category?: string
  displayName: string
}

interface SankeyLink extends d3.SankeyLink<SankeyNode, SankeyLink> {}

interface SankeyProps {
  data: SankeyData
  width?: number
  height?: number
  diagramKey: number
}

export default function SankeyDiagram({ data, width = 800, height = 600, diagramKey }: SankeyProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [scale, setScale] = useState(1)
  const [isDraggable, setIsDraggable] = useState(false)

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 10, right: 30, bottom: 10, left: 30 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "sankey-container")

    // Create the Sankey generator
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])

    // Generate the Sankey data
    const sankeyData = sankeyGenerator({
      nodes: data.nodes.map((node) => ({
        ...node,
        name: node.name,
        displayName: node.displayName,
      })),
      links: data.links,
    })

    // Color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(sankeyData.nodes.map((d) => d.name))
      .range(d3.schemeCategory10)

    // Add links
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(sankeyData.links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("fill", "none")
      .attr("stroke", (d) => colorScale(d.source.name) as string)
      .attr("stroke-width", (d) => Math.max(1, d.width))
      .attr("opacity", 0.7)
      .style("mix-blend-mode", "multiply")

    // Add nodes
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("rect")
      .data(sankeyData.nodes)
      .join("rect")
      .attr("x", (d) => d.x0!)
      .attr("y", (d) => d.y0!)
      .attr("height", (d) => d.y1! - d.y0!)
      .attr("width", (d) => d.x1! - d.x0!)
      .attr("fill", (d) => colorScale(d.name) as string)
      .attr("opacity", 0.8)

    // Add labels
    const label = g
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(sankeyData.nodes)
      .join("text")
      .attr("x", (d) => (d.x0! < innerWidth / 2 ? d.x1! + 6 : d.x0! - 6))
      .attr("y", (d) => (d.y1! + d.y0!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0! < innerWidth / 2 ? "start" : "end"))
      .text((d) => {
        // Ensure we're using the displayName from the node data
        return d.displayName || d.name
      })
      .attr("font-size", "10px")
      .attr("fill", "currentColor")

    // Implement drag behavior
    const dragBehavior = d3
      .drag<SVGRectElement, SankeyNode>()
      .subject((event, d) => ({ y: d.y0! }))
      .on("start", function () {
        d3.select(this).attr("opacity", 0.5)
      })
      .on("drag", function (event, d) {
        const yPos = Math.max(0, Math.min(height - (d.y1! - d.y0!), event.y))
        d3.select(this).attr("y", yPos)
        d.y0 = yPos
        d.y1 = yPos + (d.y1! - d.y0!)
        sankeyGenerator.update(sankeyData)
        link.attr("d", sankeyLinkHorizontal())
        label.attr("y", (d) => (d.y1! + d.y0!) / 2)
      })
      .on("end", function () {
        d3.select(this).attr("opacity", 0.8)
      })

    // Apply or remove drag behavior based on isDraggable state
    if (isDraggable) {
      node.call(dragBehavior)
    } else {
      node.on(".drag", null)
    }
  }, [data, width, height, isDraggable])

  const handleZoomIn = () => setScale((prevScale) => Math.min(prevScale * 1.2, 5))
  const handleZoomOut = () => setScale((prevScale) => Math.max(prevScale / 1.2, 0.5))
  const handleResetZoom = () => setScale(1)
  const toggleDraggable = useCallback(() => {
    setIsDraggable((prev) => !prev)
  }, [])

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
        <Button
          size="icon"
          variant={isDraggable ? "default" : "outline"}
          onClick={toggleDraggable}
          aria-label={isDraggable ? "Disable dragging" : "Enable dragging"}
        >
          <Move className="h-4 w-4" />
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
