# Claude Code Project Configuration

## Project Overview
KidsStory - Personalized Children's Story Generator
A platform that creates AI-generated personalized stories to help children overcome developmental challenges.

## Development Commands

### Backend
```bash
# Start development server
cd backend && npm run dev

# Run tests
cd backend && npm test

# Build for production
cd backend && npm run build

# Lint code
cd backend && npm run lint

# Type checking
cd backend && npm run typecheck
```

### Web Application
```bash
# Start development server
cd web && npm start

# Run tests
cd web && npm test

# Build for production
cd web && npm run build

# Lint code
cd web && npm run lint

# Type checking (if TypeScript)
cd web && npm run typecheck
```

### iOS Application
```bash
# Install dependencies
cd ios && pod install

# Open in Xcode
cd ios && open KidsStory.xcworkspace

# Build for simulator
cd ios && xcodebuild -workspace KidsStory.xcworkspace -scheme KidsStory -destination 'platform=iOS Simulator,name=iPhone 14'

# Run tests
cd ios && xcodebuild test -workspace KidsStory.xcworkspace -scheme KidsStoryTests -destination 'platform=iOS Simulator,name=iPhone 14'
```

## Project Structure
```
kids-story/
├── backend/                 # Node.js API server
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── .env.example
├── web/                     # React web application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── ios/                     # iOS application
│   ├── KidsStory/
│   ├── KidsStoryTests/
│   ├── Podfile
│   └── KidsStory.xcworkspace
├── docs/                    # Documentation
├── PRD-KidsStoryApp.md     # Product Requirements Document
└── README.md               # Project overview
```

## Key Technologies
- **Backend**: Node.js, Express, PostgreSQL, MongoDB
- **Web**: React.js, TypeScript (optional)
- **iOS**: Swift, SwiftUI
- **AI APIs**: Gemini Banana (images), OpenAI/Claude (text)
- **Storage**: AWS S3
- **Authentication**: Firebase Auth

## Environment Variables

### Backend (.env)
```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kidsstory
MONGODB_URI=mongodb://localhost:27017/kidsstory

# AI APIs
GEMINI_BANANA_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=kidsstory-assets

# Auth
FIREBASE_PROJECT_ID=your_firebase_project
JWT_SECRET=your_jwt_secret

# Email
SENDGRID_API_KEY=your_sendgrid_key
```

### Web (.env)
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_FIREBASE_CONFIG=your_firebase_config
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## API Endpoints
- `POST /api/stories/create` - Initialize story creation
- `POST /api/stories/generate` - Generate story with AI
- `GET /api/stories/{id}` - Retrieve specific story
- `GET /api/stories/library` - User's story collection
- `POST /api/stories/{id}/pdf` - Generate PDF version
- `GET /api/themes` - Available story themes

## Story Themes
1. **Brave Steps** - Overcoming fear of wearing shoes
2. **Sweet Dreams Solo** - Learning to sleep alone
3. **Brush Like a Hero** - Tooth brushing habits
4. **Big Kid Potty** - Independent toilet use
5. **Future themes**: Sharing toys, trying new foods, doctor visits

## Development Workflow
1. Create feature branch from main
2. Develop and test locally
3. Run linting and type checking
4. Create pull request
5. Deploy to staging for testing
6. Deploy to production

## Testing Strategy
- Unit tests for all backend services
- Integration tests for AI workflows
- UI tests for critical user paths
- Performance testing for story generation

## Deployment
- **Backend**: AWS ECS or Heroku
- **Web**: Vercel or Netlify
- **iOS**: App Store Connect
- **Database**: AWS RDS (PostgreSQL), MongoDB Atlas

## Privacy & Compliance
- COPPA compliance for children's data
- GDPR compliance for international users
- Data retention: 2 years for inactive accounts
- Secure storage of children's photos and personal information

## Quality Standards
- Story generation success rate > 95%
- Content appropriateness score > 4.8/5
- Technical bug reports < 1% of sessions
- App performance: < 3 second load times

## Support & Documentation
- Product Requirements: PRD-KidsStoryApp.md
- API Documentation: docs/api.md
- User Guide: docs/user-guide.md
- Developer Guide: docs/development.md