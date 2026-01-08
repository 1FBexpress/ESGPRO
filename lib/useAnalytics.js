/**
 * useAnalytics Hook - Privacy-Friendly Analytics Tracking
 * Tracks pageviews without personal data
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// Generate a session ID (stored in sessionStorage for privacy)
function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null;
  
  const STORAGE_KEY = 'esg_session_id';
  let sessionId = sessionStorage.getItem(STORAGE_KEY);
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }
  
  return sessionId;
}

// Track a pageview
async function trackPageview(page, referrer) {
  try {
    const sessionId = getOrCreateSessionId();
    const userAgent = navigator.userAgent;

    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page,
        referrer,
        userAgent,
        sessionId,
      }),
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.error('Analytics tracking failed:', error);
  }
}

// Custom hook for automatic pageview tracking
export function useAnalytics() {
  const router = useRouter();
  const lastTrackedPath = useRef(null);
  const initialReferrer = useRef(null);

  useEffect(() => {
    // Store initial referrer on mount
    if (typeof document !== 'undefined' && initialReferrer.current === null) {
      initialReferrer.current = document.referrer || 'direct';
    }

    // Track initial pageview
    if (lastTrackedPath.current === null) {
      const currentPath = router.asPath;
      lastTrackedPath.current = currentPath;
      trackPageview(currentPath, initialReferrer.current);
    }

    // Track route changes
    const handleRouteChange = (url) => {
      if (lastTrackedPath.current !== url) {
        lastTrackedPath.current = url;
        trackPageview(url, initialReferrer.current);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
}

// Manual tracking function for custom events
export function trackEvent(eventName, eventData = {}) {
  // Could be extended for custom event tracking in the future
  console.log('Event tracked:', eventName, eventData);
}

export default useAnalytics;
