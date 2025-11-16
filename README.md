<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" width="200" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">🌳Circuito Magé Verde - Divulgação de Eventos voltados para o turísmo ecológico</h1>
<p align="center">
  <a href="#" target="blank">
    <img src="/images/cleanArquitecture.png" width="300" alt="C.A" />
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

## 🚀 Setup

```bash
# Instalar dependências
$ npm install

# Rodar os testes unitários
$ npm run test

# Rodar testes E2E
$ npm run test:e2e
```

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
  <b>PORT → 5432</b><br/>
  <b>USER → postgres</b><br/>
  <b>PASSWORD → docker</b><br/>
  <b>DATABASE → mageVerde-api</b><br/>
</p>

```bash
#  DATABASE_URL recomendada

$ DATABASE_URL="postgresql://postgres:docker@localhost:5432/mageVerde-api?schema=public"

```

