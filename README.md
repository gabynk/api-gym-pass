# GymPass style app

Aplicação backend inspirada no modelo GymPass, com foco em autenticação, controle de academias e check-ins de usuários.
Este projeto foi desenvolvido para praticar Node.js, Fastify, JWT, autenticação, banco de dados relacional (PostgreSQL) e SOLID.

## Sobre o Projeto

Este projeto foi desenvolvido durante o curso Ignite Node.js da Rocketseat.

Além do conteúdo ensinado no curso, foram feitas adaptações e melhorias próprias, como:
- Fluxo de convite e criação de senha pelo usuário quando o cadastro é feito pela academia
- Gestão de membros (ativar/inativar, listar, buscar dados da academia)
- Logout com refresh token invalidável
- Regras adicionais de negócio para reforçar a segurança e consistência do sistema
- Integração de monitoramento de erros com o Sentry

Esse mix entre aprendizado guiado e customizações pessoais foi pensado para aprofundar conceitos de arquitetura limpa, autenticação, segurança e regras de domínio.

## Tecnologias

- Node.js
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- JWT (JSON Web Token)
- Vitest / Supertest (para testes)
- Sentry (monitoramento e rastreamento de erros)

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar.
- [x] Deve ser possível se autentificar.
- [x] Deve ser possível obter o perfil de um usuário logado
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado.
- [x] Deve ser possível o usuário obter seu histórico de check-ins
- [x] Deve ser possível o usuário buscar academias próximas (até 10km)
- [x] Deve ser possível o usuário buscar academias pelo nome
- [x] Deve ser possível o usuário realizar check-in em uma academia
- [x] Deve ser possível validar o check-in de um usuário
- [x] Deve ser possível cadastrar uma academia
- [x] Deve ser possível a academia poder cadastrar um usuário
- [x] Deve ser possível deslogar da aplicação 
- [x] Deve ser possível vincular um usuário a academia
- [x] Deve ser possível ativar/inativar um usuário
- [x] Deve ser possível listar membros da academia
- [x] Deve ser possível buscar os dados da academia
- [x] Deve ser possível a academia buscar os check-ins do seus usuários

## RNs (Regras de negócios)

- [x] O usuário não deve poder se cadastrar com um email duplicado
- [x] O usuário não pode fazer 2 check-ins no mesmo dia
- [x] O usuário não pode fazer check-in se não tiver perto (100m) da academia
- [x] O check-in só pode ser validado até 20 minutos após criado
- [x] O check-in só pode ser validado por administradores
- [x] A academia só pode ser cadastrada por administradores de sistemas
- [x] Só pode alterar os dados do cinculo da academia por administradores de sistemas ou administradores e funcionários da academia
  - [x] Vincular o usuário
  - [x] ativar/inativar um usuário
- [x] O refresh token deve ser salvo no DB para poder invalidar caso necessário
- [x] O usuário deve ser identificado por um JWT (JSON Web Token)
- [x] O usuário não pode fazer check-in em academia que não tem vinculo ativo
- [x] O usuário deve criar sua senha se o cadastro for feito pela academia


## RNFs (Requisitos não funcionais)

- [x] A senha do usuário precisa estar criptografada
- [x] Os dados da aplicação precisa estar persistidos em um banco PostgreSQL
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página
