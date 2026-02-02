# Sydney Event Platform

A complete MERN stack application for scraping, managing, and viewing Sydney events.

## Features
- **Public Interface**: Browse events, search/filter, and "Get Tickets" (Email capture).
- **Admin Dashboard**: Google OAuth login, data table, status management (New/Updated/Inactive), and manual scrape trigger.
- **Scraper Service**: Automated Playwright scraper for Sydney events, running daily via Cron or manually via Dashboard.

## Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas URI)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory with the following:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/sydney_events
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     SESSION_SECRET=your_secret_key
     CLIENT_URL=http://localhost:5173
     ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

## Running the Application

1. **Start Backend**
   ```bash
   # From root/server
   npm start 
   # or node index.js
   ```

2. **Start Frontend**
   ```bash
   # From root/client
   npm run dev
   ```

3. **Access**
   - Public: `http://localhost:5173`
   - Admin: `http://localhost:5173/login`

## Deployment
- Backend: Render/Heroku/Railway
- Frontend: Vercel/Netlify
- Database: MongoDB Atlas
