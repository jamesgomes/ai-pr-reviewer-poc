# Spec 010 - Publicar sugestões aprovadas no GitHub

## Objetivo
Permitir que o usuário publique no GitHub as sugestões aprovadas como comentário no Pull Request.

## Valor
Fechar o ciclo do produto, transformando sugestões da IA em ações reais dentro do fluxo de code review.

## Escopo
Esta spec cobre:
- publicação de sugestões aprovadas
- envio de comentário consolidado no PR
- feedback de sucesso ou erro
- marcação local como publicado

## Requisitos funcionais
- exibir botão "Publicar no GitHub"
- habilitar botão apenas quando houver sugestões aprovadas
- ao clicar, coletar sugestões com status approved
- usar editedComment quando existir
- enviar comentário para o PR no GitHub
- exibir feedback de sucesso ou erro
- marcar sugestões como publicadas localmente

## Requisitos técnicos
- usar GitHub API via backend
- usar token já configurado
- não expor token no frontend
- manter TypeScript
- manter tipagem explícita
- evitar any

## Formato do comentário

O comentário deve ser consolidado e estruturado:

### Exemplo

## 🤖 AI PR Review

Resumo:
<summary>

Sugestões aprovadas:

### 1. <título>
Arquivo: <filePath>:<line>

<comentário>

---

### 2. <título>
...

---

Gerado por AI PR Reviewer

## Regras
- incluir apenas sugestões aprovadas
- usar editedComment se existir
- manter formatação limpa
- evitar excesso de texto

## Interface

- botão "Publicar no GitHub"
- loading durante envio
- mensagem de sucesso
- mensagem de erro

## Estados
- idle
- publishing
- success
- error

## Persistência local
Após publicação:
- marcar sugestões como `published: true`
- evitar reenvio duplicado

## Critérios de aceite
- botão aparece apenas quando há sugestões aprovadas
- comentário é publicado no PR
- feedback visual é exibido
- sugestões são marcadas como publicadas
- usuário não consegue publicar novamente as mesmas sugestões sem nova análise

## Fora de escopo
- comentários inline por linha
- múltiplos comentários separados
- edição após publicação
- sincronização com GitHub
