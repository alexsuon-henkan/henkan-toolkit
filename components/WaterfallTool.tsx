"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import WaterfallChart from "./WaterfallChart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Wand2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { WaterfallFAQModal } from "./WaterfallFAQModal"
import { toast } from "sonner"

const SAMPLE_WATERFALL_DATA = `Starting Balance,1000
Revenue,500
Expenses,-300
Taxes,-100
Investments,-200
Ending Balance,900`

export default function WaterfallTool() {
  const [input, setInput] = useState(SAMPLE_WATERFALL_DATA) // Update 1: Initial state of input
  const [waterfallData, setWaterfallData] = useState<{ name: string; value: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value
    setInput(newInput)
    updateData(newInput)
  }, [])

  const updateData = useCallback((inputData: string) => {
    setError(null)
    try {
      const data = inputData
        .trim()
        .split("\n")
        .map((line) => {
          const [name, value] = line.split(",")
          return { name: name.trim(), value: Number.parseFloat(value.trim()) }
        })
      setWaterfallData(data)
    } catch (err) {
      setError("Please check your input format")
      setWaterfallData([])
    }
  }, [])

  const generateSampleData = () => {
    setInput(SAMPLE_WATERFALL_DATA)
    updateData(SAMPLE_WATERFALL_DATA)
    toast.success("Sample data generated for Waterfall Chart!")
  }

  useEffect(() => {
    updateData(SAMPLE_WATERFALL_DATA) // Update 2: useEffect now calls updateData with SAMPLE_WATERFALL_DATA
  }, [updateData])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div id="waterfall-chart-generator-content">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Waterfall Chart Generator</h1>
          <p className="text-gray-600 mb-4">Generate Waterfall charts from your data</p>
          <div className="flex justify-center items-center space-x-4">
            <WaterfallFAQModal />
            <Button
              onClick={generateSampleData}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try Waterfall Demo
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">How to Use This Waterfall Chart Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li className="text-gray-700">
                Enter your data in the provided textarea using the format: "name, value" (one item per line).
              </li>
              <li className="text-gray-700">
                Click the "Try Waterfall Demo" button to see an example of properly formatted data.
              </li>
              <li className="text-gray-700">The chart will automatically update as you enter or modify your data.</li>
              <li className="text-gray-700">Use the zoom controls to adjust the view of your chart if needed.</li>
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
                  term: "Waterfall Chart",
                  definition:
                    "A chart that shows how an initial value is affected by a series of intermediate positive or negative values.",
                },
                {
                  term: "Initial Value",
                  definition:
                    "The starting point of the waterfall chart, typically representing a beginning balance or total.",
                },
                {
                  term: "Intermediate Values",
                  definition: "The positive or negative values that contribute to changes in the initial value.",
                },
                {
                  term: "Final Value",
                  definition:
                    "The ending point of the waterfall chart, showing the result after all intermediate values have been applied.",
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
                  question: "What are Waterfall charts used for?",
                  answer:
                    "Waterfall charts are used to show how an initial value is affected by a series of positive or negative values. They're particularly useful for visualizing financial data, such as how a starting balance changes over time due to various incomes and expenses.",
                },
                {
                  question: "How do I read a Waterfall chart?",
                  answer:
                    "A Waterfall chart starts with an initial value and then shows a series of changes (positive or negative) that lead to a final value. Each bar represents a change, with increases typically shown in green and decreases in red. The final bar usually represents the ending total.",
                },
                {
                  question: "Can I customize the colors of my Waterfall chart?",
                  answer:
                    "The current version uses a predefined color scheme. Future updates may include options for custom color palettes.",
                },
                {
                  question: "Is there a limit to how much data I can input?",
                  answer:
                    "While there's no strict limit, very large datasets may impact performance. For optimal visualization, we recommend keeping your data to a manageable size, typically under 20 entries for Waterfall charts.",
                },
                {
                  question: "Can I export or save my generated Waterfall chart?",
                  answer:
                    "Currently, you can use your browser's screenshot functionality to capture the chart. We're working on adding direct export features in future updates.",
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
