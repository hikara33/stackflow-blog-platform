# MERN Blog Platform

A fullstack blog platform built with the **MERN stack**.  
This project was created as a pet project to practice real-world fullstack development, authentication, and access control.

---

## 🚀 Tech Stack

### Frontend
- React
- TypeScript
- Redux Toolkit
- React Router
- Material UI
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT (Access & Refresh tokens)
- Multer (file uploads)
- bcrypt

---

## ✨ Features

### Authentication & Users
- User registration and login
- JWT authentication (access + refresh tokens)
- Secure logout
- Profile page
- Profile editing (avatar, bio, website, location)
- Avatar upload

### Posts
- Create, edit, delete posts
- Markdown support
- Post images
- Tags
- Views counter
- Popular tags

### Comments
- Add comments to posts
- Edit own comments
- Delete own comments or comments on own post
- Comments counter per post
- User comments block

### Access Control
- Only owners can edit/delete their posts
- Only comment owners can edit comments
- Post owners can delete comments under their posts

---

## 🗂 Project Structure

mern-blog-platform/
├── client/ # React + TypeScript frontend
├── server/ # Node.js + Express backend
├── README.md
└── .gitignore

---

## 🔐 Authentication Flow

- Access token stored in `localStorage`
- Refresh token stored in **httpOnly cookies**
- Automatic token refresh on page reload

---

## 📦 Environment Variables

### Backend (`server/.env`)
```env
PORT=your_port
DB_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
API_URL=http://localhost:PORT
CLIENT_URL=http://localhost:front_port
```
---

## 🧪 Planned Features

- Admin panel
- User roles (admin / user)
- Post moderation
- Comment moderation
- Post drafts
- Search and filtering