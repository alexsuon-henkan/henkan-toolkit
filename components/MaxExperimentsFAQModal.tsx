import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function MaxExperimentsFAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>FAQ: Maximum Experiments Calculator</DialogTitle>
          <DialogDescription>Frequently asked questions about calculating A/B testing capacity</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-medium text-lg">How does this calculator work?</h3>
            <p className="text-gray-600 mt-1">
              This calculator uses a statistical formula to determine the sample size needed for each A/B test, then
              divides your total annual traffic by this sample size to estimate how many tests you can run sequentially.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">What is Minimum Detectable Effect (MDE)?</h3>
            <p className="text-gray-600 mt-1">
              The Minimum Detectable Effect is the smallest relative change in your conversion rate that you want to be
              able to detect with confidence. For example, if your conversion rate is 5% and you set an MDE of 10%,
              you're looking to detect an absolute change of 0.5 percentage points (either 4.5% or 5.5%).
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">Why does the number of tests decrease when my MDE decreases?</h3>
            <p className="text-gray-600 mt-1">
              The smaller the effect you want to detect, the larger sample size you need to detect it with confidence.
              Therefore, each test requires more traffic, which reduces the total number of tests you can run with your
              available traffic.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">Can I run tests in parallel?</h3>
            <p className="text-gray-600 mt-1">
              Yes, you can run tests in parallel if they target different parts of your site or different user segments
              without overlap. This calculator assumes sequential testing, so if you run tests in parallel, your testing
              capacity could be higher.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">What statistical assumptions does this calculator use?</h3>
            <p className="text-gray-600 mt-1">
              This calculator uses a 95% confidence level and 80% statistical power, which is standard in the industry.
              It uses the standard formula for comparing two proportions, which is appropriate for conversion rate
              testing.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">How can I increase my testing capacity?</h3>
            <p className="text-gray-600 mt-1">You can increase your testing capacity by:</p>
            <ul className="list-disc pl-5 mt-1 text-gray-600">
              <li>Increasing your traffic (marketing, SEO, etc.)</li>
              <li>Targeting segments with higher conversion rates</li>
              <li>Testing larger changes (higher MDE)</li>
              <li>Accepting lower confidence or power for some tests</li>
              <li>Running tests in parallel on different parts of your site</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg">Does this calculator account for seasonality?</h3>
            <p className="text-gray-600 mt-1">
              No, this calculator uses a constant average daily traffic. In practice, you should account for seasonal
              variations and avoid launching tests during atypical periods (like holidays or major promotions).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
