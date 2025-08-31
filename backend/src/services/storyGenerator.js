const axios = require('axios')
const Story = require('../models/Story')

const STORY_THEMES = {
  'brave-steps': {
    title: 'Brave Steps',
    template: `Once upon a time, there was a wonderful child named {childName}, who was {childAge} years old. {childName} lived with {parentNames} and loved playing with {favoriteToys}.

One sunny morning, {childName} woke up and saw their beautiful shoes waiting by the bed. But something felt scary about putting them on. The shoes seemed so big and different!

{parentName} came over with a gentle smile. "These shoes will help you run and play and go on adventures," they said softly. But {childName} wasn't so sure.

{childName} thought about all the fun things they loved to do - {hobbies}. Maybe shoes could help with these activities?

With a deep breath, {childName} decided to try. First one foot, then the other. The shoes felt different, but not scary at all!

Soon {childName} was walking, then running, then dancing in their new shoes. They realized shoes weren't scary - they were magical helpers for big adventures!

From that day on, {childName} loved wearing shoes and went on many wonderful adventures with {parentNames}.`,
    pages: 8,
    imagePrompts: [
      'A happy {childAge}-year-old child named {childName} waking up in bed, with shoes visible nearby, warm and cozy bedroom',
      'The same child looking hesitant at a pair of colorful shoes, gentle morning sunlight streaming through window',
      'A loving parent or guardian sitting with {childName}, showing the shoes with patience and kindness',
      '{childName} thinking about their favorite activities - {hobbies}, thought bubbles showing fun activities',
      '{childName} carefully putting on one shoe, showing determination and bravery',
      '{childName} taking first steps in both shoes, looking surprised and pleased',
      '{childName} running and playing happily in their shoes, full of joy and confidence',
      '{childName} with their family, all smiling together, {childName} proudly wearing their shoes'
    ]
  },
  'sweet-dreams-solo': {
    title: 'Sweet Dreams Solo',
    template: `Meet {childName}, a brave {childAge}-year-old who loved bedtime stories and playing with {favoriteToys}. {childName} lived in a cozy home with {parentNames}.

Every night, {childName} would snuggle close to {parentName} at bedtime. But lately, {childName} had been wondering what it would be like to sleep in their very own bed, all by themselves.

The bedroom looked so big and quiet when the lights went dim. {childName} felt a little nervous about sleeping alone. What if something happened? What if they got scared?

{parentName} sat on the edge of the bed. "You know, sleeping in your own bed means you're growing up to be very brave and independent," they said with pride.

{childName} thought about all the brave things they already did - {hobbies} and playing with friends. Maybe sleeping alone could be another brave adventure!

That night, {childName} tucked themselves in with their favorite stuffed animal. The room felt peaceful and safe. When morning came, {childName} felt so proud!

Now {childName} sleeps peacefully in their own bed every night, having the sweetest dreams and feeling very grown up.`,
    pages: 8,
    imagePrompts: [
      'A cozy bedroom scene with {childName} and their parent reading bedtime stories together',
      '{childName} looking at their own bed thoughtfully, with favorite toys nearby in a warm bedroom',
      'The bedroom at twilight, showing {childName} feeling a bit uncertain about sleeping alone',
      'A loving parent sitting on the bed edge, having a gentle conversation with {childName}',
      '{childName} thinking about brave activities they do, with thought bubbles showing {hobbies}',
      '{childName} tucking themselves into bed with a favorite stuffed animal, looking determined',
      '{childName} sleeping peacefully in their own bed, with soft moonlight through the window',
      '{childName} waking up happy and proud in the morning, feeling accomplished and grown up'
    ]
  },
  'brush-like-hero': {
    title: 'Brush Like a Hero',
    template: `This is the story of {childName}, a fantastic {childAge}-year-old who loved {hobbies} and playing with {favoriteToys}. {childName} lived with {parentNames} in a happy home.

Every morning and evening, there was one thing {childName} didn't enjoy very much - brushing teeth! The toothbrush seemed so boring, and it took so much time.

One day, {parentName} had a wonderful idea. "What if we pretend your toothbrush is a magic wand?" they suggested. "And you're a superhero fighting the cavity monsters!"

{childName}'s eyes lit up with excitement. A superhero? Fighting monsters? That sounded much more fun than just brushing teeth!

{parentName} showed {childName} how to hold the "magic toothbrush wand" and make special circular motions to defeat the cavity monsters hiding between teeth.

"Swish, swish, brush away!" {childName} chanted, moving the toothbrush like a real superhero. The cavity monsters didn't stand a chance!

After two whole minutes of superhero brushing, {childName} smiled in the mirror. Their teeth sparkled like stars!

Now {childName} brushes twice every day, proud to be a tooth-brushing superhero with the strongest, cleanest teeth in town!`,
    pages: 8,
    imagePrompts: [
      '{childName} in their bathroom, looking unenthusiastic about a regular toothbrush on the counter',
      'A parent with {childName} in the bathroom, having an exciting conversation about superheroes',
      '{childName} holding a toothbrush like a magic wand, with sparkles around it, looking amazed',
      '{childName} as a superhero brushing teeth, with imaginary cavity monsters fleeing in fear',
      '{childName} making circular brushing motions, concentrated and determined like a real hero',
      '{childName} rinsing and swishing water, continuing the superhero tooth-brushing adventure',
      '{childName} smiling proudly in the bathroom mirror, showing off sparkly clean teeth',
      '{childName} in superhero pose with toothbrush, confident and happy about dental hygiene'
    ]
  },
  'big-kid-potty': {
    title: 'Big Kid Potty',
    template: `Once there was a wonderful child named {childName}, who was {childAge} years old and loved {hobbies}. {childName} lived with {parentNames} and was growing bigger every day!

{childName} had been wearing diapers for a long time, but lately had been feeling curious about the big toilet that {parentNames} used. It looked so grown-up and important!

One morning, {parentName} said, "Would you like to try using the potty like a big kid?" {childName} felt excited but also a little nervous. It seemed like such a big step!

{parentName} showed {childName} a special potty seat that was just the right size. "This will help you feel safe and comfortable," they explained with a warm smile.

{childName} decided to be brave and give it a try. Sitting on the potty felt different, but not scary. {parentName} stayed close by for support and encouragement.

When {childName} successfully used the potty for the first time, everyone cheered! It felt amazing to do something so grown-up and independent.

Now {childName} uses the potty all by themselves, feeling proud and confident. Growing up feels wonderful when you have loving support from family!`,
    pages: 8,
    imagePrompts: [
      '{childName} playing happily with toys, showing them as a confident, growing child',
      '{childName} looking curiously at a regular toilet, wondering about this grown-up thing',
      'A parent showing {childName} a child-sized potty seat, having an encouraging conversation',
      '{childName} approaching the potty seat with determination, parent nearby for support',
      '{childName} sitting on the potty seat, looking calm and focused, with patient parent nearby',
      '{childName} successfully using the potty, looking proud and accomplished',
      'Family celebration scene with {childName} beaming with pride, everyone cheering',
      '{childName} confidently using the potty independently, showing growth and maturity'
    ]
  }
}

