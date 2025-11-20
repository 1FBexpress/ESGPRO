
# Full Bin ESG Pro Interviewer

A conversational AI-powered lead qualification system for ESG consulting services.

## Features

- 🤖 Natural conversational interface
- 📊 Intelligent lead scoring and qualification
- 🎯 Personalized recommendations based on company profile
- 📱 Mobile-responsive design
- 🎨 Clean, professional UI with Full Bin branding
- ⚡ Built with Next.js for optimal performance

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: CSS Modules with custom animations
- **State Management**: React Context API
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Vercel

## Project Structure

```
esgpro/
├── components/          # React components
│   ├── Layout.js       # Main layout with header/footer
│   ├── ChatInterface.js # Main chat container
│   ├── Message.js      # Individual message component
│   ├── ResultsPanel.js # Results display
│   └── TypingIndicator.js # Animated typing indicator
├── context/            # State management
│   └── InterviewContext.js # Interview state
├── lib/                # Utility functions
│   ├── conversationFlow.js # Question logic & validation
│   └── apiClient.js    # API communication
├── pages/              # Next.js pages
│   ├── api/
│   │   └── interview.js # Interview API endpoint
│   ├── _app.js         # App wrapper
│   ├── _document.js    # HTML document
│   └── index.js        # Home page
└── styles/             # CSS modules
    ├── globals.css
    ├── Layout.module.css
    ├── ChatInterface.module.css
    ├── Message.module.css
    ├── TypingIndicator.module.css
    ├── ResultsPanel.module.css
    └── Home.module.css
```

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

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Supabase anonymous/service key
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `SENDGRID_API_KEY` - (Optional) For email notifications
- `TWILIO_SID` / `TWILIO_TOKEN` - (Optional) For SMS notifications

## Interview Flow

The chat collects the following information:

1. **Contact Name** - User's full name
2. **Company Name** - Company/organization name
3. **Company Size** - Small, medium, or large
4. **Tender Days** - Days until deadline (if applicable)
5. **Industry** - Business sector
6. **Current ESG Status** - Current state of ESG compliance
7. **Pain Points** - Main challenges/concerns

After collection, the system:
- Calculates lead score (0-100)
- Determines urgency level (low/medium/high)
- Recommends action (BOOK_FREE_CONSULT / BUY_50_ASSESSMENT / NURTURE)
- Provides focus points and discussion questions
- Suggests appropriate pricing tier

## API Endpoints

### POST /api/interview

Submit interview data and receive qualification results.

**Request Body:**
```json
{
  "contact_name": "John Smith",
  "company_name": "Acme Corp",
  "size": "medium",
  "tender_days": 30,
  "industry": "Manufacturing",
  "current_esg_status": "Just starting",
  "pain_points": "Need help with reporting"
}
```

**Response:**
```json
{
  "action": "BOOK_FREE_CONSULT",
  "urgency": "high",
  "score": 85,
  "lead_brief": "...",
  "focus_points": ["..."],
  "opening_questions": ["..."],
  "pricing_recommendation": {...}
}
```

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
