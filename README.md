# AI PR Reviewer POC

POC local para apoiar revisao de Pull Requests com IA.

## Objetivo

- Buscar PRs em que o usuario foi solicitado como reviewer.
- Permitir abrir o detalhe do PR.
- Rodar analise de PR com IA sob demanda.
- Exibir resumo e sugestoes estruturadas para revisao.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Octokit (GitHub)
- OpenAI SDK (somente no servidor)
- Zod (validacao e structured output)
- MongoDB local (preparado para as proximas specs)

## Funcionalidades implementadas

- Home com lista de PRs pendentes de revisao.
- Tela de detalhe do PR com descricao em markdown preview.
- Botao "Analisar com IA" no detalhe do PR.
- Execucao da analise no backend.
- Exibicao de estados de loading, erro e sucesso.
- Resposta tipada da IA com `summary` e `suggestions[]`.
- Cada `suggestion` contem `id`, `severity`, `category`, `title`, `description`, `suggestedComment`, `filePath`, `line`.

## Variaveis de ambiente

Crie um arquivo `.env.local` na raiz:

```bash
GITHUB_TOKEN=seu_token_github
GITHUB_USERNAME=seu_login_github

MONGODB_URI=mongodb://127.0.0.1:27017/ai-pr-reviewer-poc
MONGODB_DB=ai-pr-reviewer-poc

OPENAI_API_KEY=sua_chave_openai
OPENAI_MODEL=gpt-5.2

NEXT_PUBLIC_APP_NAME=AI PR Reviewer POC
```

Notas:

- `OPENAI_MODEL` e opcional. Se nao for definido, o sistema usa `gpt-5.2`.
- Nao exponha tokens e chaves no cliente.

## Prompt da analise de IA

- Instrucoes da IA: `docs/prompts/pr-analysis-instructions.md`
- Montagem do contexto/prompt: `lib/prompts/pr-analysis.ts`
- Chamada OpenAI: `lib/openai.ts`
- Schema tipado de saida: `types/pr-analysis.ts`

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Scripts

- `npm run dev`: sobe ambiente local.
- `npm run lint`: executa lint.
- `npm run build`: valida build de producao.
- `npm run start`: sobe app apos build.

## Rotas principais

- `GET /`: dashboard com PRs pendentes.
- `GET /pull-requests/[owner]/[repo]/[number]`: detalhe do PR.
- `GET /api/pull-requests`: lista PRs solicitados para review.
- `POST /api/pull-requests/[owner]/[repo]/[number]/analyze`: executa analise com IA.
- `GET /api/health`: healthcheck simples.

## Estrutura de pastas

- `app/`: paginas e rotas (App Router).
- `components/`: componentes de UI.
- `lib/`: integracoes e servicos (GitHub, OpenAI, prompts).
- `types/`: contratos e tipos compartilhados.
- `specs/`: especificacoes que guiam a implementacao.
- `docs/`: documentacao auxiliar (inclui prompts).

## Limites desta fase (POC)

- Nao ha aprovacao/rejeicao/edicao de sugestoes ainda.
- Nao publica comentarios no GitHub nesta versao.
- Nao ha persistencia historica da analise no MongoDB nesta etapa.
- Nao cobre processamento em background ou multiusuario.
