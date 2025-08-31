const { body, validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    })
  }
  next()
}

const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  handleValidationErrors
]

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
]

const validateChild = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Child name is required and must be less than 50 characters'),
  body('age')
    .isInt({ min: 1, max: 12 })
    .withMessage('Age must be between 1 and 12'),
  body('preferences.hobbies')
    .optional()
    .isArray()
    .withMessage('Hobbies must be an array'),
  body('preferences.favoriteToys')
    .optional()
    .isArray()
    .withMessage('Favorite toys must be an array'),
  body('preferences.parentNames.mother')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Mother\'s name must be less than 50 characters'),
  body('preferences.parentNames.father')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Father\'s name must be less than 50 characters'),
  handleValidationErrors
]

const validateStoryCreation = [
  body('childId')
    .isMongoId()
    .withMessage('Valid child ID is required'),
  body('theme')
    .isIn(['brave-steps', 'sweet-dreams-solo', 'brush-like-hero', 'big-kid-potty'])
    .withMessage('Valid story theme is required'),
  handleValidationErrors
]

module.exports = {
  validateRegistration,
  validateLogin,
  validateChild,
  validateStoryCreation,
  handleValidationErrors
}