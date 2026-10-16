import { useState } from 'react';
import { SEED } from './constants.js';
import Report from './components/Report.jsx';
import Board from './components/Board.jsx';
import Worker from './components/Worker.jsx';
import Staff from './components/Staff.jsx';

const TABS = [
  ['report', 'Report a problem'],
  ['board', 'Task board'],
  ['worker', 'My job'],
  ['staff', 'Council dashboard'],
];

export default function App() {
  const [tab, setTab] = useState('report');
  const [tasks, setTasks] = useState(SEED);
  const [crew, setCrew] = useState([{ id: 90, kind: 'Pothole', area: 'M14 5XY' }]);
  const [job, setJob] = useState(null);
  const [n, setN] = useState(10);

  const patch = (id, p) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t)));
  const goBoard = () => setTab('board');

  return (
    <div>
      <header>
        <h1>CleanUP MCR</h1>
        <p>Spot a small problem on your Manchester street and snap it. The council funds the fix and a local resident gets paid a fixed fee to do it.</p>
        <nav role="tablist">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>
          ))}
        </nav>
      </header>
      <main>
        {tab === 'report' && (
          <Report
            goBoard={goBoard}
            addTask={(t) => { setTasks((ts) => [...ts, { ...t, id: n, status: 'open' }]); setN(n + 1); }}
            addCrew={(c) => { setCrew((cs) => [...cs, { ...c, id: n }]); setN(n + 1); }}
          />
        )}
        {tab === 'board' && (
          <Board tasks={tasks} accept={(id) => { patch(id, { status: 'accepted' }); setJob(id); setTab('worker'); }} />
        )}
        {tab === 'worker' && <Worker task={tasks.find((t) => t.id === job)} submit={patch} goBoard={goBoard} />}
        {tab === 'staff' && <Staff tasks={tasks} crew={crew} setStatus={(id, s) => patch(id, { status: s })} />}
      </main>
    </div>
  );
}
