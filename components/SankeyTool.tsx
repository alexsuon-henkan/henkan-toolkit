"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import SankeyDiagram, { type SankeyTheme } from "./SankeyDiagram"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Wand2, Palette } from "lucide-react"
import { parseInput, type SankeyData } from "../utils/parseInput"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SankeyFAQModal } from "./SankeyFAQModal"
import { toast } from "sonner"
import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const SAMPLE_SANKEY_DATA = `Gross Income(Total Income), Net Income(After Tax), 5000
Net Income(After Tax), Expenses(Living Costs), 3000
Net Income(After Tax), Savings(Long Term), 2000
Expenses(Living Costs), Housing(Rent), 1500
Expenses(Living Costs), Food(Groceries), 800
Expenses(Living Costs), Utilities(Bills), 500
Savings(Long Term), Emergency Fund(Rainy Day), 500
Savings(Long Term), Retirement(401k), 1500`

const THEME_OPTIONS: { value: SankeyTheme; label: string }[] = [
  { value: "mckinsey", label: "McKinsey Style" },
  { value: "bcg", label: "BCG Style" },
  { value: "bain", label: "Bain Style" },
  { value: "classic", label: "Classic D3" },
]

export default function SankeyTool() {
  const [input, setInput] = useState(SAMPLE_SANKEY_DATA)
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [diagramKey, setDiagramKey] = useState<number>(0)
  const [selectedTheme, setSelectedTheme] = useState<SankeyTheme>("mckinsey")

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
      setError("Please check your input format.")
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

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value as SankeyTheme)
    setDiagramKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6">
      <div id="sankey-diagram-generator-content">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="font-serif text-3xl">Sankey Diagram Generator</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
              Updated
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate customizable Sankey diagrams from your data with multiple color themes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <SankeyFAQModal />
            <Button
              onClick={generateSampleData}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-500 dark:hover:text-gray-900"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try Sankey Demo
            </Button>
          </div>
        </div>

        <Card className="border-gray-200 dark:border-gray-700 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Data Input Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="sankeyInput"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Enter your data:
                    </Label>
                    <Textarea
                      id="sankeyInput"
                      value={input}
                      onChange={handleInputChange}
                      placeholder={SAMPLE_SANKEY_DATA}
                      className="h-48 font-mono border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="themeSelector"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Choose Color Theme:
                    </Label>
                    <Select value={selectedTheme} onValueChange={handleThemeChange}>
                      <SelectTrigger
                        id="themeSelector"
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <Palette className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <SelectValue placeholder="Choose a theme" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800">
                        {THEME_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Data Format:</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Format:{" "}
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">
                        source(display), target(display), value
                      </code>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Display names in parentheses are optional. Example: "Housing(Rent), Utilities(Bills), 500"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {sankeyData && (
              <div className="mt-8">
                <Card className="border-gray-200 dark:border-gray-700 shadow-md">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl text-gray-800 dark:text-gray-100">
                      Generated Sankey Diagram
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <SankeyDiagram
                        key={diagramKey}
                        data={sankeyData}
                        width={800}
                        height={600}
                        theme={selectedTheme}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="font-serif text-2xl dark:text-gray-100">How to Use This Generator</CardTitle>
          </CardHeader>
          <CardContent className="dark:text-gray-300">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                Enter your data in the text area using the format: "source(display name), target(display name), value"
                (one flow per line).
              </li>
              <li>Click "Try Sankey Demo" to see an example of properly formatted data.</li>
              <li>The diagram will automatically update as you enter or modify your data.</li>
              <li>Use the zoom and drag controls to adjust the view of your diagram if needed.</li>
              <li>Choose your preferred color theme using the dropdown menu.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="font-serif text-2xl dark:text-gray-100">Key Terms and Definitions</CardTitle>
          </CardHeader>
          <CardContent className="dark:text-gray-300">
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
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <dt className="font-medium text-[#4CAF50] dark:text-green-500 mb-1">{item.term}</dt>
                  <dd className="text-gray-700 dark:text-gray-300">{item.definition}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="font-serif text-2xl dark:text-gray-100">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="dark:text-gray-300">
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
                    "Yes! You can now choose from multiple color themes including McKinsey, BCG, Bain, and Classic D3 styles using the theme selector.",
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
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <AccordionTrigger className="text-left font-medium text-gray-700 dark:text-gray-300 hover:text-[#4CAF50] dark:hover:text-green-500">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
