# Spec 002 - Sistema de tema (light/dark)

## Objetivo
Permitir alternar entre tema claro e escuro na aplicação.

## Valor
Melhorar experiência do usuário e alinhar com ferramentas como GitHub.

## Requisitos funcionais
- suportar tema claro e escuro
- permitir alternância manual via botão
- persistir preferência do usuário
- aplicar tema em toda a aplicação

## Requisitos técnicos
- usar next-themes ou solução equivalente
- integrar com Tailwind usando classes dark:
- aplicar tema no root da aplicação

## Interface
- botão de toggle no topo da página
- estados:
  - light
  - dark

## Critérios de aceite
- ao alternar tema, UI muda imediatamente
- ao recarregar página, tema é mantido
- tema afeta todos os componentes
- não há flicker visual relevante

## Fora de escopo
- tema por usuário autenticado
- customização avançada de cores
- múltiplos temas além de light/dark
