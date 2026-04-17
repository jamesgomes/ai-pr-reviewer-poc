# Spec 009 - Persistência local da análise

## Objetivo
Persistir localmente no navegador os dados da análise de Pull Request para que o usuário não perca o progresso ao recarregar a página ou retornar depois.

## Valor
Preservar a análise gerada pela IA e as decisões humanas sobre as sugestões, aumentando a utilidade real da POC antes da adoção de banco de dados.

## Escopo
Esta spec cobre:
- salvar localmente a análise de um PR
- restaurar a análise ao abrir novamente o mesmo PR
- persistir aprovações, rejeições e edições
- exibir a informação de última análise salva quando disponível

## Requisitos funcionais
- salvar localmente o resultado da análise após execução bem-sucedida
- salvar localmente alterações de status das sugestões:
  - pending
  - approved
  - rejected
- salvar localmente o comentário editado da sugestão
- ao abrir novamente a página de detalhe do mesmo PR, restaurar a análise salva
- manter a interface consistente ao recarregar a página
- exibir quando a análise foi salva pela última vez

## Requisitos técnicos
- usar localStorage
- não usar banco de dados nesta fase
- não usar sessionStorage
- manter TypeScript
- manter tipagem explícita
- evitar any
- manter compatibilidade com light e dark mode

## Chave de persistência
A persistência local deve usar uma chave única por Pull Request, composta por informações do repositório e do número do PR.

Formato sugerido:
pr-review-assistant:analysis:<owner>:<repo>:<prNumber>

Exemplo:
pr-review-assistant:analysis:Minutrade:minu-mission:144

## Estrutura mínima persistida
A estrutura salva localmente deve conter:
- owner
- repo
- prNumber
- summary
- suggestions
- analyzedAt
- model (opcional, se disponível)
- promptVersion (opcional, se disponível)

Cada item de suggestion deve conter:
- id
- severity
- category
- title
- description
- suggestedComment
- filePath
- line
- status
- editedComment
- snippet ou contexto exibido, se fizer parte do estado atual da interface

## Regras de comportamento
- se houver análise salva para o PR atual, restaurar ao abrir a tela
- se o usuário executar nova análise, substituir a análise salva anterior do mesmo PR
- sempre que o usuário aprovar, rejeitar ou editar uma sugestão, persistir novamente
- se não houver análise salva, exibir estado inicial normal
- se os dados salvos estiverem inválidos ou corrompidos, ignorar com segurança e seguir sem quebrar a interface

## Diretrizes de interface
- exibir informação como:
  - "Última análise salva em ..."
- essa informação deve ser discreta e secundária
- não poluir a interface
- manter o foco principal na análise e nas sugestões

## Critérios de aceite
- a análise continua disponível após recarregar a página
- aprovações e rejeições continuam salvas após recarregar
- comentários editados continuam salvos após recarregar
- abrir novamente o mesmo PR restaura o estado salvo
- executar nova análise substitui a análise salva anterior do mesmo PR
- falhas em localStorage não quebram a tela

## Fora de escopo
- persistência em banco de dados
- sincronização entre dispositivos
- múltiplos usuários reais
- histórico de múltiplas análises por PR
- publicação no GitHub
