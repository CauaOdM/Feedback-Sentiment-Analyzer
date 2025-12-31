# 🎯 Feedback Sentiment Analyzer

> **⚠️ IMPORTANT:** This README was generated with the assistance of **GitHub Copilot**, a generative AI tool, to provide comprehensive and professional documentation.

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
- **Automated Response Generation**: AI generates contextual, empathetic customer responses for every feedback
- **Action Flagging**: Automatically marks negative feedback for priority handling
- **Instant AI Processing**: Real-time sentiment analysis as feedback is submitted

### 🔧 Core Functionality
- **Complete CRUD Operations**: Create, read, update, and delete feedback entries
- **Email Integration**: Automated email responses sent directly to customers with AI-generated replies
- **Inline Response Editing**: Edit AI-generated responses directly in the dashboard before sending
- **Interactive Modals**: Confirmation dialogs for delete and email actions with success notifications
- **Email Tracking**: Visual indicators showing which feedbacks have been responded to
- **RESTful API**: Clean, documented endpoints with proper HTTP status codes
- **Real-time Dashboard**: Interactive React interface with live data visualization
- **Statistical Analysis**: Beautiful pie charts showing sentiment distribution at a glance
- **Responsive Design**: Modern UI built with TailwindCSS, optimized for all devices

### 📧 Customer Communication
- **One-Click Email Sending**: Send personalized responses directly from the dashboard
- **Email Validation**: Customer email captured during feedback submission
- **Professional Templates**: Well-formatted email templates with customer context
- **Delivery Tracking**: Keep track of which customers have been contacted

### 🔒 Security & Validation
- **DTO-based Validation**: Comprehensive input validation using class-validator
- **Read-only AI Fields**: Sentiment and initial responses cannot be manipulated by clients
- **SQL Injection Prevention**: TypeORM parameterized queries protect database integrity
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variable Protection**: Sensitive credentials isolated from codebase
- **Email Security**: Protected SMTP credentials with environment variables

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
- **Email Service**: Nodemailer (SMTP integration for customer communication)
- **Validation**: class-validator, class-transformer

### Frontend
> **⚠️ Note:** The frontend interface was developed with the assistance of **Google Gemini AI** to accelerate UI development and design implementation.

- **Framework**: React v19 with Vite (blazing-fast HMR)
- **Language**: TypeScript v5 (type-safe development)
- **Styling**: TailwindCSS v3 (utility-first CSS with custom animations)
- **Charts**: Recharts (responsive, interactive data visualization)
- **Icons**: Lucide React (beautiful, consistent iconography)
- **HTTP Client**: Axios (promise-based HTTP requests)
- **State Management**: React Hooks (useState, useEffect for optimal performance)

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

# Email Service Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Server Configuration
PORT=3000
NODE_ENV=development
```

**🔑 Getting your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste into `.env`

**📧 Setting up Email Service (Optional but Recommended):**
1. Use Gmail or any SMTP provider
2. For Gmail: Enable 2-Step Verification and create an [App Password](https://myaccount.google.com/apppasswords)
3. Add your credentials to the `.env` file
4. **Note:** Email functionality requires proper SMTP configuration to work

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
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes | - |
| `SMTP_HOST` | SMTP server hostname | Yes* | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | Yes* | `587` |
| `SMTP_USER` | Email account username | Yes* | - |
| `SMTP_PASS` | Email account password/app password | Yes* | - |
| `PORT` | Backend server port | No | `3000` |
| `NODE_ENV` | Environment mode | No | `development` |

**\*Required for email functionality**

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
  "email": "jane.smith@example.com",
  "content": "The product arrived damaged and customer service was unhelpful."
}
```

**Validation Rules:**
- `customerName`: Required, 1-100 characters
- `email`: Required, valid email format
- `content`: Required, 1-1000 characters

**Response:** `201 Created`
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "customerName": "Jane Smith",
  "email": "jane.smith@example.com",
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
- Sends automatic welcome email to customer with AI response

