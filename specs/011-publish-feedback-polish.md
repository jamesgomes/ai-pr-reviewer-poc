
# Spec 011 - Refinamento do feedback de publicação

## Objetivo
Melhorar a experiência visual e funcional após a publicação de comentários aprovados no GitHub.

## Valor
Deixar o estado de publicação mais claro para o usuário e facilitar o acesso ao comentário publicado.

## Requisitos funcionais
- exibir feedback visual mais claro quando a publicação for concluída com sucesso
- substituir link cru por botão de ação
- exibir botão "Ver comentário no GitHub" quando houver URL de comentário publicada
- manter indicação visual de que a sugestão foi publicada
- diferenciar visualmente estado aprovado de estado aprovado + publicado

## Requisitos técnicos
- manter Next.js App Router com TypeScript
- manter persistência local atual
- não alterar o fluxo de publicação existente
- manter tipagem explícita
- evitar any

## Diretrizes de interface
- feedback de sucesso deve parecer um status de publicação, não apenas um alerta técnico
- links publicados devem ser representados por botão ou ação clara
- manter visual inspirado no GitHub
- manter light/dark mode
- manter layout limpo e pragmático

## Critérios de aceite
- após publicação bem-sucedida, a interface exibe um botão "Ver comentário no GitHub"
- a URL não aparece mais solta no texto principal
- a sugestão publicada exibe estado visual claro
- o layout fica mais organizado e fácil de entender

## Fora de escopo
- edição do comentário já publicado
- sincronização do status diretamente com GitHub
- múltiplos comentários publicados por sugestão
