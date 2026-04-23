# Missão de Estudo — plataforma pronta para rodar

Esta é uma base full-stack em **Next.js + Supabase + Mercado Pago (Pix)** para vender conteúdos protegidos com login, compras vitalícias, área do aluno, grupo de WhatsApp e painel administrativo.

## O que já vem pronto

- tema escuro profissional da **Missão de Estudo**
- autenticação com email e senha
- área do aluno com **Minhas Compras**
- botão para entrar no **grupo do WhatsApp**
- produto inicial **Português PMAL** por **R$ 29,90**
- integração com Pix via **Mercado Pago**
- webhook para confirmação de pagamento
- acesso vitalício por compra aprovada
- painel admin com:
  - dashboard
  - minhas vendas
  - usuários
  - bloquear / reativar acesso
  - produtos
  - conteúdos
- proteção de conteúdo por permissão de compra
- seu jogo HTML inicial já incluído como conteúdo privado

## Stack usada

- Next.js App Router
- Tailwind CSS
- Supabase Auth + Postgres + Row Level Security
- Mercado Pago Checkout Transparente via Pix

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha as variáveis do Supabase e do Mercado Pago.

4. No Supabase, execute o SQL de `supabase/schema.sql`.

5. Inicie o projeto:

```bash
npm run dev
```

6. Acesse:

```txt
http://localhost:3000
```

## Primeiro acesso admin

- defina `ADMIN_EMAIL` no `.env.local`
- crie esse usuário pelo fluxo de cadastro/login
- depois rode no Supabase:

```sql
update public.profiles
set role = 'admin'
where email = 'SEU_EMAIL_ADMIN';
```

## Mercado Pago

A integração usa criação de pagamento Pix no endpoint `/v1/payments`, conforme a documentação oficial do Mercado Pago para Pix no Checkout Transparente, com confirmação por webhook. citeturn898494search2turn898494search6turn898494search8

## Supabase

A aplicação usa `@supabase/ssr`, recomendado pela documentação atual do Supabase para apps Next.js com autenticação SSR. citeturn898494search5turn898494search9turn898494search11

## Estrutura principal

```txt
app/
  (public)/
  account/
  admin/
  auth/
  api/
components/
lib/
private-content/
supabase/
```

## Observações importantes

- É uma base **pronta para rodar e vender**, mas ainda depende das suas credenciais reais.
- Nenhum sistema online é “impossível” de fraudar; aqui a proteção foi feita para dificultar muito vazamento e acesso indevido.
- Para produção, publique em Vercel e configure webhook HTTPS.
- Para uploads de novos conteúdos no admin, o fluxo recomendado é migrar do diretório local para um bucket privado do Supabase Storage na próxima evolução.
