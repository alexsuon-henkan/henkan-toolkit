"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const useCases = [
  { id: "ab_testing", label: "🧪 A/B Testing", decay: { threeMonths: 20, sixMonths: 40, twelveMonths: 60 } },
  { id: "bug_fix", label: "🐞 Bug Fix", decay: { threeMonths: 10, sixMonths: 20, twelveMonths: 35 } },
  { id: "feature_launch", label: "✨ Feature Launch", decay: { threeMonths: 25, sixMonths: 50, twelveMonths: 75 } },
  {
    id: "seasonal_campaign",
    label: "🎄 Seasonal Campaign",
    decay: { threeMonths: 60, sixMonths: 85, twelveMonths: 100 },
  },
  {
    id: "marketing_experiment",
    label: "📈 Marketing Experiment",
    decay: { threeMonths: 30, sixMonths: 65, twelveMonths: 90 },
  },
  { id: "content_updates", label: "📚 Content Updates", decay: { threeMonths: 15, sixMonths: 35, twelveMonths: 50 } },
  { id: "pricing_change", label: "💰 Pricing Change", decay: { threeMonths: 30, sixMonths: 60, twelveMonths: 85 } },
]

export default function DecayAdjustment({ data, updateData }) {
  const [selectedUseCase, setSelectedUseCase] = useState(null)

  // Ensure decay object is properly initialized
  const decay = data.decay || { threeMonths: 0, sixMonths: 0, twelveMonths: 0 }

  const handleDecayChange = (period, value) => {
    updateData({ decay: { ...decay, [period]: value[0] } })
  }

  const handleUseCaseClick = (useCase) => {
    setSelectedUseCase(useCase.id)
    updateData({
      decay: {
        threeMonths: useCase.decay.threeMonths,
        sixMonths: useCase.decay.sixMonths,
        twelveMonths: useCase.decay.twelveMonths,
      },
    })
  }

  const resetDecayValues = () => {
    if (selectedUseCase) {
      const selectedUseCaseData = useCases.find((uc) => uc.id === selectedUseCase)
      updateData({
        decay: {
          threeMonths: selectedUseCaseData.decay.threeMonths,
          sixMonths: selectedUseCaseData.decay.sixMonths,
          twelveMonths: selectedUseCaseData.decay.twelveMonths,
        },
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="font-serif text-2xl mb-6 text-center">Decay Adjustment</h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Select Your Use Case to Auto-Fill Decay Values:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {useCases.map((useCase) => (
            <Button
              key={useCase.id}
              onClick={() => handleUseCaseClick(useCase)}
              variant={selectedUseCase === useCase.id ? "default" : "outline"}
              className="w-full"
            >
              {useCase.label}
            </Button>
          ))}
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="decay-3-months" className="text-gray-700 mb-2 block">
                  3 Months Decay: {decay.threeMonths}%
                </Label>
                <Slider
                  id="decay-3-months"
                  min={0}
                  max={100}
                  step={1}
                  value={[decay.threeMonths]}
                  onValueChange={(value) => handleDecayChange("threeMonths", value)}
                  className="[&_[role=slider]]:bg-[#76B95B] [&_[role=slider]]:border-[#76B95B] [&_[role=slider]]:focus:ring-[#76B95B]"
                />
              </div>
              <div>
                <Label htmlFor="decay-6-months" className="text-gray-700 mb-2 block">
                  6 Months Decay: {decay.sixMonths}%
                </Label>
                <Slider
                  id="decay-6-months"
                  min={0}
                  max={100}
                  step={1}
                  value={[decay.sixMonths]}
                  onValueChange={(value) => handleDecayChange("sixMonths", value)}
                  className="[&_[role=slider]]:bg-[#76B95B] [&_[role=slider]]:border-[#76B95B] [&_[role=slider]]:focus:ring-[#76B95B]"
                />
              </div>
              <div>
                <Label htmlFor="decay-12-months" className="text-gray-700 mb-2 block">
                  12 Months Decay: {decay.twelveMonths}%
                </Label>
                <Slider
                  id="decay-12-months"
                  min={0}
                  max={100}
                  step={1}
                  value={[decay.twelveMonths]}
                  onValueChange={(value) => handleDecayChange("twelveMonths", value)}
                  className="[&_[role=slider]]:bg-[#76B95B] [&_[role=slider]]:border-[#76B95B] [&_[role=slider]]:focus:ring-[#76B95B]"
                />
              </div>
            </div>
          </div>
          <Button onClick={resetDecayValues} variant="outline" className="mt-6 w-full">
            Reset Decay Values
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
