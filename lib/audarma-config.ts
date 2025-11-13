/**
 * Audarma configuration for demo
 */

'use client';

import { AudarConfig } from 'audarma';
import { useLocale } from 'next-intl';
import { createLocalStorageAdapter } from './localstorage-adapter';
import { createApiLLMProvider } from './api-llm-provider';

export function useAudarmaConfig(): AudarConfig {
  const locale = useLocale();

  return {
    database: createLocalStorageAdapter(),
    llm: createApiLLMProvider(),
    i18n: {
      getCurrentLocale: () => locale,
      getDefaultLocale: () => 'en',
      getSupportedLocales: () => ['en', 'es', 'fr', 'de', 'kk', 'ja', 'la', 'qya', 'mis-x-dot', 'tlh']
    },
    defaultLocale: 'en',
    debug: true
  };
}
