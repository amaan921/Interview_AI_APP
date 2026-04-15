# InterviewIQ.AI 🤖

An AI-powered mock interview platform that helps you prepare for technical interviews with smart, adaptive questions and real-time performance evaluation.

---

## ✨ Features

- **Role-Based Questions** — AI generates tailored interview questions based on job role, experience level and interview type
- **Resume Integration** — Upload your resume (PDF) and get project-specific questions based on your background
- **Voice Input** — Answer questions using your microphone with real-time speech-to-text
- **AI Answer Evaluation** — Get scored on communication, technical accuracy and confidence with detailed feedback
- **Interview History** — Track your progress across all past interviews with performance analytics
- **Credit System** — Manage interview sessions with a built-in credits system (100 credits on signup, 10 per interview)
- **Google Authentication** — Secure sign-in via Firebase Google Auth with JWT session cookies

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Redux Toolkit, Framer Motion, TailwindCSS |
| Backend | Node.js, Express 5, Mongoose, JWT, Cookie-Parser |
| Database | MongoDB Atlas |
| Auth | Firebase (Google Sign-In) + JWT HttpOnly Cookies |
| AI | OpenRouter API (GPT-4o Mini) |
| Voice | Web Speech API (SpeechRecognition) |
| PDF Parse | Multer + pdfjs-dist |

---

## 🔄 How It Works

The interview follows a 3-step flow:

**Step 1 — Setup:** Select your role, experience level, interview type and question count. Or simply upload a resume PDF and let the AI figure it out.

**Step 2 — Interview:** Answer AI-generated questions by typing or speaking. A live timer tracks your session. You can end early if needed.

**Step 3 — Report:** Get an overall score (0–100), strengths, areas to improve, and per-question feedback with Good/Average/Poor ratings.

---

## 📁 Project Structure

```
ai-interview-app/
├── client/vite-project/          # React Frontend
│   └── src/
│       ├── components/
│       │   ├── step1Setup.jsx        # Interview config form
│       │   ├── step2Interview.jsx    # Live interview + voice
│       │   └── step3Report.jsx       # AI evaluation report
│       ├── pages/
│       │   ├── Auth.jsx              # Google sign-in
│       │   ├── Home.jsx              # Landing page
│       │   ├── interviewPage.jsx     # Interview flow
│       │   ├── History.jsx           # Past interviews
│       │   └── ReportPage.jsx        # Report viewer
│       ├── redux/                    # Redux store
│       └── utils/                    # Firebase config
│
├── server/                       # Express Backend
│   ├── controllers/
│   │   ├── auth.controller.js        # Google OAuth + JWT
│   │   ├── interview.controller.js   # Questions, evaluation, history
│   │   └── user.Controller.js        # Current user
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   └── interview.model.js        # Interview schema
│   ├── services/
│   │   └── openRouter.Services.js    # AI API wrapper
│   ├── middleware/                    # Auth + Multer
│   ├── config/                       # JWT config
│   └── index.js                      # Server entry
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Firebase project (for Google Auth)
- OpenRouter API key

### 1. Clone the repo

```bash
git clone https://github.com/amaan921/Interview-AI.git
cd Interview-AI
```

### 2. Setup the server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5001
MONGODB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Setup the client

```bash
cd client/vite-project
npm install
```

Configure your Firebase credentials in `src/utils/firebase.js`.

### 4. Run the app

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client/vite-project
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/google` | Google sign-in |
| GET | `/api/auth/logout` | Logout |
| GET | `/api/user/current-user` | Get authenticated user |
| POST | `/api/interview/generate` | Generate interview questions |
| POST | `/api/interview/evaluate` | Evaluate answers with AI |
| GET | `/api/interview/history` | Get interview history |
| GET | `/api/interview/:id` | Get interview by ID |

---

## 📄 License

This project is open source under the [ISC License](LICENSE).