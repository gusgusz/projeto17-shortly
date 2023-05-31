# projeto17-shortly

# Projeto17 Shortly

Este projeto é uma aplicação para encurtar URLs.

## Rotas

A seguir, estão as rotas disponíveis neste projeto:

### 1. Rota de encurtamento de URL

`POST /urls/shorten`

Esta rota permite encurtar uma URL longa. O corpo da solicitação deve incluir um objeto JSON com a propriedade "url" contendo a URL longa que deseja encurtar.

Exemplo de corpo da solicitação:
```json
{
  "url": "https://www.example.com/very/long/url"
}

2. Rota de exibição de URL

GET /urls/:id

Esta rota exibe informações sobre uma URL específica com base no ID fornecido.

Exemplo de solicitação:

bash

GET /urls/123456789

3. Rota de abertura de URL

GET /urls/open/:shortUrl

Esta rota permite abrir uma URL encurtada. A URL encurtada deve ser fornecida como parâmetro na rota.

Exemplo de solicitação:

sql

GET /urls/open/abcd123

Se a URL encurtada existir no banco de dados, o servidor irá redirecionar para a URL original correspondente.
4. Rota de exclusão de URL

DELETE /urls/:id

Esta rota permite excluir uma URL específica com base no ID fornecido. A autenticação é necessária para acessar esta rota.

Exemplo de solicitação:

bash

DELETE /urls/123456789

5. Rota de exibição de URLs do usuário

GET /users/me

Esta rota exibe todas as URLs encurtadas pelo usuário autenticado. A autenticação é necessária para acessar esta rota.
6. Rota de exibição do ranking

GET /ranking

Esta rota exibe um ranking das URLs mais visitadas ou populares.
7. Rota de cadastro de usuário

POST /signup

Esta rota permite que um novo usuário se cadastre na aplicação. O corpo da solicitação deve incluir informações do usuário, como nome, email e senha.
8. Rota de login de usuário

POST /signin

Esta rota permite que um usuário faça login na aplicação. O corpo da solicitação deve incluir informações de login, como email e senha.
