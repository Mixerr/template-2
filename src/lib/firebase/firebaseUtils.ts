import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Module,
  UserProgress,
  UserActivity,
  UserSettings,
  Achievement,
} from '../types'

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Module Operations
export async function getModules(): Promise<Module[]> {
  const modulesRef = collection(db, 'modules')
  const snapshot = await getDocs(modulesRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Module))
}

export async function getModule(moduleId: string): Promise<Module | null> {
  const moduleRef = doc(db, 'modules', moduleId)
  const moduleDoc = await getDoc(moduleRef)
  return moduleDoc.exists() ? ({ id: moduleDoc.id, ...moduleDoc.data() } as Module) : null
}

// User Progress Operations
export async function getUserProgress(
  userId: string,
  moduleId: string
): Promise<UserProgress | null> {
  const progressRef = doc(db, 'userProgress', `${userId}_${moduleId}`)
  const progressDoc = await getDoc(progressRef)
  return progressDoc.exists()
    ? ({ ...progressDoc.data() } as UserProgress)
    : null
}

export async function updateUserProgress(
  userId: string,
  moduleId: string,
  lessonId: number
): Promise<void> {
  const progressRef = doc(db, 'userProgress', `${userId}_${moduleId}`)
  const progressDoc = await getDoc(progressRef)

  if (progressDoc.exists()) {
    const currentProgress = progressDoc.data() as UserProgress
    if (!currentProgress.completedLessons.includes(lessonId)) {
      await updateDoc(progressRef, {
        completedLessons: [...currentProgress.completedLessons, lessonId],
        lastAccessed: new Date().toISOString(),
      })
    }
  } else {
    await setDoc(progressRef, {
      userId,
      moduleId,
      completedLessons: [lessonId],
      quizScores: {},
      lastAccessed: new Date().toISOString(),
    })
  }
}

// User Activity Operations
export async function logUserActivity(activity: Omit<UserActivity, 'id' | 'date'>): Promise<void> {
  const activitiesRef = collection(db, 'userActivities')
  const newDoc = doc(activitiesRef)
  await setDoc(newDoc, {
    id: newDoc.id,
    ...activity,
    date: new Date().toISOString(),
  })
}

export async function getUserRecentActivity(userId: string, limitCount: number = 5): Promise<UserActivity[]> {
  const activitiesRef = collection(db, 'userActivities')
  const q = query(
    activitiesRef,
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    firestoreLimit(limitCount)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: parseInt(doc.id),
  } as UserActivity))
}

// User Settings Operations
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const settingsRef = doc(db, 'userSettings', userId)
  const settingsDoc = await getDoc(settingsRef)
  return settingsDoc.exists()
    ? ({ ...settingsDoc.data() } as UserSettings)
    : null
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const settingsRef = doc(db, 'userSettings', userId)
  await updateDoc(settingsRef, settings)
}

// Achievement Operations
export async function checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
  // Get all achievements
  const achievementsRef = collection(db, 'achievements')
  const snapshot = await getDocs(achievementsRef)
  const achievements = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: parseInt(doc.id),
  } as Achievement))

  // Get user progress
  const progressRef = collection(db, 'userProgress')
  const q = query(progressRef, where('userId', '==', userId))
  const progressSnapshot = await getDocs(q)
  const progress = progressSnapshot.docs.map((doc) => doc.data() as UserProgress)

  // Check each achievement condition
  const earnedAchievements: Achievement[] = []
  for (const achievement of achievements) {
    let isEarned = false

    switch (achievement.condition.type) {
      case 'lessons_completed':
        const totalLessons = progress.reduce(
          (sum, p) => sum + p.completedLessons.length,
          0
        )
        isEarned = totalLessons >= achievement.condition.threshold
        break

      case 'quiz_score':
        const quizScores = progress.flatMap((p) =>
          Object.values(p.quizScores)
        )
        const averageScore =
          quizScores.length > 0
            ? quizScores.reduce((sum, score) => sum + score, 0) /
              quizScores.length
            : 0
        isEarned = averageScore >= achievement.condition.threshold
        break

      // Add more achievement types as needed
    }

    if (isEarned) {
      earnedAchievements.push(achievement)
    }
  }

  return earnedAchievements
}

// Parent Dashboard Operations
export async function getChildProgress(childUserId: string) {
  const progressRef = collection(db, 'userProgress')
  const q = query(progressRef, where('userId', '==', childUserId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data())
}
