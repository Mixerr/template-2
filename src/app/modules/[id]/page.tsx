'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useAuth } from '@/lib/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import SignInWithGoogle from '@/components/SignInWithGoogle'
import Lesson from '@/components/Lesson'
import { Module, UserProgress } from '@/lib/types'
import { getModule, getUserProgress } from '@/lib/firebase/firebaseUtils'

// This would typically come from a database
const moduleData = {
  stoicism: {
    title: 'Stoicism',
    description: 'Learn about inner peace and self-control',
    lessons: [
      {
        id: 1,
        title: 'Introduction to Stoicism',
        duration: '20 mins',
        type: 'video',
      },
      {
        id: 2,
        title: 'Understanding Emotions',
        duration: '25 mins',
        type: 'interactive',
      },
      {
        id: 3,
        title: 'Control What You Can',
        duration: '30 mins',
        type: 'activity',
      },
    ],
  },
  ethics: {
    title: 'Ethics',
    description: 'Explore right and wrong through fun activities',
    lessons: [
      {
        id: 1,
        title: 'What is Right and Wrong?',
        duration: '20 mins',
        type: 'discussion',
      },
      {
        id: 2,
        title: 'Making Good Choices',
        duration: '25 mins',
        type: 'interactive',
      },
      {
        id: 3,
        title: 'Helping Others',
        duration: '30 mins',
        type: 'activity',
      },
    ],
  },
  // Add more modules as needed
}

export default function ModulePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const params = useParams()
  const moduleId = params.id as string

  const module = moduleData[moduleId as keyof typeof moduleData]

  if (!module) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Module Not Found</h1>
        <p className="mt-4 text-gray-600">
          Sorry, the module you're looking for doesn't exist.
        </p>
      </div>
    )
  }

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥'
      case 'interactive':
        return '🎮'
      case 'activity':
        return '✏️'
      case 'discussion':
        return '💭'
      default:
        return '📚'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{module.title}</h1>
        <p className="text-gray-600">{module.description}</p>
      </header>

      {user ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Lessons</h2>
          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl" role="img" aria-label={lesson.type}>
                    {getLessonTypeIcon(lesson.type)}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{lesson.title}</h3>
                    <p className="text-gray-500">{lesson.duration}</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Start Lesson
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Sign in to access this module
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account or sign in to start learning
          </p>
          <SignInWithGoogle />
        </div>
      )}
    </div>
  )
} 