// =============================================================================
// indicators.js — Macro & Political Indicators for Indonesia 2019-2024
// Sources: BPS, Bank Indonesia, Transparency International, EIU, RSF, UNDP
// =============================================================================

export const MACRO_INDICATORS = {
  gdp_growth: {
    label: 'Pertumbuhan GDP',
    unit: '%',
    current: 5.03,
    prev_year: 5.05,
    trend: 'stable',
    source: 'BPS 2024',
    history: [
      { year: 2019, q1: 5.07, q2: 5.05, q3: 5.02, q4: 4.97, annual: 5.02 },
      { year: 2020, q1: 2.97, q2: -5.32, q3: -3.49, q4: -2.19, annual: -2.07 },
      { year: 2021, q1: -0.74, q2: 7.07, q3: 3.51, q4: 5.02, annual: 3.69 },
      { year: 2022, q1: 5.01, q2: 5.44, q3: 5.72, q4: 5.01, annual: 5.31 },
      { year: 2023, q1: 5.03, q2: 5.17, q3: 4.94, q4: 5.04, annual: 5.05 },
      { year: 2024, q1: 5.11, q2: 5.05, q3: 4.95, q4: 5.02, annual: 5.03 },
    ],
  },

  inflation: {
    label: 'Inflasi',
    unit: '%',
    current: 2.51,
    prev_year: 2.61,
    trend: 'stable',
    source: 'BPS 2024',
    history: [
      { year: 2019, annual: 2.72 },
      { year: 2020, annual: 1.68 },
      { year: 2021, annual: 1.87 },
      { year: 2022, annual: 5.51 },
      { year: 2023, annual: 2.61 },
      { year: 2024, annual: 2.51 },
    ],
    quarterly: [
      { year: 2022, q1: 2.64, q2: 4.35, q3: 5.95, q4: 5.51 },
      { year: 2023, q1: 4.97, q2: 3.52, q3: 2.28, q4: 2.61 },
      { year: 2024, q1: 2.82, q2: 2.51, q3: 2.28, q4: 1.57 },
    ],
  },

  unemployment: {
    label: 'Pengangguran',
    unit: '%',
    current: 4.91,
    prev_year: 5.32,
    trend: 'improving',
    source: 'BPS 2024',
    history: [
      { year: 2019, annual: 5.28 },
      { year: 2020, annual: 7.07 },
      { year: 2021, annual: 6.49 },
      { year: 2022, annual: 5.86 },
      { year: 2023, annual: 5.32 },
      { year: 2024, annual: 4.91 },
    ],
  },

  poverty_rate: {
    label: 'Kemiskinan',
    unit: '%',
    current: 8.57,
    prev_year: 9.36,
    trend: 'improving',
    source: 'BPS 2024',
    history: [
      { year: 2019, annual: 9.22 },
      { year: 2020, annual: 10.19 },
      { year: 2021, annual: 10.14 },
      { year: 2022, annual: 9.57 },
      { year: 2023, annual: 9.36 },
      { year: 2024, annual: 8.57 },
    ],
  },

  gini_coefficient: {
    label: 'Koefisien Gini',
    unit: '',
    current: 0.379,
    prev_year: 0.388,
    trend: 'improving',
    source: 'BPS 2024',
    history: [
      { year: 2019, annual: 0.380 },
      { year: 2020, annual: 0.385 },
      { year: 2021, annual: 0.381 },
      { year: 2022, annual: 0.381 },
      { year: 2023, annual: 0.388 },
      { year: 2024, annual: 0.379 },
    ],
  },

  fdi: {
    label: 'Investasi Langsung Asing (FDI)',
    unit: 'USD Miliar',
    current: 47.3,
    prev_year: 47.8,
    trend: 'stable',
    source: 'BKPM/Kemenves 2024',
    history: [
      { year: 2019, annual: 28.2 },
      { year: 2020, annual: 20.2 },
      { year: 2021, annual: 31.1 },
      { year: 2022, annual: 45.6 },
      { year: 2023, annual: 47.8 },
      { year: 2024, annual: 47.3 },
    ],
  },

  exports: {
    label: 'Ekspor',
    unit: 'USD Miliar',
    current: 264.7,
    prev_year: 258.8,
    trend: 'improving',
    source: 'BPS / Bank Indonesia 2024',
    history: [
      { year: 2019, annual: 167.7 },
      { year: 2020, annual: 163.3 },
      { year: 2021, annual: 231.5 },
      { year: 2022, annual: 292.0 },
      { year: 2023, annual: 258.8 },
      { year: 2024, annual: 264.7 },
    ],
  },

  forex_reserves: {
    label: 'Cadangan Devisa',
    unit: 'USD Miliar',
    current: 150.2,
    prev_year: 146.4,
    trend: 'improving',
    source: 'Bank Indonesia 2024',
    history: [
      { year: 2019, annual: 129.2 },
      { year: 2020, annual: 135.9 },
      { year: 2021, annual: 144.9 },
      { year: 2022, annual: 137.2 },
      { year: 2023, annual: 146.4 },
      { year: 2024, annual: 150.2 },
    ],
  },
}

