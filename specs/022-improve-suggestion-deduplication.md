# Spec 022 - Fortalecer deduplicação de sugestões publicadas

## Objetivo
Melhorar a lógica de deduplicação das sugestões já publicadas para evitar reaparição do mesmo achado em reanálises, mesmo quando houver pequenas variações de título, linha ou redação.

## Valor
Aumentar a confiabilidade da reanálise, reduzindo duplicidade de comentários e respeitando melhor o histórico já publicado.

## Escopo
Esta spec cobre:
- refinamento da regra de equivalência entre sugestões
- deduplicação mais tolerante a pequenas variações
- preservação do fluxo atual de análise e publicação

## Requisitos funcionais
- sugestões já publicadas não devem reaparecer como novas quando representarem o mesmo achado, mesmo com pequenas mudanças de linha ou redação
- a deduplicação deve continuar permitindo sugestões realmente novas
- a deduplicação deve comparar novas sugestões com as já publicadas preservadas no estado local

## Requisitos técnicos
- manter Next.js App Router com TypeScript
- manter persistência local
- manter tipagem explícita
- evitar any
- não exigir banco de dados nesta fase

## Regras de equivalência
Uma sugestão nova pode ser considerada equivalente a uma já publicada quando houver combinação suficiente entre:
- filePath igual
- category igual
- kind igual
- line igual ou próxima dentro de uma tolerância definida
- título ou descrição suficientemente similares após normalização

## Estratégia sugerida
- manter um identificador rígido para match exato
- adicionar uma verificação flexível para match aproximado
- normalizar textos para comparação:
  - lowercase
  - remover acentos
  - remover pontuação
  - remover espaços duplicados
- aplicar tolerância de linha, por exemplo diferença absoluta pequena

## Critérios de aceite
- sugestões duplicadas com pequenas variações de título ou linha deixam de reaparecer
- sugestões realmente novas continuam aparecendo
- o estado de sugestões já publicadas continua preservado
- não há regressão no fluxo atual de análise e publicação

## Fora de escopo
- deduplicação semântica avançada por embeddings
- leitura de comentários existentes no GitHub
- banco de dados
