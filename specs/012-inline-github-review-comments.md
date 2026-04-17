# Spec 012 - Publicação de comentários inline no GitHub

## Objetivo
Permitir publicar sugestões aprovadas como comentários inline no Pull Request, diretamente no trecho de código relacionado, quando houver contexto suficiente.

## Valor
Aproximar a experiência do produto do fluxo real de code review do GitHub, aumentando clareza, contexto e utilidade dos comentários publicados.

## Escopo
Esta spec cobre:
- publicação inline de sugestões aprovadas
- fallback para comentário consolidado quando a sugestão não puder ser publicada inline
- feedback visual sobre o tipo de publicação realizada

## Requisitos funcionais
- ao publicar sugestões aprovadas, tentar enviar comentário inline quando houver filePath e line válidos
- usar editedComment quando existir
- publicar inline apenas quando houver contexto suficiente
- se não for possível publicar inline, incluir a sugestão no comentário consolidado do PR
- informar ao usuário quantas sugestões foram publicadas inline e quantas foram publicadas em comentário consolidado
- marcar localmente o tipo de publicação realizado por sugestão

## Requisitos técnicos
- usar GitHub API no backend
- não expor token no frontend
- manter TypeScript
- manter tipagem explícita
- evitar any
- manter compatibilidade com light e dark mode

## Regras de publicação inline
Uma sugestão pode ser candidata a comentário inline quando houver:
- filePath preenchido
- line preenchida
- contexto suficiente do arquivo alterado para localizar o comentário no diff

## Regras de fallback
Se a sugestão aprovada não puder ser publicada inline:
- incluí-la no comentário consolidado do PR
- não perder a sugestão
- informar isso no resultado da publicação

## Estrutura local por sugestão
Cada sugestão publicada pode conter:
- published: boolean
- publishedAt: string opcional
- publishMode: inline | consolidated | null
- publishedUrl: string opcional
- publishError: string opcional

## Diretrizes de interface
- manter botão principal de publicação
- exibir resumo do resultado da publicação:
  - inline publicadas
  - consolidadas publicadas
  - falhas
- exibir no card da sugestão o modo de publicação quando ela tiver sido publicada
- manter visual técnico, limpo e pragmático

## Critérios de aceite
- sugestões com contexto suficiente podem ser publicadas inline
- sugestões sem contexto suficiente continuam sendo publicadas no comentário consolidado
- o usuário recebe feedback claro sobre o resultado
- nenhuma sugestão aprovada é perdida
- a interface continua consistente com o restante da aplicação

## Fora de escopo
- edição de comentário já publicado
- sincronização bidirecional com GitHub
- reprocessamento automático de comentários inline
- múltiplas tentativas automáticas sofisticadas
