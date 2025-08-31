const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  imagePrompt: {
    type: String,
    default: null
  }
})

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  theme: {
    type: String,
    required: true,
    enum: ['brave-steps', 'sweet-dreams-solo', 'brush-like-hero', 'big-kid-potty']
  },
  pages: [pageSchema],
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  metadata: {
    childName: String,
    childAge: Number,
    childPhoto: String,
    parentNames: {
      mother: String,
      father: String,
      guardian: String
    },
    preferences: {
      hobbies: [String],
      favoriteToys: [String],
      interests: [String]
    }
  },
  generationDetails: {
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    generationTime: Number,
    errorMessage: String
  },
  pdfUrl: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

storySchema.index({ userId: 1, createdAt: -1 })
storySchema.index({ theme: 1 })
storySchema.index({ status: 1 })

storySchema.methods.markCompleted = function() {
  this.status = 'completed'
  this.generationDetails.completedAt = new Date()
  this.generationDetails.generationTime = 
    this.generationDetails.completedAt - this.generationDetails.startedAt
}

storySchema.methods.markFailed = function(errorMessage) {
  this.status = 'failed'
  this.generationDetails.errorMessage = errorMessage
}

module.exports = mongoose.model('Story', storySchema)