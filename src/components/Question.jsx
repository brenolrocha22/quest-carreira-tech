import { useEffect, useRef } from 'react';

const RUNES = ['I', 'II', 'III', 'IV'];

export default function Question({ question, number, total, selected, onSelect }) {
  const headingRef = useRef();
  useEffect(() => headingRef.current?.focus(), [question.id]);

  // Atalhos de teclado: teclas 1 a 4
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= question.options.length) onSelect(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [question, onSelect]);

  return (
    <article className="panel slide-in p-5 sm:p-7">
      <p className="mb-1 font-display text-xs tracking-[.25em] text-faint">
        CAPÍTULO {number} DE {total} · {question.chapter.toUpperCase()}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="mb-5 font-display text-xl font-bold leading-snug text-parchment outline-none sm:text-2xl">
        {question.text}
      </h2>
      <div className="flex flex-col gap-3" role="group" aria-label="Alternativas (atalhos: teclas 1 a 4)">
        {question.options.map((opt, i) => (
          <button key={i} className="option flex items-center gap-4" aria-pressed={selected === i} onClick={() => onSelect(i)}>
            <span className="rune-key" aria-hidden="true"><span>{RUNES[i]}</span></span>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>
    </article>
  );
}
