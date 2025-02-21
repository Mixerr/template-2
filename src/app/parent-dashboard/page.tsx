'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { getChildProgress } from '@/lib/firebase/firebaseUtils'
import { UserProgress } from '@/lib/types'

interface ChildProgress {
  userId: string
  displayName: string
  progress: {
    totalModulesStarted: number
    totalModulesCompleted: number
    totalLessonsCompleted: number
    averageQuizScore: number
    timeSpent: number
  }
}

export default function ParentDashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [childrenProgress, setChildrenProgress] = useState<ChildProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const fetchChildrenProgress = async () => {
      try {
        // This is a mock implementation - in a real app, you'd fetch the actual children data
        const mockChildren = [
          {
            userId: 'child1',
            displayName: 'Alice',
            progress: await getChildProgress('child1'),
          },
          {
            userId: 'child2',
            displayName: 'Bob',
            progress: await getChildProgress('child2'),
          },
        ]

        const processedProgress = mockChildren.map((child) => ({
          userId: child.userId,
          displayName: child.displayName,
          progress: calculateProgress(child.progress as UserProgress[]),
        }))

        setChildrenProgress(processedProgress)
      } catch (error) {
        console.error('Error fetching children progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChildrenProgress()
  }, [user, router])

  const calculateProgress = (progress: UserProgress[]) => {
    const modules = new Set(progress.map((p) => p.moduleId))
    const completedModules = new Set(
      progress
        .filter((p) => p.completedLessons.length >= 3) // Assuming a module is complete with 3 lessons
        .map((p) => p.moduleId)
    )

    const totalLessons = progress.reduce(
      (sum, p) => sum + p.completedLessons.length,
      0
    )

    const quizScores = progress.flatMap((p) => Object.values(p.quizScores))
    const averageScore =
      quizScores.length > 0
        ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
        : 0

    return {
      totalModulesStarted: modules.size,
      totalModulesCompleted: completedModules.size,
      totalLessonsCompleted: totalLessons,
      averageQuizScore: Math.round(averageScore),
      timeSpent: totalLessons * 20, // Mock time spent (20 minutes per lesson)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Parent Dashboard</h1>
        <p className="text-gray-600">
          Monitor your children's learning progress and activities
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {childrenProgress.map((child) => (
          <div
            key={child.userId}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-semibold">{child.displayName}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-800 mb-1">
                    Modules Started
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {child.progress.totalModulesStarted}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-green-800 mb-1">
                    Modules Completed
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {child.progress.totalModulesCompleted}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-800 mb-1">
                    Lessons Completed
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {child.progress.totalLessonsCompleted}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                    Average Quiz Score
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {child.progress.averageQuizScore}%
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Time Spent Learning</h3>
                <p className="text-gray-600">
                  {Math.floor(child.progress.timeSpent / 60)} hours{' '}
                  {child.progress.timeSpent % 60} minutes
                </p>
              </div>

              <div className="mt-6">
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                  View Detailed Progress
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Settings Section */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Parental Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between">
              <span>Daily Time Limit</span>
              <select className="form-select border rounded p-1">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>No limit</option>
              </select>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Receive weekly progress reports</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Notify me of completed modules</span>
            </label>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
} 