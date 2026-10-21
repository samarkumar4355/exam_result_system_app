# Exam Result & Report Card System

A MERN stack web application for managing exams, student marks, grades, and report cards with role-based authentication for admins and students.

## Features

- Student registration and login
- Admin authentication and protected admin pages
- Exam creation and management
- Student marks entry and result calculation
- Automatic percentage, grade, and Pass/Fail status calculation
- Student dashboard and report card
- Role-based access control
- MongoDB database integration

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Security:** bcryptjs

## Project Structure

```text
exam-result-system/
├── backend/
└── frontend/
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd exam-result-system
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Security Notes

- Never commit `.env` files or real credentials to GitHub.
- Use a strong, unique `JWT_SECRET`.
- Student registration should assign the `student` role on the backend; users must not be able to register themselves as admins.
- Change any development or seed-account passwords before sharing or deploying the application.

## Deployment

The application can be deployed using:
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Configure `VITE_API_URL`, `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` using the hosting providers' environment-variable settings.

## License

Add a license if you intend to distribute or reuse this project publicly.
