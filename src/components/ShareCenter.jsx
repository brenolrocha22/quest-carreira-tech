import { useRef, useState } from 'react';
import ShareArt, { FORMATS } from './ShareArt.jsx';
import { copy, downloadBlob, intents, nativeShare, nodeToBlob, questUrl, shareText } from '../lib/share.js';
import { play } from '../lib/sound.js';

const Ico = {
  ig: (
    <span className="share-icon" style={{ background: 'linear-gradient(45deg,#f9a825,#e1306c,#833ab4)' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="#fff" /></svg>
    </span>
  ),
  x: <span className="share-icon text-lg font-black" style={{ background: '#000', border: '1px solid #444' }}>𝕏</span>,
  th: <span className="share-icon text-xl font-bold" style={{ background: '#101010', border: '1px solid #444' }}>@</span>,
  yt: (
    <span className="share-icon" style={{ background: '#ff0000' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
    </span>
  ),
  wa: (
    <span className="share-icon" style={{ background: '#25d366' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" /><path d="M9 9c0 3 3 6 6 6" /></svg>
    </span>
  ),
  li: <span className="share-icon text-base font-black" style={{ background: '#0a66c2' }}>in</span>,
  dl: <span className="share-icon" style={{ background: '#b8892f' }}>⬇️</span>,
  cp: <span className="share-icon" style={{ background: '#4b2f80' }}>📋</span>,
};

export default function ShareCenter({ name, cls, sub, attributes, cardRef }) {
  const refs = { vertical: useRef(), square: useRef(), horizontal: useRef() };
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [ytOpen, setYtOpen] = useState(false);
  const url = questUrl();
  const text = shareText(name, cls);
  const short = shareText(name, cls, true);
  const slug = cls.id;
  const ytTitle = `Descobri minha classe na tecnologia: ${cls.name} (${cls.profession}) ⚔️ #Shorts`;
  const ytDesc = `${text} ${url}\n\n#carreiratech #tecnologia #${slug}`;

  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    setMsg('Preparando sua arte mágica…');
    try {
      setMsg((await fn()) || '');
      play('click');
    } catch (e) {
      console.error(e);
      setMsg('Não foi possível concluir. Tente baixar a imagem e compartilhar manualmente.');
    } finally {
      setBusy(false);
    }
  };

  const image = (format) => nodeToBlob(refs[format].current, { scale: 1, width: FORMATS[format].w, height: FORMATS[format].h });
  const file = (format) => `quest-${slug}-${format}.png`;
  const download = async (format) => {
    downloadBlob(await image(format), file(format));
    return 'Imagem baixada!';
  };

  // Tenta compartilhamento nativo com imagem; se indisponível, baixa a imagem e copia o texto.
  const shareImage = async (format, hint) => {
    const blob = await image(format);
    const r = await nativeShare({ blob, filename: file(format), text: `${text} ${url}` });
    if (r === 'shared') return 'Compartilhado! 🎉';
    if (r === 'cancelled') return '';
    downloadBlob(blob, file(format));
    await copy(`${text} ${url}`);
    return `Imagem baixada e texto copiado. ${hint}`;
  };

  const actions = [
    { icon: Ico.ig, label: 'Instagram Stories', sub: 'Imagem vertical 1080×1920', do: () => shareImage('vertical', 'Abra o Instagram › Story e selecione a imagem.') },
    { icon: Ico.ig, label: 'Instagram Reels', sub: 'Baixar arte vertical + legenda copiada', do: async () => { await download('vertical'); await copy(`${text} ${url}`); return 'Arte vertical baixada e legenda copiada. Crie um Reel no Instagram com essa imagem.'; } },
    { icon: Ico.ig, label: 'Instagram Direct', sub: 'Enviar imagem e link', do: () => shareImage('square', 'Abra o Direct e envie a imagem para quem quiser.') },
    { icon: Ico.x, label: 'X (Twitter)', sub: 'Post com texto e link', do: async () => { window.open(intents.x(short, url), '_blank', 'noopener'); return 'Abrimos o X em uma nova aba.'; } },
    { icon: Ico.th, label: 'Threads', sub: 'Post com texto e link', do: async () => { window.open(intents.threads(short, url), '_blank', 'noopener'); return 'Abrimos o Threads em uma nova aba. Para incluir a imagem, use "Baixar imagem".'; } },
    { icon: Ico.yt, label: 'YouTube Shorts', sub: 'Arte vertical + título e descrição', do: async () => { await download('vertical'); setYtOpen(true); return 'Arte baixada! Use o título e a descrição abaixo ao publicar seu Short.'; } },
    { icon: Ico.li, label: 'LinkedIn', sub: 'Link + texto copiado para colar', do: async () => { await copy(`${text} ${url}`); window.open(intents.linkedin(url), '_blank', 'noopener'); return 'Abrimos o LinkedIn. O texto foi copiado: é só colar no post. Para incluir a imagem, use "Baixar card".'; } },
    { icon: Ico.wa, label: 'WhatsApp', sub: 'Contatos ou grupos', do: async () => {
      if (navigator.share) {
        const r = await nativeShare({ blob: await image('square'), filename: file('square'), text: `${text} ${url}` });
        if (r === 'shared') return 'Compartilhado! 🎉';
        if (r === 'cancelled') return '';
      }
      window.open(intents.whatsapp(text, url), '_blank', 'noopener');
      return 'Abrimos o WhatsApp. Escolha o contato ou grupo.';
    } },
  ];

  return (
    <section className="panel p-5" aria-labelledby="share-title">
      <h2 id="share-title" className="title-glow mb-1 text-2xl font-bold">Compartilhe sua conquista!</h2>
      <p className="mb-4 text-sm text-mist">Mostre sua classe e convide outras pessoas a descobrirem a delas.</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {actions.map((a) => (
          <button key={a.label} className="share-btn" disabled={busy} onClick={() => run(a.do)}>
            {a.icon}
            <span>{a.label}<small>{a.sub}</small></span>
          </button>
        ))}
      </div>

      <h3 className="mb-2 mt-5 font-display font-bold text-gold">Alternativas universais</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <button className="share-btn" disabled={busy} onClick={() => run(async () => { downloadBlob(await nodeToBlob(cardRef.current), `card-${slug}.png`); return 'Card baixado!'; })}>
          {Ico.dl}<span>Baixar card (PNG)<small>Card completo do personagem</small></span>
        </button>
        {Object.entries(FORMATS).map(([k, f]) => (
          <button key={k} className="share-btn" disabled={busy} onClick={() => run(() => download(k))}>
            {Ico.dl}<span>Baixar arte<small>{f.label}</small></span>
          </button>
        ))}
        <button className="share-btn" onClick={() => run(async () => (await copy(`${text} ${url}`)) ? 'Texto copiado!' : 'Não foi possível copiar.')}>
          {Ico.cp}<span>Copiar texto<small>Mensagem pronta com link</small></span>
        </button>
        <button className="share-btn" onClick={() => run(async () => (await copy(url)) ? 'Link copiado!' : 'Não foi possível copiar.')}>
          {Ico.cp}<span>Copiar link<small>Endereço da Quest</small></span>
        </button>
      </div>

      {ytOpen && (
        <div className="mt-4 rounded-xl border border-gold-deep p-3 text-sm">
          <p className="font-semibold text-gold">Título sugerido</p>
          <p className="mb-2 text-mist">{ytTitle}</p>
          <p className="font-semibold text-gold">Descrição sugerida</p>
          <p className="mb-2 whitespace-pre-line text-mist">{ytDesc}</p>
          <button className="btn-ghost !py-1.5 text-sm" onClick={() => run(async () => { await copy(`${ytTitle}\n\n${ytDesc}`); return 'Título e descrição copiados!'; })}>Copiar título e descrição</button>
          <p className="mt-2 text-xs text-faint">A publicação no YouTube é feita por você no app ou no YouTube Studio.</p>
        </div>
      )}

      <p className="mt-4 min-h-6 text-sm text-ember" role="status" aria-live="polite">{msg}</p>

      {/* Artes de exportação fora da área visível */}
      <div aria-hidden="true" style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}>
        {Object.keys(FORMATS).map((k) => (
          <ShareArt key={k} ref={refs[k]} format={k} name={name} cls={cls} sub={sub} attributes={attributes} url={url} />
        ))}
      </div>
    </section>
  );
}