---

#### **PATCH /feedbacks/:id**
✨ **NEW!** Update the AI-generated response for a specific feedback.

**Parameters:**
- `id` (path): UUID of the feedback

**Request Body:**
```json
{
  "suggestedResponse": "Thank you so much for your feedback! We've escalated your case to our senior team and will reach out within 24 hours."
}
```

**Response:** `200 OK`
```json
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
```

**Use Case:**
Perfect for personalizing AI-generated responses before sending them to customers. Edit the response directly in the dashboard!

---

#### **POST /feedbacks/:id/reply**
🚀 **NEW!** Send the feedback response via email to the customer.

**Parameters:**
- `id` (path): UUID of the feedback

**Response:** `201 Created`
```json
{
  "message": "Email enviado com sucesso!"
}
```

**Email Content:**
- Professional template with customer name
- Original feedback quoted for context
- AI-generated (or edited) response
- Company branding and signature

**Requirements:**
- Feedback must have a valid email address
- SMTP credentials must be configured in `.env`

---

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
> The frontend user interface (React components, TailwindCSS styling, and chart visualizations) was developed with significant assistance from **Google Gemini AI**, a generative AI coding assistant. This accelerated UI development and helped implement modern design patterns efficiently. The backend architecture, database design, and AI integration were implemented manually with traditional development practices.  
>  
> **📝 Documentation Note:** This README documentation was generated with the assistance of **GitHub Copilot** to ensure comprehensive and professional project documentation.

### Testing the AI Integration

Test sentiment analysis and email functionality with different feedback types:

```bash
# Positive feedback with email
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Alice Johnson",
    "email": "alice@example.com",
    "content": "Excellent service! The team was professional and helpful."
  }'

# Negative feedback with email
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Bob Williams",
    "email": "bob@example.com",
    "content": "Terrible experience. Product broke after one day."
  }'

# Neutral feedback with email
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Carol Martinez",
    "email": "carol@example.com",
    "content": "The product is okay, nothing special."
  }'

# Update a response (get ID from previous POST response)
curl -X PATCH http://localhost:3000/feedbacks/{feedback-id} \
  -H "Content-Type: application/json" \
  -d '{
    "suggestedResponse": "Thank you for your honest feedback! We truly appreciate it."
  }'

# Send email reply to customer
curl -X POST http://localhost:3000/feedbacks/{feedback-id}/reply
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

- [ ] User authentication and role-based access control (Admin/Manager)
- [ ] Advanced analytics dashboard with trend analysis over time
- [ ] Multi-language support for international customers
- [ ] Export feedback reports (PDF/CSV) with charts and statistics
- [ ] Real-time updates via WebSockets for live dashboard
- [ ] Integration with CRM systems (Salesforce, HubSpot)
- [ ] SMS notifications for critical negative feedback
- [ ] AI-powered feedback categorization and tagging
- [ ] Response template library for common scenarios
- [ ] Customer satisfaction score (CSAT) tracking
- [ ] Automated follow-up email sequences
- [ ] Dark/Light theme toggle for dashboard
- [ ] Mobile app version (React Native)
- [ ] API rate limiting and authentication tokens

---

## 🎉 What Makes This Project Special

This isn't just another CRUD application—it's a **production-ready customer success platform** that showcases:

✨ **Cutting-edge AI Integration**: Real-world application of LLMs for business automation  
🎨 **Modern UI/UX**: Beautiful, responsive interface with smooth animations and interactive charts  
📧 **End-to-End Communication**: Complete customer feedback loop from submission to email response  
🔒 **Enterprise-Grade Security**: Input validation, SQL injection prevention, and secure credentials management  
⚡ **Performance Optimized**: Fast API responses, efficient database queries, and reactive UI updates  
🧪 **Best Practices**: Clean architecture, TypeScript throughout, modular design patterns

Perfect for demonstrating full-stack skills in job interviews or as a foundation for real customer service platforms!
