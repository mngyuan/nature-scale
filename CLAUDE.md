# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm install          # Install dependencies
npm run dev         # Start development server with Turbopack
npm run build       # Build production bundle
npm run start       # Start production server
npm run lint        # Run ESLint

# Access development server at http://localhost:3000
```

## Architecture Overview

This is a **Next.js 15 application** with the following architecture:

### Frontend (Next.js + React)

- **App Router**: Uses Next.js App Router with server and client components
- **UI Components**: Radix UI primitives with Tailwind CSS styling in `src/components/ui/` (installed via shadcn/ui)
- **Authentication**: Supabase Auth with middleware-based route protection
- **Styling**: Tailwind CSS with custom design system

### Backend Services

- **Supabase**: PostgreSQL database with Auth, real-time subscriptions
- **R API**: Dockerized R backend (`/rsrc/`) for scientific computations
  - Plumber API framework for R endpoints
  - Geospatial analysis with SF/Terra packages
  - Forecasting and statistical modeling modules

### Key Architectural Patterns

- **Server Actions**: Used for form handling and server-side operations
- **API Routes**: Proxy requests to R backend at `/api/*/route.ts`
- **Type Safety**: TypeScript with generated Supabase types
- **Authentication Flow**: Supabase Auth with middleware protection

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Route groups for authenticated pages
│   │   ├── dashboard/     # Main dashboard interface
│   │   ├── auth/          # Authentication pages
│   │   └── profile/       # User profile management
│   ├── api/               # API routes (proxy to R backend)
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # Radix UI components
│   └── [Feature]Form.tsx  # Form components
├── lib/                   # Utilities and configuration
│   ├── supabase/         # Supabase client and types
│   └── constants.ts       # App constants
└── hooks/                 # Custom React hooks

rsrc/                      # R backend API
├── api.r                  # Main Plumber API
├── Module1/               # Geospatial analysis
├── Module2/               # Forecasting models
└── Data/                  # Geospatial datasets
```

## Development Workflow

1. **Database Changes**: Update Supabase schema, regenerate types
2. **R Backend**: Modify `/rsrc/` files
3. **Frontend**: Use existing UI components from `src/components/ui/`
4. **New UI Components**: Install via shadcn/ui first, then customize as needed
5. **Forms**: Follow React Hook Form + Zod validation pattern
6. **Authentication**: Use Supabase client from `src/lib/supabase/`

## Environment Variables

Required for development:

```bash
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Required for production:

```bash
NEXT_PUBLIC_R_API_BASE_URL=<r-api-base-url>
```

## Key Dependencies

- **Next.js 15**: App Router, Server Components
- **Supabase**: Authentication, PostgreSQL, real-time
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Styling with Radix UI components
- **React Hook Form + Zod**: Form validation
- **R Backend**: Plumber, SF, Terra, dplyr packages
