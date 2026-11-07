import { useEffect, useState } from 'react';
import { CLASS_BY_ID } from '../data/classes.js';

export default function Reveal({ result, onDone }) {
  const cls = CLASS_BY_ID[result.main];
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="fade-in flex flex-col items-center pt-6 text-center" aria-live="polite">
      <h1 className="title-glow mb-8 text-3xl font-black sm:text-5xl">QUEST CONCLUÍDA!</h1>
      <div className="flip-scene h-80 w-56">
        <div className="flip-card h-full w-full">
          <div className="flip-face card-frame" aria-hidden="true">
            <div className="card-inner grid h-full place-items-center text-6xl">✦</div>
          </div>
          <div className="flip-face flip-back card-frame">
            <div className="card-inner flex h-full flex-col items-center justify-center gap-3">
              <div className="emblem h-24 w-24 text-5xl" aria-hidden="true">{cls.icon}</div>
              <p className="font-display text-xl font-bold text-gold">{cls.name}</p>
              <p className="text-sm text-mist">{cls.profession}</p>
            </div>
          </div>
        </div>
      </div>
      <p className={`mt-8 max-w-md text-mist transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}>
        Sua classe é <strong className="text-parchment">{cls.name}</strong>, ou seja, {cls.profession}.
      </p>
      <button className="btn-rune mt-6" onClick={onDone} disabled={!ready} autoFocus>
        Ver meu card completo
      </button>
    </section>
  );
}
