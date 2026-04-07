# Technical Architecture Specification

## 1. Overview

ClassPartner is an AI-powered academic productivity platform that helps students create, refine, and submit high-quality assignments. The platform supports both free tier (via OpenRouter auto-free APIs) and paid tiers (OpenAI and Claude APIs).

## 2. Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **API**: REST + GraphQL (optional)
- **Authentication**: JWT-based with refresh tokens

### AI Integration
- **Free Tier**: OpenRouter auto-free APIs (5+ API keys for load balancing)
- **Paid Tier**: OpenAI API (GPT-4) + Anthropic API (Claude)
- **Rate Limiting**: Per-user quotas and tier-based limits

### Infrastructure
- **Deployment**: Vercel (frontend), Railway/Render (backend)
- **Database Hosting**: Supabase or Neon (PostgreSQL)
- **File Storage**: AWS S3 or Supabase Storage

## 3. System Architecture

### 3.1 Core Components

1. **User Management Service**
   - Authentication (signup, login, password reset)
   - Role-based access (student, teacher, admin)
   - Subscription management

2. **AI Content Generation Service**
   - Prompt processing and optimization
   - Multi-provider fallback (OpenRouter → OpenAI → Claude)
   - Content caching and rate limiting

3. **Document Generation Service**
   - Template-based document creation
   - Format conversion (PDF, DOCX, PPT)
   - Plagiarism detection integration

4. **Admin Dashboard**
   - User management
   - API key management
   - Analytics and reporting

5. **Customer Dashboard**
   - Project management
   - Document history
   - Subscription management

## 4. Database Schema (High-Level)

### Core Tables
- `users` - User accounts and profiles
- `subscriptions` - Tier and billing info
- `projects` - User projects/assignments
- `documents` - Generated documents
- `api_keys` - OpenRouter and other API keys
- `usage_logs` - API usage tracking

## 5. API Keys Strategy

For free tier with OpenRouter:
- Maintain pool of 5+ API keys
- Implement key rotation logic
- Monitor usage and auto-failover
- Keys stored encrypted in database

## 6. Security Considerations

- All API keys encrypted at rest
- Rate limiting per user tier
- Input sanitization for AI prompts
- CSRF protection
- HTTPS everywhere

## 7. Development Phases

1. **Phase 1**: Core infrastructure (auth, database, basic UI)
2. **Phase 2**: AI integration with OpenRouter free tier
3. **Phase 3**: Admin dashboard
4. **Phase 4**: Paid tier with OpenAI/Claude
5. **Phase 5**: Document generation and export
6. **Phase 6**: Polish and optimization