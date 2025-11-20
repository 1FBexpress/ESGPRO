
// pages/api/interview.js - Enhanced version with weighted scoring and email notifications

import { sendLeadNotificationEmail } from '../../lib/emailService';

/**
 * Enhanced lead scoring algorithm with weighted criteria
 * Total score: 0-100
 * - Tender urgency: 40 points max
 * - Company size: 30 points max
 * - ESG maturity: 25 points max
 * - Industry relevance: 5 points bonus
 */
function calculateLeadScore(answers) {
  let score = 0;
  
  // 1. Tender Urgency (40 points max)
  const tenderDays = Number(answers.tender_days) || 0;
  if (tenderDays > 0) {
    if (tenderDays < 30) {
      score += 40; // <30 days: Critical urgency
    } else if (tenderDays <= 90) {
      score += 25; // 30-90 days: Medium urgency
    } else {
      score += 10; // 90+ days: Low urgency
    }
  }
  
  // 2. Company Size (30 points max)
  const sizeStr = String(answers.size || '').toLowerCase();
  if (sizeStr === 'large' || (Number(answers.size) > 100)) {
    score += 30; // Large companies
  } else if (sizeStr === 'medium' || (Number(answers.size) >= 26 && Number(answers.size) <= 100)) {
    score += 20; // Medium companies
  } else if (sizeStr === 'small' || Number(answers.size) < 26) {
    score += 10; // Small companies
  }
  
  // 3. ESG Maturity (25 points max) - Less mature = more opportunity
  const esgStatus = (answers.current_esg_status || '').toLowerCase();
  if (esgStatus.includes('none') || esgStatus.includes('just starting') || 
      esgStatus.includes('not sure') || esgStatus.includes('no formal')) {
    score += 25; // Just starting - highest opportunity
  } else if (esgStatus.includes('some') || esgStatus.includes('partial') || 
             esgStatus.includes('basic')) {
    score += 15; // Some measures in place
  } else if (esgStatus.includes('established') || esgStatus.includes('mature') || 
             esgStatus.includes('comprehensive')) {
    score += 5; // Already established - lower opportunity
  } else {
    score += 10; // Unknown/unclear status
  }
  
  // 4. Industry Relevance (5 points bonus for high-risk industries)
  const industry = (answers.industry || '').toLowerCase();
  const highRiskIndustries = [
    'manufacturing', 'construction', 'energy', 'transport', 'logistics',
    'industrial', 'utilities', 'oil', 'gas', 'mining', 'chemical'
  ];
  
  if (highRiskIndustries.some(risk => industry.includes(risk))) {
    score += 5; // High-risk industries have more ESG pressure
  }
  
  // Ensure score is between 0-100
  return Math.min(100, Math.max(0, score));
}

/**
 * Determine urgency level based on tender timeline
 */
