import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('kidsstory_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('kidsstory_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
}

export const childrenAPI = {
  getChildren: () => api.get('/children'),
  addChild: (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('age', data.age)
    formData.append('preferences', JSON.stringify(data.preferences))
    if (data.photo) {
      formData.append('photo', data.photo)
    }
    
    return api.post('/children', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  updateChild: (childId, data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('age', data.age)
    formData.append('preferences', JSON.stringify(data.preferences))
    if (data.photo) {
      formData.append('photo', data.photo)
    }
    
    return api.put(`/children/${childId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  deleteChild: (childId) => api.delete(`/children/${childId}`),
}

export const storiesAPI = {
  getStories: (params) => api.get('/stories', { params }),
  getStory: (storyId) => api.get(`/stories/${storyId}`),
  createStory: (data) => api.post('/stories/create', data),
  getStoryStatus: (storyId) => api.get(`/stories/${storyId}/status`),
  deleteStory: (storyId) => api.delete(`/stories/${storyId}`),
  regenerateStory: (storyId) => api.post(`/stories/${storyId}/regenerate`),
  getThemes: () => api.get('/stories/themes'),
}

export const miscAPI = {
  getHealth: () => api.get('/health'),
  getInfo: () => api.get('/info'),
}

export default api