import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'

import { AuthProvider } from '@/domain'

import { createAuthService } from '@/services'

const createAuthFirebaseProvider = (): AuthProvider => {
  const auth = getAuth()

  return {
    register: async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password)
    },
    login: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password)
    },
    logout: async () => {
      await signOut(auth)
    },
    getLoggerUser: async () => {
      if (!auth.currentUser) return null
      return { id: auth.currentUser.uid }
    },
    onAuthStateChanged: (callback) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('onAuthStateChanged', user)
        if (!user) callback(null)
        else callback({ id: user.uid })
      })

      return unsubscribe
    },
  }
}

export const authFirebaseService = createAuthService(createAuthFirebaseProvider())