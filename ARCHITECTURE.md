# Wildwood Booking - Architecture & Design Documentation

## Overview

Wildwood Booking is a wellness studio booking system designed for Cloudflare Pages with D1 database integration. The architecture prioritizes edge performance, client content management, and scalability while maintaining simplicity.

## Design Philosophy

### Core Principles
- **Edge-First**: All functionality optimized for Cloudflare Edge Runtime
- **Client-Managed Content**: Non-technical users can edit all site content
- **Zero-Maintenance**: Serverless architecture with no infrastructure management
- **Progressive Enhancement**: Graceful degradation when external services are unavailable

### Architecture Decisions

#### Why Cloudflare Pages + D1?
- **Global CDN**: Automatic edge caching for fast global performance
- **Serverless SQL**: D1 provides SQLite database without server management
- **Cost Effective**: Generous free tier with pay-as-you-go scaling
- **Integrated**: Native integration between Pages and D1
- **Edge Runtime**: Consistent execution environment across all deployments

#### Why Content Blocks Pattern?
- **Flexibility**: Client can add/remove content fields without code changes
- **Version Control**: All content changes tracked in database
- **Type Safety**: Structured content with defined types (text, html, number, boolean)
- **Performance**: Single database query for all content, cached at edge

## System Architecture

### Hosting Stack

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   Cloudflare     │    │   Cloudflare    │
│     Pages       │───▶│     D1 DB        │───▶│     KV Store    │
│   (Next.js)     │    │   (SQLite)       │    │   (Cache)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Edge Runtime  │    │   Content Data   │    │   Cached Assets │
│   (Node.js)     │    │   (JSON API)     │    │   (Static)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Browser       │    │   Next.js App    │    │   D1 Database   │
│                 │───▶│                  │───▶│                 │
│  - User Input   │    │  - API Routes    │    │  - Content      │
│  - Display UI   │    │  - Components    │    │  - Services     │
│  - Caching      │    │  - Edge Cache    │    │  - Bookings     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └──────────────────────▶│◀──────────────────────┘
                                │
                         ┌──────────────────┐
                         │   Fallback Data  │
                         │   (Mock Data)    │
                         └──────────────────┘
```

## Database Design

### Schema Overview

The database uses a simple, normalized structure with three main tables:

```sql
-- Content key-value store for site configuration
CREATE TABLE content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,              -- e.g., 'site_title', 'hero_subtitle'
  value TEXT NOT NULL,                   -- Content value
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services catalog with categories
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK (category IN ('studio', 'nature')),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  duration INTEGER NOT NULL DEFAULT 60,  -- minutes
  detail_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  has_detail_page BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Future booking functionality
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Content Management Strategy

The `content` table provides a simple key-value store for all site configuration:

#### Key Naming Convention
- **site_title**: Main site title
- **hero_title**: Hero section title
- **hero_subtitle**: Hero section subtitle
- **contact_phone**: Contact phone number
- **contact_email**: Contact email address
- **provider_subtitle**: Provider description/title

#### Service Data Structure
Services are stored as structured records with full CRUD capability:

```javascript
// Service record from database
{
  id: 1,
  category: "studio",
  title: "Massage Therapy",
  description: "Relaxing massage session",
  price: 120.00,
  duration: 60,
  detail_text: "Detailed description...",
  is_active: true,
  has_detail_page: true,
  created_at: "2026-02-17T09:41:47.000Z",
  updated_at: "2026-02-17T09:44:19.000Z"
}
```

## Application Architecture

### Component Hierarchy

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx               # Home page (content-driven)
├── book/
│   └── page.tsx           # Booking flow
├── admin/
│   └── page.tsx           # Content management (planned)
└── services/
    └── [slug]/
        └── page.tsx       # Individual service details

