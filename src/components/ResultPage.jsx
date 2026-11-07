import { useRef } from 'react';
import CharacterCard from './CharacterCard.jsx';
import ShareCenter from './ShareCenter.jsx';
import { CLASS_BY_ID } from '../data/classes.js';

export default function ResultPage({ name, result, onTrail, onRestart }) {
  const cardRef = useRef();
  const cls = CLASS_BY_ID[result.main];

  return (
    <div className="fade-in grid gap-6 pt-2 lg:grid-cols-[minmax(0,28rem)_1fr] lg:items-start">
      <CharacterCard ref={cardRef} name={name} result={result} />
      <div className="flex flex-col gap-6">
        <section className="panel p-5">
          <h2 className="title-glow mb-2 text-2xl font-bold">Sua jornada começa agora</h2>
          <p className="mb-4 text-mist">
            Siga a trilha de 4 fases do(a) <strong className="text-parchment">{cls.profession}</strong>, marque suas missões e desbloqueie insígnias.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn-rune" onClick={onTrail}>🗺️ Ver trilha de missões</button>
            <button className="btn-ghost" onClick={onRestart}>↺ Refazer quest</button>
          </div>
        </section>
        <ShareCenter name={name} cls={cls} sub={CLASS_BY_ID[result.sub]} attributes={result.attributes} cardRef={cardRef} />
      </div>
    </div>
  );
}
