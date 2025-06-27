"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "What is an A/B test?",
    answer:
      "An A/B test is a randomized experiment with two variants, A and B, which are the control and treatment in the experiment. It's a way to compare two versions of a single variable to determine which performs better for a given goal.",
  },
  {
    question: "How long should I run my A/B test?",
    answer:
      "The duration of an A/B test depends on several factors, including your sample size, the expected effect size, and your desired confidence level. Generally, it's recommended to run tests for at least two weeks and until you reach statistical significance.",
  },
  {
    question: "What does statistical significance mean in A/B testing?",
    answer:
      "Statistical significance in A/B testing means that the difference observed between variations is likely not due to random chance. Typically, a result is considered statistically significant if the p-value is less than 0.05 (5% significance level).",
  },
  {
    question: "Can I test more than two variations?",
    answer:
      "Yes, you can test more than two variations. This is often called A/B/n testing or multivariate testing. However, testing multiple variations requires larger sample sizes and may take longer to reach statistical significance.",
  },
  {
    question: "How do I interpret the results of my A/B test?",
    answer:
      "To interpret your A/B test results, look at the confidence level and lift. If the confidence level is above 95% and there's a positive lift, you can be reasonably confident that the variation outperforms the control. Always consider practical significance alongside statistical significance.",
  },
]

export function ABTestFAQModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <HelpCircle className="w-4 h-4 mr-2" />
          A/B Test FAQs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>A/B Test Frequently Asked Questions</DialogTitle>
          <DialogDescription>Common questions about A/B testing and how to use this calculator.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  )
}
