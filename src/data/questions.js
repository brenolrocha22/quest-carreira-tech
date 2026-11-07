// c = pontos por classe (1 a 3) · a = pontos por atributo (1 a 3)
export const QUESTIONS = [
  {
    id: 'vilarejo',
    chapter: 'O Vilarejo',
    text: 'As colheitas do vilarejo de Pedraluz estão sumindo durante a noite. Os moradores pedem sua ajuda. O que você faz primeiro?',
    options: [
      { text: 'Instalo sentinelas mágicas e vigio cada entrada do vilarejo.', c: { guardiao: 3, arquiteto: 1 }, a: { analise: 2, solo: 1 } },
      { text: 'Reúno os registros das colheitas e procuro um padrão nos números.', c: { oraculo: 3, alquimista: 2 }, a: { analise: 3, logica: 1 } },
      { text: 'Converso com os moradores para entender como o problema os afeta.', c: { vidente: 3, bardo: 2 }, a: { usuario: 3, comunicacao: 2 } },
      { text: 'Construo um golem que vigia o campo e avisa sozinho quando algo acontece.', c: { artifice: 3, ferreiro: 1 }, a: { construcao: 3, logica: 1 } },
    ],
  },
  {
    id: 'rei',
    chapter: 'A Corte',
    text: 'O rei quer saber o resultado da sua missão. Como você prefere apresentar o que fez?',
    options: [
      { text: 'Com um painel de números claros mostrando o antes e o depois.', c: { oraculo: 3, bardo: 1 }, a: { analise: 2, comunicacao: 1 } },
      { text: 'Com um protótipo funcionando que ele mesmo pode tocar e usar.', c: { ilusionista: 2, mensageiro: 2, vidente: 1 }, a: { construcao: 2, usuario: 1 } },
      { text: 'Com um plano de etapas, prazos e responsáveis para os próximos passos.', c: { mestre: 3, bardo: 2 }, a: { organizacao: 3, comunicacao: 1 } },
      { text: 'Com a garantia de que tudo foi testado e nada vai falhar.', c: { inspetor: 3, guardiao: 1 }, a: { analise: 2, organizacao: 1 } },
    ],
  },
  {
    id: 'artefato',
    chapter: 'O Artefato Misterioso',
    text: 'Um mercador oferece à guilda um artefato mágico desconhecido. Qual é a sua avaliação?',
    options: [
      { text: 'Testo cada função dele, procurando defeitos escondidos.', c: { inspetor: 3 }, a: { analise: 2, logica: 1 } },
      { text: 'Verifico se ele pode ser usado contra nós por algum inimigo.', c: { guardiao: 3 }, a: { analise: 2, logica: 1 } },
      { text: 'Observo se as pessoas conseguem usá-lo sem precisar de manual.', c: { vidente: 3, ilusionista: 1 }, a: { usuario: 3 } },
      { text: 'Penso em como produzi-lo em escala para todo o reino.', c: { arquiteto: 3, alquimista: 1 }, a: { organizacao: 2, construcao: 1 } },
    ],
  },
  {
    id: 'guilda',
    chapter: 'A Guilda',
    text: 'Você acaba de entrar na Guilda dos Inventores. Como prefere trabalhar?',
    options: [
      { text: 'Concentrado(a) na minha bancada, resolvendo desafios no meu ritmo.', c: { ferreiro: 2, alquimista: 2, guardiao: 1 }, a: { solo: 3, logica: 1 } },
      { text: 'Em dupla, criando coisas visuais lado a lado.', c: { ilusionista: 2, mensageiro: 2 }, a: { construcao: 1, comunicacao: 1, usuario: 1 } },
      { text: 'Facilitando o grupo e garantindo que todos avancem juntos.', c: { mestre: 3 }, a: { comunicacao: 2, organizacao: 2 } },
      { text: 'Entre a guilda e os clientes, traduzindo pedidos em missões.', c: { bardo: 3, vidente: 1 }, a: { comunicacao: 3, usuario: 1 } },
    ],
  },
  {
    id: 'feitico',
    chapter: 'A Biblioteca Arcana',
    text: 'O arquimago permite que você aprenda apenas um feitiço. Qual escolhe?',
    options: [
      { text: 'Invocar um familiar que realiza tarefas por mim.', c: { artifice: 3 }, a: { construcao: 2, logica: 1 } },
      { text: 'Ilusão que transforma a aparência de qualquer objeto.', c: { ilusionista: 3, vidente: 1 }, a: { usuario: 2, construcao: 1 } },
      { text: 'Escudo arcano que bloqueia qualquer ataque.', c: { guardiao: 3 }, a: { logica: 1, analise: 1, solo: 1 } },
      { text: 'Visão do futuro a partir de sinais e presságios.', c: { oraculo: 3, artifice: 1 }, a: { analise: 3 } },
    ],
  },
  {
    id: 'quebrado',
    chapter: 'A Oficina',
    text: 'O relógio mágico da torre parou de funcionar. Como você investiga?',
    options: [
      { text: 'Reproduzo o defeito passo a passo e anoto cada detalhe.', c: { inspetor: 3 }, a: { analise: 2, organizacao: 1 } },
      { text: 'Abro a carcaça e examino as engrenagens internas.', c: { ferreiro: 3, arquiteto: 1 }, a: { logica: 3, solo: 1 } },
      { text: 'Rastreio de onde vem a energia que alimenta o relógio.', c: { alquimista: 3, oraculo: 1 }, a: { analise: 2, logica: 1 } },
      { text: 'Verifico se a própria torre está instável e afeta o relógio.', c: { arquiteto: 3 }, a: { logica: 2, organizacao: 1 } },
    ],
  },
  {
    id: 'portatil',
    chapter: 'O Desafio do Artesão',
    text: 'Viajantes pedem um dispositivo mágico portátil. Qual parte você quer criar?',
    options: [
      { text: 'O amuleto inteiro, que cabe no bolso e avisa o viajante.', c: { mensageiro: 3 }, a: { construcao: 2, usuario: 1 } },
      { text: 'O desenho de como a pessoa vai segurá-lo e usá-lo.', c: { vidente: 2, mensageiro: 2 }, a: { usuario: 3 } },
      { text: 'O mecanismo interno que guarda e envia as mensagens.', c: { ferreiro: 3 }, a: { construcao: 2, logica: 1 } },
      { text: 'Um espírito dentro dele que conversa e aprende com o dono.', c: { artifice: 3, mensageiro: 1 }, a: { construcao: 2, logica: 1 } },
    ],
  },
  {
    id: 'bagunca',
    chapter: 'A Guilda Desorganizada',
    text: 'A guilda vizinha está um caos: missões atrasadas e ninguém sabe quem faz o quê. Como você ajuda?',
    options: [
      { text: 'Crio rituais de encontro e um quadro de missões visível a todos.', c: { mestre: 3 }, a: { organizacao: 3, comunicacao: 1 } },
      { text: 'Converso com todos e defino o que é mais importante agora.', c: { bardo: 3, mestre: 1 }, a: { comunicacao: 2, organizacao: 1 } },
      { text: 'Automatizo os registros para a informação fluir sozinha.', c: { alquimista: 3, arquiteto: 1 }, a: { organizacao: 2, construcao: 1 } },
      { text: 'Crio checklists de qualidade para cada entrega.', c: { inspetor: 3 }, a: { organizacao: 2, analise: 1 } },
    ],
  },
  {
    id: 'futuro',
    chapter: 'O Espelho do Destino',
    text: 'O espelho mágico mostra você daqui a cinco anos. O que ele revela?',
    options: [
      { text: 'Criando apps que milhões de pessoas usam no celular.', c: { mensageiro: 3, bardo: 1 }, a: { construcao: 2, usuario: 1 } },
      { text: 'Mantendo sistemas gigantes de pé, sem nunca cair.', c: { arquiteto: 3, ferreiro: 1 }, a: { organizacao: 2, logica: 1 } },
      { text: 'Liderando a estratégia de um produto de sucesso.', c: { bardo: 3 }, a: { comunicacao: 2, usuario: 1 } },
      { text: 'Criando inteligências artificiais que mudam o trabalho das pessoas.', c: { artifice: 3, alquimista: 1 }, a: { construcao: 2, analise: 1 } },
    ],
  },
  {
    id: 'passado',
    chapter: 'Memórias de Jornada',
    text: 'Antes desta aventura, em que tipo de trabalho ou atividade você mais se destacou?',
    options: [
      { text: 'Atendimento, vendas ou ensino.', c: { bardo: 2, mestre: 2, vidente: 1 }, a: { comunicacao: 3 } },
      { text: 'Administrativo, financeiro ou planilhas.', c: { oraculo: 2, alquimista: 2, inspetor: 1 }, a: { analise: 2, organizacao: 1 } },
      { text: 'Artes, design, fotografia ou criação de conteúdo.', c: { vidente: 3, ilusionista: 2 }, a: { usuario: 2, construcao: 1 } },
      { text: 'Suporte técnico, manutenção ou eletrônica.', c: { arquiteto: 2, guardiao: 2, ferreiro: 1 }, a: { logica: 2, solo: 1 } },
    ],
  },
  {
    id: 'repeticao',
    chapter: 'A Rotina da Fortaleza',
    text: 'Sua missão exige repetir a mesma tarefa todos os dias. Como você se sente?',
    options: [
      { text: 'Tranquilo(a): rotina bem feita me traz paz e precisão.', c: { inspetor: 2, alquimista: 1, oraculo: 1 }, a: { organizacao: 2, solo: 1 } },
      { text: 'Tolero, mas logo invento um jeito de automatizar.', c: { artifice: 2, arquiteto: 2, alquimista: 1 }, a: { logica: 2, construcao: 1 } },
      { text: 'Prefiro variedade de pessoas e situações.', c: { mestre: 2, bardo: 2 }, a: { comunicacao: 2 } },
      { text: 'Aceito, se for para vigiar algo realmente importante.', c: { guardiao: 3 }, a: { analise: 1, solo: 2 } },
    ],
  },
  {
    id: 'enigma',
    chapter: 'A Porta dos Enigmas',
    text: 'Uma porta antiga só abre com a resposta de um enigma. Qual tipo de enigma você prefere?',
    options: [
      { text: 'Lógica pura: passo horas até encontrar a solução.', c: { ferreiro: 3, guardiao: 1 }, a: { logica: 3, solo: 2 } },
      { text: 'Sequências de números e padrões escondidos.', c: { oraculo: 3, alquimista: 2 }, a: { analise: 2, logica: 2 } },
      { text: 'Enigmas visuais, de encaixar formas e cores.', c: { ilusionista: 3, mensageiro: 1 }, a: { usuario: 1, logica: 1, construcao: 1 } },
      { text: 'Enigmas que envolvem entender o que as pessoas pensam.', c: { mestre: 2, vidente: 2, bardo: 1 }, a: { comunicacao: 2, usuario: 1 } },
    ],
  },
  {
    id: 'explicar',
    chapter: 'A Academia',
    text: 'Um aprendiz pede ajuda para entender algo difícil. O que você faz?',
    options: [
      { text: 'Adoro! Explico com calma e conduzo o aprendizado.', c: { mestre: 3, bardo: 1 }, a: { comunicacao: 3 } },
      { text: 'Mostro com gráficos, exemplos e comparações.', c: { oraculo: 3, bardo: 1 }, a: { analise: 2, comunicacao: 1 } },
      { text: 'Prefiro mostrar algo funcionando na prática.', c: { ilusionista: 2, mensageiro: 2, ferreiro: 1 }, a: { construcao: 2 } },
      { text: 'Escrevo um pergaminho de documentação claro e detalhado.', c: { inspetor: 2, alquimista: 2, arquiteto: 1 }, a: { organizacao: 2, solo: 1 } },
    ],
  },
  {
    id: 'criar',
    chapter: 'O Último Portal',
    text: 'Antes da revelação final, o portal pergunta: o que mais te realiza?',
    options: [
      { text: 'Criar algo do zero, a partir de uma página em branco.', c: { ilusionista: 2, mensageiro: 2, artifice: 1 }, a: { construcao: 3 } },
      { text: 'Melhorar algo existente até ficar impecável.', c: { inspetor: 2, vidente: 2 }, a: { analise: 2, usuario: 1 } },
      { text: 'Fortalecer as bases para que nada desmorone.', c: { ferreiro: 2, arquiteto: 2, guardiao: 1 }, a: { logica: 1, organizacao: 2 } },
      { text: 'Reorganizar como as coisas fluem entre as partes.', c: { alquimista: 3, mestre: 1 }, a: { organizacao: 2, logica: 1 } },
    ],
  },
];