// =============================================================================
// POLITICAL INDICATORS
// =============================================================================

export const POLITICAL_INDICATORS = {
  democracy_index: {
    label: 'Indeks Demokrasi (EIU)',
    current: 6.53,
    rank: 54,
    category: 'Flawed Democracy',
    max: 10,
    higher_is_better: true,
    source: 'EIU Democracy Index 2024',
    history: [
      { year: 2015, score: 7.03 },
      { year: 2016, score: 6.97 },
      { year: 2017, score: 6.39 },
      { year: 2018, score: 6.39 },
      { year: 2019, score: 6.48 },
      { year: 2020, score: 6.30 },
      { year: 2021, score: 6.71 },
      { year: 2022, score: 6.71 },
      { year: 2023, score: 6.53 },
      { year: 2024, score: 6.53 },
    ],
    asean_comparison: [
      { country: 'Indonesia', score: 6.53 },
      { country: 'Malaysia', score: 7.24 },
      { country: 'Filipina', score: 6.27 },
      { country: 'Thailand', score: 6.67 },
      { country: 'Vietnam', score: 2.94 },
      { country: 'Singapura', score: 6.22 },
    ],
  },

  press_freedom: {
    label: 'Kebebasan Pers (RSF)',
    current: 48.7,
    rank: 107,
    max: 100,
    higher_is_better: true,
    source: 'RSF Press Freedom Index 2024',
    history: [
      { year: 2019, score: 43.8, rank: 124 },
      { year: 2020, score: 40.7, rank: 119 },
      { year: 2021, score: 38.2, rank: 113 },
      { year: 2022, score: 42.9, rank: 117 },
      { year: 2023, score: 52.0, rank: 108 },
      { year: 2024, score: 48.7, rank: 107 },
    ],
    asean_comparison: [
      { country: 'Indonesia', score: 48.7 },
      { country: 'Malaysia', score: 52.7 },
      { country: 'Filipina', score: 55.4 },
      { country: 'Thailand', score: 38.0 },
      { country: 'Vietnam', score: 24.5 },
      { country: 'Singapura', score: 54.9 },
    ],
  },

  corruption_index: {
    label: 'Indeks Persepsi Korupsi (TI)',
    current: 34,
    rank: 115,
    max: 100,
    higher_is_better: true,
    source: 'Transparency International CPI 2024',
    history: [
      { year: 2019, score: 40, rank: 85 },
      { year: 2020, score: 37, rank: 102 },
      { year: 2021, score: 38, rank: 96 },
      { year: 2022, score: 34, rank: 110 },
      { year: 2023, score: 34, rank: 115 },
      { year: 2024, score: 34, rank: 115 },
    ],
    asean_comparison: [
      { country: 'Indonesia', score: 34 },
      { country: 'Malaysia', score: 50 },
      { country: 'Filipina', score: 34 },
      { country: 'Thailand', score: 35 },
      { country: 'Vietnam', score: 40 },
      { country: 'Singapura', score: 84 },
    ],
  },

  human_development: {
    label: 'IPM (UNDP)',
    current: 0.713,
    rank: 112,
    max: 1,
    higher_is_better: true,
    source: 'UNDP HDR 2024',
    history: [
      { year: 2019, score: 0.718 },
      { year: 2020, score: 0.718 },
      { year: 2021, score: 0.705 },
      { year: 2022, score: 0.713 },
      { year: 2023, score: 0.713 },
      { year: 2024, score: 0.713 },
    ],
    asean_comparison: [
      { country: 'Indonesia', score: 0.713 },
      { country: 'Malaysia', score: 0.803 },
      { country: 'Filipina', score: 0.710 },
      { country: 'Thailand', score: 0.803 },
      { country: 'Vietnam', score: 0.726 },
      { country: 'Singapura', score: 0.949 },
    ],
  },

  ease_of_business: {
    label: 'Kemudahan Berusaha (World Bank)',
    current: 73,
    rank: 73,
    max: null,
    higher_is_better: false, // lower rank = better
    source: 'World Bank Doing Business (terakhir 2020)',
    history: [
      { year: 2019, rank: 73 },
      { year: 2020, rank: 73 },
    ],
    asean_comparison: [
      { country: 'Indonesia', rank: 73 },
      { country: 'Malaysia', rank: 12 },
      { country: 'Filipina', rank: 95 },
      { country: 'Thailand', rank: 21 },
      { country: 'Vietnam', rank: 70 },
      { country: 'Singapura', rank: 2 },
    ],
  },
}

