const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { authenticate } = require('../middleware/auth')
const { validateChild } = require('../middleware/validation')
const User = require('../models/User')

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

const ensureUploadDir = () => {
  const uploadDir = process.env.UPLOAD_DIR || 'uploads'
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
  return uploadDir
}

router.get('/', authenticate, async (req, res) => {
  try {
    res.json({
      children: req.user.children
    })
  } catch (error) {
    console.error('Get children error:', error)
    res.status(500).json({
      error: 'Failed to get children'
    })
  }
})

router.post('/', authenticate, upload.single('photo'), validateChild, async (req, res) => {
  try {
    const { name, age, preferences } = req.body
    
    let photoUrl = null
    
    if (req.file) {
      const uploadDir = ensureUploadDir()
      const filename = `child-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`
      const filepath = path.join(uploadDir, filename)
      
      await sharp(req.file.buffer)
        .resize(800, 800, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(filepath)
      
      photoUrl = `/uploads/${filename}`
    }

    const childData = {
      name,
      age: parseInt(age),
      photoUrl,
      preferences: preferences ? JSON.parse(preferences) : {}
    }

    req.user.children.push(childData)
    await req.user.save()

    const newChild = req.user.children[req.user.children.length - 1]

    res.status(201).json({
      message: 'Child added successfully',
      child: newChild
    })
  } catch (error) {
    console.error('Add child error:', error)
    res.status(500).json({
      error: 'Failed to add child'
    })
  }
})

router.get('/:childId', authenticate, async (req, res) => {
  try {
    const child = req.user.children.id(req.params.childId)
    
    if (!child) {
      return res.status(404).json({
        error: 'Child not found'
      })
    }

    res.json({ child })
  } catch (error) {
    console.error('Get child error:', error)
    res.status(500).json({
      error: 'Failed to get child'
    })
  }
})

router.put('/:childId', authenticate, upload.single('photo'), validateChild, async (req, res) => {
  try {
    const child = req.user.children.id(req.params.childId)
    
    if (!child) {
      return res.status(404).json({
        error: 'Child not found'
      })
    }

    const { name, age, preferences } = req.body
    
    child.name = name || child.name
    child.age = age ? parseInt(age) : child.age
    
    if (preferences) {
      child.preferences = JSON.parse(preferences)
    }

    if (req.file) {
      const uploadDir = ensureUploadDir()
      const filename = `child-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`
      const filepath = path.join(uploadDir, filename)
      
      await sharp(req.file.buffer)
        .resize(800, 800, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(filepath)
      
      child.photoUrl = `/uploads/${filename}`
    }

    await req.user.save()

    res.json({
      message: 'Child updated successfully',
      child
    })
  } catch (error) {
    console.error('Update child error:', error)
    res.status(500).json({
      error: 'Failed to update child'
    })
  }
})

router.delete('/:childId', authenticate, async (req, res) => {
  try {
    const child = req.user.children.id(req.params.childId)
    
    if (!child) {
      return res.status(404).json({
        error: 'Child not found'
      })
    }

    child.remove()
    await req.user.save()

    res.json({
      message: 'Child deleted successfully'
    })
  } catch (error) {
    console.error('Delete child error:', error)
    res.status(500).json({
      error: 'Failed to delete child'
    })
  }
})

module.exports = router