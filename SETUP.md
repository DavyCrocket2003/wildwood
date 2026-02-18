# Wildwood Booking - Development & Deployment Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

## Database Setup

This project uses Cloudflare D1 for both development and production. The `@opennextjs/cloudflare` adapter provides a local Miniflare D1 instance during development.

### Development Database

1. Initialize the local D1 database (creates tables and seeds data):

```bash
# Apply schema to local D1 (stored in .wrangler/state/)
npx wrangler d1 execute wildwood-db --local --file schema.sql

# Seed with existing data (optional - if migrating from dev.db)
# Run the migration script which copies data from dev.db to local D1
pnpm migrate:dev
```

### Production Database

1. Deploy schema to remote D1:

```bash
# Apply schema to production D1
npx wrangler d1 execute wildwood-db --remote --file schema.sql
```

## Development Workflow

```bash
# Install dependencies
pnpm install

# Start development server (uses local Miniflare D1)
pnpm dev

# Build for production (uses Cloudflare D1)
pnpm build

# Deploy to Cloudflare Pages
pnpm deploy
```

## Features Implemented

### Authentication
- Simple hardcoded admin authentication
- 24-hour session cookies
- Admin login page at `/admin`
- Logout functionality

### Content Editing
- Inline editing for hero title and subtitle
- Contact information editing in AboutSidebar
- Icon-based edit/save buttons
- Background color feedback when editing
- Per-element edit scope

### Database Schema
- `content` table for key-value site content
- `services` table for studio/nature services
- `bookings` table for future booking functionality

### Database Architecture
- **Development**: Local Miniflare D1 (stored in `.wrangler/state/`)
- **Production**: Cloudflare D1 (managed by Wrangler)
- **Access**: Single `getDB()` function using `getCloudflareContext()` from `@opennextjs/cloudflare`
- **Runtime**: All API routes use edge runtime (`export const runtime = 'edge'`)
- **No fallbacks**: Same D1 code path in both environments

### API Routes
- `/api/auth/login` - Admin login
- `/api/auth/logout` - Admin logout  
- `/api/auth/status` - Check authentication status
- `/api/content/[key]` - CRUD for content
- `/api/services` - List/create services
- `/api/services/[id]` - Update/delete services

## Usage

1. Set up environment variables (`.env.local`)
2. Initialize local D1 database: `npx wrangler d1 execute wildwood-db --local --file schema.sql`
3. Start development server: `pnpm dev`
4. Visit `/admin` to log in
5. Edit buttons will appear on content when logged in
6. Click edit icons to modify content inline
7. Use logout button to return to normal view

## Deployment

The project is configured for Cloudflare Pages deployment:

```bash
# Build and deploy
pnpm deploy

# Or manually:
pnpm build
# Deploy the .vercel/output directory to Cloudflare Pages
```

All API routes automatically use the edge runtime, satisfying Cloudflare Pages requirements.

## Security Notes

- Admin credentials stored in environment variables only
- HTTP-only cookies for session management
- Server-side validation for all content updates
- No admin dashboard - only inline editing on public pages
