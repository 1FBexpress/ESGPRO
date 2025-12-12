// Conversation flow logic - defines question sequence, validation, and quick reply options

export const TOTAL_STEPS = 9;
export const ESTIMATED_TIME = "2-3 minutes";

const STEPS = [
  // 0) Abacus-style opener (branch)
  {
    field: "intro_choice",
    question:
      "Before we begin, do you have any questions about B Corp certification or EcoVadis ratings?",
    explanation: "We can guide you through these programmes if they’re relevant to your business goals.",
    quickReplies: [
      { label: "Yes, tell me about B Corp", value: "bcorp_info" },
      { label: "Yes, tell me about EcoVadis", value: "ecovadis_info" },
      { label: "No, let’s continue", value: "no_questions" }
    ],
    validate: (value) => {
      const v = String(value || "").trim().toLowerCase();
      if (v === "bcorp_info" || v === "yes, tell me about b corp") return { valid: true, value: "bcorp_info" };
      if (v === "ecovadis_info" || v === "yes, tell me about ecovadis") return { valid: true, value: "ecovadis_info" };
      if (v === "no_questions" || v === "no, let’s continue" || v === "no, let's continue" || v === "no") {
        return { valid: true, value: "no_questions" };
      }
      return { valid: false, message: "Please choose one of the buttons." };
    },
    successMessage: null
  },

  // 1) Name
  {
    field: "contact_name",
    question: "Great — what’s your name?",
    explanation: null,
    quickReplies: null,
    validate: (value) => {
      if (!value || String(value).trim().length < 2) {
        return { valid: false, message: "Please enter at least 2 characters." };
      }
      return { valid: true, value: String(value).trim() };
    },
    successMessage: null
  },

  // 2) Company name
  {
    field: "company_name",
    question: "And your company name?",
    explanation: null,
    quickReplies: null,
    validate: (value) => {
      if (!value || String(value).trim().length < 2) {
        return { valid: false, message: "Please enter your company name (at least 2 characters)." };
      }
      return { valid: true, value: String(value).trim() };
    },
    successMessage: null
  },

  // 3) Company size
  {
    field: "size",
    question: "How would you describe the size of {company_name}?",
    explanation: "This helps tailor recommendations to your scale and resources.",
    quickReplies: [
      { label: "Small (1–50)", value: "small" },
      { label: "Medium (51–250)", value: "medium" },
      { label: "Large (250+)", value: "large" }
    ],
    validate: (value) => {
      const normalized = String(value || "").toLowerCase().trim();
      const map = { small: "small", medium: "medium", large: "large", s: "small", m: "medium", l: "large" };
      if (map[normalized]) return { valid: true, value: map[normalized] };
      return { valid: false, message: "Please choose Small, Medium, or Large." };
    },
    successMessage: null
  },

  // 4) Timeline urgency
  {
    field: "tender_days",
    question: "Do you have an upcoming tender or ESG-related deadline?",
    explanation: "Knowing your timeline helps us recommend the fastest compliant path.",
    quickReplies: [
      { label: "Less than 30 days", value: "20" },
      { label: "30–90 days", value: "60" },
      { label: "90+ days", value: "120" },
      { label: "No deadline yet", value: "0" }
    ],
    validate: (value) => {
      const v = String(value || "").trim();
      const n = Number(v);
      if (Number.isFinite(n) && n >= 0) return { valid: true, value: n };
      return { valid: false, message: "Please pick one of the buttons." };
    },
    successMessage: null
  },

  // 5) Primary goal
  {
    field: "primary_goal",
    question: "What’s your main goal right now?",
    explanation: "Pick the closest match — we’ll tailor recommendations to that path.",
    quickReplies: [
      { label: "B Corp certification", value: "bcorp" },
      { label: "EcoVadis rating", value: "ecovadis" },
      { label: "General ESG readiness", value: "readiness" },
      { label: "Carbon footprint / reporting", value: "carbon" }
    ],
    validate: (value) => {
      const v = String(value || "").toLowerCase().trim();
      const allowed = new Set(["bcorp", "ecovadis", "readiness", "carbon"]);
      if (allowed.has(v)) return { valid: true, value: v };
      return { valid: false, message: "Please choose one of the buttons." };
    },
    successMessage: null
  },

  // 6) Current status
  {
    field: "current_status",
    question: "How far along are you today?",
    explanation: null,
    quickReplies: [
      { label: "Just starting", value: "starting" },
      { label: "Some policies/data exist", value: "some" },
      { label: "We’ve done ESG reporting before", value: "reporting" }
    ],
    validate: (value) => {
      const v = String(value || "").toLowerCase().trim();
      const allowed = new Set(["starting", "some", "reporting"]);
      if (allowed.has(v)) return { valid: true, value: v };
      return { valid: false, message: "Please choose one of the buttons." };
    },
    successMessage: null
  },

  // 7) Location
  {
    field: "location",
    question: "Where is your company primarily based?",
    explanation: "Country is enough.",
    quickReplies: null,
    validate: (value) => {
      const t = String(value || "").trim();
      if (t.length < 2) return { valid: false, message: "Please enter a country (at least 2 characters)." };
      return { valid: true, value: t };
    },
    successMessage: null
  },

  // 8) Contact email
  {
    field: "email",
    question: "What’s the best email to send your summary and next steps?",
    explanation: null,
    quickReplies: null,
    validate: (value) => {
      const email = String(value || "").trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!ok) return { valid: false, message: "Please enter a valid email address." };
      return { valid: true, value: email };
    },
    successMessage: "Thanks — generating your recommendations now."
  }
];

