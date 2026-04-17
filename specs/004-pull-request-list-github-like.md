# Spec 004 - Lista de Pull Requests inspirada no GitHub

## Objetivo
Refinar a lista de Pull Requests da home para ficar visualmente mais próxima da listagem do GitHub.

## Valor
Melhorar legibilidade, densidade informacional e familiaridade da interface para usuários acostumados com GitHub.

## Requisitos funcionais
- exibir os Pull Requests em formato de lista compacta
- tornar cada linha da lista clicável para abrir o detalhe do PR
- exibir título do PR com destaque
- exibir repositório, número do PR, autor e data em metadados secundários
- exibir avatar do autor
- exibir um indicador visual de status do PR
- preparar uma área à direita para comentários/contadores, quando disponível
- remover a necessidade de um botão explícito "Ver detalhes" em cada item

## Requisitos técnicos
- manter Next.js App Router com TypeScript
- manter suporte a light e dark mode
- criar componentes reutilizáveis para a linha do PR, metadados e status visual
- manter tipagem explícita
- evitar any

## Diretrizes de interface
- seguir linguagem visual inspirada no GitHub
- usar container único com borda externa e divisórias internas
- reduzir espaçamento vertical excessivo
- priorizar densidade informacional equilibrada
- usar hover sutil
- destacar título na primeira linha
- manter metadados em contraste secundário
- manter visual técnico, limpo e pragmático

## Critérios de aceite
- a lista da home deixa de parecer uma coleção de cards isolados
- os PRs passam a ser exibidos como linhas compactas
- a linha inteira é clicável
- o botão "Ver detalhes" deixa de ser necessário
- a hierarquia visual fica mais próxima da listagem do GitHub
- a interface continua funcionando bem em light e dark mode

## Fora de escopo
- filtros avançados
- ordenação customizável
- paginação
- badges dinâmicas complexas
- comentários reais por PR, caso ainda não estejam disponíveis
