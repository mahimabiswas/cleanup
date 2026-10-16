import { useState } from 'react';
import { SEED } from './constants.js';
import Report from './components/Report.jsx';
import Board from './components/Board.jsx';
import Worker from './components/Worker.jsx';
import Staff from './components/Staff.jsx';

const TABS = [
  ['report', 'Report a problem'],
  ['board', 'Task board'],
  ['worker', 'My jobs'],
  ['staff', 'Council dashboard'],
];

export default function App() {
  const [tab, setTab] = useState('report');
  const [tasks, setTasks] = useState(SEED);
  const [crew, setCrew] = useState([{ id: 90, kind: 'Pothole', area: 'M14 5XY' }]);
  const [job, setJob] = useState(null);
  const [n, setN] = useState(10);
  const [menu, setMenu] = useState(false); // mobile menu open/closed

  const patch = (id, p) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t)));
  const goBoard = () => setTab('board');

  return (
    <div>
      <header className="topbar">
        <div className="topbar-in">
          <div className="logo"><span className="logo-dot" aria-hidden="true" />CleanUp Salford</div>
          <button className="menu-btn" aria-expanded={menu} aria-controls="mainnav" onClick={() => setMenu(!menu)}>
            {menu ? 'Close' : 'Menu'}
          </button>
          <nav id="mainnav" aria-label="Main" className={menu ? 'open' : undefined}>
            <ul>
              {TABS.map(([k, l]) => (
                <li key={k}>
                  <button className="navlink" aria-current={tab === k ? 'page' : undefined} onClick={() => { setTab(k); setMenu(false); }}>{l}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      {/* the dashboard gets a wider column */}
      <main className={tab === 'staff' ? 'wide' : undefined}>
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
