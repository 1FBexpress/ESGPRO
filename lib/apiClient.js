
// API client for communicating with the interview endpoint

export async function submitInterviewData(interviewData) {
  try {
    const response = await fetch('/api/interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Interview submission error:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit interview. Please try again.',
    };
  }
}

export async function healthCheck() {
  try {
    const response = await fetch('/api/health');
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
