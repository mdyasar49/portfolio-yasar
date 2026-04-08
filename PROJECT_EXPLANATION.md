# 🚀 MERN Stack Project Architecture & Workflow

This document explains how the **Backend** and **Frontend** are connected and how the overall application works.

---

## 🏗️ 1. Project Architecture (MERN)
The project is built using the **MERN Stack**:
- **M**ongoDB: NoSQL Database to store your resume/portfolio data.
- **E**xpress.js: Backend framework to create APIs.
- **R**eact.js: Frontend library for the User Interface.
- **N**ode.js: The runtime environment that runs the backend.

---

## 🔗 2. How Backend and Frontend Connect?

The connection between the two layers happens via **REST API** calls using **Axios**.

### A. The Backend Side (The Provider)
1. **Model**: `Profile.js` defines what a "Profile" looks like in MongoDB.
2. **Controller**: `portfolioController.js` fetches the data from MongoDB (or `data.json` as a fallback).
3. **Route**: `portfolioRoutes.js` exposes this logic at the URL: `http://localhost:5001/api/profile`.

### B. The Frontend Side (The Consumer)
1. **Service Layer**: In `client/src/services/api.js`, we use **Axios** to send a "GET" request to the Backend URL.
2. **Custom Hook**: In `client/src/hooks/useProfile.js`, we call that service. This hook manages the loading state and stores the data in React's memory.
3. **Component**: `App.js` uses the hook and passes the data to components like `Hero`, `About`, and `Projects`.

---

## 🛠️ 3. How the Project Works (Step-by-Step)

### Step 1: Data Seeding
- You run `node seed.js`.
- It reads your info from `data.json` and pushes it into **MongoDB Atlas**.

### Step 2: Backend Start
- Node.js starts the server (`index.js`).
- Express listens for requests on port `5001`.

### Step 3: Frontend Start
- React starts on port `3000`.
- As soon as the page loads, the `useProfile` hook triggers.

### Step 4: Data Fetching (The Handshake)
- The Frontend asks: *"Hey Backend, give me the profile data!"*
- The Backend checks MongoDB.
- MongoDB sends the data back to the Backend.
- The Backend sends a JSON response to the Frontend.

### Step 5: Rendering
- React receives the JSON data.
- It automatically updates the UI components using **Material UI** and **Framer Motion** animations.

---

## 📁 Key Folder Structure
- `/server/routes`: Defines the API paths.
- `/server/controllers`: Contains the brain/logic.
- `/client/src/services`: Handles the connection to the server.
- `/client/src/hooks`: Keeps the code clean by separating logic from UI.

---

**Summary**: The **Backend** is the "Brain" that manages data, and the **Frontend** is the "Face" that shows it to the user. They talk to each other through the **API** bridge.
