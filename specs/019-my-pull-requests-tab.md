# Spec 019 - Aba de Meus PRs

## Objetivo
Adicionar uma aba "Meus PRs" na home para exibir Pull Requests criados pelo usuário autenticado, permitindo análise com IA antes ou durante o processo de revisão.

## Valor
Expandir o produto para atender também o autor do Pull Request, permitindo auto-revisão e melhoria do PR antes da revisão do time.

## Escopo
Esta spec cobre:
- criação da aba "Meus PRs"
- classificação dos PRs por autoria
- exibição dos PRs criados pelo usuário autenticado
- navegação normal para o detalhe do PR
- reaproveitamento do fluxo atual de análise e persistência local

## Requisitos funcionais

### Abas
A home deve passar a exibir três abas:
- Pendentes
- Meus PRs
- Revisados

### Classificação dos PRs
A classificação deve seguir estas regras de prioridade:

1. se o PR foi criado pelo usuário autenticado, ele deve aparecer em "Meus PRs"
2. se não é do usuário autenticado e existe persistência local com pelo menos uma sugestão publicada, ele deve aparecer em "Revisados"
3. caso contrário, deve aparecer em "Pendentes"

### Regra de autoria
Um PR deve ser considerado "meu" quando:
- o autor do PR tiver o mesmo login do usuário autenticado

### Comportamento da aba "Meus PRs"
- exibir apenas PRs criados pelo usuário autenticado
- permitir abrir normalmente a página de detalhe
- permitir executar a análise com IA
- permitir revisão local das sugestões
- manter persistência local do fluxo existente

## Requisitos técnicos
- manter Next.js com App Router
- manter TypeScript
- usar o usuário autenticado já existente como fonte de verdade
- manter persistência local atual
- manter tipagem explícita
- evitar any
- manter compatibilidade com light/dark mode

## Regras de interface

### Home
- adicionar a nova aba "Meus PRs" ao lado das abas existentes
- exibir contador da aba:
  - Meus PRs (X)

### Itens de lista
Na aba "Meus PRs", os PRs podem exibir um indicativo visual discreto de autoria, como:
- badge "Meu PR"
ou
- texto secundário indicando autoria

### Estado vazio
Se não houver PRs na aba "Meus PRs", exibir estado vazio amigável, por exemplo:
- "Você ainda não criou Pull Requests visíveis para esta conta."

## Regras de persistência local
A lógica atual de persistência local deve continuar funcionando normalmente para PRs próprios.

## Critérios de aceite
- a home exibe a aba "Meus PRs"
- a contagem da aba é calculada corretamente
- PRs criados pelo usuário autenticado aparecem em "Meus PRs"
- PRs próprios não aparecem em "Pendentes" nem em "Revisados"
- a navegação para o detalhe continua funcionando
- o fluxo de análise com IA continua funcionando para PRs próprios
- a interface permanece consistente com o restante do produto

## Fora de escopo
- filtros adicionais por status do PR
- distinção entre PR draft e aberto
- comportamento especial de publicação para PRs próprios
- mudanças no fluxo de publicação do GitHub
- histórico centralizado em banco de dados
