import { COURSES, PROVIDERS } from '../data/courses.js';
import { contactHref } from './Legal.jsx';

export default function Courses({ classId }) {
  return (
    <section className="panel p-5" aria-labelledby="courses-title">
      <h2 id="courses-title" className="title-glow mb-1 text-2xl font-bold">Cursos gratuitos para sua trilha</h2>
      <p className="mb-4 text-sm text-mist">Plataformas com conteúdo gratuito ligado à sua profissão. Confira as condições em cada site.</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {COURSES[classId].map(([pid, topic]) => {
          const p = PROVIDERS[pid];
          return (
            <li key={pid}>
              <a className="share-btn h-full" href={p.url} target="_blank" rel="noopener noreferrer">
                <span className="share-icon" style={{ background: '#2a6f5f' }} aria-hidden="true">🎓</span>
                <span>{p.name}<small>{topic} · {p.note}</small></span>
              </a>
            </li>
          );
        })}
        <li className="sm:col-span-2">
          <a className="share-btn" href={contactHref()} target="_blank" rel="noopener noreferrer" style={{ borderStyle: 'dashed' }}>
            <span className="share-icon" style={{ background: '#b8892f' }} aria-hidden="true">🤝</span>
            <span>Sua escola aqui<small>Espaço para parceiros de educação em tecnologia. Fale com a gente.</small></span>
          </a>
        </li>
      </ul>
    </section>
  );
}
