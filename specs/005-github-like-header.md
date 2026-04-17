# Spec 005 - Header inspirado no GitHub

## Objetivo
Criar um header global inspirado no GitHub para dar mais contexto, identidade e consistência visual à aplicação.

## Valor
Melhorar familiaridade da interface, organizar elementos globais e preparar a base visual para evolução do produto.

## Requisitos funcionais
- exibir um header global no topo da aplicação
- exibir branding simples da aplicação no lado esquerdo
- exibir campo de busca visual no header
- exibir toggle de tema no header
- exibir avatar do usuário autenticado no header
- manter a página principal focada no conteúdo da lista de PRs

## Requisitos técnicos
- manter Next.js App Router com TypeScript
- criar componentes reutilizáveis para o header
- manter suporte a light e dark mode
- manter tipagem explícita
- evitar any

## Diretrizes de interface
- seguir linguagem visual inspirada no GitHub
- usar header horizontal, compacto e limpo
- usar borda inferior sutil
- manter contraste forte para branding e contraste secundário nos elementos auxiliares
- manter visual técnico e pragmático
- evitar excesso de ações ou navegação nesta fase

## Critérios de aceite
- o header aparece globalmente no topo
- o avatar do usuário e o toggle de tema passam a ficar no header
- a interface fica mais próxima visualmente do GitHub
- a home continua limpa e funcional
- o header funciona bem em light e dark mode

## Fora de escopo
- menu hambúrguer funcional
- notificações
- dropdown do usuário
- busca avançada
- navegação global complexa
