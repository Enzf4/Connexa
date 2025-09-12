# Connexa - Plataforma de Grupos de Estudo

Connexa é uma aplicação web moderna desenvolvida em React.js que permite aos estudantes universitários criar, buscar e participar de grupos de estudo colaborativos.

## 🚀 Funcionalidades

### Autenticação
- **Cadastro de usuários** com validação de email institucional
- **Login seguro** com gerenciamento de sessão JWT
- **Recuperação de senha** via email
- **Indicador visual de força da senha**

### Grupos de Estudo
- **Criar grupos** com informações detalhadas (matéria, objetivo, local, horários)
- **Buscar grupos** com filtros avançados (matéria, local, objetivo)
- **Entrar/sair de grupos** com confirmação e feedback visual
- **Gerenciar participantes** e limites de membros

### Perfil do Usuário
- **Visualizar e editar** informações pessoais
- **Upload de foto de perfil** com preview e validações
- **Sincronização automática** do perfil em grupos

### Chat em Tempo Real
- **Interface de chat** moderna e responsiva
- **Histórico de mensagens** persistente
- **Identificação visual** do autor das mensagens
- **Indicador de digitação** em tempo real
- **Notificações de mensagens** não lidas

### Sistema de Notificações
- **Painel de notificações** com ícone na barra superior
- **Diferenciação** entre lidas/não lidas
- **Notificações em tempo real** (toast, contador)
- **Configurações de preferências**

## 🛠️ Tecnologias Utilizadas

- **React.js 18** - Biblioteca principal
- **TailwindCSS** - Framework de estilos
- **React Router** - Roteamento
- **Context API** - Gerenciamento de estado global
- **Axios** - Cliente HTTP
- **Socket.io** - WebSockets para chat e notificações
- **React Hooks** - Hooks personalizados

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── common/         # Componentes base (Button, Input, Modal, etc.)
│   └── layout/         # Layout principal (Header, Sidebar)
├── context/            # Context API (Auth, Notifications)
├── hooks/              # Hooks personalizados
├── pages/              # Páginas da aplicação
│   ├── auth/          # Páginas de autenticação
│   └── ...            # Outras páginas
├── services/           # Serviços para comunicação com API
├── utils/              # Utilitários e validações
└── App.js             # Componente principal
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd connexa-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
REACT_APP_API_URL=http://localhost:3001
```

4. **Execute a aplicação**
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🎨 Design e UX

### Responsividade
- **Mobile-first** design
- **Breakpoints** otimizados para todos os dispositivos
- **Navegação adaptativa** com sidebar colapsável

### Acessibilidade
- **WCAG/ARIA** compliance
- **Navegação por teclado** completa
- **Screen readers** suportados
- **Contraste adequado** e legibilidade

### Componentes
- **Design system** consistente
- **Componentes reutilizáveis** e modulares
- **Estados visuais** claros (loading, error, success)
- **Feedback visual** em todas as interações

## 🔧 Configuração do Back-end

A aplicação espera um back-end com as seguintes rotas:

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário
- `PUT /api/auth/profile` - Atualizar perfil
- `POST /api/auth/forgot-password` - Recuperar senha
- `POST /api/auth/reset-password` - Redefinir senha
- `POST /api/auth/avatar` - Upload de avatar

### Grupos
- `GET /api/groups` - Listar grupos
- `POST /api/groups` - Criar grupo
- `GET /api/groups/:id` - Detalhes do grupo
- `POST /api/groups/:id/join` - Entrar no grupo
- `POST /api/groups/:id/leave` - Sair do grupo
- `GET /api/groups/my-groups` - Meus grupos
- `GET /api/groups/search` - Buscar grupos

### WebSocket Events
- `join_group` - Entrar em um grupo
- `leave_group` - Sair de um grupo
- `send_message` - Enviar mensagem
- `new_message` - Nova mensagem
- `typing` - Usuário digitando
- `stop_typing` - Parar de digitar
- `notification` - Nova notificação

## 📱 Funcionalidades por User Story

### US1 - Cadastro ✅
- Formulário completo com validações
- Validação de email institucional
- Indicador de força da senha
- Design responsivo

### US2 - Login ✅
- Autenticação segura
- Recuperação de senha
- Gerenciamento de sessão
- Redirecionamentos automáticos

### US3 - Criar Grupo ✅
- Formulário detalhado
- Validações client-side
- Redirecionamento pós-criação

### US4 - Buscar Grupos ✅
- Sistema de busca avançado
- Filtros múltiplos
- Estado de "nenhum resultado"

### US5 - Entrar/Sair de Grupo ✅
- Confirmação de ações
- Feedback visual
- Atualização dinâmica

### US6 - Perfil ✅
- Visualização/edição completa
- Upload de foto com preview
- Sincronização automática

### US7 - Chat do Grupo ✅
- Interface moderna
- Tempo real com WebSockets
- Histórico persistente
- Indicadores visuais

### US8 - Notificações ✅
- Painel completo
- Tempo real
- Diferenciação lida/não lida
- Configurações

## 🎯 Próximos Passos

Para produção, considere implementar:

1. **Testes automatizados** (Jest, React Testing Library)
2. **PWA** (Progressive Web App)
3. **Internacionalização** (i18n)
4. **Monitoramento** (Sentry, Analytics)
5. **Otimizações** (lazy loading, code splitting)
6. **SEO** (meta tags, sitemap)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

Desenvolvido com ❤️ para estudantes universitários