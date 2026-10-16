import { HAZ } from './constants.js';

// Downscale to max 1024px JPEG before upload, then return base64 (no data: prefix).
const shrink = (f) =>
  new Promise((res) => {
    const i = new Image();
    i.onload = () => {
      const k = Math.min(1, 1024 / Math.max(i.width, i.height));
      const c = document.createElement('canvas');
      c.width = i.width * k;
      c.height = i.height * k;
      c.getContext('2d').drawImage(i, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.8).split(',')[1]);
    };
    i.onerror = () => res(null);
    i.src = URL.createObjectURL(f);
  });

async function post(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Request failed: ${r.status}`);
  return r.json();
}

const JOBS = {
  litter: ['Litter', 'Litter pick'],
  'fly-tip': ['Small fly-tip', 'Clear small fly-tip'],
  overgrown: ['Overgrown alley', 'Weeding and cut-back'],
  bin: ['Overflowing bin area', 'Tidy bin area'],
};

export async function aiTriage(file, note) {
  const hz = note.match(HAZ);
  if (hz) return { route: 'crew', kind: 'Hazard', risk: 'high', why: `Possible hazard (${hz[0].toLowerCase()})` };
  try {
    const image = await shrink(file);
    const a = await post('/api/triage', { image, note });
    if (a.issue === 'hazard' || a.issue === 'road' || a.risk === 'high')
      return { route: 'crew', kind: a.issue === 'road' ? 'Road defect' : 'Hazard', risk: 'high', why: a.seen };
    const m = JOBS[a.issue];
    if (!m) return { route: 'unclear', why: `I can see: ${a.seen} That doesn't look like a street problem we can list.` };
    const size = ['small', 'medium', 'large'].includes(a.size) ? a.size : 'medium';
    return { route: 'community', kind: m[0], job: m[1], size, risk: a.risk || 'low', seen: a.seen };
  } catch {
    return { route: 'unclear', why: "The photo check isn't available right now, so I can't confirm this is a street problem." };
  }
}

export async function aiCompare(before, after) {
  if (!before) return { likely: false, conf: 0, note: 'No before photo on file, so an officer needs to check this by eye.' };
  try {
    const r = await post('/api/compare', { before: await shrink(before), after: await shrink(after) });
    const conf = Math.max(0, Math.min(100, Math.round(+r.confidence || 0)));
    return { likely: !!r.cleared && r.same_place !== false && conf >= 60, conf, note: r.note || '' };
  } catch {
    return { likely: false, conf: 0, note: "The photo check isn't available, so an officer needs to check this by eye." };
  }
}
