# Armazém Digital: API REST

Trabalho prático de **Banco de Dados II**

API REST para o cadastro e o controle de produtos de um pequeno armazém, feita com **Node.js**, **Express 5** e **MongoDB** (via **Mongoose 8**). Os dados ficam gravados no banco e permanecem após reiniciar a API.

## Integrante

- Luendell Carlos

## Tecnologias

| Ferramenta            | Uso                                     |
| --------------------- | --------------------------------------- |
| Node.js 22 LTS + npm  | Ambiente de execução e dependências     |
| Express 5             | Servidor HTTP, rotas e middlewares      |
| Mongoose 8            | Modelagem e validação dos documentos    |
| MongoDB Community 8.0 | Banco de dados de documentos (local)    |
| dotenv                | Leitura das variáveis do arquivo `.env` |
| nodemon               | Reinício automático em desenvolvimento  |
| Postman               | Testes das requisições                  |
| MongoDB Compass       | Inspeção visual do banco                |

## Requisitos

- Windows 10/11 com PowerShell
- Node.js 22 e npm instalados
- MongoDB Community Server instalado como serviço e **em execução** (porta 27017)

Para conferir o ambiente:

```powershell
node --version
npm.cmd --version
Get-Service -Name MongoDB
Test-NetConnection 127.0.0.1 -Port 27017
```

Se o serviço estiver parado, abra o PowerShell **como administrador** e rode:

```powershell
Start-Service -Name MongoDB
```

## Instalação

```powershell
git clone <URL-DO-REPOSITORIO>
cd armazem-digital
npm.cmd install
copy .env.example .env
```

O arquivo `.env` define a porta da API e o endereço do banco:

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/armazem_api
```

> O banco se chama `armazem_api` para ficar separado dos bancos dos laboratórios anteriores da disciplina. Ele e a coleção `produtos` são criados automaticamente na primeira gravação.

## Execução

Modo desenvolvimento (reinicia ao salvar arquivos):

```powershell
npm.cmd run dev
```

Modo normal:

```powershell
npm.cmd start
```

Saída esperada no terminal:

```
MongoDB conectado
API na porta 3000
```

Teste rápido:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:3000/saude
```

Resposta: `status : ok`.

## Estrutura do projeto

```
armazem-digital/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── armazem-digital.postman_collection.json
├── evidencias/
└── src/
    ├── server.js
    ├── config/db.js
    ├── models/Produto.js
    ├── controllers/produtoController.js
    ├── routes/produtoRoutes.js
    └── middlewares/
        ├── validarProduto.js
        └── erros.js
```

## Fluxo de uma requisição

1. O **Postman** envia método, URL e JSON.
2. O **Express** encontra a rota e executa os middlewares (`validarId`, `validarProduto`).
3. O **controller** coordena a operação.
4. O **model** (Mongoose) valida os dados e acessa os documentos no MongoDB.
5. A API devolve o status HTTP e o JSON de resposta.

## Documento Produto

| Campo                     | Tipo     | Regra                                  |
| ------------------------- | -------- | -------------------------------------- |
| `nome`                    | String   | Obrigatório, de 2 a 100 caracteres     |
| `descricao`               | String   | Opcional, até 500 caracteres           |
| `preco`                   | Number   | Obrigatório, maior ou igual a zero     |
| `quantidade`              | Number   | Obrigatório, inteiro não negativo      |
| `ativo`                   | Boolean  | Padrão `true`                          |
| `_id`                     | ObjectId | Gerado pelo MongoDB                    |
| `createdAt` / `updatedAt` | Date     | Gerados automaticamente (`timestamps`) |

## Rotas

| Método | Caminho             | Sucesso                    |
| ------ | ------------------- | -------------------------- |
| GET    | `/saude`            | 200 + `{ "status": "ok" }` |
| POST   | `/api/produtos`     | 201 + produto criado       |
| GET    | `/api/produtos`     | 200 + array de produtos    |
| GET    | `/api/produtos/:id` | 200 + produto              |
| PATCH  | `/api/produtos/:id` | 200 + produto atualizado   |
| DELETE | `/api/produtos/:id` | 204 sem corpo              |

### Exemplo de corpo (POST)

```json
{
  "nome": "Café Torrado 500 g",
  "descricao": "Pacote de café do Armazém Digital",
  "preco": 24.9,
  "quantidade": 30,
  "ativo": true
}
```

O `PATCH` altera apenas os campos enviados, por exemplo `{ "preco": 22.5, "quantidade": 25 }`.

