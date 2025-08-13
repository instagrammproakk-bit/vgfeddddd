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
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t-2 border-green-500/40 p-4 sm:p-5 md:p-6 z-50 shadow-2xl shadow-green-500/10 min-h-[100px] sm:min-h-[110px] md:min-h-[120px]">
      <div className="flex justify-around items-center gap-2 sm:gap-3 md:gap-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center gap-2 sm:gap-2.5 p-4 sm:p-5 md:p-6 rounded-xl transition-all duration-300 flex-1 max-w-[90px] sm:max-w-[100px] md:max-w-[110px] relative group ${
                isActive
                  ? "text-green-400 bg-green-500/20 border-2 border-green-500/50 shadow-lg shadow-green-500/30 scale-110"
                  : "text-gray-400 hover:text-green-400 hover:scale-105 hover:bg-gray-800/40"
              }`}
            >
              {isActive && (
                <div className="absolute -top-2 sm:-top-2.5 left-1/2 transform -translate-x-1/2 w-6 sm:w-7 h-2 sm:h-2.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />
              )}
              <Icon className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
              <span className="text-sm sm:text-base md:text-lg font-semibold uppercase tracking-wide">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
