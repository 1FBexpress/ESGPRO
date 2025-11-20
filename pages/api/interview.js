
// pages/api/interview.js - Enhanced version with more realistic logic

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

    // Calculate urgency based on tender days
    let urgency = 'low';
    const tenderDays = Number(answers.tender_days) || 0;
    
    if (tenderDays > 0 && tenderDays <= 14) {
      urgency = 'high';
    } else if (tenderDays > 14 && tenderDays <= 60) {
      urgency = 'medium';
    }

    // Calculate score based on multiple factors
    let score = 30; // Base score

    // Company size factor
    const sizeScores = {
      'small': 20,
      'medium': 30,
      'large': 40
    };
    score += sizeScores[answers.size.toLowerCase()] || 20;

    // Urgency factor
    if (urgency === 'high') score += 30;
    else if (urgency === 'medium') score += 20;
    else score += 10;

    // ESG status factor (keywords analysis)
    const esgStatus = (answers.current_esg_status || '').toLowerCase();
    if (esgStatus.includes('none') || esgStatus.includes('just starting') || esgStatus.includes('not sure')) {
      score += 15;
    } else if (esgStatus.includes('some') || esgStatus.includes('partial')) {
      score += 10;
    } else {
      score += 5;
    }

    // Cap score at 100
    score = Math.min(100, score);

    // Determine SKU based on company size
    let sku = 'ESG-1';
    const size = answers.size.toLowerCase();
    if (size === 'medium') {
      sku = 'ESG-2';
    } else if (size === 'large') {
      sku = 'ESG-3';
    }

    // Determine recommended action
    let action = 'NURTURE';
    if (score >= 70) {
      action = 'BOOK_FREE_CONSULT';
    } else if (score >= 45) {
      action = 'BUY_50_ASSESSMENT';
    }

    // Generate focus points based on input
    const focus_points = [];
    
    if (tenderDays > 0 && tenderDays <= 30) {
      focus_points.push(`Urgent tender deadline in ${tenderDays} days - expedited support available`);
    }
    
    focus_points.push(`${answers.size} company ESG strategy development`);
    focus_points.push(`Industry-specific compliance for ${answers.industry}`);
    
    if (answers.pain_points) {
      const painPointsLower = answers.pain_points.toLowerCase();
      if (painPointsLower.includes('report') || painPointsLower.includes('document')) {
        focus_points.push('ESG reporting and documentation support');
      }
      if (painPointsLower.includes('data') || painPointsLower.includes('measure')) {
        focus_points.push('Data collection and measurement systems');
      }
      if (painPointsLower.includes('cost') || painPointsLower.includes('budget')) {
        focus_points.push('Cost-effective ESG implementation solutions');
      }
    }

    // Generate opening questions for consultant
    const opening_questions = [
      `What specific ESG requirements does ${answers.company_name} need to meet?`,
      `Do you have any existing ESG data or measurement systems in place?`,
      `What's your timeline for achieving ESG compliance?`
    ];

    if (tenderDays > 0) {
      opening_questions.unshift(`Tell me more about your tender requirements and key deliverables?`);
    }

    // Pricing recommendation
    const pricing_recommendation = {
      tier: size === 'small' ? 'Small (1-25)' : size === 'medium' ? 'Medium (26-100)' : 'Large (100+)',
      sku_recs: [sku],
      suggested_products: [
        `${sku} - ESG Assessment & Strategy`,
        'ESG Data Management Platform',
        'Compliance Documentation Suite'
      ]
    };

    // Build lead brief
    const lead_brief = `${answers.contact_name} from ${answers.company_name} (${answers.size} ${answers.industry} company) is seeking ESG support. ${
      tenderDays > 0 ? `Has urgent tender in ${tenderDays} days. ` : ''
    }Current ESG status: ${answers.current_esg_status}. Main concerns: ${answers.pain_points}. Recommended action: ${action}.`;

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
        company: answers.company_name
      }
    };

    // In production: 
    // - Insert lead into Supabase
    // - Trigger notifications to sales team
    // - Create Stripe checkout session if needed
    // - Log to analytics

    return res.status(200).json(response);

  } catch (error) {
    console.error('Interview API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
