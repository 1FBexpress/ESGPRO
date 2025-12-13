// Version: 1.2.1-landing-chat-integrated
import Head from 'next/head';
import Layout from '../components/Layout';
import ChatInterface from '../components/ChatInterface';
import { InterviewProvider } from '../context/InterviewContext';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Full Bin ESG Pro - B Corp & EcoVadis Certification</title>
        <meta
          name="description"
          content="Start your ESG journey with a quick readiness assessment and expert guidance toward B Corp and EcoVadis."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <InterviewProvider>
        <Layout>
          <section className={styles.landingShell} id="chat-interface">
            {/* LEFT: Landing content */}
            <div className={styles.landingLeft}>
              <div className={styles.badgeRow}>
                <span className={styles.promoBadge}>SAVE 75% • WAS £200 NOW £50</span>
              </div>

              <h1 className={styles.heroTitle}>
                Start Your ESG Journey <span className={styles.heroAccent}>For Just £50</span>
              </h1>

              <p className={styles.heroSubtitle}>
                ESG &amp; Sustainability Readiness Assessment — your first step to certification
              </p>

              <div className={styles.offerCard}>
                <div className={styles.offerHeader}>
                  <div>
                    <div className={styles.offerTitle}>ESG Readiness Assessment</div>
                    <div className={styles.offerSub}>
                      Benchmark your ESG performance against GRI standards
                    </div>
                  </div>
                  <div className={styles.priceBlock}>
                    <div className={styles.oldPrice}>£200</div>
                    <div className={styles.newPrice}>£50</div>
                  </div>
                </div>

                <ul className={styles.offerList}>
                  <li>Complete ESG performance analysis</li>
                  <li>Benchmark against GRI standards</li>
                  <li>Identify strengths, risks, and improvement areas</li>
                  <li>Practical recommendations for ESG strategy</li>
                  <li>1:1 consultation with UK-leading ESG consultant</li>
                  <li>Recommended first step for B Corp and EcoVadis certification</li>
                </ul>

                <div className={styles.offerNote}>
                  Special offer for members: 50–75% of clients progress to full carbon reporting or
                  certification. Start here to evaluate your readiness!
                </div>

                <a href="#chat-interface" className={styles.primaryCta}>
                  Start the £50 Assessment Now
                </a>
              </div>
            </div>

            {/* RIGHT: Integrated chat */}
            <aside className={styles.landingRight}>
              <div className={styles.chatDock}>
                <ChatInterface />
              </div>
            </aside>
          </section>
        </Layout>
      </InterviewProvider>
    </>
  );
}
