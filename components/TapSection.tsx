"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import type { User } from "@/types"
import { gameLogic } from "@/lib/game-logic"
import Image from "next/image"

interface TapSectionProps {
  user: User
  onTap: (event?: React.MouseEvent | React.TouchEvent) => any
  onOpenRank: () => void
}

export const TapSection = ({ user, onTap, onOpenRank }: TapSectionProps) => {
  const [tapEffects, setTapEffects] = useState<
    Array<{ id: number; x: number; y: number; amount: number; type: string }>
  >([])
  const [isPressed, setIsPressed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const effectIdRef = useRef(0)

  const energyPercentage = (user.tapsLeft / user.energyLimit) * 100
  const { rank, icon } = gameLogic.calculateRank(user.totalEarned)

  const handleTapStart = useCallback(() => {
    setIsPressed(true)
  }, [])

  const handleTapEnd = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleTap = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault()

      const result = onTap(event)

      if (result?.success) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          let clientX, clientY

          if ("clientX" in event) {
            clientX = event.clientX
            clientY = event.clientY
          } else if (event.touches && event.touches[0]) {
            clientX = event.touches[0].clientX
            clientY = event.touches[0].clientY
          } else {
            clientX = rect.left + rect.width / 2
            clientY = rect.top + rect.height / 2
          }

          const x = clientX - rect.left
          const y = clientY - rect.top

          const effect = {
            id: effectIdRef.current++,
            x,
            y,
            amount: result.earned,
            type: result.type,
          }

          setTapEffects((prev) => [...prev, effect])

          setTimeout(() => {
            setTapEffects((prev) => prev.filter((e) => e.id !== effect.id))
          }, 800)
        }
      }
    },
    [onTap],
  )

  return (
    <div className="pb-4">
      {/* Compact Header */}
      <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
        {/* Rank Button */}
        <button
          onClick={onOpenRank}
          className="relative bg-gradient-to-br from-yellow-400/10 to-orange-400/10 border border-yellow-400/30 rounded-lg p-1.5 sm:p-2 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-yellow-400/30 group overflow-hidden flex flex-col items-center justify-center min-w-[40px] sm:min-w-[50px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/10 via-orange-300/10 to-yellow-300/10 animate-pulse-slow" />
          <div className="absolute top-0.5 right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-300 rounded-full animate-ping-slow opacity-50" />

          <div className="relative text-center">
            <div className="text-sm sm:text-base mb-0.5 animate-bounce-slow">{icon}</div>
            <div className="text-xs text-yellow-300 font-bold bg-black/20 px-1 sm:px-1.5 py-0.5 rounded-full">#{rank}</div>
          </div>
        </button>

        {/* Enhanced Combo & Streak */}
        <div className="flex-1 grid grid-cols-2 gap-1 sm:gap-2">
          <div
            className={`relative bg-black/20 border rounded-lg p-1.5 sm:p-2 text-center overflow-hidden ${
              user.combo >= 10
                ? "shadow-md shadow-orange-400/20 animate-background-pulse-slow border-orange-300"
                : "border-gray-600/20"
            }`}
          >
            {user.combo >= 10 && (
              <div className="absolute inset-0 bg-gradient-to-t from-red-400/10 via-orange-400/10 to-yellow-400/10 animate-pulse-slow" />
            )}

            <div className="relative">
              <div className="text-sm sm:text-base mb-0.5">🔥</div>
              <div className="text-orange-300 font-bold text-xs sm:text-sm">{user.combo}</div>
              <div className="text-xs text-gray-200 font-semibold uppercase tracking-wide">COMBO</div>
            </div>

            {user.combo >= 10 && (
              <>
                <div className="absolute top-1 right-1 w-1 h-1 bg-orange-300 rounded-full animate-ping-slow" />
              </>
            )}
          </div>

          <div
            className={`relative bg-black/20 border rounded-lg p-1.5 sm:p-2 text-center overflow-hidden ${
              user.streak > 0
                ? "shadow-md shadow-blue-400/20 animate-background-pulse-slow border-blue-300"
                : "border-gray-600/20"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-400/5 via-purple-400/5 to-blue-400/5 animate-pulse-slow" />

            <div className="relative">
              <div className="text-sm sm:text-base mb-0.5">⚡</div>
              <div className="text-blue-300 font-bold text-xs sm:text-sm">{user.streak}</div>
              <div className="text-xs text-gray-200 font-semibold uppercase tracking-wide">STREAK</div>
            </div>

            <div className="absolute top-1 left-1 w-1 h-1 bg-blue-300 rounded-full animate-ping-slow opacity-40" />
          </div>
        </div>
      </div>

      {/* Enhanced Main Tap Area with Optimized Coin */}
      <div className="relative mb-4 sm:mb-6 tap-area-container" ref={containerRef}>
        <div
          className={`relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] mx-auto cursor-pointer transition-all duration-300 group ${
            isPressed ? "scale-95 animate-coin-press-slow" : "hover:scale-105"
          } max-w-[calc(100vw-32px)]`}
          onClick={handleTap}
          onTouchStart={(e) => {
            handleTapStart()
            handleTap(e)
          }}
          onTouchEnd={handleTapEnd}
          onMouseDown={handleTapStart}
          onMouseUp={handleTapEnd}
          onMouseLeave={handleTapEnd}
        >
          {/* Optimized Aura Layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-cyan-400/10 to-indigo-400/10 rounded-full opacity-10 animate-pulse-slow" />
          <div className="absolute inset-1 sm:inset-2 bg-gradient-to-r from-teal-400/15 via-cyan-400/15 to-indigo-400/15 rounded-full opacity-15 animate-ping-slow" />
          <div className="absolute inset-2 sm:inset-4 bg-gradient-to-r from-teal-300/20 via-cyan-300/20 to-indigo-300/20 rounded-full opacity-20 animate-pulse-slow" />

          {/* Main Coin Container with Smooth Animation */}
          <div className="relative z-10 w-full h-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full border-4 border-teal-400/40 shadow-xl shadow-teal-400/40 flex items-center justify-center overflow-hidden backdrop-blur-sm">
            {/* Inner Glow */}
            <div className="absolute inset-4 bg-gradient-to-br from-teal-300/10 to-cyan-300/10 rounded-full animate-pulse-slow" />

            {/* Optimized Coin Image */}
            <div className={`relative z-20 transition-transform duration-300 ${isPressed ? "scale-90" : ""}`}>
              <Image
                src="/images/uc-coin.png"
                alt="UC Coin"
                width={200}
                height={200}
                className="w-70 h-70 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-contain drop-shadow-xl"
                priority
                quality={100}
                style={{
                  filter: "drop-shadow(0 0 15px rgba(34, 197, 94, 0.5))",
                }}
              />
            </div>

            {/* Tap Ripple Effect */}
            <div
              className={`absolute inset-0 rounded-full border-4 border-white/20 transition-all duration-300 ${
                isPressed ? "scale-100 opacity-0" : "scale-0 opacity-80"
              }`}
            />
          </div>

          {/* Enhanced Tap Effects */}
          {tapEffects.map((effect) => (
            <div
              key={effect.id}
              className={`absolute pointer-events-none z-30 font-bold select-none ${
                effect.type === "critical"
                  ? "text-red-300 text-base sm:text-lg drop-shadow-md animate-bounce-up-slow"
                  : effect.type === "jackpot"
                    ? "text-green-300 text-lg sm:text-xl drop-shadow-lg animate-bounce-up-slow"
                    : "text-orange-300 text-sm sm:text-base drop-shadow-sm animate-pop-up-slow"
              }`}
              style={{
                left: effect.x,
                top: effect.y,
                transform: "translate(-50%, -50%)",
                textShadow: "0 0 8px currentColor",
              }}
            >
              +{gameLogic.formatNumber(effect.amount)}
              {effect.type === "jackpot" && " 🎰"}
              {effect.type === "critical" && " 🔥"}
            </div>
          ))}

          {/* Optimized Floating Particles */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-ping-slow opacity-30"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${2.5 + i * 0.3}s`,
              }}
            />
          ))}

          {/* Optimized Orbital Particles */}
          {Array.from({ length: 1 }).map((_, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-50 animate-orbit-slow"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                animationDelay: `${i * 1.5}s`,
              }}
            />
          ))}
        </div>

            {/* Enhanced Tap Instruction */}
        <div className="text-center mt-1 sm:mt-2">
          <div className="bg-gradient-to-r from-black/30 to-gray-800/30 backdrop-blur-md border border-teal-400/40 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 inline-block shadow-md shadow-teal-400/15">
            <p className="text-teal-300 font-bold text-xs flex items-center gap-1 sm:gap-1.5">
              <span className="animate-bounce-slow">👆</span>
              <span>Tap to Mine UC!</span>
              <span className="animate-pulse-slow">💎</span>
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Energy System */}
      <div className="bg-gradient-to-r from-black/30 to-gray-800/30 backdrop-blur-md border border-teal-400/30 rounded-xl p-2 sm:p-3 shadow-md shadow-teal-400/15 mb-16 sm:mb-20 md:mb-24">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-lg flex items-center justify-center text-lg sm:text-xl shadow-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-300/20 to-yellow-300/20 animate-pulse-slow" />
              <span className="relative animate-pulse-slow">⚡</span>
            </div>
            <div>
              <p className="text-white font-bold text-base sm:text-lg font-display">
                {user.tapsLeft} / {user.energyLimit}
              </p>
              <p className="text-sm text-gray-200 font-semibold uppercase tracking-wide">Energy</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base sm:text-lg font-bold text-yellow-300 drop-shadow-md font-display">
              {Math.round(energyPercentage)}%
            </div>
            <div className="text-sm text-gray-300">Charged</div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600/30 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${energyPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow" />
            <div className="absolute inset-0 bg-white/10 animate-pulse-slow" />
          </div>

          {energyPercentage > 50 && (
            <>
              <div className="absolute top-0.5 left-1/4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-300 rounded-full animate-ping-slow" />
            </>
          )}

       
        </div>
      </div>
    </div>
  )
}