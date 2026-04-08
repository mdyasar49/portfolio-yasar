# 💎 Luxury MERN Stack Portfolio - A. Mohamed Yasar

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)
[![Render](https://img.shields.io/badge/Deployment-Render-green.svg)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A ultra-premium, recruiter-focused portfolio application designed with high-end aesthetics and modern engineering principles. This project showcases a full-stack implementation with a focus on immersive user experience (UX) and robust data management.

---

## 🔗 Live Demo & Links

- **🚀 Live Portfolio:** [https://mern-portfolio-yasar-1.onrender.com](https://mern-portfolio-yasar-1.onrender.com)
- **⚡ Backend API:** [https://mern-portfolio-yasar.onrender.com/api/profile](https://mern-portfolio-yasar.onrender.com/api/profile)

---

## ✨ Premium Features

- **🌀 3D Parallax Resume Engine:** An interactive, motion-driven resume previewer built with Framer Motion and custom CSS architecture.
- **🌒 Glassmorphic UI:** Deeply integrated theme with glassmorphism effects, vibrant gradients, and premium Material UI components.
- **📊 Dynamic Data Orchestration:** Content is served dynamically via a RESTful API, allowing for real-time updates without redeployment.
- **📱 Fluid Responsiveness:** Meticulously crafted for all screen sizes, from mobile devices to 4K monitors.
- **🛡️ Secure Communication:** Integrated contact form with backend validation and automated messaging logic.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **React.js 18:** Component-based architecture.
- **Material UI (MUI):** Premium component library.
- **Framer Motion:** High-end animations and 3D transitions.
- **Vite:** Next-generation frontend tooling for lightning-fast HMR.

### Backend (Server)
- **Node.js & Express.js:** Fast, unopinionated web framework.
- **MongoDB & Mongoose:** Scalable NoSQL database layer with structured schema.
- **Axios:** For seamless API handling.

---

## 📁 Repository Structure

```text
├── client/              # React + Vite Frontend
│   ├── src/             # Source files
│   ├── public/          # Static assets (including Resume HTML)
│   └── .env             # Environment configuration
├── server/              # Node.js + Express Backend
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # API Endpoints
│   ├── data.json        # Fallback/Seed data
│   └── index.js         # Entry point
└── README.md            # Documentation
```

---

## 🚀 Local Development

### 1. Clone & Install
```bash
git clone https://github.com/mdyasar49/mern-portfolio-yasar.git
cd mern-portfolio-yasar
```

### 2. Backend Setup
```bash
cd server
npm install
# Create .env with: PORT=5001, MONGO_URI=your_mongodb_uri
npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install
# Create .env with: VITE_API_BASE_URL=http://localhost:5001/api
npm run dev
```

---

## 👤 Author

**A. Mohamed Yasar**
*Full-Stack Engineer | React.js Specialist*

- **LinkedIn:** [Mohamed Yasar](https://linkedin.com/in/mohamed-yasar-4674ba223)
- **GitHub:** [@mdyasar49](https://github.com/mdyasar49)

---
Developed with ✨ by A. Mohamed Yasar
