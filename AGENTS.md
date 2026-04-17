# AGENTS.md

## Objetivo do projeto
Este projeto é uma POC local para auxiliar revisão de Pull Requests com apoio de IA.

A aplicação deve:
1. buscar PRs onde o usuário foi solicitado como reviewer
2. exibir a lista desses PRs
3. permitir selecionar um PR
4. analisar o PR com IA
5. listar sugestões de comentários
6. permitir aprovar, recusar ou editar sugestões
7. publicar no GitHub somente as sugestões aprovadas

## Restrições do projeto
- esta é uma POC local
- usar um único projeto Next.js com React
- usar TypeScript
- usar MongoDB local com o driver oficial para Node.js
- manter a arquitetura simples
- evitar complexidade prematura
- não criar microserviços
- não introduzir filas, Redis, mensageria ou autenticação complexa nesta fase
- não publicar comentários automaticamente sem aprovação humana explícita

## Stack
- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- MongoDB local com o driver oficial mongodb
- Octokit para integração com GitHub
- OpenAI SDK no servidor
- Zod para validação de payloads estratégicos

## Regras de implementação
- sempre implementar uma spec por vez
- antes de codar, ler a spec correspondente
- não assumir requisitos não escritos
- manter componentes pequenos e reutilizáveis
- separar responsabilidades entre UI, serviços, armazenamento e rotas
- preferir código claro a abstrações excessivas
- toda lógica de GitHub e IA deve ficar no servidor
- nunca expor tokens ou segredos no cliente
- nunca publicar comentários no GitHub sem aprovação registrada no banco
- usar tipos explícitos para entidades principais
- evitar any, exceto quando for realmente inevitável e justificado

## Estrutura desejada
- app/: rotas e páginas
- components/: componentes de interface
- lib/: clientes, helpers e serviços
- models/: contratos e estruturas de dados
- types/: tipos compartilhados
- specs/: especificações dirigindo o desenvolvimento
- docs/: documentação complementar

## Fluxo funcional esperado
1. carregar PRs pendentes de review do usuário
2. abrir detalhes de um PR
3. disparar análise com IA sob demanda
4. salvar sugestões de comentários no MongoDB
5. permitir aprovar, recusar e editar sugestões
6. publicar apenas sugestões aprovadas
7. registrar status de publicação

## Critérios de qualidade
- interface simples e funcional
- estados de loading, erro e vazio devem existir
- mensagens de erro devem ser claras
- código deve ser fácil de entender e modificar
- validar entradas no servidor
- tratar falhas da API do GitHub e da IA com segurança

## Fora de escopo nesta fase
- múltiplos usuários
- login completo com OAuth
- publicação em nome de múltiplos revisores
- permissões avançadas
- processamento em background
- análise automática em tempo real
- cobertura de testes extensa
- design system sofisticado

## Modo de trabalho
Sempre seguir esta ordem:
1. ler AGENTS.md
2. ler a spec solicitada
3. propor a menor implementação funcional que atenda a spec
4. implementar
5. validar manualmente o fluxo principal
6. relatar o que foi criado e o que ficou pendente

## Diretriz de layout e experiência
- seguir uma linguagem visual inspirada no GitHub
- priorizar clareza, legibilidade e densidade informacional equilibrada
- usar layout limpo, técnico e pragmático
- suportar tema claro e escuro
- usar superfícies com bordas sutis em vez de blocos pesados
- destacar títulos e ações principais
- manter metadados com contraste secundário
- evitar visual chamativo ou excesso de elementos decorativos
- toda interface deve parecer uma ferramenta de produtividade para engenharia

## Diretriz de componentes de interface
- toda ação clicável principal deve usar componente reutilizável de botão
- evitar estilização manual repetida de botões
- descrições de Pull Request devem ser renderizadas em modo preview de Markdown, nunca como texto cru
- exibir avatar do autor em listas e detalhes sempre que disponível
- manter linguagem visual inspirada no GitHub
- priorizar contraste, legibilidade e hierarquia visual

## Diretriz de estados de carregamento
- estados de loading devem usar componente visual reutilizável em SVG
- evitar mensagens textuais simples de carregamento quando houver componente padrão disponível
- usar loading.tsx do App Router para feedback de navegação quando fizer sentido
- exibir contexto do usuário autenticado na home com avatar, nome e login

## Diretriz de shell global
- a aplicação deve possuir um header global inspirado no GitHub
- elementos globais como branding, busca, toggle de tema e avatar do usuário devem ficar no header
- páginas devem focar no conteúdo principal e evitar duplicação de elementos globais

## Diretriz temporária do header
- enquanto a busca não tiver valor funcional real, não exibir campo de pesquisa no header
- no lado direito do header exibir apenas toggle de tema, avatar e nome do usuário autenticado
- evitar elementos decorativos ou funcionais incompletos no shell global

## Diretriz de análise com IA
- toda análise de PR deve retornar estrutura previsível e tipada
- evitar respostas livres ou narrativas sem formato
- priorizar sugestões acionáveis e objetivas
- não gerar comentários automaticamente no GitHub sem fluxo de aprovação posterior
