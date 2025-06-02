"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as d3 from "d3"
import { sankey, sankeyLinkHorizontal } from "d3-sankey"
import type { SankeyData } from "../utils/parseInput"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, Move, Eye } from "lucide-react"

interface SankeyNode extends d3.SankeyNode<SankeyNode, SankeyLink> {
  category?: string
  displayName: string
}

interface SankeyLink extends d3.SankeyLink<SankeyNode, SankeyLink> {}

export type SankeyTheme = "mckinsey" | "bcg" | "bain" | "classic"

interface SankeyProps {
  data: SankeyData
  width?: number
  height?: number
  theme?: SankeyTheme
}

const THEME_PALETTES: Record<SankeyTheme, string[]> = {
  classic: d3.schemeCategory10,
  mckinsey: [
    "#004488",
    "#0072C6",
    "#4DB8C9",
    "#595959",
    "#A6A6A6",
    "#FF9900",
    "#009966",
    "#D9D9D9",
    "#00AEEF",
    "#7F7F7F",
  ],
  bcg: ["#00A859", "#0064A6", "#595959", "#A6A6A6", "#2D3092", "#F26649", "#FDC62F", "#D9D9D9", "#8DC63F", "#4A4A4A"],
  bain: ["#DA291C", "#005EB8", "#595959", "#A6A6A6", "#00AEEF", "#FFC425", "#009E73", "#D9D9D9", "#231F20", "#7F7F7F"],
}
const NEUTRAL_SINK_COLOR = "#A6A6A6"

