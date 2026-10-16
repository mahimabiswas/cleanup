import { useState } from 'react';
import { RATE } from '../constants.js';
import { aiCompare } from '../api.js';
import PhotoInput from './PhotoInput.jsx';
import Pill from './Pill.jsx';

export default function Worker({ task, submit, goBoard }) {
  const [f, setF] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!task) return (
    <div className="narrow">
      <h1>My jobs</h1>
      <div className="card">
        <p>You haven't accepted a task yet. Pick one from the task board.</p>
        <div className="actions"><button className="b alt" onClick={goBoard}>Go to the task board</button></div>
      </div>
    </div>
  );

  if (task.status === 'accepted') {
    const send = async () => {
      if (!f) return setErr('Upload an after photo first.');
      if (busy) return;
      setBusy(true);
      const ai = await aiCompare(task.beforeFile, f);
      setBusy(false);
      submit(task.id, { after: URL.createObjectURL(f), ai, status: 'review' });
    };
    return (
      <div className="narrow">
        <h1>My jobs</h1>
        <div className="card">
          <div className="job-head">
            <h2>{task.job}</h2>
            <Pill status="accepted" />
          </div>
          <p className="muted">{task.kind} · {task.area}</p>
          <p className="fee">£{RATE[task.size].fee} <span>fixed fee</span></p>
          {task.before && (
            <figure>
              <img className="ph" src={task.before} alt="Before" />
              <figcaption className="muted">Before</figcaption>
            </figure>
          )}
          <div className="alert"><b>Safety:</b> if you find needles, chemicals, asbestos or anything on the road, stop and report it. Don't touch it.</div>
          <PhotoInput id="af" label="After photo" file={f} onChange={(e) => setF(e.target.files[0])} />
          <div className="actions">
            <button className="b" onClick={send}>{busy ? 'Checking photos…' : 'Submit finished job'}</button>
          </div>
          {err && <p className="err">{err}</p>}
        </div>
      </div>
    );
  }

  const m = {
    review: 'Submitted. A council officer will check it and approve payment.',
    done: 'Approved and paid.',
    rejected: 'Rejected by the council officer.',
  }[task.status];
  return (
    <div className="narrow">
      <h1>My jobs</h1>
      <div className="card">
        <div className="job-head">
          <h2>{task.job}</h2>
          <Pill status={task.status} />
        </div>
        <p>{m}</p>
        {task.after && <img className="ph" src={task.after} alt="After" />}
        <div className="actions"><button className="b alt" onClick={goBoard}>Back to task board</button></div>
      </div>
    </div>
  );
}
