import '../styles/globals.css';
import { useAnalytics } from '../lib/useAnalytics';

export default function App({ Component, pageProps }) {
  // Track pageviews automatically
  useAnalytics();
  
  return <Component {...pageProps} />;
}
