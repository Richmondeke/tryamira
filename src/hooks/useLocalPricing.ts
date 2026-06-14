import { useState, useEffect } from 'react';

const IP_API_URL = 'https://ipapi.co/json/';
// Using a free, no-key-required exchange rate API:
const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

// Simple in-memory cache to prevent redundant API calls
let cachedCurrency: string | null = null;
let cachedRates: Record<string, number> | null = null;

export function useLocalPricing(basePriceUsd: number) {
  const [price, setPrice] = useState<string>(`$${basePriceUsd}`);
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLocalPricing() {
      try {
        // 1. Get user currency
        let currency = cachedCurrency;
        if (!currency) {
          const ipRes = await fetch(IP_API_URL);
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            currency = ipData.currency || 'USD';
            cachedCurrency = currency;
          } else {
            currency = 'USD';
          }
        }
        
        // 2. Get exchange rate if not USD
        if (currency === 'USD' || !currency) {
          if (isMounted) {
            setPrice(`$${basePriceUsd}`);
            setCurrencyCode('USD');
            setIsLoading(false);
          }
          return;
        }

        let rate = 1;
        if (cachedRates && cachedRates[currency]) {
          rate = cachedRates[currency];
        } else {
          const ratesRes = await fetch(EXCHANGE_RATE_API);
          if (ratesRes.ok) {
            const ratesData = await ratesRes.json();
            cachedRates = ratesData.rates;
            rate = ratesData.rates[currency] || 1;
          }
        }

        const converted = Math.round(basePriceUsd * rate);
        
        if (isMounted) {
          // Fallback symbols if Intl API is limited
          const formatter = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
          });
          
          setPrice(formatter.format(converted));
          setCurrencyCode(currency);
        }
      } catch (err) {
        console.error("Failed to fetch local pricing", err);
        if (isMounted) {
          setPrice(`$${basePriceUsd}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchLocalPricing();

    return () => {
      isMounted = false;
    };
  }, [basePriceUsd]);

  return { price, currencyCode, isLoading };
}
