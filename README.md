
# Atividade para seleção Ser Educacional

Para testar:

## Via Docker

Basta executar na raiz do projeto:

``
docker-compose up
``

## Manualmente

Execute o PostgreSQL no localhost, na porta 5432. Conectado ao banco, execute as seguintes operações:

``
create user usuario with password 'senha';
``
``
create database sereducacional with owner usuario;
``

Entre no diretório api e execute:
``
npm install
``
``
npm start
``

Faça o mesmo no diretório app.
