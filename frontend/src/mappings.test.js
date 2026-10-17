import test from 'node:test';
import assert from 'node:assert/strict';
import { isSoilValid, buildApiPayload, suitabilityLabel, detectSeason } from './mappings.js';

test('soil selection and lab values must be complete and in API bounds', () => {
  const soil = { nitrogen: 80, phosphorus: 40, potassium: 35, ph: 6.5 };
  assert.equal(isSoilValid('', '', soil), false);
  assert.equal(isSoilValid('simple', '', soil), false);
  assert.equal(isSoilValid('simple', 'black', soil), true);
  assert.equal(isSoilValid('card', '', soil), true);
  for (const value of ['', -1, 301, NaN, Infinity]) {
    assert.equal(isSoilValid('card', '', { ...soil, nitrogen: value }), false);
  }
  for (const ph of ['', 0, 2.9, 10.1]) {
    assert.equal(isSoilValid('card', '', { ...soil, ph }), false);
  }
});

test('payload scales water by acreage and maps wizard options', () => {
  const payload = buildApiPayload({ soilValues: { nitrogen: 80, phosphorus: 40, potassium: 35, ph: 6.5 }, climate: { temperature: 28, humidity: 65, rainfall: 110 }, season: 'zaid', waterSource: 'canal', farmArea: 3, previousCrop: 'none', objective: 'safe', location: 'Test' });
  assert.equal(payload.water_available, 3600);
  assert.equal(payload.season, 'kharif');
  assert.equal(payload.objective, 'low_risk');
  assert.equal(payload.previous_crop, '');
});

test('API percentage thresholds and season boundaries', () => {
  assert.equal(suitabilityLabel(64), 'good');
  assert.equal(suitabilityLabel(65), 'veryGood');
  assert.equal(suitabilityLabel(44), 'risky');
  assert.equal(detectSeason(new Date(2026, 9, 15)), 'kharif');
  assert.equal(detectSeason(new Date(2026, 9, 16)), 'rabi');
});
