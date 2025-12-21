import Head from 'next/head';
import FloatingChatbot from '../components/FloatingChatbot';
import { InterviewProvider } from '../context/InterviewContext';

export default function Home() {
  return (
    <>
      <Head>
        <title>ESG Pro - B Corp & EcoVadis Certification</title>
        <meta name="description" content="Get B Corp and EcoVadis certified with our expert guidance." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <InterviewProvider>
        {/* Floating chatbot widget */}
        <FloatingChatbot />
      </InterviewProvider>
    </>
  );
}
