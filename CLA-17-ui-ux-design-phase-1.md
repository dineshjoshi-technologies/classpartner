# ClassPartner UI/UX Design Specification - Phase 1

## Overview

This document outlines the Phase 1 UI/UX designs for ClassPartner, an AI-powered academic productivity platform. The designs follow the brand guidelines from the marketing plan and focus on creating an intuitive, trustworthy experience for students.

---

## 1. Design System

### 1.1 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Deep Blue) | `#1E40AF` | CTAs, headers, primary buttons |
| Primary Light | `#3B82F6` | Hover states, links |
| Primary Dark | `#1E3A8A` | Active states, emphasis |
| Secondary (Green) | `#10B981` | Success states, progress indicators |
| Secondary Light | `#34D399` | Hover on success elements |
| Accent (Orange) | `#F59E0B` | Highlights, notifications, badges |
| Background | `#F8FAFC` | Main page background |
| Surface | `#FFFFFF` | Cards, modals, input backgrounds |
| Text Primary | `#1E293B` | Main body text |
| Text Secondary | `#64748B` | Secondary text, labels |
| Border | `#E2E8F0` | Dividers, input borders |
| Error | `#EF4444` | Error states, validation |

### 1.2 Typography

- **Font Family**: Inter (Google Fonts) - clean, modern, highly legible
- **Heading 1**: 32px, font-weight 700, line-height 1.2
- **Heading 2**: 24px, font-weight 600, line-height 1.3
- **Heading 3**: 20px, font-weight 600, line-height 1.4
- **Body**: 16px, font-weight 400, line-height 1.6
- **Body Small**: 14px, font-weight 400, line-height 1.5
- **Caption**: 12px, font-weight 500, line-height 1.4

### 1.3 Spacing System

- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Container max-width: 1200px
- Content max-width: 800px

### 1.4 Component Library

#### Buttons
- **Primary**: bg-primary, text-white, rounded-lg (8px), py-3 px-6
- **Secondary**: bg-transparent, border-primary, text-primary, rounded-lg
- **Ghost**: bg-transparent, text-secondary, hover:bg-gray-100
- **States**: hover (brightness 110%), active (brightness 90%), disabled (opacity 50%)

#### Cards
- bg-surface, rounded-xl (12px), shadow-sm, border border-gray-100
- Padding: 24px

#### Inputs
- bg-surface, border-border, rounded-lg, py-3 px-4
- Focus: ring-2 ring-primary/30, border-primary
- Error: border-error, ring-error/30

#### Badges
- Small: py-1 px-2, rounded-full, text-xs
- Status badges: Free (green), Pro (blue), Team (orange)

---

## 2. Landing Page

### 2.1 Hero Section

**Layout**: Full-width, centered content

**Components**:
- Tagline: "Your AI Academic Companion" - H1, centered
- Subheadline: "From idea to submission in minutes—not hours" - Body Large, text-secondary
- Two CTAs: "Get Started Free" (Primary) + "See How It Works" (Secondary)
- Hero illustration: Student with laptop, floating document elements
- Background: Subtle gradient from primary/5 to white

**Responsive**:
- Mobile: Stack CTAs vertically, smaller text
- Tablet: Side-by-side CTAs
- Desktop: Full layout with illustration

### 2.2 Features Section

**Layout**: 3-column grid on desktop, 1-column mobile

**Feature Cards** (3 total):
1. **AI Writing Assistant** - Icon: sparkles, description, learn more link
2. **Multi-Format Export** - Icon: document, description, learn more link
3. **Plagiarism Safety** - Icon: shield-check, description, learn more link

### 2.3 Pricing Preview Section

**Layout**: 3 cards (Free, Pro, Team)

**Card Structure**:
- Tier name (H3)
- Price + period
- Feature list (checkmarks)
- CTA button

### 2.4 Social Proof Section

**Components**:
- "Used by 10,000+ students" - prominent text
- Testimonial carousel (3 testimonials)
- University/partner logos (placeholders)

### 2.5 Footer

**Columns**:
- Logo + tagline
- Product links
- Company links
- Legal links
- Social icons

---

## 3. Authentication Screens

### 3.1 Login Page

**Layout**: Split screen - form on left, illustration on right (desktop), stacked (mobile)

