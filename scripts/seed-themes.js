const mongoose = require('mongoose')
require('dotenv').config({ path: '../backend/.env' })

const StoryTheme = require('../backend/src/models/StoryTheme')

const themes = [
  {
    id: 'brave-steps',
    title: 'Brave Steps',
    description: 'Help your child overcome their fear of wearing shoes through a magical adventure story.',
    template: `Once upon a time, there was a wonderful child named {childName}, who was {childAge} years old...`,
    ageRange: { min: 2, max: 6 },
    pages: 8,
    imagePrompts: [
      { pageNumber: 1, prompt: 'A happy {childAge}-year-old child named {childName} waking up in bed, with shoes visible nearby, warm and cozy bedroom' },
      { pageNumber: 2, prompt: 'The same child looking hesitant at a pair of colorful shoes, gentle morning sunlight streaming through window' },
      { pageNumber: 3, prompt: 'A loving parent or guardian sitting with {childName}, showing the shoes with patience and kindness' },
      { pageNumber: 4, prompt: '{childName} thinking about their favorite activities - {hobbies}, thought bubbles showing fun activities' },
      { pageNumber: 5, prompt: '{childName} carefully putting on one shoe, showing determination and bravery' },
      { pageNumber: 6, prompt: '{childName} taking first steps in both shoes, looking surprised and pleased' },
      { pageNumber: 7, prompt: '{childName} running and playing happily in their shoes, full of joy and confidence' },
      { pageNumber: 8, prompt: '{childName} with their family, all smiling together, {childName} proudly wearing their shoes' }
    ],
    isActive: true
  },
  {
    id: 'sweet-dreams-solo',
    title: 'Sweet Dreams Solo',
    description: 'A gentle story about learning to sleep independently in their own bed.',
    template: `Meet {childName}, a brave {childAge}-year-old who loved bedtime stories...`,
    ageRange: { min: 3, max: 7 },
    pages: 8,
    imagePrompts: [
      { pageNumber: 1, prompt: 'A cozy bedroom scene with {childName} and their parent reading bedtime stories together' },
      { pageNumber: 2, prompt: '{childName} looking at their own bed thoughtfully, with favorite toys nearby in a warm bedroom' },
      { pageNumber: 3, prompt: 'The bedroom at twilight, showing {childName} feeling a bit uncertain about sleeping alone' },
      { pageNumber: 4, prompt: 'A loving parent sitting on the bed edge, having a gentle conversation with {childName}' },
      { pageNumber: 5, prompt: '{childName} thinking about brave activities they do, with thought bubbles showing {hobbies}' },
      { pageNumber: 6, prompt: '{childName} tucking themselves into bed with a favorite stuffed animal, looking determined' },
      { pageNumber: 7, prompt: '{childName} sleeping peacefully in their own bed, with soft moonlight through the window' },
      { pageNumber: 8, prompt: '{childName} waking up happy and proud in the morning, feeling accomplished and grown up' }
    ],
    isActive: true
  },
  {
    id: 'brush-like-hero',
    title: 'Brush Like a Hero',
    description: 'Transform tooth brushing into an exciting superhero adventure.',
    template: `This is the story of {childName}, a fantastic {childAge}-year-old who loved {hobbies}...`,
    ageRange: { min: 2, max: 6 },
    pages: 8,
    imagePrompts: [
      { pageNumber: 1, prompt: '{childName} in their bathroom, looking unenthusiastic about a regular toothbrush on the counter' },
      { pageNumber: 2, prompt: 'A parent with {childName} in the bathroom, having an exciting conversation about superheroes' },
      { pageNumber: 3, prompt: '{childName} holding a toothbrush like a magic wand, with sparkles around it, looking amazed' },
      { pageNumber: 4, prompt: '{childName} as a superhero brushing teeth, with imaginary cavity monsters fleeing in fear' },
      { pageNumber: 5, prompt: '{childName} making circular brushing motions, concentrated and determined like a real hero' },
      { pageNumber: 6, prompt: '{childName} rinsing and swishing water, continuing the superhero tooth-brushing adventure' },
      { pageNumber: 7, prompt: '{childName} smiling proudly in the bathroom mirror, showing off sparkly clean teeth' },
      { pageNumber: 8, prompt: '{childName} in superhero pose with toothbrush, confident and happy about dental hygiene' }
    ],
    isActive: true
  },
  {
    id: 'big-kid-potty',
    title: 'Big Kid Potty',
    description: 'An encouraging story about transitioning from diapers to using the potty.',
    template: `Once there was a wonderful child named {childName}, who was {childAge} years old...`,
    ageRange: { min: 2, max: 5 },
    pages: 8,
    imagePrompts: [
      { pageNumber: 1, prompt: '{childName} playing happily with toys, showing them as a confident, growing child' },
      { pageNumber: 2, prompt: '{childName} looking curiously at a regular toilet, wondering about this grown-up thing' },
      { pageNumber: 3, prompt: 'A parent showing {childName} a child-sized potty seat, having an encouraging conversation' },
      { pageNumber: 4, prompt: '{childName} approaching the potty seat with determination, parent nearby for support' },
      { pageNumber: 5, prompt: '{childName} sitting on the potty seat, looking calm and focused, with patient parent nearby' },
      { pageNumber: 6, prompt: '{childName} successfully using the potty, looking proud and accomplished' },
      { pageNumber: 7, prompt: 'Family celebration scene with {childName} beaming with pride, everyone cheering' },
      { pageNumber: 8, prompt: '{childName} confidently using the potty independently, showing growth and maturity' }
    ],
    isActive: true
  }
]

async function seedThemes() {
  try {
    console.log('🌱 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB')

    console.log('🗑️  Clearing existing themes...')
    await StoryTheme.deleteMany({})
    console.log('✅ Cleared existing themes')

    console.log('📚 Creating new themes...')
    await StoryTheme.insertMany(themes)
    console.log('✅ Created themes:')
    
    themes.forEach(theme => {
      console.log(`   - ${theme.title} (${theme.id})`)
    })

    console.log('')
    console.log('🎉 Theme seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding themes:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

if (require.main === module) {
  seedThemes()
}

module.exports = { seedThemes, themes }