# SignLex Frontend - Next.js Application

## Author: Pawan Rijal (Frontend Lead)

## Overview
This module contains the SignLex web application frontend built with:
- **Next.js 14** (React-based framework with routing and SSR)
- **Tailwind CSS** (utility-first styling)
- **Firebase Auth** (user authentication)
- **React Webcam** (camera integration for gesture practice)

## Project Structure
```
pawan/
├── src/
│   ├── app/
│   │   ├── layout.js           # Root layout with navigation
│   │   ├── page.js             # Landing page
│   │   ├── login/page.js       # Login screen
│   │   ├── signup/page.js      # Signup screen
│   │   ├── dashboard/page.js   # User dashboard (stub)
│   │   ├── learn/page.js       # Learning modules (stub)
│   │   ├── practice/page.js    # Webcam practice (stub)
│   │   ├── test/page.js        # Mock tests (stub)
│   │   ├── leaderboard/page.js # Leaderboard (stub)
│   │   └── profile/page.js     # User profile (stub)
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthForm.js     # Shared login/signup form
│   │   ├── layout/
│   │   │   ├── Navbar.js       # Navigation bar
│   │   │   └── Footer.js       # Footer component
│   │   └── ui/
│   │       └── Button.js       # Reusable button component
│   ├── lib/
│   │   └── firebase.js         # Firebase configuration
│   └── styles/
│       └── globals.css         # Tailwind directives + global styles
├── public/                     # Static assets
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── package.json
```

## Current Status (Report Meeting #1)
- **Goal 1 (Frontend Scaffold): ~30% complete**
  - Next.js project initialized with routing
  - Tailwind CSS configured with custom theme
  - Core page structure created (landing, dashboard, learn, practice, test, leaderboard)
  - Responsive layout and navigation bar implemented
  
- **Goal 2 (Firebase Auth UI): ~15% complete**
  - Firebase config file created
  - Login/signup page shells with form layout
  - Form validation and auth logic TODO
  
- **Goal 3 (Learning Modules UI): ~10% complete**
  - Placeholder pages for flashcards, drills, tests
  - Component stubs defined
  - Animations and interactivity TODO

## Setup
```bash
npm install
npm run dev
# Open http://localhost:3000
```
