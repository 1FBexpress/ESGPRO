// EcoVadis-specific questionnaire - "How far do you need to go out of the gate?"
// Based on decision tree from EcoVadis Question Flows.docx.pdf

const ECOVADIS_STEPS = [
  {
    field: 'uk_government_buyer',
    question: "Is the buyer a UK central government/NHS body (or prime supplier to them)?",
    explanation: "UK government and NHS contracts often have specific ESG requirements. This helps us determine the expected rating level.",
    quickReplies: [
      { label: "✅ Yes", value: "yes", icon: "✅" },
      { label: "❌ No", value: "no", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized === '✅ yes' || normalized === 'y') {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized === '❌ no' || normalized === 'n') {
        return { valid: true, value: 'no' };
      }
      return { 
        valid: false, 
        message: "Please answer Yes or No." 
      };
    },
    successMessage: "Got it! 👍"
  },
  {
    field: 'critical_role',
    question: "Is your role as a critical supplier / high-impact goods or services?",
    explanation: "Critical suppliers to government/NHS typically need Gold rating, while non-critical roles need minimum Silver.",
    quickReplies: [
      { label: "✅ Yes - Critical/High-impact", value: "yes", icon: "✅" },
      { label: "❌ No - Standard role", value: "no", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('critical') || normalized === '✅ yes - critical/high-impact') {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized.includes('standard') || normalized === '❌ no - standard role') {
        return { valid: true, value: 'no' };
      }
      return { 
        valid: false, 
        message: "Please answer Yes or No." 
      };
    },
    successMessage: "Thank you! 📊"
  },
  {
    field: 'contract_value',
    question: "Is the annual contract value ≥£100-250k OR is the buyer a Tier-1 multinational with formal supplier ESG ratings?",
    explanation: "High-value contracts and Tier-1 multinationals typically require more comprehensive ESG documentation.",
    quickReplies: [
      { label: "✅ Yes", value: "yes", icon: "✅" },
      { label: "❌ No", value: "no", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized === '✅ yes' || normalized === 'y') {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized === '❌ no' || normalized === 'n') {
        return { valid: true, value: 'no' };
      }
      return { 
        valid: false, 
        message: "Please answer Yes or No." 
      };
    },
    successMessage: "Noted! 💰"
  },
  {
    field: 'tier1_critical_category',
    question: "Are you a Tier-1 (direct) supplier for a critical or regulated category?",
    explanation: "Examples: healthcare, food, electronics, chemicals, logistics at scale. Direct suppliers in these sectors typically need Gold rating.",
    quickReplies: [
      { label: "✅ Yes - Tier-1 critical", value: "yes", icon: "✅" },
      { label: "❌ No", value: "no", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('tier') || normalized.includes('critical')) {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized === '❌ no') {
        return { valid: true, value: 'no' };
      }
      return { 
        valid: false, 
        message: "Please answer Yes or No." 
      };
    },
    successMessage: "Perfect! 🎯"
  },
  {
    field: 'higher_risk_sector',
    question: "Is your sector higher-risk for environmental/labour/ethics?",
    explanation: "Examples: agriculture, apparel, electronics, chemicals, logistics. These sectors typically need Silver with expectation towards Gold.",
    quickReplies: [
      { label: "✅ Yes - Higher risk", value: "yes", icon: "✅" },
      { label: "❌ No - Standard risk", value: "no", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('higher') || normalized.includes('risk')) {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized.includes('standard')) {
        return { valid: true, value: 'no' };
      }
      return { 
        valid: false, 
        message: "Please answer Yes or No." 
      };
    },
    successMessage: "Thanks! ⚠️"
  },
  {
    field: 'buyer_scorecard_reference',
    question: "Does the buyer reference supplier scorecards/ratings/benchmarking?",
    explanation: "E.g., 'validation of compliance', 'improvement', 'peer benchmarking', 'annual score review' - even if no specific model is stated. Indicates minimum Silver expectation.",
    quickReplies: [
      { label: "✅ Yes - They mention scorecards", value: "yes", icon: "✅" },
      { label: "❌ No mention", value: "no", icon: "❌" },
      { label: "🤔 Not sure", value: "unsure", icon: "🤔" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('mention')) {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized === '❌ no mention') {
        return { valid: true, value: 'no' };
      }
      if (normalized.includes('unsure') || normalized.includes('not sure')) {
        return { valid: true, value: 'unsure' };
      }
      return { 
        valid: false, 
        message: "Please select one of the options." 
      };
    },
    successMessage: "Got it! 📋"
  },
  {
    field: 'sme_strong_governance',
    question: "Are you an SME (sub-250 employees) with strong policies, KPIs, governance oversight, and supply-chain controls already in place?",
    explanation: "Agile SMEs with mature ESG practices can often target Gold rating directly. If yes, we'll recommend stretching for Gold.",
    quickReplies: [
      { label: "✅ Yes - Strong systems", value: "yes", icon: "✅" },
      { label: "❌ No - Still building", value: "no", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('strong')) {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized.includes('building')) {
        return { valid: true, value: 'no' };
      }
      return { 
        valid: false, 
        message: "Please answer Yes or No." 
      };
    },
    successMessage: "Excellent! 💪"
  },
  {
    field: 'tender_timeline_months',
    question: "Is the tender 6-9 months away?",
    explanation: "Longer timelines allow for more ambitious targets. With 6-9 months, you can aim for Gold if you have some systems in place.",
    quickReplies: [
      { label: "✅ Yes - 6-9 months", value: "yes", icon: "✅" },
      { label: "⏱️ Less than 6 months", value: "under_6", icon: "⏱️" },
      { label: "📅 More than 9 months", value: "over_9", icon: "📅" },
      { label: "❌ No tender yet", value: "no_tender", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('6-9') || normalized.includes('yes')) {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('less') || normalized.includes('under')) {
        return { valid: true, value: 'under_6' };
      }
      if (normalized.includes('more') || normalized.includes('over')) {
        return { valid: true, value: 'over_9' };
      }
      if (normalized.includes('no') || normalized.includes('not yet')) {
        return { valid: true, value: 'no_tender' };
      }
      return { 
        valid: false, 
        message: "Please select one of the timeline options." 
      };
    },
    successMessage: "Perfect timing info! ⏰"
  },
  {
    field: 'current_maturity',
    question: "What's your current ESG maturity level?",
    explanation: "This helps us recommend the right target rating. Policies-only typically means Silver target; KPIs + supply-chain controls can target Gold.",
    quickReplies: [
      { label: "📄 Policies only", value: "policies_only", icon: "📄" },
      { label: "📊 KPIs + some controls", value: "kpis_controls", icon: "📊" },
      { label: "🏆 Comprehensive systems", value: "comprehensive", icon: "🏆" },
      { label: "🌱 Just starting", value: "starting", icon: "🌱" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('policies') || normalized === '📄 policies only') {
        return { valid: true, value: 'policies_only' };
      }
      if (normalized.includes('kpis') || normalized.includes('controls')) {
        return { valid: true, value: 'kpis_controls' };
      }
      if (normalized.includes('comprehensive') || normalized.includes('systems')) {
        return { valid: true, value: 'comprehensive' };
      }
      if (normalized.includes('starting') || normalized.includes('just')) {
        return { valid: true, value: 'starting' };
      }
      return { 
        valid: false, 
        message: "Please select one of the maturity levels." 
      };
    },
    successMessage: "Thanks for that context! 🎯"
  },
  {
    field: 'target_rating_preference',
    question: "Based on your answers, what rating do you think you'll need?",
    explanation: "We'll provide our recommendation, but it's helpful to know what you're aiming for or what the buyer expects.",
    quickReplies: [
      { label: "🥉 Bronze (Basic compliance)", value: "bronze", icon: "🥉" },
      { label: "🥈 Silver (Good performance)", value: "silver", icon: "🥈" },
      { label: "🥇 Gold (Excellence)", value: "gold", icon: "🥇" },
      { label: "🤔 Not sure yet", value: "unsure", icon: "🤔" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('bronze')) {
        return { valid: true, value: 'bronze' };
      }
      if (normalized.includes('silver')) {
        return { valid: true, value: 'silver' };
      }
      if (normalized.includes('gold')) {
        return { valid: true, value: 'gold' };
      }
      if (normalized.includes('unsure') || normalized.includes('not sure')) {
        return { valid: true, value: 'unsure' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Perfect! We'll factor that in. 🎯"
  },
  {
    field: 'budget_awareness',
    question: "Have you allocated budget for EcoVadis certification?",
    explanation: "Our introductory bundle is £2,400 including gap analysis, 8×2-hour expert sessions, and corrective action plan.",
    quickReplies: [
      { label: "✅ Yes - Budget approved", value: "approved", icon: "✅" },
      { label: "💭 In discussion", value: "discussing", icon: "💭" },
      { label: "📋 Need proposal first", value: "need_proposal", icon: "📋" },
      { label: "❌ Not yet", value: "not_yet", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('approved') || normalized.includes('yes')) {
        return { valid: true, value: 'approved' };
      }
      if (normalized.includes('discuss')) {
        return { valid: true, value: 'discussing' };
      }
      if (normalized.includes('proposal')) {
        return { valid: true, value: 'need_proposal' };
      }
      if (normalized.includes('not') || normalized.includes('no')) {
        return { valid: true, value: 'not_yet' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Great! We'll include budget considerations in your assessment. 💰"
  },
  {
    field: 'additional_esg_goals',
    question: "Are there any other ESG goals or compliance requirements you're working towards?",
    explanation: "E.g., ISO certifications, Carbon neutrality, B Corp, specific industry standards, etc. This helps us provide holistic recommendations.",
    quickReplies: null,
    validate: (value) => {
      if (!value || value.trim().length < 3) {
        return { valid: false, message: "Please share any additional goals, or type 'none' if not applicable." };
      }
      return { valid: true, value: value.trim() };
    },
    successMessage: "Thank you! That's really helpful context. 🙏"
  }
];

export const ECOVADIS_TOTAL_STEPS = ECOVADIS_STEPS.length;
export const ECOVADIS_ESTIMATED_TIME = "4-5 minutes";

export function getEcoVadisQuestion(step, collectedData) {
  if (step >= ECOVADIS_STEPS.length) return null;
  
  const currentStep = ECOVADIS_STEPS[step];
  let question = currentStep.question;
  
  // Replace placeholders with collected data
  Object.keys(collectedData).forEach(key => {
    question = question.replace(`{${key}}`, collectedData[key]);
  });
  
  return {
    question,
    explanation: currentStep.explanation,
    quickReplies: currentStep.quickReplies
  };
}

export function getEcoVadisSuccessMessage(step, value) {
  if (step >= ECOVADIS_STEPS.length) return null;
  
  const currentStep = ECOVADIS_STEPS[step];
  let message = currentStep.successMessage || "Thank you! 😊";
  
  message = message.replace('{value}', value);
  
  return message;
}

export function validateEcoVadisResponse(step, userInput, collectedData) {
  if (step >= ECOVADIS_STEPS.length) {
    return { valid: false, message: "EcoVadis assessment already complete." };
  }
  
  const currentStep = ECOVADIS_STEPS[step];
  const validation = currentStep.validate(userInput);
  
  if (validation.valid) {
    return {
      valid: true,
      field: currentStep.field,
      value: validation.value,
      message: getEcoVadisSuccessMessage(step, validation.value)
    };
  }
  
  return {
    valid: false,
    message: validation.message
  };
}

export function isEcoVadisComplete(step, collectedData) {
  if (step < ECOVADIS_STEPS.length) return false;
  
  const requiredFields = ECOVADIS_STEPS.map(s => s.field);
  return requiredFields.every(field => collectedData.hasOwnProperty(field));
}

export function buildEcoVadisPayload(collectedData) {
  return {
    ...collectedData,
    questionnaire_type: 'ecovadis',
    completed_at: new Date().toISOString()
  };
}
