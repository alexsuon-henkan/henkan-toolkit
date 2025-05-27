"use client"

import { useState } from "react"
import { toast } from "sonner"
import BaselineMetrics from "./BaselineMetrics"
import TestResults from "./TestResults"
import SeasonalityAdjustment from "./SeasonalityAdjustment"
import DecayAdjustment from "./DecayAdjustment"
import Results from "./Results"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { FAQModal } from "./FAQModal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const initialData = {
  monthlyTraffic: 0,
  conversionRate: 0,
  aov: 0,
  upliftPercentage: 0,
  testStartDate: new Date().toISOString().slice(0, 7),
  trafficAdjustments: {},
  monthlyConversionRates: {},
  decay: {
    threeMonths: 10,
    sixMonths: 20,
    twelveMonths: 30,
  },
}

export default function RevenueCalculator() {
  const [step, setStep] = useState(1)
  const [calculationData, setCalculationData] = useState(initialData)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleNextStep = () => {
    if (step === 4) {
      if (!validateCalculationData(calculationData)) {
        toast.error("Please correct the errors before proceeding.")
        return
      }
    }
    setStep((prevStep) => Math.min(prevStep + 1, 5))
  }

  const handlePrevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1))
  }

  const updateCalculationData = (newData: Partial<typeof initialData>) => {
    setCalculationData((prevData) => ({ ...prevData, ...newData }))
  }

  const handleDemoMode = () => {
    try {
      setCalculationData({
        monthlyTraffic: 100000,
        conversionRate: 2.5,
        aov: 50,
        upliftPercentage: 5,
        testStartDate: new Date().toISOString().slice(0, 7),
        trafficAdjustments: {
          January: 0,
          February: 5,
          March: 10,
          April: 15,
          May: 20,
          June: 25,
          July: 30,
          August: 25,
          September: 20,
          October: 15,
          November: 10,
          December: 5,
        },
        monthlyConversionRates: {
          January: 2.3,
          February: 2.4,
          March: 2.5,
          April: 2.6,
          May: 2.7,
          June: 2.8,
          July: 2.9,
          August: 3.0,
          September: 2.9,
          October: 2.8,
          November: 2.7,
          December: 2.6,
        },
        decay: {
          threeMonths: 10,
          sixMonths: 20,
          twelveMonths: 30,
        },
      })
      setIsDemoMode(true)
      setStep(5) // Go directly to results step
      toast.success("Demo data generated for Revenue Calculator!", {
        duration: 4000,
      })
    } catch (error) {
      console.error("Error generating demo data:", error)
      toast.error("Failed to generate demo data")
    }
  }

  const validateCalculationData = (data: typeof initialData) => {
    const newErrors: Record<string, string> = {}

    if (data.monthlyTraffic <= 0) {
      newErrors.monthlyTraffic = "Monthly traffic must be greater than zero."
    }
    if (data.conversionRate <= 0 || data.conversionRate > 100) {
      newErrors.conversionRate = "Conversion rate must be between 0 and 100."
    }
    if (data.aov <= 0) {
      newErrors.aov = "Average order value must be greater than zero."
    }
    if (data.upliftPercentage <= -100 || data.upliftPercentage >= 100) {
      newErrors.upliftPercentage = "Uplift percentage must be between -100 and 100."
    }
    if (data.testStartDate === "") {
      newErrors.testStartDate = "Please select a test start date."
    }
    if (Object.keys(data.trafficAdjustments).length !== 12) {
      newErrors.trafficAdjustments = "Please provide traffic adjustments for all 12 months."
    }
    if (Object.keys(data.monthlyConversionRates).length !== 12) {
      newErrors.monthlyConversionRates = "Please provide conversion rates for all 12 months."
    }
    if (Object.values(data.trafficAdjustments).some((value) => isNaN(value))) {
      newErrors.trafficAdjustments = "Traffic adjustments must be valid numbers."
    }
    if (Object.values(data.monthlyConversionRates).some((value) => isNaN(value))) {
      newErrors.monthlyConversionRates = "Conversion rates must be valid numbers."
    }
    if (
      data.decay.threeMonths < 0 ||
      data.decay.threeMonths > 100 ||
      data.decay.sixMonths < 0 ||
      data.decay.sixMonths > 100 ||
      data.decay.twelveMonths < 0 ||
      data.decay.twelveMonths > 100
    ) {
      newErrors.decay = "Decay values must be between 0 and 100."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const steps = [
    {
      name: "Baseline Metrics",
      description:
        "Enter your current monthly traffic, conversion rate, and average order value to establish your baseline revenue.",
    },
    {
      name: "Test Results",
      description: "Input your A/B test uplift percentage and the date when you started the test.",
    },
    {
      name: "Seasonality",
      description:
        "Adjust for monthly traffic variations and conversion rates. You can use industry presets or enter custom values.",
    },
    {
      name: "Decay",
      description:
        "Account for how the test impact might decrease over time. Adjust the decay percentages for different time periods.",
    },
    {
      name: "Results",
      description: "Review your complete analysis with projected revenue impact and detailed monthly breakdowns.",
    },
  ]

  const renderStep = (errors: Record<string, string>) => {
    switch (step) {
      case 1:
        return <BaselineMetrics data={calculationData} updateData={updateCalculationData} errors={errors} />
      case 2:
        return <TestResults data={calculationData} updateData={updateCalculationData} errors={errors} />
      case 3:
        return <SeasonalityAdjustment data={calculationData} updateData={updateCalculationData} errors={errors} />
      case 4:
        return <DecayAdjustment data={calculationData} updateData={updateCalculationData} errors={errors} />
      case 5:
        return <Results data={calculationData} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div id="revenue-calculator-content">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Revenue Calculator</h1>
          <p className="text-gray-600 mb-4">Calculate the long-term revenue impact of your A/B test results</p>
          <div className="flex justify-center items-center space-x-4">
            <FAQModal />
            <Button
              onClick={handleDemoMode}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isDemoMode ? "Regenerate Revenue Demo" : "Try Revenue Demo"}
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-12 py-6">
              <div className="flex items-center justify-center space-x-4 mb-6">
                {steps.map((stepInfo, index) => (
                  <div key={stepInfo.name} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step > index
                          ? "bg-[#4CAF50] text-white"
                          : step === index + 1
                            ? "border-2 border-[#4CAF50] text-[#4CAF50]"
                            : "border-2 border-gray-200 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 ${step > index + 1 ? "bg-[#4CAF50]" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">{steps[step - 1].name}</h3>
                <p className="text-sm text-gray-600">{steps[step - 1].description}</p>
              </div>
            </div>

            {Object.values(errors).length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">There were errors with your submission</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {renderStep(errors)}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                >
                  Previous Step
                </Button>
              )}
              {step < 5 && (
                <Button onClick={handleNextStep} className="ml-auto bg-[#4CAF50] text-white hover:bg-[#45a049]">
                  Next Step
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">How to Use This Revenue Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li className="text-gray-700">
                Enter your baseline metrics: monthly traffic, conversion rate, and average order value.
              </li>
              <li className="text-gray-700">
                Input your A/B test results, including the uplift percentage and test start date.
              </li>
              <li className="text-gray-700">
                Adjust for seasonality by entering monthly traffic variations and conversion rates.
              </li>
              <li className="text-gray-700">
                Set decay percentages to account for the diminishing impact of your test over time.
              </li>
              <li className="text-gray-700">
                Review the projected revenue impact and detailed monthly breakdowns in the results section.
              </li>
              <li className="text-gray-700">
                Use the "Try Demo Mode" button to see how the calculator works with sample data.
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
                  term: "Baseline Metrics",
                  definition: "Your current performance metrics before implementing A/B test changes.",
                },
                {
                  term: "Uplift Percentage",
                  definition: "The percentage improvement observed in your A/B test variant compared to the control.",
                },
                {
                  term: "Seasonality",
                  definition: "Monthly variations in traffic and conversion rates due to seasonal factors.",
                },
                {
                  term: "Decay",
                  definition: "The gradual decrease in the effectiveness of your A/B test changes over time.",
                },
                {
                  term: "Incremental Revenue",
                  definition: "Additional revenue generated as a result of implementing your A/B test changes.",
                },
                {
                  term: "Cumulative Revenue",
                  definition: "Total additional revenue accumulated over time from your A/B test changes.",
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
                  question: "What is the Revenue Calculator?",
                  answer:
                    "The Revenue Calculator is a tool that helps you estimate the long-term revenue impact of your A/B test results, taking into account factors like seasonality and performance decay.",
                },
                {
                  question: "How does the calculatoraccount for seasonality?",
                  answer:
                    "The calculator allows you to input monthly traffic adjustments and conversion rates, reflecting seasonal variations in your business. This helps provide more accurate revenue projections throughout the year.",
                },
                {
                  question: "What is performance decay and why is it important?",
                  answer:
                    "Performance decay refers to the gradual decrease in the effectiveness of your A/B test changes over time. It's important because the initial revenue uplift from a test often diminishes as users become accustomed to the changes or as market conditions evolve.",
                },
                {
                  question: "How far into the future does the calculator project revenue?",
                  answer:
                    "The calculator provides revenue projections for 3, 6, and 12 months after implementing your A/B test changes. This allows you to see both short-term and long-term revenue impacts of your A/B test results.",
                },
                {
                  question: "Can I use this calculator for multiple A/B tests?",
                  answer:
                    "While the calculator is designed to analyze one A/B test at a time, you can use it multiple times for different tests. This allows you to compare the potential long-term revenue impact of various tests and prioritize implementation based on projected results.",
                },
                {
                  question: "How accurate are the revenue projections from this calculator?",
                  answer:
                    "The accuracy of the revenue projections depends on the quality of the input data and the stability of your business environment. While the calculator provides valuable insights, it's important to remember that these are estimates and should be used in conjunction with other business metrics and decision-making processes.",
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
