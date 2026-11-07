// Gerador de pixel art: heróis personalizáveis e cenário do vilarejo (tudo original, gerado em canvas).

export const SKINS = [
  { id: 'clara', label: 'Clara', color: '#f6d3b3' },
  { id: 'media-clara', label: 'Média clara', color: '#e3ad84' },
  { id: 'morena', label: 'Morena', color: '#c48a5c' },
  { id: 'parda', label: 'Parda', color: '#9c6640' },
  { id: 'negra', label: 'Negra', color: '#6b4027' },
  { id: 'retinta', label: 'Retinta', color: '#3f2416' },
];

export const HAIR_STYLES = [
  { id: 'curto', label: 'Curto' },
  { id: 'longo', label: 'Longo liso' },
  { id: 'cacheado', label: 'Crespo / Black power' },
  { id: 'trancas', label: 'Tranças' },
  { id: 'coque', label: 'Coque' },
  { id: 'lenco', label: 'Lenço / Hijab' },
  { id: 'raspado', label: 'Raspado' },
];

export const HAIR_COLORS = ['#1b1210', '#4a2c1a', '#8a5a2b', '#e0b85c', '#b4472f', '#c9c3d9', '#5b4bd6', '#2f9e8f'];

const BODY = [
  '................',
  '................',
  '.....SSSSSS.....',
  '....SSSSSSSS....',
  '...SSSSSSSSSS...',
  '...SSWESSWESS...',
  '...SSEESSEESS...',
  '...sSSSSSSSSs...',
  '....sSSmmSSs....',
  '.....ssssss.....',
  '....GRRRRRRG....',
  '...RRRRGGRRRR...',
  '..SRRRRGGRRRRS..',
  '..SRRRRGGRRRRS..',
  '..SrRRRGGRRRrS..',
  '...rRBBBBBBRr...',
  '...RRRRGGRRRR...',
  '..rRRRRGGRRRRr..',
  '..rRRRRGGRRRRr..',
  '..rRRRRRRRRRRr..',
  '..GGGGGGGGGGGG..',
  '....BBB..BBB....',
  '...BBBB..BBBB...',
  '................',
];

const TOP = ['................', '.....HHHHHH.....', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHhHHHHhHH...'];
const rep = (row, n) => Array(n).fill(row);
const HAIR = {
  curto: [...TOP, '...H........H...'],
  longo: [...TOP, ...rep('..HH........HH..', 8)],
  cacheado: ['....HHHHHHHH....', '..HHHHHHHHHHHH..', '.HHHHHHHHHHHHHH.', '.HHHHHHHHHHHHHH.', '.HHHhHHhHHhHHHH.', '.HH..........HH.', '.HH..........HH.', '..H..........H..'],
  trancas: [...TOP, ...Array.from({ length: 12 }, (_, i) => (i % 2 ? '..h..........h..' : '..H..........H..'))],
  coque: ['......HHHH......', ...TOP.slice(1), '...H........H...'],
  lenco: ['................', '.....HHHHHH.....', '....HHHHHHHH....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '..HH........HH..', '..HH........HH..', '..HH........HH..', '..HHH......HHH..', '...HHHH..HHHH...', '...HHHHHHHHHH...'],
  raspado: ['................', '................', '.....hhhhhh.....', '....h......h....'],
};

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.min(255, Math.round(v * f)));
  return `rgb(${c.join(',')})`;
}

/** Retorna um PNG (dataURL) já ampliado, para não borrar em html2canvas. */
export function heroDataUrl({ skin = SKINS[2].color, hair = 'curto', hairColor = HAIR_COLORS[0], robe = '#6b5bd6' } = {}, scale = 12) {
  const grid = BODY.map((r) => r.split(''));
  (HAIR[hair] || []).forEach((row, y) => row.split('').forEach((ch, x) => { if (ch !== '.') grid[y][x] = ch; }));
  const pal = {
    S: skin, s: shade(skin, 0.82), m: shade(skin, 0.6), E: '#1a1020', W: '#ffffff',
    R: robe, r: shade(robe, 0.62), G: '#e6c27a', B: '#3b2a1a', H: hairColor, h: shade(hairColor, 0.7),
  };
  const c = document.createElement('canvas');
  c.width = 16 * scale;
  c.height = 24 * scale;
  const g = c.getContext('2d');
  const filled = (x, y) => grid[y]?.[x] && grid[y][x] !== '.';
  for (let y = 0; y < 24; y++) {
    for (let x = 0; x < 16; x++) {
      let col = pal[grid[y][x]];
      if (!col && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) col = '#120a1f';
      if (col) { g.fillStyle = col; g.fillRect(x * scale, y * scale, scale, scale); }
    }
  }
  return c.toDataURL('image/png');
}

// Gerador pseudoaleatório determinístico
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** Vilarejo pixelado ao amanhecer: casa na colina, campos, trilha e toques tecnológicos. */
let landscapeCache;
export const landscapeDataUrl = () => (landscapeCache ||= drawLandscape());

