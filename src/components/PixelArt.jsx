import { useMemo } from 'react';
import { heroDataUrl, landscapeDataUrl } from '../lib/pixelArt.js';

export function Background({ dim }) {
  const url = useMemo(() => landscapeDataUrl(), []);
  return (
    <div className="scene" aria-hidden="true" style={{ backgroundImage: `url(${url})` }}>
      <div className="scene-shade" style={{ opacity: dim ? 1 : 0.45 }} />
    </div>
  );
}

export function PixelHero({ avatar, robe, size = 96, alt = 'Seu personagem em pixel art', className = '' }) {
  const url = useMemo(() => heroDataUrl({ ...avatar, robe }), [avatar?.skin, avatar?.hair, avatar?.hairColor, robe]);
  return <img src={url} alt={alt} width={size} height={size * 1.5} className={`pixelated ${className}`} />;
}
