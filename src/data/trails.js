// Cada fase: nome, objetivo, competências, ferramentas, missões práticas e critério de conclusão.
// Listas separadas por "|" para facilitar a edição.
const p = (name, goal, skills, tools, missions, done) => ({
  name,
  goal,
  skills: skills.split('|'),
  tools: tools.split('|'),
  missions: missions.split('|'),
  done,
});

export const TRAILS = {
  artifice: [
    p('Fundamentos de Dados', 'Entender como dados são guardados e consultados.', 'SQL básico|Modelagem de tabelas', 'PostgreSQL|SQLite|DBeaver', 'Fazer 20 consultas SELECT com filtros|Criar um banco com 3 tabelas relacionadas|Usar JOIN para cruzar dados', 'Responder perguntas de negócio usando SQL sozinho(a).'),
    p('Construção', 'Programar em Python e conectar sistemas.', 'Python|Pandas|APIs REST|Power BI', 'VS Code|Jupyter|Postman|Power BI', 'Consumir uma API pública com Python|Analisar um CSV com Pandas|Montar um painel no Power BI', 'Ter um script que busca dados de uma API e gera um relatório.'),
    p('Inteligência Artificial', 'Criar soluções com modelos de linguagem.', 'Prompt Engineering|RAG (IA que consulta documentos)|Agentes e automações', 'API do Claude|LangChain|n8n', 'Criar um chatbot com instruções próprias|Montar um RAG com seus PDFs|Automatizar uma tarefa com um agente', 'Publicar um assistente de IA útil no seu portfólio.'),
    p('Especialização', 'Colocar soluções de IA em produção na nuvem.', 'Cloud|Deploy (publicação)|Monitoramento de custos', 'Azure|Google Cloud|Docker', 'Publicar sua API de IA na nuvem|Configurar variáveis seguras|Medir custo por uso', 'Ter uma solução de IA acessível por link público.'),
  ],
  oraculo: [
    p('Planilhas e Raciocínio', 'Dominar a análise em planilhas.', 'Fórmulas|Tabelas dinâmicas|Gráficos', 'Excel|Google Sheets', 'Criar uma tabela dinâmica|Usar PROCV/XLOOKUP|Fazer um gráfico que conte uma história', 'Analisar uma base de vendas e tirar 3 conclusões.'),
    p('SQL e Estatística', 'Extrair dados e entender seus números.', 'SQL|Estatística descritiva', 'PostgreSQL|BigQuery Sandbox', 'Responder 10 perguntas com SQL|Calcular média, mediana e desvio|Identificar outliers (valores fora do padrão)', 'Explicar a distribuição de um conjunto de dados.'),
    p('Visualização', 'Transformar dados em painéis claros.', 'Dashboards|Storytelling com dados', 'Power BI|Looker Studio', 'Criar um dashboard com 4 indicadores|Adicionar filtros interativos|Apresentar o painel em 3 minutos', 'Publicar um dashboard no portfólio.'),
    p('Ciência de Dados', 'Fazer previsões com Python.', 'Python|Pandas|Machine Learning básico', 'Jupyter|scikit-learn|Kaggle', 'Limpar uma base com Pandas|Treinar um modelo de regressão|Participar de uma competição no Kaggle', 'Ter um notebook de previsão explicado passo a passo.'),
  ],
  ilusionista: [
    p('Estrutura e Estilo', 'Criar páginas com HTML e CSS.', 'HTML semântico|CSS|Flexbox e Grid', 'VS Code|Chrome DevTools', 'Criar uma página pessoal|Montar um layout com Grid|Deixar a página responsiva', 'Publicar sua página no GitHub Pages.'),
    p('Interatividade', 'Dar vida às páginas com JavaScript.', 'JavaScript|DOM (estrutura da página)|Eventos', 'Git|GitHub', 'Criar uma lista de tarefas|Validar um formulário|Consumir uma API pública com fetch', 'Ter 3 mini projetos interativos no GitHub.'),
    p('Componentes', 'Construir interfaces modernas.', 'React|Estado e props|Rotas', 'Vite|React|Tailwind CSS', 'Recriar uma tela de app famoso|Criar componentes reutilizáveis|Salvar dados no localStorage', 'Entregar um app React completo e responsivo.'),
    p('Especialização', 'Qualidade profissional no front-end.', 'Acessibilidade|Performance|Testes', 'Lighthouse|Vitest|TypeScript', 'Atingir 90+ no Lighthouse|Navegar todo o app só com teclado|Escrever testes de componentes', 'Portfólio com projeto acessível e testado.'),
  ],
  ferreiro: [
    p('Lógica e Linguagem', 'Dominar uma linguagem de servidor.', 'Lógica de programação|JavaScript ou Python', 'Node.js|VS Code', 'Resolver 20 exercícios de lógica|Criar um programa de terminal|Ler e gravar arquivos', 'Escrever programas sem copiar soluções.'),
    p('APIs e Bancos', 'Criar APIs que guardam dados.', 'HTTP|APIs REST|SQL', 'Express|PostgreSQL|Postman', 'Criar uma API de tarefas (CRUD)|Conectar a API a um banco|Documentar as rotas', 'API funcional com criar, ler, editar e apagar.'),
    p('Segurança e Qualidade', 'Proteger e testar a aplicação.', 'Autenticação|Validação|Testes automatizados', 'JWT|Jest|Docker', 'Adicionar login com senha criptografada|Validar entradas do usuário|Cobrir as rotas com testes', 'API com login e testes passando.'),
    p('Especialização', 'Sistemas que aguentam muitos acessos.', 'Cache|Filas|Arquitetura', 'Redis|RabbitMQ|Render ou Railway', 'Publicar a API na nuvem|Adicionar cache em uma rota lenta|Processar tarefas em fila', 'API publicada e estável sob carga.'),
  ],
  guardiao: [
    p('Redes e Sistemas', 'Entender como computadores se comunicam.', 'TCP/IP|DNS|Linux', 'Linux|Wireshark|Packet Tracer', 'Mapear sua rede doméstica|Capturar pacotes com Wireshark|Usar 30 comandos de Linux', 'Explicar o caminho de um acesso a um site.'),
    p('Fundamentos de Segurança', 'Conhecer ameaças e defesas.', 'Criptografia|Tríade CIA (confidencialidade, integridade, disponibilidade)|OWASP Top 10', 'TryHackMe|CyberChef', 'Concluir trilha iniciante no TryHackMe|Explicar 5 falhas do OWASP|Criar senhas e 2FA seguros', 'Identificar as principais ameaças de um sistema web.'),
    p('Defesa e Ataque Ético', 'Praticar em ambientes autorizados.', 'Pentest|Análise de vulnerabilidades', 'Nmap|Burp Suite|Kali Linux', 'Escanear uma máquina de laboratório|Explorar uma falha em CTF|Escrever um relatório de vulnerabilidade', 'Concluir 3 desafios CTF documentados.'),
    p('Especialização', 'Atuar em monitoramento ou certificação.', 'SOC (centro de monitoramento)|Resposta a incidentes', 'SIEM|Splunk|Security+', 'Analisar logs de um ataque simulado|Criar um plano de resposta|Estudar para a Security+', 'Estar pronto(a) para vaga júnior de SOC.'),
  ],
  arquiteto: [
    p('Linux e Redes', 'Dominar o terminal e a base de servidores.', 'Linux|Bash|Redes', 'Ubuntu|WSL', 'Navegar e editar arquivos pelo terminal|Escrever um script Bash|Configurar SSH (acesso remoto seguro)', 'Administrar um servidor só pelo terminal.'),
    p('Containers', 'Empacotar aplicações para rodar em qualquer lugar.', 'Docker|Docker Compose', 'Docker|Docker Hub', 'Criar um Dockerfile|Subir app + banco com Compose|Publicar imagem no Docker Hub', 'Projeto rodando com um único comando.'),
    p('Nuvem e Automação', 'Publicar com esteiras automáticas.', 'Cloud|CI/CD', 'AWS ou Azure|GitHub Actions', 'Criar uma máquina virtual na nuvem|Montar um pipeline de deploy|Configurar alertas de custo', 'Cada commit publica o app automaticamente.'),
    p('Especialização', 'Infraestrutura escalável e versionada.', 'Kubernetes|Terraform|Observabilidade', 'Kubernetes|Terraform|Grafana', 'Criar infraestrutura com Terraform|Rodar app no Kubernetes|Montar painel de monitoramento', 'Infraestrutura completa descrita em código.'),
  ],
  bardo: [
    p('Mentalidade de Produto', 'Entender o que é um produto digital.', 'Ciclo de produto|Proposta de valor', 'Notion|Miro', 'Analisar 3 apps que você usa|Escrever a proposta de valor de um deles|Mapear seus concorrentes', 'Explicar por que um produto faz sucesso.'),
    p('Descoberta', 'Encontrar problemas reais dos usuários.', 'Entrevistas|Personas|Jornada do usuário', 'Google Forms|Miro', 'Entrevistar 5 pessoas|Criar uma persona|Mapear uma jornada', 'Documento com problemas validados.'),
    p('Priorização e Entrega', 'Decidir o que construir primeiro.', 'Histórias de usuário|RICE e MoSCoW|Roadmap', 'Jira|Trello', 'Escrever 10 histórias de usuário|Priorizar um backlog (lista de tarefas)|Montar um roadmap trimestral', 'Backlog priorizado e justificado.'),
    p('Especialização', 'Medir resultados e liderar decisões.', 'Métricas e KPIs|Testes A/B|Noções de SQL', 'Google Analytics|Amplitude', 'Definir métricas de sucesso|Desenhar um teste A/B|Apresentar um estudo de caso', 'Estudo de caso de produto no portfólio.'),
  ],
  alquimista: [
    p('Fundamentos de Dados', 'Dominar SQL e modelagem.', 'SQL avançado|Modelagem relacional', 'PostgreSQL|DBeaver', 'Escrever consultas com JOIN e GROUP BY|Usar funções de janela|Modelar um banco de vendas', 'Resolver desafios SQL intermediários.'),
    p('Python para Dados', 'Automatizar coleta e limpeza.', 'Python|Pandas|APIs', 'VS Code|Jupyter', 'Ler CSV e JSON com Python|Limpar dados duplicados|Coletar dados de uma API', 'Script que gera uma base limpa automaticamente.'),
    p('Pipelines', 'Construir fluxos de ETL agendados.', 'ETL/ELT|Orquestração|dbt', 'Airflow|dbt|Docker', 'Criar um pipeline diário|Transformar dados com dbt|Tratar falhas e reprocessamentos', 'Pipeline rodando sozinho todos os dias.'),
    p('Especialização', 'Trabalhar com Big Data na nuvem.', 'Data warehouse|Spark|Cloud', 'BigQuery|Databricks|Snowflake', 'Carregar dados em um warehouse|Processar dados com Spark|Documentar a arquitetura', 'Projeto de engenharia de dados ponta a ponta.'),
  ],
  inspetor: [
    p('Fundamentos de Teste', 'Entender por que e como testar.', 'Tipos de teste|Técnicas de teste', 'Guia CTFL|Google Docs', 'Estudar os 7 princípios de teste|Classificar testes funcionais e não funcionais|Analisar bugs famosos', 'Explicar a diferença entre erro, defeito e falha.'),
    p('Teste Manual', 'Planejar e executar testes.', 'Casos de teste|Relato de bugs', 'Jira|Qase|Trello', 'Escrever 20 casos de teste|Relatar 5 bugs reais com evidências|Criar um plano de teste', 'Plano de teste completo de um site real.'),
    p('Automação', 'Automatizar testes repetitivos.', 'JavaScript básico|Testes E2E (de ponta a ponta)|Testes de API', 'Cypress|Playwright|Postman', 'Automatizar um fluxo de login|Testar uma API no Postman|Rodar testes no GitHub Actions', 'Suíte automatizada rodando a cada commit.'),
    p('Especialização', 'Qualidade em nível profissional.', 'Testes de performance|Acessibilidade|Certificação', 'k6|Lighthouse|CTFL', 'Fazer um teste de carga|Auditar acessibilidade de um site|Estudar para a CTFL', 'Portfólio de QA com projetos e relatórios.'),
  ],
  mensageiro: [
    p('Lógica e Linguagem', 'Aprender a base de programação.', 'Lógica|Dart ou JavaScript', 'DartPad|VS Code', 'Resolver 20 exercícios|Entender listas e objetos|Criar um programa de terminal', 'Programar pequenos algoritmos sozinho(a).'),
    p('Primeiro App', 'Criar telas no celular.', 'Widgets/componentes|Layouts mobile|Navegação', 'Flutter ou React Native|Android Studio', 'Rodar um app no seu celular|Criar 3 telas com navegação|Montar uma lista com rolagem', 'App com navegação funcionando no aparelho.'),
    p('Dados e Recursos', 'Conectar o app ao mundo.', 'APIs|Armazenamento local|Recursos nativos', 'Firebase|SQLite', 'Consumir uma API|Salvar dados offline|Usar câmera ou GPS', 'App que funciona com e sem internet.'),
    p('Especialização', 'Publicar e manter apps.', 'Publicação nas lojas|Performance|Notificações', 'Google Play Console|Firebase Messaging', 'Gerar versão de produção|Enviar notificações push|Publicar em teste fechado', 'App disponível para testadores reais.'),
  ],
  vidente: [
    p('Fundamentos de UX', 'Entender como pessoas usam produtos.', 'Heurísticas de Nielsen|Design centrado no usuário', 'Livros e artigos de UX|Notion', 'Avaliar um app com as 10 heurísticas|Listar 5 problemas de usabilidade|Estudar um caso de redesign', 'Explicar o que torna uma interface fácil.'),
    p('Pesquisa', 'Ouvir e entender usuários.', 'Entrevistas|Personas|Mapa de empatia', 'Miro|Google Forms', 'Entrevistar 5 pessoas|Criar uma persona|Mapear a jornada do usuário', 'Relatório com descobertas de pesquisa.'),
    p('Interface e Protótipo', 'Desenhar telas e fluxos.', 'Wireframes|UI (cor, tipografia, grid)|Prototipação', 'Figma', 'Criar wireframes de um app|Montar um mini design system|Prototipar um fluxo clicável', 'Protótipo navegável no Figma.'),
    p('Especialização', 'Validar e comunicar o design.', 'Testes de usabilidade|Acessibilidade|Portfólio', 'Maze|Figma|Behance', 'Testar o protótipo com 5 pessoas|Ajustar contraste e legibilidade|Publicar um estudo de caso', 'Estudo de caso completo no portfólio.'),
  ],
  mestre: [
    p('Fundamentos Ágeis', 'Entender a agilidade e seus valores.', 'Manifesto Ágil|Scrum|Kanban', 'Guia do Scrum|Trello', 'Ler o Guia do Scrum|Montar um quadro Kanban pessoal|Comparar Scrum e Kanban', 'Explicar papéis, eventos e artefatos do Scrum.'),
    p('Facilitação', 'Conduzir encontros produtivos.', 'Facilitação|Dinâmicas de retrospectiva', 'Miro|FunRetro', 'Facilitar uma reunião com amigos ou colegas|Aplicar 2 dinâmicas de retrospectiva|Criar acordos de time', 'Conduzir uma retrospectiva do início ao fim.'),
    p('Métricas e Ferramentas', 'Medir e melhorar o fluxo de trabalho.', 'Velocidade|Lead time|Gráfico burndown', 'Jira|Azure Boards', 'Configurar um projeto no Jira|Acompanhar uma sprint simulada|Analisar gargalos do fluxo', 'Relatório de sprint com métricas.'),
    p('Especialização', 'Liderar times e transformar a organização.', 'Liderança servidora|Mediação de conflitos|Certificação', 'PSM I|Comunicação não violenta', 'Mediar um conflito simulado|Criar um plano de melhoria contínua|Estudar para a PSM I', 'Pronto(a) para a certificação PSM I.'),
  ],
};
