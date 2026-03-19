# Islamic Sphere - Frontend Overview

## About the Project

Islamic Sphere is a full-stack Islamic community and learning platform designed to help Muslims engage with their faith through education, community interaction, and daily practice tools. The frontend is a React-based single-page application that serves as the primary user interface.

## Tech Stack

- **Framework:** React 19 (Create React App)
- **Routing:** React Router DOM v7
- **Styling:** TailwindCSS 3 + Bootstrap 5 + custom CSS
- **HTTP Client:** Axios
- **Real-time Chat:** Stream Chat React SDK
- **Notifications:** Sonner + React Toastify
- **Icons:** React Icons
- **Date Utilities:** date-fns
- **Deployment:** Vercel

## Project Structure

```
frontend/
├── public/             # Static assets and index.html
├── src/
│   ├── apis/           # API service functions (Axios calls to backend)
│   ├── components/     # Reusable UI components (Navbar, Footer, Modals, etc.)
│   ├── context/        # React Context providers (AuthContext)
│   ├── images/         # Image assets
│   ├── pages/          # Page-level components (one per route)
│   ├── App.js          # Root component with route definitions
│   └── index.js        # Application entry point
├── tailwind.config.js  # TailwindCSS configuration
├── vercel.json         # Vercel deployment configuration
└── package.json        # Dependencies and scripts
```

## Key Features

### Authentication
- User signup and login
- Email verification with resend functionality
- Forgot/reset password flow

### Community
- **Groups** - Create and join community groups with detailed group pages
- **Group Chat** - Real-time messaging powered by Stream Chat
- **Polls & Tasks** - Collaborative polls and task management within groups
- **Progress History** - Track group activity and member progress

### Islamic Learning
- **Learning Paths** - Structured educational content covering:
  - Prayer (Salah)
  - Zakat
  - Hajj & Umrah
  - Quranic Studies
  - Islamic Character Development
- **Quran Reader** - In-app Quran reading experience
- **Scholar Sessions** - Access to sessions with Islamic scholars

### Tools & Utilities
- **Aura/Emotion Scanner** - Emotional well-being assessment tool
- **AI Chatbot** - AI-powered Islamic knowledge assistant (backed by Anthropic Claude)
- **Q&A** - Community question and answer system
- **Events** - Discover and manage Islamic events

### Support & Information
- Contact page
- Support/help center
- FAQ
- About page
- Terms of Service
- Privacy Policy

## Backend Integration

The frontend communicates with an Express.js backend running on port 3000, which provides:

- **Database:** MongoDB via Mongoose
- **Authentication:** Passport.js with JWT strategy
- **File Uploads:** Multer
- **Email:** Nodemailer
- **SMS:** Twilio
- **AI:** Anthropic Claude SDK
- **Real-time Chat:** Stream Chat server SDK
- **Scheduling:** node-cron for scheduled tasks

## Admin Panel

A separate admin panel application exists alongside the frontend for platform administration and event management.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3001 |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm run build:css` | Build TailwindCSS output |
