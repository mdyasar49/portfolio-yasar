# 🏗️ Project Explanation — MERN Elite Portfolio v2.0

> **இந்த document பத்தி:** இந்த portfolio project-ஐ **நான் (Yasar) personally build பண்ணினேன்** — MERN Stack கத்துக்கணும்னு ஆரம்பிச்சு, real-world full-stack architecture follow பண்ணி develop பண்ணேன். இங்க — இந்த project-ஐ எப்படி install பண்றது, frontend & backend எப்படி connect ஆகுது, ஏன் இந்த structure use பண்ணினேன் — எல்லாத்தையும் explain பண்றேன்.

---

## 1. 🧩 Why Two Separate Projects? (ஏன் இரண்டு தனி folders?)

இந்த portfolio-ல **`client/`** (React) மற்றும் **`server/`** (Node/Express) என்று **இரண்டு தனி projects** இருக்கு — இரண்டும் தனித்தனியா run ஆகும், தனித்தனியா deploy ஆகும்.

நான் இந்த structure-ஐ follow பண்ணதுக்கு reason:

| Simple HTML Approach | MERN Stack (இந்த project) |
|:---------------------|:--------------------------|
| HTML files browser-ல directly open ஆகும் | React browser-ல run ஆகும் (port 3000) |
| No backend needed | Express server separately run ஆகும் (port 5001) |
| Data is hardcoded in HTML | Data MongoDB-ல இருக்கும், API வழியா வருது |
| Single file, no separation | Clean separation: UI logic vs data logic |

**ஏன் இப்படி பண்ணினேன்?**
- Frontend-ஐ மட்டும் update பண்ண backend-ஐ touch பண்ண வேண்டியதில்லை.
- Backend-ஐ மட்டும் change பண்ண frontend-ஐ touch பண்ண வேண்டியதில்லை.
- Companies-ல இப்படித்தான் build பண்றாங்க — இதை நேரடியா practice பண்றதுக்காக இந்த structure follow பண்ணினேன்.

---

## 2. 🔗 How Frontend & Backend Connect — Full Flow

```
User
     │
     │  Browser-ல http://localhost:3000 திறக்கிறான்
     ▼
┌──────────────────────────────┐
│     React App (client/)      │  ← Port 3000
│                              │
│  useEffect() runs on load    │
│  → calls portfolioService.js │
│  → axios.get("/api/profile") │
└──────────┬───────────────────┘
           │
           │  HTTP GET Request
           │  http://localhost:5001/api/profile
           │
           ▼
┌──────────────────────────────┐
│  Express Server (server/)    │  ← Port 5001
│                              │
│  app.js → portfolioRoutes.js │
│  → portfolioController.js    │
└──────────┬───────────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
MongoDB      data.json
(if online)  (if offline)
     │           │
     └─────┬─────┘
           │
           │  JSON Response
           ▼
┌──────────────────────────────┐
│     React App (client/)      │
│  setState(data)              │
│  → UI updates with new data  │
└──────────────────────────────┘
```

---

## 3. 📁 What Each File Does

### Backend (`server/`) Files

#### `index.js` — Entry Point
Server-ஐ start பண்றது — `.env` load பண்றது, MongoDB connect பண்றது, port-ல listen பண்றது.

#### `app.js` — Express Configuration
All middlewares & routes register பண்றது — CORS security, JSON parsing, route mounting.

#### `routes/portfolioRoutes.js` — URL Mapping
```javascript
router.get('/profile', portfolioController.getProfile);
// GET /api/profile → getProfile() function call ஆகும்

router.get('/visitors', portfolioController.getVisitors);
// GET /api/visitors → getVisitors() function call ஆகும்
```

#### `controllers/portfolioController.js` — Business Logic
Actual data fetch பண்றது இங்கதான் நடக்கும் — MongoDB connected-ஆ இருந்தா database, இல்லன்னா `data.json`.

#### `data.json` — Local Fallback
MongoDB இல்லாம use பண்ண — portfolio info இங்க hardcoded-ஆ இருக்கு.

---

### Frontend (`client/`) Files

#### `src/config.js` — API URL Configuration
```javascript
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// → "http://localhost:5001" (development)
// → "https://your-api.onrender.com" (production)
```

#### `src/App.js` — Router Setup
```javascript
<Routes>
  <Route path="/"       element={<Portfolio />} />
  <Route path="/resume" element={<Resume />} />
  <Route path="/docs"   element={<Documentation />} />
</Routes>
```

#### `src/services/` — API Call Functions
```javascript
export const getProfile  = () => axios.get(`${API_BASE_URL}/api/profile`);
export const getVisitors = () => axios.get(`${API_BASE_URL}/api/visitors`);
```

---

## 4. 🛡️ Security — CORS Explained

**CORS** — என்னோட API-ஐ யாரு call பண்ணலாம்னு control பண்றது.

