import Head from 'next/head';
import Layout from '../components/Layout';
import ChatInterface from '../components/ChatInterface';
import { InterviewProvider } from '../context/InterviewContext';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>ESG Pro Interviewer</title>
        <meta
          name="description"
          content="Complete a short ESG assessment and get recommended next steps."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <InterviewProvider>
        <Layout>
          <section className={styles.standaloneShell} id="chat-interface">
            <div className={styles.standaloneHeader}>
              <h1 className={styles.standaloneTitle}>ESG Assessment</h1>
              <p className={styles.standaloneSubtitle}>
                Takes about 2–3 minutes. Answer a few questions and we’ll recommend your best next step.
              </p>
            </div>

            <div className={styles.standaloneChat}>
              <ChatInterface embedded />
            </div>
          </section>
        </Layout>
      </InterviewProvider>
    </>
  );
}
