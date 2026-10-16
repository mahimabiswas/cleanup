import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HAZ } from './constants.js';

test('HAZ ignores normal reports and street names', () => {
  for (const note of [
    'Rubbish on Broad Street',
    'bags near the toilet block',
    'Broadway alley',
    'litter by Gaskell Street',
    'painting on the wall',
    'Oldfield Road alley',
  ]) {
    assert.equal(HAZ.test(note), false, note);
  }
});

test('HAZ flags hazards', () => {
  for (const note of ['there are needles', 'pothole in the road', 'asbestos sheets', 'broken glass everywhere']) {
    assert.equal(HAZ.test(note), true, note);
  }
});
