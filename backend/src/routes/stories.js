const express = require('express')
const Story = require('../models/Story')
const { authenticate, checkStoryGenerationLimit } = require('../middleware/auth')
const { validateStoryCreation } = require('../middleware/validation')
const storyGenerator = require('../services/storyGenerator')

const router = express.Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, theme } = req.query
    
    const query = { userId: req.user._id }
    
    if (status) query.status = status
    if (theme) query.theme = theme
    
    const stories = await Story.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await Story.countDocuments(query)
    
    res.json({
      stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get stories error:', error)
    res.status(500).json({
      error: 'Failed to get stories'
    })
  }
})

router.post('/create', authenticate, checkStoryGenerationLimit, validateStoryCreation, async (req, res) => {
  try {
    const { childId, theme } = req.body
    
    const child = req.user.children.id(childId)
    if (!child) {
      return res.status(404).json({
        error: 'Child not found'
      })
    }

    const story = new Story({
      userId: req.user._id,
      childId,
      theme,
      title: `${child.name}'s Adventure`,
      metadata: {
        childName: child.name,
        childAge: child.age,
        childPhoto: child.photoUrl,
        parentNames: child.preferences?.parentNames,
        preferences: {
          hobbies: child.preferences?.hobbies || [],
          favoriteToys: child.preferences?.favoriteToys || [],
          interests: child.preferences?.interests || []
        }
      }
    })

    await story.save()

    storyGenerator.generateCompleteStory(story._id).catch(error => {
      console.error('Background story generation failed:', error)
    })

    res.status(201).json({
      message: 'Story creation started',
      story: {
        id: story._id,
        title: story.title,
        theme: story.theme,
        status: story.status,
        createdAt: story.createdAt
      }
    })
  } catch (error) {
    console.error('Create story error:', error)
    res.status(500).json({
      error: 'Failed to create story'
    })
  }
})

router.get('/themes', (req, res) => {
  const themes = [
    {
      id: 'brave-steps',
      title: 'Brave Steps',
      description: 'Help your child overcome their fear of wearing shoes through a magical adventure story.',
      ageRange: { min: 2, max: 6 },
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'sweet-dreams-solo',
      title: 'Sweet Dreams Solo',
      description: 'A gentle story about learning to sleep independently in their own bed.',
      ageRange: { min: 3, max: 7 },
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'brush-like-hero',
      title: 'Brush Like a Hero',
      description: 'Transform tooth brushing into an exciting superhero adventure.',
      ageRange: { min: 2, max: 6 },
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'big-kid-potty',
      title: 'Big Kid Potty',
      description: 'An encouraging story about transitioning from diapers to using the potty.',
      ageRange: { min: 2, max: 5 },
      estimatedTime: '2-3 minutes'
    }
  ]

  res.json({ themes })
})

router.get('/:storyId', authenticate, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.storyId,
      userId: req.user._id
    })

    if (!story) {
      return res.status(404).json({
        error: 'Story not found'
      })
    }

    res.json({ story })
  } catch (error) {
    console.error('Get story error:', error)
    res.status(500).json({
      error: 'Failed to get story'
    })
  }
})

router.get('/:storyId/status', authenticate, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.storyId,
      userId: req.user._id
    }).select('status generationDetails')

    if (!story) {
      return res.status(404).json({
        error: 'Story not found'
      })
    }

    res.json({
      status: story.status,
      generationDetails: story.generationDetails
    })
  } catch (error) {
    console.error('Get story status error:', error)
    res.status(500).json({
      error: 'Failed to get story status'
    })
  }
})

router.delete('/:storyId', authenticate, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.storyId,
      userId: req.user._id
    })

    if (!story) {
      return res.status(404).json({
        error: 'Story not found'
      })
    }

    await story.deleteOne()

    res.json({
      message: 'Story deleted successfully'
    })
  } catch (error) {
    console.error('Delete story error:', error)
    res.status(500).json({
      error: 'Failed to delete story'
    })
  }
})

router.post('/:storyId/regenerate', authenticate, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.storyId,
      userId: req.user._id
    })

    if (!story) {
      return res.status(404).json({
        error: 'Story not found'
      })
    }

    if (story.status === 'generating') {
      return res.status(400).json({
        error: 'Story is already being generated'
      })
    }

    story.status = 'generating'
    story.pages = []
    story.pdfUrl = null
    story.generationDetails = {
      startedAt: new Date(),
      completedAt: null,
      generationTime: null,
      errorMessage: null
    }

    await story.save()

    storyGenerator.generateCompleteStory(story._id).catch(error => {
      console.error('Background story regeneration failed:', error)
    })

    res.json({
      message: 'Story regeneration started',
      story: {
        id: story._id,
        status: story.status
      }
    })
  } catch (error) {
    console.error('Regenerate story error:', error)
    res.status(500).json({
      error: 'Failed to regenerate story'
    })
  }
})

module.exports = router