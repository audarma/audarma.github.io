/**
 * API-based LLM provider for client-side use
 * Routes translation requests to our API endpoint
 */

import { LLMProvider, TranslationItem } from 'audarma';

interface TranslationAPIResponse {
  success: boolean;
  translations: string[];
  meta?: {
    tokens: number;
    cost: number;
    model: string;
    itemCount: number;
  };
}

export function createApiLLMProvider(): LLMProvider {
  return {
    async translateBatch(
      items: TranslationItem[],
      sourceLocale: string,
      targetLocale: string
    ): Promise<string[]> {
      console.log(`[API Provider] Translating ${items.length} items from ${sourceLocale} to ${targetLocale}`);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          sourceLocale,
          targetLocale,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`[API Provider] Error: ${response.status}`, error);
        throw new Error(`Translation API error: ${response.status} ${error}`);
      }

      const data = await response.json() as TranslationAPIResponse;
      console.log(`[API Provider] Received ${data.translations?.length || 0} translations`);
      console.log('[API Provider] Sample translation:', data.translations?.[0]);

      return data.translations;
    },
  };
}
