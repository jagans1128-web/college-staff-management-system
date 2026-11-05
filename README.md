# College Staff Management System

A full-stack web application designed for managing college staff activities, documents, and administration.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Axios, React Router
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt
- **Document Generation**: docx, pptxgenjs, multer

## Project Structure
```
college-staff-management/
├── client/          # Vite + React Frontend
└── server/          # Express + Node.js Backend API
```

## Getting Started

### 1. Server Setup
```bash
cd server
npm install
# Create .env based on .env.example
# Add your MONGO_URI and JWT_SECRET
npm run dev # or npm start
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

## Production & Hosting
- **Frontend**: Deploy on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: Deploy on [Render](https://render.com) or [Railway](https://railway.app)
- **Database**: Cloud MongoDB with [MongoDB Atlas](https://www.mongodb.com/atlas)
