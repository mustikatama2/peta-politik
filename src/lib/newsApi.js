// src/lib/newsApi.js
// Client-side wrapper for the /api/news Vercel serverless function

const API_BASE = '/api/news';

/**
 * Fetch live news from the Vercel serverless RSS aggregator.
 * Returns null on failure so the caller can fall back to static data.
 *
 * @param {{ person_id?: string, category?: string, source?: string, limit?: number }} opts
 * @returns {Promise<{ articles: Array, total: number, sources: Array, fetchedAt: string, isLive: true } | null>}
 */
export async function fetchLiveNews({ person_id, category, source, limit = 60 } = {}) {
  const params = new URLSearchParams();
  if (person_id) params.set('person_id', person_id);
  if (category && category !== 'semua') params.set('category', category);
  if (source && source !== 'semua') params.set('source', source);
  if (limit) params.set('limit', limit);

  const url = `${API_BASE}?${params.toString()}`;

  try {
    const resp = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return { ...data, isLive: true };
  } catch (err) {
    console.warn('[PetaPolitik] Live news API failed, using static fallback:', err.message);
    return null; // caller will use static fallback
  }
}

export const NEWS_SOURCES = [
  { id: 'semua',     name: 'Semua Sumber' },
  { id: 'kompas',    name: 'Kompas',        bias: 'tengah',      color: '#C8102E' },
  { id: 'tempo',     name: 'Tempo',         bias: 'kritis',      color: '#1B4332' },
  { id: 'antara',    name: 'ANTARA',        bias: 'pemerintah',  color: '#1D4ED8' },
  { id: 'detik',     name: 'Detik',         bias: 'tengah',      color: '#FF4444' },
  { id: 'cnn',       name: 'CNN Indonesia', bias: 'tengah',      color: '#CC0000' },
  { id: 'republika', name: 'Republika',     bias: 'konservatif', color: '#059669' },
  { id: 'tribun',    name: 'Tribun',        bias: 'tengah',      color: '#F59E0B' },
];

/** Vercel edge cache TTL — refresh interval for client-side polling */
export const REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
