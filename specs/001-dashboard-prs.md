# Spec 001 - Dashboard de PRs pendentes de revisão

## Objetivo
Exibir uma lista de Pull Requests abertos onde o usuário autenticado foi solicitado como reviewer.

## Valor
Permitir que o usuário visualize rapidamente sua fila de PRs para revisão.

## Requisitos funcionais
- exibir uma página inicial com a lista de PRs
- buscar PRs abertos onde o usuário foi solicitado como reviewer
- exibir título, repositório, autor, número do PR e data de atualização
- permitir clicar em um item para abrir a tela de detalhes do PR

## Requisitos técnicos
- usar Next.js com App Router
- usar route handler no servidor para buscar dados do GitHub
- usar Octokit no servidor
- usar variáveis de ambiente para token e usuário GitHub
- usar TypeScript nos arquivos implementados

## Estados da interface
- loading
- erro
- lista vazia
- lista carregada

## Critérios de aceite
- ao abrir a aplicação, a lista deve carregar
- se não houver PRs, mostrar estado vazio
- se o GitHub falhar, mostrar mensagem de erro clara
- ao clicar em um PR, navegar para uma página de detalhes

## Fora de escopo
- análise por IA
- aprovação de sugestões
- publicação de comentários
