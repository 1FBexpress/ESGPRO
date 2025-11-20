
# Full Bin ESG Pro Interviewer

A conversational AI-powered lead qualification system for ESG consulting services with automated email notifications and booking management.

## Features

### Phase 1 (Current)

- 🤖 **Natural Conversational Interface** - Friendly chat-based lead qualification
- 📊 **Enhanced Lead Scoring Algorithm** - Weighted scoring based on:
  - Tender urgency (40 points max)
  - Company size (30 points max)
  - ESG maturity (25 points max)
  - Industry relevance (5 points bonus)
- 📧 **Automated Email Notifications** - SendGrid integration sends rich HTML emails to sales team with:
  - Lead details and contact information
  - AI-generated brief and focus points
  - Pricing recommendations with commission breakdown
  - Urgency-based action recommendations
- 📅 **Integrated Booking System** - In-app consultation booking with:
  - Pre-filled contact information
  - Date/time selection
  - Confirmation emails to leads
  - Sales team notifications
- 🎯 **Prominent CTAs** - Action-specific buttons with urgency indicators
- 📱 Mobile-responsive design
- 🎨 Clean, professional UI with Full Bin branding
- ⚡ Built with Next.js for optimal performance

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: CSS Modules with custom animations
- **State Management**: React Context API
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Email**: SendGrid (@sendgrid/mail)
- **Payments**: Stripe
- **Deployment**: Vercel

## Project Structure

```
esgpro/
├── components/          # React components
│   ├── Layout.js       # Main layout with header/footer
│   ├── ChatInterface.js # Main chat container
│   ├── Message.js      # Individual message component
│   ├── ResultsPanel.js # Results display with CTAs
│   ├── BookingForm.js  # 🆕 Consultation booking form
│   ├── TypingIndicator.js # Animated typing indicator
│   └── QuickReplyButtons.js # Quick reply options
├── context/            # State management
│   └── InterviewContext.js # Interview state
├── lib/                # Utility functions
│   ├── conversationFlow.js # Question logic & validation
│   ├── apiClient.js    # API communication
│   ├── emailService.js # 🆕 SendGrid email integration
│   └── email_template.html # 🆕 HTML email template
├── pages/              # Next.js pages
│   ├── api/
│   │   ├── interview.js # 🔄 Enhanced interview API with scoring
│   │   └── booking.js  # 🆕 Booking management API
│   ├── _app.js         # App wrapper
│   ├── _document.js    # HTML document
│   └── index.js        # Home page
├── styles/             # CSS modules
│   ├── globals.css
│   ├── Layout.module.css
│   ├── ChatInterface.module.css
│   ├── Message.module.css
│   ├── TypingIndicator.module.css
│   ├── ResultsPanel.module.css # 🔄 Enhanced with new CTA styles
│   ├── BookingForm.module.css  # 🆕 Booking form styles
│   └── Home.module.css
├── migrations.sql      # 🔄 Updated with bookings table
├── prices.json         # Product pricing data
└── package.json        # 🔄 Added @sendgrid/mail
```

🆕 = New file | 🔄 = Updated for Phase 1

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
cd esgpro
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (optional for development)
```bash
cp .env.example .env.local
```

Add your environment variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
STRIPE_SECRET_KEY=your_stripe_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `STRIPE_SECRET_KEY`
   - Any other required keys
5. Deploy!

### Environment Variables

For production deployment, set these in Vercel:

**Required for Phase 1:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Supabase anonymous/service key  
- `SENDGRID_API_KEY` - **REQUIRED** - SendGrid API key for email notifications
- `SENDGRID_FROM_EMAIL` - Sender email (default: notifications@full-bin.com)

**Optional:**
- `STRIPE_SECRET_KEY` - Stripe secret key for £50 assessment payments
- `CALENDLY_LINK` - Alternative to booking form (if set, consultation button links here)
- `TWILIO_SID` / `TWILIO_TOKEN` - For SMS notifications (future enhancement)

## Interview Flow

The chat collects the following information:

1. **Contact Name** - User's full name
2. **Email** - Contact email address
3. **Phone** - Contact phone number
4. **Company Name** - Company/organization name
5. **Company Size** - Small, medium, or large (or numeric)
6. **Tender Days** - Days until deadline (if applicable)
7. **Industry** - Business sector
8. **Current ESG Status** - Current state of ESG compliance
9. **Pain Points** - Main challenges/concerns

