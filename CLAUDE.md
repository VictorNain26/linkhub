# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` - Start development server on http://localhost:3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks
- `pnpm test` - Run Vitest tests

### Database Operations
- `pnpm prisma:generate` - Generate Prisma client after schema changes
- `pnpm prisma:migrate` - Create and apply migrations (followed by migration name)
- `pnpm prisma:studio` - Open Prisma Studio database browser

### Package Management
Uses `pnpm` as package manager. Run `pnpm install` after pulling changes.

## Project Architecture

### Core Technologies
- **Framework**: Next.js 15.3 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with Google OAuth
- **Styling**: Tailwind CSS with custom theme system
- **Real-time**: Pusher for live updates
- **Testing**: Vitest with Testing Library

### Multi-tenant Architecture

This is a multi-tenant link shortening application where:

1. **Tenant System** (`src/lib/tenant.ts`):
   - Each user automatically gets a personal workspace on first login
   - Users can be members of multiple tenants with different roles (OWNER, ADMIN, USER)
   - Tenant context is determined by URL slug: `/dashboard/[tenant]/`

2. **Role-based Access Control** (`src/lib/rbac.ts`):
   - `assertRole()` function enforces minimum role requirements
   - Role hierarchy: OWNER (3) > ADMIN (2) > USER (1)

3. **Database Schema** (`prisma/schema.prisma`):
   - Users authenticate via NextAuth models
   - Links are scoped to tenants with unique slug constraints
   - Memberships link users to tenants with roles
   - Invites allow tenant onboarding with expiration and usage limits

### Key Application Flow

1. **Authentication**: Google OAuth via NextAuth with database sessions
2. **Tenant Selection**: Auto-created personal workspace or explicit tenant selection
3. **Link Management**: CRUD operations scoped to current tenant context
4. **Real-time Updates**: Pusher integration for live click tracking
5. **Theming**: Per-tenant customizable themes stored as JSON

### Directory Structure

- `src/app/` - Next.js App Router pages and API routes
  - `[tenant]/` - Public tenant pages
  - `dashboard/[tenant]/` - Protected tenant management
  - `api/auth/` - NextAuth endpoints
  - `p/[tenant]/[slug]/` - Link redirect handler
- `src/actions/` - Server actions for data mutations
- `src/lib/` - Utilities (Prisma, tenant context, RBAC, Pusher)
- `src/components/` - Reusable React components with shadcn/ui
- `prisma/` - Database schema and migrations

### Important Patterns

1. **Tenant Context**: Always use `getTenantContext()` or `currentTenant()` to get user's tenant membership and permissions before data operations
2. **Database Queries**: All link queries must include `tenantId` filter for proper isolation
3. **Role Checking**: Use `assertRole()` for protected operations requiring ADMIN/OWNER permissions
4. **Real-time**: Click tracking updates via Pusher for live dashboard metrics

### Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - OAuth credentials  
- `NEXTAUTH_SECRET` - Session encryption
- `PUSHER_APP_ID` / `PUSHER_KEY` / `PUSHER_SECRET` / `PUSHER_CLUSTER` - Real-time updates

### Development Notes

- Uses TypeScript with strict mode enabled
- Path alias `@/*` maps to `src/*`
- Database uses `cuid()` for primary keys
- Prisma binary targets include Docker environments
- TailwindCSS with custom CSS variables for theming