export default function SankeyDiagram({ data, width = 800, height = 600, theme = "mckinsey" }: SankeyProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [scale, setScale] = useState(1)
  const [isDraggable, setIsDraggable] = useState(false)
  const [showValues, setShowValues] = useState(true)

  useEffect(() => {
    console.log("SankeyDiagram useEffect triggered. Theme:", theme, "Data nodes:", data?.nodes?.length)

    // Enhanced guard
    if (!svgRef.current || !data || !data.nodes || data.nodes.length === 0 || !data.links) {
      console.warn("SankeyDiagram: Missing svgRef, data, nodes, or links. Skipping render.")
      if (svgRef.current) d3.select(svgRef.current).selectAll("*").remove()
      return
    }

    try {
      const svg = d3.select(svgRef.current)
      svg.selectAll("*").remove()

      const margin = { top: 20, right: 120, bottom: 20, left: 120 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      if (innerWidth <= 0 || innerHeight <= 0) {
        console.error("SankeyDiagram: innerWidth or innerHeight is not positive. Skipping render.", {
          innerWidth,
          innerHeight,
        })
        return
      }

      svg.append("rect").attr("width", width).attr("height", height).attr("fill", "#FFFFFF")

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("class", "sankey-container")

      // Create the sankey generator - removed .nodeId() to use default index-based approach
      const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
        .nodeWidth(18)
        .nodePadding(12)
        .extent([
          [0, 0],
          [innerWidth, innerHeight],
        ])

      // Create copies of the data to avoid mutating the original props
      const nodesCopy = data.nodes.map((n) => ({ ...n }))
      const linksCopy = data.links.map((l) => ({ ...l }))

      console.log("Input nodes:", nodesCopy)
      console.log("Input links:", linksCopy)

      const sankeyLayout = sankeyGenerator({
        nodes: nodesCopy,
        links: linksCopy,
      })

      console.log("Sankey Layout Nodes:", sankeyLayout.nodes)
      console.log("Sankey Layout Links:", sankeyLayout.links)

      // Check for missing coordinates after layout
      sankeyLayout.nodes.forEach((node, i) => {
        if (node.x0 == null || node.x1 == null || node.y0 == null || node.y1 == null) {
          console.error(`Node ${i} ('${node.name}') is missing coordinates after layout:`, node)
        }
      })

      // Determine source and sink nodes for coloring
      const sourceNodeNames = new Set(sankeyLayout.links.map((link: any) => link.source.name))
      const sinkNodeNames = new Set(
        sankeyLayout.nodes.filter((node: any) => !sourceNodeNames.has(node.name)).map((node: any) => node.name),
      )

      const currentPalette = THEME_PALETTES[theme] || THEME_PALETTES.classic

      const nonSinkNodesDomain = sankeyLayout.nodes
        .filter((node: any) => !sinkNodeNames.has(node.name))
        .map((node: any) => node.name)

      const paletteColorScale = d3.scaleOrdinal<string>().domain(nonSinkNodesDomain).range(currentPalette)

      const colorScale = (nodeName: string) => {
        if (sinkNodeNames.has(nodeName)) return NEUTRAL_SINK_COLOR
        return paletteColorScale(nodeName) || NEUTRAL_SINK_COLOR
      }

      // Links
      const link = g
        .append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(sankeyLayout.links)
        .join("path")
        .attr("d", sankeyLinkHorizontal() as any)
        .attr("fill", "none")
        .attr("stroke", (d: any) => colorScale(d.source.name) as string)
        .attr("stroke-width", (d: any) => Math.max(1.5, d.width!))
        .attr("opacity", 0.6)
        .on("mouseover", function (event, d: any) {
          d3.select(this)
            .attr("opacity", 0.9)
            .attr("stroke-width", Math.max(2.5, d.width! + 1))
        })
        .on("mouseout", function (event, d: any) {
          d3.select(this).attr("opacity", 0.6).attr("stroke-width", Math.max(1.5, d.width!))
        })

      link
        .append("title")
        .text(
          (d: any) =>
            `${d.source.displayName || d.source.name} → ${d.target.displayName || d.target.name}: ${d.value.toLocaleString()}`,
        )

      // Nodes
      const node = g.append("g").attr("class", "nodes").selectAll("g").data(sankeyLayout.nodes).join("g")

      node
        .append("rect")
        .attr("x", (d: any) => d.x0 || 0)
        .attr("y", (d: any) => d.y0 || 0)
        .attr("height", (d: any) => Math.max(0, (d.y1 || 0) - (d.y0 || 0)))
        .attr("width", (d: any) => Math.max(0, (d.x1 || 0) - (d.x0 || 0)))
        .attr("fill", (d: any) => colorScale(d.name) as string)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("opacity", 0.9)
        .style(
          "stroke",
          (d: any) =>
            d3
              .color(colorScale(d.name) as string)
              ?.darker(0.5)
              .toString() || "#000000",
        )
        .style("stroke-width", 0.5)
        .on("mouseover", function () {
          d3.select(this).attr("opacity", 1)
        })
        .on("mouseout", function () {
          d3.select(this).attr("opacity", 0.9)
        })

      node.append("title").text((d: any) => `${d.displayName || d.name}: ${d.value?.toLocaleString() || "N/A"}`)

      // Labels
      const labels = g.append("g").attr("class", "labels").selectAll("g").data(sankeyLayout.nodes).join("g")

      labels
        .append("text")
        .attr("x", (d: any) => {
          const x0 = d.x0 || 0
          const x1 = d.x1 || 0
          return x0 < innerWidth / 2 ? x1 + 8 : x0 - 8
        })
        .attr("y", (d: any) => {
          const y0 = d.y0 || 0
          const y1 = d.y1 || 0
          return (y1 + y0) / 2
        })
        .attr("dy", showValues ? "-0.2em" : "0.35em")
        .attr("text-anchor", (d: any) => {
          const x0 = d.x0 || 0
          return x0 < innerWidth / 2 ? "start" : "end"
        })
        .text((d: any) => d.displayName || d.name)
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .attr("fill", "#333333")

      if (showValues) {
        labels
          .append("text")
          .attr("x", (d: any) => {
            const x0 = d.x0 || 0
            const x1 = d.x1 || 0
            return x0 < innerWidth / 2 ? x1 + 8 : x0 - 8
          })
          .attr("y", (d: any) => {
            const y0 = d.y0 || 0
            const y1 = d.y1 || 0
            return (y1 + y0) / 2
          })
          .attr("dy", "1em")
          .attr("text-anchor", (d: any) => {
            const x0 = d.x0 || 0
            return x0 < innerWidth / 2 ? "start" : "end"
          })
          .text((d: any) => `(${d.value?.toLocaleString() || "N/A"})`)
          .attr("font-size", "10px")
          .attr("font-weight", "400")
          .attr("fill", "#595959")
      }

      // Drag behavior
      const dragBehavior = d3
        .drag<SVGRectElement, any>()
        .subject((event, d) => ({ y: d.y0! }))
        .on("start", function () {
          d3.select(this.parentNode as SVGGElement).raise()
          d3.select(this).attr("opacity", 1)
        })
        .on("drag", (event, d) => {
          if (d.y0 == null || d.y1 == null) return
          const yPos = Math.max(0, Math.min(innerHeight - (d.y1 - d.y0), event.y))
          d.y0 = yPos
          d.y1 = yPos + (d.y1 - d.y0)
          sankeyGenerator.update(sankeyLayout)

          // Update node positions
          g.selectAll<SVGRectElement, any>(".nodes g rect")
            .attr("y", (n) => n.y0!)
            .attr("height", (n) => n.y1! - n.y0!)

          // Update link paths
          link.attr("d", sankeyLinkHorizontal() as any)

          // Update label positions
          g.selectAll<SVGGElement, any>(".labels g").each(function (labelNodeDatum) {
            const nodeG = d3.select(this)
            nodeG
              .selectAll<SVGTextElement, any>("text")
              .attr("y", (textDatum) => (labelNodeDatum.y1! + labelNodeDatum.y0!) / 2)
          })
        })
        .on("end", function () {
          d3.select(this).attr("opacity", 0.9)
        })

      if (isDraggable) {
        node.selectAll<SVGRectElement, any>("rect").call(dragBehavior)
      }
    } catch (error) {
      console.error("Sankey diagram rendering error:", error)
      const svg = d3.select(svgRef.current)
      svg.selectAll("*").remove()
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("Erreur lors du rendu du diagramme.")
        .attr("fill", "red")
    }
  }, [data, width, height, isDraggable, showValues, theme])

  const handleZoomIn = () => setScale((prevScale) => Math.min(prevScale * 1.2, 3))
  const handleZoomOut = () => setScale((prevScale) => Math.max(prevScale / 1.2, 0.3))
  const handleResetZoom = () => setScale(1)
  const toggleDraggable = useCallback(() => setIsDraggable((prev) => !prev), [])
  const toggleValues = useCallback(() => setShowValues((prev) => !prev), [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
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
        <Button
          size="icon"
          variant={showValues ? "default" : "outline"}
          onClick={toggleValues}
          aria-label={showValues ? "Hide values" : "Show values"}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="w-full h-full"
        style={{ transform: `scale(${scale})`, transformOrigin: "center", transition: "transform 0.2s ease-out" }}
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
