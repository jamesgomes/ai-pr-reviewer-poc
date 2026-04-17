# Spec 013 - Refinamento das ações após publicação

## Objetivo
Ajustar a interface das sugestões publicadas para exibir apenas ações coerentes com o estado real após publicação no GitHub.

## Valor
Evitar inconsistência entre o estado local da interface e o estado remoto do comentário já publicado no GitHub.

## Escopo
Esta spec cobre:
- remoção das ações de edição e desfazer após publicação
- manutenção do estado visual de publicada
- exibição de ação de navegação para o comentário publicado no GitHub
- melhoria da clareza da interface no pós-publicação

## Requisitos funcionais
- quando uma sugestão estiver publicada, não exibir mais os botões "Desfazer" e "Editar"
- quando uma sugestão estiver publicada, exibir botão "Ver comentário no GitHub" ou "Abrir comentário no GitHub"
- manter indicação visual de que a sugestão foi publicada
- manter informação de data/hora de publicação, se já existir
- diferenciar claramente:
  - sugestão aprovada e ainda não publicada
  - sugestão aprovada e publicada

## Requisitos técnicos
- manter Next.js App Router com TypeScript
- manter persistência local atual
- não implementar exclusão de comentário nesta spec
- não alterar o fluxo de publicação já existente
- manter tipagem explícita
- evitar any

## Diretrizes de interface
- o estado publicado deve parecer finalizado
- ações disponíveis após publicação devem ser apenas de consulta/navegação
- manter visual limpo, técnico e pragmático
- manter linguagem visual inspirada no GitHub
- manter compatibilidade com light e dark mode

## Regras de comportamento
- se `published` for true:
  - ocultar ações locais de modificação
  - exibir ação para abrir o comentário publicado
- se `published` for false:
  - manter comportamento atual conforme o estado da sugestão

## Critérios de aceite
- sugestões publicadas não exibem mais "Desfazer" e "Editar"
- sugestões publicadas exibem ação para abrir comentário no GitHub
- a interface deixa claro que a sugestão já foi publicada
- sugestões não publicadas continuam com ações coerentes com seu estado
- não há regressão no fluxo atual

## Fora de escopo
- exclusão do comentário no GitHub
- edição de comentário já publicado
- sincronização bidirecional com GitHub
