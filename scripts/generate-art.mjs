// Gera as ilustrações dos cards com a API do Gemini e salva em public/cards/.
// Uso:
//   node scripts/generate-art.mjs --defaults          -> 1 imagem padrão por classe (12)
//   node scripts/generate-art.mjs                     -> todas as variantes classe x gênero x cor (120)
//   node scripts/generate-art.mjs --only oraculo      -> só uma classe
// A chave vem de GEMINI_API_KEY (variável de ambiente ou arquivo .env.local, que não vai para o Git).
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
if (!KEY) {
  console.error('Defina GEMINI_API_KEY (veja o README).');
  process.exit(1);
}

const STYLE = 'Epic fantasy meets futuristic tech, anime/manga illustration style, dramatic lighting, purple starry arcane background with glowing cyan magic circles, rich gold and cyan palette. Wide horizontal composition: the character on the left half, the companion on the right half. Follow the art style of the reference image. No text, no letters, no frame, no border.';

// Cenário de cada classe (a pessoa é inserida conforme gênero e cor)
const SCENES = {
  artifice: ['an arcane artificer in an ornate deep-purple and gold coat with brass gears, a glowing cyan rune circle floating over the open hand', 'a towering golden clockwork golem with a glowing cyan core'],
  oraculo: ['a data oracle in deep-blue and gold robes, holding a glowing holographic orb full of charts and numbers', 'an owl familiar made of cyan runes and golden clockwork'],
  ilusionista: ['an interface illusionist in a violet and gold coat, conjuring floating glowing UI panels, buttons and screens', 'a nine-tailed spirit fox made of light'],
  ferreiro: ['a foundation blacksmith in a leather apron with brass armor, hammering a glowing anvil whose sparks form lines of code and server racks', 'an iron golem guardian'],
  guardiao: ['a wall guardian warrior in emerald armor, holding a huge rune shield that projects a cyan firewall dome', 'a spectral jaguar'],
  arquiteto: ['a sky architect in sky-blue and gold robes, orchestrating floating cloud islands with servers, bridges and towers', 'a majestic griffin'],
  bardo: ['a charismatic strategist bard in a burgundy and gold outfit, playing a lute that projects a holographic product roadmap', 'a golden phoenix'],
  alquimista: ['a data alchemist in a teal and gold coat, controlling flowing rivers of glowing liquid data through glass pipelines and flasks', 'a fire salamander'],
  inspetor: ['a rune inspector with a magnifying monocle and a violet coat, scanning floating runes and highlighting a glowing red bug', 'a mechanical cat'],
  mensageiro: ['a winged messenger with winged boots and red and gold courier armor, holding a glowing smartphone-like amulet', 'a hawk made of light'],
  vidente: ['an experience seer with a glowing third-eye jewel and magenta robes, sketching luminous interface wireframes in the air', 'butterfly spirits of light'],
  mestre: ['a ritual master in amber and gold robes, holding a giant glowing hourglass while team banners march behind', 'an ancient turtle spirit'],
};

// Personagem padrão (elenco diverso) para quem não informou gênero/cor
const DEFAULT_PERSON = {
  artifice: 'a mixed-race Brazilian man with wavy black hair and a short beard',
  oraculo: 'a Black woman with very dark skin and natural coily hair',
  ilusionista: 'a Japanese woman with a short bob haircut',
  ferreiro: 'a Black man with dark skin and a short beard',
  guardiao: 'an Indigenous Brazilian woman with long black hair and face paint',
  arquiteto: 'an Indian man with a turban and a trimmed beard',
  bardo: 'a mixed-race Brazilian man with curly hair',
  alquimista: 'a Korean nonbinary person with an undercut hairstyle',
  inspetor: 'an Indian woman with a long braid',
  mensageiro: 'a Japanese young man with spiky hair',
  vidente: 'an Afro-Latina woman with long box braids',
  mestre: 'an Indigenous Brazilian man with a feather headdress',
};

const GENDERS = { f: 'woman', m: 'man' };
const RACES = {
  preta: (g) => `Black ${g} with very dark skin${g === 'woman' ? ' and natural coily hair or braids' : ' and short coily hair'}`,
  parda: (g) => `mixed-race Brazilian ${g} with brown skin`,
  branca: (g) => `white ${g}`,
  amarela: (g) => `East Asian ${g}`,
  indigena: (g) => `Indigenous Brazilian ${g} with long black hair`,
};

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const classes = Object.keys(SCENES).filter((c) => !only || c === only);
const jobs = [];
for (const c of classes) {
  jobs.push({ file: `${c}.png`, person: DEFAULT_PERSON[c], c });
  if (!args.includes('--defaults')) {
    for (const [g, gw] of Object.entries(GENDERS)) for (const [r, fn] of Object.entries(RACES)) jobs.push({ file: `${c}-${g}-${r}.png`, person: fn(gw), c });
  }
}

mkdirSync('public/cards', { recursive: true });
const ref = existsSync('public/cards/artifice.jpg') ? readFileSync('public/cards/artifice.jpg').toString('base64') : null;

async function generate({ file, person, c }) {
  const out = `public/cards/${file}`;
  if (existsSync(out) || existsSync(out.replace(/.png$/, '.jpg'))) return 'existe';
  const [hero, companion] = SCENES[c];
  const prompt = `Card illustration: ${person} as ${hero}; beside them ${companion}. ${STYLE}`;
  const parts = [{ text: prompt }];
  if (ref) parts.push({ inline_data: { mime_type: 'image/jpeg', data: ref } });
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } } }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || res.status);
  const img = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
  if (!img) throw new Error('resposta sem imagem');
  writeFileSync(out, Buffer.from((img.inlineData || img.inline_data).data, 'base64'));
  return 'ok';
}

let done = 0;
for (const job of jobs) {
  try {
    const r = await generate(job);
    console.log(`[${++done}/${jobs.length}] ${job.file}: ${r}`);
  } catch (e) {
    console.error(`[${++done}/${jobs.length}] ${job.file}: ERRO ${e.message}`);
    if (/API key|PERMISSION|billing|quota/i.test(e.message)) process.exit(1);
  }
}
