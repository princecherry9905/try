# xSTUDENT - Student Management System

A full-stack Student Management System built with a React + Vite frontend and a Node.js + Express REST API backed by MongoDB Atlas.

---

## 🚀 Features

- **Student Management (CRUD)**:
  - List students with server-side pagination and course filtering.
  - View individual student profile and academic details.
  - Create student records with field validation and uniqueness checks (Admin-only).
  - Update student details with validation (Admin-only).
  - Delete student records safely (Admin-only).
- **Security & Authorization**:
  - Role-based route protection (`Admin` vs `User`).
  - Strict CORS origin restriction supporting local dev and deployed frontend.
  - Environment variable isolation (no hardcoded secrets).
- **Robust Backend Architecture**:
  - Centralized global error handling with sanitized production errors.
  - Dedicated `/api/health` monitoring endpoint with uptime and DB status.
  - Automated repeatable API integration test suite (`npm test`).

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router, Bootstrap 5, Browser-native Fetch |
| **Backend** | Node.js, Express 5, Mongoose, MongoDB Atlas, CORS, Dotenv |
| **Testing** | Node.js Test Runner / Integration Suite |
| **Dev Tools** | Nodemon, ESLint / Oxlint, Git & GitHub |

---

## 👥 Team & Roles

| Member | Role | Core Responsibilities |
|---|---|---|
| **Prince Kumar** | **Team Lead** | Architecture, repo setup, dashboard summary, code reviews, deployment |
| **Member 2** | **Frontend Engineer** | React layouts, responsive forms, tables, route protection, student CRUD views |
| **Dipesh Singh** | **Backend Engineer** | Mongoose schemas, Student CRUD REST APIs, CORS, centralized errors, API tests |
| **Member 4** | **Security & Auth Engineer** | JWT authentication, user registration/login, role-based authorization |

---

## 📁 Project Structure

```text
xSTUDENT/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection (connectDB)
│   │   ├── controllers/     # Student business logic & queries
│   │   ├── middleware/      # Admin authorization, 404 & error handlers
│   │   ├── models/          # Mongoose schemas (Student, etc.)
│   │   ├── routes/          # API route definitions (students, health)
│   │   └── server.js        # Express app entrypoint & middleware setup
│   ├── tests/               # API integration test suite
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI elements
│   │   ├── pages/           # Application views (Student list, details, forms)
│   │   ├── services/        # Native fetch API helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
├── docs/                    # Workflow guides & assignments
└── README.md
```

---

## 💻 Getting Started

### Prerequisites
- Node.js 20+ and npm
- MongoDB Atlas database URI (or local MongoDB)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET in .env
npm run dev
```
Backend runs by default at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs by default at `http://localhost:5173`.

### 3. Run Backend Tests
```bash
cd backend
npm test
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | No | Server port (defaults to 5000) | `5000` |
| `NODE_ENV` | Yes | Environment mode (`development` / `production`) | `development` |
| `CLIENT_URL` | Yes | Allowed frontend origin for CORS | `http://localhost:5173` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Secret key for JWT signing | `your_secret_key` |

### Frontend (`frontend/.env`)
| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Root check returning server status |
| `GET` | `/api/health` | Public | Health check (uptime, database status, timestamp) |
| `GET` | `/api/students` | Public / User | List students with pagination (`?page=1&limit=10`) and filter (`?course=CS`) |
| `GET` | `/api/students/:id` | Public / User | Get single student details by ID |
| `POST` | `/api/students` | Admin | Create student record (required: `studentId`, `fullName`, `email`, `course`, `rollNo`) |
| `PUT` | `/api/students/:id` | Admin | Update student details |
| `DELETE` | `/api/students/:id` | Admin | Delete student record |

### Example Responses

#### `GET /api/health`
```json
{
  "status": "OK",
  "uptime": 124.5,
  "timestamp": "2026-10-11T12:00:00.000Z",
  "database": "connected"
}
```

#### `GET /api/students`
```json
{
  "count": 1,
  "totalStudents": 1,
  "totalPages": 1,
  "students": [
    {
      "_id": "67090b8f1c8e1a0012345678",
      "studentId": "STU101",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "course": "Computer Science",
      "rollNo": "CS2026-01"
    }
  ]
}
```

---

## 📸 Screenshots & UI Previews

### 1. API Verification & Health Endpoint
```text
GET /api/health ➡️ 200 OK
{
  "status": "OK",
  "uptime": 0.31,
  "timestamp": "2026-10-11T11:16:01.711Z",
  "database": "connected"
}
```

### 2. Integration Test Results
```text
PASS: GET / returns 200
PASS: GET /api/health returns 200 and OK
PASS: POST /api/students without auth returns 403
PASS: POST /api/students with user role returns 403
PASS: POST /api/students with missing fields returns 400
PASS: PUT /api/students/:id with user role returns 403
PASS: PUT /api/students/:id with invalid ID returns 400
PASS: DELETE /api/students/:id with user role returns 403
PASS: DELETE /api/students/:id with invalid ID returns 400
PASS: Unknown route returns 404

Tests finished: 10 passed, 0 failed
```

### 3. Application UI (Screenshots)
> *Note: UI views are currently under active development by the frontend team.*

- **Dashboard / Student Directory**: `[Placeholder: Dashboard UI view displaying student table, search, and pagination]`
- **Add / Edit Student Modal**: `[Placeholder: Add Student form with validation feedback]`
- **Authentication**: `[Placeholder: Login & Register view]`

---

## 🌐 Deployment Links

- **Backend API (Production)**: [https://xstudent.onrender.com](https://xstudent.onrender.com)
- **Backend Health Check**: [https://xstudent.onrender.com/api/health](https://xstudent.onrender.com/api/health)
- **Frontend App (Production)**: `[Deployment in progress - configured via Vercel]`
