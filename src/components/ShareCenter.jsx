import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import ShareArt, { FORMATS } from './ShareArt.jsx';
import { copy, downloadBlob, intents, nativeShare, nodeToBlob, questUrl } from '../lib/share.js';
import { SHARE_TEMPLATES, fillTemplate } from '../data/shareTemplates.js';
import { load, save } from '../lib/storage.js';
import { play } from '../lib/sound.js';

const Ico = {
  ig: (
    <span className="share-icon" style={{ background: 'linear-gradient(45deg,#f9a825,#e1306c,#833ab4)' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="#fff" /></svg>
    </span>
  ),
  x: <span className="share-icon text-lg font-black" style={{ background: '#000', border: '1px solid #444' }}>𝕏</span>,
  th: <span className="share-icon text-xl font-bold" style={{ background: '#101010', border: '1px solid #444' }}>@</span>,
  li: <span className="share-icon text-base font-black" style={{ background: '#0a66c2' }}>in</span>,
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
  dl: <span className="share-icon" style={{ background: '#b8892f' }}>⬇️</span>,
  cp: <span className="share-icon" style={{ background: '#4b2f80' }}>📋</span>,
};

export default function ShareCenter({ name, cls, sub, attributes, avatar, cardRef }) {
  const url = questUrl();
  const ctx = { name, cls, sub, url };
  const storeKey = `qct_share_${cls.id}`;
  const [tpl, setTpl] = useState('animado');
  const [message, setMessage] = useState(() => load(storeKey, null) || fillTemplate(SHARE_TEMPLATES[0].text, ctx));
  const [art, setArt] = useState(null);
  const artRef = useRef();
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [ytOpen, setYtOpen] = useState(false);
  const slug = cls.id;
  const ytTitle = `Descobri minha profissão na tecnologia: ${cls.profession} ⚔️ #Shorts`;

  const edit = (v) => { setMessage(v); save(storeKey, v); };
  const pickTemplate = (id) => { setTpl(id); edit(fillTemplate(SHARE_TEMPLATES.find((t) => t.id === id).text, ctx)); };

  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    setMsg('Preparando…');
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

  // A arte é montada só na hora de exportar e desmontada em seguida (evita peso na página).
  const image = async (format) => {
    flushSync(() => setArt(format));
    try {
      return await nodeToBlob(artRef.current, { scale: 1, width: FORMATS[format].w, height: FORMATS[format].h });
    } finally {
      setArt(null);
    }
  };
  const file = (format) => `quest-${slug}-${format}.png`;
  const download = async (format) => { downloadBlob(await image(format), file(format)); return 'Imagem baixada!'; };

  // Muitos apps ignoram o texto quando há imagem, então o texto também vai para a área de transferência.
  const shareImage = async (format, hint) => {
    const blob = await image(format);
    await copy(message);
    const r = await nativeShare({ blob, filename: file(format), text: message });
    if (r === 'shared') return 'Compartilhado! 🎉 O texto também foi copiado: cole na legenda se o app não preencher.';
    if (r === 'cancelled') return '';
    downloadBlob(blob, file(format));
    return `Imagem baixada e texto copiado. ${hint}`;
  };

  const actions = [
    { icon: Ico.wa, label: 'WhatsApp', sub: 'Contatos ou grupos', do: async () => {
      if (navigator.share && navigator.maxTouchPoints > 0) return shareImage('square', 'Abra o WhatsApp e envie com a imagem.');
      window.open(intents.whatsapp(message), '_blank', 'noopener');
      return 'Abrimos o WhatsApp com o seu texto.';
    } },
    { icon: Ico.ig, label: 'Instagram Stories', sub: 'Imagem vertical + texto copiado', do: () => shareImage('vertical', 'Abra o Instagram › Story, escolha a imagem e cole o texto.') },
    { icon: Ico.ig, label: 'Instagram Reels / Feed', sub: 'Arte vertical + legenda copiada', do: async () => { await download('vertical'); await copy(message); return 'Arte baixada e legenda copiada. Crie o post e cole a legenda.'; } },
    { icon: Ico.ig, label: 'Instagram Direct', sub: 'Imagem + texto', do: () => shareImage('square', 'Abra o Direct, envie a imagem e cole o texto.') },
    { icon: Ico.li, label: 'LinkedIn', sub: 'Post com o seu texto', do: async () => { await copy(message); window.open(intents.linkedin(message), '_blank', 'noopener'); return 'Abrimos o LinkedIn com o texto (também copiado, caso precise colar).'; } },
    { icon: Ico.x, label: 'X (Twitter)', sub: 'Post com o seu texto', do: async () => { window.open(intents.x(message), '_blank', 'noopener'); return 'Abrimos o X em uma nova aba.'; } },
    { icon: Ico.th, label: 'Threads', sub: 'Post com o seu texto', do: async () => { window.open(intents.threads(message), '_blank', 'noopener'); return 'Abrimos o Threads em uma nova aba.'; } },
    { icon: Ico.yt, label: 'YouTube Shorts', sub: 'Arte vertical + título e descrição', do: async () => { await download('vertical'); setYtOpen(true); return 'Arte baixada! Use o título e a descrição abaixo no seu Short.'; } },
  ];

  return (
    <section className="panel p-5" aria-labelledby="share-title">
      <h2 id="share-title" className="title-glow mb-1 text-2xl font-bold">Compartilhe sua conquista!</h2>
      <p className="mb-3 text-sm text-mist">Escolha um estilo e edite à vontade: o mesmo texto vai para todas as redes.</p>

      <div className="mb-2 flex flex-wrap gap-1.5" role="group" aria-label="Estilo do texto">
        {SHARE_TEMPLATES.map((t) => (
          <button key={t.id} className="chip cursor-pointer" aria-pressed={tpl === t.id} style={tpl === t.id ? { borderColor: '#ffd98a', background: 'rgba(230,194,122,.3)' } : undefined} onClick={() => pickTemplate(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <label htmlFor="share-text" className="sr-only">Texto de compartilhamento</label>
      <textarea id="share-text" rows={6} value={message} onChange={(e) => edit(e.target.value)} className="w-full rounded-xl border border-gold-deep bg-night p-3 text-sm text-parchment focus:border-ember focus:outline-none" />
      <p className={`mb-4 text-right text-xs ${message.length > 280 ? 'text-ember' : 'text-faint'}`}>
        {message.length} caracteres{message.length > 280 ? ' · no X, use o estilo "Curto" (limite de 280)' : ''}
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {actions.map((a) => (
          <button key={a.label} className="share-btn" disabled={busy} onClick={() => run(a.do)}>
            {a.icon}<span>{a.label}<small>{a.sub}</small></span>
          </button>
        ))}
      </div>

      <h3 className="mb-2 mt-5 font-display font-bold text-gold">Baixar e copiar</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <button className="share-btn" disabled={busy} onClick={() => run(async () => { downloadBlob(await nodeToBlob(cardRef.current), `card-${slug}.png`); return 'Card baixado!'; })}>
          {Ico.dl}<span>Baixar card (PNG)<small>Card completo do personagem</small></span>
        </button>
        {Object.entries(FORMATS).map(([k, f]) => (
          <button key={k} className="share-btn" disabled={busy} onClick={() => run(() => download(k))}>
            {Ico.dl}<span>Baixar arte<small>{f.label}</small></span>
          </button>
        ))}
        <button className="share-btn" onClick={() => run(async () => ((await copy(message)) ? 'Texto copiado!' : 'Não foi possível copiar.'))}>
          {Ico.cp}<span>Copiar texto<small>Sua mensagem com o link</small></span>
        </button>
        <button className="share-btn" onClick={() => run(async () => ((await copy(url)) ? 'Link copiado!' : 'Não foi possível copiar.'))}>
          {Ico.cp}<span>Copiar link<small>Endereço da Quest</small></span>
        </button>
      </div>

      {ytOpen && (
        <div className="mt-4 rounded-xl border border-gold-deep p-3 text-sm">
          <p className="font-semibold text-gold">Título sugerido</p>
          <p className="mb-2 text-mist">{ytTitle}</p>
          <p className="font-semibold text-gold">Descrição sugerida</p>
          <p className="mb-2 whitespace-pre-line text-mist">{message}</p>
          <button className="btn-ghost !py-1.5 text-sm" onClick={() => run(async () => { await copy(`${ytTitle}\n\n${message}`); return 'Título e descrição copiados!'; })}>Copiar título e descrição</button>
          <p className="mt-2 text-xs text-faint">A publicação é feita por você no app do YouTube ou no YouTube Studio.</p>
        </div>
      )}

      <p className="mt-4 min-h-6 text-sm text-ember" role="status" aria-live="polite">{msg}</p>

      {art && (
        <div aria-hidden="true" style={{ position: 'absolute', left: -10000, top: 0, pointerEvents: 'none' }}>
          <ShareArt ref={artRef} format={art} name={name} cls={cls} sub={sub} attributes={attributes} avatar={avatar} url={url} />
        </div>
      )}
    </section>
  );
}
