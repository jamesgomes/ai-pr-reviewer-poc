# Spec 027 - Integração com Claude como provedor de IA padrão

## Objetivo
Adicionar o Claude (Anthropic) como provedor de análise de Pull Request, mantendo a integração existente com a OpenAI, e tornar o Claude o provedor padrão da aplicação.

## Valor
Permitir alternar o provedor de IA usado na análise sem reescrever o fluxo, reduzir dependência de um único fornecedor e usar o Claude como padrão por qualidade de análise, preservando a OpenAI como alternativa configurável.

## Escopo
Esta spec cobre apenas a camada de provedor de IA no backend:
- criar um cliente/serviço de análise usando o SDK oficial da Anthropic
- introduzir uma abstração de provedor que decide entre Claude e OpenAI
- definir o Claude como provedor padrão
- manter a integração atual com a OpenAI funcional e selecionável
- reutilizar o mesmo prompt, instruções e contrato de resposta já existentes

## Fora de escopo
- alterar a estrutura da resposta da análise (`PullRequestAnalysisResult`)
- alterar o prompt de análise ou as instruções em `docs/prompts/pr-analysis-instructions.md`
- alterar a interface do usuário (não há toggle visual de provedor nesta spec)
- seleção de provedor por requisição vinda do cliente
- persistir qual provedor gerou cada análise
- comparar respostas entre provedores
- streaming de resposta
- ajustes de custo, rate limit ou retries avançados

## Requisitos funcionais
- a análise de PR deve continuar funcionando exatamente como hoje do ponto de vista do usuário
- o provedor padrão da análise deve ser o Claude
- deve ser possível selecionar a OpenAI como provedor via configuração de ambiente
- o resultado da análise deve seguir o mesmo contrato tipado atual, independentemente do provedor
- em caso de erro do provedor, a rota deve continuar retornando mensagem de erro clara (comportamento atual mantido)
- se a chave do provedor selecionado não estiver configurada, a análise deve falhar com mensagem clara

## Requisitos técnicos
- usar o SDK oficial da Anthropic (`@anthropic-ai/sdk`) apenas no servidor
- não expor a chave da Anthropic no cliente
- usar o modelo `claude-opus-4-8` como padrão do Claude
- usar saída estruturada do Claude via `output_config.format` (por exemplo `client.messages.parse()` com `zodOutputFormat`), validando contra `pullRequestAnalysisResultSchema`
- reaproveitar o arquivo `docs/prompts/pr-analysis-instructions.md` como `system` prompt do Claude
- reaproveitar `buildPullRequestAnalysisPrompt` como conteúdo da mensagem do usuário
- manter a implementação da OpenAI atual (`analyzePullRequestWithOpenAI`) sem mudança de comportamento
- introduzir uma função de despacho no servidor (por exemplo `analyzePullRequest(prompt)`) que seleciona o provedor e retorna `PullRequestAnalysisResult`
- a rota `analyze` deve chamar a função de despacho, não um provedor específico
- não usar `any`; manter tipos explícitos
- manter a implementação simples e compatível com a POC
- não introduzir camadas de abstração além do necessário para dois provedores

## Seleção de provedor
- a seleção deve ser feita por variável de ambiente no servidor
- variável sugerida: `AI_PROVIDER` com valores `claude` ou `openai`
- valor ausente ou inválido deve resultar no padrão `claude`
- a seleção é global da aplicação nesta fase (não por usuário nem por requisição)

## Variáveis de ambiente
Adicionar ao `.env.local` e documentar:
- `AI_PROVIDER` (opcional, padrão `claude`)
- `ANTHROPIC_API_KEY` (obrigatória quando o provedor for `claude`)
- `ANTHROPIC_MODEL` (opcional, padrão `claude-opus-4-8`)

Manter as existentes:
- `OPENAI_API_KEY` (obrigatória quando o provedor for `openai`)
- `OPENAI_MODEL` (opcional)

## Contrato de resposta
- a resposta de ambos os provedores deve ser validada contra `pullRequestAnalysisResultSchema`
- os campos permanecem: `summary` e `suggestions[]`
- cada sugestão mantém: `id`, `severity`, `category`, `title`, `description`, `suggestedComment`, `filePath` (nullable), `line` (nullable)
- não é permitido retornar resposta sem estrutura válida; falha na validação deve gerar erro

## Diretrizes de análise
- manter as mesmas diretrizes da análise já definidas (foco no diff, sugestões acionáveis, sem invenção de arquivos/linhas)
- o comportamento de análise deve permanecer equivalente entre provedores no que for controlável pelo prompt

## Critérios de aceite
- a análise usa o Claude por padrão quando nenhuma configuração de provedor é definida
- definir `AI_PROVIDER=openai` faz a análise usar a OpenAI, com o comportamento atual
- ambos os provedores retornam resposta que satisfaz `pullRequestAnalysisResultSchema`
- a chave da Anthropic não é exposta no cliente
- a rota `analyze` não referencia diretamente um provedor específico
- erros de provedor continuam produzindo mensagem de erro clara na resposta da rota
- `npm run lint` e `npm run build` executam sem erros

## Arquivos esperados
Esta implementação provavelmente exigirá criação ou alteração de arquivos como:
- `lib/claude.ts` (novo cliente/serviço da Anthropic)
- `lib/ai-provider.ts` (nova função de despacho entre provedores)
- `lib/openai.ts` (mantido; possível ajuste apenas para extrair leitura das instruções compartilhadas, se conveniente)
- `app/api/pull-requests/[owner]/[repo]/[number]/analyze/route.ts` (passar a chamar o despacho)
- `package.json` (adicionar dependência `@anthropic-ai/sdk`; bump de versão)
- `CHANGELOG.md` (entrada da nova versão)
- `.env.local` e documentação de ambiente (novas variáveis)
- `AGENTS.md` (atualizar stack para citar Claude/Anthropic no servidor)

## Observações
- esta spec troca apenas a camada de provedor de IA; o restante do fluxo (contexto do PR, prompt, UI, persistência, publicação) permanece igual
- a prioridade é manter paridade funcional com a análise atual e permitir alternância simples de provedor
- reaproveitar ao máximo o prompt e as instruções já existentes para manter as duas integrações comparáveis
