# AI-Powered Mock Interview API (Backend-Only)

A **backend-only, production-ready API system** for conducting **AI-powered mock interviews**.  
This service allows clients to:

- Register a user profile (no authentication required).
- Generate **role- and experience-specific interview questions**.
- Submit answers to questions.
- Get **AI-driven evaluations** including **constructive feedback and numeric scores**.

The system uses Gemini (Google) for AI generation and evaluation, NeonDB (serverless PostgreSQL) with Prisma ORM for persistence, and Express.js for the backend.



---

## Features

- **No Authentication** – All APIs are open (for simplicity in testing/demo environments).
- **AI-Powered Question Generation** – Questions tailored by role and experience.
- **Answer Evaluation** – Each answer is scored (0–10) and accompanied by constructive feedback.
- **Persistent Storage** – User profiles, sessions, questions, answers, and AI evaluations stored in PostgreSQL.
- **RESTful API Design** – Simple and scalable endpoints.
- **Modular Architecture** – Easily extendable for future features (e.g., authentication, analytics).



---

## API Endpoints

### 1. Start an Interview
**POST** `/interview/start`

Creates a new interview session and generates mock questions.

**Request Body:**
```json
{
  "role": "Backend Developer",
  "experience": 4
}
```

**Response:**
```json
{
  "session_id": "xyz123",
  "questions": [
    { "id": 1, "question": "Explain REST vs GraphQL." },
    ...

  ]
}
```


### 2. Submit an Answer
**POST** `/interview/answer`

Stores an answer for a given question in the interview session.

**Request Body:**
```json
{
  "sessionId": "xyz123",
  "questionId": 1,
  "answer": "REST is based on..."
}
```

**Response:**
```json
{
  "status": "Answer submitted successfully"
}
```


### 3. Evaluate Interview
**GET** `/interview/evaluate/:sessionId`

Evaluates all submitted answers using Gemini AI and returns feedback and scores.

**Response:**
```json
{
  "session_id": "xyz123",
  "overall_score": 7.8,
  "evaluations": [
    {
      "question_id": 1,
      "question": "Explain REST vs GraphQL.",
      "answer": "REST is based on...",
      "score": 8,
      "feedback": "Good answer, but could be improved by comparing performance in real-world scenarios."
    },
    ...

  ]
}
```



---

## Architecture Overview


                      ┌──────────────────────────┐
                      │        Client (UI)       │
                      │  (Web, Mobile, CLI)      │
                      └─────────────┬────────────┘
                                    │ REST API Calls
                                    ▼
                      ┌──────────────────────────┐
                      │     Express.js Server    │
                      │  (Node.js, JavaScript)   │
                      └─────────────┬────────────┘
                                    │
               ┌────────────────────┼─────────────────────┐
               │                    │                     │
               ▼                    ▼                     ▼
     ┌──────────────────┐    ┌──────────────┐    ┌─────────────────────────────┐
     │ NeonDB (Server-  │    │  Prisma ORM  │    │ Gemini AI (Google Vertex)   │
     │ less PostgreSQL) │    │  (Schema &   │    │ - Generates Questions       │
     │ - Stores users,  │    │   Queries)   │    │ - Evaluates Answers         │
     │   sessions, Q&A  │    │              │    │ - Provides Feedback & Score │
     └──────────────────┘    └──────────────┘    └─────────────────────────────┘



---

## Core Components:


#### 1. Express.js Layer
  - Handles all REST API routes.
  - Implements validation, error handling, and service orchestration.

#### 2. AI Module (Gemini)
  - Dynamically generates role- & experience-specific questions.
  - Evaluates answers on clarity, technical depth, and relevance.
  - Returns score (0–10) + constructive feedback.

#### 3. Database (NeonDB with Prisma)

  - **Stores:**

    - User profiles (name, role, experience).
    - Interview sessions.

    - Generated questions.

    - User-submitted answers.

    - AI evaluations (feedback & scores).

  - **Serverless PostgreSQL for horizontal scalability & low-latency reads.**



---

## Tech Stack

- **Backend Framework:** Node.js with Express.js

- **Database:** NeonDB (serverless PostgreSQL)

- **ORM:** Prisma

- **AI Engine:** Gemini (for question generation and answer evaluation)

- **Language:** JavaScript

- **Environment Management:** dotenv for environment variables



---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/thegobindadas/InterviewIQ.git
cd InterviewIQ
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a **.env** file in the root directory:
```bash
# Port the server will run on
PORT=8000

# Environment (development/production)
NODE_ENV=development

# PostgreSQL connection URL (NeonDB)
DATABASE_URL=your_database_url

# Gemini API Key (Google Vertex AI)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Set Up the Database
Run Prisma migrations to create the necessary tables:
```bash
npx prisma migrate dev
```

### 5. Start the Server
The API server will be available at: http://localhost:8000
```bash
npm run dev
```



---

## Scripts

- **Start Development Server:**
```bash
npm run dev
```

- **Run Database Migrations:**
```bash
npx prisma migrate dev
```



---

## License

This project is licensed under the MIT License.

---