// B Corp-specific questionnaire - "B Corp or EcoVadis?" decision tree
// Based on decision tree from EcoVadis Question Flows.docx.pdf

const BCORP_STEPS = [
  {
    field: 'esg_audience',
    question: "Who do you most need to demonstrate ESG progress to?",
    explanation: "This helps determine whether B Corp or EcoVadis (or both) is the right path. B Corp resonates with consumers/employees/investors, while EcoVadis is preferred by procurement teams and corporate buyers.",
    quickReplies: [
      { label: "👥 Consumers, employees, investors", value: "consumers_employees_investors", icon: "👥" },
      { label: "💼 Procurement teams, corporates", value: "procurement_corporates", icon: "💼" },
      { label: "🏛️ Government buyers, NGOs", value: "government_ngos", icon: "🏛️" },
      { label: "🌍 All of the above", value: "all", icon: "🌍" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('consumer') || normalized.includes('employee') || normalized.includes('investor')) {
        return { valid: true, value: 'consumers_employees_investors' };
      }
      if (normalized.includes('procurement') || normalized.includes('corporate')) {
        return { valid: true, value: 'procurement_corporates' };
      }
      if (normalized.includes('government') || normalized.includes('ngo')) {
        return { valid: true, value: 'government_ngos' };
      }
      if (normalized.includes('all') || normalized.includes('everyone')) {
        return { valid: true, value: 'all' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Perfect! That helps narrow down the best path for you. 🎯"
  },
  {
    field: 'willing_amend_articles',
    question: "Are you willing to amend your Articles of Association (legal governance change) to embed purpose into your company structure?",
    explanation: "B Corp requires a legal commitment by amending your Articles to consider stakeholder impact in decision-making. This is a defining feature of B Corp certification.",
    quickReplies: [
      { label: "✅ Yes - Ready for legal change", value: "yes", icon: "✅" },
      { label: "🤔 Need to discuss with board", value: "need_discussion", icon: "🤔" },
      { label: "❌ No - Prefer not to", value: "no", icon: "❌" },
      { label: "❓ What does this involve?", value: "need_info", icon: "❓" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('ready')) {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('discuss') || normalized.includes('board')) {
        return { valid: true, value: 'need_discussion' };
      }
      if (normalized.includes('no') || normalized.includes('prefer not')) {
        return { valid: true, value: 'no' };
      }
      if (normalized.includes('what') || normalized.includes('involve') || normalized.includes('info')) {
        return { valid: true, value: 'need_info' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Thank you for that clarity! 📝"
  },
  {
    field: 'primary_ambition',
    question: "Is your primary ambition to be seen as a purpose-driven leader with broad cultural impact?",
    explanation: "B Corp is ideal for companies wanting to signal values-driven leadership and attract purpose-aligned talent/customers. EcoVadis is more procurement-focused. Choose based on your strategic priorities.",
    quickReplies: [
      { label: "✅ Yes - Cultural transformation", value: "yes_cultural", icon: "✅" },
      { label: "📈 No - Focus on procurement credibility", value: "no_procurement", icon: "📈" },
      { label: "🤝 Both are important", value: "both", icon: "🤝" },
      { label: "🤔 Not sure yet", value: "unsure", icon: "🤔" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('cultural')) {
        return { valid: true, value: 'yes_cultural' };
      }
      if (normalized.includes('no') || normalized.includes('procurement')) {
        return { valid: true, value: 'no_procurement' };
      }
      if (normalized.includes('both')) {
        return { valid: true, value: 'both' };
      }
      if (normalized.includes('unsure') || normalized.includes('not sure')) {
        return { valid: true, value: 'unsure' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Great! That helps us recommend the right certification. 🌟"
  },
  {
    field: 'prefer_numeric_scorecard',
    question: "Do you prefer a certification that gives you a numeric ESG scorecard updated annually and benchmarked against peers?",
    explanation: "EcoVadis provides numerical scores (0-100) and ratings (Bronze/Silver/Gold/Platinum) that are updated annually, making progress tracking and peer comparison easy. B Corp uses a points system but the focus is on the certification badge itself.",
    quickReplies: [
      { label: "✅ Yes - Want numeric scores", value: "yes", icon: "✅" },
      { label: "❌ No - Badge is enough", value: "no", icon: "❌" },
      { label: "🤔 Not a priority", value: "not_priority", icon: "🤔" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('numeric') || normalized.includes('scores')) {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized.includes('badge')) {
        return { valid: true, value: 'no' };
      }
      if (normalized.includes('not') || normalized.includes('priority')) {
        return { valid: true, value: 'not_priority' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Got it! 📊"
  },
  {
    field: 'budget_both_certifications',
    question: "Do you have the budget and internal resources to pursue BOTH B Corp and EcoVadis at the same time?",
    explanation: "Both certifications require investment in time and money. Our introductory bundle for each is £2,400. Pursuing both simultaneously requires dedicated resources but provides maximum credibility across all audiences.",
    quickReplies: [
      { label: "✅ Yes - Can do both", value: "yes", icon: "✅" },
      { label: "❌ No - Need to prioritize", value: "no", icon: "❌" },
      { label: "💭 Maybe sequentially", value: "sequential", icon: "💭" },
      { label: "📋 Need cost breakdown", value: "need_costs", icon: "📋" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('both')) {
        return { valid: true, value: 'yes' };
      }
      if (normalized.includes('no') || normalized.includes('prioritize')) {
        return { valid: true, value: 'no' };
      }
      if (normalized.includes('sequential') || normalized.includes('one at a time')) {
        return { valid: true, value: 'sequential' };
      }
      if (normalized.includes('cost') || normalized.includes('breakdown')) {
        return { valid: true, value: 'need_costs' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Thanks for that clarity! 💰"
  },
  {
    field: 'need_quick_result',
    question: "Do you need a quicker result (6-12 months) to show progress in the market?",
    explanation: "EcoVadis typically takes 6-12 months from start to certification. B Corp can take 12-24 months depending on company readiness and the assessment backlog. If speed is critical, this influences the recommendation.",
    quickReplies: [
      { label: "⏱️ Yes - Need results quickly", value: "yes_urgent", icon: "⏱️" },
      { label: "📅 No - Can take 12-24 months", value: "no_patient", icon: "📅" },
      { label: "🤔 Depends on the benefits", value: "depends", icon: "🤔" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('quick') || normalized.includes('urgent')) {
        return { valid: true, value: 'yes_urgent' };
      }
      if (normalized.includes('no') || normalized.includes('patient') || normalized.includes('12-24')) {
        return { valid: true, value: 'no_patient' };
      }
      if (normalized.includes('depends') || normalized.includes('benefits')) {
        return { valid: true, value: 'depends' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Perfect timing info! ⏰"
  },
  {
    field: 'contracts_require_scorecard',
    question: "Do your current or target contracts require a structured ESG scorecard?",
    explanation: "Examples: NHS Evergreen, PPN 06/21, supplier audits, formal ESG rating requirements. If yes, EcoVadis is typically the standard. B Corp is recognized but doesn't provide the scorecard format most procurement teams expect.",
    quickReplies: [
      { label: "✅ Yes - Scorecard required", value: "yes_required", icon: "✅" },
      { label: "💭 Not explicitly stated", value: "not_stated", icon: "💭" },
      { label: "❌ No - Just ESG credentials", value: "no_just_credentials", icon: "❌" },
      { label: "🤔 Not sure", value: "unsure", icon: "🤔" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('required')) {
        return { valid: true, value: 'yes_required' };
      }
      if (normalized.includes('not') || normalized.includes('stated')) {
        return { valid: true, value: 'not_stated' };
      }
      if (normalized.includes('no') || normalized.includes('just') || normalized.includes('credentials')) {
        return { valid: true, value: 'no_just_credentials' };
      }
      if (normalized.includes('unsure') || normalized.includes('not sure')) {
        return { valid: true, value: 'unsure' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Noted! That's important context. 📋"
  },
  {
    field: 'current_impact_measurement',
    question: "Do you currently measure and track your social/environmental impact?",
    explanation: "B Corp requires comprehensive impact measurement across five areas: Governance, Workers, Community, Environment, Customers. If you're already tracking these, you'll have a head start.",
    quickReplies: [
      { label: "✅ Yes - Comprehensive tracking", value: "yes_comprehensive", icon: "✅" },
      { label: "📊 Some metrics tracked", value: "some_metrics", icon: "📊" },
      { label: "🌱 Just starting", value: "starting", icon: "🌱" },
      { label: "❌ Not yet", value: "not_yet", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('yes') || normalized.includes('comprehensive')) {
        return { valid: true, value: 'yes_comprehensive' };
      }
      if (normalized.includes('some') || normalized.includes('metrics')) {
        return { valid: true, value: 'some_metrics' };
      }
      if (normalized.includes('starting') || normalized.includes('just')) {
        return { valid: true, value: 'starting' };
      }
      if (normalized.includes('not') || normalized.includes('no')) {
        return { valid: true, value: 'not_yet' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Great context! 📈"
  },
  {
    field: 'team_size_implementation',
    question: "How many people can you dedicate to the certification process?",
    explanation: "B Corp typically requires 0.5-2 FTE (depending on company size and readiness), while EcoVadis needs 0.25-1 FTE. Both need cross-functional input (HR, operations, finance, etc.).",
    quickReplies: [
      { label: "👥 Dedicated team (2+ people)", value: "dedicated_team", icon: "👥" },
      { label: "👤 1 person part-time", value: "one_parttime", icon: "👤" },
      { label: "🤝 Cross-functional input only", value: "cross_functional", icon: "🤝" },
      { label: "🤔 Need to figure this out", value: "need_plan", icon: "🤔" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized.includes('dedicated') || normalized.includes('team') || normalized.includes('2+')) {
        return { valid: true, value: 'dedicated_team' };
      }
      if (normalized.includes('1') || normalized.includes('one') || normalized.includes('part')) {
        return { valid: true, value: 'one_parttime' };
      }
      if (normalized.includes('cross') || normalized.includes('functional')) {
        return { valid: true, value: 'cross_functional' };
      }
      if (normalized.includes('need') || normalized.includes('figure')) {
        return { valid: true, value: 'need_plan' };
      }
      return { valid: true, value: normalized };
    },
    successMessage: "Perfect! Resource planning is key. 👍"
  },
  {
    field: 'long_term_sustainability_goals',
    question: "What are your long-term sustainability and ESG goals?",
    explanation: "E.g., Net zero by 2030, becoming a B Corp, industry leadership in sustainability, meeting regulatory requirements, attracting impact investors, etc. This helps us align certification strategy with your vision.",
    quickReplies: null,
    validate: (value) => {
      if (!value || value.trim().length < 10) {
        return { valid: false, message: "Please share your long-term ESG vision - this helps us provide the best recommendations." };
      }
      return { valid: true, value: value.trim() };
    },
    successMessage: "Thank you for sharing your vision! That's inspiring. 🌟"
  }
];

export const BCORP_TOTAL_STEPS = BCORP_STEPS.length;
export const BCORP_ESTIMATED_TIME = "4-5 minutes";

export function getBCorpQuestion(step, collectedData) {
  if (step >= BCORP_STEPS.length) return null;
  
  const currentStep = BCORP_STEPS[step];
  let question = currentStep.question;
  
  Object.keys(collectedData).forEach(key => {
    question = question.replace(`{${key}}`, collectedData[key]);
  });
  
  return {
    question,
    explanation: currentStep.explanation,
    quickReplies: currentStep.quickReplies
  };
}

export function getBCorpSuccessMessage(step, value) {
  if (step >= BCORP_STEPS.length) return null;
  
  const currentStep = BCORP_STEPS[step];
  let message = currentStep.successMessage || "Thank you! 😊";
  
  message = message.replace('{value}', value);
  
  return message;
}

export function validateBCorpResponse(step, userInput, collectedData) {
  if (step >= BCORP_STEPS.length) {
    return { valid: false, message: "B Corp assessment already complete." };
  }
  
  const currentStep = BCORP_STEPS[step];
  const validation = currentStep.validate(userInput);
  
  if (validation.valid) {
    return {
      valid: true,
      field: currentStep.field,
      value: validation.value,
      message: getBCorpSuccessMessage(step, validation.value)
    };
  }
  
  return {
    valid: false,
    message: validation.message
  };
}

export function isBCorpComplete(step, collectedData) {
  if (step < BCORP_STEPS.length) return false;
  
  const requiredFields = BCORP_STEPS.map(s => s.field);
  return requiredFields.every(field => collectedData.hasOwnProperty(field));
}

export function buildBCorpPayload(collectedData) {
  return {
    ...collectedData,
    questionnaire_type: 'bcorp',
    completed_at: new Date().toISOString()
  };
}
