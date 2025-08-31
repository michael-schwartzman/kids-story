import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { authAPI } from '../services/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = Cookies.get('kidsstory_token')
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.getProfile()
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to load user:', error)
      setError(error.response?.data?.error || 'Failed to load user')
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.login(credentials)
      const { token, user } = response.data
      
      Cookies.set('kidsstory_token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' })
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.error || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.register(userData)
      const { token, user } = response.data
      
      Cookies.set('kidsstory_token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' })
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      console.error('Registration failed:', error)
      const errorMessage = error.response?.data?.error || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    Cookies.remove('kidsstory_token')
    setUser(null)
    setError(null)
  }

  const updateProfile = async (profileData) => {
    try {
      setError(null)
      const response = await authAPI.updateProfile(profileData)
      setUser(response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      console.error('Profile update failed:', error)
      const errorMessage = error.response?.data?.error || 'Profile update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const isAuthenticated = !!user

  const canGenerateStory = () => {
    if (!user) return false
    if (user.subscriptionTier === 'premium') return true
    return user.storiesGenerated === 0
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    loadUser,
    canGenerateStory,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}