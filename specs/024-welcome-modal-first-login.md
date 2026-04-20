# Spec 024 - Modal de boas-vindas na primeira entrada após login

## Objetivo
Exibir uma modal de boas-vindas para apresentar rapidamente a aplicação ao usuário autenticado, apenas na primeira vez em que ele acessar o produto.

## Valor
Ajudar novos usuários a entender o propósito e o fluxo da aplicação sem poluir a experiência de uso recorrente.

## Escopo
Esta spec cobre:
- exibição de uma modal de boas-vindas
- exibição apenas na primeira vez após login
- persistência local por usuário para não repetir a modal
- conteúdo curto e orientado a onboarding

## Requisitos funcionais

### Regra principal
- a modal deve ser exibida apenas para usuários autenticados
- a modal deve aparecer apenas na primeira vez em que o usuário acessar a aplicação após login
- após fechamento/continuação, a aplicação não deve mostrar novamente a modal para o mesmo usuário no mesmo navegador

### Persistência
- usar localStorage
- a chave deve ser isolada por usuário autenticado

Formato sugerido:
ai-reviewer:welcome-modal-seen:<githubUserId>

Fallback:
ai-reviewer:welcome-modal-seen:<githubLogin>

### Conteúdo da modal
A modal deve apresentar, de forma curta:

#### Título
- Bem-vindo ao AI Reviewer

#### Descrição
- explicar em poucas linhas o propósito da aplicação

#### Passos de uso
- selecionar um Pull Request
- gerar análise com IA
- revisar e publicar comentários aprovados no GitHub

### Ações
- botão principal: Começar
- ação secundária opcional:
  - Não mostrar novamente
ou
  - Fechar

Observação:
- se existir apenas o botão "Começar", ao clicar ele já deve marcar a modal como vista

## Requisitos técnicos
- manter Next.js com App Router
- manter TypeScript
- usar componente reutilizável de modal
- usar localStorage apenas no cliente
- manter tipagem explícita
- evitar any
- manter compatibilidade com light/dark mode

## Diretrizes de interface
- modal centralizada
- visual limpo, compatível com o restante do produto
- texto curto e objetivo
- não transformar a modal em página de marketing
- manter aparência de onboarding leve e profissional

## Critérios de aceite
- a modal aparece apenas para usuários autenticados
- a modal aparece apenas na primeira vez para cada usuário no navegador atual
- após ser fechada/confirmada, não reaparece para o mesmo usuário
- usuários diferentes no mesmo navegador podem ter comportamento independente
- a interface continua consistente com o restante da aplicação

## Fora de escopo
- banco de dados
- onboarding multi-etapas
- tour guiado
- vídeos ou mídia rica
- sincronização do estado da modal entre dispositivos