**Form Fields**:
- Email input with label
- Password input with "Forgot password?" link
- "Remember me" checkbox
- Login button (Primary)
- "Don't have an account? Sign up" link

**Social Login**:
- "Continue with Google" button
- "Continue with GitHub" button (optional)

**Visual**:
- Logo at top
- Welcome back message
- Subtle background pattern

### 3.2 Signup Page

**Layout**: Same as login

**Form Fields**:
- Full name input
- Email input
- Password input (with strength indicator)
- Confirm password input
- Terms of service checkbox
- Sign up button (Primary)

**Progress indicator**: Shows steps if multi-step signup

### 3.3 Forgot Password Page

**Layout**: Centered card

**Form**:
- Email input
- "Send Reset Link" button
- "Back to login" link

---

## 4. User Dashboard

### 4.1 Dashboard Layout

**Structure**:
- Sidebar navigation (240px width, collapsible on mobile)
- Main content area
- Top bar with user info

### 4.2 Sidebar Navigation

**Items**:
1. Dashboard (home icon) - active by default
2. Projects (folder icon)
3. Documents (file icon)
4. Templates (layout icon)
5. Settings (settings icon)

**Bottom items**:
- Upgrade to Pro (highlighted if free tier)
- Help & Support

### 4.3 Main Dashboard View

**Welcome Section**:
- "Welcome back, [Name]" - H2
- Quick stats: Projects count, Documents generated, Usage percentage

**Recent Projects**:
- List of 3-5 most recent projects
- Each card: title, last modified, status badge, quick actions

**Quick Actions**:
- "New Project" button (Primary)
- "Continue Last Project" button
- "Browse Templates" link

**Usage Banner** (for free tier):
- Progress bar showing usage
- "X of 3 essays remaining this month"
- "Upgrade to Pro" CTA

### 4.4 Projects Page

**Layout**: Grid of project cards (3 columns desktop)

**Project Card**:
- Title
- Type badge (Essay, Presentation, etc.)
- Last modified date
- Status: Draft, In Progress, Completed
- Quick actions: Edit, Duplicate, Delete

**Filters**: All, In Progress, Completed, Draft

### 4.5 Document Editor View (Overview)

**Layout**:
- Document title (editable)
- Format selector (Essay, Presentation, etc.)
- AI prompt input area
- Generated content preview
- Export buttons (PDF, DOCX, PPT)
- Save button

---

## 5. Component States & Interactions

### 5.1 Loading States
- Skeleton screens for content loading
- Spinner for button loading (show "Generating..." text)
- Progress bar for document generation

### 5.2 Empty States
- Friendly illustration
- Descriptive message
- Clear CTA to create first item

### 5.3 Error States
- Red border on inputs
- Error message below input
- Toast notification for system errors

### 5.4 Success States
- Green checkmark animation
- Toast notification
- Success message in forms

---

## 6. Accessibility Requirements

- All interactive elements must be keyboard accessible
- Color contrast ratio: minimum 4.5:1 for text
- Form inputs must have associated labels
- Focus indicators visible on all interactive elements
- ARIA labels for icons and non-text elements
- Support for screen readers

---

## 7. Technical Implementation Notes (for CTO)

### 7.1 Technology Stack
- Next.js 14 with React
- Tailwind CSS for styling
- Zustand for state management (if needed)
- Framer Motion for animations (optional)

### 7.2 Recommended Approach
1. Create Tailwind config with design tokens
2. Build component library first (Button, Input, Card, Badge)
3. Implement pages in order: Landing → Auth → Dashboard
4. Add responsive breakpoints: mobile (<640px), tablet (640-1024px), desktop (>1024px)

### 7.3 Responsive Breakpoints in Tailwind
- Mobile first approach
- Use default for mobile, sm:, md:, lg:, xl: for larger screens

---

## 8. Deliverables

1. This design specification document
2. Implementation of design system in code
3. Landing page with all sections
4. Authentication flow (Login, Signup, Forgot Password)
5. User dashboard with sidebar navigation
6. Projects listing page

---

*Document prepared by UX Designer*
*Date: 2026-04-05*
*Related: [CLA-6 Marketing Plan](/CLA/issues/CLA-6)*