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

export function DurationFAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>A/B Test Duration Calculator FAQ</DialogTitle>
          <DialogDescription>Understanding the A/B Test Duration Calculator</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">What is this calculator for?</h3>
              <p>
                This calculator helps you determine the sample size and duration required for your A/B test, considering
                factors like daily traffic, conversion rate, and desired minimum detectable effect (MDE).
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How do I use it?</h3>
              <p>
                Enter your daily visitors, current conversion rate, number of variations, and select a test objective.
                The calculator will provide you with the required sample size and test duration.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What do the results mean?</h3>
              <p>The calculator provides:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Test Duration: The number of days you need to run your test</li>
                <li>Sample Size per Variation: The number of visitors needed for each variation</li>
                <li>Total Sample Size: The total number of visitors needed for all variations</li>
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
