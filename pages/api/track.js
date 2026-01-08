// pages/api/track.js
// Custom Analytics Tracking Endpoint
// Logs visitor data to Supabase for daily reporting

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      page,
      referrer,
      userAgent,
      sessionId
    } = req.body;

    // Get visitor IP (respecting proxies)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
               req.headers['x-real-ip'] || 
               req.socket.remoteAddress;

    // Get location from headers (if available)
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] || 'Unknown';

    // Log pageview to database
    const { data, error } = await supabase
      .from('pageviews')
      .insert([
        {
          page,
          referrer,
          user_agent: userAgent,
          session_id: sessionId,
          ip_address: ip,
          country,
          city,
          timestamp: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Failed to log pageview:', error);
      return res.status(500).json({ error: 'Failed to log pageview' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
