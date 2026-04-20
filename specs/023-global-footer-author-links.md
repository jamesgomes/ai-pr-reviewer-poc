# Spec 023 - Rodapé global com autoria e links profissionais

## Objetivo
Adicionar um rodapé global discreto em todas as páginas da aplicação, exibindo autoria do produto e links profissionais do criador.

## Valor
Reforçar a identidade do produto, melhorar a apresentação do MVP e criar uma assinatura profissional do projeto sem comprometer a aparência de produto.

## Escopo
Esta spec cobre:
- criação de um rodapé global
- exibição de autoria
- exibição de links profissionais
- aplicação do rodapé em todas as páginas

## Requisitos funcionais
- exibir um rodapé em todas as páginas da aplicação
- o rodapé deve conter um texto curto de autoria
- o rodapé deve conter links para GitHub e LinkedIn
- os links devem abrir em nova aba
- o rodapé deve ser discreto e não competir visualmente com o conteúdo principal

## Requisitos técnicos
- manter Next.js com App Router
- manter TypeScript
- implementar o rodapé como componente reutilizável
- integrar o rodapé ao layout global da aplicação
- manter tipagem explícita
- evitar any

## Diretrizes de interface
- manter visual limpo, técnico e compatível com o restante do produto
- usar texto pequeno e contraste secundário
- posicionar o rodapé no fim da página
- manter espaçamento confortável
- manter compatibilidade com light e dark mode
- o rodapé não deve parecer banner promocional nem aviso jurídico pesado

## Conteúdo sugerido
Texto principal:
- Built by James Gomes

Links:
- GitHub
- LinkedIn

## Comportamento
- os links devem usar target _blank e proteção adequada (rel)
- o rodapé deve aparecer tanto na tela autenticada quanto na tela de login
- o conteúdo principal deve continuar com boa área útil, sem layout quebrado

## Critérios de aceite
- o rodapé aparece em todas as páginas
- o texto de autoria está visível e discreto
- os links para GitHub e LinkedIn funcionam
- a interface continua consistente com o restante do produto
- funciona bem em light e dark mode
- não há regressão no layout global

## Fora de escopo
- newsletter
- contato por e-mail
- múltiplos autores
- páginas institucionais
- termos de uso ou política de privacidade
