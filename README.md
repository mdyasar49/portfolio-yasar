# MERN Stack Portfolio — by A. Mohamed Yasar

[![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20MUI-0081CB?style=for-the-badge&logo=react)](https://github.com/mdyasar49/mern-portfolio-yasar)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

> I built this project from scratch while learning the MERN Stack. It is my personal developer portfolio that shows who I am, what I know, and what I have built — all backed by a real Node.js API and MongoDB database.

---

## Table of Contents

1. [What Is This Project?](#-what-is-this-project)
2. [Why Two Separate Projects?](#-why-two-separate-projects)
3. [Project Structure](#-project-structure)
4. [How Frontend and Backend Connect](#-how-frontend-and-backend-connect)
5. [Tech Stack](#-tech-stack)
6. [Features](#-features)
7. [Installation and Setup](#-installation-and-setup)
8. [Environment Variables](#-environment-variables)
9. [Running the Project](#-running-the-project)
10. [API Reference](#-api-reference)
11. [Deployment](#-deployment)
12. [Contact](#-contact)

---

## What Is This Project?

This is my personal **developer portfolio website** built using the **MERN Stack**. MERN stands for:

| Letter | Technology | What it does in this project |
|:------:|:----------:|:-----------------------------|
| **M** | MongoDB | Database — stores my profile data and visitor count |
| **E** | Express.js | Backend framework — handles all API routes and logic |
| **R** | React.js | Frontend — the UI that people see in the browser |
| **N** | Node.js | Runtime environment — makes the Express server work |

This is not just a static HTML page. The **frontend (React)** and **backend (Node/Express)** are two completely separate projects. They run independently and talk to each other through HTTP API calls — exactly how real company projects work.

I built this to learn and practice real-world full-stack development, not just to have a portfolio page.

---

## Why Two Separate Projects?

This is an important question. Most beginners make a single HTML file and put everything in it. I chose a different approach for a reason.

| Simple HTML Approach | This MERN Project |
|:---------------------|:------------------|
| Everything in one file | Frontend and backend are completely separate |
| No server needed | Express server runs independently on port 5001 |
| Data is hardcoded in HTML | Data lives in MongoDB, fetched through an API |
| Cannot be scaled | Each part can be deployed, updated, and scaled independently |

**Why I did it this way:**

- I wanted to learn how real companies structure their web applications.
- The frontend can be updated without touching the backend, and vice versa.
- Both can be deployed to different servers (e.g., React on Vercel, API on Render).
- It forced me to understand how HTTP requests, REST APIs, CORS, and environment variables actually work.

---

## Project Structure

```
mern-portfolio-yasar/
│
├── client/                       ← React Frontend (runs on port 3000)
│   ├── src/
│   │   ├── pages/                ← Portfolio, Resume, Documentation pages
│   │   ├── components/           ← Reusable UI pieces (Navbar, Cards, etc.)
│   │   ├── services/             ← Axios functions that call the backend API
│   │   ├── hooks/                ← Custom React hooks
│   │   ├── theme/                ← MUI dark theme configuration
│   │   ├── config.js             ← Reads the backend URL from .env
│   │   └── App.js                ← React Router setup (URL → page mapping)
│   ├── .env                      ← Frontend environment variables (not committed)
│   └── package.json              ← Frontend dependencies
│
├── server/                       ← Node/Express Backend (runs on port 5001)
│   ├── index.js                  ← Entry point — starts the server
│   ├── app.js                    ← Express setup — CORS, middleware, routes
│   ├── routes/
│   │   └── portfolioRoutes.js    ← Defines API URLs (/api/profile, etc.)
│   ├── controllers/
│   │   └── portfolioController.js← Business logic — fetches and returns data
│   ├── models/                   ← Mongoose schemas (MongoDB document structure)
│   ├── middleware/               ← Logger, CORS handler, error handler
│   ├── config/                   ← MongoDB connection setup
│   ├── data.json                 ← Fallback data when MongoDB is offline
│   ├── stats.json                ← Fallback visitor count storage
│   ├── .env                      ← Backend environment variables (not committed)
│   └── package.json              ← Backend dependencies
│
└── render.yaml                   ← Deployment config for Render.com
```

---

## How Frontend and Backend Connect

This is the core concept of the entire project. The frontend and backend do not share any files. They only communicate using HTTP requests — the same way a mobile app talks to a server.

### The Full Request Flow

```
User opens http://localhost:3000 in their browser
        │
        ▼
React App (client/) loads in the browser
        │
        │  On page load, useEffect() fires
        │  → calls portfolioService.js
        │  → axios sends GET http://localhost:5001/api/profile
        │
        ▼
Express Server (server/) receives the request
        │
        ▼
portfolioRoutes.js → portfolioController.js
        │
        ├── Is MongoDB connected?
        │       ├── YES → fetch from MongoDB Atlas
        │       └── NO  → read from server/data.json (fallback)
        │
        ▼
Express sends back: { success: true, data: { name, skills, projects... } }
        │
        ▼
React receives the JSON → setState() → component re-renders
        │
        ▼
User sees the portfolio data on screen
```

### Step-by-Step Code Path

**Step 1 — Frontend reads the backend URL from its `.env` file:**
```
client/.env
REACT_APP_API_BASE_URL=http://localhost:5001
```

**Step 2 — `config.js` exports that URL:**
```js
// client/src/config.js
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
```

**Step 3 — A service function calls the backend using Axios:**
```js
// client/src/services/portfolioService.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const getProfile = () => axios.get(`${API_BASE_URL}/api/profile`);
```

**Step 4 — The Express router receives the request and maps it to a controller:**
```js
// server/routes/portfolioRoutes.js
router.get('/profile', portfolioController.getProfile);
```

**Step 5 — The controller decides where to get the data:**
```js
// server/controllers/portfolioController.js
if (mongoose.connection.readyState === 1) {
  const profile = await Profile.findOne();
  res.json({ success: true, data: profile });
} else {
  const data = require('../data.json');
  res.json({ success: true, data });
}
```

**Step 6 — React receives the JSON and renders the UI.**

That's the full loop. Frontend → Backend → Database/Fallback → Backend → Frontend.

---

## Tech Stack

### Frontend (`client/`)

| Package | Version | Purpose |
|:--------|:--------|:--------|
| `react` | 18.x | Core UI library |
| `react-router-dom` | 6.x | Page routing (URL → component mapping) |
| `@mui/material` | 5.x | UI component library |
| `framer-motion` | 11.x | Animations and page transitions |
| `axios` | 1.x | Makes HTTP requests to the backend |
| `lucide-react` | latest | Icons |
| `react-markdown` | 10.x | Renders markdown content in the browser |
| `html2pdf.js` | latest | Client-side PDF generation for the Resume page |

### Backend (`server/`)

| Package | Version | Purpose |
|:--------|:--------|:--------|
| `express` | 4.x | Web server and route handling |
| `mongoose` | 8.x | MongoDB connection and schema modeling |
| `dotenv` | 16.x | Loads `.env` file variables into `process.env` |
| `cors` | 2.x | Allows/blocks cross-origin requests from the frontend |
| `nodemon` | 3.x | Auto-restarts server on file save (development only) |

---

## Features

- **Dark Glassmorphic UI** — Premium dark-mode design with frosted glass cards, neon accents, and smooth animations using Framer Motion.
- **Hybrid Data Layer** — The backend automatically uses MongoDB Atlas when connected, and falls back to `data.json` when the database is offline. The portfolio is always online.
- **Live Visitor Counter** — Tracks visitors in real time. Persists using MongoDB or `stats.json` as a local fallback.
- **Resume PDF Generator** — Generates and downloads a formatted PDF resume entirely in the browser using `html2pdf.js`. No server needed.
- **CORS Security** — Only whitelisted frontend URLs can call the backend API.
- **SEO Ready** — Each page has a proper title tag, meta description, and semantic HTML structure.

---

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) **v18 or higher**
- `npm` (comes bundled with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account *(optional — the local fallback works without it)*

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/mdyasar49/mern-portfolio-yasar.git
cd mern-portfolio-yasar
```

---

### Step 2 — Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```bash
# server/.env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> **No MongoDB?** That is fine. Leave `MONGO_URI` blank or use a wrong string. The server will detect the failed connection and automatically switch to `data.json`. The portfolio will still work fully.

---

### Step 3 — Set Up the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` folder:

```bash
# client/.env
REACT_APP_API_BASE_URL=http://localhost:5001
```

> **Important:** After creating or editing `.env`, you must **restart** `npm start`. React reads `.env` values only at startup — changing them while the app is running has no effect.

---

## Running the Project

You need **two separate terminal windows open at the same time** — one for the backend server, one for the React frontend. They run independently.

### Terminal 1 — Start the Backend

```bash
cd server
npm run dev
```

You should see:
```
[Server] Listening on port 5001
[MongoDB] Connected to Atlas
```

Or, if MongoDB is not available:
```
[Server] Listening on port 5001
[MongoDB] Offline. Using local data.json fallback.
```

---

### Terminal 2 — Start the Frontend

```bash
cd client
npm start
```

You should see:
```
Compiled successfully!
Local:  http://localhost:3000
```

Now open **http://localhost:3000** in your browser. The React app will load and immediately call the backend at `http://localhost:5001` to fetch portfolio data.

---

## API Reference

All backend endpoints are prefixed with `/api`.

| Method | Endpoint | What it does |
|:-------|:---------|:-------------|
| `GET` | `/api/profile` | Returns the full portfolio data (name, skills, projects, experience) |
| `GET` | `/api/visitors` | Returns the visitor count and increments it by 1 |
| `GET` | `/api/health` | Returns server status and MongoDB connection state |
| `GET` | `/` | Root health check — confirms the server is running |

**Example — Response from `/api/profile`:**
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

## Deployment

The project is configured for **[Render.com](https://render.com)** using the `render.yaml` file in the root.

| Service | Render Type | Build Command | Start Command |
|:--------|:------------|:-------------|:-------------|
| `client/` | Static Site | `npm run build` | *(served as static files)* |
| `server/` | Web Service | `npm install` | `node index.js` |

**Environment variables to set on Render:**

| Variable | Service | Value |
|:---------|:--------|:------|
| `MONGO_URI` | Server | Your MongoDB Atlas connection string |
| `PORT` | Server | `5001` (or Render assigns one automatically) |
| `CLIENT_URL` | Server | Your deployed frontend URL (e.g., `https://your-site.onrender.com`) |
| `REACT_APP_API_BASE_URL` | Client | Your deployed backend URL (e.g., `https://your-api.onrender.com`) |

---

## Contact

**Developer:** A. Mohamed Yasar  
**GitHub:** [@mdyasar49](https://github.com/mdyasar49)  
**LinkedIn:** [linkedin.com/in/mdyasar49](https://linkedin.com/in/mdyasar49)

---

*I built this project to understand how real full-stack applications work — and I learned a lot along the way.*
