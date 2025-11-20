
// Conversation flow logic - defines question sequence, validation, and quick reply options

const STEPS = [
  {
    field: 'contact_name',
    question: "Hi there! 👋 I'm excited to help you explore how Full Bin can support your ESG journey.\n\nTo get started, what's your name?",
    explanation: null,
    quickReplies: null,
    validate: (value) => {
      if (!value || value.trim().length < 2) {
        return { valid: false, message: "I'd love to know your name! Please enter at least 2 characters." };
      }
      return { valid: true, value: value.trim() };
    },
    successMessage: "Great to meet you, {value}! 😊"
  },
  {
    field: 'company_name',
    question: "What's the name of your company?",
    explanation: null,
    quickReplies: null,
    validate: (value) => {
      if (!value || value.trim().length < 2) {
        return { valid: false, message: "Please provide your company name so I can personalize your assessment." };
      }
      return { valid: true, value: value.trim() };
    },
    successMessage: "Perfect! Thanks for sharing that. ✨"
  },
  {
    field: 'size',
    question: "How would you describe the size of {company_name}?",
    explanation: "This helps us tailor recommendations to your company's scale and resources.",
    quickReplies: [
      { label: "🏢 Small (1-50)", value: "small", icon: "🏢" },
      { label: "🏭 Medium (51-250)", value: "medium", icon: "🏭" },
      { label: "🌆 Large (250+)", value: "large", icon: "🌆" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      const sizeMap = {
        'small': 'small',
        'medium': 'medium',
        'large': 'large',
        's': 'small',
        'm': 'medium',
        'l': 'large',
        '🏢 small (1-50)': 'small',
        '🏭 medium (51-250)': 'medium',
        '🌆 large (250+)': 'large'
      };
      
      if (sizeMap[normalized]) {
        return { valid: true, value: sizeMap[normalized] };
      }
      
      return { 
        valid: false, 
        message: "Please select one of the size options: small, medium, or large." 
      };
    },
    successMessage: "Got it! 📊"
  },
  {
    field: 'tender_days',
    question: "Do you have an upcoming tender or deadline related to ESG compliance?",
    explanation: "⏰ This helps us understand your timeline urgency. Many organizations need ESG documentation for public tenders, contracts, or compliance deadlines. Knowing your timeline helps us prioritize what matters most.",
    quickReplies: [
      { label: "⚡ Less than 30 days", value: "20", icon: "⚡" },
      { label: "📅 30-90 days", value: "60", icon: "📅" },
      { label: "🗓️ 90+ days", value: "120", icon: "🗓️" },
      { label: "❌ No tender yet", value: "0", icon: "❌" }
    ],
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      
      // Handle quick reply values
      const quickReplyMap = {
        '⚡ less than 30 days': 20,
        '📅 30-90 days': 60,
        '🗓️ 90+ days': 120,
        '❌ no tender yet': 0
      };
      
      if (quickReplyMap.hasOwnProperty(normalized)) {
        return { valid: true, value: quickReplyMap[normalized] };
      }
      
      // Handle text responses
      if (['no', 'none', 'n/a', 'not applicable', 'no tender'].some(term => normalized.includes(term))) {
        return { valid: true, value: 0 };
      }
      
      // Handle numeric input
      const days = parseInt(value);
      if (!isNaN(days) && days >= 0) {
        return { valid: true, value: days };
      }
      
      return { 
        valid: false, 
        message: "Please select one of the timeline options or enter the number of days until your deadline." 
      };
    },
    successMessage: "Thanks for letting me know! ⏱️"
  },
  {
    field: 'industry',
    question: "What industry does {company_name} operate in?",
    explanation: "Understanding your industry helps us identify sector-specific ESG requirements and best practices.",
    quickReplies: null,
    validate: (value) => {
      if (!value || value.trim().length < 2) {
        return { valid: false, message: "Please tell us your industry (e.g., manufacturing, retail, healthcare, etc.)." };
      }
      return { valid: true, value: value.trim() };
    },
    successMessage: "Excellent! 🎯"
  },
  {
    field: 'current_esg_status',
    question: "Where are you in your ESG journey?",
    explanation: "🌱 ESG stands for Environmental, Social, and Governance - the three key pillars of sustainable business practices. This helps us understand your starting point and identify the best next steps.",
    quickReplies: [
      { label: "🌟 Just starting", value: "just starting", icon: "🌟" },
      { label: "📈 Some measures in place", value: "some measures", icon: "📈" },
      { label: "✅ Well established", value: "well established", icon: "✅" },
      { label: "🤔 Not sure", value: "not sure", icon: "🤔" }
    ],
    validate: (value) => {
      if (!value || value.trim().length < 3) {
        return { valid: false, message: "Please describe your current ESG status or select one of the options above." };
      }
      return { valid: true, value: value.trim() };
    },
    successMessage: "Thanks for sharing! That's really helpful. 💡"
  },
  {
    field: 'pain_points',
    question: "Finally, what are your main challenges or concerns around ESG compliance?",
    explanation: "This could be anything - lack of resources, unclear requirements, documentation complexity, measurement difficulties, or anything else on your mind. The more specific you can be, the better we can help! 💪",
    quickReplies: null,
    validate: (value) => {
      if (!value || value.trim().length < 5) {
        return { valid: false, message: "Please share your main ESG challenges or concerns - even a brief description helps!" };
      }
      return { valid: true, value: value.trim() };
    },
    successMessage: "Thank you so much for sharing that! 🙏"
  }
];

export const TOTAL_STEPS = STEPS.length;
export const ESTIMATED_TIME = "2-3 minutes";

export function getNextQuestion(step, collectedData) {
  if (step >= STEPS.length) return null;
  
  const currentStep = STEPS[step];
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

export function getSuccessMessage(step, value) {
  if (step >= STEPS.length) return null;
  
  const currentStep = STEPS[step];
  let message = currentStep.successMessage || "Thank you! 😊";
  
  // Replace {value} with the actual value
  message = message.replace('{value}', value);
  
  return message;
}

export function validateResponse(step, userInput, collectedData) {
  if (step >= STEPS.length) {
    return { valid: false, message: "Interview already complete." };
  }
  
  const currentStep = STEPS[step];
  const validation = currentStep.validate(userInput);
  
  if (validation.valid) {
    return {
      valid: true,
      field: currentStep.field,
      value: validation.value,
      message: getSuccessMessage(step, validation.value)
    };
  }
  
  return {
    valid: false,
    message: validation.message
  };
}

export function isInterviewComplete(step, collectedData) {
  // Interview is complete when all steps are done
  if (step < STEPS.length) return false;
  
  // Verify all required fields are collected
  const requiredFields = STEPS.map(s => s.field);
  return requiredFields.every(field => collectedData.hasOwnProperty(field));
}

export function buildInterviewPayload(collectedData) {
  // Transform collected data into API payload format
  return {
    contact_name: collectedData.contact_name || '',
    company_name: collectedData.company_name || '',
    size: collectedData.size || 'small',
    tender_days: collectedData.tender_days || 0,
    industry: collectedData.industry || '',
    current_esg_status: collectedData.current_esg_status || '',
    pain_points: collectedData.pain_points || ''
  };
}
