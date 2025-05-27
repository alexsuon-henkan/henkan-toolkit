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

export function DiagramFAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Diagram Generator FAQ</DialogTitle>
          <DialogDescription>Understanding the Diagram Generator</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">What is this tool for?</h3>
              <p>
                This tool allows you to generate both Sankey diagrams and Waterfall charts from your input data. These
                visualizations are useful for displaying flows and changes in values over time or across categories.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How do I use it?</h3>
              <p>To use the Diagram Generator:</p>
              <ol className="list-decimal list-inside pl-4 space-y-2">
                <li>Choose the type of diagram you want to create (Sankey or Waterfall)</li>
                <li>Enter your data in the specified format for each diagram type</li>
                <li>The diagram will automatically generate based on your input</li>
                <li>Use the zoom controls to adjust the view if needed</li>
              </ol>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What do the results show?</h3>
              <p>The generated diagrams show:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>For Sankey diagrams: Flows between nodes, with arrow widths proportional to flow quantity</li>
                <li>
                  For Waterfall charts: How an initial value changes through a series of positive or negative values
                </li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What's the "Try Demo Data" feature?</h3>
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
