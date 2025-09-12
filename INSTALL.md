# Guia de Instalação - Connexa Frontend

## Pré-requisitos

- Node.js 16 ou superior
- npm ou yarn
- Git

## Passo a Passo

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd connexa-frontend
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env com suas configurações
# REACT_APP_API_URL=http://localhost:3001
```

### 4. Execute a Aplicação
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Scripts Disponíveis

- `npm start` - Executa a aplicação em modo de desenvolvimento
- `npm build` - Cria build de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejeta a configuração do Create React App

## Configuração do Back-end

Certifique-se de que o back-end está rodando na URL configurada no arquivo `.env`.

O back-end deve implementar as seguintes rotas:

### Autenticação
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/avatar

### Grupos
- GET /api/groups
- POST /api/groups
- GET /api/groups/:id
- POST /api/groups/:id/join
- POST /api/groups/:id/leave
- GET /api/groups/my-groups
- GET /api/groups/search

### WebSocket
- Conexão WebSocket para chat e notificações
- Events: join_group, leave_group, send_message, new_message, typing, stop_typing, notification

## Troubleshooting

### Erro de CORS
Se você encontrar erros de CORS, configure o back-end para aceitar requisições do front-end.

### Erro de WebSocket
Verifique se o back-end está rodando e se a URL está correta no arquivo `.env`.

### Erro de Build
Execute `npm run build` para verificar se há erros de compilação.

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
