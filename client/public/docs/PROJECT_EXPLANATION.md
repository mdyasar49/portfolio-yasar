# Project Explanation — MERN Stack Portfolio

> **Who wrote this?** I am A. Mohamed Yasar. I built this project myself while learning the MERN Stack. This document explains everything about the project in plain English — what it is, why I structured it this way, how to set it up, and how the frontend and backend actually talk to each other.

---

## 1. What Is This Project and Why Did I Build It?

This is my personal portfolio website, but it is not a simple HTML file. I built it as a **full-stack MERN application** — which means it has a real backend server, a real database, and a frontend that fetches data from the backend through API calls.

**Why go through all this trouble for a portfolio?**

Because I wanted to practice how real projects are built. In a real company, the frontend team and the backend team work on completely separate codebases. They communicate only via APIs. I wanted to experience that same workflow from scratch — so I built my own portfolio this way.

The result is a project where:
- The **frontend** (React) handles the UI and what users see.
- The **backend** (Node + Express) handles data, logic, and the database.
- They **never share files** — they only communicate over HTTP.

---

## 2. Why Are There Two Separate Folders? (`client/` and `server/`)

When you clone this project, you will see two main folders:

```
mern-portfolio-yasar/
├── client/    ← This is the React Frontend
└── server/    ← This is the Node.js Backend
```

They are **two completely separate projects**. Each has its own `package.json`, its own `node_modules`, and its own `.env` file. You install them separately and run them separately.

This separation is called a **decoupled architecture**. It is the industry standard.

| If they were in one project | Because they are in two projects |
|:----------------------------|:---------------------------------|
| Frontend change breaks backend | Frontend and backend are independent |
| Hard to deploy separately | Each can be deployed to a different host |
| Code gets messy fast | Clean boundary between UI logic and data logic |
| You cannot swap the frontend | You could replace React with Vue and the backend stays the same |

The `client/` folder does not know anything about how the server works internally. It only knows one thing: the **URL** of the API. That URL is stored in `client/.env`:

```
REACT_APP_API_BASE_URL=http://localhost:5001
```

Similarly, the `server/` folder does not know what React does. It just receives requests and sends back JSON responses.

---

## 3. How the Frontend and Backend Talk to Each Other

This is the most important thing to understand.

### The Short Answer
The React frontend uses **Axios** to send an **HTTP GET request** to the Express backend. The backend processes it, fetches data from MongoDB (or a local JSON file), and sends back a **JSON response**. React receives that JSON and renders it on screen.

### The Full Step-by-Step Flow

```
1. User opens http://localhost:3000 in the browser

2. React app loads (client/src/index.js → App.js → Portfolio.js)

3. Inside Portfolio.js, a useEffect() hook runs on page load:
       getProfile()   ← this calls portfolioService.js

4. portfolioService.js sends the actual HTTP request:
       axios.get("http://localhost:5001/api/profile")

5. The Express server (running at port 5001) receives the request
       app.js → portfolioRoutes.js → portfolioController.js

6. portfolioController.js checks if MongoDB is connected:
       ├── YES → fetches from MongoDB Atlas
       └── NO  → reads from server/data.json (fallback)

7. Express sends back JSON:
       { success: true, data: { name: "Yasar", skills: [...], ... } }

8. Axios in React receives that JSON

9. React calls setState() with the new data

10. The component re-renders and shows the portfolio on screen
```

Nothing is hardcoded in the React component. All data comes from the backend.

### The Code Path

**client/src/config.js** — reads the backend URL from `.env`
```js
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// In development: "http://localhost:5001"
// In production:  "https://your-api.onrender.com"
```

**client/src/services/portfolioService.js** — makes the actual API call
```js
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const getProfile = () =>
    axios.get(`${API_BASE_URL}/api/profile`);

export const getVisitorCount = () =>
    axios.get(`${API_BASE_URL}/api/visitors`);
```

**server/routes/portfolioRoutes.js** — maps the URL to a function
```js
router.get('/profile', portfolioController.getProfile);
router.get('/visitors', portfolioController.getVisitors);
```

