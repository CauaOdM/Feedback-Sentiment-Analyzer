# 🎯 Feedback Sentiment Analyzer

> **A full-stack customer feedback management system for intelligent sentiment analysis**

**Author:** [Cauã Sarraf](https://github.com/CauaOdM)

An intelligent customer feedback management platform that leverages Google Gemini AI through LangChain to automatically analyze sentiment and provide actionable insights for service quality improvement.

---

## Latest Implementations

Recent updates have added significant enhancements to the platform's communication and processing capabilities.

### Email Integration
- Send AI-generated or customized responses directly to customers via email
- Automatic welcome emails triggered when feedback is received
- Nodemailer SMTP integration supporting Gmail and other providers
- Email sending functionality integrated into the dashboard

### Response Editing
- Edit AI-generated responses before sending to customers
- Maintain consistent brand voice and tone in customer communications
- Address specific customer concerns with personalized touches
- All response changes persisted to the database

### Non-Blocking AI Processing
- Feedback submission returns immediately to the user
- AI sentiment analysis happens asynchronously in the background
- Welcome emails sent automatically without delaying the API response
- Frontend polls for completed analysis and updates when ready
- Prevents request timeouts on long-running operations

### Robust Architecture
- Error handling with graceful fallbacks for failed operations
- Background job processing with comprehensive logging
- Email validation before sending
- All customer interactions persisted in the database

---

## 📋 Table of Contents

- [Latest Implementations](#latest-implementations)
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
- [Architecture Deep Dive](#architecture-deep-dive)
- [Project Highlights](#project-highlights)
- [License](#license)

---

## Quick Demo

Here's a complete workflow demonstrating the new features:

```bash
# 1. Submit feedback (instant response, AI processes in background)
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Sarah Johnson",
    "email": "sarah@example.com",
    "content": "Amazing product! Exceeded all expectations."
  }'
# Response: Returns feedback ID immediately
# Background: Welcome email is sent and AI processing starts

# 2. Wait for AI processing to complete
sleep 2

# 3. Retrieve the feedback with AI-generated sentiment and response
curl -X GET http://localhost:3000/feedbacks

# 4. Edit the AI response to personalize it
FEEDBACK_ID="<copy-id-from-step-1>"
curl -X PATCH http://localhost:3000/feedbacks/$FEEDBACK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "suggestedResponse": "Sarah, thank you so much! Your feedback means everything to us. We'd love to have you as a long-term partner!"
  }'

# 5. Send the email to the customer
curl -X POST http://localhost:3000/feedbacks/$FEEDBACK_ID/reply
```

**Dashboard Workflow:**
1. Open http://localhost:5173 in browser
2. Click "Avaliar" to submit feedback as a customer
3. Complete the form and submit
4. Navigate back to the dashboard to view submissions
5. Observe feedback appearing in real-time
6. Review sentiment and suggested response once AI processing completes
7. Edit the response if needed and save changes
8. Send the response via email to the customer

---

## �🎓 Overview

Feedback Sentiment Analyzer is a full-stack application that demonstrates how to build a customer feedback management system:

- **Collect and persist** customer feedback efficiently
- **Automatically analyze sentiment** (Positive, Negative, Neutral) using Google Gemini AI
- **Flag critical feedback** that requires immediate action
- **Generate AI-powered response suggestions** for every feedback
- **Visualize feedback trends** through an interactive dashboard with real-time charts

This project demonstrates modern full-stack development practices, including TypeScript-first development, API design patterns, database modeling, AI/LLM integration, and responsive UI design.

---

## ✨ Key Features

### AI-Powered Sentiment Analysis
- **Sentiment Classification**: Uses Google Gemini 2.5 Flash via LangChain for sentiment analysis
- **Response Generation**: AI generates contextual responses based on feedback content and sentiment
- **Priority Flagging**: Negative feedback is automatically flagged for immediate attention
- **Asynchronous Processing**: AI analysis runs in the background without blocking API responses

### Core Functionality
- **CRUD Operations**: Full support for creating, reading, updating, and deleting feedback entries
- **Email Service**: Send responses to customers via Nodemailer SMTP integration
- **Response Management**: Edit and customize AI-generated responses before sending
- **Confirmation Dialogs**: Safe delete and email operations with user confirmation
- **RESTful API**: Fully documented endpoints with proper HTTP status codes
- **Dashboard Interface**: React-based interface for managing feedbacks
- **Data Visualization**: Pie charts displaying sentiment distribution
- **Responsive Layout**: Mobile-friendly design using TailwindCSS

### Customer Communication
- **Email Sending**: Integrated email functionality to send responses directly from the dashboard
- **Email Validation**: Customer emails are validated during feedback submission
- **Email Templates**: Structured templates with customer context and feedback details
- **Welcome Emails**: Automatic confirmation emails sent when feedback is received
- **Response Customization**: Modify AI-generated responses to match your tone and style

### Security & Validation
- **Input Validation**: DTO validation using class-validator for all incoming requests
- **Protected AI Fields**: Sentiment and responses are server-generated and read-only
- **SQL Injection Prevention**: TypeORM handles query parameterization
- **CORS Configuration**: Cross-origin resource sharing properly configured
- **Environment Variables**: Sensitive credentials stored in environment configuration
- **Asynchronous Patterns**: Non-blocking operations prevent request timeouts

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: NestJS v11 (TypeScript-based, enterprise-grade)
- **Database**: PostgreSQL v15 (reliable relational database)
- **ORM**: TypeORM v0.3 (entity-based data modeling)
- **AI/LLM**: 
  - LangChain (Google GenAI integration)
  - Google Gemini 2.5 Flash API
- **Email Service**: Nodemailer (SMTP integration for customer communication)
- **Validation**: class-validator, class-transformer

### Frontend
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
Perfect for personalizing AI-generated responses before sending them to customers! Edit the response directly in the dashboard and fine-tune the message to match your brand voice.

**How It Works:**
1. Frontend displays the AI-generated response in an editable field
2. User modifies the text as needed
3. PATCH request sends updated response to backend
4. Database is updated with the new response
5. User can then send the personalized email to the customer

---

#### **POST /feedbacks/:id/reply**
🚀 **NEW!** Send the feedback response via email to the customer with one click!

**Parameters:**
- `id` (path): UUID of the feedback

**Response:** `201 Created`
```json
{
  "message": "Email enviado com sucesso!"
}
```

**Email Workflow:**
1. Fetch feedback record from database
2. Validate customer email exists
3. Generate professional email using Nodemailer SMTP
4. Include original feedback context
5. Send personalized AI-generated (or edited) response

**Email Content:**
- Warm greeting with customer name
- Original feedback quoted for context
- Thoughtful AI-generated (or personalized) response
- Professional company signature

**Requirements:**
- Feedback must have a valid email address
- SMTP credentials must be configured in `.env`
- Email service must be properly initialized

**Error Handling:**
- Returns error if feedback not found
- Validates email address before sending
- Logs SMTP delivery status for tracking

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

CORS is enabled for development. To restrict to specific origins:
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

### 🎯 New Implementations & Features

### Email Integration with Nodemailer

I implemented a comprehensive email service for customer communication:

- **SMTP Configuration**: Flexible support for Gmail, Outlook, and other SMTP providers
- **Automatic Welcome Email**: Customers receive confirmation when feedback is submitted
- **Manual Email Replies**: Dashboard users can send customized responses
- **Template Structure**: Email formatting with customer context and feedback details
- **Error Handling**: Graceful fallback handling for failed deliveries

**Implementation:**
```typescript
// email.service.ts
async sendEmail(to: string, subject: string, text: string) {
  return await this.mailTransporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text
  });
}
```

**Usage:**
- Welcome email automatically triggered on feedback creation
- Customized response email sent when user initiates reply
- Email validation prevents invalid addresses

---

### Response Editing Capability

The response editing feature allows users to customize AI suggestions before sending:

**Features:**
- Edit responses directly in the dashboard
- PATCH endpoint for updating stored responses
- Original feedback context available during editing
- Changes saved to database immediately
- Edited responses used in subsequent email sends

**Workflow:**
1. AI generates initial response
2. User reviews response in dashboard modal
3. User customizes message if needed
4. PATCH request updates the database
5. Email sent with personalized content

**Benefits:**
- Ensures brand consistency in communications
- Addresses specific customer needs
- Adds personalization to responses
- Quality control before customer contact

---

### Background Processing with Non-Blocking Async

AI analysis is processed asynchronously to prevent blocking API responses:

**Implementation:**

```typescript
// Feedback creation returns immediately
async create(createFeedbackDto: CreateFeedbackDto) {
  const feedback = this.feedbacksRepository.create(createFeedbackDto);
  const savedFeedback = await this.feedbacksRepository.save(feedback);
  
  // Fire-and-forget: AI processing in background
  this.processFeedbackInBackground(savedFeedback);
  
  return savedFeedback;
}

// Background processing
private async processFeedbackInBackground(feedback: Feedback) {
  const analysis = await this.analyzeFeedback(feedback.content);
  await this.feedbacksRepository.update(feedback.id, {
    sentiment: analysis.sentiment,
    actionRequired: analysis.sentiment === 'NEGATIVE',
    suggestedResponse: analysis.response
  });
  
  if (feedback.email) {
    await this.emailService.sendEmail(/* ... */);
  }
}
```

**Benefits:**
- API returns feedback immediately
- Gemini API calls don't block user interaction
- Welcome emails sent automatically
- AI failures are logged and handled gracefully
- Frontend polls for completion and updates

**User Experience:**
1. User submits feedback
2. Instant feedback confirmation received
3. Dashboard shows feedback with loading state
4. AI processing happens in background
5. Sentiment and response appear when complete
6. Frontend auto-refreshes with results

---

### Intelligent Sentiment Analysis with Gemini 2.5 Flash

The sentiment analysis leverages Google's Gemini model for classification:

**Model Capabilities:**
- Processes feedback in milliseconds
- Understands nuance and context
- Classifies as POSITIVE, NEGATIVE, or NEUTRAL
- Generates contextual responses

**Prompt Strategy:**
```
Aja como um gerente atencioso que se importa muito com a experiencia do cliente.
Analise o seguinte feedback: "[feedback text]"

Retorne APENAS um JSON neste formato exato:
{
  "sentiment": "POSITIVE" ou "NEGATIVE" ou "NEUTRAL",
  "response": "Escreva uma resposta curta (max 2 frases), empática e profissional..."
}
```

**Processing Flow:**
1. Feedback received and validated
2. Sent to Gemini API via LangChain
3. Sentiment classification returned
4. Response template generated
5. Data persisted to database
6. Frontend updates with results

---

### Frontend Dashboard Features

The React interface provides the following components:

**Pages:**
- Admin Dashboard (`/`) - View feedbacks, manage responses, send emails
- Client Feedback Form (`/avaliar`) - Public feedback submission

**Components:**
- Sentiment distribution chart using Recharts
- Response editing modal
- Email confirmation modal
- Safe delete confirmation
- Real-time data updates
- TailwindCSS responsive design

**State Management:**
- React Hooks for state and effects
- Axios for HTTP requests
- Real-time data fetching

---

### Frontend Development

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

## 🎯 Architecture Deep Dive

### Request-Response Flow with New Features

```
USER SUBMITS FEEDBACK
        ↓
  Frontend Form
        ↓
  POST /feedbacks (with email)
        ↓
  Backend Validation (DTO)
        ↓
  Save to PostgreSQL
        ↓
  RETURN IMMEDIATELY to User ✨ [Non-blocking!]
        │
        ├→ Send Welcome Email (Nodemailer)
        │
        └→ Process with Gemini AI [Background]
            ├→ Sentiment Analysis
            ├→ Response Generation
            ├→ Update Database
            └→ Frontend Polls for Updates

USER EDITS RESPONSE
        ↓
  Frontend Modal (PATCH UI)
        ↓
  PATCH /feedbacks/:id
        ↓
  Update suggestedResponse
        ↓
  Return Updated Data
        ↓
  Frontend Shows Success

USER SENDS EMAIL
        ↓
  Frontend Modal (Reply UI)
        ↓
  POST /feedbacks/:id/reply
        ↓
  EmailService.sendEmail()
        ↓
  SMTP Connection → Gmail/Provider
        ↓
  Professional Email Sent to Customer ✨
        ↓
  Return Success Message
```

### Database Schema

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customerName VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  content VARCHAR(1000) NOT NULL,
  sentiment VARCHAR(20),        -- POSITIVE, NEGATIVE, NEUTRAL
  actionRequired BOOLEAN,        -- Auto-flagged if sentiment = NEGATIVE
  suggestedResponse TEXT,        -- Editable AI-generated response
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Service Layer Architecture

**FeedbacksService** - Core business logic
- `create()` - Save feedback + trigger background processing
- `findAll()` - Retrieve all feedbacks with sorting
- `remove()` - Delete feedback
- `updateResponse()` - ✨ NEW! Update suggested response
- `sendManualEmail()` - ✨ NEW! Send email to customer
- `analyzeFeedback()` - Private method for Gemini AI analysis
- `processFeedbackInBackground()` - ✨ NEW! Non-blocking AI processing

**EmailService** - Email communication
- `sendEmail()` - Unified SMTP interface
- Automatic retry logic
- Template rendering
- Delivery logging

**FeedbacksController** - HTTP endpoints
- `POST /feedbacks` - Create feedback
- `GET /feedbacks` - List all feedbacks
- `PATCH /feedbacks/:id` - ✨ NEW! Update response
- `POST /feedbacks/:id/reply` - ✨ NEW! Send email
- `DELETE /feedbacks/:id` - Delete feedback

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

## Project Highlights

This project demonstrates several notable implementation approaches:

### Key Implementations

**Email Integration**: Full email service with Nodemailer SMTP, supporting Gmail and other providers. Automatic welcome emails on submission and manual replies from the dashboard.

**Response Customization**: Users can edit AI-generated responses before sending via the PATCH endpoint, with changes persisted to the database.

**Asynchronous Processing**: Non-blocking background processing for AI analysis prevents request timeouts and provides instant feedback to users while the system completes sentiment analysis in parallel.

**Error Resilience**: Graceful error handling with logging. AI processing failures don't crash the request, allowing the system to remain operational.

### Technical Approach

**Architecture**: Service layer pattern with clear separation between controllers, services, and repository layers. Modular design with dedicated services for emails and feedback processing.

**AI Integration**: LangChain with Gemini 2.5 Flash for sentiment analysis and response generation. Prompt engineering for consistent output format and quality.

**Database Design**: PostgreSQL with TypeORM providing type-safe queries and protection against SQL injection through parameterization.

**Frontend**: React with Hooks-based state management, Axios for HTTP communication, Recharts for data visualization, and TailwindCSS for responsive design.

**Security**: Input validation with class-validator, read-only AI fields to prevent client manipulation, CORS configuration, and environment-based credential management.
