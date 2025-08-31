const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  photoUrl: {
    type: String,
    default: null
  },
  preferences: {
    hobbies: [String],
    favoriteToys: [String],
    interests: [String],
    parentNames: {
      mother: String,
      father: String,
      guardian: String
    }
  }
}, {
  timestamps: true
})

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  storiesGenerated: {
    type: Number,
    default: 0
  },
  children: [childSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.canGenerateStory = function() {
  if (this.subscriptionTier === 'premium') return true
  return this.storiesGenerated === 0
}

module.exports = mongoose.model('User', userSchema)