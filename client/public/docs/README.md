# 🌌 MERN Elite Portfolio — v2.0

[![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20MUI-0081CB?style=for-the-badge&logo=react)](https://github.com/mdyasar49/mern-portfolio-yasar)

> **A full-stack MERN portfolio application** I built to learn and demonstrate real-world architecture — a separate React frontend and Node/Express backend that communicate over HTTP APIs, backed by MongoDB Atlas with a local JSON fallback.

---

## 📋 Table of Contents

1. [What Is This Project?](#-what-is-this-project)
2. [Project Structure](#-project-structure)
3. [How Frontend & Backend Connect](#-how-frontend--backend-connect)
4. [Tech Stack](#-tech-stack)
5. [Features](#-features)
6. [Installation & Setup](#-installation--setup)
7. [Environment Variables](#-environment-variables)
8. [Running the Project](#-running-the-project)
9. [API Reference](#-api-reference)
10. [Deployment](#-deployment)
11. [Contact](#-contact)

---

## 🤔 What Is This Project?

This is a **personal developer portfolio** I built using the **MERN Stack**:

| Letter | Stands For | Role in This Project |
|:------:|:----------:|:---------------------|
| **M**  | MongoDB    | Database — stores profile data, visitor count |
| **E**  | Express.js | Backend framework — handles API routes & logic |
| **R**  | React.js   | Frontend — the UI the user sees in the browser |
| **N**  | Node.js    | Runtime — powers the Express.js server |

The key concept is that **frontend and backend are two completely separate projects** that run independently and communicate via **REST API calls over HTTP**.

---

## 📁 Project Structure

```
mern-portfolio-yasar/
│
├── client/                   ← React Frontend (runs on port 3000)
│   ├── src/
│   │   ├── pages/            ← Portfolio, Resume, Documentation pages
│   │   ├── components/       ← Reusable UI components (Navbar, Cards, etc.)
│   │   ├── services/         ← Axios API call functions
│   │   ├── hooks/            ← Custom React hooks
│   │   ├── theme/            ← MUI theme configuration
│   │   ├── config.js         ← Reads REACT_APP_API_BASE_URL from .env
│   │   └── App.js            ← Router setup & page routing
│   └── package.json          ← Frontend dependencies (React, MUI, Framer Motion)
│
├── server/                   ← Node/Express Backend (runs on port 5001)
│   ├── controllers/
│   │   └── portfolioController.js  ← Business logic (fetch profile, count visitors)
│   ├── models/               ← Mongoose schemas (MongoDB document structure)
│   ├── routes/
│   │   └── portfolioRoutes.js      ← API route definitions (/api/profile, /api/visitors)
│   ├── middleware/            ← Logger, error handler, CORS security
│   ├── config/               ← MongoDB connection logic
│   ├── data.json             ← Local fallback data (used when MongoDB is offline)
│   ├── stats.json            ← Local visitor count fallback
│   ├── app.js                ← Express app setup (middlewares, routes)
│   ├── index.js              ← Server entry point (starts listening on PORT)
│   └── package.json          ← Backend dependencies (Express, Mongoose, dotenv)
│
└── render.yaml               ← Deployment config for Render.com
```

---

## 🔗 How Frontend & Backend Connect

**The frontend and backend are separate — they only talk to each other through HTTP API requests.**

### 🔄 The Full Request-Response Flow

```
Browser (user visits :3000)
    │
    ▼
React App (client/)  ──── sends HTTP GET ────▶  Express Server (server/)
    │                   e.g. GET /api/profile         │
    │                                                  ▼
    │                                         portfolioController.js
    │                                                  │
    │                                     ┌────────────┴────────────┐
    │                                     ▼                         ▼
    │                              MongoDB Atlas               data.json
    │                              (if connected)          (if DB is offline)
    │                                     └────────────┬────────────┘
    │                                                  ▼
    │◀─────────────────────── JSON response ──────────┘
    ▼
React updates the UI with the received data
```

### 📡 Step-by-Step

**Step 1 — `client/.env` sets the backend URL:**
```
REACT_APP_API_BASE_URL=http://localhost:5001
```

**Step 2 — `config.js` exports it:**
```js
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
```

**Step 3 — Axios calls the backend:**
```js
axios.get(`${API_BASE_URL}/api/profile`);
```

**Step 4 — Express routes it to the controller:**
```js
router.get('/profile', portfolioController.getProfile);
```

**Step 5 — Controller fetches from MongoDB or falls back to `data.json`.**

**Step 6 — Express sends JSON back → React renders the data.**

---

## ⚙️ Tech Stack

### Frontend (`client/`)

| Package | Version | Purpose |
|:--------|:--------|:--------|
| `react` | 18.x | Core UI library |
| `react-router-dom` | 6.x | Client-side page routing |
| `@mui/material` | 5.x | Component library |
| `framer-motion` | 11.x | Animations |
| `axios` | 1.x | HTTP requests to backend |
| `lucide-react` | 0.395 | Icons |

### Backend (`server/`)

| Package | Version | Purpose |
|:--------|:--------|:--------|
| `express` | 4.x | Web server & routing |
| `mongoose` | 8.x | MongoDB ODM |
| `dotenv` | 16.x | Load `.env` variables |
| `cors` | 2.x | Cross-origin security |
| `nodemon` | 3.x | Auto-restart on changes (dev) |

---

## ✨ Features

- **💎 Glassmorphic UI** — Dark-mode design with frosted-glass cards and Framer Motion animations.
- **🛡️ Hybrid Data Layer** — Automatically switches between MongoDB Atlas and `data.json` fallback.
- **📊 Visitor Counter** — Real-time counter with MongoDB or local `stats.json` persistence.
- **📑 Resume Generator** — Browser-side PDF generation from live portfolio data.
- **🔒 CORS Security** — Only the official frontend can access the API.
- **🔍 SEO Ready** — Dynamic `<head>` metadata on every page.

---

## 🛠 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) **v18 or higher**
- `npm` (comes with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account *(optional — local fallback works without it)*

### Step 1 — Clone the Repository

```bash
git clone https://github.com/mdyasar49/mern-portfolio-yasar.git
cd mern-portfolio-yasar
```

### Step 2 — Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3 — Configure Backend Environment

Create a `.env` file inside the `server/` folder:

```bash
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> 💡 **No MongoDB?** Leave `MONGO_URI` blank. The server will use `data.json` as fallback automatically.

### Step 4 — Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 5 — Configure Frontend Environment

Create a `.env` file inside the `client/` folder:

```bash
REACT_APP_API_BASE_URL=http://localhost:5001
```

> ⚠️ After creating or changing `.env`, **restart** `npm start` for the new values to take effect.

---

## ▶️ Running the Project

You need **two separate terminals** — one for backend, one for frontend.

### Terminal 1 — Start the Backend

```bash
cd server
npm run dev
```

### Terminal 2 — Start the Frontend

```bash
cd client
npm start
```

Open **http://localhost:3000** in your browser.

---

## 📡 API Reference

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/profile` | Returns full portfolio data |
| `GET` | `/api/visitors` | Returns and increments visitor counter |
| `GET` | `/api/health` | Returns server & database status |
| `GET` | `/` | Root health check |

---

## 🌐 Deployment

Deployed on **[Render.com](https://render.com)** via `render.yaml`.

| Service | Build Command | Start Command |
|:--------|:-------------|:-------------|
| Frontend (Static Site) | `npm run build` | *(auto-served)* |
| Backend (Web Service) | `npm install` | `node index.js` |

**Required Environment Variables on Render:**

| Variable | Where | Value |
|:---------|:------|:------|
| `MONGO_URI` | Server | MongoDB Atlas connection string |
| `PORT` | Server | `5001` |
| `CLIENT_URL` | Server | Deployed frontend URL |
| `NODE_ENV` | Server | `production` |
| `REACT_APP_API_BASE_URL` | Client | Deployed backend URL |

---

## 📬 Contact

**Developer:** A. Mohamed Yasar
**GitHub:** [@mdyasar49](https://github.com/mdyasar49)
**LinkedIn:** [linkedin.com/in/mdyasar49](https://linkedin.com/in/mdyasar49)

---

*I built this project to practice full-stack MERN development with real-world architecture.*
