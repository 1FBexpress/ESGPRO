
import { useState, useEffect, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import ResultsPanel from './ResultsPanel';
import { getNextQuestion, validateResponse, isInterviewComplete } from '../lib/conversationFlow';
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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Start conversation
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "👋 Hello! I'm your ESG Pro assistant. I'll help you understand how Full Bin can support your sustainability goals. Let's start with a few quick questions."
        );
        setTimeout(() => {
          const firstQuestion = getNextQuestion(currentStep, {});
          addBotMessage(firstQuestion);
        }, 1000);
      }, 500);
    }
  }, []);

  const addBotMessage = (content) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        type: 'bot',
        content,
        timestamp: new Date().toISOString(),
      });
    }, 800 + Math.random() * 400); // Variable delay for natural feel
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = input.trim();
    setInput('');

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

    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Check if interview is complete
    if (isInterviewComplete(nextStep, updatedData)) {
      addBotMessage("Perfect! Let me analyze your information and prepare your personalized ESG assessment...");
      
      // Submit interview
      setTimeout(async () => {
        await submitInterview();
      }, 1000);
    } else {
      // Ask next question
      const nextQuestion = getNextQuestion(nextStep, updatedData);
      addBotMessage(nextQuestion);
    }
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

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2 className={styles.chatTitle}>ESG Pro Interviewer</h2>
        <p className={styles.chatSubtitle}>Let's discover your ESG opportunities</p>
      </div>

      <div className={styles.messagesContainer}>
        <div className={styles.messagesList}>
          {messages.map((message, index) => (
            <Message key={index} message={message} />
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
            placeholder="Type your answer..."
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
