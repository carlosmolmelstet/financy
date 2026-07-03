# Guia do Projeto

Este documento concentra o contexto necessario para desenvolver a aplicacao do desafio. Ele deve ser usado como fonte de verdade para requisitos funcionais, requisitos tecnicos, estrutura de entrega e referencias visuais do Figma.

## Objetivo

Construir uma aplicacao full stack para gerenciamento de financas pessoais.

A aplicacao deve permitir que uma pessoa usuaria crie uma conta, faca login, cadastre categorias, registre transacoes de entrada e saida, edite e remova seus proprios dados, e acompanhe as informacoes pela interface web.

## Estrutura obrigatoria do repositorio

O repositorio de entrega deve ser publico e conter a resolucao completa do desafio, com duas subpastas na raiz:

```txt
backend/
frontend/
```

- `backend/`: API completa do desafio.
- `frontend/`: aplicacao web completa do desafio.

## Regras gerais

- A aplicacao deve ser executavel localmente.
- As funcionalidades obrigatorias devem ficar preservadas na branch principal de entrega.
- Funcionalidades extras, caso sejam adicionadas, devem ficar em outra branch para nao comprometer a correcao.
- O projeto deve conter arquivos `.env.example` com todas as variaveis de ambiente necessarias.
- Nenhum segredo real deve ser versionado.
- A API deve habilitar CORS.
- O layout do frontend deve seguir o Figma da forma mais fiel possivel.

## Stack obrigatoria

### Back-end

- TypeScript
- GraphQL
- Prisma
- SQLite

### Front-end

- TypeScript
- React
- Vite sem framework
- GraphQL para consultas e mutacoes na API

## Stack opcional recomendada

O desafio permite o uso das seguintes ferramentas no front-end:

- TailwindCSS
- Shadcn/ui ou componentes equivalentes
- React Query
- React Hook Form
- Zod

## Variaveis de ambiente

### Back-end

O arquivo `backend/.env.example` deve conter, no minimo:

```env
JWT_SECRET=
DATABASE_URL=
```

Se o back-end usar variaveis adicionais, elas tambem devem ser adicionadas ao `backend/.env.example`.

### Front-end

O arquivo `frontend/.env.example` deve conter, no minimo:

```env
VITE_BACKEND_URL=
```

Se o front-end usar variaveis adicionais, elas tambem devem ser adicionadas ao `frontend/.env.example`.

## Requisitos funcionais do back-end

- O usuario pode criar uma conta.
- O usuario pode fazer login.
- O usuario autenticado pode ver e gerenciar apenas as transacoes criadas por ele.
- O usuario autenticado pode ver e gerenciar apenas as categorias criadas por ele.
- Deve ser possivel criar uma transacao.
- Deve ser possivel deletar uma transacao.
- Deve ser possivel editar uma transacao.
- Deve ser possivel listar todas as transacoes do usuario autenticado.
- Deve ser possivel criar uma categoria.
- Deve ser possivel deletar uma categoria.
- Deve ser possivel editar uma categoria.
- Deve ser possivel listar todas as categorias do usuario autenticado.

## Requisitos funcionais do front-end

- O usuario pode criar uma conta.
- O usuario pode fazer login.
- O usuario autenticado pode ver e gerenciar apenas as transacoes criadas por ele.
- O usuario autenticado pode ver e gerenciar apenas as categorias criadas por ele.
- Deve ser possivel criar uma transacao.
- Deve ser possivel deletar uma transacao.
- Deve ser possivel editar uma transacao.
- Deve ser possivel listar todas as transacoes do usuario autenticado.
- Deve ser possivel criar uma categoria.
- Deve ser possivel deletar uma categoria.
- Deve ser possivel editar uma categoria.
- Deve ser possivel listar todas as categorias do usuario autenticado.
- A aplicacao React deve usar GraphQL para se comunicar com a API.
- A aplicacao deve usar Vite como bundler, sem framework.
- O layout deve seguir o Figma da forma mais fiel possivel.

## Paginas e telas

A aplicacao possui 6 paginas e 2 modais com formularios em formato de dialog.

### Rota raiz

Rota: `/`

Comportamento esperado:

- Se o usuario estiver deslogado, deve exibir a tela de login.
- Se o usuario estiver logado, deve exibir o dashboard.

### Telas esperadas

As telas individuais devem ser confirmadas pelo Figma durante a implementacao, mas a aplicacao precisa cobrir os fluxos obrigatorios:

- Login
- Cadastro de usuario
- Dashboard
- Listagem e gerenciamento de transacoes
- Listagem e gerenciamento de categorias
- Area de dados do usuario ou perfil, caso esteja prevista no Figma

### Modais obrigatorios

- Dialog com formulario para criar ou editar transacao.
- Dialog com formulario para criar ou editar categoria.

## Figma

Usar primeiro a aba de Style Guide para preparar tema, fontes, cores, componentes e tokens visuais antes de desenvolver as telas.

