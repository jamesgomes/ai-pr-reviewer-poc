# Spec 018 - Revisão de textos em Português (PT-BR)

## Objetivo
Corrigir ortografia, acentuação e padronizar os textos da interface para Português do Brasil (PT-BR), garantindo clareza e consistência.

## Escopo
- corrigir erros de português (acentos, concordância, grafia)
- padronizar textos para PT-BR
- melhorar clareza das mensagens
- manter consistência entre telas

## Diretrizes

### Idioma
- usar Português do Brasil (PT-BR)
- evitar termos em português de Portugal
- manter termos técnicos consagrados em inglês (ex: Pull Request, PR)

### Estilo
- frases curtas e diretas
- evitar redundância
- evitar linguagem rebuscada
- foco em clareza

### Terminologia padrão
Padronizar os termos abaixo:

- "Pull Request" (não traduzir)
- "PR"
- "Sugestões"
- "Revisão"
- "Comentário"
- "Publicado"
- "Pendente"
- "Revisado"
- "Análise com IA"

### Regras importantes
- não alterar nomes de variáveis, enums ou constantes
- não alterar chaves usadas em lógica
- não alterar contratos de API
- não alterar textos usados como identificadores técnicos
- apenas alterar textos exibidos ao usuário

## Exemplos de correção

Antes:
- "Analise com IA"
- "Sugestoes"
- "Revisao"
- "Nao foi possivel executar a analise"
- "Comentario para publicar no review"

Depois:
- "Análise com IA"
- "Sugestões"
- "Revisão"
- "Não foi possível analisar o PR"
- "Comentário sugerido para revisão"

## Critérios de aceite
- todos os textos estão com acentuação correta
- uso consistente de PT-BR
- textos mais claros e diretos
- nenhuma quebra funcional
- nenhuma alteração em lógica de negócio

## Fora de escopo
- internacionalização (i18n)
- tradução para outros idiomas
- refatoração de código