## Validação e tratamento de erros

Campos permitidos: `nome`, `descricao`, `preco`, `quantidade` e `ativo`. A validação acontece em duas camadas: o middleware `validarProduto` confere tipos e campos extras, e o Mongoose aplica as regras de negócio (inclusive no `PATCH`, com `runValidators`).

| Cenário                               | Resposta                              |
| ------------------------------------- | ------------------------------------- |
| POST sem `nome`                       | 400 `Dados inválidos`                 |
| PATCH com `preco: -1`                 | 400 `Dados inválidos`                 |
| PATCH com `quantidade: 1.5`           | 400 `Dados inválidos`                 |
| `preco` enviado como texto (`"24.9"`) | 400 `Campo ou tipo inválido: preco`   |
| Campo extra no corpo                  | 400 `Campo ou tipo inválido: <campo>` |
| Corpo vazio `{}`                      | 400 `Envie um objeto JSON não vazio`  |
| `GET /api/produtos/abc`               | 400 `ID inválido`                     |
| ID válido que não existe              | 404 `Produto não encontrado`          |
| JSON malformado                       | 400 `JSON inválido`                   |
| Corpo acima de 100 KB                 | 413 `JSON excede o limite de 100 KB`  |
| Rota inexistente                      | 404 `Rota não encontrada`             |

Entradas inválidas não alteram o banco.

## Desafio escolhido: filtro por `ativo` e busca por nome

A listagem aceita dois parâmetros opcionais na URL, que podem ser combinados:

| Exemplo                                  | Resultado                                                     |
| ---------------------------------------- | ------------------------------------------------------------- |
| `GET /api/produtos?ativo=true`           | Apenas produtos ativos                                        |
| `GET /api/produtos?ativo=false`          | Apenas produtos inativos                                      |
| `GET /api/produtos?nome=café`            | Produtos cujo nome contém "café" (sem diferenciar maiúsculas) |
| `GET /api/produtos?ativo=true&nome=café` | Os dois filtros juntos                                        |
| `GET /api/produtos?ativo=talvez`         | 400 `ativo deve ser true ou false`                            |

Na busca por nome, os caracteres especiais de expressão regular são escapados, para que o texto digitado seja tratado apenas como texto.

## Testes no Postman

Importe o arquivo `armazem-digital.postman_collection.json` no Postman. A coleção usa duas variáveis:

- `baseUrl` = `http://127.0.0.1:3000`
- `produtoId` = preenchida automaticamente pelo teste do `POST criar produto`

Sequência funcional:

| Passo | Requisição                      | Evidência                        |
| ----- | ------------------------------- | -------------------------------- |
| 1     | POST de um produto válido       | 201 e `_id` salvo em `produtoId` |
| 2     | GET da lista e GET por ID       | 200 e produto localizado         |
| 3     | PATCH de preço e quantidade     | 200 e valores alterados          |
| 4     | Reiniciar a API e repetir o GET | O produto permanece no banco     |
| 5     | DELETE por ID                   | 204 e corpo vazio                |
| 6     | GET do ID excluído              | 404 `Produto não encontrado`     |

A coleção também contém uma requisição para cada cenário de erro da tabela acima e as três requisições do desafio de extensão.

## Evidências

A pasta [`evidencias/`](evidencias/) reúne os prints da execução:

- CRUD completo no Postman (criar, listar, buscar, atualizar, excluir);
- cada caso de erro, com o status e a mensagem recebidos;
- persistência: GET após reiniciar a API;
- conferência dos documentos no MongoDB Compass (`armazem_api > produtos`);
- requisições do desafio de extensão (filtro por `ativo`, busca por nome e filtro inválido).

## Problemas frequentes no Windows

| Sintoma                    | Verificação / correção                                     |
| -------------------------- | ---------------------------------------------------------- |
| `node` não reconhecido     | Reabrir o terminal e verificar a instalação e o PATH       |
| `npm.ps1` bloqueado        | Usar `npm.cmd` nos comandos                                |
| `ECONNREFUSED` no MongoDB  | Conferir o serviço `MongoDB` e a porta 27017               |
| `MONGODB_URI não definida` | Conferir o `.env` na raiz e se o nome não ficou `.env.txt` |
| `EADDRINUSE` na porta 3000 | Encerrar a instância anterior ou mudar `PORT` no `.env`    |
| `req.body` ausente         | Enviar o corpo em _raw / JSON_ no Postman                  |
