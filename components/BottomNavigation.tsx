"use client"

import { Hand, Rocket, Target, Wallet, Users } from "lucide-react"

interface BottomNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export const BottomNavigation = ({ activeSection, onSectionChange }: BottomNavigationProps) => {
  const navItems = [
    { id: "tap", label: "Tap", icon: Hand },
    { id: "boost", label: "Boost", icon: Rocket },
    { id: "missions", label: "Missions", icon: Target },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "friends", label: "Friends", icon: Users },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t-2 border-green-500/40 p-3 sm:p-4 md:p-5 z-50 shadow-2xl shadow-green-500/10 min-h-[80px] sm:min-h-[90px] md:min-h-[100px]">
      <div className="flex justify-around items-center gap-1 sm:gap-2 md:gap-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center gap-1 sm:gap-1.5 p-3 sm:p-3.5 md:p-4 rounded-lg transition-all duration-300 flex-1 max-w-[80px] sm:max-w-[90px] md:max-w-[100px] relative group ${
                isActive
                  ? "text-green-400 bg-green-500/15 border border-green-500/40 shadow-lg shadow-green-500/20 scale-110"
                  : "text-gray-400 hover:text-green-400 hover:scale-105 hover:bg-gray-800/30"
              }`}
            >
              {isActive && (
                <div className="absolute -top-1.5 sm:-top-2 left-1/2 transform -translate-x-1/2 w-5 sm:w-6 h-1.5 sm:h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />
              )}
              <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
