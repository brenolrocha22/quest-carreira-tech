import { CLASSES, ATTRIBUTES } from '../data/classes.js';
import { QUESTIONS } from '../data/questions.js';

/**
 * Calcula o resultado a partir das respostas (array de índices de alternativa).
 * Desempate determinístico:
 * 1) maior pontuação total; 2) mais respostas "fortes" (3 pontos);
 * 3) maior pontuação nas respostas mais recentes; 4) ordem fixa em CLASSES.
 */
export function computeResult(answers, questions = QUESTIONS) {
  const cls = Object.fromEntries(CLASSES.map((c) => [c.id, { total: 0, strong: 0, recent: 0 }]));
  const attr = Object.fromEntries(ATTRIBUTES.map((a) => [a.id, 0]));

  answers.forEach((optIdx, qIdx) => {
    const opt = questions[qIdx]?.options[optIdx];
    if (!opt) return;
    for (const [id, pts] of Object.entries(opt.c || {})) {
      if (!cls[id]) continue;
      cls[id].total += pts;
      if (pts === 3) cls[id].strong += 1;
      cls[id].recent += pts * (qIdx + 1); // respostas finais pesam mais no desempate
    }
    for (const [id, pts] of Object.entries(opt.a || {})) if (id in attr) attr[id] += pts;
  });

  const ranking = CLASSES.map((c, order) => ({ id: c.id, order, ...cls[c.id] })).sort(
    (x, y) => y.total - x.total || y.strong - x.strong || y.recent - x.recent || x.order - y.order
  );

  const maxAttr = Math.max(1, ...Object.values(attr));
  const attributes = ATTRIBUTES.map((a) => {
    const value = Math.max(1, Math.round((attr[a.id] / maxAttr) * 10));
    return { ...a, value, evolving: value <= 4 };
  });

  return { main: ranking[0].id, sub: ranking[1].id, ranking, attributes };
}
