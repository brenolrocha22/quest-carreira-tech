import { useEffect } from 'react';
import { CLASS_BY_ID } from '../data/classes.js';
import { PixelHero } from './PixelArt.jsx';

// Revelação: a carta vira e o card completo abre sozinho (sem precisar recarregar).
export default function Reveal({ result, avatar, onDone }) {
  const cls = CLASS_BY_ID[result.main];
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <section className="fade-in flex flex-col items-center pt-6 text-center" aria-live="polite">
      <h1 className="title-glow mb-8 text-3xl font-black sm:text-5xl">QUEST CONCLUÍDA!</h1>
      <div className="flip-scene h-80 w-56">
        <div className="flip-card h-full w-full">
          <div className="flip-face card-frame" aria-hidden="true">
            <div className="card-inner grid h-full place-items-center text-6xl">✦</div>
          </div>
          <div className="flip-face flip-back card-frame">
            <div className="card-inner flex h-full flex-col items-center justify-center gap-2">
              <PixelHero avatar={avatar} robe={cls.color} size={72} alt="" />
              <p className="font-display text-xl font-bold text-gold">{cls.name}</p>
              <p className="text-sm text-mist">{cls.profession}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-8 max-w-md text-mist">
        Sua carreira recomendada é <strong className="text-parchment">{cls.profession}</strong>.
      </p>
      <button className="btn-ghost mt-5" onClick={onDone}>Ver card completo agora →</button>
    </section>
  );
}
