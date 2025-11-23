
import styles from '../styles/CertificationCards.module.css';

export default function CertificationCards() {
  const handleBookConsultation = (certificationType) => {
    // Scroll to chat interface or trigger contact
    const chatSection = document.querySelector('#chat-interface');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Could also trigger a specific chat message or open booking form
  };

  return (
    <section className={styles.certificationSection} data-version="1.2.0-force-rebuild-FINAL" data-deploy-timestamp="2025-11-23T23:00:00Z" data-deployment-id="user-requested-force-rebuild">
      <div className={styles.container}>
        <h2 className={styles.mainTitle}>B Corp & EcoVadis Certification</h2>
        <p className={styles.subtitle}>Prove your ESG credentials and win more contracts</p>
        
        <div className={styles.cardsContainer}>
          {/* B Corp Certification Card */}
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              <div className={`${styles.icon} ${styles.iconGreen}`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            
            <h3 className={styles.cardTitle}>B Corp Certification</h3>
            <p className={styles.cardDescription}>
              Complete B Corp certification support with 100% first-time success rate
            </p>
            
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.checkmark}>✓</span>
                Introductory gap analysis and readiness assessment
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkmark}>✓</span>
                8 × 2-hour expert-led sessions
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkmark}>✓</span>
                Corrective action plan
              </li>
            </ul>
            
            <div className={styles.pricingContainer}>
              <div className={styles.labelContainer}>
                <span className={styles.introLabel}>Introductory Bundle</span>
              </div>
              <div className={styles.priceContainer}>
                <span className={styles.currency}>£</span>
                <span className={styles.price}>2,400</span>
              </div>
              <p className={styles.priceNote}>Your first step toward certification</p>
            </div>
            
            <button 
              className={`${styles.ctaButton} ${styles.ctaGreen}`}
              onClick={() => handleBookConsultation('B Corp')}
            >
              Book Free Consultation
            </button>
          </div>

          {/* EcoVadis Certification Card */}
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              <div className={`${styles.icon} ${styles.iconBlue}`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            
            <h3 className={styles.cardTitle}>EcoVadis Certification</h3>
            <p className={styles.cardDescription}>
              Achieve Bronze, Silver, or Gold rating with an EcoVadis Approved Training Partner
            </p>
            
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.checkmark}>✓</span>
                Introductory gap analysis and readiness assessment
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkmark}>✓</span>
                8 × 2-hour expert-led sessions
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkmark}>✓</span>
                Corrective action plan
              </li>
            </ul>
            
            <div className={styles.pricingContainer}>
              <div className={styles.labelContainer}>
                <span className={styles.introLabel}>Introductory Bundle</span>
              </div>
              <div className={styles.priceContainer}>
                <span className={styles.currency}>£</span>
                <span className={styles.price}>2,400</span>
              </div>
              <p className={styles.priceNote}>Your first step toward certification</p>
            </div>
            
            <button 
              className={`${styles.ctaButton} ${styles.ctaBlue}`}
              onClick={() => handleBookConsultation('EcoVadis')}
            >
              Book Free Consultation
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={styles.trustSection}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span>No credit card required</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span>UK-focused compliance</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span>Trusted by leading firms</span>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className={styles.whyChooseSection}>
          <h3 className={styles.whyChooseTitle}>Why Choose ESG Pro?</h3>
          <p className={styles.whyChooseText}>
            Our introductory bundle provides a comprehensive gap analysis and expert guidance 
            to prepare you for full B Corp or EcoVadis certification. This lower-barrier entry 
            point ensures you're fully ready before committing to the complete certification process.
          </p>
        </div>
      </div>
    </section>
  );
}
