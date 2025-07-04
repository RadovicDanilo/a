# CollabDraw - Collaborative Pixel Art Platform

**CollabDraw** is a full-stack collaborative pixel art drawing platform built with a modern TypeScript-based tech stack. It supports real-time multi-user interaction on shared canvases, along with robust authentication, picture saving, editing, gallery browsing, and more.

---

## 🚀 Overview

CollabDraw enables users to:

* 🔐 **Register/Login** with JWT-based authentication
* 🖼️ **View and filter a public gallery** of pixel art images
* 📝 **Draw on a pixel-based canvas** with color and eraser tools
* 💾 **Save, update, or delete drawings** with fine-grained access control
* 👥 **Collaborate in real time** with other users on the same drawing
* 📐 **Resize canvas** dynamically without losing existing content

The platform follows a clear separation of concerns:

| Component            | Tech Stack                              | Description                                                    |
| -------------------- | --------------------------------------- | -------------------------------------------------------------- |
| **Frontend**         | Vue 3, TypeScript, Pinia, Vue Router    | SPA for drawing, viewing, editing, and navigating UI           |
| **Backend**          | Node.js, TypeScript, Express, WebSocket | RESTful API + WebSocket server for collaboration & persistence |
| **Database**         | PostgreSQL                              | Stores user accounts and drawings                              |
| **Containerization** | Docker, Docker Compose                  | Ensures consistent multi-service deployment                    |

---

## 🔌 API Routes Summary

### 🧑‍💼 Auth

| Method | Route          | Description                  |
| ------ | -------------- | ---------------------------- |
| POST   | /auth/login    | Login with username/password |
| POST   | /auth/register | Create new user              |

### 🖼️ Pictures

| Method | Route                 | Description                      |
| ------ | --------------------- | -------------------------------- |
| POST   | /pictures/            | Save a new drawing               |
| GET    | /pictures/            | List all drawings (with filters) |
| GET    | /pictures/\:pictureId | Get specific drawing by ID       |
| PATCH  | /pictures/\:pictureId | Update existing drawing          |
| DELETE | /pictures/\:pictureId | Delete a drawing (author only)   |

---

## 🐳 How to Run with Docker

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/collabdraw.git
   cd collabdraw
   ```

2. **Create `.env` file** in root with:

   ```env
   NODE_ENV=development
   DB_TYPE=postgres
   DB_HOST=db
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=mydatabase
   ```

3. **Run the application:**

   ```bash
   docker-compose up --build
   ```

4. **Access:**

   * Frontend: [http://localhost:8080](http://localhost:8080)
   * Backend: [http://localhost:3000](http://localhost:3000)
   * PostgreSQL: localhost:5432

---

## 🛠️ Technologies Used

### Frontend

* **Vue 3** + Composition API
* **TypeScript**
* **Pinia** (for state management)
* **Vue Router** (for navigation)
* **CSS / Custom styling**

### Backend

* **Node.js** + **Express**
* **TypeScript**
* **WebSocket (ws)** for real-time collaboration
* **Zod** for validation
* **JWT** for secure auth

### Infrastructure

* **PostgreSQL 15** as the relational database
* **Docker & Docker Compose** for orchestration

### Dev Tools & Patterns

* Full **RESTful API**
* **Environment configuration** via `.env`
* **Real-time synchronization** with WebSocket protocol
* **Token-based authentication** (Bearer JWT)

---

## 📌 Key Features Summary

* 🔐 Secure registration & login with password validation
* 🖌️ Drawing tools: pencil, color picker, eraser, resizer
* 👨‍👩‍👧‍👦 Real-time shared canvas editing (multi-user)
* 📸 Full gallery with pagination & filtering by author
* 🗑️ Editing & deletion of owned drawings
* 📦 Fully Dockerized development & deployment
