
import styles from '../styles/Message.module.css';

export default function Message({ message }) {
  const { type, content, timestamp } = message;

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
        {timestamp && (
          <div className={styles.messageTime}>
            {new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </div>
  );
}
