'use client'

import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import SignIn from './SignIn'
import { Button } from './ui/Button'

export default function Navigation() {
  const { t, language, setLanguage } = useLanguage()
  const { user, signOut } = useAuth()

  // Mock function to check if user is a parent
  const isParent = user?.email?.includes('parent') || false // In a real app, this would be based on user role

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              {t('nav.home')}
            </Link>
            <Link href="/modules" className="text-gray-600 hover:text-blue-600">
              {t('nav.modules')}
            </Link>
            {user && (
              <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                {t('nav.profile')}
              </Link>
            )}
            {isParent && (
              <Link
                href="/parent-dashboard"
                className="text-gray-600 hover:text-blue-600"
              >
                Parent Dashboard
              </Link>
            )}
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'lt')}
              className="bg-gray-100 border border-gray-300 rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="lt">LT</option>
            </select>

            {/* Authentication */}
            {user ? (
              <Button
                variant="secondary"
                onClick={() => signOut()}
                className="text-sm"
              >
                Sign out
              </Button>
            ) : (
              <SignIn />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 