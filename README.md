# KidsStory - Personalized Children's Story Generator

A magical storytelling platform that creates personalized, AI-generated stories to help children overcome developmental challenges.

## 🌟 Features

- **Personalized Stories**: AI-generated stories featuring your child as the main character
- **Multiple Platforms**: iOS app and responsive web application
- **Story Themes**: Address common childhood challenges (fear of shoes, sleeping alone, tooth brushing, potty training)
- **AI-Generated Illustrations**: Custom character images using Gemini Banana API
- **Multiple Formats**: Interactive reading experience and downloadable PDFs

## 📱 Platforms

- **iOS App**: Native Swift/SwiftUI application
- **Web App**: React.js responsive web application
- **Backend API**: Node.js/Express server with AI integration

## 🏗 Project Structure

```
kids-story/
├── ios/                 # iOS application
├── web/                 # React web application  
├── backend/             # API server
├── docs/                # Documentation
└── PRD-KidsStoryApp.md  # Product Requirements Document
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- iOS development tools (Xcode 14+)
- Gemini Banana API key

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd kids-story

# Install backend dependencies
cd backend && npm install

# Install web dependencies  
cd ../web && npm install

# iOS dependencies
cd ../ios && pod install
```

### Environment Setup
Copy `.env.example` to `.env` in each platform directory and configure:
- Gemini Banana API credentials
- Database connection strings
- Storage service keys

## 🎯 Story Themes (Initial Release)

1. **Brave Steps** - Overcoming fear of wearing shoes
2. **Sweet Dreams Solo** - Learning to sleep alone  
3. **Brush Like a Hero** - Developing tooth brushing habits
4. **Big Kid Potty** - Independent toilet use

## 📊 Development Roadmap

- **Phase 1**: MVP with core story generation
- **Phase 2**: Audio narration and extended catalog
- **Phase 3**: Social features and multi-language support
- **Phase 4**: Advanced personalization and analytics

## 🛡 Privacy & Security

- COPPA compliant for children's data protection
- GDPR compliance for international users
- Secure AI API integration
- Minimal data collection principles

## 📄 License

This project is proprietary. All rights reserved.

## 👥 Contributing

Please read our contributing guidelines before submitting pull requests.

## 📞 Support

For support and questions, please contact: [support email]

---

**Built with ❤️ for families everywhere**