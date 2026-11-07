import { useState } from 'react';
import { play } from '../lib/sound.js';

export default function Home({ initialName, hasResult, onStart, onContinue }) {
  const [name, setName] = useState(initialName || '');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const clean = name.trim().replace(/\s+/g, ' ');
    if (clean.length < 2) return setError('Diga seu nome de aventureiro(a) com pelo menos 2 letras.');
    play('next');
    onStart(clean);
  };

  return (
    <section className="fade-in mx-auto flex max-w-xl flex-col items-center pt-6 text-center sm:pt-14">
      <div className="emblem mb-6 h-24 w-24 text-5xl" aria-hidden="true">🍺</div>
      <p className="mb-2 font-display text-sm tracking-[.3em] text-faint">A TAVERNA DO DRAGÃO DIGITAL</p>
      <h1 className="title-glow mb-4 text-4xl font-black leading-tight sm:text-6xl">Quest de Carreira Tech</h1>
      <p className="mb-8 text-lg text-mist">
        Toda jornada em tecnologia começa com uma escolha. <strong className="text-parchment">Descubra sua classe.</strong>
      </p>

      <form onSubmit={submit} className="panel w-full p-6 text-left" noValidate>
        <label htmlFor="hero" className="mb-2 block font-display font-semibold text-gold">
          Qual é o seu nome, aventureiro(a)?
        </label>
        <input
          id="hero"
          value={name}
          maxLength={30}
          autoComplete="given-name"
          onChange={(e) => { setName(e.target.value); setError(''); }}
          aria-invalid={!!error}
          aria-describedby="hero-help"
          placeholder="Ex.: Ana, a Destemida"
          className="w-full rounded-xl border border-gold-deep bg-night px-4 py-3 text-lg text-parchment placeholder:text-faint focus:border-ember focus:outline-none"
        />
        <p id="hero-help" className={`mt-2 min-h-5 text-sm ${error ? 'text-ember' : 'text-faint'}`} role={error ? 'alert' : undefined}>
          {error || '14 desafios · cerca de 4 minutos · sem cadastro'}
        </p>
        <button type="submit" className="btn-rune mt-4 w-full text-lg">⚔️ Iniciar Quest</button>
        {hasResult && (
          <button type="button" className="btn-ghost mt-3 w-full" onClick={onContinue}>
            Ver meu último card
          </button>
        )}
      </form>
      <p className="mt-6 max-w-md text-sm text-faint">
        Ao final você recebe um card colecionável com sua classe, a profissão real correspondente e uma trilha de missões para começar a aprender.
      </p>
    </section>
  );
}