function determineUrgency(tenderDays) {
  const days = Number(tenderDays) || 0;
  
  if (days > 0 && days < 30) {
    return 'high';
  } else if (days >= 30 && days <= 90) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Determine recommended action based on score
 */
function determineAction(score, urgency) {
  // High score = book consultation
  if (score >= 70) {
    return 'BOOK_FREE_CONSULT';
  }
  
  // Medium score = £50 assessment
  if (score >= 40) {
    return 'BUY_50_ASSESSMENT';
  }
  
  // Low score = nurture
  return 'NURTURE';
}

/**
 * Determine SKU recommendation based on company size
 */
function determineSKU(answers) {
  const sizeStr = String(answers.size || '').toLowerCase();
  const sizeNum = Number(answers.size) || 0;
  
  if (sizeStr === 'large' || sizeNum > 100) {
    return 'ESG-3'; // 26-100 employees (our largest tier in prices.json)
  } else if (sizeStr === 'medium' || (sizeNum >= 26 && sizeNum <= 100)) {
    return 'ESG-3'; // 26-100 employees
  } else if (sizeNum >= 11 && sizeNum <= 25) {
    return 'ESG-2'; // 11-25 employees
  } else {
    return 'ESG-1'; // 1-10 employees
  }
}

/**
 * Generate contextual focus points based on lead data
 */
function generateFocusPoints(answers, urgency, score) {
  const focus_points = [];
  const tenderDays = Number(answers.tender_days) || 0;
  
  // Urgency-based focus
  if (urgency === 'high' && tenderDays > 0) {
    focus_points.push(`🚨 CRITICAL: Tender deadline in ${tenderDays} days - immediate action required`);
  } else if (urgency === 'medium' && tenderDays > 0) {
    focus_points.push(`⏰ Important: ${tenderDays} days to tender - priority follow-up needed`);
  }
  
  // Company size and industry focus
  focus_points.push(`${answers.size} company in ${answers.industry} - tailored ESG strategy needed`);
  
  // ESG maturity focus
  const esgStatus = (answers.current_esg_status || '').toLowerCase();
  if (esgStatus.includes('none') || esgStatus.includes('just starting')) {
    focus_points.push('Greenfield opportunity - can establish ESG framework from scratch');
  } else if (esgStatus.includes('some') || esgStatus.includes('partial')) {
    focus_points.push('Enhancement opportunity - build on existing ESG initiatives');
  }
  
  // Pain points analysis
  if (answers.pain_points) {
    const painPointsLower = String(answers.pain_points).toLowerCase();
    
    if (painPointsLower.includes('report') || painPointsLower.includes('document')) {
      focus_points.push('📄 Reporting & documentation support critical');
    }
    if (painPointsLower.includes('data') || painPointsLower.includes('measure')) {
      focus_points.push('📊 Data collection and measurement systems needed');
    }
    if (painPointsLower.includes('cost') || painPointsLower.includes('budget')) {
      focus_points.push('💰 Cost-effective solutions - emphasize ROI and £50 assessment');
    }
    if (painPointsLower.includes('compliance') || painPointsLower.includes('regulation')) {
      focus_points.push('⚖️ Regulatory compliance expertise required');
    }
  }
  
  // Score-based recommendation
  if (score >= 70) {
    focus_points.push('✅ High-value lead - prioritize for free consultation booking');
  } else if (score >= 40) {
    focus_points.push('💡 Good fit for £50 assessment entry point');
  }
  
  return focus_points.slice(0, 5); // Limit to 5 most relevant points
}

/**
 * Generate opening questions for sales team
 */
function generateOpeningQuestions(answers, urgency) {
  const opening_questions = [];
  const tenderDays = Number(answers.tender_days) || 0;
  
  // Tender-specific questions
  if (tenderDays > 0) {
    opening_questions.push(`What are the specific ESG requirements in the tender documentation?`);
    opening_questions.push(`What's the deadline for tender submission and are there any key milestones?`);
  }
  
  // Company-specific questions
  opening_questions.push(`What specific ESG challenges is ${answers.company_name} facing in ${answers.industry}?`);
  opening_questions.push(`Do you have any existing ESG data, energy consumption records, or sustainability reports?`);
  
  // Budget and decision-making
  opening_questions.push(`What's your budget range for ESG consultancy and implementation?`);
  opening_questions.push(`Who are the key decision-makers involved in this ESG initiative?`);
  
  return opening_questions.slice(0, 5); // Limit to 5 questions
}

/**
 * Generate pricing recommendation
 */
function generatePricingRecommendation(answers, sku) {
  const sizeStr = String(answers.size || '').toLowerCase();
  const sizeNum = Number(answers.size) || 0;
  
  let tier = 'Small (1-25)';
  if (sizeStr === 'large' || sizeNum > 100) {
    tier = 'Large (100+)';
  } else if (sizeStr === 'medium' || (sizeNum >= 26 && sizeNum <= 100)) {
    tier = 'Medium (26-100)';
  }
  
  return {
    tier,
    sku_recs: [sku],
    suggested_products: [
      `${sku} - ESG Assessment & Strategy`,
      'Carbon Footprint Analysis',
      'ESG Reporting & Documentation'
    ]
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const answers = req.body;

    // Validate required fields
    const requiredFields = ['contact_name', 'company_name', 'size', 'industry'];
    for (const field of requiredFields) {
      if (!answers[field]) {
        return res.status(400).json({ 
          error: `Missing required field: ${field}` 
        });
      }
    }

    // Calculate enhanced lead score (0-100)
    const score = calculateLeadScore(answers);
    
    // Determine urgency
    const urgency = determineUrgency(answers.tender_days);
    
    // Determine recommended action
    const action = determineAction(score, urgency);
    
    // Determine SKU recommendation
    const sku = determineSKU(answers);
    
    // Generate focus points
    const focus_points = generateFocusPoints(answers, urgency, score);
    
    // Generate opening questions
    const opening_questions = generateOpeningQuestions(answers, urgency);
    
    // Generate pricing recommendation
    const pricing_recommendation = generatePricingRecommendation(answers, sku);
    
    // Build comprehensive lead brief
    const tenderDays = Number(answers.tender_days) || 0;
    const lead_brief = `${answers.contact_name} from ${answers.company_name} (${answers.size} ${answers.industry} company) is seeking ESG support. ${
      tenderDays > 0 ? `⚠️ Urgent tender deadline in ${tenderDays} days. ` : ''
    }Current ESG status: ${answers.current_esg_status}. ${
      answers.pain_points ? `Main concerns: ${answers.pain_points}. ` : ''
    }Lead score: ${score}/100 (${urgency} priority). Recommended action: ${action}.`;

    // Prepare API response
    const response = {
      action,
      urgency,
      score,
      lead_brief,
      focus_points,
      opening_questions,
      pricing_recommendation,
      contact_info: {
        name: answers.contact_name,
        company: answers.company_name,
        email: answers.email,
        phone: answers.phone
      }
    };

    // Send email notification to sales team
    try {
      const emailResult = await sendLeadNotificationEmail(answers, response);
      
      if (emailResult.success) {
        console.log('✅ Lead notification sent successfully:', {
          company: answers.company_name,
          score,
          urgency,
          recipients: emailResult.recipients?.length || 4
        });
      } else if (!emailResult.skipped) {
        // Log error but don't fail the API request
        console.error('❌ Failed to send lead notification:', emailResult.error);
      }
    } catch (emailError) {
      // Email errors should not break the API
      console.error('Email notification error:', emailError);
    }

    // TODO: Insert lead into Supabase database
    // TODO: Create Stripe checkout session if action is BUY_50_ASSESSMENT
    // TODO: Log to analytics

    return res.status(200).json(response);

  } catch (error) {
    console.error('Interview API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
