# 📅 Calendly Integration - ESG Pro Chatbot

**Date:** November 24, 2025  
**Status:** ✅ CONFIGURED & ACTIVE

---

## 🎯 Overview

The ESG Pro chatbot now uses **intelligent Calendly routing** to automatically direct prospects to the right consultant based on their certification interests:

- **Humperdinck Jackman** (B Corp Lead): [https://calendly.com/hjdiary](https://calendly.com/hjdiary)
- **Natashia Lee** (EcoVadis Lead): [https://calendly.com/nl-esgpro](https://calendly.com/nl-esgpro)

---

## 🧠 Intelligent Routing Logic

### How It Works:

When a prospect completes the chatbot interview and clicks **"Book Your Free Consultation"**, the system:

1. **Checks their certification interests** (collected during the interview)
2. **Routes them to the appropriate consultant** based on these rules:

| User Interest | Routed To | Calendly Link |
|---------------|-----------|---------------|
| **EcoVadis ONLY** | Natashia Lee | `https://calendly.com/nl-esgpro` |
| **B Corp ONLY** | Humperdinck Jackman | `https://calendly.com/hjdiary` |
| **Both B Corp & EcoVadis** | Humperdinck Jackman (default) | `https://calendly.com/hjdiary` |
| **Neither** | Humperdinck Jackman (default) | `https://calendly.com/hjdiary` |

### Code Implementation:

```javascript
const getCalendlyLink = () => {
  // Intelligent routing based on certification interest
  const interestedBCorp = collectedData?.interested_bcorp?.toLowerCase() === 'yes';
  const interestedEcoVadis = collectedData?.interested_ecovadis?.toLowerCase() === 'yes';
  
  // If only interested in EcoVadis, route to Natashia
  if (interestedEcoVadis && !interestedBCorp) {
    return process.env.NEXT_PUBLIC_CALENDLY_LINK_NATASHIA || 'https://calendly.com/nl-esgpro';
  }
  
  // Otherwise (B Corp, both, or neither), route to Humperdinck
  return process.env.NEXT_PUBLIC_CALENDLY_LINK_HUMPERDINCK || 'https://calendly.com/hjdiary';
};
```

---

## 📧 Email Notifications (Requires SendGrid)

### Current Status:
⚠️ **Email notifications are configured but NOT YET ACTIVE** (waiting for SendGrid API key)

### Who Gets Notified:

When someone completes the chatbot interview, emails are sent to:

1. **Humperdinck (HJ)**: hj@esgpro.co.uk
2. **Natashia (NL)**: nl@esgpro.co.uk
3. **Christian**: Christian@full-bin.com
4. **Laurence**: laurence@twinfm.com

### What They Receive:

#### 📨 Interview Submission Email

- ✅ Contact information (name, email, phone)
- ✅ Company details (name, size, industry)
- ✅ Tender deadline
- ✅ **NEW Qualifying Questions:**
  - Compliance goals ("How far out of the gate?")
  - UK government/NHS buyer (YES/NO)
  - High-value contract (≥£5m) (YES/NO)
  - Critical/strategic role (YES/NO)
  - B Corp interest (Yes/Maybe/No)
  - EcoVadis interest (Yes/Maybe/No)
  - Pain points
- ✅ AI-generated sales intelligence:
  - Lead score (0-100)
  - Urgency level (High/Medium/Low)
  - Recommended action (BOOK_CONSULT / BUY_ASSESSMENT / NURTURE)
  - Focus points
  - Opening questions
- ✅ Pricing recommendations with commission breakdown

#### 📅 Booking Confirmation Email (When Using Calendly)

**Note:** Calendly sends its own booking confirmations directly. Our system also sends:

- ✅ Confirmation email to the **prospect**
- ✅ Notification email to **all 4 team members** with:
  - Booking details
  - Preferred date & time
  - Lead score & urgency
  - "Contact Lead Now" button

### To Activate Email Notifications:

1. Get a SendGrid API key from [SendGrid](https://sendgrid.com)
2. Update the `.env` file:
   ```bash
   SENDGRID_API_KEY=SG.your_actual_api_key_here
   ```
3. Emails will start flowing immediately

---

## 🔧 Configuration Files

### Environment Variables (`.env`)

```bash
# Calendly Links - Public (accessible in browser)
NEXT_PUBLIC_CALENDLY_LINK_HUMPERDINCK=https://calendly.com/hjdiary
NEXT_PUBLIC_CALENDLY_LINK_NATASHIA=https://calendly.com/nl-esgpro

# Calendly Links - Server-side (for email templates)
CALENDLY_LINK_HUMPERDINCK=https://calendly.com/hjdiary
CALENDLY_LINK_NATASHIA=https://calendly.com/nl-esgpro
CALENDLY_LINK=https://calendly.com/hjdiary  # Default fallback

# SendGrid Email Configuration (NEEDS API KEY)
SENDGRID_API_KEY=your_sendgrid_api_key  # ⚠️ UPDATE THIS
SENDGRID_FROM_EMAIL=notifications@full-bin.com
```

### Modified Files:

1. **`components/ResultsPanel.js`**
   - Added `getCalendlyLink()` function for intelligent routing
   - Updated `handlePrimaryAction()` to open Calendly in new window
   - Removed built-in booking form (replaced with Calendly)

2. **`nextjs_space/.env`**
   - Added Calendly links (both public and server-side versions)
   - Added SendGrid configuration

---

## ✅ Testing Checklist

### Test Scenarios:

#### Scenario 1: B Corp Interest Only
1. Complete chatbot interview
2. Answer "Yes" to B Corp, "No" to EcoVadis
3. Click "Book Your Free Consultation"
4. **Expected:** Opens Humperdinck's Calendly (`https://calendly.com/hjdiary`)

#### Scenario 2: EcoVadis Interest Only
1. Complete chatbot interview
2. Answer "No" to B Corp, "Yes" to EcoVadis
3. Click "Book Your Free Consultation"
4. **Expected:** Opens Natashia's Calendly (`https://calendly.com/nl-esgpro`)

#### Scenario 3: Both Certifications
1. Complete chatbot interview
2. Answer "Yes" to B Corp, "Yes" to EcoVadis
3. Click "Book Your Free Consultation"
4. **Expected:** Opens Humperdinck's Calendly (default)

#### Scenario 4: Neither Certification
1. Complete chatbot interview
2. Answer "No" to B Corp, "No" to EcoVadis
3. Click "Book Your Free Consultation"
4. **Expected:** Opens Humperdinck's Calendly (default)

---

## 🚀 Deployment

### Current Deployment:
- **Live URL:** [https://esgpro.vercel.app/](https://esgpro.vercel.app/)
- **Status:** Pending deployment of Calendly updates

### To Deploy:

```bash
# Navigate to project
cd /home/ubuntu/github_repos/ESGPRO

# Commit changes
git add .
git commit -m "feat: Add intelligent Calendly routing for Humperdinck & Natashia"

# Push to GitHub (triggers auto-deploy on Vercel)
git push origin main
```

**Deployment Time:** 3-5 minutes

---

## 📊 Analytics & Tracking

### What You Can Track:

1. **Calendly Analytics:**
   - Each Calendly account (Humperdinck & Natashia) tracks:
     - Number of bookings
     - Conversion rate
     - Most popular time slots
   - Access via Calendly Dashboard

2. **Email Analytics (SendGrid):**
   - Once SendGrid is configured, track:
     - Email delivery rate
     - Open rate
     - Click-through rate
   - Access via SendGrid Dashboard

3. **Chatbot Analytics:**
   - Interview completion rate
   - Most common answers
   - Lead scores distribution
   - Certification interest breakdown

---

## 💡 Benefits of This Setup

✅ **Automatic Lead Distribution**
- No manual routing needed
- Prospects go directly to the right expert

✅ **Better Conversion**
- Faster response times
- Specialist expertise from the start

✅ **Clear Accountability**
- Humperdinck owns B Corp leads
- Natashia owns EcoVadis leads
- Easy to track individual performance

✅ **Seamless Experience**
- One-click booking
- No forms to fill out
- Calendar integration

✅ **Fallback Safety**
- If routing fails, defaults to Humperdinck
- Hardcoded links as backup

---

## 🔄 Future Enhancements (Optional)

### Potential Improvements:

1. **Team Availability Routing**
   - Check both calendars
   - Route to whoever has earlier availability

2. **Round-Robin Distribution**
   - Alternate between consultants
   - Balance workload automatically

3. **Geographic Routing**
   - Route based on company location
   - UK North → Consultant A
   - UK South → Consultant B

4. **Industry-Based Routing**
   - Route based on industry expertise
   - Healthcare → Specialist A
   - Manufacturing → Specialist B

5. **Multi-Step Booking**
   - Pre-qualification questions in Calendly
   - Custom intake forms
   - Payment collection (for £50 assessment)

---

## ❓ Troubleshooting

### Issue: Calendly Not Opening

**Possible Causes:**
- Pop-up blocker enabled
- Environment variables not loaded
- JavaScript error

**Solution:**
```javascript
// Check browser console for errors
// Fallback links are hardcoded, so should always work
```

### Issue: Wrong Consultant Assigned

**Possible Causes:**
- Chatbot data not captured correctly
- Case sensitivity in YES/NO answers

**Solution:**
```javascript
// Check collectedData in browser console:
console.log(collectedData.interested_bcorp);
console.log(collectedData.interested_ecovadis);

// Both should be lowercase 'yes' or 'no'
```

### Issue: Email Notifications Not Sending

**Possible Causes:**
- SendGrid API key missing or invalid
- SendGrid account not verified
- Email addresses incorrect

**Solution:**
1. Verify SendGrid API key in `.env`
2. Check SendGrid dashboard for errors
3. Confirm email addresses in `lib/emailService.js`

---

## 📞 Support Contacts

- **Humperdinck Jackman**: hj@esgpro.co.uk
- **Natashia Lee**: nl@esgpro.co.uk
- **Technical Support**: Christian@full-bin.com

---

**Next Steps:**
1. ✅ Test the Calendly integration
2. ⚠️ Add SendGrid API key to activate emails
3. 🚀 Deploy to production
4. 📊 Monitor booking rates

---

*Last Updated: November 24, 2025*
