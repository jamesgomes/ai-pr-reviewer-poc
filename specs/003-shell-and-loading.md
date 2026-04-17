# Spec 003 - Shell inicial e estados de loading

## Objetivo
Melhorar a experiência base da aplicação exibindo informações do usuário autenticado e padronizando os estados de carregamento.

## Valor
Dar mais contexto ao usuário, melhorar percepção de velocidade e criar consistência visual antes das próximas funcionalidades.

## Requisitos funcionais
- exibir na home a foto, nome e login do usuário autenticado no GitHub
- substituir o texto "Carregando PRs pendentes..." por um loading visual em SVG
- exibir loading ao carregar a lista de PRs
- exibir loading ao abrir a página de detalhes de um PR
- reutilizar o mesmo componente de loading nos fluxos principais

## Requisitos técnicos
- buscar dados do usuário autenticado no servidor via GitHub API
- criar um componente reutilizável de loading em SVG
- usar o loading na home e na navegação/detalhe do PR
- manter compatibilidade com light e dark mode
- manter tipagem explícita em TypeScript

## Diretrizes de interface
- exibir o usuário no topo da home, alinhado com o layout atual
- o loading deve ser discreto, técnico e compatível com a linguagem visual inspirada no GitHub
- o loading não deve poluir a interface
- manter consistência visual entre lista e detalhe

## Critérios de aceite
- a home exibe avatar, nome e login do usuário autenticado
- o texto de loading da lista é substituído por loading SVG
- ao abrir um PR, existe feedback visual de carregamento
- o loading funciona em light e dark mode
- a experiência continua limpa e pragmática

## Fora de escopo
- edição de perfil
- múltiplos usuários
- skeleton complexo por item
- animações avançadas
