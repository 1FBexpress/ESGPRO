/**
 * Test endpoint to manually trigger analytics report
 * Usage: Call this endpoint to test the analytics email system
 * GET /api/test-analytics-report
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Call the cron endpoint with test header
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['host'];
    const cronUrl = `${protocol}://${host}/api/cron/daily-analytics-report`;

    console.log(`Triggering analytics report test: ${cronUrl}`);

    const response = await fetch(cronUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-manual-test': 'true'
      }
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Analytics report test triggered successfully',
        data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: 'Analytics report test failed',
        error: data
      });
    }

  } catch (error) {
    console.error('Test analytics report error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
