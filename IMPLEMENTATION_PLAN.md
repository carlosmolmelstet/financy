# Plano de Implementacao

## Principios

- Backend primeiro.
- Frontend depois que o contrato GraphQL estiver minimamente estavel.
- Figma Style Guide antes das telas.
- Implementacao em fatias pequenas.
- Validacao de autorizacao entre usuarios como prioridade.
- Evitar overengineering.
- Nao adicionar features extras na `main`.

## Controle de fases

Este arquivo tambem funciona como controle operacional simples para o Codex saber em que fase o projeto esta.

Status permitidos:

- `pending`: fase ainda nao iniciada.
- `in_progress`: fase em andamento.
- `complete`: fase concluida e validada conforme o escopo aplicavel.

Regras de uso:

- Antes de qualquer tarefa de implementacao, consultar esta secao.
- Se existir uma fase `in_progress`, continuar por ela, salvo orientacao explicita do usuario.
- Se nenhuma fase estiver `in_progress`, a proxima fase de implementacao e a primeira com status `pending`.
- Ao iniciar uma fase, mudar o status dela para `in_progress`.
- Ao finalizar e validar uma fase, mudar o status dela para `complete`.
- Manter no maximo uma fase com status `in_progress`.
- Nao marcar uma fase como `complete` sem executar as validacoes aplicaveis.

| Fase | Status |
| --- | --- |
| Fase 0 - Preparacao do repositorio | `complete` |
| Fase 1 - Setup do backend | `complete` |
| Fase 2 - Banco de dados e Prisma | `complete` |
| Fase 3 - Autenticacao | `complete` |
| Fase 4 - Categorias no backend | `complete` |
| Fase 5 - Transacoes no backend | `pending` |
| Fase 6 - Setup do frontend | `pending` |
| Fase 7 - Tema, tokens e componentes base do Figma | `pending` |
| Fase 8 - Login, cadastro e sessao no frontend | `pending` |
| Fase 9 - Layout autenticado e dashboard | `pending` |
| Fase 10 - Categorias no frontend | `pending` |
| Fase 11 - Transacoes no frontend | `pending` |
| Fase 12 - Validacao final e entrega | `pending` |

Proxima fase de implementacao: Fase 5 - Transacoes no backend.

## Fase 0 - Preparacao do repositorio

Objetivo:

- Confirmar estrutura esperada.
- Manter `PROJECT_GUIDE.md` como fonte de verdade.
- Preparar documentacao minima.

Entregaveis:

- `AGENTS.md`
- `IMPLEMENTATION_PLAN.md`
- `README.md` inicial

Validacao:

- Documentacao criada.
- Nenhum requisito alterado.
- Nenhum codigo implementado ainda.

## Fase 1 - Setup do backend

Objetivo:

Criar base do backend em `backend/`.

Escopo macro:

- TypeScript.
- GraphQL server.
- CORS.
- Env centralizado.
- Scripts de dev/build/typecheck.
- Estrutura inicial de `src`.

Validacao:

- Servidor sobe localmente.
- Endpoint GraphQL responde.
- Typecheck passa.
- `backend/.env.example` existe com `JWT_SECRET` e `DATABASE_URL`.

## Fase 2 - Banco de dados e Prisma

Objetivo:

Modelar persistencia com Prisma e SQLite.

Escopo macro:

- Configurar Prisma.
- Definir `User`, `Category` e `Transaction`.
- Criar migration inicial.
- Configurar Prisma Client centralizado.

Validacao:

- Migration roda.
- Prisma Client gera corretamente.
- Modelos suportam usuario dono, categorias e transacoes.
- Nao ha segredo versionado.

## Fase 3 - Autenticacao

Objetivo:

Implementar cadastro, login e sessao autenticada.

Escopo macro:

- Create account.
- Login.
- Hash de senha.
- JWT.
- Contexto GraphQL autenticado.
- Query `me` se util para o frontend.

Validacao:

- Usuario cria conta.
- Usuario faz login.
- Senha nao fica salva em texto puro.
- Token invalido ou ausente bloqueia operacoes privadas.

## Fase 4 - Categorias no backend

Objetivo:

Implementar CRUD privado de categorias.

Escopo macro:

- Listar categorias do usuario autenticado.
- Criar categoria.
- Editar categoria.
- Deletar categoria.
- Validacao de inputs.
- Isolamento por usuario.

Validacao:

- Usuario so lista suas categorias.
- Usuario nao edita categoria de outro usuario.
- Usuario nao deleta categoria de outro usuario.
- Erros sao consistentes.

## Fase 5 - Transacoes no backend

Objetivo:

Implementar CRUD privado de transacoes.

Escopo macro:

- Listar transacoes do usuario autenticado.
- Criar transacao.
- Editar transacao.
- Deletar transacao.
- Tipo entrada/saida.
- Valor.
- Data.
- Vinculo com categoria quando aplicavel.
- Isolamento por usuario.

