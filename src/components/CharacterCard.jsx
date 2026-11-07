import { forwardRef } from 'react';
import { CLASS_BY_ID } from '../data/classes.js';
import { TRAILS } from '../data/trails.js';

// Usa apenas classes de layout do Tailwind + CSS próprio em hex (compatível com html2canvas).
const CharacterCard = forwardRef(function CharacterCard({ name, result }, ref) {
  const cls = CLASS_BY_ID[result.main];
  const sub = CLASS_BY_ID[result.sub];
  const firstPhase = TRAILS[cls.id][0];

  return (
    <div ref={ref} className="card-frame mx-auto w-full max-w-md">
      <article className="card-inner" aria-label={`Card de personagem de ${name}`}>
        <header className="text-center">
          <p className="font-display text-xs font-bold tracking-[.3em]" style={{ color: '#ffd98a' }}>QUEST CONCLUÍDA!</p>
          <p className="mt-1 font-display text-2xl font-bold" style={{ color: '#f3e7c9' }}>{name}</p>
        </header>

        <div className="emblem my-4 h-28 w-28 text-6xl" style={{ borderColor: cls.color }} aria-hidden="true">{cls.icon}</div>

        <section className="text-center">
          <h2 className="font-display text-2xl font-black" style={{ color: '#e6c27a' }}>{cls.name}</h2>
          {cls.title && <p className="font-display text-sm" style={{ color: '#cfc9ea' }}>{cls.title}</p>}
          <p className="font-semibold" style={{ color: cls.color }}>{cls.profession}</p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: '#cfc9ea' }}>{cls.desc}</p>
          <p className="mt-3 inline-block rounded-full px-3 py-1 text-xs" style={{ border: '1px solid #6b4f1d', color: '#f3e7c9', background: '#221a4a' }}>
            Subclasse: com dom de <strong>{sub.name}</strong> ({sub.profession})
          </p>
        </section>

        <section className="card-section">
          <h3 className="card-h">ATRIBUTOS</h3>
          <ul className="space-y-1.5">
            {result.attributes.map((a) => (
              <li key={a.id} className="grid grid-cols-[8.5rem_1fr_auto] items-center gap-2 text-xs">
                <span style={{ color: '#f3e7c9' }}>{a.icon} {a.name}</span>
                <span className="bar" role="img" aria-label={`${a.name}: ${a.value} de 10`}><i style={{ width: `${a.value * 10}%` }} /></span>
                <span className="flex items-center gap-1">
                  <b style={{ color: '#ffd98a' }}>{a.value}</b>
                  {a.evolving && <span className="badge-evo">Em evolução</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-section">
          <h3 className="card-h">QUALIFICAÇÕES NECESSÁRIAS</h3>
          <ul className="space-y-1 text-xs leading-relaxed" style={{ color: '#e8e4f8' }}>
            {cls.qualifications.map((q) => <li key={q}>📘 {q}</li>)}
          </ul>
        </section>

        <section className="card-section">
          <h3 className="card-h">PODERES DA CLASSE</h3>
          <ul className="space-y-1 text-xs" style={{ color: '#e8e4f8' }}>
            {cls.powers.map((p) => <li key={p}>⚡ {p}</li>)}
          </ul>
        </section>

        <footer className="card-section rounded-xl p-3" style={{ background: '#241b4d', border: '1px solid #6b4f1d' }}>
          <h3 className="card-h !mb-1">PRÓXIMA MISSÃO · {firstPhase.name.toUpperCase()}</h3>
          <p className="text-xs leading-relaxed" style={{ color: '#f3e7c9' }}>🗺️ {cls.firstMission}</p>
        </footer>
      </article>
    </div>
  );
});

export default CharacterCard;
