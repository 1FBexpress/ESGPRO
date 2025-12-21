/**
 * Email Service using Resend
 * Handles lead notification emails for the ESG Pro Interviewer system
 */

const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

// Load prices data
const pricesPath = path.join(__dirname, '../prices.json');
let PRICES = [];
try {
  PRICES = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
} catch (err) {
  console.error('Could not load prices.json:', err);
}

// Recipients for lead notifications
const NOTIFICATION_RECIPIENTS = [
  'christian@full-bin.com',
  'hj@esgpro.co.uk',
  'nl@esgpro.co.uk',
  'laurence@twinfm.com'
];

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format action text with context based on urgency
 */
function formatActionText(action, urgency) {
  const actionMap = {
    'BOOK_FREE_CONSULT': {
      high: 'BOOK FREE CONSULTATION - Contact within 24 hours (URGENT)',
      medium: 'BOOK FREE CONSULTATION - Priority follow-up within 48 hours',
      low: 'BOOK FREE CONSULTATION - Contact within 1 week'
    },
    'BUY_50_ASSESSMENT': {
      high: 'BUY £50 ASSESSMENT - Quick win opportunity, act fast',
      medium: 'BUY £50 ASSESSMENT - Offer low-commitment entry point',
      low: 'BUY £50 ASSESSMENT - Start with assessment, build relationship'
    },
    'NURTURE': {
      high: 'NURTURE - Add to hot pipeline, monthly check-ins',
      medium: 'NURTURE - Add to pipeline, quarterly touch points',
      low: 'NURTURE - Add to long-term pipeline'
    }
  };

  return actionMap[action]?.[urgency] || action;
}

/**
 * Format timeline text based on tender days and urgency
 */
function formatTimelineText(days, urgency) {
  if (!days || days === 'N/A') return 'Timeline not specified';
  
  const daysNum = Number(days);
  if (isNaN(daysNum)) return 'Timeline not specified';
  
  if (urgency === 'high') {
    return `Tender in ${daysNum} Days - URGENT ACTION REQUIRED`;
  } else if (urgency === 'medium') {
    return `${daysNum} days until tender - Priority follow-up`;
  } else {
    return `${daysNum} days timeline - Standard pipeline`;
  }
}

/**
 * Generate pain points HTML for email
 */
function generatePainPointsHtml(painPoints) {
  if (!painPoints) {
    return '<div class="pain-point-item">No specific pain points captured</div>';
  }

  // Handle both string and array formats
  if (typeof painPoints === 'string') {
    return `<div class="pain-point-item">${escapeHtml(painPoints)}</div>`;
  }

  if (Array.isArray(painPoints) && painPoints.length > 0) {
    return painPoints
      .map(point => `<div class="pain-point-item">${escapeHtml(point)}</div>`)
      .join('');
  }

  return '<div class="pain-point-item">No specific pain points captured</div>';
}

/**
 * Generate list items HTML for focus points and questions
 */
function generateListHtml(items) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return '<li>None specified</li>';
  }

  return items
    .map(item => `<li>${escapeHtml(item)}</li>`)
    .join('');
}

/**
 * Generate pricing SKUs HTML with commission breakdown
 */
function generatePricingSkusHtml(skuRecs) {
  if (!skuRecs || !Array.isArray(skuRecs) || skuRecs.length === 0) {
    return '<div style="padding: 15px; text-align: center; color: #6b7280;">No specific pricing recommendations</div>';
  }

  return skuRecs.map(sku => {
    const priceInfo = PRICES.find(p => p.SKU === sku);
    
    if (!priceInfo) {
      return `
        <div class="sku-item">
          <div>
            <div class="sku-name">${escapeHtml(sku)}</div>
            <div style="font-size: 12px; color: #6b7280;">Pricing information not available</div>
          </div>
          <div class="sku-price">TBD</div>
        </div>
      `;
    }

    // Calculate commission (35% of RRP, split 50/50 with rounding up for Spotted Cow)
    const commissionTotal = priceInfo.RRP * 0.35;
    const fullBinShare = Math.floor(commissionTotal / 2);
    const spottedCowShare = Math.ceil(commissionTotal / 2);

    return `
      <div class="sku-item">
        <div>
          <div class="sku-name">${priceInfo.SKU}: ${escapeHtml(priceInfo.Description)}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
            Base: £${priceInfo.Base.toLocaleString()} | 
            Commission: £${commissionTotal.toFixed(0)} 
            (Full Bin: £${fullBinShare}, Spotted Cow: £${spottedCowShare})
          </div>
        </div>
        <div class="sku-price">£${priceInfo.RRP.toLocaleString()}</div>
      </div>
    `;
  }).join('');
}

