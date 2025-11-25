
import { useState, useEffect, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import ResultsPanel from './ResultsPanel';
import ProgressIndicator from './ProgressIndicator';
import { 
  getNextQuestion, 
  validateResponse, 
  isInterviewComplete, 
  TOTAL_STEPS, 
  ESTIMATED_TIME 
} from '../lib/conversationFlow';
import styles from '../styles/ChatInterface.module.css';

export default function ChatInterface() {
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
  }, [messages]);

  useEffect(() => {
    // Start conversation - get straight to questions
    if (messages.length === 0) {
      setTimeout(() => {
        setShowProgress(true);
        const questionData = getNextQuestion(currentStep, {});
        addBotMessage(questionData.question, questionData.explanation, questionData.quickReplies);
      }, 300);
    }
  }, []);

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
      addBotMessage(validation.message);
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
        addBotMessage("🎉 Wonderful! Thank you so much for sharing all that information.\n\nLet me analyze your responses and prepare your personalized ESG assessment...");
        
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

  // Show results panel if interview is complete
  if (apiResponse) {
    return <ResultsPanel />;
  }

  // Calculate actual current question number (accounting for bot messages)
  const currentQuestionNumber = Math.min(currentStep + 1, TOTAL_STEPS);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2 className={styles.chatTitle}>ESG Assessment</h2>
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
    </div>
  );
}
