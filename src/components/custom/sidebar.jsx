'use client'
import React from "react"
import { Dumbbell, HomeIcon, SettingsIcon, UsersIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { createClient } from "@/utils/supabase/client"

const options = [
  { icon: HomeIcon, label: "Home", href: "/" },
  { icon: UsersIcon, label: "Members", href: "/members" }
]


export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push('/login');
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="min-w-[220px] flex flex-col h-screen bg-background border-r">
      <div className="flex items-center p-4 border-b h-18">
        <Link href="/" className="flex items-center w-full gap-2 font-semibold">
          <Dumbbell />
          <span>Fitbull Gym</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="flex-1 space-y-1 p-4 w-full text-sm">
          {options.map((option, index) => {
            const Icon = option.icon
            const label = option.label
            const href = option.href
            return (
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${href === pathname ? "text-foreground bg-muted" : 'text-muted-foreground'} transition-all hover:text-primary`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
      <nav className="space-y-1 p-4 w-full text-sm border-t cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary`}
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 ml-5">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  )
}