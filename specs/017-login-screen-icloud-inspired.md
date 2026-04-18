# Spec 017 - Tela de login inspirada no iCloud

## Objetivo
Refinar a tela de login da aplicação para transmitir uma aparência mais polida, centrada e premium, inspirada na composição visual do iCloud.

## Valor
Melhorar a primeira impressão do produto, aumentando a percepção de qualidade e confiança para usuários que estão testando o MVP.

## Escopo
Esta spec cobre apenas a apresentação visual da tela de login e do estado não autenticado.

## Requisitos funcionais
- manter o fluxo atual de login com GitHub
- exibir uma tela de entrada centrada
- destacar visualmente o branding do produto
- exibir um único CTA principal para login com GitHub
- manter compatibilidade com light e dark mode

## Requisitos técnicos
- manter Next.js App Router com TypeScript
- não alterar a lógica de autenticação existente
- não alterar regras de sessão
- não alterar o fluxo de redirecionamento
- manter tipagem explícita
- evitar any

## Diretrizes de interface
- usar composição inspirada no iCloud:
  - branding central
  - bastante espaço negativo
  - card central de login
  - visual limpo e premium
- não copiar literalmente a interface do iCloud
- manter identidade do produto AI PR Reviewer
- remover elementos redundantes do header na tela de login
- evitar CTA duplicado no header e no card
- usar tipografia clara e hierarquia visual forte

## Estrutura esperada
- header minimalista
- área principal centralizada vertical e horizontalmente
- logo/ícone do produto em destaque
- título principal da aplicação
- subtítulo curto
- card com:
  - título do login
  - texto de apoio
  - botão "Entrar com GitHub"

## Critérios de aceite
- a tela de login fica visualmente mais centrada e equilibrada
- o CTA principal fica claramente destacado
- o layout transmite maior qualidade visual
- o fluxo de autenticação continua funcionando
- a tela funciona bem em light e dark mode

## Fora de escopo
- alteração da lógica OAuth
- onboarding multi-etapas
- cadastro
- múltiplos providers
- animações avançadas
