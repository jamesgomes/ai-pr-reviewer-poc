# Spec 016 - Login com GitHub para MVP

## Objetivo
Permitir que diferentes usuários entrem na aplicação com a própria conta do GitHub para usar o produto com seus próprios Pull Requests e publicar comentários em seu próprio nome.

## Valor
Transformar a aplicação de uma POC pessoal em um MVP utilizável por outras pessoas, validando o fluxo real do produto com identidade e contexto corretos por usuário.

## Escopo
Esta spec cobre:
- autenticação com GitHub
- sessão autenticada na aplicação
- identificação do usuário logado
- proteção básica das páginas principais
- adaptação do fluxo atual para usar o usuário autenticado
- ajuste da persistência local para isolar dados por usuário

## Requisitos funcionais

### Login
- exibir botão "Entrar com GitHub" para usuários não autenticados
- permitir login com GitHub
- após login bem-sucedido, redirecionar para a home da aplicação

### Sessão
- manter sessão autenticada entre navegações
- exibir usuário autenticado no header
- permitir logout

### Proteção de acesso
- home deve exigir autenticação
- página de detalhe do PR deve exigir autenticação
- APIs do app que dependem de GitHub devem usar o contexto do usuário autenticado

### Fluxo do usuário
- usuários não autenticados devem ver uma tela simples de entrada
- usuários autenticados devem acessar normalmente a aplicação
- PRs exibidos devem ser os PRs relacionados ao usuário autenticado

## Requisitos técnicos
- usar Next.js com App Router
- usar TypeScript
- implementar autenticação com GitHub
- usar sessão para obter o usuário autenticado no servidor
- não usar banco de dados nesta fase
- manter persistência local no navegador
- atualizar a chave da persistência local para incluir o usuário autenticado
- manter tipagem explícita
- evitar any

## Persistência local por usuário
A persistência local da análise deve deixar de ser apenas por PR e passar a incluir o usuário autenticado.

Formato sugerido:
pr-review-assistant:analysis:<githubUserId>:<owner>:<repo>:<prNumber>

Se githubUserId não estiver disponível, usar githubLogin:
pr-review-assistant:analysis:<githubLogin>:<owner>:<repo>:<prNumber>

## Regras de segurança e coerência
- não usar mais token fixo pessoal como fonte principal do fluxo do produto
- chamadas ao GitHub devem usar a identidade/token do usuário autenticado
- dados locais de um usuário não devem colidir com os de outro usuário no mesmo navegador
- páginas autenticadas não devem ficar acessíveis sem sessão válida

## Diretrizes de interface

### Tela de entrada
- visual simples, limpo e consistente com o restante da aplicação
- título da aplicação
- descrição curta do produto
- botão "Entrar com GitHub"

### Header autenticado
- manter avatar e nome do usuário autenticado
- manter botão de tema
- adicionar ação de logout discreta

## Critérios de aceite
- usuário consegue entrar com GitHub
- usuário autenticado acessa home e detalhe do PR
- usuário não autenticado não acessa áreas protegidas
- header mostra o usuário autenticado corretamente
- logout funciona
- persistência local passa a ser isolada por usuário
- fluxo atual da aplicação continua funcionando com a conta autenticada

## Fora de escopo
- banco de dados
- sincronização entre dispositivos
- permissões avançadas por organização
- múltiplos providers de login
- onboarding complexo
- refresh sofisticado de tokens além do necessário para o MVP
