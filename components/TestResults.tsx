import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestResults({ data, updateData }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateData({ [name]: name === "upliftPercentage" ? Number.parseFloat(value) || 0 : value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="upliftPercentage" className="text-sm font-medium mb-1">
          Uplift Percentage (%)
        </Label>
        <Input
          id="upliftPercentage"
          name="upliftPercentage"
          type="number"
          step="0.01"
          value={data.upliftPercentage}
          onChange={handleInputChange}
          className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="testStartDate" className="text-sm font-medium mb-1">
          Test Start Date
        </Label>
        <Input
          id="testStartDate"
          name="testStartDate"
          type="month"
          value={data.testStartDate}
          onChange={handleInputChange}
          className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
        />
      </div>
    </div>
  )
}
