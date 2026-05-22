# Changelog

Este arquivo documenta as mudanças relevantes do projeto.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento semântico.

## [Não publicado]

### Adicionado
- Sem mudanças registradas no momento.

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
