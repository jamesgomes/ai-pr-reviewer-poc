
# AI PR Reviewer

Aplicação local para apoiar revisão de Pull Requests com IA.

## Objetivo

- Buscar PRs em que o usuário foi solicitado como reviewer
- Permitir abrir o detalhe do PR
- Rodar análise de PR com IA sob demanda
- Exibir resumo e sugestões estruturadas para revisão

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Octokit (GitHub)
- OpenAI SDK (somente no servidor)
- Zod (validação e structured output)

## Funcionalidades implementadas

- Home com lista de PRs pendentes de revisão
- Tela de detalhe do PR com descrição em markdown preview
- Botão "Analisar com IA" no detalhe do PR
- Execução da análise no backend
- Exibição de estados de loading, erro e sucesso
- Resposta tipada da IA com `summary` e `suggestions[]`
- Cada `suggestion` contém `id`, `severity`, `category`, `title`, `description`, `suggestedComment`, `filePath`, `line`

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```bash
GITHUB_TOKEN=seu_token_github
GITHUB_USERNAME=seu_login_github

OPENAI_API_KEY=sua_chave_openai
OPENAI_MODEL=gpt-5.2

NEXT_PUBLIC_APP_NAME=AI PR Reviewer
```

Notas:

- `OPENAI_MODEL` é opcional. Se não for definido, o sistema usa `gpt-5.2`.
- Não exponha tokens e chaves no cliente.

## Prompt da análise de IA

- Instruções da IA: `docs/prompts/pr-analysis-instructions.md`
- Montagem do contexto/prompt: `lib/prompts/pr-analysis.ts`
- Chamada OpenAI: `lib/openai.ts`
- Schema tipado de saída: `types/pr-analysis.ts`


## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Scripts

- `npm run dev`: sobe ambiente local
- `npm run lint`: executa lint
- `npm run build`: valida build de produção
- `npm run start`: sobe app após build

## Rotas principais

- `GET /`: dashboard com PRs pendentes
- `GET /pull-requests/[owner]/[repo]/[number]`: detalhe do PR
- `GET /api/pull-requests`: lista PRs solicitados para review
- `POST /api/pull-requests/[owner]/[repo]/[number]/analyze`: executa análise com IA
- `GET /api/health`: healthcheck simples

## Estrutura de pastas

- `app/`: páginas e rotas (App Router)
- `components/`: componentes de UI
- `lib/`: integrações e serviços (GitHub, OpenAI, prompts)
- `types/`: contratos e tipos compartilhados
- `specs/`: especificações que guiam a implementação
- `docs/`: documentação auxiliar (inclui prompts)

---
_Arquivo gerado com auxílio de IA (Genesis). Pode conter erros. Contexto: PL-025 e GD-001 da Minu._
