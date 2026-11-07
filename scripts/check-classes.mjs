// Verifica se cada uma das 12 classes pode ser desbloqueada (escolha gulosa por classe).
import { CLASSES } from '../src/data/classes.js';
import { QUESTIONS } from '../src/data/questions.js';
import { computeResult } from '../src/lib/scoring.js';

let ok = true;
for (const c of CLASSES) {
  const answers = QUESTIONS.map((q) => {
    let best = 0;
    q.options.forEach((o, i) => { if ((o.c[c.id] || 0) > (q.options[best].c[c.id] || 0)) best = i; });
    return best;
  });
  const r = computeResult(answers);
  const pass = r.main === c.id;
  ok &&= pass;
  console.log(`${pass ? 'OK  ' : 'FAIL'} ${c.name} -> ${r.main} (sub: ${r.sub}) attrs: ${r.attributes.map((a) => a.value).join(',')}`);
}
QUESTIONS.forEach((q) => q.options.forEach((o) => { if (!Object.keys(o.c).length || !Object.keys(o.a).length) { ok = false; console.log('Sem pontuação:', q.id); } }));
const a = computeResult(Array(QUESTIONS.length).fill(0)), b = computeResult(Array(QUESTIONS.length).fill(0));
console.log('Determinístico:', a.main === b.main && a.sub === b.sub);
process.exit(ok ? 0 : 1);
