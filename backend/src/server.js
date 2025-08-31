require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const rateLimit = require('express-rate-limit')

const connectDatabase = require('./config/database')

const authRoutes = require('./routes/auth')
const childrenRoutes = require('./routes/children')
const storiesRoutes = require('./routes/stories')
const pdfRoutes = require('./routes/pdf')

const app = express()

connectDatabase()

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://kidsstory.app', 'https://www.kidsstory.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}))

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
})
app.use(limiter)

const storyGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: 'Story generation rate limit exceeded. Please wait before creating more stories.'
  }
})

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/pdfs', express.static(path.join(__dirname, '../generated_pdfs')))

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/children', childrenRoutes)
app.use('/api/stories', storyGenerationLimiter, storiesRoutes)
app.use('/api/pdf', pdfRoutes)

app.get('/api/info', (req, res) => {
  res.json({
    name: 'KidsStory API',
    version: '1.0.0',
    description: 'Personalized Children\'s Story Generator API',
    features: [
      'User authentication and management',
      'Child profile management',
      'AI-powered story generation',
      'Multiple story themes',
      'PDF export functionality'
    ],
    themes: [
      'brave-steps',
      'sweet-dreams-solo', 
      'brush-like-hero',
      'big-kid-potty'
    ]
  })
})

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist.'
  })
})

app.use((error, req, res, next) => {
  console.error('Global error handler:', error)
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(error.errors).map(err => err.message)
    })
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    })
  }
  
  if (error.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate entry',
      message: 'A record with this information already exists'
    })
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum size limit'
    })
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong on our end.' 
      : error.message
  })
})

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`
🚀 KidsStory API Server running on port ${PORT}
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 API Base URL: http://localhost:${PORT}/api
📚 Health Check: http://localhost:${PORT}/health
  `)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  server.close(() => {
    console.log('Process terminated')
    process.exit(0)
  })
})

module.exports = app