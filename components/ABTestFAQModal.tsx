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

export function ABTestFAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>A/B Testing Calculator FAQ</DialogTitle>
          <DialogDescription>Understanding the A/B Testing Calculator</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">What is this calculator for?</h3>
              <p>
                This calculator helps you determine if your A/B test results are statistically significant and
                calculates the potential impact of implementing the winning variation.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How do I use it?</h3>
              <p>Simply input the following data for both your control (A) and variant (B) groups:</p>
              <ol className="list-decimal list-inside pl-4 space-y-2">
                <li>Number of participants in each group</li>
                <li>Number of conversions for each group</li>
              </ol>
              <p className="mt-2">The calculator will automatically compute:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Conversion rates for both variations</li>
                <li>Statistical significance</li>
                <li>Confidence level</li>
                <li>Relative improvement</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What do the results mean?</h3>
              <p>The calculator provides:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Conversion rates for both variations</li>
                <li>Statistical significance (95% confidence level is typically considered significant)</li>
                <li>Visual distribution of results</li>
                <li>Improvement metrics and recommendations</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What's the "Try Demo Mode" feature?</h3>
              <p>
                This feature populates the calculator with sample data, allowing you to see how it works without
                entering your own data. It's perfect for learning how to interpret the results.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
