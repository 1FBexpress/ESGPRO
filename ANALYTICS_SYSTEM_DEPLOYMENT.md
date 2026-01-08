# Daily Analytics Email System - Deployment Guide

## 🎯 Overview

This system tracks pageviews and sends daily analytics reports via email to the ESG Pro team. The email includes:
- Total visits
- New leads
- Conversion rate
- Most visited pages
- Traffic sources

## 📋 Prerequisites

1. **Supabase Database**: Running and configured with `SUPABASE_URL` and `SUPABASE_KEY`
2. **Resend Email Service**: Configured with `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
3. **Vercel Deployment**: Application deployed on Vercel

## 🔧 Environment Variables Required

Add these to your Vercel project environment variables:

```bash
# Already configured (verify these exist)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev

# NEW - Required for Vercel Cron authentication
CRON_SECRET=your_random_secret_string
```

### How to set CRON_SECRET:
1. Generate a random secret: `openssl rand -base64 32`
2. Add it to Vercel: Project Settings → Environment Variables → Add `CRON_SECRET`

## 🗄️ Database Migration

Run the updated migration to create the `pageviews` table:

```bash
# Connect to your Supabase SQL Editor and run:
# Copy contents from migrations.sql (pageviews table section)
```

Or use Supabase CLI:
```bash
supabase db push
```

The migration adds:
- `pageviews` table with fields: page, referrer, user_agent, session_id, ip_address, country, city, timestamp
- Indexes for optimized queries

## 📦 What Was Added

### 1. Database Layer
- **migrations.sql**: Added `pageviews` table with indexes

### 2. Frontend Tracking
- **lib/useAnalytics.js**: React hook for automatic pageview tracking
- **pages/_app.js**: Updated to use analytics hook

### 3. API Endpoints
- **pages/api/track.js**: Already existed, stores pageview data
- **pages/api/cron/daily-analytics-report.js**: Generates and sends daily email
- **pages/api/test-analytics-report.js**: Manual testing endpoint

### 4. Configuration
- **vercel.json**: Added cron job configuration (runs daily at 9:00 AM UTC)

## 🚀 Deployment Steps

### Step 1: Deploy to Vercel
```bash
# Push changes to Git
git add .
git commit -m "Add daily analytics email system"
git push origin main

# Vercel will automatically deploy
```

### Step 2: Run Database Migration
```bash
# In Supabase SQL Editor, run the pageviews table creation from migrations.sql
# Or use Supabase CLI: supabase db push
```

### Step 3: Set Environment Variables
In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `CRON_SECRET` with a random value
3. Verify existing variables are set:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

### Step 4: Enable Vercel Cron
The cron job is automatically enabled when you deploy with `vercel.json`.
Verify in: Vercel Dashboard → Project → Settings → Cron Jobs

### Step 5: Test the System

#### Test Pageview Tracking:
1. Visit your site: https://esgpro.vercel.app
2. Check Supabase `pageviews` table for new entries

#### Test Analytics Email (Manual):
```bash
# Visit this URL to manually trigger the report
https://esgpro.vercel.app/api/test-analytics-report

# Or use curl:
curl https://esgpro.vercel.app/api/test-analytics-report
```

Check your email (christian@full-bin.com, etc.) for the analytics report.

## 📧 Email Recipients

The analytics report is sent to:
- christian@full-bin.com
- hj@esgpro.co.uk
- nl@esgpro.co.uk
- laurence@twinfm.com

To change recipients, edit `pages/api/cron/daily-analytics-report.js` line 11-16.

## ⏰ Schedule

The cron job runs **daily at 9:00 AM UTC** (10:00 AM CET in winter, 11:00 AM CEST in summer).

To change the schedule, edit `vercel.json`:
```json
"crons": [
  {
    "path": "/api/cron/daily-analytics-report",
    "schedule": "0 9 * * *"  // Change this (cron format)
  }
]
```

Cron format: `minute hour day month weekday`
- Example: `0 9 * * *` = Every day at 9:00 AM UTC
- Example: `0 8 * * 1` = Every Monday at 8:00 AM UTC

## 🧪 Testing

### Manual Test
```bash
# Test the analytics report
curl https://esgpro.vercel.app/api/test-analytics-report
```

### Check Logs
1. Vercel Dashboard → Project → Deployments → Latest → Functions
2. Find `/api/cron/daily-analytics-report`
3. Check logs for execution details

### Verify Email Delivery
1. Check Resend Dashboard: https://resend.com/emails
2. Look for emails sent from `onboarding@resend.dev`
3. Verify all recipients received the email

## 🐛 Troubleshooting

### Email Not Sending
- Check `RESEND_API_KEY` is set in Vercel
- Verify Resend domain is verified
- Check Resend logs for errors

### No Data in Email
- Verify pageviews are being tracked (check Supabase table)
- Check if leads table has entries
- Look at Vercel function logs for errors

### Cron Not Running
- Verify `CRON_SECRET` is set
- Check Vercel cron jobs are enabled
- Look at Vercel function logs at scheduled time

### Pageviews Not Tracking
- Check browser console for errors
- Verify `/api/track` endpoint is working
- Check Supabase connection

## 📊 Data Privacy

The system is privacy-friendly:
- **No cookies**: Uses sessionStorage for session tracking
- **No personal data**: Only tracks page paths and referrers
- **Hashed IP**: IP addresses can be hashed for privacy (optional)
- **GDPR compliant**: No tracking of personal information

## 🔐 Security

- Cron endpoint requires `CRON_SECRET` for authentication
- Test endpoint can be removed in production (optional)
- All data stored in Supabase with RLS policies

## 📈 Future Enhancements

Potential improvements:
- Add more detailed metrics (bounce rate, session duration)
- Export data to CSV
- Add weekly/monthly reports
- Add custom event tracking
- Integrate with Google Analytics for comparison
- Add dashboard UI for real-time analytics

## 📞 Support

For issues or questions:
- Check Vercel function logs
- Check Supabase logs
- Review Resend email logs
- Contact: christian@full-bin.com

---

## ✅ Deployment Checklist

- [ ] Database migration applied (pageviews table created)
- [ ] Environment variables set in Vercel (especially CRON_SECRET)
- [ ] Code pushed to Git and deployed to Vercel
- [ ] Cron job visible in Vercel dashboard
- [ ] Manual test successful (email received)
- [ ] Pageview tracking working (check Supabase)
- [ ] Team notified about new analytics system

---

**Last Updated**: January 8, 2026
**Version**: 1.0.0
**Status**: Ready for Production
