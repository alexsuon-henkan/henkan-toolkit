"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-serif text-xl text-[#4CAF50]">Henkan Toolkit</span>
          </Link>
          <div className="flex items-center space-x-4">
            <a href="https://forms.gle/cXLVg45KjbVCqoxu8" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Give Feedback
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
