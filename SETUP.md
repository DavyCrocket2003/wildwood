# Wildwood Booking - Auth System Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

## Database Setup

1. Run the database migration to create the required tables:

```bash
# Using Wrangler (Cloudflare CLI)
npx wrangler d1 execute wildwood-db --file migrations/001_initial_schema.sql
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

### API Routes
- `/api/auth/login` - Admin login
- `/api/auth/logout` - Admin logout  
- `/api/auth/status` - Check authentication status
- `/api/content/[key]` - CRUD for content
- `/api/services` - List/create services
- `/api/services/[id]` - Update/delete services

## Usage

1. Set up environment variables
2. Run database migration
3. Visit `/admin` to log in
4. Edit buttons will appear on content when logged in
5. Click edit icons to modify content inline
6. Use logout button to return to normal view

## Security Notes

- Admin credentials stored in environment variables only
- HTTP-only cookies for session management
- Server-side validation for all content updates
- No admin dashboard - only inline editing on public pages