class StoryGenerator {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY
    this.geminiApiKey = process.env.GEMINI_API_KEY
  }

  async generateStoryText(theme, childData) {
    const storyTemplate = STORY_THEMES[theme]
    if (!storyTemplate) {
      throw new Error('Invalid story theme')
    }

    let storyText = storyTemplate.template
    
    const replacements = {
      '{childName}': childData.name,
      '{childAge}': childData.age,
      '{parentNames}': this.formatParentNames(childData.preferences?.parentNames),
      '{parentName}': this.getMainParentName(childData.preferences?.parentNames),
      '{hobbies}': this.formatList(childData.preferences?.hobbies),
      '{favoriteToys}': this.formatList(childData.preferences?.favoriteToys),
      '{interests}': this.formatList(childData.preferences?.interests)
    }

    for (const [placeholder, value] of Object.entries(replacements)) {
      storyText = storyText.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || '')
    }

    return this.splitIntoPages(storyText, storyTemplate.pages)
  }

  async generateImages(theme, childData, pages) {
    const storyTemplate = STORY_THEMES[theme]
    const images = []

    for (let i = 0; i < pages.length; i++) {
      try {
        const prompt = this.createImagePrompt(storyTemplate.imagePrompts[i], childData)
        const imageUrl = await this.callGeminiImageAPI(prompt)
        
        images.push({
          pageNumber: i + 1,
          imageUrl,
          prompt
        })
      } catch (error) {
        console.error(`Failed to generate image for page ${i + 1}:`, error)
        images.push({
          pageNumber: i + 1,
          imageUrl: null,
          prompt: null
        })
      }
    }

    return images
  }

  async callGeminiImageAPI(prompt) {
    try {
      const response = await axios.post('https://api.gemini.com/v1/generate', {
        prompt,
        size: '1024x1024',
        style: 'children-book-illustration',
        quality: 'high'
      }, {
        headers: {
          'Authorization': `Bearer ${this.geminiApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      return response.data.url
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to generate image')
    }
  }

  createImagePrompt(template, childData) {
    let prompt = template
    
    const replacements = {
      '{childName}': childData.name,
      '{childAge}': childData.age,
      '{hobbies}': this.formatList(childData.preferences?.hobbies),
      '{favoriteToys}': this.formatList(childData.preferences?.favoriteToys)
    }

    for (const [placeholder, value] of Object.entries(replacements)) {
      prompt = prompt.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || '')
    }

    return `${prompt}, children's book illustration style, warm colors, friendly and safe atmosphere, high quality digital art`
  }

  formatParentNames(parentNames) {
    if (!parentNames) return 'their family'
    
    const names = []
    if (parentNames.mother) names.push(parentNames.mother)
    if (parentNames.father) names.push(parentNames.father)
    if (parentNames.guardian) names.push(parentNames.guardian)
    
    if (names.length === 0) return 'their family'
    if (names.length === 1) return names[0]
    if (names.length === 2) return `${names[0]} and ${names[1]}`
    
    return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
  }

  getMainParentName(parentNames) {
    if (!parentNames) return 'their parent'
    
    return parentNames.mother || parentNames.father || parentNames.guardian || 'their parent'
  }

  formatList(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return 'many fun activities'
    }
    
    if (items.length === 1) return items[0]
    if (items.length === 2) return `${items[0]} and ${items[1]}`
    
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
  }

  splitIntoPages(text, targetPages) {
    const paragraphs = text.split('\n\n').filter(p => p.trim())
    const pages = []
    
    const paragraphsPerPage = Math.ceil(paragraphs.length / targetPages)
    
    for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
      const pageContent = paragraphs.slice(i, i + paragraphsPerPage).join('\n\n')
      pages.push(pageContent.trim())
    }
    
    return pages
  }

  async generateCompleteStory(storyId) {
    try {
      const story = await Story.findById(storyId).populate('userId')
      if (!story) {
        throw new Error('Story not found')
      }

      const child = story.userId.children.id(story.childId)
      if (!child) {
        throw new Error('Child not found')
      }

      const textPages = await this.generateStoryText(story.theme, child)
      
      const images = await this.generateImages(story.theme, child, textPages)

      const pages = textPages.map((text, index) => ({
        pageNumber: index + 1,
        text,
        imageUrl: images[index]?.imageUrl || null,
        imagePrompt: images[index]?.prompt || null
      }))

      story.pages = pages
      story.markCompleted()
      
      story.userId.storiesGenerated += 1
      await story.userId.save()
      
      await story.save()

      return story
    } catch (error) {
      console.error('Story generation error:', error)
      
      const story = await Story.findById(storyId)
      if (story) {
        story.markFailed(error.message)
        await story.save()
      }
      
      throw error
    }
  }
}

module.exports = new StoryGenerator()