After collection, the system:
- **Calculates enhanced lead score (0-100)** using weighted algorithm:
  - Tender urgency: <30 days (40pt), 30-90 days (25pt), 90+ days (10pt)
  - Company size: Large (30pt), Medium (20pt), Small (10pt)
  - ESG maturity: Just starting (25pt), Some measures (15pt), Established (5pt)
  - Industry relevance: High-risk industries get bonus (5pt)
- **Determines urgency level**: high (<30 days), medium (30-90 days), low (90+ days)
- **Recommends action**: 
  - Score ≥70: BOOK_FREE_CONSULT
  - Score 40-69: BUY_50_ASSESSMENT
  - Score <40: NURTURE
- **Generates contextual focus points** based on lead data
- **Creates opening questions** for sales team
- **Suggests pricing tier** and SKU recommendations
- **Sends email notification** to sales team (4 recipients)
- **Shows prominent CTA** with booking form integration

## Phase 1 Features Setup

### 1. Email Notifications with SendGrid

#### Setup Steps:

1. **Create SendGrid Account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up for free account (100 emails/day free tier)
   - Verify your email address

2. **Get API Key**
   - Navigate to Settings → API Keys
   - Click "Create API Key"
   - Choose "Full Access" or "Restricted Access" with Mail Send permissions
   - Copy your API key (shown only once!)

3. **Verify Sender Email**
   - Go to Settings → Sender Authentication
   - Verify a single sender (notifications@full-bin.com or your domain)
   - Or set up domain authentication for better deliverability

4. **Configure Environment Variables**
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=notifications@full-bin.com
   ```

#### Email Recipients:

All lead notifications are automatically sent to:
- Christian@full-bin.com
- hj@esgpro.co.uk
- nl@esgpro.co.uk
- laurence@twinfm.com

To modify recipients, edit `lib/emailService.js`:
```javascript
const NOTIFICATION_RECIPIENTS = [
  'your-email@example.com'
];
```

#### Email Template:

The system uses a professionally designed HTML email template (`lib/email_template.html`) that includes:
- Urgency-based banner (color-coded by priority)
- Lead score visualization
- Complete contact information
- AI-generated brief
- Focus points and discussion questions
- Pricing recommendations with commission breakdown
- Direct "Contact Lead" button

### 2. Enhanced Lead Scoring

The Phase 1 scoring algorithm considers:

```javascript
// Tender Urgency (40 points)
< 30 days:     40 points  (CRITICAL)
30-90 days:    25 points  (MEDIUM)
> 90 days:     10 points  (LOW)

// Company Size (30 points)
Large (100+):  30 points
Medium (26-100): 20 points
Small (<26):   10 points

// ESG Maturity (25 points - inverse)
Just starting: 25 points  (highest opportunity)
Some measures: 15 points
Established:    5 points  (lowest opportunity)

