"use client"

import type { User } from "@/types"
import { gameLogic } from "@/lib/game-logic"
import { Settings } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  user: User
  onOpenSettings: () => void
}

export const Header = ({ user, onOpenSettings }: HeaderProps) => {
  const { level, currentXP, xpForNext } = gameLogic.calculateLevel(user.xp)
  const { rank, title, icon } = gameLogic.calculateRank(user.totalEarned)
  const xpProgress = (currentXP / xpForNext) * 100

  const displayName = user.firstName + (user.lastName ? ` ${user.lastName}` : "")
  
  // Use Firebase avatar or generate one based on name
  const avatarUrl = user.avatarUrl || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.replace(/\s+/g, "+"))}&background=4CAF50&color=fff&size=140`

  return (
    <header className="bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-lg border-2 border-green-500/40 rounded-2xl p-5 sm:p-6 mt-3 sm:mt-4 shadow-xl shadow-green-500/20 mx-2">
      <div className="flex items-center gap-5 sm:gap-6 mb-5 sm:mb-6">
        {/* Avatar */}
        <div className="relative">
          <Image
            src={avatarUrl || "/placeholder.svg"}
            alt="User Avatar"
            width={40}
            height={40}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full border-3 border-green-500 shadow-xl shadow-green-500/60 transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white font-display truncate">{displayName}</h2>
          {/* Displaying balance here as requested */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold">{gameLogic.formatNumber(user.balance)}</span>
            <p className="text-lg sm:text-xl md:text-2xl text-green-400 font-bold">UC</p>
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-blue-500/25 border-2 border-blue-500/40 rounded-xl flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <Settings className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9" />
        </button>
      </div>

      {/* XP Progress */}
      <div>
        <div className="flex justify-between text-base sm:text-lg text-gray-300 mb-3 sm:mb-4">
          <span className="font-semibold">Level {level}</span>
          <span className="font-semibold">
            {currentXP} / {xpForNext} XP
          </span>
        </div>
        <div className="w-full h-4 sm:h-5 md:h-6 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600/50 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${xpProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/40 animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  )
}
