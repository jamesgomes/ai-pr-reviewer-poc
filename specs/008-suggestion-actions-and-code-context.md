# Spec 008 - Ações visuais e contexto de código nas sugestões

## Objetivo
Melhorar a experiência de revisão das sugestões da IA, deixando as ações mais claras e exibindo contexto real do código alterado.

## Valor
Facilitar a tomada de decisão do usuário ao revisar as sugestões, aproximando a experiência de uma revisão real no GitHub.

## Requisitos funcionais
- diferenciar visualmente os botões de aprovar e rejeitar
- exibir snippet de código relacionado à sugestão quando houver filePath e line
- exibir o snippet abaixo da descrição e antes do comentário sugerido
- manter compatibilidade com light e dark mode

## Requisitos técnicos
- usar o contexto real do PR para montar o snippet
- não pedir para a IA inventar o trecho de código
- usar tipagem explícita
- evitar any

## Diretrizes de interface
- botão Aprovar com estilo positivo
- botão Rejeitar com estilo negativo
- botão Editar com estilo neutro
- snippet em bloco de código compacto
- destacar filePath e line
- manter visual técnico, limpo e pragmático

## Critérios de aceite
- os botões Aprovar e Rejeitar têm distinção visual clara
- quando houver filePath e line, a sugestão exibe contexto de código
- o snippet ajuda a entender o problema sem poluir a interface
- a UI continua consistente com o restante da aplicação

## Fora de escopo
- comentários inline no GitHub
- diff completo por arquivo
- expansão avançada de código
