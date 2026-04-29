# Spec 006 - Análise de Pull Request com IA

## Objetivo
Permitir que o usuário analise um Pull Request com IA a partir da tela de detalhes do PR.

## Valor
Validar o núcleo da proposta do produto, gerando sugestões de revisão automaticamente com base no contexto do Pull Request.

## Escopo
Esta spec cobre apenas a primeira versão funcional da análise com IA:
- iniciar a análise manualmente na tela de detalhes do PR
- buscar o contexto necessário do PR no GitHub
- enviar o contexto para a IA no backend
- receber uma resposta estruturada
- exibir o resultado da análise na própria tela

## Requisitos funcionais
- exibir um botão "Analisar com IA" na tela de detalhes do Pull Request
- ao clicar no botão, iniciar a análise do PR
- exibir estado de carregamento enquanto a análise estiver em andamento
- buscar no backend os dados relevantes do PR no GitHub
- enviar o contexto do PR para a IA
- receber uma resposta estruturada com resumo e sugestões
- exibir as sugestões geradas na tela de detalhes do PR
- exibir mensagem de erro clara se a análise falhar

## Requisitos técnicos
- usar Next.js com App Router
- usar TypeScript
- usar OpenAI SDK apenas no servidor
- não expor a chave da OpenAI no cliente
- usar route handler para disparar a análise
- manter compatibilidade com light e dark mode
- criar tipos explícitos para a resposta da análise
- evitar any
- manter a implementação simples e compatível com a POC

## Contexto mínimo do PR para a análise
O backend deve buscar e montar, no mínimo:
- título do PR
- descrição do PR
- repositório
- autor
- número do PR
- arquivos alterados
- patch/diff dos arquivos alterados, quando disponível

## Diretrizes de análise
- a análise deve focar no que foi alterado no PR
- evitar sugestões genéricas sem relação com o diff
- priorizar achados acionáveis
- priorizar problemas reais antes de nitpicks
- a resposta da IA deve ser estruturada e previsível
- não publicar comentários automaticamente no GitHub
- não aprovar ou rejeitar sugestões nesta spec

## Estrutura esperada da resposta da IA
A resposta deve conter:

- `summary`: resumo geral da análise
- `suggestions`: lista de sugestões

Cada item de `suggestions` deve conter:
- `id`: identificador único da sugestão
- `severity`: um dos valores `low`, `medium`, `high`
- `category`: categoria da sugestão, como `bug`, `performance`, `security`, `readability`, `testing`, `api-contract`, `observability`, `dependency`
- `title`: título curto da sugestão
- `description`: explicação objetiva do problema encontrado
- `suggestedComment`: comentário sugerido para uso em review
- `filePath`: opcional
- `line`: opcional

## Diretrizes de interface
- exibir o botão "Analisar com IA" em destaque na tela de detalhes do PR
- exibir loading visual durante a análise
- exibir uma seção de resultados abaixo dos detalhes do PR
- exibir o resumo geral da análise
- exibir as sugestões em uma lista clara e bem organizada
- destacar severidade e categoria visualmente
- manter linguagem visual inspirada no GitHub
- manter visual limpo, técnico e pragmático

## Estados da interface
- estado inicial sem análise executada
- loading durante a análise
- erro ao falhar a análise
- sucesso com resumo e sugestões

## Critérios de aceite
- existe um botão "Analisar com IA" na tela de detalhe do PR
- ao clicar, a análise é executada no backend
- existe feedback visual de carregamento
- em caso de erro, a UI mostra mensagem clara
- em caso de sucesso, a análise é exibida na tela
- a resposta da IA segue uma estrutura tipada e previsível
- a implementação não expõe a chave da OpenAI no cliente
- a interface continua consistente com o restante da aplicação

## Fora de escopo
- aprovação de sugestões
- rejeição de sugestões
- edição manual das sugestões
- publicação de comentários no GitHub
- persistência histórica da análise
- comentários inline precisos no diff
- múltiplas rodadas ou comparação entre análises

## Arquivos esperados
Esta implementação provavelmente exigirá criação ou alteração de arquivos como:
- app/pull-requests/[id]/page.tsx
- app/api/pull-requests/[id]/analyze/route.ts
- lib/openai.ts
- lib/github.ts
- lib/prompts/pr-analysis.ts
- types/pr-analysis.ts
- components/pr-analysis-section.tsx
- componentes auxiliares necessários

## Observações
- esta é uma primeira versão funcional da análise com IA
- se algum arquivo alterado não tiver patch disponível, a análise ainda deve funcionar com o contexto restante
- a prioridade desta spec é validar o fluxo ponta a ponta, não a perfeição da análise
