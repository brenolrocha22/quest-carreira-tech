import { Component, useCallback, useEffect, useMemo, useState } from 'react';
import Home from './components/Home.jsx';
import Quiz from './components/Quiz.jsx';
import Register from './components/Register.jsx';
import Reveal from './components/Reveal.jsx';
import ResultPage from './components/ResultPage.jsx';
import QuestTrail from './components/QuestTrail.jsx';
import { Background } from './components/PixelArt.jsx';
import { CookieBanner, PrivacyDialog, contactHref } from './components/Legal.jsx';
import { QUESTIONS } from './data/questions.js';
import { computeResult } from './lib/scoring.js';
import { load, save } from './lib/storage.js';
import { isMuted, setMuted, play } from './lib/sound.js';
import { musicEnabled, setMusic, startMusic } from './lib/music.js';
import { readOAuthReturn, saveLead } from './lib/backend.js';
import { SKINS, HAIR_COLORS } from './lib/pixelArt.js';

const KEY = 'qct_session';
const EMPTY = { name: '', answers: [], screen: 'home' };
const DEFAULT_AVATAR = { skin: SKINS[3].color, hair: 'curto', hairColor: HAIR_COLORS[0] };

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="panel relative z-10 mx-auto mt-16 max-w-md p-6 text-center" role="alert">
        <h2 className="title-glow mb-2 text-xl">Um feitiço deu errado…</h2>
        <p className="mb-4 text-mist">Algo inesperado aconteceu. Reinicie a quest para continuar.</p>
        <button className="btn-rune" onClick={() => { localStorage.removeItem(KEY); location.reload(); }}>Reiniciar</button>
      </div>
    );
  }
}

export default function App() {
  const [session, setSession] = useState(() => {
    const s = load(KEY, EMPTY);
    return s && Array.isArray(s.answers) ? s : EMPTY;
  });
  const [lead, setLead] = useState(() => load('qct_lead', null));
  const [avatar, setAvatar] = useState(() => load('qct_avatar', DEFAULT_AVATAR));
  const [auth, setAuth] = useState(null);
  const [muted, setMutedState] = useState(isMuted());
  const [music, setMusicState] = useState(musicEnabled());
  const [privacy, setPrivacy] = useState(false);

  useEffect(() => save(KEY, session), [session]);
  useEffect(() => { window.scrollTo(0, 0); }, [session.screen]);
  useEffect(() => { readOAuthReturn().then((a) => a && setAuth(a)); }, []);
  useEffect(() => {
    const first = () => startMusic(); // navegadores só liberam áudio após uma interação
    window.addEventListener('pointerdown', first, { once: true });
    window.addEventListener('keydown', first, { once: true });
    return () => { window.removeEventListener('pointerdown', first); window.removeEventListener('keydown', first); };
  }, []);

  const complete = session.answers.length === QUESTIONS.length && session.answers.every((a) => a != null);
  const result = useMemo(() => (complete ? computeResult(session.answers) : null), [complete, session.answers]);
  const update = useCallback((patch) => setSession((s) => ({ ...s, ...patch })), []);
  const toCard = useCallback(() => update({ screen: 'card' }), [update]);
  const changeAvatar = (a) => { setAvatar(a); save('qct_avatar', a); };

  let screen = session.screen;
  if (['register', 'reveal', 'card', 'trail'].includes(screen) && !result) screen = 'home';
  if (['reveal', 'card', 'trail'].includes(screen) && !lead) screen = 'register';

  const register = async (data) => {
    const full = { ...data, classId: result.main, subId: result.sub };
    try {
      await saveLead(full, auth);
    } catch (e) {
      console.error(e); // não bloqueia a experiência; o cadastro fica salvo localmente
    }
    save('qct_lead', full);
    setLead(full);
    play('reveal');
    update({ name: data.name, screen: 'reveal' });
  };

  return (
    <ErrorBoundary>
      <Background dim={screen !== 'home'} />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        <button className="font-display text-sm font-bold tracking-widest text-gold" onClick={() => update({ screen: 'home' })}>⚔️ QUEST TECH</button>
        <div className="flex gap-2">
          <button className="btn-ghost !px-3 !py-1.5 text-sm" aria-pressed={music} aria-label={music ? 'Desligar música' : 'Ligar música'} onClick={() => { setMusic(!music); setMusicState(!music); }}>
            {music ? '🎵 Música' : '🎵 Off'}
          </button>
          <button className="btn-ghost !px-3 !py-1.5 text-sm" aria-pressed={!muted} aria-label={muted ? 'Ativar efeitos sonoros' : 'Desativar efeitos sonoros'} onClick={() => { setMuted(!muted); setMutedState(!muted); if (muted) play('click'); }}>
            {muted ? '🔇 Efeitos' : '🔊 Efeitos'}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-10">
        {screen === 'home' && (
          <Home initialName={session.name} hasResult={!!(result && lead)} onStart={(name) => update({ name, answers: [], screen: 'quiz' })} onContinue={toCard} />
        )}
        {screen === 'quiz' && (
          <Quiz
            answers={session.answers}
            onChange={(answers) => update({ answers })}
            onFinish={() => { if (lead) { play('reveal'); update({ screen: 'reveal' }); } else update({ screen: 'register' }); }}
            onExit={() => update({ screen: 'home' })}
          />
        )}
        {screen === 'register' && (
          <Register initial={{ ...(lead || {}), name: session.name }} auth={auth} onSubmit={register} onPrivacy={() => setPrivacy(true)} onBack={() => update({ screen: 'quiz' })} />
        )}
        {screen === 'reveal' && <Reveal result={result} avatar={avatar} onDone={toCard} />}
        {screen === 'card' && (
          <ResultPage name={session.name} result={result} avatar={avatar} persona={lead} onAvatar={changeAvatar} onTrail={() => update({ screen: 'trail' })} onRestart={() => update({ answers: [], screen: 'quiz' })} />
        )}
        {screen === 'trail' && <QuestTrail classId={result.main} onBack={toCard} />}
      </main>

      <footer className="relative z-10 mx-auto flex max-w-5xl flex-wrap justify-center gap-4 px-4 pb-24 text-xs text-faint">
        <button className="underline" onClick={() => setPrivacy(true)}>Política de Privacidade</button>
        <a className="underline" href={contactHref()} target="_blank" rel="noreferrer">Anuncie / Parcerias</a>
        <span>Arte e música originais · Quest de Carreira Tech</span>
      </footer>

      <CookieBanner onPrivacy={() => setPrivacy(true)} />
      <PrivacyDialog open={privacy} onClose={() => setPrivacy(false)} />
    </ErrorBoundary>
  );
}
