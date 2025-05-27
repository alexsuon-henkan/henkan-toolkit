"use client"

import { Sidebar } from "../../components/Sidebar"
import { Footer } from "../../components/Footer"

export default function SampleSizeCalculator() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16 mt-16">
        <main className="flex-1 p-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl mb-2">Sample Size Calculator</h2>
            <p className="text-gray-600">This calculator is coming soon!</p>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
