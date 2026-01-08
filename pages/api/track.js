// pages/api/track.js
// Custom Analytics Tracking Endpoint
// Logs visitor data to Supabase for daily reporting

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error(`Track API: Method ${req.method} not allowed`);
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Validate request body exists
    if (!req.body) {
      console.error('Track API: No request body provided');
      return res.status(400).json({ error: 'Request body is required' });
    }

    const {
      page,
      referrer,
      userAgent,
      sessionId
    } = req.body;

    // Validate required fields
    if (!page || !sessionId) {
      console.error('Track API: Missing required fields', { page, sessionId });
      return res.status(400).json({ error: 'Missing required fields: page and sessionId' });
    }

    // Get visitor IP (respecting proxies)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
               req.headers['x-real-ip'] || 
               req.socket.remoteAddress || 
               'unknown';

    // Get location from headers (if available)
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] || 'Unknown';

    console.log('Track API: Logging pageview', { page, sessionId, ip, country });

    // Log pageview to database
    const { data, error } = await supabase
      .from('pageviews')
      .insert([
        {
          page,
          referrer: referrer || 'direct',
          user_agent: userAgent || 'unknown',
          session_id: sessionId,
          ip_address: ip,
          country,
          city,
          timestamp: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Track API: Supabase error', error);
      return res.status(500).json({ 
        error: 'Failed to log pageview', 
        details: error.message 
      });
    }

    console.log('Track API: Pageview logged successfully', data);
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Track API: Unexpected error', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
