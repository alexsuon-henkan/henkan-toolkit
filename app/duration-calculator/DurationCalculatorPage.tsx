"use client"

import { Sidebar } from "../../components/Sidebar"
import { Footer } from "../../components/Footer"
import DurationCalculator from "../../components/DurationCalculator"

export default function DurationCalculatorPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16">
        <main className="flex-1 p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto">
              <DurationCalculator />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
