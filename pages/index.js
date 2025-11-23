
// Version: 1.2.0-force-rebuild - FINAL FIX
// Last deployment: 2025-11-23 23:00 UTC
// FORCING VERCEL REBUILD - User confirmed site still shows £6,210
// This version MUST deploy £2,400 pricing with Introductory Bundle features
// Git commit forced at user request to fix stale deployment
import Head from 'next/head';
import Layout from '../components/Layout';
import ChatInterface from '../components/ChatInterface';
import CertificationCards from '../components/CertificationCards';
import { InterviewProvider } from '../context/InterviewContext';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Full Bin ESG Pro - B Corp & EcoVadis Certification</title>
        <meta name="description" content="Get B Corp and EcoVadis certified with our expert guidance. Start with our £2,400 introductory bundle." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <InterviewProvider>
        <Layout>
          {/* Certification Cards Section */}
          <CertificationCards />
          
          {/* AI Interviewer Section */}
          <div className={styles.interviewerSection} id="chat-interface">
            <div className={styles.introSection}>
              <h2 className={styles.sectionTitle}>Get Your ESG Compliance Roadmap</h2>
              <p className={styles.subtitle}>
                Let's have a quick conversation to understand your ESG needs and recommend the best path forward.
              </p>
            </div>
            
            <ChatInterface />
          </div>
        </Layout>
      </InterviewProvider>
    </>
  );
}
