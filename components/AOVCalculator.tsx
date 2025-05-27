"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Wand2, Upload } from "lucide-react"
import { toast } from "sonner"
import { AOVFAQModal } from "./AOVFAQModal"
import { calculateMannWhitneyU } from "@/utils/statistics"
import { parseCSV } from "@/utils/csvParser"

export default function AOVCalculator() {
  const [controlValues, setControlValues] = useState<string>("")
  const [variantValues, setVariantValues] = useState<string>("")
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    setError(null)
    setResults(null)

    const controlArray = controlValues
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n))
    const variantArray = variantValues
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n))

    if (controlArray.length === 0 || variantArray.length === 0) {
      setError("Please enter valid numeric values for both control and variant groups.")
      return
    }

    try {
      const { U, criticalU, z, p, significant } = calculateMannWhitneyU(controlArray, variantArray)
      const controlMean = controlArray.reduce((a, b) => a + b, 0) / controlArray.length
      const variantMean = variantArray.reduce((a, b) => a + b, 0) / variantArray.length
      const percentDifference = ((variantMean - controlMean) / controlMean) * 100

      setResults({
        controlMean,
        variantMean,
        percentDifference,
        U,
        criticalU,
        z,
        p,
        significant,
      })
    } catch (err) {
      setError("An error occurred while calculating results. Please check your input values.")
    }
  }

  const handleDemoMode = () => {
    try {
      setControlValues("50,55,60,65,70,75,80,85,90,95")
      setVariantValues("60,65,70,75,80,85,90,95,100,105")
      toast.success("Demo data generated for AOV Calculator!")
    } catch (error) {
      console.error("Error generating demo data:", error)
      toast.error("Failed to generate demo data")
    }
  }

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, group: "control" | "variant") => {
      const file = event.target.files?.[0]
      if (file) {
        try {
          const content = await file.text()
          const parsedData = parseCSV(content)
          const values = parsedData.join(",")
          if (group === "control") {
            setControlValues(values)
          } else {
            setVariantValues(values)
          }
          toast.success(`${group.charAt(0).toUpperCase() + group.slice(1)} data uploaded successfully!`)
        } catch (error) {
          console.error(`Error parsing ${group} CSV:`, error)
          toast.error(`Failed to parse ${group} CSV file. Please check the file format.`)
        }
      }
    },
    [],
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div id="aov-calculator-content">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">AOV Calculator</h1>
          <p className="text-gray-600 mb-4">
            Calculate the significance of AOV differences using the Mann-Whitney U test
          </p>
          <div className="flex justify-center items-center space-x-4">
            <AOVFAQModal />
            <Button
              onClick={handleDemoMode}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try AOV Demo
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <Label htmlFor="controlValues" className="text-sm font-medium mb-1">
                  Control Group AOV Values
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="controlValues"
                    value={controlValues}
                    onChange={(e) => setControlValues(e.target.value)}
                    placeholder="Enter comma-separated values (e.g., 50,55,60,65,70)"
                    className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                  />
                  <Label htmlFor="controlFileUpload" className="cursor-pointer">
                    <Input
                      id="controlFileUpload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "control")}
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </Label>
                </div>
              </div>
              <div>
                <Label htmlFor="variantValues" className="text-sm font-medium mb-1">
                  Variant Group AOV Values
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="variantValues"
                    value={variantValues}
                    onChange={(e) => setVariantValues(e.target.value)}
                    placeholder="Enter comma-separated values (e.g., 55,60,65,70,75)"
                    className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                  />
                  <Label htmlFor="variantFileUpload" className="cursor-pointer">
                    <Input
                      id="variantFileUpload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "variant")}
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </Label>
                </div>
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full bg-[#4CAF50] text-white hover:bg-[#45a049]">
              Calculate AOV Significance
            </Button>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {results && (
              <div className="mt-8 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-serif text-xl mb-4">Results Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Control AOV</span>
                      <span className="text-lg">${results.controlMean.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Variant AOV</span>
                      <span className="text-lg">${results.variantMean.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Percent Difference</span>
                      <span className={`text-lg ${results.percentDifference > 0 ? "text-green-600" : "text-red-600"}`}>
                        {results.percentDifference > 0 ? "+" : ""}
                        {results.percentDifference.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">U-value</span>
                      <span className="text-lg">{results.U}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Critical U-value</span>
                      <span className="text-lg">{results.criticalU}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Z-score</span>
                      <span className="text-lg">{results.z.toFixed(5)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">P-value</span>
                      <span className="text-lg">{results.p.toFixed(5)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="font-medium">Statistically Significant</span>
                      <span className={`text-lg ${results.significant ? "text-green-600" : "text-red-600"}`}>
                        {results.significant ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    The Mann-Whitney U test {results.significant ? "shows" : "does not show"} a statistically
                    significant difference between the control and variant groups (U = {results.U}, critical U ={" "}
                    {results.criticalU}, z = {results.z.toFixed(5)}, p = {results.p.toFixed(5)}).
                    {results.significant
                      ? " This suggests that the observed difference in AOV is likely not due to random chance."
                      : " This suggests that the observed difference in AOV might be due to random variation."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">How to Use This AOV Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li className="text-gray-700">Enter the AOV values for your control group, separated by commas.</li>
              <li className="text-gray-700">Enter the AOV values for your variant group, separated by commas.</li>
              <li className="text-gray-700">Click the "Calculate AOV Significance" button to see the results.</li>
              <li className="text-gray-700">Review the Results Summary for an overview of your test outcomes.</li>
              <li className="text-gray-700">
                Check the statistical significance to determine if the AOV difference is meaningful.
              </li>
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
                  term: "AOV (Average Order Value)",
                  definition: "The average amount spent each time a customer places an order on a website or store.",
                },
                {
                  term: "Mann-Whitney U Test",
                  definition:
                    "A non-parametric test used to determine whether there is a statistically significant difference between two groups of an independent variable on a continuous or ordinal dependent variable.",
                },
                {
                  term: "Statistical Significance",
                  definition:
                    "The likelihood that a relationship between two or more variables is caused by something other than chance.",
                },
                {
                  term: "P-value",
                  definition:
                    "The probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true.",
                },
                {
                  term: "Two-tailed Test",
                  definition:
                    "A statistical test in which the critical area of a distribution is two-sided and tests whether a sample is greater than or less than a certain range of values.",
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
                  question: "Why use the Mann-Whitney U test for AOV?",
                  answer:
                    "The Mann-Whitney U test is used for AOV because it doesn't assume a normal distribution of data, making it suitable for comparing AOVs which often have skewed distributions.",
                },
                {
                  question: "What does a p-value less than 0.05 mean?",
                  answer:
                    "A p-value less than 0.05 indicates strong evidence against the null hypothesis, suggesting that the difference in AOV between the control and variant groups is statistically significant.",
                },
                {
                  question: "How many AOV values should I input for each group?",
                  answer:
                    "There's no strict minimum, but generally, the more data points you have, the more reliable your results will be. Aim for at least 20-30 values per group for more robust results.",
                },
                {
                  question: "What if my AOV values aren't normally distributed?",
                  answer:
                    "That's okay! The Mann-Whitney U test is non-parametric, meaning it doesn't assume a normal distribution. It's suitable for comparing AOVs even when the data is skewed.",
                },
                {
                  question: "Can I use this calculator for other metrics besides AOV?",
                  answer:
                    "Yes, you can use this calculator for any continuous or ordinal data where you want to compare two independent groups. However, interpret the results in the context of your specific metric.",
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
