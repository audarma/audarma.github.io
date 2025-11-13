/**
 * localStorage Database Adapter for Audarma demo
 * Caches translations in browser localStorage
 */

import type { DatabaseAdapter, TranslationItem } from 'audarma';

const STORAGE_KEY = 'audarma_demo_translations';

interface StoredTranslation {
  content_type: string;
  content_id: string;
  locale: string;
  original_text: string;
  translated_text: string;
  source_hash: string;
  timestamp: number;
}

export function createLocalStorageAdapter(): DatabaseAdapter {
  return {
    async getCachedTranslations(items: TranslationItem[], targetLocale: string) {
      if (typeof window === 'undefined') return [];

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const translations: StoredTranslation[] = JSON.parse(stored);

        // Filter and return matching translations
        const cached = translations
          .filter(t =>
            t.locale === targetLocale &&
            items.some(item =>
              item.contentType === t.content_type &&
              item.contentId === t.content_id
            )
          )
          .map(t => ({
            content_type: t.content_type,
            content_id: t.content_id,
            translated_text: t.translated_text,
            source_hash: t.source_hash
          }));

        console.log(`[localStorage] Found ${cached.length}/${items.length} cached translations for ${targetLocale}`);
        return cached;

      } catch (error) {
        console.error('[localStorage] Error reading cache:', error);
        return [];
      }
    },

    async saveTranslations(translations) {
      if (typeof window === 'undefined') return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const existing: StoredTranslation[] = stored ? JSON.parse(stored) : [];

        // Merge new translations
        translations.forEach(newTrans => {
          const index = existing.findIndex(t =>
            t.content_type === newTrans.content_type &&
            t.content_id === newTrans.content_id &&
            t.locale === newTrans.locale
          );

          const storedTrans: StoredTranslation = {
            content_type: newTrans.content_type,
            content_id: newTrans.content_id,
            locale: newTrans.locale,
            original_text: newTrans.original_text,
            translated_text: newTrans.translated_text,
            source_hash: newTrans.source_hash,
            timestamp: Date.now()
          };

          if (index >= 0) {
            existing[index] = storedTrans;
          } else {
            existing.push(storedTrans);
          }
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        console.log(`[localStorage] Saved ${translations.length} translations`);

      } catch (error) {
        console.error('[localStorage] Error saving translations:', error);
      }
    }
  };
}

// Utility: Get cache stats
export function getCacheStats() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { total: 0, languages: [] };

    const translations: StoredTranslation[] = JSON.parse(stored);
    const languages = [...new Set(translations.map(t => t.locale))];

    return {
      total: translations.length,
      languages,
      size: new Blob([stored]).size
    };
  } catch {
    return null;
  }
}

// Utility: Clear cache
export function clearCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  console.log('[localStorage] Cache cleared');
}
