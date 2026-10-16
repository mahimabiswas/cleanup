// Council rate card: fixed fee and time estimate per task size. Replace with real figures.
export const RATE = {
  small: { fee: 15, mins: 30 },
  medium: { fee: 30, mins: 60 },
  large: { fee: 55, mins: 120 },
};

// Hard safety block: any of these in the resident's note goes straight to the crew.
// Whole words/phrases only, so street names like "Broad Street" or "Oldfield Road" don't trip it.
// Ambiguous bare words (road, oil, gas, paint, glass, fire) are left to the vision check.
export const HAZ =
  /\b(?:needles?|syringes?|sharps|asbestos|chemicals?|potholes?|drains?|sewers?|carriageway|dead animals?|(?:on|in) the road|gas (?:cylinder|canister)s?|paint tins?|broken glass)\b/i;

export const hash = (s) => {
  let x = 0;
  for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0;
  return x;
};

export const SEED = [
  { id: 1, kind: 'Litter', job: 'Litter pick', area: 'M1 2AB', size: 'medium', status: 'open' },
  { id: 2, kind: 'Overgrown alley', job: 'Weeding and cut-back', area: 'M14 5XY', size: 'large', status: 'open' },
  { id: 3, kind: 'Small fly-tip', job: 'Clear small fly-tip', area: 'M1 2AB', size: 'small', status: 'done' },
  { id: 4, kind: 'Overflowing bin area', job: 'Tidy bin area', area: 'M20 3PQ', size: 'small', status: 'rejected' },
];
