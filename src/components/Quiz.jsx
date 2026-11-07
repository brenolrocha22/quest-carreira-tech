import { useEffect, useRef, useState } from 'react';
import Question from './Question.jsx';
import { QUESTIONS } from '../data/questions.js';
import { play } from '../lib/sound.js';

export default function Quiz({ answers, onChange, onFinish, onExit }) {
  const total = QUESTIONS.length;
  const [index, setIndex] = useState(() => Math.min(answers.filter((a) => a != null).length, total - 1));
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const answered = answers.filter((a) => a != null).length;
  const q = QUESTIONS[index];

  const goNext = (list) => {
    if (index < total - 1) setIndex(index + 1);
    else if (list.length === total && list.every((a) => a != null)) onFinish();
  };

  const choose = (opt) => {
    const next = [...answers];
    next[index] = opt;
    onChange(next);
    play('next');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => goNext(next), 380);
  };

  const back = () => {
    clearTimeout(timer.current);
    play('click');
    index === 0 ? onExit() : setIndex(index - 1);
  };

  return (
    <section className="mx-auto max-w-2xl pt-2">
      <div className="mb-5">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-display font-bold text-gold">Nível {index + 1} de {total}</span>
          <span className="text-mist">XP {answered * 100} / {total * 100}</span>
        </div>
        <div className="xp-track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered} aria-label="Progresso da quest">
          <div className="xp-fill" style={{ width: `${(answered / total) * 100}%` }} />
        </div>
      </div>

      <Question key={q.id} question={q} number={index + 1} total={total} selected={answers[index]} onSelect={choose} />

      <div className="mt-5 flex justify-between gap-3">
        <button className="btn-ghost" onClick={back}>← {index === 0 ? 'Taverna' : 'Voltar'}</button>
        {answers[index] != null && (
          <button className="btn-ghost" onClick={() => goNext(answers)}>
            {index === total - 1 ? 'Revelar classe ✨' : 'Avançar →'}
          </button>
        )}
      </div>
    </section>
  );
}
