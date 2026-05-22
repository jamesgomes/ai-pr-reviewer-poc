# Spec 026 - Aprovação de Pull Request na página de análise

## Problem Statement

Hoje a página de análise permite revisar sugestões e publicar comentários, mas não permite concluir a revisão com uma aprovação formal do Pull Request no GitHub. Isso força o usuário a sair da ferramenta para aprovar manualmente no GitHub, quebrando o fluxo principal do produto.

## Goals

- [ ] Permitir aprovar o Pull Request diretamente na página de análise.
- [ ] Exibir feedback claro de sucesso/erro da aprovação sem sair da aplicação.
- [ ] Persistir localmente o estado de aprovação por usuário e por PR para manter continuidade entre recarregamentos.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
| --- | --- |
| Merge automático do Pull Request | Fluxo de aprovação e fluxo de merge são responsabilidades distintas |
| Aprovação automática sem ação explícita do usuário | Viola a diretriz de controle humano explícito |
| "Request changes" e comentário geral de review em texto livre | Fase atual foca somente no evento de aprovação |
| Sincronização completa do estado de aprovação com histórico do GitHub em tempo real | A POC mantém persistência local como fonte primária de progresso |

---

## User Stories

### P1: Aprovar PR sem sair da tela de análise ⭐ MVP

**User Story**: Como revisor autenticado, quero aprovar o Pull Request na página de análise para concluir minha revisão sem alternar para o GitHub.

**Why P1**: Fecha o ciclo principal de revisão dentro do produto e reduz fricção operacional.

**Acceptance Criteria**:

1. WHEN o usuário autenticado abrir a página de análise de um PR aberto THEN o sistema SHALL exibir uma ação explícita "Aprovar PR no GitHub".
2. WHEN o usuário clicar em "Aprovar PR no GitHub" THEN o sistema SHALL enviar a aprovação para o GitHub usando o contexto do usuário autenticado.
3. WHEN a aprovação for concluída com sucesso THEN o sistema SHALL exibir feedback de sucesso na interface.
4. WHEN houver falha na aprovação THEN o sistema SHALL exibir mensagem de erro clara e não marcar o PR como aprovado localmente.
5. WHEN o PR não estiver em estado aberto THEN o sistema SHALL desabilitar ou ocultar a ação de aprovação e informar o motivo.
6. WHEN o PR tiver sido aberto pelo próprio usuário autenticado THEN o sistema SHALL manter a ação de aprovação desabilitada e informar que autor do PR não pode aprovar a própria alteração nesse fluxo.

**Independent Test**: Em um PR aberto, acionar a aprovação pela tela de análise e confirmar que o status de review no GitHub foi registrado como aprovado pela conta autenticada.

---

### P2: Persistência local do estado de aprovação

**User Story**: Como revisor, quero que o estado de aprovação permaneça salvo localmente para retomar o contexto após recarregar a página.

**Why P2**: Mantém consistência com a estratégia atual da POC de progresso local por usuário.

**Acceptance Criteria**:

1. WHEN a aprovação no GitHub for bem-sucedida THEN o sistema SHALL persistir localmente o status de aprovação por usuário/owner/repo/PR.
2. WHEN a página de análise for recarregada THEN o sistema SHALL restaurar o estado local de aprovação e refletir o status na interface.
3. WHEN a aprovação já estiver registrada localmente THEN o sistema SHALL evitar nova submissão acidental por clique repetido.

**Independent Test**: Aprovar um PR, recarregar a página e confirmar que o status aprovado permanece visível sem nova chamada de aprovação.

---

### P3: Integração com indicadores de revisão da home

**User Story**: Como revisor, quero que PRs aprovados apareçam como revisados na home, mesmo quando não houver publicação de comentários.

**Why P3**: A aprovação formal é um sinal de revisão concluída e deve alimentar os filtros de acompanhamento.

**Acceptance Criteria**:

1. WHEN um PR for aprovado com sucesso na página de análise THEN o sistema SHALL considerar esse PR como revisado nos indicadores locais da home.
2. WHEN não houver comentários publicados, mas houver aprovação registrada THEN o sistema SHALL manter classificação de PR revisado.

**Independent Test**: Aprovar PR sem publicar comentários e validar que ele aparece como revisado na home.

---

## Edge Cases

- WHEN a sessão expirar durante a aprovação THEN o sistema SHALL retornar erro de sessão e exigir novo login.
- WHEN houver erro de permissão no repositório (ex.: usuário sem poder de review) THEN o sistema SHALL exibir erro claro sem marcar aprovação local.
- WHEN o usuário disparar múltiplos cliques rápidos na ação de aprovação THEN o sistema SHALL processar apenas uma tentativa por vez.
- WHEN a API do GitHub retornar erro transitório THEN o sistema SHALL manter o estado local inalterado e permitir nova tentativa manual.
- WHEN o autor do PR for o mesmo usuário autenticado THEN o sistema SHALL bloquear a aprovação na interface antes da chamada da API.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| PR-APPROVAL-01 | P1: Aprovar PR sem sair da tela de análise | Design | Pending |
| PR-APPROVAL-02 | P1: Aprovar PR sem sair da tela de análise | Design | Pending |
| PR-APPROVAL-03 | P1: Aprovar PR sem sair da tela de análise | Design | Pending |
| PR-APPROVAL-04 | P1: Aprovar PR sem sair da tela de análise | Design | Pending |
| PR-APPROVAL-05 | P1: Aprovar PR sem sair da tela de análise | Design | Pending |
| PR-APPROVAL-11 | P1: Aprovar PR sem sair da tela de análise | Design | Pending |
| PR-APPROVAL-06 | P2: Persistência local do estado de aprovação | Design | Pending |
| PR-APPROVAL-07 | P2: Persistência local do estado de aprovação | Design | Pending |
| PR-APPROVAL-08 | P2: Persistência local do estado de aprovação | Design | Pending |
| PR-APPROVAL-09 | P3: Integração com indicadores de revisão da home | Design | Pending |
| PR-APPROVAL-10 | P3: Integração com indicadores de revisão da home | Design | Pending |

Coverage: 11 total, 0 mapped to tasks, 11 unmapped.

---

## Success Criteria

- [ ] Revisor aprova PR diretamente na página de análise com feedback claro.
- [ ] Estado de aprovação persiste localmente por usuário e PR.
- [ ] Home classifica PR aprovado como revisado, mesmo sem comentários publicados.
