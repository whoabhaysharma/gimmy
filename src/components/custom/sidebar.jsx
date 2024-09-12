'use client'
import React from "react"
import { Dumbbell, HomeIcon, UsersIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const options = [
  { icon: HomeIcon, label: "Home", href: "/" },
  { icon: UsersIcon, label: "Members", href: "/members" }
]


export default function Sidebar() {
  const pathname = usePathname()

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
    </div>
  )
}

// function NavItem({ icon, label, isActive }) {
//   const IconComponent = iconMap[icon] // Default to Home icon if not found

//   return (
//     <Button
//       className={`w-full justify-start ${isActive ? 'bg-foreground text-background' : 'bg-background text-foreground'} shadow-none border-2 border-foreground/10 hover:bg-foreground/70 hover:text-background`}
//     >
//       {IconComponent}
//       <span className="ml-2">{label}</span>
//     </Button>
//   )
// }