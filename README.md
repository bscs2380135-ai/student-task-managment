# Student Task Management System

A full-stack task management application for students to manage their academic tasks efficiently.

## Description
A mobile and web application where students can register, login, and manage their tasks with priorities, due dates, and status tracking. Built with Flutter frontend and Node.js backend with PostgreSQL database.

## Features
- Student registration and login with JWT authentication
- Create, read, update and delete tasks
- Set task priority (low, medium, high)
- Set task status (pending, in progress, completed)
- Set due dates for tasks
- Protected routes with middleware
- Optimized SQL queries with indexes

## Technologies Used
- **Frontend:** Flutter (Dart)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

## Project Structure
student-task-backend/
├── config/
│   └── db.js          # PostgreSQL connection pool
├── middleware/
│   └── auth.js        # JWT authentication middleware
├── routes/
│   ├── authRoutes.js  # Register and login routes
│   └── taskRoutes.js  # Task CRUD routes
├── controllers/
│   ├── authController.js  # Auth business logic
│   └── taskController.js  # Task business logic
└── app.js             # Express app entry point

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL
- Flutter SDK

### Database Setup
Open pgAdmin and run:
```sql
CREATE DATABASE student_task_db;

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_student_id ON tasks(student_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_students_email ON students(email);
```

### Backend Setup
```bash
cd student-task-backend
npm install
```

Create `.env` file:
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=student_task_db
JWT_SECRET=mysecretkey123

Run backend:
```bash
node app.js
```

### Flutter Setup
```bash
cd student_task_app
flutter pub get
flutter run -d chrome --web-browser-flag "--disable-web-security"
```

## API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new student |
| POST | /api/auth/login | Login student |

### Task Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get single task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## SQL Optimization
All frequently queried columns are indexed for fast lookups:
- `student_id` — filters tasks by student
- `status` — filters tasks by status
- `due_date` — sorts tasks by due date
- `email` — fast student lookup during login