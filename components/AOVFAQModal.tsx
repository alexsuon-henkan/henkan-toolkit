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

export function AOVFAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>AOV Calculator FAQ</DialogTitle>
          <DialogDescription>Understanding the AOV Calculator</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">What is this calculator for?</h3>
              <p>
                This calculator helps you determine if there's a statistically significant difference in Average Order
                Value (AOV) between two groups using the Mann-Whitney U test. It's particularly useful for A/B testing
                scenarios where you want to compare the AOV of a control group versus a variant group.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How do I use it?</h3>
              <p>
                Simply input the AOV values for your control group and variant group, separated by commas. The
                calculator will perform the Mann-Whitney U test and provide you with results including:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Mean AOV for both groups</li>
                <li>Percent difference between the groups</li>
                <li>Statistical significance of the difference</li>
                <li>U-statistic and p-value</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What do the results mean?</h3>
              <p>The calculator provides:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Mean AOV for control and variant groups</li>
                <li>Percent difference in AOV</li>
                <li>Whether the difference is statistically significant (based on a 0.05 significance level)</li>
                <li>The U-statistic and p-value from the Mann-Whitney U test</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What's the "Try AOV Demo" feature?</h3>
              <p>
                This feature populates the calculator with sample AOV data, allowing you to see how it works without
                entering your own data. It's perfect for learning how to interpret the results.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
