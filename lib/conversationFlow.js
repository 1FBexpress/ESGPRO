
// Conversation flow logic - defines question sequence and validation

const STEPS = [
  {
    field: 'contact_name',
    question: "What's your name?",
    validate: (value) => {
      if (!value || value.trim().length < 2) {
        return { valid: false, message: "Please provide your name." };
      }
      return { valid: true, value: value.trim() };
    }
  },
  {
    field: 'company_name',
    question: "Great to meet you, {contact_name}! What's your company name?",
    validate: (value) => {
      if (!value || value.trim().length < 2) {
        return { valid: false, message: "Please provide your company name." };
      }
      return { valid: true, value: value.trim() };
    }
  },
  {
    field: 'size',
    question: "How would you describe your company size? (small, medium, or large)",
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (['small', 'medium', 'large', 's', 'm', 'l'].includes(normalized)) {
        let size = normalized;
        if (normalized === 's') size = 'small';
        if (normalized === 'm') size = 'medium';
        if (normalized === 'l') size = 'large';
        return { valid: true, value: size };
      }
      return { 
        valid: false, 
        message: "Please specify small, medium, or large." 
      };
    }
  },
  {
    field: 'tender_days',
    question: "Do you have an upcoming tender or deadline? If so, how many days until it's due? (Enter a number, or type 'no' if not applicable)",
    validate: (value) => {
      const normalized = value.toLowerCase().trim();
      if (normalized === 'no' || normalized === 'none' || normalized === 'n/a') {
        return { valid: true, value: 0 };
      }
      const days = parseInt(value);
      if (isNaN(days) || days < 0) {
        return { 
          valid: false, 
          message: "Please enter the number of days, or type 'no' if not applicable." 
        };
      }
      return { valid: true, value: days };
    }
  },
  {
    field: 'industry',
    question: "What industry is {company_name} in?",
    validate: (value) => {
      if (!value || value.trim().length < 2) {
        return { valid: false, message: "Please tell us your industry." };
      }
      return { valid: true, value: value.trim() };
    }
  },
  {
    field: 'current_esg_status',
    question: "What's your current ESG status? (e.g., just starting, have some measures, fully compliant, or not sure)",
    validate: (value) => {
      if (!value || value.trim().length < 3) {
        return { valid: false, message: "Please describe your current ESG status." };
      }
      return { valid: true, value: value.trim() };
    }
  },
  {
    field: 'pain_points',
    question: "Finally, what are your main challenges or concerns around ESG compliance?",
    validate: (value) => {
      if (!value || value.trim().length < 5) {
        return { valid: false, message: "Please share your main ESG challenges or concerns." };
      }
      return { valid: true, value: value.trim() };
    }
  }
];

export function getNextQuestion(step, collectedData) {
  if (step >= STEPS.length) return null;
  
  let question = STEPS[step].question;
  
  // Replace placeholders with collected data
  Object.keys(collectedData).forEach(key => {
    question = question.replace(`{${key}}`, collectedData[key]);
  });
  
  return question;
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
      message: validation.message || "Thank you!"
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
