// Ilustrações: public/cards/<classe>-<f|m>-<cor>.png (variante da pessoa) e public/cards/<classe>.jpg (padrão).
const GENDER = { Mulher: 'f', Homem: 'm' };
const RACE = { Preta: 'preta', Parda: 'parda', Branca: 'branca', Amarela: 'amarela', 'Indígena': 'indigena' };

export function artCandidates(classId, persona) {
  const base = `${import.meta.env.BASE_URL}cards/`;
  const g = GENDER[persona?.gender];
  const r = RACE[persona?.race];
  const list = [];
  if (g && r) list.push(`${base}${classId}-${g}-${r}.png`);
  list.push(`${base}${classId}.png`, `${base}${classId}.jpg`);
  return list;
}
