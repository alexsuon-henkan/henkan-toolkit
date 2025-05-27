"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import SankeyDiagram from "./SankeyDiagram"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Wand2 } from "lucide-react"
import { parseInput, type SankeyData } from "../utils/parseInput"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SankeyFAQModal } from "./SankeyFAQModal"
import { toast } from "sonner"
import type React from "react" // Added import for React

const SAMPLE_SANKEY_DATA = `Gross Income(Total Income), Net Income(After Tax), 5000
Net Income(After Tax), Expenses(Living Costs), 3000
Net Income(After Tax), Savings(Long Term), 2000
Expenses(Living Costs), Housing(Rent), 1500
Expenses(Living Costs), Food(Groceries), 800
Expenses(Living Costs), Utilities(Bills), 500
Savings(Long Term), Emergency Fund(Rainy Day), 500
Savings(Long Term), Retirement(401k), 1500`

export default function SankeyTool() {
  const [input, setInput] = useState(SAMPLE_SANKEY_DATA)
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [diagramKey, setDiagramKey] = useState<number>(0)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value
    setInput(newInput)
    updateData(newInput)
  }, [])

  const updateData = useCallback((inputData: string) => {
    setError(null)
    try {
      const data = parseInput(inputData)
      setSankeyData(data)
      setDiagramKey((prev) => prev + 1)
    } catch (err) {
      setError("Please check your input format")
      setSankeyData(null)
    }
  }, [])

  const generateSampleData = () => {
    setInput(SAMPLE_SANKEY_DATA)
    updateData(SAMPLE_SANKEY_DATA)
    toast.success("Sample data generated for Sankey Diagram!")
  }

  useEffect(() => {
    updateData(SAMPLE_SANKEY_DATA)
  }, [updateData])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div id="sankey-diagram-generator-content">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Sankey Diagram Generator</h1>
          <p className="text-gray-600 mb-4">Generate Sankey diagrams from your data</p>
          <div className="flex justify-center items-center space-x-4">
            <SankeyFAQModal />
            <Button
              onClick={generateSampleData}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try Sankey Demo
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="sankeyInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your Sankey data (format: source(display name), target(display name), value)
                </label>
                <Textarea
                  id="sankeyInput"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={SAMPLE_SANKEY_DATA}
                  className="h-48 font-mono border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                />
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">New Input Format:</h4>
                <p className="text-sm text-gray-700">
                  Each line should contain: source(display name), target(display name), and value. The display name in
                  brackets is optional. If not provided, the name outside the brackets will be used for both calculation
                  and display. For example: "Housing(Rent), Utilities(Bills), 500" will show "Rent" and "Bills" in the
                  diagram, but use "Housing" and "Utilities" for calculations.
                </p>
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
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">How to Use This Sankey Diagram Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li className="text-gray-700">
                Enter your data in the provided textarea using the format: "source(display name), target(display name),
                value" (one flow per line).
              </li>
              <li className="text-gray-700">
                Click the "Try Sankey Demo" button to see an example of properly formatted data.
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
                  question: "What are Sankey diagrams used for?",
                  answer:
                    "Sankey diagrams are used to visualize the flow of resources, energy, materials, or any other quantity through a system. They're particularly useful for identifying major contributions to an overall flow.",
                },
                {
                  question: "How do I interpret a Sankey diagram?",
                  answer:
                    "In a Sankey diagram, the width of the arrows (links) is proportional to the quantity of flow. Wider arrows represent larger quantities. The diagram reads from left to right, showing how the initial quantity is distributed across different categories or stages.",
                },
                {
                  question: "Can I customize the colors of my Sankey diagram?",
                  answer:
                    "The current version uses a predefined color scheme. Future updates may include options for custom color palettes.",
                },
                {
                  question: "Is there a limit to how much data I can input?",
                  answer:
                    "While there's no strict limit, very large datasets may impact performance. For optimal visualization, we recommend keeping your data to a manageable size, typically under 50 entries for Sankey diagrams.",
                },
                {
                  question: "Can I export or save my generated Sankey diagram?",
                  answer:
                    "Currently, you can use your browser's screenshot functionality to capture the diagram. We're working on adding direct export features in future updates.",
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
