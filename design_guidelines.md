# L&D Nexus Marketplace Design Guidelines

## Design Approach

**Reference-Based Approach** drawing from professional marketplace leaders:
- **Upwork**: Clean professional profiles, clear service listings, trust indicators
- **LinkedIn**: Credibility-focused profile layouts, endorsements, verification badges
- **Airbnb**: Portfolio-centric design, review prominence, clear booking flow
- **Stripe**: Minimal, trustworthy payment interfaces

**Core Principles:**
1. Trust & Credibility First - verification badges, ratings, and credentials prominently displayed
2. Bilingual Excellence - seamless Arabic/English switching with proper RTL support
3. Professional Polish - clean, corporate-appropriate aesthetic for B2B context
4. Scannable Information - busy professionals need quick decision-making

## Typography

**Font Families:**
- Primary: Inter (Latin script) - clean, professional, excellent readability
- Arabic: IBM Plex Sans Arabic - modern, matches Inter's weight system
- Accent: Space Grotesk for headings and standout elements

**Hierarchy:**
- Hero Headlines: 3xl to 5xl (48-60px desktop)
- Section Headers: 2xl to 3xl (32-40px)
- Card Titles: lg to xl (18-24px)
- Body Text: base (16px)
- Metadata: sm (14px)
- Labels/Badges: xs to sm (12-14px)

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (within cards): 2, 4
- Component spacing: 6, 8
- Section spacing: 12, 16, 20, 24
- Container max-width: 7xl (1280px)
- Content max-width: 5xl (1024px)

**Grid System:**
- Professional cards: 3-column on desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single mobile
- Service listings: 2-column desktop, single mobile
- Dashboard widgets: 4-column metrics, 2-column content

## Component Library

### Navigation
**Main Header:**
- Sticky navigation with logo left, centered search bar, user menu right
- Include language switcher (EN/AR toggle) with flag icons
- Two-tier: Top bar for account/settings, main nav for Browse/Post Job/Messages
- Mobile: Hamburger menu with slide-out drawer

**User Account Menu:**
- Avatar with status indicator (online/offline)
- Dropdown with quick actions, earnings, settings, logout

### Hero Section (Homepage)
**Layout:** Full-width split hero
- Left: Bold headline "Connect with Top L&D Professionals Across MENA", subheading, dual CTAs ("Find Talent" / "Offer Services")
- Right: Hero image showing diverse professionals in modern training environment
- Background: Subtle gradient overlay
- Search bar: Prominent centered search with filters ("Skills", "Location", "Budget")

**Images:** Use authentic photography of:
- Training sessions (diverse, professional, engaged participants)
- One-on-one coaching scenarios
- Modern office/co-working spaces

### Profile Cards (Professional Discovery)
**Structure:**
- Profile photo (circular, 80x80px with verification badge overlay)
- Name and headline (bold, truncated)
- Star rating (5-star display) + review count
- Skills (3-4 tags, pill-style)
- Price range badge
- Location + availability indicator
- Quick stats: Projects completed, Response time
- Hover: Slight elevation, "View Profile" CTA appears

### Service Listing Cards
- Service thumbnail image (16:9 ratio)
- Category badge (top-left corner)
- Title (truncated at 2 lines)
- Provider mini-profile (avatar + name)
- Price (prominent, right-aligned)
- Duration and delivery format icons
- Star rating inline

### Job Posting Cards
- Company logo (square, 48x48px)
- Job title and type badge
- Budget range + urgency indicator ("Urgent", "Featured")
- Skills required (tag list)
- Location + format (remote/hybrid/onsite icons)
- Posted time (relative)
- Application count

### Dashboards

**Professional Dashboard:**
- Top: Earnings summary cards (4-column: Total Earnings, Pending, This Month, Rating)
- Calendar widget: Week view of upcoming sessions
- Recent activity feed
- Service performance chart (views vs. conversions)
- Notification center (scrollable list)

**Company Dashboard:**
- Active projects kanban-style board (To Do, In Progress, Review, Complete)
- Hired professionals roster (avatar grid with names)
- Budget tracking visualization
- Quick actions: "Post New Job", "Invite Professional"

### Messaging Interface
- Three-column layout: Conversations list (left, 30%), message thread (center, 45%), profile sidebar (right, 25%)
- Message bubbles: Rounded, sender right-aligned, recipient left-aligned
- File attachments: Card preview with download icon
- Project context panel (pinned at top): Project name, milestone, budget
- Translation toggle per message (inline icon)

### Payment & Booking Flow
**Milestone-based Payment:**
- Progress tracker (visual timeline with checkpoints)
- Escrow status card (funds held, awaiting approval)
- Invoice preview (collapsible, PDF download)
- Payment method cards (saved cards with brand logos)
- Security badges: "Secured by Stripe", "SSL Encrypted"

### Forms
**Consistent Style:**
- Input fields: Subtle border, focus state with accent outline
- Labels: Above input, semibold, small text
- Helper text: Gray, smaller font
- Required indicator: Red asterisk
- File upload: Drag-and-drop zone with preview thumbnails
- Multi-select: Tag-style chips with remove icon

### Badges & Status Indicators
- Verification: Shield icon + "Verified" label (green)
- Top Rated: Star icon + gold accent
- Online Status: Small green dot on avatar
- Urgency: "Urgent" red badge, "Featured" blue badge
- Project Status: Color-coded pills (pending: yellow, active: blue, complete: green)

### Rating & Review Display
- Large star rating (average) at top of profile
- Review breakdown: 5-bar horizontal chart
- Individual reviews: Avatar, name, star rating, date, text (expandable)
- Helpful votes: Thumbs up counter

## Bilingual Support Implementation

**RTL Considerations:**
- Mirror entire layout for Arabic (navigation right-to-left)
- Flip card layouts and alignments
- Icons remain visual (don't flip), text flows RTL
- Date formats adapt to locale
- Number formatting (Arabic-Indic numerals optional)

**Language Switcher:**
- Prominent toggle in header (flag icons: 🇬🇧 / 🇸🇦)
- Persists user preference
- Inline translation buttons in messaging

## Images Strategy

**Hero Images:** Professional, diverse training scenarios (large, full-bleed on homepage)

**Profile Photos:** Circular crops, consistent sizing, verification badge overlay

**Service Thumbnails:** 16:9 ratio showcasing service deliverables or training in action

**Portfolio Uploads:** Grid gallery with lightbox expansion (3 columns, masonry on profile)

**Company Logos:** Square format, contained within cards (consistent sizing 48x48 to 80x80)

**Illustrations:** Minimal use for empty states ("No messages yet", "No projects") - simple line art style

**Background Patterns:** Subtle geometric patterns for section dividers (low opacity, non-distracting)

This design system creates a trustworthy, professional marketplace that prioritizes credibility and ease of use while supporting the bilingual MENA market.