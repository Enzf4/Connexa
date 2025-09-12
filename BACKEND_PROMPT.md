# Prompt para Criação do Backend Connexa

## 🎯 Contexto do Projeto

Você é um desenvolvedor backend especializado em **Node.js + Express + Socket.io**. Sua tarefa é criar o **backend completo da plataforma Connexa**, uma aplicação de grupos de estudo universitários que já possui frontend React implementado.

### Objetivo:
Construir uma API REST robusta com WebSockets para suportar uma plataforma onde alunos universitários podem:
- Se cadastrar e fazer login
- Criar, buscar e entrar em grupos de estudo
- Gerenciar perfil com upload de imagens
- Utilizar chat em tempo real
- Receber notificações instantâneas

## 🛠️ Stack Tecnológica Obrigatória

- **Node.js** (versão 16+)
- **Express.js** (framework web)
- **Socket.io** (WebSockets para chat e notificações)
- **SQLite** como (banco de dados)
- **JWT** (autenticação)
- **Multer** (upload de arquivos)
- **bcryptjs** (hash de senhas)
- **nodemailer** (envio de emails)
- **express-validator** (validações)
- **cors** (configuração CORS)
- **dotenv** (variáveis de ambiente)

## 📋 Funcionalidades Requeridas

### 🔐 Autenticação (US1, US2)
- **POST /api/auth/register** - Cadastro de usuários
  - Campos: nome, email institucional, curso, período, senha
  - Validação de email institucional
  - Hash da senha com bcrypt
  - Retorno: usuário + JWT token

- **POST /api/auth/login** - Login
  - Validação de credenciais
  - Retorno: usuário + JWT token

- **GET /api/auth/profile** - Perfil do usuário autenticado
  - Middleware de autenticação JWT
  - Retorno: dados completos do usuário

- **PUT /api/auth/profile** - Atualizar perfil
  - Validação de dados
  - Atualização no banco

- **POST /api/auth/avatar** - Upload de foto de perfil
  - Multer para upload
  - Validação de tipo e tamanho de arquivo
  - Armazenamento local ou cloud

- **POST /api/auth/forgot-password** - Recuperação de senha
  - Geração de token temporário
  - Envio de email com link

- **POST /api/auth/reset-password** - Redefinir senha
  - Validação de token
  - Atualização de senha

### 👥 Grupos de Estudo (US3, US4, US5)
- **POST /api/groups** - Criar grupo
  - Campos: matéria, objetivo, local, descrição, maxMembers, meetingTime, meetingDays
  - Validações completas
  - Criador automaticamente membro

- **GET /api/groups** - Listar grupos
  - Paginação
  - Filtros opcionais (matéria, local, objetivo)
  - Populate de membros e criador

- **GET /api/groups/:id** - Detalhes do grupo
  - Informações completas
  - Lista de membros
  - Verificação de participação do usuário

- **POST /api/groups/:id/join** - Entrar no grupo
  - Verificação de limite de membros
  - Adição do usuário aos membros
  - Notificação para outros membros

- **POST /api/groups/:id/leave** - Sair do grupo
  - Remoção do usuário
  - Notificação para outros membros

- **GET /api/groups/my-groups** - Grupos do usuário
  - Grupos onde é membro ou criador

- **GET /api/groups/search** - Buscar grupos
  - Busca textual em múltiplos campos
  - Filtros combinados

### 💬 Chat em Tempo Real (US7)
- **WebSocket Events:**
  - `join_group` - Entrar em sala de chat do grupo
  - `leave_group` - Sair da sala
  - `send_message` - Enviar mensagem
  - `new_message` - Broadcast de nova mensagem
  - `typing` - Indicador de digitação
  - `stop_typing` - Parar indicador
  - `user_joined` - Usuário entrou no grupo
  - `user_left` - Usuário saiu do grupo

- **Funcionalidades:**
  - Salas de chat por grupo
  - Histórico de mensagens persistente
  - Indicadores de digitação em tempo real
  - Notificações de entrada/saída

### 🔔 Sistema de Notificações (US8)
- **WebSocket Events:**
  - `notification` - Envio de notificação
  - `send_notification` - Criar notificação

- **Tipos de Notificação:**
  - Novo membro no grupo
  - Mensagem não lida
  - Convite para grupo
  - Atualizações de perfil

