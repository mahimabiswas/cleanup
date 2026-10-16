import { RATE, hash } from '../constants.js';
import Pill from './Pill.jsx';

export default function Staff({ tasks, crew, setStatus }) {
  const count = (s) => tasks.filter((t) => t.status === s).length;
  const review = tasks.filter((t) => t.status === 'review');
  const paid = tasks.filter((t) => t.status === 'done').reduce((n, t) => n + RATE[t.size].fee, 0);
  const pts = {};
  [...tasks, ...crew].forEach((t) => { pts[t.area] = (pts[t.area] || 0) + 1; });
  const stats = [
    ['Open', count('open')], ['Awaiting approval', review.length], ['Done', count('done')],
    ['Rejected', count('rejected')], ['Sent to crew', crew.length], ['Paid so far', '£' + paid],
  ];

  return (
    <div>
      <h1>Council dashboard</h1>
      <div className="stats">
        {stats.map(([l, v]) => <div className="stat" key={l}><b>{v}</b><span>{l}</span></div>)}
      </div>

      <h2>Waiting for approval</h2>
      {review.length ? review.map((t) => (
        <div className="card" key={t.id}>
          <div className="job-head">
            <h3>{t.job}</h3>
            <Pill status="review" />
          </div>
          <p className="muted">{t.area} · £{RATE[t.size].fee}</p>
          {/* before and after side by side, stacked on mobile */}
          <div className="photos">
            {t.before && <figure><img className="ph" src={t.before} alt="Before" /><figcaption className="muted">Before</figcaption></figure>}
            <figure><img className="ph" src={t.after} alt="After" /><figcaption className="muted">After</figcaption></figure>
          </div>
          <p>
            <Pill status={t.ai.likely ? 'done' : 'rejected'}>{t.ai.likely ? 'Likely complete' : 'Not clearly fixed'}</Pill>{' '}
            AI confidence {t.ai.conf}%
          </p>
          <p className="muted">{t.ai.note}</p>
          <div className="actions">
            <button className="b" onClick={() => setStatus(t.id, 'done')}>Approve and pay</button>
            <button className="b no" onClick={() => setStatus(t.id, 'rejected')}>Reject</button>
          </div>
        </div>
      )) : <div className="card muted">Nothing to review.</div>}

      <h2>Hotspots</h2>
      <div className="card scroll">
        <svg viewBox="0 0 600 270" width="100%" role="img" aria-label="Manchester hotspot map by postcode">
          <rect width="600" height="270" rx="12" fill="var(--bg)" stroke="var(--line)" />
          {Object.entries(pts).map(([ar, n]) => {
            const x = 40 + (hash(ar) % 520), y = 30 + ((hash(ar) >> 8) % 220);
            return (
              <g key={ar}>
                <circle cx={x} cy={y} r={8 + n * 5} fill="var(--brand)" fillOpacity=".35" stroke="var(--brand)" />
                <text x={x + 12 + n * 5} y={y + 4}>{ar} ({n})</text>
              </g>
            );
          })}
        </svg>
        <p className="muted">Demo map of Manchester: postcodes sit on a schematic grid. Bigger circle, more reports.</p>
      </div>
    </div>
  );
}
