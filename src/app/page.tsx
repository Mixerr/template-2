'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import SignIn from '@/components/SignIn'

export default function Home() {
  const { t } = useLanguage()
  const { user } = useAuth()

  const featuredModules = [
    {
      id: 'stoicism',
      title: 'Stoicism',
      description: 'Learn about inner peace and self-control',
      image: '/images/stoicism.jpg',
    },
    {
      id: 'ethics',
      title: 'Ethics',
      description: 'Explore right and wrong through fun activities',
      image: '/images/ethics.jpg',
    },
    {
      id: 'logic',
      title: 'Logic',
      description: 'Discover how to think clearly and solve puzzles',
      image: '/images/logic.jpg',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-white">{t('welcome.title')}</h1>
          <p className="text-xl mb-8 text-white">{t('welcome.description')}</p>
          {!user && (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
              <SignIn />
            </div>
          )}
        </div>
      </section>

      {/* Featured Modules */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Philosophy Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredModules.map((module) => (
            <Link
              key={module.id}
              href={`/modules/${module.id}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gray-200 rounded-md mb-4">
                {/* Image placeholder */}
              </div>
              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
              <p className="text-gray-600">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Interactive Learning</h3>
          <p className="text-gray-600">
            Engage with philosophy through fun activities and games
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
          <p className="text-gray-600">
            Follow your learning journey with achievements and milestones
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Parent Dashboard</h3>
          <p className="text-gray-600">
            Monitor and guide your child's philosophical exploration
          </p>
        </div>
      </section>
    </div>
  )
}
