
import styles from '../styles/ProgressIndicator.module.css';

export default function ProgressIndicator({ current, total, estimatedTime }) {
  const progress = (current / total) * 100;
  
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInfo}>
        <div className={styles.progressText}>
          Question {current} of {total}
        </div>
        {estimatedTime && current === 1 && (
          <div className={styles.estimatedTime}>
            ⏱️ Takes about {estimatedTime}
          </div>
        )}
      </div>
      <div className={styles.progressBarContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
