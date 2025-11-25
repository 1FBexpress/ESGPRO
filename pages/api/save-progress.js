import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, currentStep, collectedData, questionnaireType } = req.body;

    // Validate required fields
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (currentStep === undefined || !collectedData) {
      return res.status(400).json({ error: 'Progress data is required' });
    }

    // Generate unique resume token
    const resumeToken = crypto.randomBytes(32).toString('hex');
    
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Create progress record
    const progressRecord = {
      id: Date.now(),
      email,
      resumeToken,
      currentStep,
      collectedData,
      questionnaireType: questionnaireType || 'general',
      savedAt: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
      status: 'in_progress'
    };

    // Read existing saved progress
    const dataDir = path.join(process.cwd(), 'data');
    const progressFile = path.join(dataDir, 'saved-progress.json');

    let savedProgress = [];
    try {
      const fileContent = await readFile(progressFile, 'utf-8');
      savedProgress = JSON.parse(fileContent);
    } catch (err) {
      // File doesn't exist yet, that's okay
      console.log('Creating new saved-progress.json file');
    }

    // Check if email already has saved progress
    const existingIndex = savedProgress.findIndex(p => p.email === email);
    if (existingIndex !== -1) {
      // Update existing progress
      savedProgress[existingIndex] = progressRecord;
    } else {
      // Add new progress
      savedProgress.push(progressRecord);
    }

    // Write back to file
    await writeFile(progressFile, JSON.stringify(savedProgress, null, 2));

    // Generate resume URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://esgpro.vercel.app';
    const resumeUrl = `${baseUrl}?resume=${resumeToken}`;

    // TODO: Send email with resume link
    // For now, just return the link
    console.log(`Resume link for ${email}: ${resumeUrl}`);

    return res.status(200).json({
      success: true,
      message: 'Progress saved successfully',
      resumeUrl,
      expiresAt: expiryDate.toISOString()
    });

  } catch (error) {
    console.error('Save progress error:', error);
    return res.status(500).json({ 
      error: 'Failed to save progress',
      details: error.message 
    });
  }
}
