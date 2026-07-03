# Financy

## Sobre

Financy e uma aplicacao full stack de financas pessoais criada conforme o contexto e os requisitos definidos em `PROJECT_GUIDE.md`.

A aplicacao permite que uma pessoa usuaria crie conta, faca login, gerencie categorias e registre transacoes financeiras vinculadas ao seu proprio usuario.

## Estrutura

```txt
backend/
frontend/
```

## Stack

Backend:

- TypeScript
- GraphQL
- Prisma
- SQLite
- CORS
- JWT
- Hash de senha

Frontend:

- TypeScript
- React
- Vite sem framework
- GraphQL para comunicacao com a API

Ferramentas opcionais permitidas, se fizerem sentido:

- TailwindCSS
- Shadcn/ui ou componentes equivalentes
- React Query
- React Hook Form
- Zod

## Como rodar localmente

As instrucoes abaixo serao completadas conforme `backend/` e `frontend/` forem implementados.

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

O endpoint GraphQL fica disponivel em `http://localhost:4000/graphql`.

As migrations serao adicionadas quando o Prisma for configurado.

### Frontend

```bash
cd frontend
cp .env.example .env
# instalar dependencias
# iniciar aplicacao
```

## Variaveis de ambiente

Backend:

- `JWT_SECRET`
- `DATABASE_URL`

Frontend:

- `VITE_BACKEND_URL`

## Scripts

Esta secao sera completada quando os projetos forem criados.

- `dev`
- `build`
- `typecheck`
- `test`, se existir

Backend:

- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm test`

## Checklist de entrega

Checklist resumido:

- Backend em `backend/`.
- Frontend em `frontend/`.
- Autenticacao com cadastro, login, JWT e hash de senha.
- CRUD privado de categorias.
- CRUD privado de transacoes.
- Isolamento de dados por usuario autenticado.
- Comunicacao frontend/backend via GraphQL.
- Arquivos `.env.example` nos dois projetos.
- Aplicacao executavel localmente.
- Layout seguindo o Figma.

O checklist completo esta em `PROJECT_GUIDE.md`.
