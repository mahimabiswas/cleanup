import { RATE, hash } from '../constants.js';

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
      <div className="stats">
        {stats.map(([l, v]) => <div className="stat" key={l}><b>{v}</b>{l}</div>)}
      </div>

      <h2>Waiting for approval</h2>
      {review.length ? review.map((t) => (
        <div className="card" key={t.id}>
          <b>{t.job}</b> · {t.area} · £{RATE[t.size].fee}
          <div className="row">
            {t.before && <div><span className="muted">Before</span><img className="ph" src={t.before} alt="Before" /></div>}
            <div><span className="muted">After</span><img className="ph" src={t.after} alt="After" /></div>
          </div>
          <p>
            <span className={'tag ' + (t.ai.likely ? 'grn' : 'red')}>{t.ai.likely ? 'Likely complete' : 'Not clearly fixed'}</span>
            AI confidence {t.ai.conf}%
          </p>
          <p className="muted">{t.ai.note}</p>
          <button className="b" onClick={() => setStatus(t.id, 'done')}>Approve and pay</button>
          <button className="b no" onClick={() => setStatus(t.id, 'rejected')}>Reject</button>
        </div>
      )) : <div className="card muted">Nothing to review.</div>}

      <h2>Hotspots</h2>
      <div className="card scroll">
        <svg viewBox="0 0 600 270" width="100%" role="img" aria-label="Manchester hotspot map by postcode">
          <rect width="600" height="270" rx="10" fill="var(--bg)" stroke="var(--ln)" />
          {Object.entries(pts).map(([ar, n]) => {
            const x = 40 + (hash(ar) % 520), y = 30 + ((hash(ar) >> 8) % 220);
            return (
              <g key={ar}>
                <circle cx={x} cy={y} r={8 + n * 5} fill="var(--red)" fillOpacity=".45" stroke="var(--red)" />
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
