import { RATE } from '../constants.js';
import Pill from './Pill.jsx';

export default function Board({ tasks, accept }) {
  const open = tasks.filter((t) => t.status === 'open');
  return (
    <div>
      <h1>Community tasks across Manchester</h1>
      <p className="lede">Pick a job near you. Every task has a fixed fee from the council rate card.</p>
      {open.length ? (
        <div className="grid">
          {open.map((t) => (
            <article className="card job" key={t.id}>
              <div className="job-head">
                <h2>{t.job}</h2>
                <Pill status="open" />
              </div>
              <p className="muted">{t.kind}</p>
              <div className="tags">
                <span className="tag">{t.area}</span>
                <span className="tag">{t.size}</span>
                <span className="tag">{RATE[t.size].mins} min</span>
              </div>
              <p className="fee">£{RATE[t.size].fee} <span>fixed fee</span></p>
              <button className="b full" onClick={() => accept(t.id)}>Accept task</button>
            </article>
          ))}
        </div>
      ) : <div className="card">No open tasks. Report a problem to add one.</div>}
    </div>
  );
}
