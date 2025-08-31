const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Token is not valid.' 
      })
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Account has been deactivated.' 
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token is not valid.' 
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token has expired.' 
      })
    }
    
    console.error('Authentication error:', error)
    res.status(500).json({ 
      error: 'Server error during authentication.' 
    })
  }
}

const requirePremium = (req, res, next) => {
  if (req.user.subscriptionTier !== 'premium') {
    return res.status(403).json({
      error: 'Premium subscription required for this feature.'
    })
  }
  next()
}

const checkStoryGenerationLimit = (req, res, next) => {
  if (!req.user.canGenerateStory()) {
    return res.status(403).json({
      error: 'Story generation limit reached. Upgrade to premium for unlimited stories.',
      upgradeRequired: true
    })
  }
  next()
}

module.exports = {
  authenticate,
  requirePremium,
  checkStoryGenerationLimit
}