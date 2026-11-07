import { Component, useEffect, useMemo, useState } from 'react';
import Home from './components/Home.jsx';
import Quiz from './components/Quiz.jsx';
import Reveal from './components/Reveal.jsx';
import ResultPage from './components/ResultPage.jsx';
import QuestTrail from './components/QuestTrail.jsx';
import { QUESTIONS } from './data/questions.js';
import { computeResult } from './lib/scoring.js';
import { load, save } from './lib/storage.js';
import { isMuted, setMuted, play } from './lib/sound.js';

const KEY = 'qct_session';
const EMPTY = { name: '', answers: [], screen: 'home' };

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="panel mx-auto mt-16 max-w-md p-6 text-center" role="alert">
        <h2 className="title-glow mb-2 text-xl">Um feitiço deu errado…</h2>
        <p className="mb-4 text-mist">Algo inesperado aconteceu. Reinicie a quest para continuar.</p>
        <button className="btn-rune" onClick={() => { localStorage.removeItem(KEY); location.reload(); }}>
          Reiniciar
        </button>
      </div>
    );
  }
}

function Particles() {
  return (
    <div className="particles" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDuration: `${9 + (i % 5) * 3}s`, animationDelay: `${(i * 1.3) % 10}s` }} />
      ))}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => {
    const s = load(KEY, EMPTY);
    return s && Array.isArray(s.answers) ? s : EMPTY;
  });
  const [muted, setMutedState] = useState(isMuted());
  useEffect(() => save(KEY, session), [session]);
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [session.screen]);

  const complete = session.answers.length === QUESTIONS.length && session.answers.every((a) => a != null);
  const result = useMemo(() => (complete ? computeResult(session.answers) : null), [complete, session.answers]);
  const update = (patch) => setSession((s) => ({ ...s, ...patch }));
  let screen = session.screen;
  if (['reveal', 'card', 'trail'].includes(screen) && !result) screen = 'home';

  return (
    <ErrorBoundary>
      <Particles />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <button className="font-display text-sm font-bold tracking-widest text-gold" onClick={() => update({ screen: 'home' })}>
          ⚔️ QUEST TECH
        </button>
        <button
          className="btn-ghost !px-3 !py-1.5 text-sm"
          aria-pressed={!muted}
          aria-label={muted ? 'Ativar sons' : 'Desativar sons'}
          onClick={() => { setMuted(!muted); setMutedState(!muted); if (muted) play('click'); }}
        >
          {muted ? '🔇 Som' : '🔊 Som'}
        </button>
      </header>
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16">
        {screen === 'home' && (
          <Home
            initialName={session.name}
            hasResult={!!result}
            onStart={(name) => update({ name, answers: [], screen: 'quiz' })}
            onContinue={() => update({ screen: 'card' })}
          />
        )}
        {screen === 'quiz' && (
          <Quiz
            answers={session.answers}
            onChange={(answers) => update({ answers })}
            onFinish={() => { play('reveal'); update({ screen: 'reveal' }); }}
            onExit={() => update({ screen: 'home' })}
          />
        )}
        {screen === 'reveal' && <Reveal result={result} onDone={() => update({ screen: 'card' })} />}
        {screen === 'card' && (
          <ResultPage
            name={session.name}
            result={result}
            onTrail={() => update({ screen: 'trail' })}
            onRestart={() => update({ answers: [], screen: 'home' })}
          />
        )}
        {screen === 'trail' && <QuestTrail classId={result.main} onBack={() => update({ screen: 'card' })} />}
      </main>
    </ErrorBoundary>
  );
}