components/
├── BookingWizard.tsx      # Multi-step booking flow
├── ServiceColumns.tsx     # Service display grid
├── Hero.tsx              # Dynamic hero section
├── Navbar.tsx            # Navigation with contact info
└── AboutSidebar.tsx      # Contact information panel
```

### Data Access Layer

```javascript
lib/
├── db.ts                 # Unified D1 database access via getCloudflareContext()
├── data.ts              # Data fetching and processing
├── mock-data.ts         # Fallback data (for emergencies)
└── types.ts             # TypeScript definitions
```

#### Database Access Pattern
```javascript
// Single unified function for both environments
export async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB; // D1 binding from wrangler.toml
}
```

#### Content Data Flow
1. **Primary Source**: D1 database (same API in dev and prod)
2. **Development**: Local Miniflare D1 instance
3. **Production**: Cloudflare D1 managed database
4. **Type Safety**: Full TypeScript integration with proper D1 result casting

### State Management

#### Client-Side State
- **Booking Flow**: React state for multi-step wizard
- **Form Data**: Local state for user input
- **UI State**: Component-level state for interactions

#### Server-Side State
- **Content**: Fetched server-side, passed as props
- **Services**: Processed server-side for SEO and performance
- **Configuration**: Environment variables and database config

## Performance Architecture

### Caching Strategy

#### Edge Caching (Cloudflare)
- **Static Assets**: Automatic long-term caching
- **API Responses**: 15-minute cache for content data
- **HTML Pages**: Server-side rendering with edge caching

#### Browser Caching
- **Static Resources**: Cache headers for images, CSS, JS
- **API Calls**: Client-side caching for content data
- **Navigation**: Prefetching for improved UX

### Optimization Techniques

#### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based chunking
- **Dynamic Imports**: Lazy loading for admin features

#### Database Optimization
- **Single Query**: Fetch all content in one request
- **Connection Pooling**: D1 handles automatically
- **Query Caching**: Edge-level query result caching

## Security Architecture

### Authentication & Authorization
- **Admin Access**: Simple credential-based authentication
- **Content Editing**: Role-based access control
- **API Protection**: Route-level middleware

### Data Protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: React's built-in XSS prevention

### Privacy Considerations
- **Minimal Data Collection**: Only necessary booking information
- **Data Retention**: Configurable booking data retention
- **GDPR Compliance**: Privacy controls for user data

## Deployment Architecture

### Cloudflare Pages Pipeline

```
Git Push → Build → Deploy → Edge Distribution
    │         │         │           │
    │         │         │    ┌─────────────┐
    │         │         │    │   Global    │
    │         │         │    │    CDN      │
    │         │         │    └─────────────┘
    │         │    ┌─────────────┐
    │         │    │   D1 Bind   │
    │         │    │   Database  │
    │    ┌─────────────┐
    │    │   Next.js   │
    │    │   Build     │
    │    └─────────────┘
┌─────────────┐
│   Repository │
└─────────────┘
```

### Environment Configuration

#### Production (Cloudflare Pages)
- **Runtime**: Edge Runtime
- **Database**: D1 binding
- **Environment**: Production variables
- **Build**: Optimized production build

#### Development (Local)
- **Runtime**: Edge Runtime (via Miniflare)
- **Database**: Local D1 instance (Miniflare, stored in `.wrangler/state/`)
- **Environment**: Local variables
- **Build**: Development mode with hot reload
- **Init**: `initOpenNextCloudflareForDev()` in `next.config.ts` provides D1 bindings

## Scalability Architecture

### Horizontal Scaling
- **Edge CDN**: Automatic global distribution
- **Serverless**: Auto-scaling compute resources
- **Database**: D1 auto-scales with demand

### Vertical Scaling
- **Memory**: Edge runtime limits (128MB)
- **Compute**: Function duration limits
- **Storage**: D1 storage limits (500MB free tier)

### Performance Monitoring
- **Cloudflare Analytics**: Request metrics and performance
- **Core Web Vitals**: User experience metrics
- **Database Performance**: Query optimization monitoring

## Future Architecture Considerations

### Potential Enhancements
- **Multi-tenancy**: Support for multiple studios
- **Advanced Booking**: Recurring appointments, waitlists
- **Payment Integration**: Stripe/PayPal integration
- **Email Notifications**: Booking confirmations and reminders

### Migration Paths
- **Database Migration**: D1 to PostgreSQL if needed
- **Framework Migration**: Next.js to other frameworks
- **Hosting Migration**: Cloudflare to other providers

## Development Workflow

### Local Development
1. **D1 Setup**: `npx wrangler d1 execute wildwood-db --local --file schema.sql`
2. **Development Server**: `pnpm dev` (uses Miniflare edge runtime)
3. **Database Seeding**: Initial content via wrangler commands
4. **Testing**: Integration testing with local D1 (same API as production)

### Production Deployment
1. **Git Push**: Trigger automatic deployment
2. **Build Process**: Next.js production build
3. **Database Migration**: Apply schema changes
4. **Content Update**: Seed production content

### Monitoring & Maintenance
- **Error Tracking**: Cloudflare error monitoring
- **Performance**: Core Web Vitals tracking
- **Database**: Query performance analysis
- **Content**: Backup and restore procedures

This architecture provides a solid foundation for a scalable, maintainable booking system while keeping the complexity manageable for a single developer and enabling client content management without technical intervention.
