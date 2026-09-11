<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" width="200" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">🌳Circuito Magé Verde - Divulgação de Eventos voltados para o turísmo ecológico</h1>
<p align="center">
  <a href="#" target="blank">
    <img src="src/image/cleanArquitecture.png" width="300" alt="C.A" />
  </a>
</p>

<p align="center">
  <b>Backend desenvolvido com Clean Architecture e NodeJs</b><br/>
  <b>Focado em desacoplamento, escalabilidade de código e organização por camadas de domínio.</b>
</p>

## 🧠 Sobre o Projeto

O **Magé Verde** é um backend projetado para divulgar e gerenciar eventos voltados ao turísmo ecológico .  
Ele segue os princípios da **Clean Architecture**, garantindo independência de frameworks e fácil manutenção do core da aplicação.

---

### End-Points:

| Método   | Endpoint                             | Descrição                            |
| :------- | :----------------------------------- | :----------------------------------- |
| **POST** | `http://localhost:3333/create/admin` | Cria uma nova conta de Administrador |

#### Exemplo de Body:

```json
{
  "name": "johnSnow",
  "email": "johnSnow@gmail.com",
  "password": "123123"
}
```

---

| Método   | Endpoint                                   | Descrição                      |
| :------- | :----------------------------------------- | :----------------------------- |
| **POST** | `http://localhost:3333/authenticate/admin` | Fazer Login como Administrador |

#### Exemplo de Body:

```json
{
  "email": "johnSnow@gmail.com",
  "password": "123123"
}
```

---

| Método   | Endpoint                             | Descrição                      |
| :------- | :----------------------------------- | :----------------------------- |
| **POST** | `http://localhost:3333/delete/admin` | Excluir conta de Administrador |

#### Exemplo de Body:

### \_Bearer Token `${SEU_TOKEN}`

```json
{
  "email": "johnSnow@gmail.com"
}
```

---
### End-Points:

| Método   | Endpoint                             | Descrição                            |
| :------- | :----------------------------------- | :----------------------------------- |
| **POST** | `http://localhost:3333/create/user` | Cria uma nova conta de Usuário |

#### Exemplo de Body:

```json
{
  "name": "johnSnow",
  "email": "johnSnow@gmail.com",
  "password": "123123"
}
```

---

| Método   | Endpoint                                   | Descrição                      |
| :------- | :----------------------------------------- | :----------------------------- |
| **POST** | `http://localhost:3333/authenticate/user` | Fazer Login como Usuário |

#### Exemplo de Body:

```json
{
  "email": "johnSnow@gmail.com",
  "password": "123123"
}
```

---

| Método   | Endpoint                             | Descrição                      |
| :------- | :----------------------------------- | :----------------------------- |
| **POST** | `http://localhost:3333/delete/user` | Excluir conta de Usuário |

#### Exemplo de Body:

### \_Bearer Token `${SEU_TOKEN}`

```json
{
  "email": "johnSnow@gmail.com"
}
```

---

| Método   | Endpoint                             | Descrição            |
| :------- | :----------------------------------- | :------------------- |
| **POST** | `http://localhost:3333/create/event` | Criar um novo evento |

#### Exemplo de Body:

### \_Bearer Token `${SEU_TOKEN}`

```json
{
      "title":"Conteúdo",
      "content":"Conteúdo",
      "colaborators":"Conteúdo",
      "time":"Conteúdo",
}
```
### \_Imagem `2Mb` 
---

| Método   | Endpoint                             | Descrição            |
| :------- | :----------------------------------- | :------------------- |
| **POST** | `http://localhost:3333/delete/event` | Deletar um evento |

#### Exemplo de Body:

### \_Bearer Token `${SEU_TOKEN}`

```json
{
      "eventId":"*****-*****-*****"
}
```

---

| Método   | Endpoint                             | Descrição            |
| :------- | :----------------------------------- | :------------------- |
| **GET** | `http://localhost:3333/get/events` | Listar todos os eventos |

---

| Método | Endpoint | Descrição |
| :----- | :------- | :-------- |
| **GET** | `http://localhost:3333/get/events/mine` | Listar os eventos criados pelo usuário autenticado |
| **GET** | `http://localhost:3333/admin/events` | Listar somente eventos pendentes e retornar `pendingCount` — somente administradores |
| **PATCH** | `http://localhost:3333/admin/events/:eventId/status` | Aprovar ou rejeitar evento pendente — somente administradores |

Eventos criados por usuários começam como `PENDING` e só aparecem no guia público depois de serem aprovados. A rota `POST /delete/event` permite que administradores excluam qualquer evento; usuários comuns só podem excluir eventos criados por eles mesmos.

#### Exemplo de moderação

```json
{
  "status": "APPROVED"
}
```

---

## 🚀 Setup

```bash
# Instalar dependências
$ npm install

# Configurar o ambiente
$ cp .env.example .env

# Subir o PostgreSQL local na porta 5433
$ docker compose up -d postgres

# Aplicar as migrações
$ npx prisma migrate deploy

# Criar dados de teste
$ npm run db:seed

# Iniciar a API
$ npm run start:dev

# Rodar os testes unitários
$ npm run test

# Rodar testes E2E
$ npm run test:e2e
```

As credenciais criadas pelo seed são:

- Usuário: `usuario@mageverde.local` / `123456`
- Administrador: `admin@mageverde.local` / `123456`

## 🚀 Gerando Public e Private Keys para JWT (RSA256)

<p align="center">
  <b>O algoritmo RS256 usa criptografia assimétrica, com:</b><br/>
  <b>private.key → usada para assinar o token</b><br/>
  <b>public.key → usada para validar o token</b><br/>
</p>

```bash
# 🔐 Gerar as chaves (Linux, macOS, Git Bash)

# 1️⃣ Gerar a Private Key (4096 bits recomendado)

$ openssl genrsa -out private.key 4096

# 2️⃣ Gerar a Public Key a partir da Private Key

$ openssl rsa -in private.key -pubout -out public.key

```

## 🐳 Configuração do Docker

<p align="center">
  <b>▶️ Rodar o ambiente Docker</b><br/>
</p>

```bash
# Subir containers

$ docker compose up -d
```

## 🗄️ Configurando a DATABASE_URL no Prisma

<p align="center">
  <b>📌 Com o Docker rodando, seu Postgres estará disponível em:</b><br/>
  <b>HOST → localhost</b><br/>
  <b>PORT → 5433</b><br/>
  <b>USER → postgres</b><br/>
  <b>PASSWORD → docker</b><br/>
  <b>DATABASE → mageVerde-api</b><br/>
</p>

```bash
#  DATABASE_URL recomendada

$ DATABASE_URL="postgresql://postgres:docker@localhost:5433/mageVerde-api?schema=public"

```
## 🚀 Deploy: `https://mvp-mageverde.onrender.com`
