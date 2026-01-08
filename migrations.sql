-- supabase migration: create tables for leads, contacts, commissions, bookings
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  company text,
  role text,
  data jsonb,
  llm_brief jsonb,
  score int,
  urgency text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  gross_amount numeric,
  commission_total numeric,
  fullbin_amount numeric,
  spottedcow_amount numeric,
  created_at timestamptz DEFAULT now()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  role text,
  email text,
  phone text
);

-- Bookings table for consultation appointments
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  notes text,
  lead_score int,
  urgency text,
  status text DEFAULT 'pending',
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pageviews table for analytics tracking
CREATE TABLE IF NOT EXISTS pageviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  referrer text,
  user_agent text,
  session_id text,
  ip_address text,
  country text,
  city text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_urgency ON leads(urgency);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_pageviews_timestamp ON pageviews(timestamp);
CREATE INDEX IF NOT EXISTS idx_pageviews_page ON pageviews(page);
CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON pageviews(session_id);

-- Add updated_at trigger for bookings table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at 
BEFORE UPDATE ON bookings 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
