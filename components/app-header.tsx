"use client"

import { useTheme } from "./theme-provider"
import { useRouter } from "next/navigation"
import { getUserProfile } from "@/lib/profile-storage"
import { useState, useEffect } from "react"
import type { UserProfile } from "@/lib/profile-storage"

export default function AppHeader() {
  const { theme, setTheme, mounted } = useTheme()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const isDark = theme === "dark"

  useEffect(() => {
    setProfile(getUserProfile())
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border transition-smooth">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded-lg transition-smooth"
            aria-label="Toggle theme"
            title={isDark ? "Switch to light" : "Switch to dark"}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <button onClick={() => router.push("/")} className="font-bold text-xl hover:opacity-80 transition-smooth group text-left">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Quiz</span>
            <span className="text-xs ml-1 text-muted-foreground group-hover:text-foreground transition-smooth">
              by Han
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-secondary rounded-lg transition-smooth flex items-center gap-2"
              aria-haspopup="true"
              aria-expanded={showMenu}
            >
              {profile ? (
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground scale-in">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              )}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 transition-enter">
                {profile ? (
                  <>
                    <div className="px-4 py-2 border-b border-border">
                      <p className="font-semibold text-foreground">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">Class of {profile.year}</p>
                    </div>
                    <button
                      onClick={() => {
                        router.push("/?edit-profile=true")
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary transition-smooth text-sm"
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      router.push("/?setup-profile=true")
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-secondary transition-smooth text-sm"
                  >
                    Create Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
