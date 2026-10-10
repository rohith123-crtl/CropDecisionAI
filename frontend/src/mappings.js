/* ─────────────────────────────────────────────────────────────
   mappings.js — Lookup tables that convert simple farmer answers
   into numeric values the ML backend expects.

   ASSUMPTIONS & SOURCES (verify with your agronomy instructor):
   ─────────────────────────────────────────────────────────────
   Soil colour → N, P, K, pH:
     Values are typical medians for Indian soil types from the
     Soil Health Card scheme (ICAR / ICRISAT published ranges).
     Black (vertisol): high in K, moderate N/P, slightly alkaline.
     Red (laterite):   low P, moderate N/K, slightly acidic.
     Sandy (entisol):  low across the board, near-neutral pH.
     Clay (alluvial):  moderate–high N/P/K, near-neutral.

   Growth modifier:
     Poor   → reduce N, P, K by ~25 % (leached / depleted).
     Average → keep as-is.
     Good   → increase N, P, K by ~15 % (fertile).

   Water source → litres/day per acre:
     Rain only   →  400 L  (dryland, kharif-only).
     Canal       → 1200 L  (flood/furrow, seasonal availability).
     Borewell    → 1800 L  (pump-irrigated, year-round).
     Drip        → 2200 L  (high-efficiency micro-irrigation).
     These are multiplied by farm_area when sent to the API.

   Objective mapping:
     "profit"   → "income"
     "safe"     → "low_risk"
     "water"    → "water_saving"
     "balanced" → "balanced"

   Season auto-detection:
     Kharif : June 1 – October 15   (month 6–10)
     Rabi   : October 16 – February 28  (month 10–2)
     Zaid   : March 1 – May 31  (month 3–5)
     Zaid is not in the model, so we map it to kharif (closer
     temperature profile).
   ───────────────────────────────────────────────────────────── */

// ── Soil colour → base N, P, K, pH ──────────────────────────

export const SOIL_COLOR_MAP = {
  black: { nitrogen: 80, phosphorus: 38, potassium: 48, ph: 7.2, soil_type: 'black' },
  red:   { nitrogen: 65, phosphorus: 28, potassium: 38, ph: 5.8, soil_type: 'red' },
  sandy: { nitrogen: 40, phosphorus: 22, potassium: 25, ph: 6.8, soil_type: 'sandy' },
  clay:  { nitrogen: 90, phosphorus: 45, potassium: 42, ph: 6.5, soil_type: 'clay' },
}

// ── Growth quality → multiplier applied to N, P, K ──────────

export const GROWTH_MULTIPLIER = {
  poor:    0.75,
  average: 1.00,
  good:    1.15,
}

// ── Water source → litres available per day per acre ────────

export const WATER_SOURCE_MAP = {
  rain:     400,
  canal:    1200,
  borewell: 1800,
  drip:     2200,
}

// ── Farmer objective → API objective key ────────────────────

export const OBJECTIVE_MAP = {
  profit:   'income',
  safe:     'low_risk',
  water:    'water_saving',
  balanced: 'balanced',
}

// ── Previous crop → API previous_crop value ─────────────────

export const PREV_CROP_MAP = {
  rice:      'rice',
  maize:     'maize',
  groundnut: 'groundnut',
  cotton:    'cotton',
  chickpea:  'chickpea',
  soybean:   'soybean',
  millet:    'millet',
  none:      '',
}

// ── Soil Health Card quick-select bands ─────────────────────

export const SHC_BANDS = {
  nitrogen:   { low: 40,  medium: 80,  high: 130 },
  phosphorus: { low: 18,  medium: 38,  high: 60 },
  potassium:  { low: 20,  medium: 40,  high: 65 },
  ph:         { low: 5.5, medium: 6.5, high: 7.8 },
}

// ── Area defaults for "Use my area's average" ───────────────

export const AREA_DEFAULTS = {
  nitrogen: 75, phosphorus: 35, potassium: 40, ph: 6.5,
  soil_type: 'loamy',
}

// ── Default climate values (fallback if weather API fails) ──

export const CLIMATE_DEFAULTS = {
  temperature: 28, humidity: 65, rainfall: 110,
}

// ── Season auto-detection ───────────────────────────────────

export function detectSeason(date = new Date()) {
  const m = date.getMonth() + 1 // 1-indexed
  const d = date.getDate()
  if (m >= 6 && (m < 10 || (m === 10 && d <= 15))) return 'kharif'
  if ((m >= 3 && m <= 5)) return 'zaid'
  return 'rabi'
}

// The model only knows kharif / rabi. Zaid maps to kharif.
export function seasonForApi(season) {
  return season === 'zaid' ? 'kharif' : season
}

// ── Build the full API payload from simple wizard answers ───

export function buildApiPayload({
  soilValues,       // { nitrogen, phosphorus, potassium, ph, soil_type }
  climate,          // { temperature, humidity, rainfall }
  season,           // 'kharif' | 'rabi' | 'zaid'
  waterSource,      // 'rain' | 'canal' | 'borewell' | 'drip'
  farmArea,         // number in acres
  previousCrop,     // key from PREV_CROP_MAP
  objective,        // key from OBJECTIVE_MAP
  location,         // string
}) {
  return {
    nitrogen:        Math.round(soilValues.nitrogen),
    phosphorus:      Math.round(soilValues.phosphorus),
    potassium:       Math.round(soilValues.potassium),
    ph:              Math.round(soilValues.ph * 10) / 10,
    temperature:     climate.temperature,
    humidity:        climate.humidity,
    rainfall:        climate.rainfall,
    water_available: WATER_SOURCE_MAP[waterSource] * farmArea,
    farm_area:       farmArea,
    previous_crop:   PREV_CROP_MAP[previousCrop] ?? '',
    season:          seasonForApi(season),
    soil_type:       soilValues.soil_type || 'loamy',
    budget:          50000,  // constant for demo
    objective:       OBJECTIVE_MAP[objective] || 'balanced',
    location:        location || 'India',
  }
}

// ── Translate a suitability score to a traffic-light label ──

export function suitabilityLabel(score) {
  if (score >= 65) return 'veryGood'
  if (score >= 45) return 'good'
  return 'risky'
}

export function suitabilityColor(score) {
  if (score >= 65) return { bg: '#dcfce7', text: '#166534', border: '#86efac', emoji: '🟢' }
  if (score >= 45) return { bg: '#fef9c3', text: '#854d0e', border: '#fde047', emoji: '🟡' }
  return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', emoji: '🔴' }
}

export function isSoilValid(path, color, values) {
  if (path === 'simple') return Object.hasOwn(SOIL_COLOR_MAP, color);
  if (path === 'area') return true;
  if (path !== 'card') return false;
  return ['nitrogen', 'phosphorus', 'potassium', 'ph'].every(field => {
    const value = values[field];
    return typeof value === 'number' && Number.isFinite(value) &&
      value >= (field === 'ph' ? 3 : 0) && value <= (field === 'ph' ? 10 : 300);
  });
}