```javascript
const allowedOrigins = [
    'http://localhost:3000',   // Dev-ல என்னோட React app
    process.env.CLIENT_URL     // Production-ல deployed React app
].filter(Boolean);
```

- **`http://localhost:3000`** (என்னோட React) → ✅ Allowed
- **Direct browser access** to `/api/...` → ❌ Blocked
- **Other websites** calling the API → ❌ Blocked

---

## 5. 🗄️ Hybrid Data Strategy — MongoDB + JSON Fallback

```
Server Starts
     │
     ▼
Try connecting to MongoDB Atlas
     │
     ├── ✅ Connected → All data from MongoDB
     │
     └── ❌ Failed (wrong URI / no internet / free tier sleeping)
               │
               ▼
         Falls back to server/data.json
         → Portfolio still works 100%
         → Visitor count saved to stats.json locally
```

MongoDB Atlas free tier sleep ஆகும் — அதனால இந்த fallback strategy use பண்ணினேன், portfolio always online-ஆ இருக்கணும்னு.

---

## 6. 🌐 Environment Variables — Why They Matter

### Backend `server/.env`
```bash
PORT=5001
MONGO_URI=mongodb+...
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend `client/.env`
```bash
REACT_APP_API_BASE_URL=http://localhost:5001
```

> **`REACT_APP_` prefix ஏன்?** Create React App only reads variables that start with `REACT_APP_`. இது security feature — server secrets browser-ல expose ஆகாம இருக்க.

> **⚠️ Important:** `.env` change பண்ணா `npm start` restart பண்ணணும். React .env values-ஐ build time-ல bake பண்றது.

---

## 7. 📐 Full Architecture Diagram

```
    ┌─────────────────────────────────────────────────────────┐
    │                   CLIENT  (port 3000)                   │
    │                                                         │
    │   src/index.js     ← App mount point                   │
    │   src/App.js       ← React Router (page routing)       │
    │   src/config.js    ← Reads API URL from .env           │
    │   src/services/    ← Axios calls to backend            │
    │   src/pages/       ← Portfolio, Resume, Documentation  │
    │   src/components/  ← Navbar, Cards, Sections, etc.     │
    └───────────────────────────┬─────────────────────────────┘
                                │
                    HTTP Request (Axios)
                    GET /api/...
                                ▼
    ┌─────────────────────────────────────────────────────────┐
    │                  SERVER  (port 5001)                    │
    │                                                         │
    │   index.js         ← Start server, connect DB          │
    │   app.js           ← Express setup, CORS, routes       │
    │   routes/          ← URL → Controller mapping          │
    │   controllers/     ← Business logic, data fetching     │
    │   models/          ← Mongoose schemas                  │
    │   middleware/      ← CORS, logger, error handler       │
    │                                                         │
    │        ┌─────────────────────────────┐                 │
    │        │  MongoDB Atlas  │ data.json │                 │
    │        │   (primary)     │ (fallback)│                 │
    │        └─────────────────────────────┘                 │
    └─────────────────────────────────────────────────────────┘
```

---

## 8. 🚀 Resume Engine — How PDF Works

```
React fetches profile data from /api/profile
         ↓
Renders a print-optimized HTML template
         ↓
html2pdf.js converts it to PDF in the browser
         ↓
Auto-downloads as "resume.pdf"
```

Server involvement இல்லை — 100% client-side generation. Custom `@media print` CSS-ஐ use பண்ணி A4 layout சரியா வருது.

---

## 9. 📦 Debugging Common Issues

| Problem | Check This |
|:--------|:-----------|
| `REACT_APP_API_BASE_URL is NOT defined` | `client/.env` created-ஆ? `npm start` restart பண்ணினீங்களா? |
| `Network Error` / API not reachable | `server/` folder-ல `npm run dev` running-ஆ? |
| `MongoDB offline, using fallback` | `server/.env`-ல `MONGO_URI` correct-ஆ இருக்கா? |
| Page shows no data | Browser console மற்றும் server terminal check பண்ணுங்க |

---

## 10. 📈 What I Plan to Add Next

இந்த project ongoing-ஆ improve பண்றேன். நான் personally add பண்ண plan பண்றவை:

| Feature | Status | என்ன பண்ண போறேன் |
|:--------|:-------|:------------------|
| Admin Panel | 🔮 Planned | `data.json` edit பண்றதுக்கு பதிலா UI வழியா portfolio content update பண்ண |
| Analytics Dashboard | 🔮 Planned | Visitor count-ஐ chart-ஆ visualize பண்ண |
| Dark/Light Toggle | 🔮 Planned | User-ஆல theme switch பண்ண option |
| Contact Form | 🔮 Planned | Portfolio-ல இருந்தே மக்கள் directly message அனுப்ப |

---

*இந்த project-ஐ நான் — **A. Mohamed Yasar** — personally build பண்ணினேன், MERN Stack கத்துக்கணும்னு ஆசைப்பட்டு.*
*GitHub: [@mdyasar49](https://github.com/mdyasar49)*
