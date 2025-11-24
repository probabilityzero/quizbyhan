"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { getQuizBySlug } from "@/lib/quiz-data"
import { getProgress, saveProgress } from "@/lib/quiz-storage"
import { getUserProfile } from "@/lib/profile-storage"
import QuizFlow from "@/components/quiz-flow"
import QuizResults from "@/components/quiz-results"
import QuizInfo from "@/components/quiz-info"
import ProfileSetupModal from "@/components/profile-setup-modal"
import type { Quiz } from "@/lib/quiz-data"
import type { QuizProgress } from "@/lib/quiz-storage"
import type { UserProfile } from "@/lib/profile-storage"
import type { PreQuizData } from "@/components/pre-quiz-form"

type PageParams = {
  slug: string
}

export default function QuizPage() {
  const params = useParams<PageParams>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [progress, setProgress] = useState<QuizProgress | null>(null)
  const [mounted, setMounted] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [preQuizData, setPreQuizData] = useState<PreQuizData | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const view = searchParams.get("view") || "info"

  useEffect(() => {
    const slug = params.slug as string
    const foundQuiz = getQuizBySlug(slug)
    if (foundQuiz) {
      setQuiz(foundQuiz)
      const savedProgress = getProgress(foundQuiz.id)
      const savedProfile = getUserProfile()
      setUserProfile(savedProfile)

      if (savedProgress && savedProgress.attempts.length > 0) {
        setProgress(savedProgress)
      }
    }
    setMounted(true)
  }, [params])

  if (!mounted || !quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const handleStartQuiz = () => {
    if (!userProfile) {
      setShowProfileModal(true)
    } else {
      router.push(`/quiz/${quiz.slug}?view=questions`)
    }
  }

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setShowProfileModal(false)
    router.push(`/quiz/${quiz.slug}?quiz=questions`)
  }

  if (view === "questions") {
    return (
      <QuizFlow
        quiz={quiz}
        preQuizData={preQuizData}
        userProfile={userProfile}
        onComplete={(answers) => {
          let score = 0
          answers.forEach((answer, index) => {
            if (answer === quiz.questions[index].correctAnswer) {
              score++
            }
          })

          const userProfileData = userProfile ? { name: userProfile.name, year: userProfile.year } : undefined

          const newProgress: QuizProgress = {
            quizId: quiz.id,
            attempts: [
              {
                completedAt: Date.now(),
                score,
                totalQuestions: quiz.questions.length,
                answers,
              },
            ],
            userProfile: userProfileData,
          }

          if (progress) {
            newProgress.attempts = [
              ...progress.attempts,
              {
                completedAt: Date.now(),
                score,
                totalQuestions: quiz.questions.length,
                answers,
              },
            ]
          }

          saveProgress(quiz.id, newProgress.attempts[newProgress.attempts.length - 1], userProfileData)
          setProgress(newProgress)
          router.push(`/quiz/${quiz.slug}?view=results`)
        }}
      />
    )
  }

  if (view === "results") {
    return (
      <>
        <QuizResults
          quiz={quiz}
          progress={progress}
          onRetake={() => {
            setProgress(null)
            setPreQuizData(null)
            router.push(`/quiz/${quiz.slug}?view=info`)
          }}
        />
        <ProfileSetupModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onComplete={handleProfileComplete}
        />
      </>
    )
  }

  return (
    <>
      <QuizInfo
        quiz={quiz}
        progress={progress}
        onStartQuiz={handleStartQuiz}
        onViewResults={() => router.push(`/quiz/${quiz.slug}?view=results`)}
      />
      <ProfileSetupModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={handleProfileComplete}
      />
    </>
  )
}
