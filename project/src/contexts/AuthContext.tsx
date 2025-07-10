import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  userType: 'business' | 'worker' | null
  loading: boolean
  signIn: (email: string, password: string, userType: 'business' | 'worker') => Promise<void>
  signUp: (email: string, password: string, userType: 'business' | 'worker') => Promise<User | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<'business' | 'worker' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Get user type from metadata
        const metadata = session.user.user_metadata
        setUserType(metadata?.user_type || null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          const metadata = session.user.user_metadata
          setUserType(metadata?.user_type || null)
        } else {
          setUserType(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string, userType: 'business' | 'worker') => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    // Verify user type matches
    if (data.user?.user_metadata?.user_type !== userType) {
      throw new Error(`This account is registered as a ${data.user?.user_metadata?.user_type}, not a ${userType}`)
    }
    
    setUserType(userType)
  }

  const signUp = async (email: string, password: string, userType: 'business' | 'worker') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType
        }
      }
    })
    if (error) throw error
    return data.user
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUserType(null)
  }

  const value = {
    user,
    userType,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}