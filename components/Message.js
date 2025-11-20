
import styles from '../styles/Message.module.css';
import QuickReplyButtons from './QuickReplyButtons';

export default function Message({ message, onQuickReply, isLatest, disabled }) {
  const { type, content, explanation, quickReplies, timestamp } = message;

  const getMessageClass = () => {
    switch (type) {
      case 'user':
        return styles.messageUser;
      case 'bot':
        return styles.messageBot;
      case 'system':
        return styles.messageSystem;
      default:
        return styles.messageBot;
    }
  };

  return (
    <div className={`${styles.messageWrapper} ${getMessageClass()}`}>
      <div className={styles.messageBubble}>
        <div className={styles.messageContent}>{content}</div>
        
        {/* Show explanation text if provided */}
        {explanation && type === 'bot' && (
          <div className={styles.explanationText}>
            {explanation}
          </div>
        )}
        
        {timestamp && (
          <div className={styles.messageTime}>
            {new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
      
      {/* Show quick reply buttons for latest bot message */}
      {type === 'bot' && quickReplies && isLatest && onQuickReply && (
        <QuickReplyButtons 
          options={quickReplies}
          onSelect={onQuickReply}
          disabled={disabled}
        />
      )}
    </div>
  );
}
