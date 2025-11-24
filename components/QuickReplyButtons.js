
import styles from '../styles/QuickReplyButtons.module.css';

export default function QuickReplyButtons({ options, onSelect, disabled }) {
  if (!options || options.length === 0) return null;

  return (
    <div className={styles.quickReplyContainer}>
      <div className={styles.quickReplyButtons}>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option.value)}
            className={styles.quickReplyButton}
            disabled={disabled}
            aria-label={option.label}
          >
            {option.icon && <span className={styles.buttonIcon}>{option.icon}</span>}
            <span className={styles.buttonLabel}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
