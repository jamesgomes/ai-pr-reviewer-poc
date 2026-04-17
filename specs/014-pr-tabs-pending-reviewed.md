# Spec 014 - Abas de PRs Pendentes e Revisados

## Objetivo
Organizar a lista de Pull Requests na home separando PRs pendentes de ação e PRs já revisados/publicados pela aplicação.

## Valor
Melhorar a clareza do fluxo de trabalho do usuário, permitindo identificar rapidamente o que ainda precisa ser revisado e o que já foi concluído.

## Escopo
Esta spec cobre:
- criação de abas na home
- classificação de PRs com base na persistência local
- exibição de contagem por aba
- melhoria visual dos PRs revisados

## Requisitos funcionais

### Abas
- adicionar duas abas no topo da lista:
  - Pendentes
  - Revisados

### Classificação dos PRs
- um PR deve ser considerado **Revisado** quando:
  - existir persistência local
  - e pelo menos uma sugestão tiver `published = true`

- caso contrário, o PR deve ser considerado **Pendente**

### Comportamento das abas
- exibir apenas PRs pendentes na aba "Pendentes"
- exibir apenas PRs revisados na aba "Revisados"
- permitir alternância entre abas sem recarregar a página

### Contadores
- exibir quantidade de PRs em cada aba:
  - Pendentes (X)
  - Revisados (Y)

### Exibição na lista

#### PRs Pendentes
- manter layout atual
- foco em ação

#### PRs Revisados
- exibir badge:
  - "Revisado"
  - ou "Comentado"
- exibir informação adicional:
  - "Última publicação em <data>"
- manter link para abrir PR normalmente

## Requisitos técnicos
- usar apenas dados locais (localStorage)
- não consultar GitHub para classificação
- manter Next.js App Router com TypeScript
- manter tipagem explícita
- evitar any
- manter compatibilidade com light/dark mode

## Estrutura de dados
Utilizar os dados já persistidos localmente:
- suggestions[]
- published
- publishedAt

Criar helper para identificar PR revisado:
- retorna true se existir sugestão com published = true

## Diretrizes de interface
- abas devem seguir padrão visual do GitHub (tabs simples)
- aba ativa deve estar claramente destacada
- manter layout limpo e consistente
- badges devem ser discretas e informativas

## Regras de comportamento
- se não houver PRs em uma aba, exibir estado vazio amigável
- persistência local é a única fonte de verdade nesta fase
- não misturar PRs entre abas

## Critérios de aceite
- abas Pendentes e Revisados são exibidas
- contadores são exibidos corretamente
- PRs são classificados corretamente com base na persistência local
- alternância entre abas funciona sem recarregar
- PRs revisados exibem status e data de publicação
- não há regressão na navegação existente

## Fora de escopo
- sincronização com dados reais do GitHub
- distinção entre comentários manuais e automáticos
- filtros adicionais (por repo, autor, etc.)
- paginação
