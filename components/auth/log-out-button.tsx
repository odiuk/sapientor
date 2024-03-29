"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { LogOut } from "lucide-react"

import { Database } from "@/lib/database.types"

import { DropdownMenuItem } from "../ui/dropdown-menu"

export const LogOutButton = () => {
  const supabase = createClientComponentClient<Database>()
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut().then(() => {
        window.location.replace("/")
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <DropdownMenuItem className="flex justify-between" onClick={handleSignOut}>
      <span>Logout</span>
      <LogOut size={16} className="ml-2" />
    </DropdownMenuItem>
  )
}
