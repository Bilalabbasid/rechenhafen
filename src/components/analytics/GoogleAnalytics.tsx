'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  getConsentStatus,
  subscribeToConsentChanges,
  ConsentStatus,
} from '@/lib/analytics/consent';
import { getMeasurementId, trackPageView } from '@/lib/analytics/ga4';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentStatus>('pending');
  const lastTrackedPathRef = useRef<string | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Sync initial consent status and listen for updates
  useEffect(() => {
    setConsent(getConsentStatus());

    const unsubscribe = subscribeToConsentChanges((newStatus) => {
      setConsent(newStatus);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Initialize GA4 script and privacy-first defaults once consent is granted
  useEffect(() => {
    const measurementId = getMeasurementId();
    if (!measurementId || consent !== 'granted') {
      return;
    }

    if (!isInitializedRef.current) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };

      // Strict privacy configuration: Disable ads, signals, remarketing
      window.gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });

      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false, // Disables automatic pageview to ensure single manual dispatch
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        restricted_data_processing: true,
      });

      // Inject script only if not already present in the DOM
      const existingScript = document.getElementById('ga4-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'ga4-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
      }

      isInitializedRef.current = true;
    }
  }, [consent]);

  // Track exactly one pageview per route navigation after consent is granted
  useEffect(() => {
    if (consent !== 'granted' || !pathname) {
      return;
    }

    // Ensure we only track once per pathname transition
    if (lastTrackedPathRef.current !== pathname) {
      lastTrackedPathRef.current = pathname;
      trackPageView(pathname, typeof document !== 'undefined' ? document.title : undefined);
    }
  }, [pathname, consent]);

  return null;
}
