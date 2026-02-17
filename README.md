# Wildwood Booking

A Next.js application for Wildwoods Studio that provides booking services for wellness sessions. The application uses Cloudflare Pages with D1 database for content management and client editing capabilities.

## Project Overview

Wildwood Booking is a wellness studio booking system that allows clients to:
- Browse studio and nature-based services
- Book appointments through a multi-step wizard
- Manage content through an admin interface

## Technology Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Hosting**: Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Runtime**: Edge runtime (Cloudflare optimized)

## Architecture

### Database Schema (D1)

#### `content_blocks` Table
Stores all editable content for the client admin interface:

```sql
CREATE TABLE content_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text', -- 'text', 'html', 'number', 'boolean'
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Content Block Keys
- `site_title` - Website title
- `hero_title` - Main hero section title
- `hero_subtitle` - Hero section subtitle
- `contact_phone` - Business phone number
- `contact_email` - Business email address
- `studio_N_title` - Studio service titles (N=1-10)
- `studio_N_about` - Studio service descriptions
- `studio_N_price` - Studio service pricing
- `studio_N_length` - Studio service duration
- `nature_N_title` - Nature service titles (N=1-10)
- `nature_N_about` - Nature service descriptions
- `nature_N_price` - Nature service pricing
- `nature_N_length` - Nature service duration

### Data Flow

1. **Content Management**: Client logs in to admin dashboard to edit content_blocks
2. **Public Display**: Website fetches content from D1 database
3. **Caching**: Edge caching with 15-minute revalidation
4. **Fallback**: Mock data if database is unavailable

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager
- Cloudflare account with D1 database

### Local Development

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Initialize D1 database:
```bash
npx wrangler d1 create wildwood-booking
# Update wrangler.toml with the database ID
npx wrangler d1 execute wildwood-booking --file=schema.sql
```

4. Seed initial content:
```bash
npx wrangler d1 execute wildwood-booking --file=seed.sql
```

5. Run development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Commands

```bash
# Local development
npx wrangler d1 execute wildwood-booking --local --command="SELECT * FROM content_blocks"

# Production
npx wrangler d1 execute wildwood-booking --command="SELECT * FROM content_blocks"

# Backup data
npx wrangler d1 export wildwood-booking --output=backup.sql
```

## Deployment

### Cloudflare Pages Deployment

1. Connect your repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `pnpm build`
   - Build output directory: `.next`
   - Node.js version: `18`

3. Set environment variables in Cloudflare dashboard:
   - `D1_DATABASE`: Your D1 database binding name
   - `DATABASE_URL`: D1 database URL (if needed)

4. Deploy automatically on push to main branch

### Environment Variables

```env
# Cloudflare D1
D1_DATABASE=wildwood-booking
DATABASE_URL=your-d1-url

# Optional: Admin credentials
ADMIN_EMAIL=admin@wildwoods.com
ADMIN_PASSWORD=your-secure-password
```

## Content Management

### Client Admin Interface

The client can edit content through the admin dashboard at `/admin`:

1. **Login**: Use admin credentials to access the dashboard
2. **Edit Content**: Modify text, HTML, numbers, and boolean values
3. **Preview Changes**: See changes in real-time
4. **Save Updates**: Changes are saved to D1 database immediately

### Content Types

- **Text**: Simple text content (titles, descriptions)
- **HTML**: Rich text content (formatted descriptions)
- **Number**: Numeric values (prices, durations)
- **Boolean**: Toggle values (feature flags)

## API Endpoints

### Public Content API
- `GET /api/content` - Fetch all public content
- `GET /api/services` - Fetch services data
- `GET /api/content/:key` - Fetch specific content block

### Admin API
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/content` - Get all content blocks
- `PUT /api/admin/content/:key` - Update content block
- `POST /api/admin/content` - Create new content block

## Development Workflow

### Adding New Content Fields

1. Add the content block to the database:
```sql
INSERT INTO content_blocks (key, value, type, description) 
VALUES ('new_field', 'default value', 'text', 'Description of this field');
```

2. Update the data fetching logic in `lib/content-data.ts`
3. Use the content in your components

### Database Migrations

Create migration files in the `migrations/` directory:

```sql
-- migrations/001_add_new_field.sql
ALTER TABLE content_blocks ADD COLUMN new_column TEXT;
```

Run migrations:
```bash
npx wrangler d1 execute wildwood-booking --file=migrations/001_add_new_field.sql
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with D1 database
5. Submit a pull request

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Cloudflare Pages](https://developers.cloudflare.com/pages/) - hosting platform
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - serverless SQL database
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
