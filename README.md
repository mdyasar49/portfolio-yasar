# 🌌 MERN Elite Portfolio — v2.0

[![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20MUI-0081CB?style=for-the-badge&logo=react)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

> **A full-stack MERN portfolio application** built to demonstrate real-world architecture — separate frontend and backend projects that communicate over HTTP APIs, backed by MongoDB Atlas with a local JSON fallback.

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

This is a **personal developer portfolio** built using the **MERN Stack**:

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

This is the most important concept to understand. **The frontend and backend are separate — they don't share code or files. They only talk to each other through HTTP API requests.**

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
    │                                     │                         │
    │                                     └────────────┬────────────┘
    │                                                  ▼
    │                                          JSON response
    │◀────────────────────────────────────────────────┘
    ▼
React updates the UI with the received data
```

### 📡 Step-by-Step Explanation

**Step 1 — Client reads the API URL from its `.env` file:**
```
client/.env
REACT_APP_API_BASE_URL=http://localhost:5001
```

**Step 2 — `config.js` exports that URL:**
```js
// client/src/config.js
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// → "http://localhost:5001"
```

**Step 3 — A service file uses Axios to call the backend:**
```js
// client/src/services/portfolioService.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const getProfile = () => axios.get(`${API_BASE_URL}/api/profile`);
```

**Step 4 — The Express server receives the request:**
```js
// server/routes/portfolioRoutes.js
router.get('/profile', portfolioController.getProfile);
```

**Step 5 — The controller fetches from MongoDB or falls back to `data.json`:**
```js
// server/controllers/portfolioController.js
if (mongoose.connection.readyState === 1) {
  // Fetch from MongoDB Atlas
} else {
  // Read from server/data.json (local fallback)
}
```

**Step 6 — Express sends back a JSON response, React renders it.**

---

## ⚙️ Tech Stack

### Frontend (`client/`)

| Package | Version | Purpose |
|:--------|:--------|:--------|
| `react` | 18.x | Core UI library |
| `react-router-dom` | 6.x | Client-side page routing |
| `@mui/material` | 5.x | Component library (UI elements) |
| `framer-motion` | 11.x | Page & element animations |
| `axios` | 1.x | HTTP requests to the backend |
| `lucide-react` | 0.395 | Icon set |
| `react-markdown` | 10.x | Render markdown content |

### Backend (`server/`)

| Package | Version | Purpose |
|:--------|:--------|:--------|
| `express` | 4.x | Web server & routing framework |
| `mongoose` | 8.x | MongoDB ODM (object modeling) |
| `dotenv` | 16.x | Load environment variables from `.env` |
| `cors` | 2.x | Cross-Origin Resource Sharing security |
| `nodemon` | 3.x | Auto-restart server on file changes (dev only) |

---

## ✨ Features

- **💎 Glassmorphic UI** — Premium dark-mode design with frosted-glass cards, neon accents, and fluid animations via Framer Motion.
- **🛡️ Hybrid Data Layer** — Backend automatically switches between MongoDB Atlas (primary) and `data.json` (fallback) so the portfolio is always online.
- **📊 Visitor Counter** — A real-time visitor tracker that persists across reloads using MongoDB or a local `stats.json` fallback.
- **📑 Resume Generator** — Generates and downloads a PDF resume directly from the live portfolio data using `html2pdf.js`.
- **🔒 CORS Security** — Whitelist-based CORS policy ensures only trusted frontend origins can access the API.
- **🔍 SEO Ready** — Dynamic `<head>` metadata, Open Graph tags, and semantic HTML on every page.

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
# server/.env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> 💡 **No MongoDB?** Leave `MONGO_URI` blank or set it to an invalid string. The server will automatically use `data.json` as a fallback — the portfolio will still work.

### Step 4 — Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 5 — Configure Frontend Environment

Create a `.env` file inside the `client/` folder:

```bash
# client/.env
REACT_APP_API_BASE_URL=http://localhost:5001
```

> ⚠️ **Important:** After creating or changing `.env`, you **must restart** `npm start` for the new values to take effect. React bakes `.env` variables in at startup.

---

## ▶️ Running the Project

You need to run **two separate terminal windows** — one for the backend, one for the frontend.

### Terminal 1 — Start the Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
[Server] Listening on port 5001
[MongoDB] Connected to Atlas   ← or → [MongoDB] Offline. Using local data.json fallback.
```

### Terminal 2 — Start the Frontend

```bash
cd client
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

Now open **http://localhost:3000** in your browser.

---

## 📡 API Reference

All backend API endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/profile` | Returns the full portfolio data (name, skills, experience, projects) |
| `GET` | `/api/visitors` | Returns and increments the visitor counter |
| `GET` | `/api/health` | Returns server status and database connection state |
| `GET` | `/` | Root health check — confirms the server is online |

**Example response from `/api/profile`:**
```json
{
  "success": true,
  "data": {
    "name": "A. Mohamed Yasar",
    "title": "MERN Stack Developer",
    "skills": [...],
    "projects": [...],
    "experience": [...]
  }
}
```

---

## 🌐 Deployment

The project is pre-configured for **[Render.com](https://render.com)** via `render.yaml`.

| Service | Type | Build Command | Start Command |
|:--------|:-----|:-------------|:-------------|
| Frontend | Static Site | `npm run build` | *(served as static files)* |
| Backend | Web Service | `npm install` | `node index.js` |

**Required Environment Variables on Render:**

| Variable | Where | Value |
|:---------|:------|:------|
| `MONGO_URI` | Server | Your MongoDB Atlas connection string |
| `PORT` | Server | `5001` (or Render auto-assigns) |
| `CLIENT_URL` | Server | Your deployed frontend URL |
| `REACT_APP_API_BASE_URL` | Client | Your deployed backend URL |

---

## 📬 Contact

**Developer:** A. Mohamed Yasar
**GitHub:** [@mdyasar49](https://github.com/mdyasar49)
**LinkedIn:** [linkedin.com/in/mdyasar49](https://linkedin.com/in/mdyasar49)

---

*Built with precision, passion, and a deep respect for clean architecture.*
