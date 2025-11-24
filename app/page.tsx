"use client"

import Link from "next/link"
import { getAllCategories, quizzes } from "@/lib/quiz-data"
import { useEffect, useState } from "react"
import { getAllProgress } from "@/lib/quiz-storage"
import { getUserProfile } from "@/lib/profile-storage"
import type { QuizProgress } from "@/lib/quiz-storage"
import type { UserProfile } from "@/lib/profile-storage"

export default function Home() {
  const [progress, setProgress] = useState<Record<string, QuizProgress>>({})
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setProgress(getAllProgress())
    const savedProfile = getUserProfile()
    if (savedProfile) {
      setProfile(savedProfile)
    }
    setMounted(true)
  }, [])

  const categories = getAllCategories()

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-background transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-12">
        {/* Hero section */}
        <div className="mb-8 md:mb-12 transition-enter">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance mb-3 md:mb-4">
            Quiz <span className="bg-gradient-to-r from-primary font-semibold text-2xl to-accent bg-clip-text text-transparent">by Han</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Choose from the collection of quizzes and test your expertise across different categories.
            {profile && (
              <span className="block mt-2">
                Welcome back, <span className="text-primary font-semibold">{profile.name}</span>!
              </span>
            )}
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-8 md:space-y-12">
          {categories.map((category) => {
            const categoryQuizzes = quizzes.filter((q) => q.category === category)
            return (
              <div key={category}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {categoryQuizzes.map((quiz) => {
                    const quizProgress = progress[quiz.id]
                    const hasAttempts = quizProgress && quizProgress.attempts.length > 0
                    const lastAttempt = hasAttempts ? quizProgress!.attempts[quizProgress!.attempts.length - 1] : null
                    const percentage = lastAttempt
                      ? Math.round((lastAttempt.score / lastAttempt.totalQuestions) * 100)
                      : 0

                    return (
                      <Link key={quiz.id} href={`/quiz/${quiz.slug}`}>
                        <div className="group h-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col">
                          {/* Header with Icon and Status Badge */}
                          <div className="relative">
                            <div
                              className={`h-40 bg-gradient-to-br ${quiz.accentColor} relative overflow-hidden flex items-center justify-center`}
                            >
                              {/* Background Icon */}
                              <div className="text-7xl md:text-8xl opacity-20 absolute">
                                {quiz.icon}
                              </div>
                              
                              {/* Status Badge */}
                              {hasAttempts && (
                                <div className="absolute top-3 right-3 bg-white/95 text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Completed
                                </div>
                              )}

                              {/* Tags at bottom with gradient overlay */}
                              {quiz.tags && quiz.tags.length > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pt-8 pb-3 px-3">
                                  <div className="flex flex-wrap gap-1.5">
                                    {quiz.tags.slice(0, 3).map((tag) => (
                                      <span
                                        key={tag}
                                        className="bg-white/90 backdrop-blur-sm text-gray-800 capitalize text-xs font-medium px-2.5 py-1 rounded-md"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-5 pt-3 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold mb-1 line-clamp-2">
                              {quiz.title}
                            </h3>
                            {/* Description */}
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {quiz.description}
                            </p>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4 pt-3 border-t border-border/50">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-muted-foreground">Questions</div>
                                  <div className="text-sm font-semibold">{quiz.questions.length}</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-muted-foreground">Difficulty</div>
                                  <div className={`text-sm font-semibold capitalize ${
                                    quiz.difficulty === 'easy' ? 'text-green-500' :
                                    quiz.difficulty === 'medium' ? 'text-yellow-500' :
                                    'text-red-500'
                                  }`}>
                                    {quiz.difficulty}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Progress Section */}
                            {hasAttempts ? (
                              <div className="space-y-2 bg-accent/10 rounded-lg p-3 mt-auto">
                                <div className="flex items-center justify-between text-xs font-medium">
                                  <span className="text-muted-foreground">Your Score</span>
                                  <span className={`font-bold ${
                                    percentage >= 80 ? 'text-green-500' :
                                    percentage >= 60 ? 'text-yellow-500' :
                                    'text-red-500'
                                  }`}>
                                    {percentage}%
                                  </span>
                                </div>
                                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      percentage >= 80 ? 'bg-green-500' :
                                      percentage >= 60 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground text-center">
                                  {lastAttempt!.score} / {lastAttempt!.totalQuestions} correct
                                </div>
                              </div>
                            ) : (
                              <button className="group/btn bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-3 text-center mt-auto transition-all duration-200 hover:shadow-md active:scale-[0.98]">
                                <span className="text-sm font-semibold inline-flex items-center gap-2 group-hover/btn:gap-3 transition-all">
                                  Start Quiz
                                  <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
