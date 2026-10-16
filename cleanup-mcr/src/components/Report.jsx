import { useState } from 'react';
import { RATE } from '../constants.js';
import { aiTriage } from '../api.js';

export default function Report({ addTask, addCrew, goBoard }) {
  const [file, setFile] = useState(null);
  const [area, setArea] = useState('');
  const [note, setNote] = useState('');
  const [draft, setDraft] = useState(null);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => { setDraft(null); setSent(''); setFile(null); setArea(''); setNote(''); };

  const check = async () => {
    if (!file || !area.trim()) return setMsg('Add a photo and a postcode to continue.');
    if (busy) return;
    setMsg('');
    setBusy(true);
    const a = area.trim().toUpperCase();
    const r = await aiTriage(file, note);
    setBusy(false);
    setDraft({ img: URL.createObjectURL(file), area: a, r });
  };

  if (sent) return (
    <div>
      <div className="ok">{sent}</div>
      <button className="b" onClick={reset}>Report another</button>
      <button className="b alt" onClick={goBoard}>See the task board</button>
    </div>
  );

  if (!draft) return (
    <div>
      <div className="card">
        <h2>What have you spotted?</h2>
        <label htmlFor="f">Photo</label>
        <input id="f" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <label htmlFor="ar">Area (postcode)</label>
        <input id="ar" type="text" placeholder="e.g. M4 1HN" value={area} onChange={(e) => setArea(e.target.value)} />
        <label htmlFor="nt">Anything we should know? (optional)</label>
        <textarea id="nt" rows="2" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="b" onClick={check}>{busy ? 'Checking photo…' : 'Check my report'}</button>
        <p className="muted">{msg}</p>
      </div>
      <p className="muted">AI looks at your photo and checks it is a street problem before anything is sent.</p>
    </div>
  );

  const { r } = draft;
  const rc = RATE[r.size];
  return (
    <div className="card">
      <h2>Check before we send</h2>
      <img className="ph" src={draft.img} alt="Your photo" />
      {r.route === 'crew' && (
        <div>
          <div className="alert"><b>Sent to the council crew.</b> {r.why}. This could be unsafe, so it can't be offered as a community task. Please keep clear of it.</div>
          <button className="b" onClick={() => { addCrew({ kind: r.kind, area: draft.area }); setSent('Sent to the council crew. Thank you.'); }}>Send to crew</button>
        </div>
      )}
      {r.route === 'unclear' && <div className="alert">{r.why} Take another photo, closer and in daylight, then try again.</div>}
      {r.route === 'community' && (
        <div>
          <p className="muted">What I can see: {r.seen}</p>
          <p>I think this is <b>{r.kind.toLowerCase()}</b> in {draft.area}. It looks <b>{r.size}</b>, about {rc.mins} minutes of work, and the risk is <b>{r.risk}</b>.</p>
          <p>It will be listed as a community task: <b>{r.job}</b>, paid at <b>£{rc.fee}</b> from the council rate card.</p>
          <p>Is that right?</p>
          <button className="b" onClick={() => { addTask({ kind: r.kind, job: r.job, area: draft.area, size: r.size, before: draft.img, beforeFile: file }); setSent('Task added to the board.'); }}>Yes, send it</button>
          <button className="b alt" onClick={() => { addCrew({ kind: r.kind, area: draft.area }); setSent('Sent to the council crew. Thank you.'); }}>No, send to crew instead</button>
        </div>
      )}
      <button className="b alt" onClick={reset}>Start again</button>
    </div>
  );
}
