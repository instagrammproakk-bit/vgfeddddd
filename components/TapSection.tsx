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
    <div className="flex flex-col h-full min-h-screen pb-0">
      {/* Top Stats Section - Larger */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
        {/* Rank Button - Larger */}
        <button
          onClick={onOpenRank}
          className="relative bg-gradient-to-br from-yellow-400/15 to-orange-400/15 border-2 border-yellow-400/40 rounded-xl p-3 sm:p-4 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-400/40 group overflow-hidden flex flex-col items-center justify-center min-w-[70px] sm:min-w-[80px] md:min-w-[90px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/15 via-orange-300/15 to-yellow-300/15 animate-pulse" />
          <div className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-yellow-300 rounded-full animate-ping opacity-60" />

          <div className="relative text-center">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 animate-bounce">{icon}</div>
            <div className="text-sm sm:text-base text-yellow-300 font-bold bg-black/30 px-2 sm:px-3 py-1 rounded-full">
              #{rank}
            </div>
          </div>
        </button>

        {/* Combo & Streak - Larger */}
        <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4">
          <div
            className={`relative bg-black/25 border-2 rounded-xl p-3 sm:p-4 text-center overflow-hidden transition-all duration-300 ${
              user.combo >= 10
                ? "shadow-lg shadow-orange-400/30 animate-background-pulse border-orange-400/50"
                : "border-gray-600/30"
            }`}
          >
            {user.combo >= 10 && (
              <div className="absolute inset-0 bg-gradient-to-t from-red-400/15 via-orange-400/15 to-yellow-400/15 animate-pulse" />
            )}

            <div className="relative">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2">🔥</div>
              <div className="text-orange-300 font-bold text-lg sm:text-xl md:text-2xl">{user.combo}</div>
              <div className="text-sm sm:text-base text-gray-200 font-semibold uppercase tracking-wide">COMBO</div>
            </div>

            {user.combo >= 10 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-orange-300 rounded-full animate-ping" />
            )}
          </div>

          <div
            className={`relative bg-black/25 border-2 rounded-xl p-3 sm:p-4 text-center overflow-hidden transition-all duration-300 ${
              user.streak > 0
                ? "shadow-lg shadow-blue-400/30 animate-background-pulse border-blue-400/50"
                : "border-gray-600/30"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-400/10 via-purple-400/10 to-blue-400/10 animate-pulse" />

            <div className="relative">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2">⚡</div>
              <div className="text-blue-300 font-bold text-lg sm:text-xl md:text-2xl">{user.streak}</div>
              <div className="text-sm sm:text-base text-gray-200 font-semibold uppercase tracking-wide">STREAK</div>
            </div>

            <div className="absolute top-2 left-2 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-50" />
          </div>
        </div>
      </div>

      {/* Main Tap Area - Much Larger */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mb-8">
        <div className="relative mb-8" ref={containerRef}>
          <div
            className={`relative w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] mx-auto cursor-pointer transition-all duration-300 group ${
              isPressed ? "scale-95" : "hover:scale-105"
            }`}
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
            {/* Enhanced Aura Layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/15 via-cyan-400/15 to-indigo-400/15 rounded-full opacity-20 animate-pulse" />
            <div className="absolute inset-2 bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-indigo-400/20 rounded-full opacity-25 animate-ping" />
            <div className="absolute inset-4 bg-gradient-to-r from-teal-300/25 via-cyan-300/25 to-indigo-300/25 rounded-full opacity-30 animate-pulse" />

            {/* Main Coin Container */}
            <div className="relative z-10 w-full h-full bg-gradient-to-br from-teal-400/25 to-cyan-400/25 rounded-full border-4 sm:border-6 border-teal-400/50 shadow-2xl shadow-teal-400/50 flex items-center justify-center overflow-hidden backdrop-blur-sm">
              {/* Inner Glow */}
              <div className="absolute inset-6 bg-gradient-to-br from-teal-300/15 to-cyan-300/15 rounded-full animate-pulse" />

              {/* Coin Image - Much Larger */}
              <div className={`relative z-20 transition-transform duration-300 ${isPressed ? "scale-90" : ""}`}>
                <Image
                  src="/images/uc-coin.png"
                  alt="UC Coin"
                  width={400}
                  height={400}
                  className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] object-contain drop-shadow-2xl"
                  priority
                  quality={100}
                  style={{
                    filter: "drop-shadow(0 0 25px rgba(34, 197, 94, 0.6))",
                  }}
                />
              </div>

              {/* Tap Ripple Effect */}
              <div
                className={`absolute inset-0 rounded-full border-4 border-white/30 transition-all duration-300 ${
                  isPressed ? "scale-100 opacity-0" : "scale-0 opacity-80"
                }`}
              />
            </div>

            {/* Tap Effects */}
            {tapEffects.map((effect) => (
              <div
                key={effect.id}
                className={`absolute pointer-events-none z-30 font-bold select-none ${
                  effect.type === "critical"
                    ? "text-red-300 text-xl sm:text-2xl drop-shadow-lg animate-bounce-up-critical"
                    : effect.type === "jackpot"
                      ? "text-green-300 text-2xl sm:text-3xl drop-shadow-xl animate-bounce-up-jackpot"
                      : "text-orange-300 text-lg sm:text-xl drop-shadow-md animate-bounce-up"
                }`}
                style={{
                  left: effect.x,
                  top: effect.y,
                  transform: "translate(-50%, -50%)",
                  textShadow: "0 0 12px currentColor",
                }}
              >
                +{gameLogic.formatNumber(effect.amount)}
                {effect.type === "jackpot" && " 🎰"}
                {effect.type === "critical" && " 🔥"}
              </div>
            ))}

            {/* Floating Particles */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-ping opacity-40"
                style={{
                  left: `${15 + i * 20}%`,
                  top: `${15 + i * 20}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${3 + i * 0.4}s`,
                }}
              />
            ))}

            {/* Orbital Particles */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`orbit-${i}`}
                className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-60 animate-orbit"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Tap Instruction - Centered below coin */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-black/40 to-gray-800/40 backdrop-blur-md border-2 border-teal-400/50 rounded-2xl px-6 sm:px-8 py-3 sm:py-4 inline-block shadow-lg shadow-teal-400/20">
            <p className="text-teal-300 font-bold text-lg sm:text-xl md:text-2xl flex items-center gap-3 sm:gap-4">
              <span className="animate-bounce text-2xl sm:text-3xl">👆</span>
              <span>Tap to Mine UC!</span>
              <span className="animate-pulse text-2xl sm:text-3xl">💎</span>
            </p>
          </div>
        </div>
      </div>

      {/* Energy System - Fixed at bottom with proper spacing */}
      <div className="bg-gradient-to-r from-black/40 to-gray-800/40 backdrop-blur-md border-2 border-teal-400/40 rounded-2xl p-4 sm:p-5 shadow-lg shadow-teal-400/20 mx-2 mb-28 sm:mb-32 md:mb-36">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-300/25 to-yellow-300/25 animate-pulse" />
              <span className="relative animate-pulse">⚡</span>
            </div>
            <div>
              <p className="text-white font-bold text-xl sm:text-2xl md:text-3xl font-display">
                {user.tapsLeft} / {user.energyLimit}
              </p>
              <p className="text-base sm:text-lg text-gray-200 font-semibold uppercase tracking-wide">Energy</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-lg font-display">
              {Math.round(energyPercentage)}%
            </div>
            <div className="text-base sm:text-lg text-gray-300">Charged</div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative w-full h-4 sm:h-5 md:h-6 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600/40 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${energyPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
            <div className="absolute inset-0 bg-white/15 animate-pulse" />
          </div>

          {energyPercentage > 50 && (
            <div className="absolute top-1 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full animate-ping" />
          )}
        </div>
      </div>
    </div>
  )
}