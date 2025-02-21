'use client'

import { useState } from 'react'
import { Lesson as LessonType } from '@/lib/types'
import { useAuth } from '@/lib/hooks/useAuth'
import { updateUserProgress, logUserActivity } from '@/lib/firebase/firebaseUtils'

interface LessonProps {
  lesson: LessonType
  moduleId: string
  onComplete: () => void
}

export default function Lesson({ lesson, moduleId, onComplete }: LessonProps) {
  const { user } = useAuth()
  const [isCompleted, setIsCompleted] = useState(false)

  const handleComplete = async () => {
    if (!user) return

    try {
      await updateUserProgress(user.uid, moduleId, lesson.id)
      await logUserActivity({
        userId: user.uid,
        module: moduleId,
        lesson: lesson.title,
        type: 'lesson_completed',
      })
      setIsCompleted(true)
      onComplete()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="aspect-w-16 aspect-h-9 mb-6">
            {lesson.videoUrl ? (
              <iframe
                src={lesson.videoUrl}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">Video not available</p>
              </div>
            )}
          </div>
        )

      case 'interactive':
        return (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Interactive Activity</h3>
            <div className="prose max-w-none">
              {lesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              ) : (
                <p>Interactive content not available</p>
              )}
            </div>
          </div>
        )

      case 'activity':
        return (
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Hands-on Activity</h3>
            <div className="prose max-w-none">
              {lesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              ) : (
                <p>Activity content not available</p>
              )}
            </div>
          </div>
        )

      case 'discussion':
        return (
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Discussion Topic</h3>
            <div className="prose max-w-none">
              {lesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              ) : (
                <p>Discussion content not available</p>
              )}
            </div>
            <div className="mt-6">
              <textarea
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Share your thoughts..."
              />
              <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Submit Response
              </button>
            </div>
          </div>
        )

      case 'quiz':
        return (
          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Quiz</h3>
            {lesson.quizQuestions ? (
              <div className="space-y-6">
                {lesson.quizQuestions.map((question, index) => (
                  <div key={question.id} className="bg-white p-4 rounded-lg">
                    <p className="font-semibold mb-3">
                      {index + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optionIndex}
                            className="form-radio"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Quiz questions not available</p>
            )}
          </div>
        )

      default:
        return <p>Unsupported lesson type</p>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
        <span className="text-gray-500">{lesson.duration}</span>
      </div>

      {lesson.description && (
        <p className="text-gray-600 mb-6">{lesson.description}</p>
      )}

      {renderContent()}

      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isCompleted
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? 'Completed!' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  )
} 