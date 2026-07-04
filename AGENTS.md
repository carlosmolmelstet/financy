# AGENTS.md

## Fonte de verdade

`PROJECT_GUIDE.md` e a fonte de verdade deste projeto para:

- requisitos funcionais
- stack
- Figma
- variaveis de ambiente
- modelo de dominio
- contrato GraphQL
- checklist de entrega
- ordem sugerida de desenvolvimento

Antes de iniciar uma nova fase relevante, o Codex deve reler `PROJECT_GUIDE.md` e confirmar que a tarefa atual respeita esse contexto.

## Controle de fase

`IMPLEMENTATION_PLAN.md` e o controle operacional das fases do projeto.

No inicio de todo prompt relacionado ao desenvolvimento do projeto, o Codex deve:

- Ler `IMPLEMENTATION_PLAN.md`.
- Consultar a secao "Controle de fases".
- Identificar se existe uma fase com status `in_progress`.
- Se existir `in_progress`, tratar essa fase como o foco atual, salvo orientacao explicita do usuario.
- Se nao existir `in_progress`, tratar a primeira fase `pending` como a proxima fase sugerida.
- Antes de iniciar trabalho de uma fase, atualizar o status dela para `in_progress`.
- Ao concluir e validar o escopo da fase, atualizar o status dela para `complete`.
- Manter no maximo uma fase com status `in_progress`.

O controle de fase nao substitui `PROJECT_GUIDE.md`; ele apenas indica onde estamos no plano.

## Escopo

Este e um desafio com escopo fechado. A implementacao deve priorizar cumprir os requisitos obrigatorios com simplicidade.

- Nao adicionar features extras na branch principal.
- Nao criar abstracoes complexas sem necessidade.
- Nao criar documentacao extra.
- Nao instalar bibliotecas sem justificar.
- Nao transformar o projeto em arquitetura enterprise.

## Arquivos Markdown permitidos

Os arquivos Markdown permitidos na raiz sao:

- `PROJECT_GUIDE.md`
- `AGENTS.md`
- `IMPLEMENTATION_PLAN.md`
- `README.md`

Qualquer outro arquivo Markdown so deve ser criado se for explicitamente solicitado pelo usuario.

## Estrategia de implementacao

O projeto sera implementado em fases, nesta ordem macro:

- Fase 0 - Preparacao do repositorio
- Fase 1 - Setup do backend
- Fase 2 - Banco de dados e Prisma
- Fase 3 - Autenticacao
- Fase 4 - Categorias no backend
- Fase 5 - Transacoes no backend
- Fase 6 - Setup do frontend
- Fase 7 - Tema, tokens e componentes base do Figma
- Fase 8 - Login, cadastro e sessao no frontend
- Fase 9 - Layout autenticado e dashboard
- Fase 10 - Categorias no frontend
- Fase 11 - Transacoes no frontend
- Fase 12 - Validacao final, autorizacao, README e entrega

Cada fase deve ser pequena, verificavel e funcional.

Durante a implementacao, o Codex deve manter o status das fases em `IMPLEMENTATION_PLAN.md` atualizado conforme o trabalho realmente executado e validado.

## Convencoes de codigo

Backend:

- Separar resolvers, services, validations, context, env e prisma client.
- Manter Prisma Client centralizado.
- Manter leitura de env centralizada.
- Validar inputs de mutations.
- Padronizar erros de autenticacao/autorizacao.
- Sempre filtrar dados pelo usuario autenticado.
- Evitar repository pattern se nao agregar valor.
- Evitar arquitetura hexagonal, factories genericas ou injecao de dependencia complexa.

Frontend:

- Separar pages, components, hooks, schemas, graphql e lib.
- Usar formularios validados.
- Manter token de autenticacao de forma consistente.
- Proteger rotas privadas.
- Exibir loading, erro, vazio e sucesso nas telas principais.
- Seguir o Figma com fidelidade razoavel, comecando pelo Style Guide.
- Evitar criar componentes genericos demais antes de haver repeticao real.

## Padrao de branches

`main` deve preservar a versao entregavel do desafio.

Funcionalidades obrigatorias podem ser feitas em branches curtas. Funcionalidades extras, se existirem, devem ficar fora da `main`.

Sugestao de nomes:

- `chore/project-setup`
- `feat/backend-auth`
- `feat/backend-categories`
- `feat/backend-transactions`
- `feat/frontend-auth`
- `feat/frontend-dashboard`
- `feat/frontend-categories`
- `feat/frontend-transactions`
- `fix/<descricao-curta>`
- `test/<descricao-curta>`
- `docs/<descricao-curta>`

## Padrao de commits

Usar Conventional Commits simples:

- `chore`: configuracao, tooling, scripts
- `feat`: funcionalidade nova
- `fix`: correcao
- `test`: testes
- `docs`: documentacao
- `refactor`: refatoracao sem mudanca de comportamento
- `style`: ajustes visuais/formatos sem mudanca funcional

Exemplos:

- `chore: setup backend with graphql and prisma`
- `feat: add jwt authentication flow`
- `feat: add category mutations`
- `feat: add transaction management ui`
- `test: cover user data isolation`
- `docs: update local setup instructions`

## Validacao antes de cada commit

Nao criar Git hooks agora.

Em vez disso, registrar validacoes manuais obrigatorias por area alterada.

Se alterar backend:

- Rodar typecheck do backend.
- Rodar testes do backend, se existirem.
- Rodar Prisma generate quando schema Prisma mudar.
- Rodar migration quando schema do banco mudar.
- Validar que operacoes privadas exigem autenticacao.
- Validar que usuario A nao acessa dados do usuario B.

Se alterar frontend:

- Rodar typecheck do frontend.
- Rodar build do frontend.
- Validar manualmente fluxo afetado no navegador.
- Validar estados de loading, erro e vazio quando aplicavel.

Se alterar integracao frontend/backend:

- Validar login real.
- Validar token enviado nas requisicoes GraphQL.
- Validar operacoes reais de categorias e transacoes.
- Validar logout e protecao de rota.

Antes da entrega:

- Rodar validacoes finais de backend.
- Rodar validacoes finais de frontend.
- Testar fluxo completo localmente.
- Revisar checklist do `PROJECT_GUIDE.md`.
- Garantir `backend/.env.example`.
- Garantir `frontend/.env.example`.
- Garantir que nenhum segredo real foi versionado.

## Definicao de pronto

Uma fase so pode ser considerada pronta quando:

- cumpre o escopo daquela fase
- nao quebra funcionalidades anteriores
- passa nas validacoes aplicaveis
- respeita `PROJECT_GUIDE.md`
- nao adiciona complexidade desnecessaria
- deixa claro o que foi implementado e o que foi validado

## Como responder ao usuario

Ao finalizar cada tarefa, responder com:

- resumo do que foi feito
- arquivos principais alterados
- comandos executados
- resultado das validacoes
- pendencias ou riscos reais, se houver
