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

### Content Blocks Strategy

The `content_blocks` table implements a key-value store pattern:

```sql
CREATE TABLE content_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,           -- Unique identifier
  value TEXT NOT NULL,                -- Content value (JSON for complex data)
  type TEXT NOT NULL DEFAULT 'text',  -- Content type for UI rendering
  description TEXT,                   -- Human-readable description
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Content Type System
- **text**: Simple string values (titles, phone numbers)
- **html**: Rich HTML content (descriptions, formatted text)
- **number**: Numeric values (prices, durations)
- **boolean**: Toggle values (feature flags, visibility)
- **json**: Complex structured data (service arrays, settings)

#### Key Naming Convention
- **site_***: Global site settings
- **hero_***: Hero section content
- **contact_***: Contact information
- **studio_N_***: Studio service fields (N=1-10)
- **nature_N_***: Nature service fields (N=1-10)
- **booking_***: Booking flow configuration

### Service Data Structure

Services are stored as individual content blocks but assembled into structured objects:

```javascript
// Raw content blocks
{
  "studio_1_title": "Massage Therapy",
  "studio_1_about": "Relaxing massage session",
  "studio_1_price": "120",
  "studio_1_length": "60"
}

// Assembled service object
{
  "slug": "massage-therapy",
  "name": "Massage Therapy",
  "about": "Relaxing massage session",
  "price": 120,
  "duration": 60,
  "category": "studio"
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
├── content-data.ts       # D1 database integration
├── mock-data.ts         # Fallback data
└── types.ts             # TypeScript definitions
```

#### Content Data Flow
1. **Primary Source**: D1 database via Cloudflare API
2. **Edge Caching**: 15-minute cache at Cloudflare edge
3. **Fallback**: Local mock data if database unavailable
4. **Type Safety**: Full TypeScript integration

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
- **Runtime**: Node.js
- **Database**: Local D1 instance
- **Environment**: Local variables
- **Build**: Development mode with hot reload

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
1. **D1 Local**: `wrangler d1 execute --local`
2. **Development Server**: `pnpm dev`
3. **Database Seeding**: Initial content setup
4. **Testing**: Integration testing with local D1

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
