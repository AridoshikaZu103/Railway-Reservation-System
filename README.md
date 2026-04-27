# 🚂 Railway Reservation System (Modernized)

A state-of-the-art full-stack Railway Management project featuring a highly advanced React 18 UI with glassmorphism, dynamic CSS animations, an Express.js API backend, robust PostgreSQL database (Neon / Vercel Postgres), and **Google Gemini AI integration** for an intelligent Chatbot assistant.

---

## 📖 Project Context & Development History
This project has evolved significantly through multiple development phases to transition from a local development environment to a robust, cloud-ready production application.
- **Initial Phase:** Development of core features (RBAC, AI Chatbot, cinematic UI) using local XAMPP/MySQL.
- **Deployment & Cloud Migration:** Transitioned from local MySQL to Vercel Postgres to support serverless deployment on Render/Vercel.
- **Refinement:** Resolved critical search ranking logic bugs, updated NPM development scripts for smooth local testing, and streamlined environment variable synchronization across multiple cloud platforms.

---

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Lucide React, Custom Advanced CSS (Glassmorphism, Animated SVG Backgrounds)
- **Backend:** Node.js, Express.js, JWT Auth, bcryptjs, `pg` (PostgreSQL client)
- **Database:** PostgreSQL (Neon / Vercel Postgres) - Relational tables + Triggers + Constraints
- **AI Integration:** Google Gemini AI (via native fetch API)

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC)**
   - **Admin:** Full control. Can add, view, and safely **delete** train schedules (protected by Foreign Key constraint checks).
   - **Passenger:** User portal to securely search, book, and manage personal train reservations.
2. **AI Assistant (`RailBot`)**
   - A floating, context-aware chatbot powered by Google Gemini AI available globally across the application to assist passengers.
3. **Advanced Search Interface**
   - Intuitive dropdown-based search filters (by Source, Destination, Train Name, or Train Number) featuring a custom glassmorphism "Clear Search" action.
4. **Cinematic UI Experience**
   - Features a premium dark-themed interface with a custom **"Passing Train" CSS background animation**, using pure CSS and SVGs to create an immersive 22-second animated train journey across your screen.
5. **Robust Database Logic**
   - Automatic seat availability management using PostgreSQL Triggers during ticket booking and cancellation.

---

## 📂 Folder Structure

```text
railway-reservation-system/
├── client/          # React 18 frontend (Vite)
│   ├── src/         # UI components, pages, context, API calls
│   └── vercel.json  # Vercel deployment configuration
├── server/          # Express backend (Node.js)
│   ├── config/      # Database connections (pg driver)
│   ├── controllers/ # API route handlers
│   ├── routes/      # Express API routes
│   ├── sql/         # PostgreSQL schemas and seed data
│   └── setup-db.js  # Script to initialize cloud PostgreSQL database
├── package.json     # Root package manager (runs concurrently for dev)
└── render.yaml      # Render deployment configuration for backend
```

---

## 🛠️ Step-by-Step Installation & Setup

### Database: Why Neon / Vercel Postgres over MySQL?
We migrated the project from MySQL to PostgreSQL (specifically Neon / Vercel Postgres) due to deployment constraints. Local MySQL setups (like XAMPP or Docker) do not map perfectly to modern serverless cloud environments without extensive, costly configurations. Vercel Postgres (which is powered by Neon under the hood) provides native, highly scalable serverless integration out-of-the-box. Additionally, PostgreSQL handles certain trigger executions and constraints more reliably in cloud architectures. We updated our database schemas and transitioned to the `pg` driver to support this serverless approach.

### Prerequisites
1. Ensure Node.js (>= 18.0.0) is installed.
2. Create a Neon or Vercel Postgres database and get your `POSTGRES_URL`.
3. Get a Google Gemini API Key.

### 1. Setup Environment Variables
- **Backend (`server/.env`):** Copy `server/.env.example` to `server/.env` and add your `POSTGRES_URL` and `GEMINI_API_KEY`.
- **Frontend (`client/.env`):** Copy `client/.env.example` to `client/.env` and ensure `VITE_API_BASE_URL` points to your backend.

### 2. Initialize the Database
Open a terminal and navigate to the backend directory to run the setup script:
```bash
cd server
npm install
node setup-db.js
```
*This automatically creates tables, sets up PostgreSQL triggers, and seeds the initial demo data.*

### 3. Run Both Client & Server Concurrently
You can launch both the frontend and backend simultaneously from the root directory using the root `package.json`:
```bash
npm install
npm run dev
```
- The Express API server will start on `http://localhost:5000`.
- The Vite frontend will start on `http://localhost:5173`.

---

## 🔑 Demo Accounts

If you executed the database setup, use these credentials to explore the different role interfaces:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@railway.com` | `admin123` | Train Management & Deletion |
| **Passenger** | `passenger@example.com` | `pass123` | Search, Chatbot, Booking |

---

## 🏗️ Architecture details

- **users**: Authentication credentials and RBAC roles (`admin`, `passenger`).
- **passengers**: Demographics and profile information.
- **trains**: Route data, capacity, and scheduling.
- **reservations**: Links passengers to trains.

*Note: The backend enforces strict Foreign Key constraints. Attempting to delete a train that currently has active reservations will safely fail, protecting data integrity.*
