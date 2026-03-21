// api/news-person.js
// Thin re-export — the main /api/news handler already supports ?person_id=X
// Usage: /api/news-person?person_id=prabowo&limit=20
// This file exists for discoverability; route directly to news.js
export { default } from './news.js';
