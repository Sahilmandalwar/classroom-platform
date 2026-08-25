# 🎓 Classroom Platform

A full-stack classroom management platform designed to bring students and instructors into one place for managing classrooms, announcements, sessions, notes, attendance, notifications, and real-time communication.

Built with the **MERN stack** with real-time features powered by **Socket.IO**.

## ✨ Features

* 🔐 **Authentication & Authorization**

  * JWT-based authentication
  * Password hashing with bcrypt
  * Protected routes
  * Role-based access control

* 🏫 **Classroom Management**

  * Create and manage classrooms
  * Add students to classrooms
  * View classroom-specific information

* 📢 **Announcements**

  * Create classroom announcements
  * Students can view announcements relevant to their classrooms

* 📅 **Sessions**

  * Create and manage classroom sessions
  * Students can view upcoming sessions

* 📝 **Notes & Resources**

  * Upload and manage classroom notes
  * Cloud-based file storage using Cloudinary

* 📊 **Attendance**

  * Record and manage student attendance
  * View attendance information for classroom sessions

* 🔔 **Notifications**

  * Classroom activity notifications
  * Real-time notification delivery

* 💬 **Real-Time Chat**

  * Real-time communication using Socket.IO
  * User-specific Socket.IO rooms

* ⚡ **Real-Time Updates**

  * Instant updates for supported classroom activities
  * WebSocket-based communication with Socket.IO

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* React Query
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Socket.IO

### Cloud & Deployment

* MongoDB Atlas
* Cloudinary
* Render
* Vercel

## 🏗️ Architecture

The application follows a client-server architecture:

```text
                    ┌──────────────────┐
                    │     React UI     │
                    │ Vite + Tailwind  │
                    └────────┬─────────┘
                             │
                      HTTP / WebSocket
                             │
              ┌──────────────▼──────────────┐
              │       Express Backend       │
              │                             │
              │ Routes → Controllers        │
              │          → Services         │
              └───────┬───────────┬─────────┘
                      │           │
                ┌─────▼─────┐ ┌──▼──────────┐
                │ MongoDB   │ │  Socket.IO  │
                │  Atlas    │ │ Real-time   │
                └───────────┘ └─────────────┘
                      │
                ┌─────▼──────┐
                │ Cloudinary │
                │   Storage  │
                └────────────┘
```

## 📁 Project Structure

```text
AI-Classroom/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   │
│   └── package.json
│
└── README.md
```

## 🔄 Authentication Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Express API
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Client stores authentication state
 │
 ▼
Protected API Requests
```

Passwords are securely hashed using **bcrypt**, while JWTs are used to authenticate protected API requests.

## ⚡ Real-Time Communication

The platform uses **Socket.IO** for real-time functionality.

Users are connected to user-specific Socket.IO rooms, allowing the server to send targeted events such as:

* Notifications
* Chat messages
* Classroom activity updates

```text
Client A
   │
   │ Socket.IO
   ▼
┌───────────────┐
│ Node + Socket │
│      .IO      │
└───────┬───────┘
        │
        ├──────────► User A Room
        │
        ├──────────► User B Room
        │
        └──────────► User C Room
```

## 📦 File Upload Flow

Files such as classroom notes are handled through the backend and uploaded to Cloudinary.

```text
React Client
     │
     ▼
   Multer
     │
     ▼
Express API
     │
     ▼
Cloudinary
     │
     ▼
File URL stored in MongoDB
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sahilmandalwar/classroom-platform.git
cd classroom-platform
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd ../client
npm install
```

Create the required frontend environment variables and start the development server:

```bash
npm run dev
```

The application should now be available through the Vite development server.

## 🔒 Security

The application includes several security measures:

* Password hashing using bcrypt
* JWT-based authentication
* Protected API routes
* Authorization checks for classroom resources
* Input validation on API requests
* File upload restrictions
* Environment variables for sensitive configuration

## 🌐 Deployment

The application was designed with separate frontend and backend deployments:

```text
                    Internet
                       │
          ┌────────────┴────────────┐
          │                         │
       Vercel                    Render
          │                         │
     React Client            Express Server
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                    MongoDB Atlas          Cloudinary
```

## 🎯 What I Learned

This project helped me understand how a real-world full-stack application is structured beyond basic CRUD operations.

Key areas I worked with:

* Designing REST APIs
* JWT authentication and authorization
* MongoDB schema design with Mongoose
* React application architecture
* State and server-state management
* File uploads and cloud storage
* WebSocket communication with Socket.IO
* Protected frontend routes
* Backend middleware
* Deployment of frontend and backend separately


## 👨‍💻 Author

**Sahil Mandalwar**

B.Tech | Mathematics & Computing
NIT Kurukshetra

---

