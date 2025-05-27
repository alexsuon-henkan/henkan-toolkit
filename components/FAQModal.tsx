import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function FAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>A/B Testing Revenue Calculator FAQ</DialogTitle>
          <DialogDescription>Understanding the A/B Testing Revenue Calculator</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">What is this calculator for?</h3>
              <p>
                This calculator helps you estimate the potential revenue impact of your A/B test results over time,
                considering factors like seasonality and performance decay.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How does it work?</h3>
              <p>The calculator takes you through 5 steps:</p>
              <ol className="list-decimal list-inside pl-4 space-y-2">
                <li>
                  <strong>Baseline Metrics:</strong> Enter your current traffic, conversion rate, and average order
                  value.
                </li>
                <li>
                  <strong>Test Results:</strong> Input your A/B test uplift and start date.
                </li>
                <li>
                  <strong>Seasonality:</strong> Adjust for monthly traffic variations and conversion rates.
                </li>
                <li>
                  <strong>Decay:</strong> Account for the diminishing impact of your test over time.
                </li>
                <li>
                  <strong>Results:</strong> View projected incremental revenue and conversions.
                </li>
              </ol>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What do the results mean?</h3>
              <p>The calculator provides estimates for:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Incremental revenue and conversions over 3, 6, and 12 months</li>
                <li>Monthly traffic analysis comparing baseline and adjusted figures</li>
                <li>Revenue impact trends showing incremental and cumulative revenue</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How accurate is this calculator?</h3>
              <p>
                While this calculator provides valuable insights, it's important to note that it's based on projections
                and assumptions. Real-world results may vary due to unforeseen factors. Use these estimates as a guide,
                not as guaranteed outcomes.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What's the "Try Demo Mode" feature?</h3>
              <p>
                This feature populates the calculator with realistic sample data, allowing you to explore its
                functionality without entering your own data. It's a great way to understand how the calculator works
                before using it with your actual test results.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
