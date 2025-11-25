import { readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Resume token is required' });
    }

    // Read saved progress
    const dataDir = path.join(process.cwd(), 'data');
    const progressFile = path.join(dataDir, 'saved-progress.json');

    let savedProgress = [];
    try {
      const fileContent = await readFile(progressFile, 'utf-8');
      savedProgress = JSON.parse(fileContent);
    } catch (err) {
      return res.status(404).json({ error: 'No saved progress found' });
    }

    // Find progress by token
    const progress = savedProgress.find(p => p.resumeToken === token);

    if (!progress) {
      return res.status(404).json({ error: 'Invalid or expired resume link' });
    }

    // Check if expired
    const now = new Date();
    const expiryDate = new Date(progress.expiresAt);

    if (now > expiryDate) {
      return res.status(410).json({ 
        error: 'This resume link has expired',
        message: 'Saved progress is only kept for 30 days. Please start a new assessment.'
      });
    }

    // Return progress data (excluding sensitive fields)
    return res.status(200).json({
      success: true,
      currentStep: progress.currentStep,
      collectedData: progress.collectedData,
      questionnaireType: progress.questionnaireType,
      savedAt: progress.savedAt,
      expiresAt: progress.expiresAt
    });

  } catch (error) {
    console.error('Resume progress error:', error);
    return res.status(500).json({ 
      error: 'Failed to resume progress',
      details: error.message 
    });
  }
}
