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

  const showQuickReplies =
    type === 'bot' && quickReplies && isLatest && onQuickReply;

  return (
    <div className={`${styles.messageWrapper} ${getMessageClass()}`}>
      <div style={{ width: '100%' }}>
        <div className={styles.messageBubble}>
          <div className={styles.messageContent}>{content}</div>

          {explanation && type === 'bot' && (
            <div className={styles.explanationText}>{explanation}</div>
          )}

          {timestamp && (
            <div className={styles.messageTime}>
              {new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>

        {/* Quick replies UNDER the bubble (prevents skinny text) */}
        {showQuickReplies && (
          <div style={{ marginTop: '10px' }}>
            <QuickReplyButtons
              options={quickReplies}
              onSelect={onQuickReply}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}
