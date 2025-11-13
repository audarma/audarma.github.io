'use client';

import { useEffect, useState } from 'react';
import { useViewTranslation } from 'audarma';

interface Stats {
  translations: number;
  tokens: number;
  cost: number;
}

export function GlobalStats() {
  const [stats, setStats] = useState<Stats>({ translations: 0, tokens: 0, cost: 0 });
  const [loading, setLoading] = useState(true);

  const { text: heading } = useViewTranslation('ui', 'stats_heading', 'Global Usage (All Users)');
  const { text: translationsLabel } = useViewTranslation('ui', 'stats_translations', 'Translations:');
  const { text: tokensLabel } = useViewTranslation('ui', 'stats_tokens', 'Tokens:');
  const { text: costLabel } = useViewTranslation('ui', 'stats_cost', 'Total Cost:');
  const { text: poweredBy } = useViewTranslation('ui', 'stats_powered', 'Powered by Cerebras Qwen3 (free tier)');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json() as Stats;
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="border rounded-lg p-6 bg-card animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
        {heading}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{translationsLabel}</span>
          <span className="text-lg font-bold">{stats.translations.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{tokensLabel}</span>
          <span className="text-lg font-bold">{stats.tokens.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{costLabel}</span>
          <span className="text-lg font-bold text-green-600">
            ${stats.cost.toFixed(4)}
          </span>
        </div>
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            {poweredBy}
          </p>
        </div>
      </div>
    </div>
  );
}
