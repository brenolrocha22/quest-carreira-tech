// Tema heroico chiptune ORIGINAL, sintetizado em tempo real (sem arquivos, sem direitos autorais).
import { load, save } from './storage.js';

const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
const midi = (s) => { const m = s.match(/^([A-G]#?)(\d)$/); return 12 * (+m[2] + 1) + NOTE[m[1]]; };
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

const MELODY = 'G4:1 C5:1 E5:1 G5:3 E5:1 G5:1 A5:2 G5:1 F5:1 E5:2 D5:2 C5:1 E5:1 G5:1 C6:3 B5:1 A5:1 G5:6 R:2 F5:2 A5:2 C6:2 A5:2 G5:2 E5:2 C5:2 E5:2 D5:2 F5:2 A5:2 G5:1 F5:1 E5:2 D5:2 C5:4';
const BASS = 'C2 C2 F2 G2 C2 A2 G2 G2 F2 F2 C2 C2 D2 G2 C2 C2'; // uma nota por meio compasso
const STEPS = 64;
const EIGHTH = 60 / 150 / 2;

const lead = Array(STEPS).fill(null);
let pos = 0;
for (const tok of MELODY.split(' ')) {
  const [n, len] = tok.split(':');
  if (n !== 'R') lead[pos] = { f: hz(midi(n)), len: +len };
  pos += +len;
}
const bass = BASS.split(' ').flatMap((n) => { const m = midi(n); return [m, m + 12, m, m + 12]; });

let ctx, master, timer, nextTime = 0, step = 0;
let enabled = load('qct_music', true);
export const musicEnabled = () => enabled;

function tone(type, f, t, dur, vol) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02);
}

function noise(t) {
  const buf = ctx.createBuffer(1, 800, ctx.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(), g = ctx.createGain();
  s.buffer = buf; g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  s.connect(g).connect(master); s.start(t);
}

function tick() {
  while (nextTime < ctx.currentTime + 0.25) {
    const n = lead[step];
    if (n) tone('square', n.f, nextTime, n.len * EIGHTH * 0.9, 0.18);
    tone('triangle', hz(bass[step]), nextTime, EIGHTH * 0.9, 0.35);
    if (step % 2 === 1) noise(nextTime);
    nextTime += EIGHTH;
    step = (step + 1) % STEPS;
  }
}

export function startMusic() {
  if (!enabled || timer) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    master = ctx.createGain();
    master.gain.value = 0.12;
    master.connect(ctx.destination);
    nextTime = ctx.currentTime + 0.05;
    timer = setInterval(tick, 80);
  } catch { /* áudio indisponível */ }
}

export function stopMusic() {
  clearInterval(timer);
  timer = null;
  try { master?.disconnect(); } catch { /* noop */ }
}

export function setMusic(on) {
  enabled = on;
  save('qct_music', on);
  on ? startMusic() : stopMusic();
}
