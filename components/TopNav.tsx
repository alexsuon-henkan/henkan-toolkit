"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { supabase } from "@/utils/supabase"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, User, MessageSquare } from "lucide-react"

const BOSS_USERNAME = "Alex The Creator"

export function TopNav() {
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-serif text-xl text-[#4CAF50]">
              {user && user.user_metadata.display_name === BOSS_USERNAME ? "Boss Mode Activated" : "Henkan Toolkit"}
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-[#4CAF50] hover:bg-[#45a049]">
                        <User className="mr-2 h-4 w-4" />
                        {user.user_metadata.display_name || user.email} <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="w-full cursor-pointer">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-[#4CAF50] hover:bg-[#45a049]">
                        <User className="mr-2 h-4 w-4" />
                        My Account <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="w-full cursor-pointer">
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/signup" className="w-full cursor-pointer">
                          Sign Up
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <a href="https://forms.gle/cXLVg45KjbVCqoxu8" target="_blank" rel="noopener noreferrer">
          <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full shadow-lg">
            <MessageSquare className="mr-2 h-4 w-4" />
            Give Feedback
          </Button>
        </a>
      </div>
    </nav>
  )
}
