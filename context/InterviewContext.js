
import { createContext, useContext, useState, useCallback } from 'react';
import { submitInterviewData } from '../lib/apiClient';
import { buildInterviewPayload } from '../lib/conversationFlow';

const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [collectedData, setCollectedData] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateData = useCallback((field, value) => {
    setCollectedData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const submitInterview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = buildInterviewPayload(collectedData);
      const result = await submitInterviewData(payload);

      if (result.success) {
        setApiResponse(result.data);
        addMessage({
          type: 'system',
          content: '✅ Assessment complete! Review your results below.',
          timestamp: new Date().toISOString(),
        });
      } else {
        setError(result.error);
        addMessage({
          type: 'system',
          content: `❌ ${result.error}`,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      addMessage({
        type: 'system',
        content: `❌ ${errorMessage}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [collectedData, addMessage]);

  const resetInterview = useCallback(() => {
    setMessages([]);
    setCollectedData({});
    setApiResponse(null);
    setError(null);
    setIsLoading(false);
    
    // Restart conversation
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, []);

  const value = {
    messages,
    addMessage,
    collectedData,
    updateData,
    apiResponse,
    isLoading,
    error,
    submitInterview,
    resetInterview,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider');
  }
  return context;
}
