import { useState } from 'react';
import { play } from '../lib/sound.js';
import { PixelHero } from './PixelArt.jsx';
import { AdSlot } from './Legal.jsx';
import { CONFIG } from '../lib/backend.js';
import { SKINS, HAIR_COLORS } from '../lib/pixelArt.js';

// Elenco diverso de heróis na entrada da taverna
const PARTY = [
  { skin: SKINS[5].color, hair: 'cacheado', hairColor: HAIR_COLORS[0], robe: '#a78bfa' },
  { skin: SKINS[1].color, hair: 'longo', hairColor: HAIR_COLORS[4], robe: '#38bdf8' },
  { skin: SKINS[3].color, hair: 'lenco', hairColor: '#2f9e8f', robe: '#f472b6' },
  { skin: SKINS[4].color, hair: 'trancas', hairColor: HAIR_COLORS[0], robe: '#fb923c' },
  { skin: SKINS[2].color, hair: 'coque', hairColor: HAIR_COLORS[1], robe: '#34d399' },
  { skin: SKINS[0].color, hair: 'curto', hairColor: HAIR_COLORS[3], robe: '#facc15' },
];

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
      <div className="mb-4 flex items-end justify-center gap-1 sm:gap-3" aria-hidden="true">
        {PARTY.map(({ robe, ...av }, i) => (
          <PixelHero key={i} avatar={av} robe={robe} size={i % 2 ? 44 : 52} alt="" className="hero-bob" />
        ))}
      </div>
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
          {error || '14 desafios · cerca de 4 minutos'}
        </p>
        <button type="submit" className="btn-rune mt-4 w-full text-lg">⚔️ Iniciar Quest</button>
        {hasResult && (
          <button type="button" className="btn-ghost mt-3 w-full" onClick={onContinue}>
            Ver meu último card
          </button>
        )}
      </form>
      <AdSlot slot={CONFIG.adSlots.home} />
      <p className="mt-6 max-w-md text-sm text-mist">
        Ao final, você descobre a carreira em tecnologia que mais combina com você, com uma trilha de estudos e cursos gratuitos para começar.
      </p>
    </section>
  );
}
