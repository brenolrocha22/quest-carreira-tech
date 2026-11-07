// Textos de compartilhamento. Variáveis: {nome} {classe} {profissao} {descricao} {dom} {link}
export const SHARE_TEMPLATES = [
  {
    id: 'animado',
    label: 'Animado',
    text: 'Acabei de fazer a Quest de Carreira Tech e descobri minha classe: {classe}! ⚔️\nNo mundo real, isso é {profissao}: {descricao}\n\nLevei uns 4 minutinhos e ainda ganhei uma trilha de estudos com cursos gratuitos. Qual será a sua profissão tech? Descobre aqui 👉 {link}',
  },
  {
    id: 'linkedin',
    label: 'Profissional',
    text: 'Fiz um teste rápido de perfil para carreiras em tecnologia e o resultado fez muito sentido: {profissao}.\n\nNa prática, é quem {descricao}\n\nAlém do resultado, ele monta uma trilha de aprendizado em 4 fases com cursos gratuitos. Se você pensa em migrar para tech ou quer entender para onde crescer, vale os 4 minutos: {link}',
  },
  {
    id: 'desafio',
    label: 'Desafio',
    text: 'Aposto que você não adivinha qual profissão tech combina comigo 👀\nSpoiler: deu {profissao} ({classe})!\n\nFaz o seu e me conta o que deu 👉 {link}',
  },
  {
    id: 'curto',
    label: 'Curto (X)',
    text: 'Minha classe na tecnologia: {classe} → {profissao} 🧙 Descubra a sua em 4 min: {link}',
  },
];

export function fillTemplate(text, { name, cls, sub, url }) {
  const desc = cls.desc.charAt(0).toLowerCase() + cls.desc.slice(1);
  return text
    .replaceAll('{nome}', name)
    .replaceAll('{classe}', cls.name)
    .replaceAll('{profissao}', cls.profession)
    .replaceAll('{descricao}', desc)
    .replaceAll('{dom}', sub ? `${sub.name} (${sub.gift})` : '')
    .replaceAll('{link}', url);
}
