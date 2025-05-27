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

export function SankeyFAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Sankey Diagram Generator FAQ</DialogTitle>
          <DialogDescription>Understanding the Sankey Diagram Generator</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">What is this tool for?</h3>
              <p>
                This tool allows you to generate multi-level Sankey diagrams from your input data. Sankey diagrams are
                useful for visualizing the flow of resources, energy, materials, or any other quantity through a system.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How do I use it?</h3>
              <p>To use the Sankey Diagram Generator:</p>
              <ol className="list-decimal list-inside pl-4 space-y-2">
                <li>Enter your data in the format: source1, source2, ..., targetN, value (one flow per line)</li>
                <li>Click the "Generate Diagram" button</li>
                <li>View your generated Sankey diagram</li>
                <li>Use the zoom controls to adjust the view if needed</li>
              </ol>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What do the results show?</h3>
              <p>The generated Sankey diagram shows:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Nodes representing stages or categories in your data</li>
                <li>Links (arrows) between nodes showing the flow</li>
                <li>The width of links proportional to the flow quantity</li>
                <li>Multiple levels of flow if present in your data</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What's the "Try Sankey Demo" feature?</h3>
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
