# Gym Management System

A modern full-stack Gym Management System with admin authentication, dashboard analytics, member CRUD, and payment management.

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt password hashing

## Core Modules
- Premium dark responsive landing page
- Secure admin login with JWT and protected routes
- Admin dashboard with KPI cards and analytics charts
- Member management (Create, Read, Update, Delete)
- Payment management (status tracking, history, analytics, invoices, renewal)
- Toast notifications, loading and empty states
- CSV/PDF-like export utilities
- Global error boundary

## Folder Structure

```text
Gym Management System/
  backend/
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/v1/
      services/
      utils/
  frontend/
    src/
      app/
      components/
      hooks/
      lib/
      pages/
      utils/
```

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB local or cloud instance

## Setup Instructions

### 1) Install dependencies

```bash
# root
npm install

# frontend
cd frontend
npm install

# backend
cd ../backend
npm install
```

### 2) Configure environment files

```bash
# from project root
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env`:
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

## Run the project

From project root:

```bash
npm run dev
```

Other scripts:

```bash
npm run dev:frontend
npm run dev:backend
npm run build
npm start
```

## API Overview

Base URL: `http://localhost:5000/api/v1`

### Health
- `GET /health`

### Auth
- `POST /auth/admin/login`
- `GET /auth/admin/me`

### Members
- `POST /members`
- `GET /members?page=1&limit=10&search=&status=all`
- `GET /members/:id`
- `PUT /members/:id`
- `DELETE /members/:id`

### Payments
- `POST /payments`
- `GET /payments?page=1&limit=10&status=all`
- `GET /payments/analytics`
- `GET /payments/:id/invoice`
- `POST /payments/renew/:memberId`

## Default Admin

If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in backend env, the backend auto-creates a default admin on first startup.

## Production Notes
- Use a strong `JWT_SECRET`
- Use HTTPS and secure reverse proxy
- Validate and sanitize all incoming payloads
- Replace PDF-like text export with real PDF generator in production



