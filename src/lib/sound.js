import { load, save } from './storage.js';

let ctx;
let muted = load('qct_muted', false);
export const isMuted = () => muted;
export function setMuted(v) {
  muted = v;
  save('qct_muted', v);
}

const SOUNDS = {
  click: [[660, 0.06]],
  next: [[520, 0.07], [780, 0.09]],
  reveal: [[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.3]],
  badge: [[880, 0.08], [1175, 0.18]],
};

// Efeitos sintetizados com Web Audio (sem arquivos de áudio)
export function play(name) {
  if (muted) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    let t = ctx.currentTime;
    for (const [freq, dur] of SOUNDS[name] || []) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur);
      t += dur * 0.85;
    }
  } catch {
    /* áudio indisponível */
  }
}
