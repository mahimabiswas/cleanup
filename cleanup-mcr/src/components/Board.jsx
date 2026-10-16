import { RATE } from '../constants.js';

export default function Board({ tasks, accept }) {
  const open = tasks.filter((t) => t.status === 'open');
  return (
    <div>
      <h2>Community tasks across Manchester</h2>
      {open.length ? open.map((t) => (
        <div className="card" key={t.id}>
          <div className="row">
            <div>
              <b>{t.job}</b><br />
              <span className="muted">{t.kind} · {t.area}</span><br />
              <span className="tag">{t.size}</span><span className="tag">{RATE[t.size].mins} min</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="fee">£{RATE[t.size].fee}</div>
              <button className="b" onClick={() => accept(t.id)}>Accept task</button>
            </div>
          </div>
        </div>
      )) : <div className="card">No open tasks. Report a problem to add one.</div>}
    </div>
  );
}
