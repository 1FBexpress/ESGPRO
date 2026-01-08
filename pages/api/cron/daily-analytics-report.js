/**
 * Daily Analytics Report - Cron Job
 * Generates and sends daily analytics email to team
 * Scheduled to run daily at 9:00 AM
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const NOTIFICATION_RECIPIENTS = [
  'christian@full-bin.com',
  'hj@esgpro.co.uk',
  'nl@esgpro.co.uk',
  'laurence@twinfm.com'
];

/**
 * Get yesterday's date range
 */
function getYesterdayRange() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const startOfDay = new Date(yesterday);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(yesterday);
  endOfDay.setHours(23, 59, 59, 999);
  
  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString(),
    dateStr: yesterday.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
}

/**
 * Query analytics data from database
 */
async function queryAnalyticsData(startDate, endDate) {
  try {
    // Get total visits (pageviews)
    const { data: pageviews, error: pageviewsError } = await supabase
      .from('pageviews')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate);

    if (pageviewsError) throw pageviewsError;

    // Get new leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (leadsError) throw leadsError;

    // Calculate metrics
    const totalVisits = pageviews?.length || 0;
    const newLeads = leads?.length || 0;
    const conversionRate = totalVisits > 0 ? ((newLeads / totalVisits) * 100).toFixed(1) : '0.0';

    // Most visited pages
    const pageGroups = {};
    pageviews?.forEach(pv => {
      const page = pv.page || '/';
      pageGroups[page] = (pageGroups[page] || 0) + 1;
    });

    const mostVisitedPages = Object.entries(pageGroups)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Traffic sources
    const sourceGroups = {};
    pageviews?.forEach(pv => {
      let source = 'Direct Traffic';
      if (pv.referrer && pv.referrer !== 'direct') {
        try {
          const url = new URL(pv.referrer);
          source = url.hostname;
        } catch (e) {
          source = pv.referrer;
        }
      }
      sourceGroups[source] = (sourceGroups[source] || 0) + 1;
    });

    const trafficSources = Object.entries(sourceGroups)
      .map(([source, visits]) => ({ source, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);

    return {
      totalVisits,
      newLeads,
      conversionRate,
      mostVisitedPages,
      trafficSources
    };

  } catch (error) {
    console.error('Failed to query analytics data:', error);
    throw error;
  }
}

/**
 * Generate HTML email template
 */
function generateEmailHTML(data, dateStr) {
  const { totalVisits, newLeads, conversionRate, mostVisitedPages, trafficSources } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Analytics Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .header .date {
      font-size: 16px;
      opacity: 0.9;
      font-weight: normal;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 35px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    .metric-card {
      padding: 25px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-card.green {
      background-color: #f0fdf4;
      border: 1px solid #86efac;
    }
    .metric-card.red {
      background-color: #fef2f2;
      border: 1px solid #fca5a5;
    }
    .metric-card.blue {
      background-color: #eff6ff;
      border: 1px solid #93c5fd;
    }
    .metric-value {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .metric-card.green .metric-value {
      color: #16a34a;
    }
    .metric-card.red .metric-value {
      color: #dc2626;
    }
    .metric-card.blue .metric-value {
      color: #2563eb;
    }
    .metric-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 6px;
      margin-bottom: 10px;
    }
    .list-item-number {
      width: 30px;
      height: 30px;
      background-color: #48bb78;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
    }
    .list-item-content {
      flex: 1;
      padding: 0 15px;
    }
    .list-item-label {
      font-weight: 500;
      color: #2d3748;
    }
    .list-item-value {
      font-weight: 700;
      color: #48bb78;
    }
    .buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
    }
    .button {
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
      transition: all 0.3s ease;
    }
    .button-primary {
      background-color: #48bb78;
      color: white;
    }
    .button-secondary {
      background-color: #3b82f6;
      color: white;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f9fafb;
      color: #6b7280;
      font-size: 12px;
    }
    .empty-state {
      text-align: center;
      padding: 30px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>
        📊 Daily Analytics Report
      </h1>
      <p class="date">${dateStr}</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Key Metrics Section -->
      <div class="section">
        <div class="section-title">
          📈 Key Metrics
        </div>
        <div class="metrics-grid">
          <div class="metric-card green">
            <div class="metric-value">${totalVisits}</div>
            <div class="metric-label">Total Visits</div>
          </div>
          <div class="metric-card red">
            <div class="metric-value">${newLeads}</div>
            <div class="metric-label">New Leads</div>
          </div>
          <div class="metric-card blue">
            <div class="metric-value">${conversionRate}% Conversion Rate</div>
          </div>
        </div>
      </div>

      <!-- Most Visited Pages Section -->
      <div class="section">
        <div class="section-title">
          🔥 Most Visited Pages
        </div>
        ${mostVisitedPages.length > 0 ? mostVisitedPages.map((item, index) => `
          <div class="list-item">
            <div class="list-item-number">${index + 1}</div>
            <div class="list-item-content">
              <div class="list-item-label">${item.page === '/' ? 'Homepage' : item.page}</div>
            </div>
            <div class="list-item-value">${item.views} views</div>
          </div>
        `).join('') : `
          <div class="empty-state">No page views recorded for this period</div>
        `}
      </div>

      <!-- Traffic Sources Section -->
      <div class="section">
        <div class="section-title">
          🌐 Traffic Sources
        </div>
        ${trafficSources.length > 0 ? trafficSources.map((item, index) => `
          <div class="list-item">
            <div class="list-item-number">${index + 1}</div>
            <div class="list-item-content">
              <div class="list-item-label">🔗 ${item.source}</div>
            </div>
            <div class="list-item-value">${item.visits} visits</div>
          </div>
        `).join('') : `
          <div class="empty-state">No traffic source data available</div>
        `}
      </div>

      <!-- Quick Actions Section -->
      <div class="section">
        <div class="section-title">
          🚀 Quick Actions
        </div>
        <div class="buttons">
          <a href="https://supabase.com/dashboard" class="button button-primary">View Dashboard</a>
          <a href="https://esgpro.vercel.app" class="button button-secondary">Visit Site</a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>This is an automated daily analytics report from ESG Pro Interviewer</p>
      <p>Powered by Full Bin</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version
 */
function generatePlainText(data, dateStr) {
  const { totalVisits, newLeads, conversionRate, mostVisitedPages, trafficSources } = data;
  
  return `
DAILY ANALYTICS REPORT
${dateStr}
=====================================================

KEY METRICS
-----------
Total Visits: ${totalVisits}
New Leads: ${newLeads}
Conversion Rate: ${conversionRate}%

MOST VISITED PAGES
------------------
${mostVisitedPages.map((item, i) => `${i + 1}. ${item.page === '/' ? 'Homepage' : item.page} - ${item.views} views`).join('\n')}

TRAFFIC SOURCES
---------------
${trafficSources.map((item, i) => `${i + 1}. ${item.source} - ${item.visits} visits`).join('\n')}

---
Powered by Full Bin - ESG Pro Interviewer
This is an automated analytics report. Do not reply to this email.
  `.trim();
}

/**
 * Send analytics email
 */
async function sendAnalyticsEmail(data, dateStr) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = generateEmailHTML(data, dateStr);
    const text = generatePlainText(data, dateStr);

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: NOTIFICATION_RECIPIENTS,
      subject: `📊 Daily Analytics Report - ${dateStr}`,
      text: text,
      html: html
    });

    console.log('Analytics email sent successfully:', {
      messageId: response.data?.id,
      recipients: NOTIFICATION_RECIPIENTS.length,
      date: dateStr
    });

    return {
      success: true,
      messageId: response.data?.id
    };

  } catch (error) {
    console.error('Failed to send analytics email:', error);
    throw error;
  }
}

