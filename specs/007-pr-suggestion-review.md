# Spec 007 - Aprovação, rejeição e edição de sugestões

## Objetivo
Permitir que o usuário revise as sugestões geradas pela IA antes de utilizá-las.

## Valor
Garantir controle humano sobre a análise, evitando comentários incorretos ou desnecessários.

## Requisitos funcionais
- exibir lista de sugestões geradas pela IA
- permitir aprovar uma sugestão
- permitir rejeitar uma sugestão
- permitir editar o comentário sugerido
- manter estado de cada sugestão:
  - pending
  - approved
  - rejected
- destacar visualmente o estado de cada sugestão

## Requisitos técnicos
- usar estado local inicialmente (sem persistência obrigatória)
- tipagem explícita para sugestões
- manter compatibilidade com light/dark
- evitar any

## Estrutura da sugestão (extendida)
Cada sugestão deve ter:

- id
- severity
- category
- title
- description
- suggestedComment
- filePath
- line
- status (pending | approved | rejected)
- editedComment (string opcional)

## Interface

Cada sugestão deve exibir:
- severity (badge)
- category (badge)
- título
- descrição
- comentário sugerido

Ações:
- botão "Aprovar"
- botão "Rejeitar"
- botão "Editar"

Se editar:
- transformar comentário em textarea
- permitir salvar edição

## Estados visuais
- pending → neutro
- approved → destaque verde
- rejected → destaque discreto (ou cinza)

## Critérios de aceite
- usuário consegue aprovar uma sugestão
- usuário consegue rejeitar uma sugestão
- usuário consegue editar o comentário
- estado da sugestão é atualizado na UI
- interface permanece clara e organizada

## Fora de escopo
- persistência no banco
- publicação no GitHub
- comentários inline por linha
