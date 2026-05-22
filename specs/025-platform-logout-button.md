# Spec 025 - Botão de sair da plataforma

## Problem Statement

Atualmente o usuário autenticado não possui uma ação explícita de logout no header. Isso reduz previsibilidade do fluxo de sessão e dificulta trocar de conta no mesmo navegador durante validações do MVP.

## Goals

- [ ] Usuário autenticado consegue encerrar sessão com um clique no header.
- [ ] Após logout, o usuário retorna para `/login` e áreas protegidas voltam a exigir autenticação.
- [ ] A experiência visual do shell global permanece consistente em light e dark mode.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
| --- | --- |
| Confirmação modal antes de sair | Aumenta atrito sem requisito de segurança adicional nesta fase |
| Menu dropdown de conta | Não é necessário para o MVP desta capability |
| Múltiplas contas simultâneas | Fora do escopo funcional do produto nesta fase |
| Invalidação de sessão em múltiplos dispositivos | Exige estratégia adicional de sessão fora do MVP |

---

## User Stories

### P1: Logout explícito no header ⭐ MVP

**User Story**: Como usuário autenticado, quero clicar em "Sair" no header para encerrar minha sessão com clareza.

**Why P1**: Sem essa ação, o fluxo de autenticação do MVP fica incompleto para uso real e testes com múltiplas contas.

**Acceptance Criteria**:

1. WHEN existir sessão autenticada THEN o sistema SHALL exibir o botão "Sair" no cluster direito do header.
2. WHEN não existir sessão autenticada THEN o sistema SHALL não exibir o botão "Sair".
3. WHEN o usuário clicar em "Sair" THEN o sistema SHALL encerrar a sessão atual e redirecionar para `/login`.
4. WHEN a sessão for encerrada THEN o sistema SHALL bloquear acesso à home e à página de detalhe de PR até novo login.

**Independent Test**: Com usuário autenticado, clicar em "Sair", confirmar redirecionamento para `/login` e confirmar que `/` redireciona para login sem nova autenticação.

---

### P2: Consistência visual do shell

**User Story**: Como usuário da plataforma, quero que a ação de logout siga o padrão visual do header para manter legibilidade e consistência.

**Why P2**: Preserva qualidade de interface e evita regressões no layout global.

**Acceptance Criteria**:

1. WHEN o botão "Sair" estiver visível THEN o sistema SHALL manter alinhamento com toggle de tema e resumo do usuário no header.
2. WHEN o tema alternar entre claro e escuro THEN o sistema SHALL manter contraste e legibilidade adequados do botão "Sair".

**Independent Test**: Validar header em light/dark com usuário autenticado, verificando alinhamento e contraste do botão.

---

### P3: Resiliência de UX no logout

**User Story**: Como usuário, quero um comportamento previsível no logout mesmo após navegação interna para não ficar em estado inconsistente.

**Why P3**: Reduz chance de confusão com sessão parcialmente ativa no cliente.

**Acceptance Criteria**:

1. WHEN logout for acionado de qualquer página autenticada THEN o sistema SHALL concluir o redirecionamento para `/login` sem exigir refresh manual.

---

## Edge Cases

- WHEN o usuário estiver na página de detalhe de PR e clicar em "Sair" THEN o sistema SHALL encerrar sessão e redirecionar para `/login`.
- WHEN o usuário tentar acessar rota protegida após logout via URL direta THEN o sistema SHALL redirecionar para login.
- WHEN o botão "Sair" for acionado mais de uma vez em sequência THEN o sistema SHALL manter estado consistente e permanecer no fluxo de login.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| AUTH-LOGOUT-01 | P1: Logout explícito no header | Design | Pending |
| AUTH-LOGOUT-02 | P1: Logout explícito no header | Design | Pending |
| AUTH-LOGOUT-03 | P1: Logout explícito no header | Design | Pending |
| AUTH-LOGOUT-04 | P1: Logout explícito no header | Design | Pending |
| AUTH-LOGOUT-05 | P2: Consistência visual do shell | Design | Pending |
| AUTH-LOGOUT-06 | P2: Consistência visual do shell | Design | Pending |
| AUTH-LOGOUT-07 | P3: Resiliência de UX no logout | Design | Pending |

Coverage: 7 total, 0 mapped to tasks, 7 unmapped.

---

## Success Criteria

- [ ] Usuário autenticado sempre encontra a ação "Sair" no header.
- [ ] Logout sempre redireciona para `/login` e invalida acesso às rotas protegidas.
- [ ] Não há regressão visual no header em light e dark mode.
