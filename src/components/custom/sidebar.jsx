import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Settings, Users } from "lucide-react"

const iconMap = {
  Home: Home,
  Users: Users,
  Settings: Settings,
  // Add more icons here as needed
}

export default function Sidebar({ options = [] }) {
  return (
    <div className="flex flex-col bg-slate-950 text-white w-64">
      <div className="flex items-center p-4">
        <div className="w-8 h-8 rounded-full bg-primary" />
        <span className="ml-2 text-lg font-bold">Logo</span>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {options.map((option, index) => (
          <NavItem key={index} icon={option.icon} label={option.label} />
        ))}
      </nav>
    </div>
  )
}

function NavItem({ icon, label }) {
  const IconComponent = iconMap[icon] || Home // Default to Home icon if not found

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-white hover:bg-slate-800"
    >
      <IconComponent className="h-4 w-4" />
      <span className="ml-2">{label}</span>
    </Button>
  )
}