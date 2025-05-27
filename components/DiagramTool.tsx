"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import SankeyDiagram from "./SankeyDiagram"
import WaterfallChart from "./WaterfallChart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Wand2 } from "lucide-react"
import { parseInput, type SankeyData } from "../utils/parseInput"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DiagramFAQModal } from "./DiagramFAQModal"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SAMPLE_SANKEY_DATA = `Gross Income, Net Income, Expenses, Housing, 1500
Gross Income, Net Income, Expenses, Food, 800
Gross Income, Net Income, Savings, Emergency Fund, 500
Gross Income, Net Income, Savings, Retirement, 700
Gross Income, Net Income, Expenses, Transportation, 400
Gross Income, Net Income, Expenses, Entertainment, 300
Gross Income, Net Income, Expenses, Utilities, 500
Gross Income, Net Income, Expenses, Insurance, 300`

const SAMPLE_WATERFALL_DATA = `Starting Balance,1000
Revenue,500
Expenses,-300
Taxes,-100
Investments,-200
Ending Balance,900`

export default function DiagramTool() {
  const [input, setInput] = useState("")
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null)
  const [waterfallData, setWaterfallData] = useState<{ name: string; value: number }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [diagramKey, setDiagramKey] = useState<number>(0)
  const [activeTab, setActiveTab] = useState("sankey")

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newInput = e.target.value
      setInput(newInput)
      updateData(newInput, activeTab)
    },
    [activeTab],
  )

  const updateData = useCallback((inputData: string, tab: string) => {
    setError(null)
    try {
      if (tab === "sankey") {
        const data = parseInput(inputData)
        setSankeyData(data)
        setWaterfallData([])
      } else {
        const data = inputData
          .trim()
          .split("\n")
          .map((line) => {
            const [name, value] = line.split(",")
            return { name: name.trim(), value: Number.parseFloat(value.trim()) }
          })
        setWaterfallData(data)
        setSankeyData(null)
      }
      setDiagramKey((prev) => prev + 1)
    } catch (err) {
      setError("Please check your input format")
      setSankeyData(null)
      setWaterfallData([])
    }
  }, [])

  const generateSampleData = () => {
    const sampleData = activeTab === "sankey" ? SAMPLE_SANKEY_DATA : SAMPLE_WATERFALL_DATA
    setInput(sampleData)
    updateData(sampleData, activeTab)
    toast.success(`Sample data generated for ${activeTab === "sankey" ? "Sankey Diagram" : "Waterfall Chart"}!`)
  }

  useEffect(() => {
    updateData(input, activeTab)
  }, [input, activeTab, updateData])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div id="diagram-generator-content">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Diagram Generator</h1>
          <p className="text-gray-600 mb-4">Generate Sankey diagrams and Waterfall charts from your data</p>
          <div className="flex justify-center items-center space-x-4">
            <DiagramFAQModal />
            <Button
              onClick={generateSampleData}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try Demo Data
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="sankey">Sankey Diagram</TabsTrigger>
                <TabsTrigger value="waterfall">Waterfall Chart</TabsTrigger>
              </TabsList>
              <TabsContent value="sankey">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="sankeyInput" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter your Sankey data (one flow per line)
                    </label>
                    <Textarea
                      id="sankeyInput"
                      value={input}
                      onChange={handleInputChange}
                      placeholder={SAMPLE_SANKEY_DATA}
                      className="h-48 font-mono border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {sankeyData && (
                    <div className="mt-8">
                      <Card>
                        <CardHeader>
                          <CardTitle className="font-serif text-2xl">Generated Sankey Diagram</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="w-full h-[600px]">
                            <SankeyDiagram data={sankeyData} width={800} height={600} diagramKey={diagramKey} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="waterfall">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="waterfallInput" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter your Waterfall data (name, value per line)
                    </label>
                    <Textarea
                      id="waterfallInput"
                      value={input}
                      onChange={handleInputChange}
                      placeholder={SAMPLE_WATERFALL_DATA}
                      className="h-48 font-mono border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {waterfallData.length > 0 && (
                    <div className="mt-8">
                      <Card>
                        <CardHeader>
                          <CardTitle className="font-serif text-2xl">Generated Waterfall Chart</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="w-full h-[600px]">
                            <WaterfallChart data={waterfallData} width={800} height={600} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">How to Use This Diagram Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li className="text-gray-700">
                Choose the type of diagram you want to create: Sankey Diagram or Waterfall Chart.
              </li>
              <li className="text-gray-700">
                Enter your data in the provided textarea using the specified format for each diagram type.
              </li>
              <li className="text-gray-700">
                For Sankey Diagram: Enter data as "source, target, value" (one flow per line).
              </li>
              <li className="text-gray-700">For Waterfall Chart: Enter data as "name, value" (one item per line).</li>
              <li className="text-gray-700">
                Click the "Try Demo Data" button to see an example of properly formatted data.
              </li>
              <li className="text-gray-700">The diagram will automatically update as you enter or modify your data.</li>
              <li className="text-gray-700">Use the zoom controls to adjust the view of your diagram if needed.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Key Terms and Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              {[
                {
                  term: "Sankey Diagram",
                  definition:
                    "A type of flow diagram where the width of the arrows is proportional to the flow quantity.",
                },
                {
                  term: "Waterfall Chart",
                  definition:
                    "A chart that shows how an initial value is affected by a series of intermediate positive or negative values.",
                },
                {
                  term: "Node",
                  definition: "A point in the Sankey diagram representing a stage or category in the flow.",
                },
                {
                  term: "Link",
                  definition: "An arrow connecting nodes in a Sankey diagram, representing the flow between them.",
                },
                {
                  term: "Flow Value",
                  definition: "The quantity of flow in a Sankey diagram, represented by the width of the link.",
                },
                {
                  term: "Cumulative Value",
                  definition: "In a Waterfall chart, the running total after each item's value is applied.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <dt className="font-medium text-[#4CAF50] mb-1">{item.term}</dt>
                  <dd className="text-gray-700">{item.definition}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "What are Sankey diagrams and Waterfall charts used for?",
                  answer:
                    "Sankey diagrams are used to visualize the flow of resources, energy, materials, or any other quantity through a system. They're particularly useful for identifying major contributions to an overall flow. Waterfall charts are used to show how an initial value is affected by a series of positive or negative values, making them ideal for financial statements or budget analysis.",
                },
                {
                  question: "How do I interpret a Sankey diagram?",
                  answer:
                    "In a Sankey diagram, the width of the arrows (links) is proportional to the quantity of flow. Wider arrows represent larger quantities. The diagram reads from left to right, showing how the initial quantity is distributed across different categories or stages.",
                },
                {
                  question: "How do I read a Waterfall chart?",
                  answer:
                    "A Waterfall chart starts with an initial value and then shows a series of changes (positive or negative) that lead to a final value. Each bar represents a change, with increases typically shown in green and decreases in red. The final bar usually represents the ending total.",
                },
                {
                  question: "Can I customize the colors of my diagrams?",
                  answer:
                    "The current version uses a predefined color scheme. Future updates may include options for custom color palettes.",
                },
                {
                  question: "Is there a limit to how much data I can input?",
                  answer:
                    "While there's no strict limit, very large datasets may impact performance. For optimal visualization, we recommend keeping your data to a manageable size, typically under 50 entries for Sankey diagrams and under 20 for Waterfall charts.",
                },
                {
                  question: "Can I export or save my generated diagrams?",
                  answer:
                    "Currently, you can use your browser's screenshot functionality to capture the diagrams. We're working on adding direct export features in future updates.",
                },
              ].map((item, index) => (
                <AccordionItem
                  value={`item-${index + 1}`}
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <AccordionTrigger className="text-left font-medium text-gray-700 hover:text-[#4CAF50]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
