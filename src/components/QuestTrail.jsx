import { useEffect, useState } from 'react';
import { CLASS_BY_ID } from '../data/classes.js';
import { TRAILS } from '../data/trails.js';
import { load, save } from '../lib/storage.js';
import { play } from '../lib/sound.js';
import Courses from './Courses.jsx';
import { AdSlot } from './Legal.jsx';
import { CONFIG } from '../lib/backend.js';

const CHEERS = [
  'Primeira insígnia conquistada! Todo mestre já foi aprendiz.',
  'Metade da jornada! Sua constância é seu maior poder.',
  'Você já domina mais do que imagina. Falta pouco!',
  'Trilha completa! Você está pronto(a) para missões reais. 🏆',
];

export default function QuestTrail({ classId, onBack }) {
  const cls = CLASS_BY_ID[classId];
  const phases = TRAILS[classId];
  const key = `qct_trail_${classId}`;
  const [done, setDone] = useState(() => load(key, {}));
  const [toast, setToast] = useState('');
  useEffect(() => save(key, done), [key, done]);

  const total = phases.reduce((n, ph) => n + ph.missions.length, 0);
  const count = Object.values(done).filter(Boolean).length;
  const phaseDone = (pi, state = done) => phases[pi].missions.every((_, mi) => state[`${pi}-${mi}`]);
  const unlocked = phases.filter((_, i) => phaseDone(i)).length;

  const toggle = (pi, mi) => {
    const next = { ...done, [`${pi}-${mi}`]: !done[`${pi}-${mi}`] };
    setDone(next);
    if (!phaseDone(pi) && phaseDone(pi, next)) {
      play('badge');
      const n = phases.filter((_, i) => phaseDone(i, next)).length;
      setToast(`🏅 Badge desbloqueado! Fase "${phases[pi].name}" concluída. ${CHEERS[n - 1]}`);
    } else play('click');
  };

  return (
    <section className="fade-in mx-auto max-w-3xl pt-2">
      <button className="btn-ghost mb-4" onClick={onBack}>← Voltar ao card</button>
      <header className="panel mb-5 p-5">
        <p className="font-display text-xs tracking-[.25em] text-faint">TRILHA DE MISSÕES</p>
        <h1 className="title-glow text-2xl font-black sm:text-3xl">{cls.icon} {cls.name}</h1>
        <p className="mb-3 text-mist">Caminho para se tornar {cls.profession}.</p>
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-gold">Evolução: {count}/{total} missões</span>
          <span className="text-mist">Insígnias: {unlocked}/4</span>
        </div>
        <div className="xp-track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={count} aria-label="Evolução na trilha">
          <div className="xp-fill" style={{ width: `${(count / total) * 100}%` }} />
        </div>
        <p className="mt-3 min-h-6 font-semibold text-ember" role="status" aria-live="polite">{toast}</p>
      </header>

      <ol className="flex flex-col gap-4">
        {phases.map((ph, pi) => {
          const complete = phaseDone(pi);
          return (
            <li key={ph.name} className="panel p-5" style={complete ? { borderColor: '#ffd98a' } : undefined}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xs tracking-[.2em] text-faint">FASE {pi + 1}</p>
                  <h2 className="font-display text-xl font-bold text-gold">{ph.name}</h2>
                </div>
                <span className={`grid h-12 w-12 flex-none place-items-center rounded-full border-2 text-2xl ${complete ? 'unlock border-ember' : 'border-faint opacity-40 grayscale'}`} title={complete ? 'Insígnia desbloqueada' : 'Insígnia bloqueada'} aria-label={complete ? 'Insígnia desbloqueada' : 'Insígnia bloqueada'}>
                  🏅
                </span>
              </div>
              <p className="mb-3 text-mist"><strong className="text-parchment">Objetivo:</strong> {ph.goal}</p>
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-semibold text-parchment">Competências</p>
                  <div className="flex flex-wrap gap-1.5">{ph.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-parchment">Ferramentas</p>
                  <div className="flex flex-wrap gap-1.5">{ph.tools.map((s) => <span key={s} className="chip">{s}</span>)}</div>
                </div>
              </div>
              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-parchment">Missões práticas</legend>
                {ph.missions.map((m, mi) => {
                  const id = `m-${pi}-${mi}`;
                  return (
                    <label key={m} htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-plum">
                      <input id={id} type="checkbox" className="mt-0.5 h-5 w-5 flex-none accent-gold" checked={!!done[`${pi}-${mi}`]} onChange={() => toggle(pi, mi)} />
                      <span className={done[`${pi}-${mi}`] ? 'text-faint line-through' : ''}>{m}</span>
                    </label>
                  );
                })}
              </fieldset>
              <p className="mt-2 text-sm text-faint">✅ <strong>Critério de conclusão:</strong> {ph.done}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-6"><Courses classId={classId} /></div>
      <AdSlot slot={CONFIG.adSlots.trail} />
    </section>
  );
}
