import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useInterview } from '../context/InterviewContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import ResultsPanel from './ResultsPanel';
import ProgressIndicator from './ProgressIndicator';
import SaveProgressModal from './SaveProgressModal';
import {
  getNextQuestion,
  validateResponse,
  isInterviewComplete,
  TOTAL_STEPS,
  ESTIMATED_TIME
} from '../lib/conversationFlow';
import styles from '../styles/ChatInterface.module.css';

export default function ChatInterface() {
  const router = useRouter();
  const {
    messages,
    addMessage,
    collectedData,
    updateData,
    apiResponse,
    submitInterview,
    isLoading,
  } = useInterview();

  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  // NEW: widget open/close
  const [isWidgetOpen, setIsWidgetOpen] = useState(true);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    // Smart scroll: Only scroll the chat container, NOT the entire page
    // This prevents the landing page from jumping while keeping chat usable
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

      // Only auto-scroll if user is already near the bottom (they're following the conversation)
      // If they've scrolled up to read old messages, don't interrupt them
      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    // Re-enabled smart scroll: Only affects chat container, not the page
    // Scrolls only when user is near bottom (following conversation)
    if (!isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  // Auto-resume from saved progress
  useEffect(() => {
    const resumeToken = router.query.resume;

    if (resumeToken && messages.length === 0) {
      setIsResuming(true);

      // Fetch saved progress
      fetch(`/api/resume-progress?token=${resumeToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Restore progress
            setCurrentStep(data.currentStep);

            // Restore collected data
            Object.entries(data.collectedData).forEach(([key, value]) => {
              updateData(key, value);
            });

            // Add welcome back message
            addBotMessage(
              `✅ Welcome back! I've restored your progress from ${new Date(data.savedAt).toLocaleDateString()}.\n\nLet's continue where you left off...`,
              null,
              null
            );

            // Show next question after brief delay
            setTimeout(() => {
              setShowProgress(true);
              const questionData = getNextQuestion(data.currentStep, data.collectedData);
              addBotMessage(questionData.question, questionData.explanation, questionData.quickReplies);
            }, 1500);
          } else {
            // Invalid or expired token
            addBotMessage(
              data.message || "Sorry, this resume link is invalid or has expired. Let's start fresh!",
              null,
              null
            );

            // Start new conversation
            setTimeout(() => {
              setShowProgress(true);
              const questionData = getNextQuestion(0, {});
              addBotMessage(questionData.question, questionData.explanation, questionData.quickReplies);
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Resume error:', err);
          // Start new conversation on error
          setTimeout(() => {
            setShowProgress(true);
            const questionData = getNextQuestion(0, {});
            addBotMessage(questionData.question, questionData.explanation, questionData.quickReplies);
          }, 300);
        })
        .finally(() => {
          setIsResuming(false);
        });
    } else if (messages.length === 0) {
      // Start new conversation
      setTimeout(() => {
        setShowProgress(true);
        const questionData = getNextQuestion(currentStep, {});
        addBotMessage(questionData.question, questionData.explanation, questionData.quickReplies);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.resume]);

  const addBotMessage = (content, explanation = null, quickReplies = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        type: 'bot',
        content,
        explanation,
        quickReplies,
        timestamp: new Date().toISOString(),
      });
    }, 400); // Quick, consistent response
  };

  const processUserResponse = async (userMessage) => {
    // Add user message
    addMessage({
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    });

    // Validate and process response
    const validation = validateResponse(currentStep, userMessage, collectedData);

    if (!validation.valid) {
      // If validation includes quickReplies, pass them through so buttons show again
      addBotMessage(validation.message, null, validation.quickReplies || null);
      return;
    }

    // Update collected data
    updateData(validation.field, validation.value);
    const updatedData = { ...collectedData, [validation.field]: validation.value };

    // Show success message
    if (validation.message) {
      addBotMessage(validation.message);
    }

    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Check if interview is complete
    if (isInterviewComplete(nextStep, updatedData)) {
      setTimeout(() => {
        addBotMessage(
          "🎉 Wonderful! Thank you for sharing that information.\n\nLet me analyze your responses and prepare your personalized ESG assessment..."
        );

        // Submit interview
        setTimeout(async () => {
          await submitInterview();
        }, 1500);
      }, 1000);
    } else {
      // Ask next question after a brief delay
      setTimeout(() => {
        const questionData = getNextQuestion(nextStep, updatedData);
        addBotMessage(questionData.question, questionData.explanation, questionData.quickReplies);
      }, 1200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = input.trim();
    setInput('');

    await processUserResponse(userMessage);
  };

  const handleQuickReply = async (value) => {
    if (isLoading || isTyping) return;
    await processUserResponse(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSaveProgress = async (email) => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentStep,
          collectedData,
          questionnaireType: 'general' // TODO: Update when separate questionnaires added
        })
      });

      const data = await response.json();

      if (data.success) {
        setSaveSuccess(true);

        // Show success message
        addBotMessage(
          `✅ Great! I've saved your progress and sent a link to ${email}.\n\nYou can resume this assessment anytime within the next 30 days. Check your email for the link!`,
          null,
          null
        );

        // Hide success indicator after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to save progress');
      }
    } catch (error) {
      console.error('Save error:', error);
      throw error; // Re-throw to show error in modal
    } finally {
      setIsSaving(false);
    }
  };

  // Show results panel if interview is complete (keep as-is)
  if (apiResponse) {
    return <ResultsPanel />;
  }

  // Calculate actual current question number
  const currentQuestionNumber = Math.min(currentStep + 1, TOTAL_STEPS);

  // NEW: floating widget wrapper
  return (
    <>
      {!isWidgetOpen && (
        <button
          className={styles.widgetLauncher}
          onClick={() => setIsWidgetOpen(true)}
          type="button"
          aria-label="Open chat"
        >
          Chat
        </button>
      )}

      {isWidgetOpen && (
        <div className={styles.widgetPanel}>
          <div className={styles.widgetHeader}>
            <div>
              <div className={styles.widgetTitle}>ESG Pro Assistant</div>
              <div className={styles.widgetSub}>Online</div>
            </div>
            <button
              className={styles.widgetClose}
              onClick={() => setIsWidgetOpen(false)}
              type="button"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            <div className={styles.chatContainer}>
              <div className={styles.chatHeader}>
                <h2 className={styles.chatTitle}>ESG Assessment</h2>
                {currentStep > 0 && !apiResponse && (
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className={styles.saveButton}
                    disabled={isLoading || isTyping || isSaving}
                    title="Save your progress and continue later"
                  >
                    {saveSuccess ? '✅ Saved' : '💾 Save Progress'}
                  </button>
                )}
              </div>

              {showProgress && (
                <ProgressIndicator
                  current={currentQuestionNumber}
                  total={TOTAL_STEPS}
                  estimatedTime={ESTIMATED_TIME}
                />
              )}

              <div className={styles.messagesContainer} ref={messagesContainerRef}>
                <div className={styles.messagesList}>
                  {messages.map((message, index) => (
                    <Message
                      key={index}
                      message={message}
                      isLatest={index === messages.length - 1}
                      onQuickReply={handleQuickReply}
                      disabled={isLoading || isTyping}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className={styles.inputContainer}>
                <form onSubmit={handleSubmit} className={styles.inputForm}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your answer or click a button above..."
                    className={styles.input}
                    disabled={isLoading || isTyping}
                  />
                  <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={!input.trim() || isLoading || isTyping}
                  >
                    Send
                  </button>
                </form>
              </div>

              <SaveProgressModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={handleSaveProgress}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
