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

    console.log(`Test Analytics: Triggering analytics report test: ${cronUrl}`);

    const response = await fetch(cronUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-manual-test': 'true'
      }
    });

    console.log(`Test Analytics: Response status: ${response.status}`);

    // Get response text first to check if it's empty
    const responseText = await response.text();
    console.log(`Test Analytics: Response text length: ${responseText.length}`);

    // Try to parse as JSON if we have content
    let data = null;
    if (responseText && responseText.trim().length > 0) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Test Analytics: Failed to parse JSON response', parseError);
        return res.status(500).json({
          success: false,
          message: 'Analytics report returned invalid JSON',
          error: parseError.message,
          responseText: responseText.substring(0, 500) // First 500 chars for debugging
        });
      }
    } else {
      console.error('Test Analytics: Empty response from cron endpoint');
      return res.status(500).json({
        success: false,
        message: 'Analytics report returned empty response',
        statusCode: response.status
      });
    }

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
        statusCode: response.status,
        error: data
      });
    }

  } catch (error) {
    console.error('Test analytics report error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
