import { forwardRef } from 'react';

export const FORMATS = {
  vertical: { w: 1080, h: 1920, label: 'Vertical 1080×1920 (Stories, Reels, Shorts)' },
  square: { w: 1080, h: 1080, label: 'Quadrado 1080×1080 (feed)' },
  horizontal: { w: 1200, h: 630, label: 'Horizontal 1200×630 (X, links)' },
};

// Arte de exportação renderizada fora da tela. Somente estilos inline em hex.
const ShareArt = forwardRef(function ShareArt({ format, name, cls, sub, attributes, url }, ref) {
  const { w, h } = FORMATS[format];
  const u = Math.min(w, h) / 1080;
  const horiz = w > h;
  const vert = h > w;
  const top3 = [...attributes].sort((a, b) => b.value - a.value).slice(0, 3);
  const gold = '#e6c27a';

  return (
    <div
      ref={ref}
      style={{
        width: w, height: h, boxSizing: 'border-box', padding: 40 * u, fontFamily: 'Inter, sans-serif', color: '#f1eefc',
        background: 'radial-gradient(circle at 50% 20%, #3a2466 0%, #15122f 55%, #0b0a1f 100%)',
      }}
    >
      <div
        style={{
          height: '100%', boxSizing: 'border-box', border: `${6 * u}px solid ${gold}`, borderRadius: 40 * u,
          display: 'flex', flexDirection: horiz ? 'row' : 'column', alignItems: 'center', justifyContent: 'center',
          gap: (vert ? 50 : 30) * u, padding: 50 * u, textAlign: horiz ? 'left' : 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 * u }}>
          {!horiz && <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 64 * u, color: '#ffd98a', letterSpacing: 4 * u, margin: 0 }}>QUEST CONCLUÍDA!</p>}
          <div
            style={{
              width: (vert ? 340 : 260) * u, height: (vert ? 340 : 260) * u, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: (vert ? 180 : 140) * u, border: `${8 * u}px solid ${cls.color}`, background: 'radial-gradient(circle, #4b2f80, #1a1438)',
            }}
          >
            {cls.icon}
          </div>
        </div>
        <div style={{ maxWidth: horiz ? 620 : 900 * u }}>
          {horiz && <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 30, color: '#ffd98a', margin: '0 0 8px' }}>QUEST CONCLUÍDA!</p>}
          <p style={{ fontSize: (vert ? 48 : 40) * u, margin: 0, color: '#f3e7c9' }}>{name} desbloqueou</p>
          <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: (vert ? 92 : 72) * u, color: gold, margin: `${10 * u}px 0`, lineHeight: 1.1 }}>{cls.name}</p>
          <p style={{ fontSize: (vert ? 46 : 38) * u, fontWeight: 700, color: cls.color, margin: 0 }}>{cls.profession}</p>
          <p style={{ fontSize: (vert ? 36 : 28) * u, color: '#cfc9ea', margin: `${20 * u}px 0`, lineHeight: 1.35 }}>{cls.desc}</p>
          {!horiz && (
            <div style={{ margin: `${30 * u}px auto`, width: 700 * u, textAlign: 'left' }}>
              {top3.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 20 * u, marginBottom: 16 * u, fontSize: 32 * u }}>
                  <span style={{ width: 300 * u, color: '#f3e7c9' }}>{a.name}</span>
                  <span style={{ flex: 1, height: 18 * u, borderRadius: 99, background: '#2a2350', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', width: `${a.value * 10}%`, background: 'linear-gradient(90deg, #b8892f, #ffd98a)' }} />
                  </span>
                  <b style={{ color: '#ffd98a' }}>{a.value}</b>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: (vert ? 30 : 24) * u, color: '#a9a2d0', margin: 0 }}>Subclasse: {sub.name}</p>
          <p style={{ marginTop: 36 * u, fontSize: (vert ? 40 : 30) * u, fontWeight: 700, color: '#1b1230', background: gold, borderRadius: 20 * u, padding: `${18 * u}px ${30 * u}px`, display: 'inline-block' }}>
            Descubra sua classe na Quest de Carreira Tech
          </p>
          <p style={{ fontSize: (vert ? 28 : 22) * u, color: '#a9a2d0', marginTop: 16 * u, wordBreak: 'break-all' }}>{url}</p>
        </div>
      </div>
    </div>
  );
});

export default ShareArt;