/**
 * Load and populate the email template with lead data
 */
function generateLeadNotificationEmail(leadData, apiResponse) {
  // Load the template
  const templatePath = path.join(__dirname, 'email_template.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  // Basic replacements
  html = html.replace(/{{URGENCY}}/g, apiResponse.urgency || 'medium');
  html = html.replace(/{{SCORE}}/g, apiResponse.score || 0);
  html = html.replace(/{{CONTACT_NAME}}/g, escapeHtml(leadData.contact_name || 'N/A'));
  html = html.replace(/{{COMPANY_NAME}}/g, escapeHtml(leadData.company_name || 'N/A'));
  html = html.replace(/{{EMAIL}}/g, escapeHtml(leadData.email || 'N/A'));
  html = html.replace(/{{PHONE}}/g, escapeHtml(leadData.phone || 'N/A'));
  html = html.replace(/{{SIZE}}/g, escapeHtml(leadData.size || 'N/A'));
  html = html.replace(/{{INDUSTRY}}/g, escapeHtml(leadData.industry || 'N/A'));
  html = html.replace(/{{TENDER_DAYS}}/g, escapeHtml(leadData.tender_days || 'N/A'));
  html = html.replace(/{{CURRENT_ESG_STATUS}}/g, escapeHtml(leadData.current_esg_status || 'Not specified'));
  html = html.replace(/{{LEAD_BRIEF}}/g, escapeHtml(apiResponse.lead_brief || ''));
  html = html.replace(/{{CONTACT_EMAIL}}/g, escapeHtml(leadData.email || ''));

  // Format action with context
  const actionText = formatActionText(apiResponse.action, apiResponse.urgency);
  html = html.replace(/{{ACTION}}/g, actionText);

  // Format tender timeline
  const timelineText = formatTimelineText(leadData.tender_days, apiResponse.urgency);
  html = html.replace(/{{TENDER_TIMELINE}}/g, timelineText);

  // Generate dynamic content sections
  const painPointsHtml = generatePainPointsHtml(leadData.pain_points);
  html = html.replace(/{{PAIN_POINTS}}/g, painPointsHtml);

  const focusPointsHtml = generateListHtml(apiResponse.focus_points);
  html = html.replace(/{{FOCUS_POINTS}}/g, focusPointsHtml);

  const questionsHtml = generateListHtml(apiResponse.opening_questions);
  html = html.replace(/{{OPENING_QUESTIONS}}/g, questionsHtml);

  // Pricing recommendations
  html = html.replace(/{{PRICING_TIER}}/g, escapeHtml(apiResponse.pricing_recommendation?.tier || 'Standard'));
  const pricingSkusHtml = generatePricingSkusHtml(apiResponse.pricing_recommendation?.sku_recs || []);
  html = html.replace(/{{PRICING_SKUS}}/g, pricingSkusHtml);

  return html;
}

/**
 * Generate email subject line
 */
function generateSubjectLine(leadData, apiResponse) {
  const company = leadData.company_name || 'Unknown Company';
  const urgency = (apiResponse.urgency || 'medium').toUpperCase();
  const score = apiResponse.score || 0;
  return `🎯 New ESG Lead [${urgency}]: ${company} (Score: ${score})`;
}

/**
 * Generate plain text version of email
 */
function generatePlainTextVersion(leadData, apiResponse) {
  return `
NEW ESG LEAD NOTIFICATION
========================

URGENCY: ${(apiResponse.urgency || 'medium').toUpperCase()}
SCORE: ${apiResponse.score || 0}/100
ACTION: ${apiResponse.action || 'N/A'}

LEAD INFORMATION
----------------
Name: ${leadData.contact_name || 'N/A'}
Company: ${leadData.company_name || 'N/A'}
Email: ${leadData.email || 'N/A'}
Phone: ${leadData.phone || 'N/A'}
Size: ${leadData.size || 'N/A'} employees
Industry: ${leadData.industry || 'N/A'}
Tender Timeline: ${leadData.tender_days || 'N/A'} days
Current ESG Status: ${leadData.current_esg_status || 'Not specified'}

PAIN POINTS
-----------
${typeof leadData.pain_points === 'string' ? leadData.pain_points : (Array.isArray(leadData.pain_points) ? leadData.pain_points.join('\n') : 'Not specified')}

AI-GENERATED BRIEF
------------------
${apiResponse.lead_brief || 'N/A'}

FOCUS POINTS
------------
${(apiResponse.focus_points || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

OPENING QUESTIONS
-----------------
${(apiResponse.opening_questions || []).map((q, i) => `${i + 1}. ${q}`).join('\n')}

PRICING RECOMMENDATIONS
-----------------------
Tier: ${apiResponse.pricing_recommendation?.tier || 'Standard'}
SKUs: ${(apiResponse.pricing_recommendation?.sku_recs || []).join(', ')}

---
Powered by Full Bin - ESG Pro Interviewer System
This is an automated notification. Do not reply to this email.
  `.trim();
}

/**
 * Send notification email using Resend
 * @param {Object} leadData - Lead data from the interview form
 * @param {Object} apiResponse - API response with scoring and recommendations
 * @returns {Promise<Object>} - { success: boolean, messageId?: string, error?: string }
 */
async function sendLeadNotificationEmail(leadData, apiResponse) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email notification');
      return { 
        success: false, 
        error: 'RESEND_API_KEY not configured',
        skipped: true 
      };
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Generate email content
    const html = generateLeadNotificationEmail(leadData, apiResponse);
    const subject = generateSubjectLine(leadData, apiResponse);
    const text = generatePlainTextVersion(leadData, apiResponse);

    // Send email to all recipients
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: NOTIFICATION_RECIPIENTS,
      subject: subject,
      text: text,
      html: html
    });

    console.log('Lead notification email sent successfully:', {
      messageId: response.data?.id,
      recipients: NOTIFICATION_RECIPIENTS.length,
      leadCompany: leadData.company_name,
      score: apiResponse.score
    });

    return {
      success: true,
      messageId: response.data?.id,
      recipients: NOTIFICATION_RECIPIENTS
    };

  } catch (error) {
    console.error('Failed to send lead notification email:', {
      error: error.message,
      code: error.code
    });

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send booking confirmation email to the lead
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} - { success: boolean, messageId?: string, error?: string }
 */
