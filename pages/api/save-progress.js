import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, collectedData, currentStep, questionnaireType } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    // Generate unique resume token
    const resumeToken = crypto.randomBytes(16).toString('hex');
    const savedAt = new Date().toISOString();

    const progressData = {
      resumeToken,
      email,
      collectedData,
      currentStep,
      questionnaireType: questionnaireType || 'basic',
      savedAt,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    // Save to file system (in production, use database)
    const progressDir = path.join(process.cwd(), 'data', 'progress');
    await fs.mkdir(progressDir, { recursive: true });
    
    const progressFile = path.join(progressDir, `${resumeToken}.json`);
    await fs.writeFile(progressFile, JSON.stringify(progressData, null, 2));

    // Generate resume URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://esgpro.vercel.app';
    const resumeUrl = `${baseUrl}/?resume=${resumeToken}`;

    // TODO: Send email with resume link
    // For now, just return the URL
    // In production, integrate with SendGrid or similar

    return res.status(200).json({
      success: true,
      resumeUrl,
      message: 'Progress saved! Check your email for the resume link.'
    });

  } catch (error) {
    console.error('Save progress error:', error);
    return res.status(500).json({ error: 'Failed to save progress' });
  }
}
