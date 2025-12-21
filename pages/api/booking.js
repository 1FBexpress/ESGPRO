/**
 * Booking API Endpoint
 * Handles consultation booking submissions
 */

import { createClient } from '@supabase/supabase-js';
import { sendBookingConfirmationEmail } from '../../lib/emailService';

// Initialize Supabase client
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
}

/**
 * Validate booking data
 */
function validateBookingData(data) {
  const errors = [];

  // Required fields
  if (!data.contact_name || data.contact_name.trim().length === 0) {
    errors.push('Contact name is required');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email address is required');
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.push('Phone number is required');
  }

  if (!data.preferred_date) {
    errors.push('Preferred date is required');
  }

  if (!data.preferred_time) {
    errors.push('Preferred time is required');
  }

  // Validate date is not in the past
  if (data.preferred_date) {
    const selectedDate = new Date(data.preferred_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('Preferred date cannot be in the past');
    }
  }

  return errors;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const bookingData = req.body;

    // Validate booking data
    const validationErrors = validateBookingData(bookingData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors 
      });
    }

    // Prepare booking record
    const booking = {
      contact_name: bookingData.contact_name.trim(),
      email: bookingData.email.trim().toLowerCase(),
      phone: bookingData.phone.trim(),
      preferred_date: bookingData.preferred_date,
      preferred_time: bookingData.preferred_time,
      notes: bookingData.notes?.trim() || null,
      company_name: bookingData.company_name || null,
      lead_score: bookingData.lead_score || null,
      urgency: bookingData.urgency || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Save to Supabase if configured
    let bookingId = null;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert([booking])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          // Continue even if database insert fails - we still want to send confirmation
        } else {
          bookingId = data?.id;
          console.log('Booking saved to database:', bookingId);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue execution - email is more critical than DB
      }
    } else {
      console.warn('Supabase not configured - booking not saved to database');
    }

    // Send confirmation email to the user
    try {
      const emailResult = await sendBookingConfirmationEmail(booking);
      
      if (emailResult.success) {
        console.log('✅ Booking confirmation sent to:', booking.email);
      } else if (!emailResult.skipped) {
        console.warn('⚠️  Could not send booking confirmation:', emailResult.error);
      }
    } catch (emailError) {
      // Log but don't fail - booking is saved
      console.error('Email error:', emailError);
    }

    // Also notify the sales team via their regular notification system
    // They should see this in their CRM/email as a high-priority booking
    try {
      // Import email service for sales notification
      const { NOTIFICATION_RECIPIENTS } = require('../../lib/emailService');
      
      if (process.env.RESEND_API_KEY) {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: NOTIFICATION_RECIPIENTS,
          subject: `🎯 New Consultation Booking: ${booking.contact_name}${booking.company_name ? ` (${booking.company_name})` : ''}`,
          text: `
NEW CONSULTATION BOOKING
========================

Contact: ${booking.contact_name}
Email: ${booking.email}
Phone: ${booking.phone}
Company: ${booking.company_name || 'N/A'}

Preferred Date: ${booking.preferred_date}
Preferred Time: ${booking.preferred_time}

${booking.notes ? `Notes:\n${booking.notes}\n\n` : ''}
${booking.lead_score ? `Lead Score: ${booking.lead_score}/100\n` : ''}
${booking.urgency ? `Urgency: ${booking.urgency.toUpperCase()}\n` : ''}

ACTION REQUIRED: Please contact the lead to confirm the consultation appointment.

Booking ID: ${bookingId || 'N/A'}
          `.trim(),
          html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .booking-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-label { font-weight: 600; color: #4b5563; }
    .action-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎯 New Consultation Booking</h1>
    </div>
    <div class="content">
      <div class="action-box">
        <strong>⚡ ACTION REQUIRED:</strong> Contact this lead to confirm the consultation appointment
      </div>
      
      <div class="booking-card">
        <h3 style="margin-top: 0; color: #10b981;">Booking Details</h3>
        <div class="detail-row">
          <span class="detail-label">Contact Name:</span> ${booking.contact_name}
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span> <a href="mailto:${booking.email}">${booking.email}</a>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span> <a href="tel:${booking.phone}">${booking.phone}</a>
        </div>
        ${booking.company_name ? `
        <div class="detail-row">
          <span class="detail-label">Company:</span> ${booking.company_name}
        </div>
        ` : ''}
        <div class="detail-row">
          <span class="detail-label">Preferred Date:</span> ${booking.preferred_date}
        </div>
        <div class="detail-row">
          <span class="detail-label">Preferred Time:</span> ${booking.preferred_time}
        </div>
        ${booking.lead_score ? `
        <div class="detail-row">
          <span class="detail-label">Lead Score:</span> ${booking.lead_score}/100
        </div>
        ` : ''}
        ${booking.urgency ? `
        <div class="detail-row">
          <span class="detail-label">Urgency:</span> ${booking.urgency.toUpperCase()}
        </div>
        ` : ''}
        ${booking.notes ? `
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Additional Notes:</span><br>
          <p style="margin: 10px 0 0 0; padding: 10px; background: #f3f4f6; border-radius: 6px;">${booking.notes}</p>
        </div>
        ` : ''}
      </div>
      
      <p style="text-align: center; margin-top: 20px;">
        <a href="mailto:${booking.email}?subject=ESG Pro Consultation Confirmation" 
           style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          📧 Contact Lead Now
        </a>
      </p>
      
      <p style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px;">
        Powered by Full Bin - ESG Pro Interviewer System
      </p>
    </div>
  </div>
</body>
</html>
          `
        });
        
        console.log('✅ Sales team notified about booking');
      }
    } catch (notifyError) {
      console.error('Failed to notify sales team:', notifyError);
      // Don't fail the request
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Booking submitted successfully',
      booking_id: bookingId,
      confirmation_sent: true
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
