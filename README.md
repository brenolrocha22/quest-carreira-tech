# ⚔️ Quest de Carreira Tech

Questionário gamificado em estilo RPG que revela qual carreira da tecnologia combina com você. Ao final, você recebe um card colecionável com sua classe, a profissão real, seus atributos e uma trilha de aprendizagem em 4 fases.

React + Vite + Tailwind CSS v4 + html2canvas. Não tem backend: tudo roda no navegador, e o progresso fica salvo no `localStorage`.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento: http://localhost:5173
npm run build    # gera a versão de produção em dist/
npm run preview  # serve o build localmente
npm run check    # confere se as 12 classes podem ser desbloqueadas
```

A pasta `dist/` pode ser publicada em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages).

## Como editar o conteúdo

| Arquivo | O que contém |
|---|---|
| `src/data/classes.js` | As 12 classes: nome, profissão, descrição, ícone, cor, qualificações, poderes e primeira missão. Também define os 7 atributos. |
| `src/data/questions.js` | As perguntas. Em cada alternativa, `c` guarda os pontos por classe e `a` os pontos por atributo, sempre de 1 a 3. |
| `src/data/trails.js` | As trilhas de 4 fases. Cada fase tem nome, objetivo, competências, ferramentas, missões e critério de conclusão. Os itens das listas são separados por `\|`. |

Depois de mexer nas perguntas, rode `npm run check` para garantir que todas as classes continuam alcançáveis.

## Regras de pontuação (`src/lib/scoring.js`)

- A **classe principal** é a de maior pontuação. A **subclasse** é a segunda.
- **Desempate**, nesta ordem, sem nenhum sorteio:
  1. maior número de respostas que deram 3 pontos à classe;
  2. maior peso nas respostas mais recentes;
  3. ordem da classe em `classes.js`.
- Os **atributos** são normalizados de 1 a 10, tomando o seu atributo mais alto como referência. Valores até 4 recebem o selo "Em evolução".

## Compartilhamento

- **Web Share API** (compartilhamento nativo do celular): Instagram Stories e Direct, WhatsApp.
- **Links de compartilhamento** (abrem um post já preenchido): X, Threads e WhatsApp (`wa.me`).
- **LinkedIn**: o site abre a página de compartilhamento só com o link e copia o texto para a pessoa colar no post, porque o LinkedIn não aceita texto pré-preenchido.
- **Sem integração direta disponível** (Instagram Reels e YouTube Shorts): o site baixa a arte vertical e entrega a legenda, ou o título e a descrição, prontos para colar.
- **Alternativas que funcionam em qualquer lugar:** baixar o card em PNG, baixar a arte nos formatos vertical (1080×1920), quadrado (1080×1080) e horizontal (1200×630), copiar o texto e copiar o link.

Nenhum login em rede social é solicitado.

> Atenção: as cores usadas no card e nas artes exportadas precisam estar em hex ou rgba. O html2canvas não entende cores `oklch`, que são o padrão da paleta do Tailwind v4.
