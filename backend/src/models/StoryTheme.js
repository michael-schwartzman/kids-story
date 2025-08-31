const mongoose = require('mongoose')

const storyThemeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  template: {
    type: String,
    required: true
  },
  ageRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  pages: {
    type: Number,
    required: true,
    min: 4,
    max: 12
  },
  imagePrompts: [{
    pageNumber: Number,
    prompt: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('StoryTheme', storyThemeSchema)