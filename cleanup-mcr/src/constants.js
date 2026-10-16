// Council rate card: fixed fee and time estimate per task size. Replace with real figures.
export const RATE = {
  small: { fee: 15, mins: 30 },
  medium: { fee: 30, mins: 60 },
  large: { fee: 55, mins: 120 },
};

// Hard safety block: any of these in the resident's note goes straight to the crew.
export const HAZ = /needle|syringe|sharps|asbestos|chemical|oil|paint|gas|glass|road|pothole|drain|sewer|carriageway|dead animal|fire/i;

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
