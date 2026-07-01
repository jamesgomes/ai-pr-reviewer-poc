# AGENTS.md

## Dicas de ambiente de desenvolvimento
- Este repositório usa um único app Next.js com App Router (não é monorepo).
- Use `npm install` para instalar dependências.
- Use `npm run dev` para executar localmente.
- Use `npm run build` para validar compilação de produção.
- Use `npm run start` para testar o build gerado.
- Antes de alterar código, leia este `AGENTS.md` e a spec correspondente em `specs/`.

## Instruções de teste e validação
- Atualmente não há suíte de testes automatizados configurada com `npm test`.
- Sempre execute `npm run lint` antes de concluir alterações.
- Sempre execute `npm run build` para validar TypeScript, rotas e build do Next.js.
- Faça validação manual do fluxo principal afetado pela mudança (loading, erro, vazio e caminho feliz).
- Ao alterar autenticação, valide login/logout e proteção das rotas.
- Ao alterar análise/publicação, valide o fluxo de revisão local e publicação aprovada no GitHub.

## Instruções de PR e commits
- Título sugerido: `[ai-pr-reviewer-poc] <Resumo curto>`.
- Cada PR deve implementar uma spec por vez.
- Descreva no PR:
  - qual spec foi implementada
  - o que foi alterado
  - como validar manualmente
  - pendências ou limitações
- Antes de abrir PR, confirme `npm run lint` e `npm run build` sem erros.

### Versionamento e Changelog
- Toda implementação ou correção de spec deve atualizar a versão no `package.json` conforme Versionamento Semântico 2.0.0 (MAJOR/MINOR/PATCH).
- Classificação SemVer:
  - `MAJOR`: mudança incompatível (breaking change).
  - `MINOR`: nova funcionalidade de spec sem quebra de compatibilidade.
  - `PATCH`: correção de spec (bugfix/ajuste sem nova capacidade pública).
- Toda mudança de versão deve atualizar o `CHANGELOG.md` no mesmo PR.
- O `CHANGELOG.md` deve registrar, no mínimo:
  - número da versão
  - data
  - resumo das mudanças da spec (implementação ou correção)
- Não permitir merge de implementação/correção de spec sem:
  - bump de versão
  - entrada correspondente no `CHANGELOG.md`
- Regra padrão do repositório:
  - seguir SemVer estrito mesmo em `0.x`
  - tratar correção de spec como `PATCH` por padrão
  - manter fluxo de release contínuo por spec (sem PR separado apenas para release/changelog)

## Objetivo do projeto
Este projeto é uma POC local para auxiliar revisão de Pull Requests com apoio de IA.

Fluxo funcional esperado:
1. Buscar PRs onde o usuário foi solicitado como reviewer.
2. Exibir a lista desses PRs.
3. Permitir selecionar um PR.
4. Analisar o PR com IA sob demanda.
5. Listar sugestões de comentários.
6. Permitir aprovar, recusar ou editar sugestões.
7. Publicar no GitHub somente as sugestões aprovadas.

## Stack oficial
- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Octokit para integração com GitHub
- Claude (Anthropic) como provedor de IA padrão no servidor via SDK oficial `@anthropic-ai/sdk`
- OpenAI SDK no servidor como provedor de IA alternativo (selecionável por `AI_PROVIDER`)
- Zod para validação de payloads estratégicos
- MongoDB local com driver oficial `mongodb` (planejado na arquitetura)

## Restrições e escopo da fase
- Esta é uma POC local.
- Manter arquitetura simples e sem complexidade prematura.
- Não criar microserviços.
- Não introduzir filas, Redis ou mensageria nesta fase.
- Não publicar comentários automaticamente sem aprovação humana explícita.
- Fora de escopo nesta fase:
  - múltiplos usuários
  - login completo com OAuth avançado
  - publicação em nome de múltiplos revisores
  - permissões avançadas
  - processamento em background
  - análise automática em tempo real
  - cobertura extensa de testes
  - design system sofisticado

## Regras de implementação
- Sempre implementar uma spec por vez.
- Nunca assumir requisito que não esteja escrito na spec.
- Preferir a menor implementação funcional que atenda a spec.
- Separar responsabilidades entre UI, serviços, armazenamento e rotas.
- Manter componentes pequenos e reutilizáveis.
- Preferir código claro a abstrações excessivas.
- Evitar `any`, exceto quando inevitável e justificado.
- Usar tipos explícitos para entidades principais.
- Toda lógica de GitHub e IA deve ficar no servidor.
- Nunca expor tokens ou segredos no cliente.

## Estrutura desejada
- `app/`: rotas e páginas
- `components/`: componentes de interface
- `lib/`: clientes, helpers e serviços
- `models/`: contratos e estruturas de dados
- `types/`: tipos compartilhados
- `specs/`: especificações que dirigem o desenvolvimento
- `docs/`: documentação complementar

## Diretrizes de layout e experiência
- Linguagem visual inspirada no GitHub.
- Layout limpo, técnico e pragmático.
- Priorizar clareza, legibilidade e hierarquia visual.
- Suportar tema claro e escuro.
- Usar superfícies com bordas sutis, sem visual chamativo.
- Destacar títulos e ações principais.
- Metadados com contraste secundário.

## Diretrizes de componentes de interface
- Toda ação clicável principal deve usar componente reutilizável de botão.
- Evitar estilização manual repetida de botões.
- Descrição de Pull Request deve ser renderizada com preview de Markdown.
- Exibir avatar do autor em listas e detalhes quando disponível.

## Diretrizes de loading
- Estados de loading devem usar componente SVG reutilizável padrão.
- Evitar texto simples de carregamento quando houver componente padrão.
- Usar `loading.tsx` do App Router quando fizer sentido.
- Exibir contexto do usuário autenticado na home (avatar, nome e login).

## Diretrizes do shell global
- A aplicação deve ter header global inspirado no GitHub.
- Elementos globais (branding, toggle de tema, avatar/nome) ficam no header.
- Evitar duplicação de elementos globais nas páginas.
- Diretriz temporária: não exibir campo de busca no header enquanto não houver valor funcional real.

## Diretrizes de análise e publicação
- A análise de PR deve retornar estrutura previsível e tipada.
- Evitar respostas livres sem formato para sugestões.
- Priorizar sugestões acionáveis e objetivas.
- Nunca publicar comentários no GitHub sem aprovação explícita.
- Preferir comentário inline quando houver contexto confiável.
- Usar fallback consolidado quando inline não for seguro.

## Diretrizes de persistência na POC
- Nesta fase, análises e decisões do usuário devem ser persistidas localmente no navegador.
- Usar `localStorage` para preservar progresso entre recarregamentos.
- Isolar persistência por usuário autenticado.
- Evitar introduzir banco de dados antes da validação funcional completa da POC.

## Modo de trabalho
Seguir esta ordem:
1. Ler `AGENTS.md`.
2. Ler a spec solicitada.
3. Propor a menor implementação funcional para a spec.
4. Implementar.
5. Validar manualmente o fluxo principal.
6. Relatar o que foi criado e o que ficou pendente.
