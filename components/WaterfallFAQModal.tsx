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

export function WaterfallFAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Waterfall Chart Generator FAQ</DialogTitle>
          <DialogDescription>Understanding the Waterfall Chart Generator</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">What is this tool for?</h3>
              <p>
                This tool allows you to generate Waterfall charts from your input data. Waterfall charts are useful for
                visualizing how an initial value is affected by a series of positive or negative values, making them
                ideal for financial statements or budget analysis.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How do I use it?</h3>
              <p>To use the Waterfall Chart Generator:</p>
              <ol className="list-decimal list-inside pl-4 space-y-2">
                <li>Enter your data in the specified format (name, value per line)</li>
                <li>The chart will automatically generate based on your input</li>
                <li>Use the zoom controls to adjust the view if needed</li>
              </ol>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What do the results show?</h3>
              <p>The generated Waterfall chart shows:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>How an initial value changes through a series of positive or negative values</li>
                <li>Increases are typically shown in green, decreases in red</li>
                <li>The final bar represents the ending total after all changes</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What's the "Try Waterfall Demo" feature?</h3>
              <p>
                This feature populates the input field with sample data, allowing you to see how the tool works without
                entering your own data. It's perfect for learning how to format your data and interpret the results.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
