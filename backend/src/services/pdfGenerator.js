const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const Story = require('../models/Story')

class PDFGenerator {
  constructor() {
    this.outputDir = process.env.PDF_OUTPUT_DIR || 'generated_pdfs'
    this.ensureOutputDir()
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  async generateStoryPDF(storyId) {
    try {
      const story = await Story.findById(storyId).populate('userId')
      if (!story) {
        throw new Error('Story not found')
      }

      if (story.status !== 'completed') {
        throw new Error('Story is not completed yet')
      }

      const filename = `story-${storyId}-${Date.now()}.pdf`
      const filepath = path.join(this.outputDir, filename)
      
      const html = this.generateHTML(story)
      
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      
      const page = await browser.newPage()
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      })
      
      await page.pdf({
        path: filepath,
        format: 'A4',
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '15mm',
          right: '15mm'
        },
        printBackground: true
      })
      
      await browser.close()
      
      story.pdfUrl = `/pdfs/${filename}`
      await story.save()
      
      return {
        success: true,
        pdfUrl: story.pdfUrl,
        filepath
      }
      
    } catch (error) {
      console.error('PDF generation error:', error)
      throw new Error(`Failed to generate PDF: ${error.message}`)
    }
  }

  generateHTML(story) {
    const childName = story.metadata.childName
    const pages = story.pages || []
    
    const pageHTML = pages.map((page, index) => `
      <div class="story-page">
        <div class="page-number">${page.pageNumber}</div>
        <div class="page-content">
          ${page.imageUrl ? `
            <div class="page-image">
              <img src="${page.imageUrl}" alt="Story illustration" />
            </div>
          ` : ''}
          <div class="page-text">
            ${this.formatText(page.text)}
          </div>
        </div>
      </div>
      ${index < pages.length - 1 ? '<div class="page-break"></div>' : ''}
    `).join('')

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${story.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600&family=Poppins:wght@300;400;500&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .story-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .story-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-radius: 0;
        }

        .story-title {
            font-family: 'Fredoka', cursive;
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .story-subtitle {
            font-size: 1.2rem;
            font-weight: 300;
            opacity: 0.9;
        }

        .story-page {
            padding: 30px;
            min-height: calc(297mm - 80px);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .page-number {
            position: absolute;
            top: 15px;
            right: 30px;
            font-family: 'Fredoka', cursive;
            font-size: 1.1rem;
            color: #6B73FF;
            background: rgba(107, 115, 255, 0.1);
            padding: 5px 12px;
            border-radius: 15px;
        }

        .page-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
        }

        .page-image {
            text-align: center;
            margin-bottom: 20px;
        }

        .page-image img {
            max-width: 100%;
            max-height: 400px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            object-fit: cover;
        }

        .page-text {
            font-size: 1.3rem;
            line-height: 1.8;
            text-align: center;
            color: #444;
            font-weight: 400;
        }

        .page-text p {
            margin-bottom: 20px;
        }

        .child-name {
            color: #6B73FF;
            font-weight: 600;
            font-family: 'Fredoka', cursive;
        }

        .page-break {
            page-break-after: always;
        }

        .story-footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e9ecef;
        }

        .footer-message {
            font-family: 'Fredoka', cursive;
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: #6B73FF;
        }

        .footer-subtitle {
            font-size: 1rem;
            font-style: italic;
        }

        @media print {
            body {
                background: white;
            }
            
            .story-container {
                box-shadow: none;
            }
        }

        .highlight-text {
            background: linear-gradient(120deg, rgba(107, 115, 255, 0.2) 0%, rgba(107, 115, 255, 0.1) 100%);
            padding: 2px 6px;
            border-radius: 4px;
        }

        .first-letter {
            font-size: 3rem;
            float: left;
            line-height: 1;
            padding-right: 8px;
            margin-top: 4px;
            font-family: 'Fredoka', cursive;
            color: #6B73FF;
        }
    </style>
</head>
<body>
    <div class="story-container">
        <div class="story-header">
            <h1 class="story-title">${story.title}</h1>
            <p class="story-subtitle">A personalized story for ${childName}</p>
        </div>

        ${pageHTML}

        <div class="story-footer">
            <div class="footer-message">The End ✨</div>
            <div class="footer-subtitle">
                Created with love by KidsStory<br>
                Generated on ${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
            </div>
        </div>
    </div>
</body>
</html>`
  }

  formatText(text) {
    if (!text) return ''
    
    return text
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim()) {
          let formattedParagraph = paragraph.trim()
          
          formattedParagraph = formattedParagraph.replace(
            /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g, 
            (match) => {
              const names = ['mom', 'dad', 'mother', 'father', 'parent', 'guardian']
              if (!names.some(name => match.toLowerCase().includes(name))) {
                return `<span class="child-name">${match}</span>`
              }
              return match
            }
          )
          
          if (formattedParagraph.length > 0) {
            const firstChar = formattedParagraph.charAt(0)
            const restOfText = formattedParagraph.slice(1)
            formattedParagraph = `<span class="first-letter">${firstChar}</span>${restOfText}`
          }
          
          return `<p>${formattedParagraph}</p>`
        }
        return ''
      })
      .join('')
  }

  async deletePDF(pdfUrl) {
    try {
      if (pdfUrl && pdfUrl.startsWith('/pdfs/')) {
        const filename = pdfUrl.replace('/pdfs/', '')
        const filepath = path.join(this.outputDir, filename)
        
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Failed to delete PDF:', error)
      return false
    }
  }

  async cleanupOldPDFs(daysOld = 30) {
    try {
      const files = fs.readdirSync(this.outputDir)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)
      
      let deletedCount = 0
      
      for (const file of files) {
        const filepath = path.join(this.outputDir, file)
        const stats = fs.statSync(filepath)
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filepath)
          deletedCount++
        }
      }
      
      console.log(`Cleaned up ${deletedCount} old PDF files`)
      return deletedCount
    } catch (error) {
      console.error('Failed to cleanup old PDFs:', error)
      return 0
    }
  }
}

module.exports = new PDFGenerator()