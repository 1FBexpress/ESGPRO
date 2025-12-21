import { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import ChatInterface from './ChatInterface';
import styles from '../styles/FloatingChatbot.module.css';
import { MessageSquare, X, Minimize2 } from 'lucide-react';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={styles.floatingButton}
          aria-label="Open ESG Pro Chat"
        >
          <MessageSquare size={28} />
          <span className={styles.badge}>Chat with us</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className={`${styles.chatWindow} ${isMinimized ? styles.minimized : ''}`}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.brandIcon}>
                <MessageSquare size={20} />
              </div>
              <div className={styles.headerText}>
                <h3>ESG Pro Assistant</h3>
                <span className={styles.status}>
                  <span className={styles.statusDot}></span>
                  Online
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={minimizeChat}
                className={styles.iconButton}
                aria-label="Minimize chat"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={toggleChat}
                className={styles.iconButton}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className={styles.chatContent}>
              <ChatInterface isFloatingMode={true} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
