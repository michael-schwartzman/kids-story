const express = require('express')
const path = require('path')
const fs = require('fs')
const { authenticate } = require('../middleware/auth')
const pdfGenerator = require('../services/pdfGenerator')
const Story = require('../models/Story')

const router = express.Router()

router.post('/generate/:storyId', authenticate, async (req, res) => {
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

    if (story.status !== 'completed') {
      return res.status(400).json({
        error: 'Story must be completed before generating PDF'
      })
    }

    if (story.pdfUrl) {
      return res.json({
        message: 'PDF already exists',
        pdfUrl: story.pdfUrl
      })
    }

    const result = await pdfGenerator.generateStoryPDF(story._id)

    res.json({
      message: 'PDF generated successfully',
      pdfUrl: result.pdfUrl
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({
      error: 'Failed to generate PDF',
      message: error.message
    })
  }
})

router.get('/download/:storyId', authenticate, async (req, res) => {
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

    if (!story.pdfUrl) {
      return res.status(404).json({
        error: 'PDF not found. Please generate PDF first.'
      })
    }

    const filename = story.pdfUrl.replace('/pdfs/', '')
    const filepath = path.join(process.env.PDF_OUTPUT_DIR || 'generated_pdfs', filename)

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: 'PDF file not found on server'
      })
    }

    const childName = story.metadata.childName || 'Story'
    const downloadFilename = `${childName}_${story.theme}_${new Date().toISOString().split('T')[0]}.pdf`

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`)
    
    const fileStream = fs.createReadStream(filepath)
    fileStream.pipe(res)
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error)
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to stream PDF file'
        })
      }
    })

  } catch (error) {
    console.error('PDF download error:', error)
    res.status(500).json({
      error: 'Failed to download PDF'
    })
  }
})

router.get('/view/:storyId', authenticate, async (req, res) => {
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

    if (!story.pdfUrl) {
      return res.status(404).json({
        error: 'PDF not found. Please generate PDF first.'
      })
    }

    const filename = story.pdfUrl.replace('/pdfs/', '')
    const filepath = path.join(process.env.PDF_OUTPUT_DIR || 'generated_pdfs', filename)

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: 'PDF file not found on server'
      })
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline')
    
    const fileStream = fs.createReadStream(filepath)
    fileStream.pipe(res)
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error)
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to stream PDF file'
        })
      }
    })

  } catch (error) {
    console.error('PDF view error:', error)
    res.status(500).json({
      error: 'Failed to view PDF'
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

    if (!story.pdfUrl) {
      return res.status(404).json({
        error: 'No PDF to delete'
      })
    }

    const deleted = await pdfGenerator.deletePDF(story.pdfUrl)
    
    story.pdfUrl = null
    await story.save()

    res.json({
      message: 'PDF deleted successfully',
      fileDeleted: deleted
    })
  } catch (error) {
    console.error('PDF deletion error:', error)
    res.status(500).json({
      error: 'Failed to delete PDF'
    })
  }
})

router.get('/cleanup', authenticate, async (req, res) => {
  try {
    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        error: 'Admin access required'
      })
    }

    const daysOld = parseInt(req.query.days) || 30
    const deletedCount = await pdfGenerator.cleanupOldPDFs(daysOld)

    res.json({
      message: 'PDF cleanup completed',
      deletedFiles: deletedCount
    })
  } catch (error) {
    console.error('PDF cleanup error:', error)
    res.status(500).json({
      error: 'Failed to cleanup PDFs'
    })
  }
})

module.exports = router