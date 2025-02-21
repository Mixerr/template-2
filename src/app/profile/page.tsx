'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Mock progress data - this would come from a database in a real app
const mockProgress = {
  completedLessons: 5,
  totalLessons: 15,
  achievements: [
    {
      id: 1,
      title: 'First Step',
      description: 'Completed your first lesson',
      icon: '🎯',
    },
    {
      id: 2,
      title: 'Quick Learner',
      description: 'Completed 5 lessons',
      icon: '🚀',
    },
    {
      id: 3,
      title: 'Deep Thinker',
      description: 'Participated in 3 discussions',
      icon: '🤔',
    },
  ],
  recentActivity: [
    {
      id: 1,
      module: 'Stoicism',
      lesson: 'Understanding Emotions',
      date: '2024-02-20',
      type: 'lesson_completed',
    },
    {
      id: 2,
      module: 'Ethics',
      lesson: 'What is Right and Wrong?',
      date: '2024-02-19',
      type: 'quiz_completed',
    },
  ],
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return null // Page will redirect
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={user.photoURL || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Progress Overview */}
        <div className="col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Overall Progress</span>
                <span>
                  {mockProgress.completedLessons}/{mockProgress.totalLessons}{' '}
                  lessons
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (mockProgress.completedLessons / mockProgress.totalLessons) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {mockProgress.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <h3 className="font-semibold">{activity.module}</h3>
                    <p className="text-sm text-gray-600">{activity.lesson}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="space-y-4">
              {mockProgress.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-2xl" role="img" aria-label="achievement">
                    {achievement.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Email notifications</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Progress updates</span>
                </label>
              </div>
              <button
                onClick={() => {
                  /* Implement settings save */
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 