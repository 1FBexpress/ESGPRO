
import Head from 'next/head';
import Layout from '../components/Layout';
import ChatInterface from '../components/ChatInterface';
import { InterviewProvider } from '../context/InterviewContext';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Full Bin ESG Pro Interviewer</title>
        <meta name="description" content="Discover your ESG opportunities with Full Bin's AI-powered interviewer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <InterviewProvider>
        <Layout>
          <div className={styles.introSection}>
            <h1 className={styles.mainTitle}>Welcome to ESG Pro Interviewer</h1>
            <p className={styles.subtitle}>
              Let's have a quick conversation to understand your ESG needs and recommend the best path forward.
            </p>
          </div>
          
          <ChatInterface />
        </Layout>
      </InterviewProvider>
    </>
  );
}
