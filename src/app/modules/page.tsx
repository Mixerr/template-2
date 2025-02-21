'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import SignInWithGoogle from '@/components/SignInWithGoogle'

const modules = [
  {
    id: 'stoicism',
    title: 'Stoicism',
    description: 'Learn about inner peace and self-control',
    level: 'Beginner',
    duration: '4 weeks',
    lessons: 12,
  },
  {
    id: 'ethics',
    title: 'Ethics',
    description: 'Explore right and wrong through fun activities',
    level: 'Beginner',
    duration: '3 weeks',
    lessons: 9,
  },
  {
    id: 'logic',
    title: 'Logic',
    description: 'Discover how to think clearly and solve puzzles',
    level: 'Intermediate',
    duration: '5 weeks',
    lessons: 15,
  },
  {
    id: 'eastern-philosophy',
    title: 'Eastern Philosophy',
    description: 'Journey through ancient wisdom from the East',
    level: 'Intermediate',
    duration: '6 weeks',
    lessons: 18,
  },
]

export default function ModulesPage() {
  const { t } = useLanguage()
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Philosophy Modules</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of philosophy modules designed specifically for young minds.
          Each module includes interactive lessons, fun activities, and engaging discussions.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gray-200 relative">
              {/* Module image placeholder */}
              <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1">
                {module.level}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{module.duration}</span>
                <span>{module.lessons} lessons</span>
              </div>
              <Link
                href={`/modules/${module.id}`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {user ? 'Start Learning' : 'Sign in to Start'}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!user && (
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Sign in to track your progress and access all features
          </p>
          <SignInWithGoogle />
        </div>
      )}
    </div>
  )
} 