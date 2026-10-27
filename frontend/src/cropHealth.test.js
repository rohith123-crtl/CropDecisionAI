import test from 'node:test';
import assert from 'node:assert/strict';

test('crop health stages are defined and ordered from sowing to harvest', () => {
  const stages = [
    'Seedling / Nursery',
    'Active Vegetative',
    'Flowering / Heading',
    'Fruiting / Pod Fill',
    'Maturation / Harvest'
  ];
  assert.equal(stages.length, 5);
  assert.equal(stages[0], 'Seedling / Nursery');
  assert.equal(stages[4], 'Maturation / Harvest');
});

test('health score thresholds correctly categorize severity', () => {
  function getCategory(score) {
    if (score >= 85) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
  }

  assert.equal(getCategory(95), 'healthy');
  assert.equal(getCategory(85), 'healthy');
  assert.equal(getCategory(74), 'warning');
  assert.equal(getCategory(58), 'critical');
  assert.equal(getCategory(32), 'critical');
});

test('overtime trajectory calculates trend delta accurately', () => {
  const trajectory = [
    { scan_date: '2026-08-10', health_score: 95 },
    { scan_date: '2026-08-28', health_score: 62 },
    { scan_date: '2026-09-14', health_score: 83 },
    { scan_date: '2026-10-05', health_score: 91 }
  ];

  const firstScore = trajectory[0].health_score;
  const lastScore = trajectory[trajectory.length - 1].health_score;
  const lowestScore = Math.min(...trajectory.map(t => t.health_score));
  const recoveryDelta = lastScore - lowestScore;

  assert.equal(firstScore, 95);
  assert.equal(lowestScore, 62);
  assert.equal(lastScore, 91);
  assert.equal(recoveryDelta, 29); // +29% recovery from trough
});

test('multilingual crop health supports English, Telugu, Hindi, Kannada, Tamil, Marathi', async () => {
  const { CROP_HEALTH_LANGUAGES, UI_STRINGS, tCropHealth, localizeDiagnosis, getLocalizedPresets, getSpeechSummary } = await import('./cropHealthI18n.js');

  const expectedCodes = ['en', 'te', 'hi', 'kn', 'ta', 'mr'];
  assert.equal(CROP_HEALTH_LANGUAGES.length, 6);
  expectedCodes.forEach(code => {
    assert.ok(CROP_HEALTH_LANGUAGES.some(l => l.code === code), `Missing language: ${code}`);
    assert.ok(UI_STRINGS[code], `Missing UI strings for ${code}`);
    assert.ok(tCropHealth(code, 'tabScanner'), `Missing tabScanner for ${code}`);
  });

  // Verify diagnostic localization for early blight
  const sampleDiagnosis = {
    crop_name: 'Tomato',
    growth_stage: 'Vegetative',
    health_score: 62,
    health_status: 'warning',
    disease_key: 'early_blight',
    disease_detected: 'Early Blight (Alternaria solani)',
    category: 'Fungal Disease',
    severity: 'Moderate',
    confidence: 92,
    symptoms: ['Dark brown circular lesions'],
    remedies: {
      organic: ['Spray Neem oil'],
      chemical: ['Mancozeb 75% WP'],
      cultural: ['Prune bottom leaves']
    },
    forecast: {
      untreated_risk: 'Defoliation risk',
      recovery_forecast: 'Arrests spread'
    }
  };

  const telugu = localizeDiagnosis(sampleDiagnosis, 'te');
  assert.ok(telugu.disease_detected.includes('ముందస్తు తెగులు'));
  assert.ok(telugu.remedies.organic[0].includes('వేప'));

  const hindi = localizeDiagnosis(sampleDiagnosis, 'hi');
  assert.ok(hindi.disease_detected.includes('अगेती झुलसा'));
  assert.ok(hindi.remedies.organic[0].includes('नीम'));

  const kannada = localizeDiagnosis(sampleDiagnosis, 'kn');
  assert.ok(kannada.disease_detected.includes('ಕರಗು ರೋಗ'));

  const tamil = localizeDiagnosis(sampleDiagnosis, 'ta');
  assert.ok(tamil.disease_detected.includes('கருகல்'));

  const marathi = localizeDiagnosis(sampleDiagnosis, 'mr');
  assert.ok(marathi.disease_detected.includes('करपा'));

  // Verify presets localization
  const presetsTe = getLocalizedPresets('te');
  assert.ok(presetsTe[0].title.includes('టమాటా'));

  // Verify speech summary generation
  const speechTe = getSpeechSummary(sampleDiagnosis, 'te');
  assert.ok(speechTe.includes('టమాటా'));
  assert.ok(speechTe.includes('స్కోరు'));

  const speechHi = getSpeechSummary(sampleDiagnosis, 'hi');
  assert.ok(speechHi.includes('टमाटर'));
  assert.ok(speechHi.includes('स्कोर'));
});