/**
 * Main handler for the cron job
 */
export default async function handler(req, res) {
  // Verify this is a cron request or has the correct authorization
  const authHeader = req.headers.authorization;
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  
  // Allow manual trigger for testing (you can remove this in production)
  const isManualTest = req.headers['x-manual-test'] === 'true';

  if (!isVercelCron && !isManualTest) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting daily analytics report generation...');

    // Get yesterday's date range
    const { start, end, dateStr } = getYesterdayRange();

    console.log(`Querying analytics data for ${dateStr}...`);

    // Query analytics data
    const analyticsData = await queryAnalyticsData(start, end);

    console.log('Analytics data retrieved:', {
      totalVisits: analyticsData.totalVisits,
      newLeads: analyticsData.newLeads,
      conversionRate: analyticsData.conversionRate
    });

    // Send email
    const emailResult = await sendAnalyticsEmail(analyticsData, dateStr);

    console.log('Daily analytics report completed successfully');

    return res.status(200).json({
      success: true,
      message: 'Daily analytics report sent successfully',
      data: {
        date: dateStr,
        metrics: {
          totalVisits: analyticsData.totalVisits,
          newLeads: analyticsData.newLeads,
          conversionRate: analyticsData.conversionRate
        },
        emailMessageId: emailResult.messageId
      }
    });

  } catch (error) {
    console.error('Daily analytics report failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