function drawLandscape(W = 384, H = 216) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const img = g.createImageData(W, H);
  const d = img.data;
  const rand = rng(42);
  const px = (x, y, col) => {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const [r, gg, b] = typeof col === 'string' ? hex(col) : col;
    const i = (y * W + x) * 4;
    d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255;
  };
  const dith = (x, y) => BAYER[(y & 3) * 4 + (x & 3)] / 16;
  const circle = (cx, cy, r, col, yMax = H) => {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r && cy + y < yMax) px(cx + x, cy + y, col);
  };
  const rect = (x0, y0, w, h, col) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) px(x0 + x, y0 + y, col); };

  // Céu do amanhecer com dithering
  const SKY = ['#141a3d', '#1f2456', '#2e2a6b', '#4a2f7a', '#6e3a7f', '#9c4a78', '#d0646a', '#f08a5d', '#f7b267'].map(hex);
  const skyH = 150;
  for (let y = 0; y < skyH; y++) {
    const t = (y / skyH) * (SKY.length - 1);
    const i = Math.floor(t);
    for (let x = 0; x < W; x++) px(x, y, dith(x, y) < t - i ? SKY[Math.min(i + 1, SKY.length - 1)] : SKY[i]);
  }
  for (let i = 0; i < 70; i++) px(rand() * W, rand() * 55, rand() > 0.8 ? '#5ff5e8' : '#ffffff');
  circle(300, 138, 20, '#ffd98a');
  circle(300, 138, 14, '#fff1c9');
  // Nuvens
  [[60, 40], [180, 60], [330, 30], [250, 95]].forEach(([cx, cy]) => {
    for (let k = 0; k < 4; k++) circle(cx + k * 7, cy + (k % 2) * 2, 5 + (k % 2) * 2, '#e98f9a');
    rect(cx - 4, cy + 3, 30, 3, '#c77c99');
  });
  // Montanhas distantes + torre tecnológica
  for (let x = 0; x < W; x++) {
    const top = 112 + Math.round(14 * Math.sin(x / 23) + 8 * Math.sin(x / 9 + 1));
    for (let y = top; y < H; y++) px(x, y, '#3b2d6b');
  }
  rect(78, 58, 5, 60, '#2a2350');
  rect(74, 70, 13, 3, '#2a2350');
  for (let y = 60; y < 115; y += 6) px(80, y, '#5ff5e8');
  circle(80, 52, 4, '#5ff5e8');
  for (let a = 0; a < 40; a++) px(80 + Math.cos(a / 6.4) * 12, 52 + Math.sin(a / 6.4) * 4, '#5ff5e8');
  // Colinas médias e frontais
  for (let x = 0; x < W; x++) {
    const mid = 135 + Math.round(9 * Math.sin(x / 40) + 5 * Math.sin(x / 17));
    for (let y = mid; y < H; y++) px(x, y, y === mid ? '#4fa54a' : '#2f6b3a');
    const front = 165 + Math.round(10 * Math.sin(x / 55 + 1));
    for (let y = front; y < H; y++) px(x, y, y < front + 2 ? '#8ad35f' : dith(x, y) < 0.15 ? '#62ad45' : '#4f9a3f');
  }
  // Casa na colina com porta redonda
  circle(100, 178, 44, '#5fae47');
  for (let x = 60; x < 142; x++) for (let y = 134; y < 178; y++) if ((x - 100) ** 2 + (y - 178) ** 2 <= 44 * 44 && (x - 100) ** 2 + (y - 178) ** 2 > 41 * 41) px(x, y, '#8ad35f');
  rect(118, 128, 6, 14, '#7a5a44');
  for (let i = 0; i < 12; i++) px(121 + Math.sin(i) * 3, 124 - i * 3, i % 2 ? '#c9c3d9' : '#9d96c4');
  circle(100, 172, 12, '#8a5a2b');
  circle(100, 172, 10, '#2f8f4e');
  for (let y = 162; y < 183; y += 3) rect(91, y, 19, 1, '#287a43');
  px(105, 173, '#ffd98a');
  [[76, 164], [124, 164]].forEach(([x, y]) => { circle(x, y, 6, '#8a5a2b'); circle(x, y, 4, '#ffd27a'); px(x, y, '#fff1c9'); });
  rect(84, 183, 33, 4, '#a08a6a');
  // Trilha saindo da porta
  for (let y = 186; y < H; y++) {
    const cx = 100 + (y - 186) * 2.6 + Math.sin(y / 6) * 3;
    const w = 6 + (y - 186) * 0.5;
    for (let x = -w; x <= w; x++) px(cx + x, y, Math.abs(x) > w - 1.5 ? '#9c7f4c' : dith(cx + x, y) < 0.2 ? '#b8975c' : '#d2b47a');
  }
  // Cerca
  for (let x = 150; x < 230; x += 8) rect(x, 178, 2, 9, '#7a5a44');
  rect(150, 180, 80, 1, '#a07a55');
  rect(150, 184, 80, 1, '#a07a55');
  // Árvores
  [[205, 150], [255, 156], [345, 152], [30, 158]].forEach(([x, y]) => {
    rect(x - 2, y, 4, 14, '#5a3d28');
    circle(x, y - 6, 11, '#2f7a3a');
    circle(x - 4, y - 9, 5, '#3f9a48');
  });
  // Flores
  const FL = ['#ff6b8a', '#ffd94a', '#ffffff', '#b48cff', '#5ff5e8'];
  for (let i = 0; i < 260; i++) {
    const x = rand() * W, y = 170 + rand() * 46;
    px(x, y, FL[(rand() * FL.length) | 0]);
  }
  // Cristais holográficos flutuantes
  [[170, 100], [230, 80], [360, 105], [40, 95]].forEach(([x, y]) => {
    for (let k = 0; k < 4; k++) { px(x, y - k, '#5ff5e8'); px(x, y + k, '#2bb8b0'); px(x - k, y, '#a0fff7'); px(x + k, y, '#2bb8b0'); }
  });

  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}
