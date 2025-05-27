import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BaselineMetrics({ data, updateData }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateData({ [name]: Number.parseFloat(value) || 0 })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="monthlyTraffic" className="text-sm font-medium mb-1">
          Monthly Traffic
        </Label>
        <Input
          id="monthlyTraffic"
          name="monthlyTraffic"
          type="number"
          value={data.monthlyTraffic}
          onChange={handleInputChange}
          className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conversionRate" className="text-sm font-medium mb-1">
          Conversion Rate (%)
        </Label>
        <Input
          id="conversionRate"
          name="conversionRate"
          type="number"
          step="0.01"
          value={data.conversionRate}
          onChange={handleInputChange}
          className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="aov" className="text-sm font-medium mb-1">
          Average Order Value
        </Label>
        <Input
          id="aov"
          name="aov"
          type="number"
          step="0.01"
          value={data.aov}
          onChange={handleInputChange}
          className="border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
        />
      </div>
    </div>
  )
}