**server/controllers/portfolioController.js** — does the actual work
```js
exports.getProfile = async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        // MongoDB is online — get data from the database
        const profile = await Profile.findOne();
        return res.json({ success: true, data: profile });
    }
    // MongoDB is offline — use the local JSON file instead
    const data = require('../data.json');
    res.json({ success: true, data });
};
```

That is the complete connection. A request travels: **React → Axios → Express Router → Controller → MongoDB or JSON → Response → React**.

---

## 4. How to Install and Run This Project

### What You Need

- **Node.js v18 or higher** — download from [nodejs.org](https://nodejs.org/)
- **npm** — comes automatically with Node.js
- **MongoDB Atlas account** — optional. If you do not have one, the project still works using the local `data.json` fallback.

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/mdyasar49/mern-portfolio-yasar.git
cd mern-portfolio-yasar
```

---

### Step 2 — Install and Configure the Backend

Go into the server folder and install its dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder with these values:

```
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**What each variable does:**

| Variable | Purpose |
|:---------|:--------|
| `PORT` | The port number the Express server listens on |
| `MONGO_URI` | The connection string for your MongoDB Atlas database |
| `CLIENT_URL` | The React app's URL — used by CORS to allow requests from it |
| `NODE_ENV` | Set to `development` locally, `production` when deployed |

> **No MongoDB Atlas account?** Just leave `MONGO_URI` blank. The server will fail to connect, print a warning, and automatically use `server/data.json` for all data. You will not lose any functionality for local development.

---

### Step 3 — Install and Configure the Frontend

Open a new terminal (keep the server folder separate), then:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:

```
REACT_APP_API_BASE_URL=http://localhost:5001
```

**Why `REACT_APP_` prefix?**

Create React App (CRA) only exposes environment variables that start with `REACT_APP_` to the browser. This is a security rule — it prevents you from accidentally leaking server secrets into the bundled frontend code.

> **Important:** If you change anything in `.env`, you must **stop and restart** `npm start`. React reads `.env` values only at startup and bakes them into the bundle. Changes while running are ignored.

---

## 5. How to Run the Project (Day to Day)

You must run **two terminals at the same time**. The backend and frontend are separate processes.

### Terminal 1 — Start the Backend Server

```bash
cd server
npm run dev
```

This runs the server with `nodemon`, which automatically restarts it whenever you save a file. You should see:

```
[Server] Listening on port 5001
[MongoDB] Connected to Atlas
```

Or if MongoDB is unavailable:

```
[Server] Listening on port 5001
[MongoDB] Offline. Using local data.json fallback.
```

---

### Terminal 2 — Start the React Frontend

```bash
cd client
npm start
```

React compiles the app and opens it in your browser automatically:

```
Compiled successfully!
Local:  http://localhost:3000
```

Once both are running, open **http://localhost:3000**. The React app will call `http://localhost:5001/api/profile` in the background and load all the portfolio data.

---

## 6. What Each Important File Does

### Backend (`server/`)

| File | What it does |
|:-----|:-------------|
| `index.js` | Entry point. Starts the Express server, connects to MongoDB. |
| `app.js` | Sets up Express: registers middleware (CORS, JSON parsing, logging) and mounts routes. |
| `routes/portfolioRoutes.js` | Maps API URLs to controller functions. |
| `controllers/portfolioController.js` | Contains the actual logic: fetch from MongoDB or fall back to `data.json`. |
| `models/` | Mongoose schemas — defines the structure of documents stored in MongoDB. |
| `middleware/` | Custom middleware: request logger, CORS handler, error handler. |
| `config/db.js` | Handles the MongoDB Atlas connection with error handling. |
| `data.json` | Static copy of portfolio data. Used when MongoDB is offline. |
| `stats.json` | Tracks visitor count locally when MongoDB is offline. |
| `.env` | Secret config values (not committed to Git). |

### Frontend (`client/`)

| File | What it does |
|:-----|:-------------|
| `src/index.js` | Entry point. Mounts the React app into `public/index.html`. |
| `src/App.js` | Sets up React Router — maps URLs to page components. |
| `src/config.js` | Reads the backend API URL from `.env` and exports it. |
| `src/services/` | Axios functions that call the backend. Used by pages and hooks. |
| `src/pages/` | Full-page components: Portfolio, Resume, Documentation. |
| `src/components/` | Reusable UI pieces: Navbar, skill cards, project cards, etc. |
| `src/theme/` | MUI (Material UI) dark theme configuration. |
| `.env` | Frontend-specific config (API URL). Not committed to Git. |

---

## 7. The Hybrid Data Strategy (MongoDB + JSON Fallback)

The backend is designed to never crash the portfolio, even if MongoDB goes offline.

```
Server starts
    │
    ▼
Tries to connect to MongoDB Atlas
    │
    ├── SUCCESS → All data requests go to MongoDB
    │
    └── FAILED (wrong URI / no internet / Atlas free tier sleeping)
              │
              ▼
         Falls back to server/data.json
         → All API responses still work
         → Visitor count is saved to stats.json locally
         → Portfolio is 100% functional
```

**Why this matters:** MongoDB Atlas free tier clusters go to sleep after 5 minutes of inactivity. Without a fallback, the portfolio would show a blank page when a recruiter visits. With the fallback, it always works.

---

## 8. CORS — Why It Is Configured and What It Does

CORS (Cross-Origin Resource Sharing) is a browser security rule. If the React app (at `localhost:3000`) tries to call an API at a different origin (`localhost:5001`), the browser blocks it — unless the server explicitly allows it.

I configured CORS in `server/app.js` to only allow requests from known frontend origins:

```js
const allowedOrigins = [
    'http://localhost:3000',   // Local development
    process.env.CLIENT_URL     // Production deployed frontend
];
```

This means:
- React app at `localhost:3000` → ✅ Allowed
- Someone else's website trying to call my API → ❌ Blocked
- Postman or curl (server-to-server) → ✅ Allowed (no browser CORS restriction)

---

## 9. How the Resume PDF Generation Works

The Resume page generates a downloadable PDF entirely inside the browser — no server involved.

```
1. React fetches profile data from /api/profile
2. The Resume component renders a hidden, print-optimized HTML template
3. The user clicks "Download PDF"
4. html2pdf.js captures the rendered HTML as a canvas image
5. It converts the canvas to a PDF
6. The browser triggers a file download as "resume.pdf"
```

Custom `@media print` CSS ensures the PDF uses A4 dimensions and clean typography. Because it is generated from real data fetched from the API, updating the portfolio updates the resume automatically.

---

## 10. Development Workflow — How to Add New Content

### Adding a New Section to the Portfolio

1. **Add the data** → Update `server/data.json` (and your MongoDB document if connected)
2. **Add a route** (if needed) → `server/routes/portfolioRoutes.js`
3. **Add controller logic** (if needed) → `server/controllers/portfolioController.js`
4. **Add the service call** → `client/src/services/portfolioService.js`
5. **Build the UI component** → `client/src/components/`
6. **Use it in a page** → `client/src/pages/Portfolio.js`

### Common Issues and How to Fix Them

| Problem | What to Check |
|:--------|:--------------|
| API call fails with "Network Error" | Is the backend (`npm run dev`) running in the `server/` folder? Is something else using port 5001? |
| React shows no data | Open browser DevTools (F12) → Console tab. Check for errors. |
| `REACT_APP_API_BASE_URL` is undefined | Is `client/.env` created? Did you restart `npm start` after creating it? |
| MongoDB says offline | Is `MONGO_URI` in `server/.env` correct? The portfolio will still work via fallback. |
| CORS error in browser | Is `CLIENT_URL` in `server/.env` set to the correct frontend URL? |

---

## 11. What I Plan to Add Next

These are features I plan to build myself as I continue improving this project:

| Feature | Status | Plan |
|:--------|:-------|:-----|
| Admin Panel | Planned | A protected UI to edit portfolio content without touching `data.json` directly |
| Analytics Dashboard | Planned | Visualize visitor count over time with a chart |
| Dark / Light Toggle | Planned | Let the user switch between dark and light mode |
| Contact Form | Planned | Allow visitors to send me a message directly from the portfolio |

---

*This project was built by me — **A. Mohamed Yasar** — to learn full-stack development with the MERN stack and to understand how real-world projects are structured.*

**GitHub:** [@mdyasar49](https://github.com/mdyasar49)
