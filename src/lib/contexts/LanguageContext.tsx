'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'lt'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

interface TranslationKeys {
  'nav.home': string
  'nav.modules': string
  'nav.profile': string
  'nav.login': string
  'nav.logout': string
  'welcome.title': string
  'welcome.description': string
  [key: string]: string // Allow any string key for future translations
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    'nav.home': 'Home',
    'nav.modules': 'Philosophy Modules',
    'nav.profile': 'My Profile',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'welcome.title': 'Welcome to Philosophy for Kids!',
    'welcome.description': 'Start your journey into the world of philosophy',
    // Add more translations as needed
  },
  lt: {
    'nav.home': 'Pradžia',
    'nav.modules': 'Filosofijos Moduliai',
    'nav.profile': 'Mano Profilis',
    'nav.login': 'Prisijungti',
    'nav.logout': 'Atsijungti',
    'welcome.title': 'Sveiki atvykę į Filosofiją Vaikams!',
    'welcome.description': 'Pradėkite savo kelionę į filosofijos pasaulį',
    // Add more translations as needed
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'en' || savedLang === 'lt')) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 