- [Style Guide](https://www.figma.com/design/rnR7GrRwPSFcAody6slaKM/Financy--Community-?node-id=1085-711&m=dev)
- [Componentes](https://www.figma.com/design/rnR7GrRwPSFcAody6slaKM/Financy--Community-?node-id=1085-814&m=dev)
- [Todas as telas](https://www.figma.com/design/rnR7GrRwPSFcAody6slaKM/Financy--Community-?node-id=3-809&m=dev)

Quando as telas forem desenvolvidas, usar os links individuais do Figma para validar espacamentos, tipografia, cores, estados e componentes.

## Modelo de dominio esperado

O modelo final pode ser ajustado durante a implementacao, mas deve suportar pelo menos:

### Usuario

- Identificador unico
- Nome
- E-mail unico
- Senha com hash
- Data de criacao
- Data de atualizacao

### Categoria

- Identificador unico
- Nome
- Descricao opcional, se fizer sentido para o layout
- Cor e/ou icone, se fizer sentido para o layout
- Vinculo com o usuario dono
- Data de criacao
- Data de atualizacao

### Transacao

- Identificador unico
- Descricao ou titulo
- Valor
- Tipo da transacao, como entrada ou saida
- Data da transacao
- Vinculo com o usuario dono
- Vinculo opcional ou obrigatorio com categoria, conforme decisao de produto durante a implementacao
- Data de criacao
- Data de atualizacao

## Regras de seguranca e autorizacao

- Senhas devem ser armazenadas com hash.
- Login deve retornar um token JWT.
- Rotas, queries e mutations privadas devem exigir autenticacao.
- Toda operacao de listagem, edicao e delecao deve filtrar pelo usuario autenticado.
- Um usuario nunca deve conseguir acessar, editar ou deletar transacoes e categorias de outro usuario.

## Contrato GraphQL esperado

O schema GraphQL deve expor operacoes suficientes para atender todas as funcionalidades obrigatorias.

### Autenticacao

- Criar conta
- Fazer login
- Obter usuario autenticado, se necessario para a interface

### Categorias

- Listar categorias do usuario autenticado
- Criar categoria
- Editar categoria
- Deletar categoria

### Transacoes

- Listar transacoes do usuario autenticado
- Criar transacao
- Editar transacao
- Deletar transacao

## Boas praticas de implementacao

### Back-end

- Separar responsabilidades entre resolvers, services, modelos, DTOs/inputs e utilitarios.
- Centralizar leitura de variaveis de ambiente.
- Validar entradas recebidas pelas mutations.
- Tratar erros de autenticacao e autorizacao de forma consistente.
- Manter o Prisma Client centralizado.
- Criar migrations do Prisma para o schema do banco.

### Front-end

- Comecar pela configuracao de tema, tokens e componentes base do Figma.
- Separar paginas, componentes reutilizaveis, hooks, schemas de formulario e funcoes de GraphQL.
- Usar formularios validados para login, cadastro, categorias e transacoes.
- Manter token de autenticacao de forma consistente no cliente.
- Redirecionar ou proteger telas que exigem usuario autenticado.
- Exibir estados de carregamento, erro, vazio e sucesso nas telas principais.

## Checklist de entrega

### Back-end

- [ ] O usuario pode criar uma conta.
- [ ] O usuario pode fazer login.
- [ ] O usuario pode ver e gerenciar apenas as transacoes e categorias criadas por ele.
- [ ] Deve ser possivel criar uma transacao.
- [ ] Deve ser possivel deletar uma transacao.
- [ ] Deve ser possivel editar uma transacao.
- [ ] Deve ser possivel listar todas as transacoes.
- [ ] Deve ser possivel criar uma categoria.
- [ ] Deve ser possivel deletar uma categoria.
- [ ] Deve ser possivel editar uma categoria.
- [ ] Deve ser possivel listar todas as categorias.
- [ ] O projeto usa TypeScript.
- [ ] O projeto usa GraphQL.
- [ ] O projeto usa Prisma.
- [ ] O projeto usa SQLite.
- [ ] O projeto possui `backend/.env.example`.
- [ ] A API habilita CORS.
- [ ] A aplicacao executa localmente.

### Front-end

- [ ] O usuario pode criar uma conta.
- [ ] O usuario pode fazer login.
- [ ] O usuario pode ver e gerenciar apenas as transacoes e categorias criadas por ele.
- [ ] Deve ser possivel criar uma transacao.
- [ ] Deve ser possivel deletar uma transacao.
- [ ] Deve ser possivel editar uma transacao.
- [ ] Deve ser possivel listar todas as transacoes.
- [ ] Deve ser possivel criar uma categoria.
- [ ] Deve ser possivel deletar uma categoria.
- [ ] Deve ser possivel editar uma categoria.
- [ ] Deve ser possivel listar todas as categorias.
- [ ] O projeto usa TypeScript.
- [ ] O projeto usa React.
- [ ] O projeto usa Vite sem framework.
- [ ] O projeto usa GraphQL para consultas e mutacoes na API.
- [ ] O projeto possui `frontend/.env.example`.
- [ ] O layout segue o Figma da forma mais fiel possivel.
- [ ] A aplicacao executa localmente.

## Ordem sugerida de desenvolvimento

1. Criar estrutura `backend/` e `frontend/`.
2. Configurar back-end com TypeScript, GraphQL, Prisma, SQLite, CORS e variaveis de ambiente.
3. Modelar banco de dados com usuarios, categorias e transacoes.
4. Implementar autenticacao com cadastro, login, hash de senha e JWT.
5. Implementar queries e mutations privadas de categorias.
6. Implementar queries e mutations privadas de transacoes.
7. Criar front-end com Vite, React, TypeScript e GraphQL client.
8. Configurar tema visual a partir do Style Guide do Figma.
9. Implementar fluxo de login e cadastro.
10. Implementar layout autenticado e dashboard.
11. Implementar categorias.
12. Implementar transacoes.
13. Validar regras de autorizacao entre usuarios.
14. Testar fluxo completo localmente.
15. Revisar checklist e preparar entrega.
