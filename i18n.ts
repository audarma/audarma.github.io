/**
 * next-intl configuration
 */

import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'fr', 'de', 'kk', 'ja', 'la', 'qya', 'mis-x-dot', 'tlh'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale || defaultLocale;

  return {
    locale,
    messages: {} // We're not using static messages, only dynamic translation
  };
});
