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

export function BayesianFAQModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">FAQ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Bayesian A/B Test Calculator FAQ</DialogTitle>
          <DialogDescription>Understanding the Bayesian A/B Test Calculator</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">What is Bayesian A/B testing?</h3>
              <p>
                Bayesian A/B testing is an approach to statistical inference that uses Bayes' theorem to update the
                probability for a hypothesis as more evidence or information becomes available. It allows for
                incorporating prior knowledge and provides a more intuitive interpretation of results compared to
                frequentist methods.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How do I use this calculator?</h3>
              <p>
                Enter the number of participants and conversions for both variations A and B. You can also set prior
                alpha and beta values if you have prior knowledge about the conversion rates. The calculator will then
                provide you with the probability that B outperforms A, the expected lift, and a 95% Highest Density
                Interval (HDI) for the difference in conversion rates.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What do the results mean?</h3>
              <p>
                The calculator provides:
                <ul className="list-disc list-inside pl-4 space-y-2">
                  <li>Probability B &gt; A: The probability that variation B outperforms variation A</li>
                  <li>Expected Lift: The expected percentage improvement of B over A</li>
                  <li>
                    95% HDI: The Highest Density Interval, which is the range where the true difference in conversion
                    rates is most likely to lie
                  </li>
                </ul>
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">What are prior alpha and beta?</h3>
              <p>
                Prior alpha and beta are parameters of the Beta distribution used to represent prior knowledge about the
                conversion rates. If you don't have prior knowledge, you can use 1 for both (which represents a uniform
                prior). Higher values represent stronger prior beliefs.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg">How is this different from frequentist A/B testing?</h3>
              <p>
                Bayesian A/B testing provides direct probabilities about the performance of variations and allows for
                incorporating prior knowledge. It also doesn't rely on p-values or the concept of statistical
                significance, which can be misinterpreted. Instead, it provides a full distribution of possible
                outcomes.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