Validacao:

- Usuario so lista suas transacoes.
- Usuario nao edita transacao de outro usuario.
- Usuario nao deleta transacao de outro usuario.
- Categoria vinculada pertence ao mesmo usuario.
- Contrato GraphQL cobre o frontend.

## Fase 6 - Setup do frontend

Objetivo:

Criar base do frontend em `frontend/`.

Escopo macro:

- Vite.
- React.
- TypeScript.
- GraphQL client.
- Env com `VITE_BACKEND_URL`.
- Scripts de dev/build/typecheck.
- Estrutura inicial de `src`.

Validacao:

- Aplicacao sobe localmente.
- `frontend/.env.example` existe.
- Build passa.
- Typecheck passa.
- Client GraphQL consegue apontar para o backend.

## Fase 7 - Tema, tokens e componentes base do Figma

Objetivo:

Preparar base visual antes das paginas.

Escopo macro:

- Consultar Style Guide do Figma.
- Definir tokens de cor, fonte, spacing e radius.
- Configurar Tailwind ou alternativa equivalente, se escolhido.
- Criar componentes base minimos.

Validacao:

- Tema aplicado globalmente.
- Componentes base nao estao genericos demais.
- Visual inicial segue o Style Guide.

## Fase 8 - Login, cadastro e sessao no frontend

Objetivo:

Implementar fluxo publico de autenticacao.

Escopo macro:

- Tela de login.
- Tela de cadastro.
- Formularios validados.
- Chamada GraphQL real.
- Armazenamento consistente do token.
- Logout.
- Estado autenticado.

Validacao:

- Cadastro funciona.
- Login funciona.
- Token e usado nas requisicoes.
- Usuario deslogado ve login na rota `/`.
- Usuario logado e levado ao dashboard.

## Fase 9 - Layout autenticado e dashboard

Objetivo:

Criar experiencia principal autenticada.

Escopo macro:

- Layout autenticado.
- Navegacao.
- Dashboard.
- Resumo de saldo, entradas e saidas conforme dados disponiveis.
- Estados de loading, erro e vazio.

Validacao:

- Rota `/` exibe dashboard quando logado.
- Layout segue Figma.
- Dados vem da API.
- Logout funciona.
- Rotas privadas estao protegidas.

## Fase 10 - Categorias no frontend

Objetivo:

Implementar gerenciamento de categorias.

Escopo macro:

- Listar categorias.
- Criar categoria em dialog.
- Editar categoria em dialog.
- Deletar categoria.
- Validacao de formulario.
- Estados de loading, erro, vazio e sucesso.

Validacao:

- Operacoes usam GraphQL.
- Lista atualiza apos mutations.
- Usuario so ve suas categorias.
- Dialogs seguem Figma.

## Fase 11 - Transacoes no frontend

Objetivo:

Implementar gerenciamento de transacoes.

Escopo macro:

- Listar transacoes.
- Criar transacao em dialog.
- Editar transacao em dialog.
- Deletar transacao.
- Selecionar categoria.
- Diferenciar entrada e saida.
- Validar valor, data, descricao/titulo e tipo.

Validacao:

- Operacoes usam GraphQL.
- Lista atualiza apos mutations.
- Usuario so ve suas transacoes.
- Categorias disponiveis pertencem ao usuario.
- Dialogs seguem Figma.

## Fase 12 - Validacao final e entrega

Objetivo:

Garantir que o projeto cumpre `PROJECT_GUIDE.md`.

Escopo macro:

- Revisar checklist de backend.
- Revisar checklist de frontend.
- Testar fluxo completo localmente.
- Validar autorizacao entre usuarios.
- Revisar README.
- Remover codigo morto.
- Garantir ausencia de secrets reais.

Validacao final:

- Backend executa localmente.
- Frontend executa localmente.
- Typecheck passa.
- Build passa.
- Testes existentes passam.
- Usuario A nao acessa dados do usuario B.
- README explica como rodar tudo.
- `.env.example` existe nos dois projetos.

## Ordem recomendada de commits

1. `chore: add project planning docs`
2. `chore: setup backend`
3. `feat: add prisma schema and database setup`
4. `feat: add authentication graphql flow`
5. `feat: add category graphql operations`
6. `feat: add transaction graphql operations`
7. `chore: setup frontend`
8. `feat: add theme and base components`
9. `feat: add frontend authentication flow`
10. `feat: add authenticated layout and dashboard`
11. `feat: add category management ui`
12. `feat: add transaction management ui`
13. `test: validate authorization rules`
14. `docs: finalize readme`

## Decisoes intencionais de simplicidade

- Sem monorepo tooling complexo.
- Sem Docker obrigatorio, a menos que o usuario peca.
- Sem CI obrigatorio neste momento.
- Sem Git hooks obrigatorios neste momento.
- Sem skills do Codex.
- Sem ADRs.
- Sem documentacao extra.
- Sem arquitetura enterprise.
