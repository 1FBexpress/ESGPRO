
import { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import BookingForm from './BookingForm';
import styles from '../styles/ResultsPanel.module.css';

export default function ResultsPanel() {
  const { apiResponse, resetInterview, collectedData } = useInterview();
  const [showBookingForm, setShowBookingForm] = useState(false);

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

  const getUrgencyLabel = () => {
    switch (urgency) {
      case 'high':
        return '🚨 URGENT TIMELINE';
      case 'medium':
        return '⏰ MODERATE TIMELINE';
      case 'low':
        return '📅 FLEXIBLE TIMELINE';
      default:
        return 'STANDARD TIMELINE';
    }
  };

  const getActionText = () => {
    switch (action) {
      case 'BOOK_FREE_CONSULT':
        return '🎯 Book Your Free Consultation';
      case 'BUY_50_ASSESSMENT':
        return '💡 Get Your £50 Assessment';
      case 'NURTURE':
        return '📬 Stay Connected';
      default:
        return 'Next Steps';
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'BOOK_FREE_CONSULT':
        return 'Based on your ESG needs and timeline, we recommend starting with a complimentary consultation. Our experts will assess your requirements and create a tailored action plan.';
      case 'BUY_50_ASSESSMENT':
        return 'Start your ESG journey with our comprehensive £50 assessment. Get a detailed analysis of your current position and a roadmap for compliance.';
      case 'NURTURE':
        return 'We\'ll keep you informed with valuable ESG insights, industry updates, and resources relevant to your business sector.';
      default:
        return 'Our team will be in touch soon with personalized next steps.';
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case 'BOOK_FREE_CONSULT':
        return '📅';
      case 'BUY_50_ASSESSMENT':
        return '💷';
      case 'NURTURE':
        return '✉️';
      default:
        return '→';
    }
  };

  const getCalendlyLink = () => {
    // Intelligent routing based on certification interest
    const interestedBCorp = collectedData?.interested_bcorp?.toLowerCase() === 'yes';
    const interestedEcoVadis = collectedData?.interested_ecovadis?.toLowerCase() === 'yes';
    
    // If only interested in EcoVadis, route to Natashia
    if (interestedEcoVadis && !interestedBCorp) {
      return process.env.NEXT_PUBLIC_CALENDLY_LINK_NATASHIA || 'https://calendly.com/nl-esgpro';
    }
    
    // Otherwise (B Corp, both, or neither), route to Humperdinck
    return process.env.NEXT_PUBLIC_CALENDLY_LINK_HUMPERDINCK || 'https://calendly.com/hjdiary';
  };

  const handlePrimaryAction = () => {
    if (action === 'BOOK_FREE_CONSULT') {
      // Open Calendly in a new window
      const calendlyLink = getCalendlyLink();
      window.open(calendlyLink, '_blank', 'width=800,height=900');
    } else if (action === 'BUY_50_ASSESSMENT') {
      // TODO: Integrate with Stripe checkout
      alert('£50 Assessment checkout coming soon! Our team will contact you.');
    } else {
      // NURTURE action
      alert('Thank you for your interest! We\'ll send you updates via email.');
    }
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    // Optionally show a success message or confetti animation
  };

  // Show booking form if user clicked to book
  if (showBookingForm) {
    return (
      <div className={styles.resultsContainer}>
        <BookingForm 
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      </div>
    );
  }

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
            {getUrgencyLabel()}
          </div>
        </div>
      </div>

      <div className={styles.briefSection}>
        <h3 className={styles.sectionTitle}>📋 Summary</h3>
        <p className={styles.briefText}>{lead_brief}</p>
      </div>

      {focus_points && focus_points.length > 0 && (
        <div className={styles.focusSection}>
          <h3 className={styles.sectionTitle}>🎯 Key Focus Areas</h3>
          <ul className={styles.focusList}>
            {focus_points.map((point, index) => (
              <li key={index} className={styles.focusItem}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {opening_questions && opening_questions.length > 0 && (
        <div className={styles.questionsSection}>
          <h3 className={styles.sectionTitle}>💬 Discussion Points</h3>
          <ul className={styles.questionsList}>
            {opening_questions.map((question, index) => (
              <li key={index} className={styles.questionItem}>{question}</li>
            ))}
          </ul>
        </div>
      )}

      {pricing_recommendation && (
        <div className={styles.pricingSection}>
          <h3 className={styles.sectionTitle}>💰 Recommended Solutions</h3>
          <div className={styles.pricingCard}>
            <p className={styles.pricingTier}>{pricing_recommendation.tier}</p>
            {pricing_recommendation.sku_recs && (
              <p className={styles.pricingSku}>Recommended: {pricing_recommendation.sku_recs.join(', ')}</p>
            )}
            {pricing_recommendation.suggested_products && (
              <ul className={styles.productList}>
                {pricing_recommendation.suggested_products.slice(0, 3).map((product, idx) => (
                  <li key={idx} className={styles.productItem}>✓ {product}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Prominent Action Section */}
      <div className={styles.actionSection}>
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>{getActionIcon()}</div>
          <h3 className={styles.actionTitle}>{getActionText()}</h3>
          <p className={styles.actionDescription}>{getActionDescription()}</p>
          
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.ctaButton} ${action === 'BOOK_FREE_CONSULT' ? styles.ctaPrimary : action === 'BUY_50_ASSESSMENT' ? styles.ctaGreen : styles.ctaSecondary}`}
              onClick={handlePrimaryAction}
            >
              {action === 'BOOK_FREE_CONSULT' && '📅 Schedule Free Consultation'}
              {action === 'BUY_50_ASSESSMENT' && '💷 Get £50 Assessment Now'}
              {action === 'NURTURE' && '📬 Subscribe to Updates'}
            </button>
            
            <button 
              className={`${styles.ctaButton} ${styles.ctaOutline}`} 
              onClick={resetInterview}
            >
              🔄 Start New Assessment
            </button>
          </div>

          {urgency === 'high' && (
            <div className={styles.urgencyNote}>
              <strong>⚡ Time-Sensitive:</strong> Given your urgent timeline, we recommend immediate action. Our team can fast-track your ESG requirements.
            </div>
          )}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className={styles.trustSection}>
        <p className={styles.trustText}>
          ✓ Trusted by leading UK businesses &nbsp; | &nbsp; ✓ Industry-certified consultants &nbsp; | &nbsp; ✓ Proven compliance track record
        </p>
        <p className={styles.poweredBy}>
          Powered by <strong>Full Bin</strong> - Your ESG Partner
        </p>
      </div>
    </div>
  );
}
