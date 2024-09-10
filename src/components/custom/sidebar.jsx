'use client'
import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Settings, Users } from "lucide-react"
import { usePathname } from "next/navigation"

const iconMap = {
  Home: Home,
  Users: Users,
  Settings: Settings,
  // Add more icons here as needed
}

export default function Sidebar({ options = [] }) {
  const pathname = usePathname()
  console.log(pathname, 'PATHNALE')
  return (
    <div className="flex flex-col w-full h-screen bg-background shadow-lg">
      <div className="flex items-center p-4">
        <div className="w-8 h-8 rounded-full bg-primary" />
        <span className="ml-2 text-lg font-bold">Logo</span>
      </div>
      <nav className="flex-1 space-y-1 p-4 w-full">
        {options.map((option, index) => (
          <NavItem key={index} icon={option.icon} label={option.label} isActive={option.href === pathname} />
        ))}
      </nav>
    </div>
  )
}

function NavItem({ icon, label, isActive }) {
  const IconComponent = iconMap[icon] // Default to Home icon if not found

  return (
    <Button
      className={`w-full justify-start ${isActive ? 'bg-foreground text-background' : 'bg-background text-foreground'} shadow-none border-2 border-foreground/10 hover:bg-foreground/70 hover:text-background`}
    >
      {IconComponent}
      <span className="ml-2">{label}</span>
    </Button>
  )
}