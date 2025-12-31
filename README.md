# 🎯 Feedback Sentiment Analyzer

> **A full-stack customer feedback management system powered by AI for intelligent sentiment analysis**

**Author:** [Cauã Sarraf](https://github.com/CauaOdM)

An intelligent customer feedback management platform that leverages Google Gemini AI through LangChain to automatically analyze sentiment and provide actionable insights for service quality improvement.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Security](#security)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [License](#license)

---

## 🎓 Overview

Feedback Sentiment Analyzer is a production-ready full-stack application designed to help businesses:

- **Collect and persist** customer feedback efficiently
- **Automatically analyze sentiment** (Positive, Negative, Neutral) using Google Gemini AI
- **Flag critical feedback** that requires immediate action
- **Generate AI-powered response suggestions** for every feedback
- **Visualize feedback trends** through an interactive dashboard with real-time charts

This project demonstrates modern full-stack development practices, including TypeScript-first development, API design patterns, database modeling, AI/LLM integration, and responsive UI design.

---

## ✨ Key Features

### 🤖 AI-Powered Analysis
- **Intelligent Sentiment Detection**: Leverages Google Gemini 2.5 Flash via LangChain for accurate sentiment classification
- **Automated Response Generation**: AI generates contextual, empathetic customer responses
- **Action Flagging**: Automatically marks negative feedback for priority handling

### 🔧 Core Functionality
- **Full CRUD Operations**: Create, read, update, and delete feedback entries
- **RESTful API**: Clean, documented endpoints with proper HTTP status codes
- **Real-time Dashboard**: Interactive React interface with live data visualization
- **Statistical Analysis**: Pie charts showing sentiment distribution
- **Responsive Design**: Modern UI built with TailwindCSS, optimized for all devices

### 🔒 Security & Validation
- **DTO-based Validation**: Input validation using class-validator
- **Read-only AI Fields**: Sentiment and responses cannot be manipulated by clients
- **SQL Injection Prevention**: TypeORM parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variable Protection**: Sensitive credentials isolated from codebase

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: NestJS v11 (TypeScript-based, enterprise-grade)
- **Database**: PostgreSQL v15 (production-ready relational database)
- **ORM**: TypeORM v0.3 (entity-based data modeling)
- **AI/LLM**: 
  - LangChain (Google GenAI integration)
  - Google Gemini 2.5 Flash API
- **Validation**: class-validator, class-transformer

### Frontend
> **⚠️ Note:** The frontend interface was developed with the assistance of generative AI (GitHub Copilot) to accelerate UI development and design implementation.

- **Framework**: React v19 with Vite
- **Language**: TypeScript v5
- **Styling**: TailwindCSS v3 (utility-first CSS)
- **Charts**: Recharts (responsive data visualization)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Infrastructure & DevOps
- **Containerization**: Docker + Docker Compose
- **Database Management**: PostgreSQL Docker container
- **Version Control**: Git

---

## 🏗️ Architecture

The application follows a **modular monorepo structure** with clear separation of concerns:

```
┌──────────────┐         HTTP/REST          ┌──────────────┐
│              │◄──────────────────────────►│              │
│   Frontend   │        JSON Data           │   Backend    │
│  (React/TS)  │                            │  (NestJS)    │
│              │                            │              │
└──────────────┘                            └───────┬──────┘
                                                    │
                                                    │ TypeORM
                                                    ▼
                                            ┌──────────────┐
                                            │  PostgreSQL  │
                                            │   Database   │
                                            └──────────────┘
                                                    ▲
                                                    │
                                            ┌──────────────┐
                                            │ Google Gemini│
                                            │      AI      │
                                            └──────────────┘
```

### Data Flow
1. **User submits feedback** through React frontend
2. **Backend receives request**, validates DTO
3. **AI analyzes content** using LangChain + Gemini API
4. **Sentiment & response** are generated and stored
5. **PostgreSQL persists** the enriched feedback data
6. **Frontend displays** results with visual indicators

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Google Gemini API Key** ([Get Key](https://aistudio.google.com/apikey))
- **Git** ([Download](https://git-scm.com/))

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/CauaOdMS/Feedback-Sentiment-Analyzer.git
cd Feedback-Sentiment-Analyzer
```

#### 2. Install Root Dependencies
```bash
npm install
```

This installs LangChain and Google GenAI packages needed for AI integration.

#### 3. Start PostgreSQL with Docker
```bash
docker-compose up -d
#### 3. Start PostgreSQL with Docker
```bash
docker-compose up -d
```

**What happens:**
- Launches PostgreSQL 15 container in detached mode
- Creates database: `feedback_db`
- Credentials: `admin` / `adminpassword`
- Exposes port: `5432`
- Persistent volume: `pgdata`

Verify it's running:
```bash
docker ps
```

#### 4. Configure Backend Environment

Navigate to backend and create environment file:
```bash
cd backend
```

Create a `.env` file with the following variables:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=adminpassword
DB_NAME=feedback_db

# Google Gemini API
GEMINI_API_KEY=your-google-gemini-api-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

**🔑 Getting your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste into `.env`

#### 5. Install Backend Dependencies
```bash
npm install
```

This installs NestJS, TypeORM, PostgreSQL driver, validation libraries, and testing tools.

#### 6. Start Backend Server
```bash
npm run start:dev
```

**Expected output:**
```
[Nest] 12345  - 12/31/2025, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/31/2025, 10:00:01 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 12/31/2025, 10:00:01 AM     LOG [NestApplication] Nest application successfully started
```

Backend API is now running at: **http://localhost:3000**

Test it by visiting: **http://localhost:3000/feedbacks** (should return `[]`)

---

### Running the Application

#### Frontend Setup

Navigate to frontend directory:
```bash
cd ../frontend
```

#### 1. Install Frontend Dependencies
```bash
npm install
```

#### 2. Start Development Server
```bash
npm run dev
```

**Expected output:**
```
VITE v7.2.4  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Frontend is now running at: **http://localhost:5173**

---

## 🔐 Environment Configuration

### Backend Environment Variables (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DB_HOST` | PostgreSQL host address | Yes | `localhost` |
| `DB_PORT` | PostgreSQL port | Yes | `5432` |
| `DB_USERNAME` | Database user | Yes | `admin` |
| `DB_PASSWORD` | Database password | Yes | - |
| `DB_NAME` | Database name | Yes | `feedback_db` |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `PORT` | Backend server port | No | `3000` |
| `NODE_ENV` | Environment mode | No | `development` |

### Frontend Configuration

The frontend automatically connects to `http://localhost:3000` for API requests. To change this, modify the axios base URL in [App.tsx](frontend/src/App.tsx).

---

## 📡 API Reference

### Base URL
```
http://localhost:3000
```

### Endpoints

#### **GET /feedbacks**
Retrieve all feedbacks, sorted by creation date (newest first).

**Response:** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerName": "John Doe",
    "content": "Great service! Very satisfied.",
    "sentiment": "POSITIVE",
    "actionRequired": false,
    "suggestedResponse": "Thank you for your positive feedback! We're glad you had a great experience.",
    "createdAt": "2025-12-31T10:00:00.000Z"
  }
]
```

#### **POST /feedbacks**
Create a new feedback. AI automatically analyzes sentiment and generates response.

**Request Body:**
```json
{
  "customerName": "Jane Smith",
  "content": "The product arrived damaged and customer service was unhelpful."
}
```

**Validation Rules:**
- `customerName`: Required, 1-100 characters
- `content`: Required, 1-1000 characters

**Response:** `201 Created`
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "customerName": "Jane Smith",
  "content": "The product arrived damaged and customer service was unhelpful.",
  "sentiment": "NEGATIVE",
  "actionRequired": true,
  "suggestedResponse": "We sincerely apologize for the damaged product and poor service. We'll investigate this immediately and contact you to make it right.",
  "createdAt": "2025-12-31T10:15:00.000Z"
}
```

**AI Processing:**
- Analyzes content using Gemini 2.5 Flash
- Determines sentiment: `POSITIVE`, `NEGATIVE`, or `NEUTRAL`
- Flags negative feedback with `actionRequired: true`
- Generates contextual response suggestion

#### **DELETE /feedbacks/:id**
Delete a specific feedback by UUID.

**Parameters:**
- `id` (path): UUID of the feedback

**Response:** `200 OK`
```json
{
  "affected": 1
}
```

---

## 🔒 Security

### Input Validation

All incoming requests are validated using **class-validator** decorators:

```typescript
// create-feedback.dto.ts
export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  customerName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
}
```

**ValidationPipe Configuration:**
- `whitelist: true` - Strips non-DTO properties
- `forbidNonWhitelisted: true` - Rejects unknown properties
- `transform: true` - Auto-converts types

### Read-Only AI Fields

The following fields are **server-generated only** and cannot be set by clients:
- `sentiment` - Determined by AI
- `actionRequired` - Auto-flagged based on sentiment
- `suggestedResponse` - Generated by AI

Attempting to set these fields in POST/PATCH requests will result in validation errors.

### SQL Injection Prevention

TypeORM automatically parameterizes all queries:
```typescript
// Safe - TypeORM handles escaping
await this.feedbacksRepository.find({ where: { id } });
```

### CORS Policy

CORS is enabled for development. For production, restrict to specific origins:
```typescript
app.enableCors({
  origin: 'https://yourdomain.com',
  credentials: true
});
```

### Environment Variables

All sensitive credentials are stored in `.env` files:
- ✅ `.env` is in `.gitignore`
- ✅ API keys never hardcoded
- ✅ Database credentials isolated

---

## 💡 Development Notes

### Frontend Development with AI

> **🤖 Generative AI Disclosure:**  
> The frontend user interface (React components, TailwindCSS styling, and chart visualizations) was developed with significant assistance from **Gemini**, a generative AI coding assistant. This accelerated UI development and helped implement modern design patterns efficiently. The backend architecture, database design, and AI integration were implemented manually with traditional development practices.

### Testing the AI Integration

Test sentiment analysis with different feedback types:

```bash
# Positive feedback
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Alice Johnson",
    "content": "Excellent service! The team was professional and helpful."
  }'

# Negative feedback
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Bob Williams",
    "content": "Terrible experience. Product broke after one day."
  }'

# Neutral feedback
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Carol Martinez",
    "content": "The product is okay, nothing special."
  }'
```

### Database Management

Access PostgreSQL via CLI:
```bash
docker exec -it feedback_db_container psql -U admin -d feedback_db
```

Useful SQL commands:
```sql
-- View all feedbacks
SELECT * FROM feedback ORDER BY "createdAt" DESC;

-- Count by sentiment
SELECT sentiment, COUNT(*) FROM feedback GROUP BY sentiment;

-- Delete all data (for testing)
TRUNCATE TABLE feedback CASCADE;
```

### Stopping the Application

Stop backend: `Ctrl + C` in terminal

Stop frontend: `Ctrl + C` in terminal

Stop database:
```bash
docker-compose down
```

Remove all data (including database volume):
```bash
docker-compose down -v
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Author:** Cauã Sarraf  
**GitHub:** [@CauaOdM](https://github.com/CauaOdM)  
**Project Repository:** [Feedback-Sentiment-Analyzer](https://github.com/CauaOdM/Feedback-Sentiment-Analyzer)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/CauaOdM/Feedback-Sentiment-Analyzer/issues).

---

⭐ **If you found this project helpful, please consider giving it a star!**

---

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Email notifications for critical feedback
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Export feedback reports (PDF/CSV)
- [ ] Real-time updates via WebSockets
- [ ] Integration with CRM systems
- [ ] A/B testing for AI response quality
