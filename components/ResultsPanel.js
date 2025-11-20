
import { useInterview } from '../context/InterviewContext';
import styles from '../styles/ResultsPanel.module.css';

export default function ResultsPanel() {
  const { apiResponse, resetInterview } = useInterview();

  if (!apiResponse) return null;

  const { action, urgency, score, lead_brief, focus_points, opening_questions, pricing_recommendation } = apiResponse;

  const getUrgencyClass = () => {
    switch (urgency) {
      case 'high':
        return styles.urgencyHigh;
      case 'medium':
        return styles.urgencyMedium;
      case 'low':
        return styles.urgencyLow;
      default:
        return styles.urgencyMedium;
    }
  };

  const getActionText = () => {
    switch (action) {
      case 'BOOK_FREE_CONSULT':
        return 'Book Your Free Consultation';
      case 'BUY_50_ASSESSMENT':
        return 'Purchase £50 Assessment';
      case 'NURTURE':
        return 'Stay Connected';
      default:
        return 'Next Steps';
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'BOOK_FREE_CONSULT':
        return 'Based on your needs, we recommend starting with a complimentary consultation to explore how we can help.';
      case 'BUY_50_ASSESSMENT':
        return 'Get started with our comprehensive £50 assessment to identify your ESG opportunities.';
      case 'NURTURE':
        return 'We\'ll keep you informed with valuable ESG insights and updates relevant to your business.';
      default:
        return 'We\'ll be in touch soon with next steps.';
    }
  };

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>Your ESG Assessment Results</h2>
        <div className={styles.scoreSection}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreValue}>{score}</span>
            <span className={styles.scoreLabel}>Lead Score</span>
          </div>
          <div className={`${styles.urgencyBadge} ${getUrgencyClass()}`}>
            {urgency.toUpperCase()} PRIORITY
          </div>
        </div>
      </div>

      <div className={styles.briefSection}>
        <h3 className={styles.sectionTitle}>Summary</h3>
        <p className={styles.briefText}>{lead_brief}</p>
      </div>

      {focus_points && focus_points.length > 0 && (
        <div className={styles.focusSection}>
          <h3 className={styles.sectionTitle}>Key Focus Areas</h3>
          <ul className={styles.focusList}>
            {focus_points.map((point, index) => (
              <li key={index} className={styles.focusItem}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {opening_questions && opening_questions.length > 0 && (
        <div className={styles.questionsSection}>
          <h3 className={styles.sectionTitle}>Discussion Points</h3>
          <ul className={styles.questionsList}>
            {opening_questions.map((question, index) => (
              <li key={index} className={styles.questionItem}>{question}</li>
            ))}
          </ul>
        </div>
      )}

      {pricing_recommendation && (
        <div className={styles.pricingSection}>
          <h3 className={styles.sectionTitle}>Recommended Solutions</h3>
          <div className={styles.pricingCard}>
            <p className={styles.pricingTier}>{pricing_recommendation.tier}</p>
            {pricing_recommendation.sku_recs && (
              <p className={styles.pricingSku}>Products: {pricing_recommendation.sku_recs.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      <div className={styles.actionSection}>
        <h3 className={styles.actionTitle}>{getActionText()}</h3>
        <p className={styles.actionDescription}>{getActionDescription()}</p>
        <div className={styles.actionButtons}>
          {action === 'BOOK_FREE_CONSULT' && (
            <button className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
              Schedule Consultation
            </button>
          )}
          {action === 'BUY_50_ASSESSMENT' && (
            <button className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
              Purchase Assessment
            </button>
          )}
          {action === 'NURTURE' && (
            <button className={`${styles.ctaButton} ${styles.ctaSecondary}`}>
              Subscribe to Updates
            </button>
          )}
          <button className={`${styles.ctaButton} ${styles.ctaOutline}`} onClick={resetInterview}>
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
