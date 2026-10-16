import { useState } from 'react';
import { RATE } from '../constants.js';
import { aiCompare } from '../api.js';

export default function Worker({ task, submit, goBoard }) {
  const [f, setF] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!task) return <div className="card">You haven't accepted a task yet. Pick one from the task board.</div>;

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
      <div className="card">
        <h2>{task.job}</h2>
        <p>{task.kind} · {task.area} · <b>£{RATE[task.size].fee}</b> fixed fee</p>
        {task.before && <img className="ph" src={task.before} alt="Before" />}
        <p><b>Safety:</b> if you find needles, chemicals, asbestos or anything on the road, stop and report it. Don't touch it.</p>
        <label htmlFor="af">After photo</label>
        <input id="af" type="file" accept="image/*" onChange={(e) => setF(e.target.files[0])} />
        <button className="b" onClick={send}>{busy ? 'Checking photos…' : 'Submit finished job'}</button>
        <p className="muted">{err}</p>
      </div>
    );
  }

  const m = {
    review: 'Submitted. A council officer will check it and approve payment.',
    done: 'Approved and paid.',
    rejected: 'Rejected by the council officer.',
  }[task.status];
  return (
    <div className="card">
      <h2>{task.job}</h2>
      <p>{m}</p>
      {task.after && <img className="ph" src={task.after} alt="After" />}
      <button className="b alt" onClick={goBoard}>Back to task board</button>
    </div>
  );
}