// Industry Bonus (5 points)
High-risk industries: +5 points
(manufacturing, construction, energy, etc.)
```

**Example Lead Scores:**
- Large manufacturing company, tender in 20 days, just starting ESG: **100 points** → BOOK_FREE_CONSULT
- Medium company, tender in 60 days, some ESG measures: **55 points** → BUY_50_ASSESSMENT  
- Small company, no urgent tender, established ESG: **25 points** → NURTURE

### 3. Booking System

#### Features:
- **Pre-filled Data**: Contact info from interview auto-populates
- **Date/Time Selection**: Easy scheduling interface
- **Confirmation Emails**: Automatic confirmation to lead
- **Sales Notifications**: Team notified of new bookings
- **Database Storage**: All bookings saved to Supabase

#### Database Schema:

Run the updated `migrations.sql` to create the bookings table:

```sql
CREATE TABLE bookings (
  id uuid PRIMARY KEY,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  notes text,
  lead_score int,
  urgency text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

#### Alternative: Calendly Integration

If you prefer to use Calendly instead of the built-in booking form:

1. Create a Calendly event at [calendly.com](https://calendly.com)
2. Set environment variable:
   ```bash
   CALENDLY_LINK=https://calendly.com/your-account/esg-consultation
   ```
3. The "Book Consultation" button will now open Calendly instead

### 4. Results Display with CTAs

The results panel now features:
- **Large Action Icons**: Visual representation of next step
- **Urgency Indicators**: Color-coded badges and warnings
- **Prominent CTAs**: Action-specific buttons:
  - 🟣 **BOOK_FREE_CONSULT**: Purple "Schedule Free Consultation" button → Opens booking form
  - 🟢 **BUY_50_ASSESSMENT**: Green "Get £50 Assessment Now" button → Stripe checkout (coming soon)
  - 🟡 **NURTURE**: Orange "Subscribe to Updates" button → Newsletter signup
- **Trust Indicators**: "Powered by Full Bin" with credibility markers
- **Urgency Notes**: Special callout for high-urgency leads

## API Endpoints

### POST /api/interview

Submit interview data and receive qualification results. Automatically sends email notification to sales team.

**Request Body:**
```json
{
  "contact_name": "John Smith",
  "email": "john.smith@acmecorp.com",
  "phone": "+44 7700 900123",
  "company_name": "Acme Corp",
  "size": "medium",
  "tender_days": 25,
  "industry": "Manufacturing",
  "current_esg_status": "Just starting - no formal framework",
  "pain_points": "Need help with ESG reporting for public sector tender"
}
```

**Response:**
```json
{
  "action": "BOOK_FREE_CONSULT",
  "urgency": "high",
  "score": 90,
  "lead_brief": "John Smith from Acme Corp (medium Manufacturing company) is seeking ESG support. ⚠️ Urgent tender deadline in 25 days. Current ESG status: Just starting - no formal framework. Main concerns: Need help with ESG reporting for public sector tender. Lead score: 90/100 (high priority). Recommended action: BOOK_FREE_CONSULT.",
  "focus_points": [
    "🚨 CRITICAL: Tender deadline in 25 days - immediate action required",
    "medium company in Manufacturing - tailored ESG strategy needed",
    "Greenfield opportunity - can establish ESG framework from scratch",
    "📄 Reporting & documentation support critical",
    "✅ High-value lead - prioritize for free consultation booking"
  ],
  "opening_questions": [
    "What are the specific ESG requirements in the tender documentation?",
    "What's the deadline for tender submission and are there any key milestones?",
    "What specific ESG challenges is Acme Corp facing in Manufacturing?",
    "Do you have any existing ESG data, energy consumption records, or sustainability reports?",
    "What's your budget range for ESG consultancy and implementation?"
  ],
  "pricing_recommendation": {
    "tier": "Medium (26-100)",
    "sku_recs": ["ESG-3"],
    "suggested_products": [
      "ESG-3 - ESG Assessment & Strategy",
      "Carbon Footprint Analysis",
      "ESG Reporting & Documentation"
    ]
  },
  "contact_info": {
    "name": "John Smith",
    "company": "Acme Corp",
    "email": "john.smith@acmecorp.com",
    "phone": "+44 7700 900123"
  }
}
```

**Side Effects:**
- Sends HTML email to: Christian@full-bin.com, hj@esgpro.co.uk, nl@esgpro.co.uk, laurence@twinfm.com
- Email includes full lead details, scoring rationale, and action recommendations
- Lead data can be saved to Supabase (if configured)

### POST /api/booking

Submit a consultation booking request. Sends confirmation email to lead and notification to sales team.

**Request Body:**
```json
{
  "contact_name": "John Smith",
  "email": "john.smith@acmecorp.com",
  "phone": "+44 7700 900123",
  "company_name": "Acme Corp",
  "preferred_date": "2025-11-25",
  "preferred_time": "14:00",
  "notes": "Would like to discuss ESG reporting requirements for upcoming tender",
  "lead_score": 90,
  "urgency": "high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking submitted successfully",
  "booking_id": "uuid-here",
  "confirmation_sent": true
}
```

**Side Effects:**
- Saves booking to Supabase `bookings` table
- Sends confirmation email to lead
- Sends notification email to sales team with booking details
- Booking status set to 'pending' for sales team follow-up

## Customization

### Branding

Update branding in:
- `components/Layout.js` - Logo and company name
- `styles/globals.css` - Color scheme (gradient)
- `styles/Layout.module.css` - Header/footer styling

### Conversation Flow

Modify questions and validation in:
- `lib/conversationFlow.js` - Add/remove/modify questions

### Scoring Logic

Adjust lead scoring in:
- `pages/api/interview.js` - Score calculation algorithm

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- Use functional React components
- CSS Modules for styling
- Context API for state management
- Async/await for API calls

## Production Considerations

Before going live:

1. **Database Setup**
   - Run Supabase migrations (see `/migrations.sql`)
   - Set up proper authentication
   - Configure RLS policies

2. **Integrations**
   - Set up Stripe for payments
   - Configure email/SMS notifications
   - Set up analytics tracking

3. **Security**
   - Enable CORS properly
   - Validate all user inputs
   - Use environment variables for secrets
   - Implement rate limiting

4. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor API performance
   - Track conversion metrics

## License

Proprietary - Full Bin

## Support

For questions or support, contact the Full Bin team.

---

**Powered by Full Bin** - ESG Compliance Made Simple
