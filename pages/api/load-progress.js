import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Resume token required' });
    }

    // Load from file system
    const progressFile = path.join(process.cwd(), 'data', 'progress', `${token}.json`);
    
    try {
      const fileContent = await fs.readFile(progressFile, 'utf-8');
      const progressData = JSON.parse(fileContent);

      // Check if expired
      if (new Date(progressData.expiresAt) < new Date()) {
        await fs.unlink(progressFile); // Delete expired file
        return res.status(410).json({ error: 'Resume link has expired' });
      }

      return res.status(200).json({
        success: true,
        data: {
          collectedData: progressData.collectedData,
          currentStep: progressData.currentStep,
          questionnaireType: progressData.questionnaireType,
          savedAt: progressData.savedAt
        }
      });

    } catch (fileError) {
      return res.status(404).json({ error: 'Resume link not found or invalid' });
    }

  } catch (error) {
    console.error('Load progress error:', error);
    return res.status(500).json({ error: 'Failed to load progress' });
  }
}