- **Funcionalidades:**
  - Armazenamento de notificações
  - Marcar como lida
  - Histórico de notificações

## 🗄️ Estrutura do Banco de Dados

### Schema User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  course: String (required),
  semester: Number (required),
  phone: String,
  bio: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Schema Group
```javascript
{
  subject: String (required),
  objective: String (required),
  location: String (required),
  description: String,
  maxMembers: Number (required),
  meetingTime: String (required),
  meetingDays: [String] (required),
  owner: ObjectId (ref: 'User'),
  members: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Schema Message
```javascript
{
  group: ObjectId (ref: 'Group'),
  user: ObjectId (ref: 'User'),
  message: String (required),
  timestamp: Date
}
```

### Schema Notification
```javascript
{
  user: ObjectId (ref: 'User'),
  type: String (required),
  message: String (required),
  data: Object,
  read: Boolean (default: false),
  timestamp: Date
}
```

## 🔧 Configurações e Middlewares

### Middlewares Obrigatórios
- **CORS** configurado para frontend
- **Autenticação JWT** para rotas protegidas
- **Validação de dados** com express-validator
- **Upload de arquivos** com Multer
- **Rate limiting** para segurança
- **Helmet** para headers de segurança

### Variáveis de Ambiente
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/connexa
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 📡 Endpoints da API

### Autenticação
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
POST   /api/auth/avatar
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Grupos
```
GET    /api/groups
POST   /api/groups
GET    /api/groups/:id
POST   /api/groups/:id/join
POST   /api/groups/:id/leave
GET    /api/groups/my-groups
GET    /api/groups/search
```

### Notificações
```
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
```

## 🚀 Estrutura de Arquivos Sugerida

```
backend/
├── src/
│   ├── controllers/     # Lógica dos endpoints
│   ├── models/         # Schemas do Mongoose
│   ├── routes/         # Definição das rotas
│   ├── middleware/     # Middlewares customizados
│   ├── services/       # Lógica de negócio
│   ├── utils/          # Utilitários
│   ├── config/         # Configurações
│   └── socket/         # Lógica do Socket.io
├── uploads/            # Arquivos enviados
├── .env               # Variáveis de ambiente
├── package.json       # Dependências
└── server.js         # Arquivo principal
```

## 📝 Validações Importantes

### Email Institucional
- Aceitar domínios: @gmail.com, @outlook.com, @hotmail.com, @yahoo.com
- Domínios universitários: @estudante.ufpb.br, @ufpb.br, @uepb.edu.br, etc.

### Senha
- Mínimo 8 caracteres
- Pelo menos: 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial

### Upload de Avatar
- Tipos permitidos: JPG, PNG, GIF
- Tamanho máximo: 5MB
- Redimensionamento automático

## 🔒 Segurança

- **JWT** com expiração
- **bcrypt** para senhas
- **Rate limiting** nas rotas
- **Validação** rigorosa de inputs
- **Sanitização** de dados
- **CORS** configurado
- **Helmet** para headers seguros

## 📧 Configuração de Email

- **nodemailer** configurado
- Templates HTML para emails
- Recuperação de senha funcional
- Confirmação de cadastro (opcional)

## 🎯 Entregáveis Esperados

1. **Código funcional** e bem estruturado
2. **Documentação** da API (Swagger/Postman)
3. **Testes** básicos das rotas principais
4. **README** com instruções de instalação
5. **Docker** (opcional mas recomendado)
6. **Scripts** de inicialização do banco

## 🚨 Pontos Críticos

- **WebSockets** devem funcionar perfeitamente
- **Upload de arquivos** deve ser robusto
- **Validações** devem ser completas
- **Tratamento de erros** deve ser consistente
- **Performance** deve ser otimizada
- **Segurança** deve ser prioridade máxima

## 📱 Compatibilidade com Frontend

O backend deve ser **100% compatível** com o frontend React já implementado. Todas as rotas, estruturas de dados e eventos WebSocket devem corresponder exatamente ao que o frontend espera.

---

**🎯 Objetivo Final:** Criar um backend robusto, seguro e escalável que suporte completamente todas as funcionalidades do frontend Connexa, com foco especial em chat em tempo real, notificações e upload de arquivos.
