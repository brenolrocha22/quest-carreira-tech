import { forwardRef, useMemo, useState } from 'react';
import { CLASS_BY_ID } from '../data/classes.js';
import { TRAILS } from '../data/trails.js';
import { PixelHero } from './PixelArt.jsx';
import { landscapeDataUrl } from '../lib/pixelArt.js';
import { artCandidates } from '../lib/art.js';

// Card colecionável. Apenas cores hex/rgba (compatível com a exportação via html2canvas).
const CharacterCard = forwardRef(function CharacterCard({ name, result, avatar, persona }, ref) {
  const cls = CLASS_BY_ID[result.main];
  const sub = CLASS_BY_ID[result.sub];
  const phase = TRAILS[cls.id][0];
  const scene = useMemo(() => landscapeDataUrl(), []);
  const attrs = [...result.attributes].sort((a, b) => b.value - a.value);
  const arts = artCandidates(cls.id, persona);
  const [artIdx, setArtIdx] = useState(0);
  const noArt = artIdx >= arts.length;
  const art = arts[artIdx];

  return (
    <div ref={ref} className="qc-frame mx-auto w-full max-w-4xl">
      <article className="qc-inner" aria-label={`Card de ${name}: ${cls.name}, ${cls.profession}`}>
        {['tl', 'tr', 'bl', 'br'].map((p) => <span key={p} className={`qc-gem qc-${p}`} aria-hidden="true" />)}

        <span className="qc-rail qc-rail-l" aria-hidden="true" />
        <span className="qc-rail qc-rail-r" aria-hidden="true" />
        <div className="qc-banner"><h2 className="qc-title">QUEST CONCLUÍDA!</h2></div>
        <p className="qc-player">Jogador: <b>{name}</b></p>

        {!noArt ? (
          <div className="qc-illus-wrap">
            <img key={art} src={art} alt={`Ilustração da classe ${cls.name}`} className="qc-illus" onError={() => setArtIdx((i) => i + 1)} />
          </div>
        ) : (
        <div className="qc-art" style={{ backgroundImage: `linear-gradient(180deg, rgba(20,14,50,.35), rgba(14,12,36,.85)), url(${scene})` }}>
          <span className="qc-ring" style={{ borderColor: cls.color, boxShadow: `0 0 40px ${cls.color}` }} aria-hidden="true" />
          <PixelHero avatar={avatar} robe={cls.color} size={110} alt={`Personagem de ${name}`} className="qc-hero" />
          <span className="qc-companion" style={{ textShadow: `0 0 30px ${cls.color}` }} aria-hidden="true">{cls.icon}</span>
        </div>
        )}

        <div className="qc-box qc-box-main text-center">
          <p><span style={{ color: '#e6c27a' }}>Classe desbloqueada:</span> <b className="uppercase">{cls.name}</b>{cls.title ? ` — ${cls.title}` : ''}</p>
          <p><span style={{ color: '#5ff5e8' }}>Subclasse:</span> com dom de {sub.name} ({sub.gift})</p>
        </div>

        <div className="qc-box flex items-center justify-center gap-3 text-center sm:text-left">
          <span className="qc-emblem" style={{ borderColor: cls.color }} aria-hidden="true">{cls.icon}</span>
          <p>
            <span style={{ color: '#e6c27a' }}>Profissão no mundo real:</span> <b style={{ color: '#ffffff' }}>{cls.profession}</b>
            <br /><span style={{ color: '#d6d0f0' }}>{cls.desc}</span>
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <section className="qc-col">
            <h3 className="qc-h">ATRIBUTOS</h3>
            <ul className="space-y-1.5">
              {attrs.map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  <span className="qc-ico" aria-hidden="true">{a.icon}</span>
                  <span className="flex-1 leading-tight">
                    {a.name}
                    {a.evolving && <span className="block text-[11px]" style={{ color: '#5ff5e8' }}>(em evolução)</span>}
                  </span>
                  <b className="qc-num" aria-label={`${a.value} de 10`}>{a.value}</b>
                </li>
              ))}
            </ul>
          </section>
          <section className="qc-col">
            <h3 className="qc-h">QUALIFICAÇÕES NECESSÁRIAS</h3>
            <ul className="space-y-2">
              {cls.qualifications.map((q) => {
                const [main, extra] = q.split(' (');
                return (
                  <li key={q}>• <b>{main}</b>{extra && <span className="block pl-3 text-[11px]" style={{ color: '#b9b2dc' }}>({extra}</span>}</li>
                );
              })}
            </ul>
          </section>
          <section className="qc-col">
            <h3 className="qc-h">PODERES DA CLASSE (O QUE FAZ)</h3>
            <ul className="space-y-2">{cls.powers.map((p) => <li key={p}>• {p}</li>)}</ul>
          </section>
        </div>

        <footer className="qc-footer">
          <span className="qc-compass" aria-hidden="true">🧭</span>
          <p className="qc-next">Próxima missão: Fase 1 — {phase.name}</p>
          <p className="text-xs" style={{ color: '#f3e7c9' }}>{cls.firstMission}</p>
        </footer>
      </article>
    </div>
  );
});

export default CharacterCard;