function fillTemplate(text, collectedData) {
  if (!text) return text;
  return String(text).replace(/\{(\w+)\}/g, (_, key) => {
    const v = collectedData?.[key];
    return v === undefined || v === null ? `{${key}}` : String(v);
  });
}

export function getNextQuestion(stepIndex, collectedData = {}) {
  const step = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  return {
    stepIndex,
    field: step.field,
    question: fillTemplate(step.question, collectedData),
    explanation: fillTemplate(step.explanation, collectedData),
    quickReplies: step.quickReplies
  };
}

export function validateResponse(stepIndex, userInput, collectedData = {}) {
  const step = STEPS[stepIndex];
  if (!step) return { valid: false, message: "Invalid step." };

  // Special handling for intro_choice: if user clicks B Corp / EcoVadis, we show info
  // and then keep them on the same step by returning a synthetic "message-only" response.
  if (step.field === "intro_choice") {
    const v = String(userInput || "").toLowerCase().trim();

    if (v === "bcorp_info") {
      return {
        valid: false,
        message:
          "B Corp is a certification for businesses that meet high standards of social and environmental performance, accountability, and transparency.\n\nIf you want, we can keep the assessment focused on the quickest path for your situation — or continue with general ESG readiness.",
        quickReplies: step.quickReplies
      };
    }

    if (v === "ecovadis_info") {
      return {
        valid: false,
        message:
          "EcoVadis provides sustainability ratings used widely in supply chains. A higher score can improve supplier acceptance and tender outcomes.\n\nIf you want, we can keep the assessment focused on EcoVadis — or continue with general ESG readiness.",
        quickReplies: step.quickReplies
      };
    }
  }

  const result = step.validate(userInput, collectedData);

  if (!result.valid) {
    return { valid: false, message: result.message };
  }

  return {
    valid: true,
    field: step.field,
    value: result.value,
    message: step.successMessage ? fillTemplate(step.successMessage, { ...collectedData, [step.field]: result.value }) : null
  };
}

export function isInterviewComplete(stepIndex, collectedData = {}) {
  // Complete after the last step is answered
  return stepIndex >= STEPS.length;
}
