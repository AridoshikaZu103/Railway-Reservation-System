# 🚂 Railway Reservation System (Modernized)

A state-of-the-art full-stack Railway Management project featuring a highly advanced React 18 UI with glassmorphism, dynamic CSS animations, an Express.js API backend, robust MySQL database, and **Google Gemini AI integration** for an intelligent Chatbot assistant.

---

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Lucide React, Custom Advanced CSS (Glassmorphism, Animated SVG Backgrounds)
- **Backend:** Node.js, Express.js, JWT Auth, bcryptjs, mysql2
- **Database:** MySQL 8.0 (Relational tables + Triggers + Constraints)
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
   - Automatic seat availability management using MySQL Triggers during ticket booking and cancellation.

---

## 🛠️ Step-by-Step Installation & Setup

### Step 1: Database Setup (MySQL)
1. Ensure MySQL is running locally (e.g., via XAMPP, Docker, or native installation).
2. Open your MySQL client and run the scripts located in `server/sql/` in this exact order:
   ```bash
   mysql -u root -p < server/sql/schema.sql
   mysql -u root -p < server/sql/triggers.sql
   mysql -u root -p < server/sql/seed.sql
   ```
   *(Note: The seed file provides essential initial data including the Admin account).*

### Step 2: Backend Setup (Node.js & AI)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd server
   npm install
   ```
2. Configure Environment Variables:
   - Copy the example config: `cp .env.example .env`
   - Open `server/.env` and fill in your database credentials.
   - **CRITICAL:** Add your Google Gemini API key to enable the Chatbot:
     ```env
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     ```
3. Start the Express server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### Step 3: Frontend Setup (React/Vite)
1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd client
   npm install
   ```
2. Configure Environment Variables:
   - Copy the example config: `cp .env.example .env`
   - Ensure it points to the backend: `VITE_API_BASE_URL=http://localhost:5000/api`
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

## 🔑 Demo Accounts

If you executed `seed.sql`, use these credentials to explore the different role interfaces:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@railway.com` | `admin123` | Train Management & Deletion |
| **Passenger** | `passenger@example.com` | `pass123` | Search, Chatbot, Booking |

---

## 🏗️ Architecture & Database

- **users**: Authentication credentials and RBAC roles (`admin`, `passenger`).
- **passengers**: Demographics and profile information.
- **trains**: Route data, capacity, and scheduling.
- **reservations**: Links passengers to trains.

*Note: The backend enforces Foreign Key constraints. Attempting to delete a train that currently has active reservations will safely fail, protecting data integrity.*
