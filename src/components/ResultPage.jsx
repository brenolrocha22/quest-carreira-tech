import { useRef } from 'react';
import CharacterCard from './CharacterCard.jsx';
import ShareCenter from './ShareCenter.jsx';
import Courses from './Courses.jsx';
import { AdSlot } from './Legal.jsx';
import { CLASS_BY_ID } from '../data/classes.js';
import { CONFIG } from '../lib/backend.js';

export default function ResultPage({ name, result, avatar, persona, onTrail, onRestart }) {
  const cardRef = useRef();
  const cls = CLASS_BY_ID[result.main];

  return (
    <div className="fade-in flex flex-col gap-6 pt-2">
      <CharacterCard ref={cardRef} name={name} result={result} avatar={avatar} persona={persona} />

      <section className="panel mx-auto w-full max-w-4xl p-5">
        <h2 className="title-glow mb-2 text-2xl font-bold">Sua jornada começa agora</h2>
        <p className="mb-4 text-mist">
          A carreira que recomendamos para você é <strong className="text-parchment">{cls.profession}</strong>. Siga a trilha de 4 fases, marque suas missões e desbloqueie badges.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="btn-rune" onClick={onTrail}>🗺️ Ver trilha de missões</button>
          <button className="btn-ghost" onClick={onRestart}>↺ Refazer quest</button>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <Courses classId={cls.id} />
        </div>
        <ShareCenter name={name} cls={cls} sub={CLASS_BY_ID[result.sub]} attributes={result.attributes} avatar={avatar} cardRef={cardRef} />
      </div>
      <AdSlot slot={CONFIG.adSlots.result} />
    </div>
  );
}