// =============================================================================
// POLITICAL RISK
// =============================================================================

export const POLITICAL_RISK = {
  overall_risk: 'medium',
  explanation:
    'Indonesia menghadapi risiko politik menengah. Stabilitas relatif terjaga pasca-Pemilu 2024, namun tantangan korupsi sistemik, penyempitan ruang sipil, dan ketidakpastian arah kebijakan Kabinet Merah Putih menjadi faktor risiko utama.',
  factors: [
    {
      factor: 'Stabilitas Politik',
      score: 65,
      trend: 'stable',
      desc: 'Transisi kekuasaan berjalan damai, namun oposisi melemah pasca-koalisi gemuk Prabowo.',
    },
    {
      factor: 'Korupsi',
      score: 34,
      trend: 'declining',
      desc: 'Skor CPI turun dari 40 (2019) ke 34 (2024), mencerminkan melemahnya KPK dan reformasi birokrasi.',
    },
    {
      factor: 'Kebebasan Sipil',
      score: 52,
      trend: 'declining',
      desc: 'UU ITE, pembatasan demonstrasi, dan tekanan terhadap jurnalis meningkat sejak 2020.',
    },
    {
      factor: 'Rule of Law',
      score: 48,
      trend: 'stable',
      desc: 'Kepercayaan terhadap lembaga peradilan masih rendah; impunitas pejabat persisten.',
    },
    {
      factor: 'Transparansi Fiskal',
      score: 55,
      trend: 'improving',
      desc: 'Open Budget Index membaik, namun program efisiensi APBN 2025 menimbulkan pertanyaan alokasi.',
    },
  ],
}

// =============================================================================
// ASEAN BENCHMARK (aggregated for comparison charts)
// =============================================================================

export const ASEAN_BENCHMARK = {
  cpi: [
    { country: 'Singapura', score: 84, flag: '🇸🇬' },
    { country: 'Malaysia', score: 50, flag: '🇲🇾' },
    { country: 'Vietnam', score: 40, flag: '🇻🇳' },
    { country: 'Thailand', score: 35, flag: '🇹🇭' },
    { country: 'Indonesia', score: 34, flag: '🇮🇩', highlight: true },
    { country: 'Filipina', score: 34, flag: '🇵🇭' },
  ],
  democracy: [
    { country: 'Malaysia', score: 7.24, flag: '🇲🇾' },
    { country: 'Thailand', score: 6.67, flag: '🇹🇭' },
    { country: 'Indonesia', score: 6.53, flag: '🇮🇩', highlight: true },
    { country: 'Singapura', score: 6.22, flag: '🇸🇬' },
    { country: 'Filipina', score: 6.27, flag: '🇵🇭' },
    { country: 'Vietnam', score: 2.94, flag: '🇻🇳' },
  ],
  hdi: [
    { country: 'Singapura', score: 0.949, flag: '🇸🇬' },
    { country: 'Malaysia', score: 0.803, flag: '🇲🇾' },
    { country: 'Thailand', score: 0.803, flag: '🇹🇭' },
    { country: 'Vietnam', score: 0.726, flag: '🇻🇳' },
    { country: 'Indonesia', score: 0.713, flag: '🇮🇩', highlight: true },
    { country: 'Filipina', score: 0.710, flag: '🇵🇭' },
  ],
}
