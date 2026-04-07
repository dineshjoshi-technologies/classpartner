# Phase 1 Implementation Plan

## Project Structure
```
classpartner/
├── frontend/          # Next.js 14 app
│   ├── app/           # App router
│   ├── components/    # React components
│   ├── lib/            # Utilities
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── middleware/# Auth, rate limiting
│   │   ├── services/  # Business logic
│   │   └── index.ts
│   └── package.json
└── prisma/            # Database schema
    └── schema.prisma
```

## Tasks
1. Initialize Next.js frontend with Tailwind
2. Initialize Express backend
3. Create Prisma schema (users, subscriptions, projects, documents)
4. Implement auth (signup, login with JWT)
5. Build basic landing page UI