async function sendBookingConfirmationEmail(bookingData) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping booking confirmation');
      return { 
        success: false, 
        error: 'RESEND_API_KEY not configured',
        skipped: true 
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: bookingData.email,
      subject: 'Consultation Booking Confirmed - ESG Pro',
      text: `
Dear ${bookingData.contact_name},

Thank you for booking a consultation with ESG Pro!

Booking Details:
- Name: ${bookingData.contact_name}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}
- Preferred Date: ${bookingData.preferred_date}
- Preferred Time: ${bookingData.preferred_time}

${bookingData.notes ? `Additional Notes: ${bookingData.notes}` : ''}

One of our ESG experts will contact you shortly to confirm the appointment and prepare for your consultation.

Best regards,
The ESG Pro Team
Powered by Full Bin
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-label { font-weight: 600; color: #4b5563; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">ESG Pro</h1>
      <p style="margin: 10px 0 0 0;">Powered by Full Bin</p>
    </div>
    <div class="content">
      <h2>Consultation Booking Confirmed</h2>
      <p>Dear ${escapeHtml(bookingData.contact_name)},</p>
      <p>Thank you for booking a consultation with ESG Pro! We're excited to help you with your ESG journey.</p>
      
      <div class="booking-details">
        <h3 style="margin-top: 0;">Your Booking Details</h3>
        <div class="detail-row">
          <span class="detail-label">Name:</span> ${escapeHtml(bookingData.contact_name)}
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span> ${escapeHtml(bookingData.email)}
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span> ${escapeHtml(bookingData.phone)}
        </div>
        <div class="detail-row">
          <span class="detail-label">Preferred Date:</span> ${escapeHtml(bookingData.preferred_date)}
        </div>
        <div class="detail-row">
          <span class="detail-label">Preferred Time:</span> ${escapeHtml(bookingData.preferred_time)}
        </div>
        ${bookingData.notes ? `
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Additional Notes:</span><br>
          ${escapeHtml(bookingData.notes)}
        </div>
        ` : ''}
      </div>
      
      <p><strong>What happens next?</strong></p>
      <p>One of our ESG experts will contact you shortly to confirm the appointment and prepare for your consultation.</p>
      
      <div class="footer">
        <p>Best regards,<br>The ESG Pro Team</p>
        <p style="font-size: 12px; color: #9ca3af;">Powered by Full Bin</p>
      </div>
    </div>
  </div>
</body>
</html>
      `
    });
    
    console.log('Booking confirmation sent:', {
      messageId: response.data?.id,
      recipient: bookingData.email
    });

    return {
      success: true,
      messageId: response.data?.id
    };

  } catch (error) {
    console.error('Failed to send booking confirmation:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendLeadNotificationEmail,
  sendBookingConfirmationEmail,
  generateLeadNotificationEmail,
  generateSubjectLine,
  generatePlainTextVersion,
  NOTIFICATION_RECIPIENTS
};
