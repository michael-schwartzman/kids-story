const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { authenticate } = require('../middleware/auth')
const { validateRegistration, validateLogin } = require('../middleware/validation')

const router = express.Router()

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      })
    }

    const user = new User({
      email,
      password,
      name
    })

    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        children: user.children
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      error: 'Failed to register user'
    })
  }
})

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account has been deactivated'
      })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        children: user.children,
        storiesGenerated: user.storiesGenerated
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Failed to login'
    })
  }
})

router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        subscriptionTier: req.user.subscriptionTier,
        children: req.user.children,
        storiesGenerated: req.user.storiesGenerated
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      error: 'Failed to get user profile'
    })
  }
})

router.put('/me', authenticate, async (req, res) => {
  try {
    const { name } = req.body
    
    if (name) {
      req.user.name = name
      await req.user.save()
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        subscriptionTier: req.user.subscriptionTier,
        children: req.user.children
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      error: 'Failed to update profile'
    })
  }
})

module.exports = router