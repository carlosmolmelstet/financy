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

O projeto usa SQLite via Prisma. Nao e necessario configurar banco remoto para a entrega do desafio; por padrao, use `DATABASE_URL=file:./dev.db` no backend.

O arquivo `backend/prisma/dev.db` e gerado localmente pelo Prisma ao rodar as migrations. A aplicacao nao depende de dados iniciais: apos a migration, basta criar uma conta pela interface para testar os fluxos.

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Preencha `backend/.env` com:

```env
JWT_SECRET=uma-chave-local-segura
DATABASE_URL=file:./dev.db
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

O endpoint GraphQL fica disponivel em `http://localhost:4000/graphql`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Preencha `frontend/.env` com:

```env
VITE_BACKEND_URL=http://localhost:4000/graphql
```

Com o Vite, a aplicacao web fica disponivel em `http://localhost:5173`.

## Variaveis de ambiente

Backend:

- `JWT_SECRET`
- `DATABASE_URL`
- `PORT`
- `CORS_ORIGIN`

Frontend:

- `VITE_BACKEND_URL`

## Scripts

Backend:

- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:studio`
- `npm test`

Frontend:

- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm run preview`

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
- Banco SQLite configurado com Prisma.

O checklist completo esta em `PROJECT_GUIDE.md`.
