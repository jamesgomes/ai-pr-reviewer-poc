# Changelog

Este arquivo documenta as mudanças relevantes do projeto.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento semântico.

## [Não publicado]

### Adicionado
- Sem mudanças registradas no momento.

## [0.4.0] - 2026-07-01

### Adicionado
- Integração com o Claude (Anthropic) como provedor de análise de PR, usando o SDK oficial `@anthropic-ai/sdk` e saída estruturada via `messages.parse()` com `zodOutputFormat`, validada contra `pullRequestAnalysisResultSchema` (spec 027).
- Nova camada de despacho de provedor (`lib/ai-provider.ts`) que seleciona entre Claude e OpenAI por variável de ambiente, com o Claude como provedor padrão.

### Alterado
- A rota `analyze` passa a chamar a função de despacho `analyzePullRequest`, sem referenciar um provedor específico.
- Leitura das instruções de análise extraída para `lib/pr-analysis-instructions.ts`, compartilhada entre os provedores Claude e OpenAI (comportamento da OpenAI mantido).
- Novas variáveis de ambiente: `AI_PROVIDER` (opcional, padrão `claude`), `ANTHROPIC_API_KEY` (obrigatória para o Claude) e `ANTHROPIC_MODEL` (opcional, padrão `claude-sonnet-5`).
- Análise do Claude com `thinking` desativado para reduzir o consumo de tokens.

## [0.3.0] - 2026-05-22

### Alterado
- Atualização de versão do projeto para `0.3.0`.
- Implementada a aprovação de Pull Request na página de análise com ação explícita na interface.
- Adicionada nova API `POST /api/pull-requests/[owner]/[repo]/[number]/approve` para registrar aprovação no GitHub.
- Incluída persistência local do estado de aprovação por usuário/PR e integração com status de PR revisado na home.

## [0.2.0] - 2026-05-22

### Alterado
- Atualização de versão do projeto para `0.2.0`.
- Aprimorado o prompt de análise de PR em `docs/prompts/pr-analysis-instructions.md` com:
  - seção de análise de contexto baseada apenas em evidências disponíveis
  - checklist de revisão (segurança, testes, estilo/consistência, performance, observabilidade e GitHub Actions)
  - diretrizes de comunicação em pt-BR com foco em sugestões construtivas e explicação de impacto

## [0.1.2] - 2026-05-22

### Alterado
- Atualização de versão do projeto para `0.1.2`.

## [0.1.1] - 2026-05-22

### Observação
- Versão base registrada no changelog.
- Histórico detalhado anterior a este ponto não foi retroativamente catalogado.
