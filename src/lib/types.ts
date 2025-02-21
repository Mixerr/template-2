export type Language = 'en' | 'lt'

export type LessonType = 'video' | 'interactive' | 'activity' | 'discussion' | 'quiz'

export interface Lesson {
  id: number
  title: string
  description?: string
  duration: string
  type: LessonType
  content?: string
  videoUrl?: string
  quizQuestions?: QuizQuestion[]
}

export interface Module {
  id: string
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  lessons: Lesson[]
  imageUrl?: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface UserProgress {
  userId: string
  moduleId: string
  completedLessons: number[]
  quizScores: Record<number, number>
  lastAccessed: string
}

export interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  condition: {
    type: 'lessons_completed' | 'quiz_score' | 'discussion_participated'
    threshold: number
  }
}

export interface UserActivity {
  id: number
  userId: string
  module: string
  lesson: string
  type: 'lesson_completed' | 'quiz_completed' | 'discussion_participated'
  date: string
  score?: number
}

export interface UserSettings {
  userId: string
  emailNotifications: boolean
  progressUpdates: boolean
  language: Language
  parentalControls?: {
    maxDailyTime?: number
    restrictedModules?: string[]
  }
}

export interface ParentDashboard {
  parentId: string
  children: {
    userId: string
    displayName: string
    progress: {
      totalModulesStarted: number
      totalModulesCompleted: number
      totalLessonsCompleted: number
      averageQuizScore: number
      timeSpent: number
    }
  }[]
} 