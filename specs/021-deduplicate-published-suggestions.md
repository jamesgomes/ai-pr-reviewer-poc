# Spec 021 - Deduplicação de sugestões já publicadas

## Objetivo
Evitar que a reanálise de um Pull Request volte a sugerir comentários que já foram aprovados e publicados anteriormente pela aplicação.

## Valor
Aumentar a confiança no produto, impedindo duplicidade de comentários e respeitando o histórico de revisão já realizado no PR.

## Escopo
Esta spec cobre:
- deduplicação de sugestões já publicadas
- uso da persistência local como fonte principal nesta fase
- filtragem de sugestões duplicadas na reanálise
- preservação do fluxo atual de análise e publicação

## Requisitos funcionais

### Regra principal
- ao reexecutar a análise de um PR, sugestões já publicadas anteriormente não devem reaparecer como novas sugestões pendentes

### Fonte de verdade nesta fase
- usar a persistência local atual como fonte principal de deduplicação
- não depender obrigatoriamente de leitura de comentários já existentes no GitHub nesta spec

### Critério de duplicidade
Uma sugestão nova deve ser considerada equivalente a uma sugestão já publicada quando houver compatibilidade suficiente entre:
- filePath
- line
- category
- title
- ou outro identificador estável equivalente definido pela implementação

### Comportamento esperado
- se a nova análise gerar uma sugestão equivalente a outra já publicada anteriormente, essa sugestão não deve ser exibida como nova pendência
- sugestões não duplicadas devem continuar aparecendo normalmente
- a reanálise pode substituir o resumo geral (`summary`) sem perder o histórico de sugestões já publicadas
- o estado atual das sugestões já publicadas deve continuar preservado

## Requisitos técnicos
- manter Next.js App Router com TypeScript
- manter persistência local
- manter tipagem explícita
- evitar any
- não exigir banco de dados nesta fase
- não alterar a autenticação existente
- manter compatibilidade com light/dark mode

## Estratégia sugerida
- criar um identificador estável da sugestão com base em campos relevantes
- usar esse identificador para comparar sugestões novas com sugestões já publicadas
- durante a reanálise:
  - preservar sugestões já publicadas
  - filtrar sugestões novas que sejam equivalentes às já publicadas
  - adicionar apenas sugestões realmente novas ao estado final

## Regras de interface
- sugestões já publicadas anteriormente não devem reaparecer como novas pendências
- manter a visualização atual das sugestões publicadas
- manter a experiência da reanálise clara e previsível

## Critérios de aceite
- ao reanalisar um PR, sugestões já publicadas não reaparecem como novas
- sugestões novas continuam sendo exibidas normalmente
- o resumo da análise pode ser atualizado sem duplicar sugestões já publicadas
- a publicação anterior continua visível no estado local
- o fluxo atual de análise, revisão e publicação continua funcionando

## Fora de escopo
- leitura e deduplicação com base em comentários já existentes no GitHub
- sincronização bidirecional com GitHub
- deduplicação semântica avançada por embeddings ou similaridade complexa
- banco de dados
