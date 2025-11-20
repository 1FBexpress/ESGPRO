/**
 * BookingForm Component
 * Allows users to book a free consultation after completing the ESG interview
 */

import { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import styles from '../styles/BookingForm.module.css';

export default function BookingForm({ onClose, onSuccess }) {
  const { apiResponse, answers } = useInterview();
  
  const [formData, setFormData] = useState({
    contact_name: answers?.contact_name || '',
    email: answers?.email || '',
    phone: answers?.phone || '',
    preferred_date: '',
    preferred_time: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.contact_name || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.preferred_date || !formData.preferred_time) {
        throw new Error('Please select your preferred date and time');
      }

      // Send booking request to API
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          lead_score: apiResponse?.score,
          company_name: answers?.company_name,
          urgency: apiResponse?.urgency
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setSuccess(true);
      
      // Call success callback after 2 seconds
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message
  if (success) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3 className={styles.successTitle}>Booking Confirmed!</h3>
          <p className={styles.successText}>
            Thank you for booking a consultation with ESG Pro. We've sent a confirmation email to <strong>{formData.email}</strong>.
          </p>
          <p className={styles.successText}>
            One of our ESG experts will contact you shortly to confirm your appointment.
          </p>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>Book Your Free Consultation</h3>
        <p className={styles.formSubtitle}>
          Let's discuss your ESG needs and how we can help
        </p>
        {onClose && (
          <button className={styles.closeIcon} onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorAlert}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="contact_name" className={styles.label}>
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="contact_name"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="John Smith"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="john.smith@company.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone Number <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="+44 7700 900123"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="preferred_date" className={styles.label}>
              Preferred Date <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              id="preferred_date"
              name="preferred_date"
              value={formData.preferred_date}
              onChange={handleChange}
              className={styles.input}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="preferred_time" className={styles.label}>
              Preferred Time <span className={styles.required}>*</span>
            </label>
            <select
              id="preferred_time"
              name="preferred_time"
              value={formData.preferred_time}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Select time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes" className={styles.label}>
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={styles.textarea}
            rows="4"
            placeholder="Any specific topics you'd like to discuss or questions you have..."
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Submitting...
              </>
            ) : (
              'Book Consultation'
            )}
          </button>
          
          {onClose && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>

        <p className={styles.disclaimer}>
          By booking a consultation, you agree to be contacted by our team regarding your ESG needs.
        </p>
      </form>
    </div>
  );
}
