# 📊 Feedback Sentiment Analyzer

Sistema de gestão de feedbacks com análise de sentimento via IA (Gemini 2.5 Flash)

**Autor:** [CauaOdM](https://github.com/CauaOdM)

---

## ✨ Features

### Client (`/avaliar`)
- Feedback form com categorização (6 categorias pré-definidas)
- Auto email notification
- Dark mode UI

### Admin (`/`)
- Feedback dashboard com listagem em tempo real
- AI sentiment analysis (POSITIVE/NEGATIVE/NEUTRAL) via Gemini
- Sentiment distribution chart
- Top 5 categories ranking
- Edit/send responses
- Full CRUD operations

---

## 🏗️ Architecture

### Backend (NestJS + TypeORM + PostgreSQL)

**Modules**:
```
auth/      → JWT + Passport (local + jwt strategies)
users/     → User CRUD + bcrypt password hashing
feedbacks/ → Feedback CRUD + Gemini AI analysis + background jobs
email/     → Nodemailer integration with Gmail
```

**Database Schema**:
```
User: id (UUID) | name | email | password | companyName | slug | nicho | createdAt

Feedback: id (UUID) | customerName | email | content | categories (array) | 
          sentiment | actionRequired | suggestedResponse | createdAt | user_id (FK)
```

### Frontend (React 19 + Vite + Tailwind + TS)

**Routes**:
```
/       → AdminDashboard
/avaliar → ClientPage
```

**Key Dependencies**: axios, react-router-dom, recharts, lucide-react

---

## 🤖 AI Integration

**Gemini 2.5 Flash** via LangChain

**Flow**:
1. `POST /feedbacks` → Save immediately (201 response)
2. Background job: Sentiment analysis + suggested response generation
3. Update DB with results
4. Send email notification if available

---

## 📦 Stack

**Backend**: NestJS 11 | TypeORM 0.3 | PostgreSQL 15 | JWT + Passport | Nodemailer | LangChain | Jest

**Frontend**: React 19 | Vite 7 | Tailwind CSS 3 | Axios | React Router 7

**DevOps**: Docker + Docker Compose

---

## 🚀 Setup

### Environment Variables

**Backend (`.env` na raiz do projeto):**
```bash
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=feedback_analyzer
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GEMINI_API_KEY=your_api_key
PORT=3000
```

**Frontend (`frontend/.env`):**
```bash
VITE_API_URL=http://localhost:3000
```

### Run
```bash
# Start database
docker-compose up -d

# Backend (Terminal 1)
cd backend && npm install && npm run start:dev

# Frontend (Terminal 2)
cd frontend && npm install && npm run dev
```

**URLs**: Frontend http://localhost:5173 | API http://localhost:3000

---

## 🧪 Testes

### Backend
```bash
cd backend

# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e

# Watch mode
npm run test:watch
```

---

## 📊 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                 │
│ (Preenche formulário em /avaliar)                              │
└──────────────────┬──────────────────────────────────────────────┘
                   │ POST /feedbacks
                   ▼
        ┌──────────────────────┐
        │  BACKEND (NestJS)    │
        │                      │
        │ 1. Salva no BD       │
        │ 2. Retorna 201       │
        └──────────┬───────────┘
                   │
        ┌──────────▼───────────────┐
        │  PROCESSAMENTO EM BG     │
        │                          │
        │ 1. Gemini IA (Análise)   │
        │ 2. Atualiza BD           │
        │ 3. Envia Email           │
        └──────────┬───────────────┘
                   │
        ┌──────────▼───────────────┐
        │      GESTOR/ADMIN        │
        │  (Vê no dashboard)       │
        │                          │
        │ - Sentimento analisado   │
        │ - Resposta sugerida      │
        │ - Ações disponíveis      │
        └──────────────────────────┘
```

---

## 📁 Estrutura de Diretórios

```
Feedback-Sentiment-Analyzer/
├── backend/
│   ├── src/
│   │   ├── auth/              # 🔐 Autenticação (JWT, Passport)
│   │   ├── users/             # 👤 Gestores/Empresas
│   │   ├── feedbacks/         # 📝 Feedbacks e IA
│   │   ├── email/             # 💌 Envio de emails
│   │   ├── app.module.ts      # 🔌 Módulo principal
│   │   └── main.ts            # 🚀 Entry point
│   ├── test/                  # 🧪 Testes e2e
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx   # 📊 Painel do gestor
│   │   │   └── ClientPage.tsx       # 📝 Página cliente
│   │   ├── App.tsx            # 🎯 Rotas principais
│   │   └── main.tsx           # 🚀 Entry point React
│   ├── index.html
│   └── package.json
│
├── docker-compose.yml         # 🐳 Orquestração containers
└── README.md                  # 📖 Este arquivo
```

---

## 🔒 Segurança

- ✅ **Senhas**: Criptografadas com Bcrypt (salt 10 rounds)
- ✅ **Autenticação**: JWT com estratégia Passport
- ✅ **CORS**: Habilitado para comunicação Frontend ↔️ Backend
- ✅ **Validação**: Class-validator em todas as DTOs
- ✅ **Sanitização**: Whitelist + forbidNonWhitelisted
- ✅ **Email**: App Password do Gmail (não senha real)
- ✅ **UUIDs**: Identificadores seguros no lugar de IDs sequenciais

---

## 🎨 Design & UX

A aplicação foi desenhada com foco em:

- **Dark Mode** elegante (slate + indigo)
- **Responsividade** 100% mobile-first
- **Feedback visual** em todas as ações
- **Ícones intuitivos** (Lucide React)
- **Transições suaves** para melhor percepção
- **Modal confirmações** para ações críticas
- **Loading states** para requisições assíncronas

---

## 🔄 Fluxo de Uso

### Para o Cliente:
1. Acessa `/avaliar`
2. Preenche: Nome, Email, Categorias, Feedback
3. Clica em "Enviar"
4. Recebe confirmação visual e email de agradecimento

### Para o Gestor:
1. Acessa `/` (dashboard)
2. Vê todos os feedbacks recentes com **sentimentos analisados**
3. Lê a **resposta sugerida pela IA**
4. **Edita** se necessário
5. **Envia** para o cliente via email
6. Monitora **tendências** via gráficos

---

## 🚦 Estados da Aplicação

### Feedback
- `sentiment`: POSITIVE | NEGATIVE | NEUTRAL
- `actionRequired`: boolean (true se NEGATIVE)
- `suggestedResponse`: string | null

### Modal
- `delete`: Confirmar exclusão de feedback
- `email`: Confirmar envio de resposta
- `success`: Mostrar sucesso

---

## 📝 Exemplo de Request/Response

### Criar Feedback
```bash
POST /feedbacks
Content-Type: application/json

{
  "customerName": "João Silva",
  "email": "joao@email.com",
  "content": "O atendimento foi excelente! Muito satisfeito.",
  "categories": ["Elogio", "Atendimento"]
}

# Response (201)
{
  "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "customerName": "João Silva",
  "email": "joao@email.com",
  "content": "O atendimento foi excelente! Muito satisfeito.",
  "categories": ["Elogio", "Atendimento"],
  "sentiment": null,  // Será preenchido em segundos
  "actionRequired": false,
  "suggestedResponse": null,
  "createdAt": "2026-01-02T10:30:00.000Z"
}
```

### Listar Feedbacks
```bash
GET /feedbacks

# Response (200)
[
  {
    "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "sentiment": "POSITIVE",
    "suggestedResponse": "Obrigado por seu feedback positivo! Continuaremos..."
    ...
  }
]
```

---

## 🐛 Troubleshooting

### ❌ "Erro ao conectar com banco de dados"
```bash
# Verifique se Docker está rodando
docker ps

# Se não estiver, suba o container
docker-compose up -d
```

### ❌ "IA não está funcionando"
```bash
# Verifique variáveis de ambiente
cat .env | grep GEMINI

# Tente novamente após aguardar alguns segundos
```

### ❌ "Email não sendo enviado"
```bash
# Verifique credenciais Gmail
# Use App Password, não senha regular
# Ative 2FA na conta Google
```

---

## 📈 Próximas Melhorias Potenciais

- 🔐 Dashboard protegido por login (em andamento)
- 📊 Relatórios exportáveis (PDF/CSV)
- 🔔 Notificações em tempo real (WebSocket)
- 🌍 Suporte multilíngue
- 📧 Templates de email customizáveis
- 🤖 Mais modelos de IA (GPT-4, Claude)
- 🎯 Atribuição de feedbacks a setores

---

## 📄 Licença

UNLICENSED - Todos os direitos reservados ao autor.

---

## 💬 Contato

Para dúvidas ou sugestões, abra uma issue ou entre em contato com [CauaOdM](https://github.com/CauaOdM).

---

<div align="center">

**⭐ Gostou do projeto? Deixe uma estrela!**

Feito com ❤️ por CauaOdM

</div>
