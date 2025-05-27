"use client"

import { Sidebar } from "../../components/Sidebar"
import { Footer } from "../../components/Footer"
import ABTestCalculator from "../../components/ABTestCalculator"

export default function ABTestingCalculatorPage() {
  // const { isOpen } = useSidebar()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16 mt-16">
        <main className="flex-1 p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto text-center mb-16 px-4 sm:px-6 lg:px-8">
              <h1 className="font-serif text-3xl sm:text-4xl mb-4">A/B Test Calculator</h1>
            </div>
            <ABTestCalculator />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
