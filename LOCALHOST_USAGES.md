# Localhost and Backend URL Usages

This file lists all locations in the codebase where `localhost` is used, specifically highlighting where the Backend URL is referenced.

## Backend URL (`https://sydney-events-backend-lyuu.onrender.com`)
These are the places where the frontend connects to the backend API.

- **`client/src/api.js`** // https://sydney-events-backend-lyuu.onrender.com
  - Line 5: `baseURL: 'https://sydney-events-backend-lyuu.onrender.com',`
  
- **`client/src/pages/Login.jsx`** // https://sydney-events-backend-lyuu.onrender.com
  - Line 7: `window.location.href = 'https://sydney-events-backend-lyuu.onrender.com/auth/google';` (Google OAuth login)

- **`client/src/components/Layout.jsx`** // https://sydney-events-backend-lyuu.onrender.com
  - Line 25: `window.location.href = 'https://sydney-events-backend-lyuu.onrender.com/auth/logout';` (Logout redirect)

## Frontend URL (`https://sydney-events-zeta.vercel.app`)
These are places where the backend refers to the frontend (e.g., for CORS or redirects).

- **`server/index.js`**
  - Line 22: `app.use(cors({ origin: process.env.CLIENT_URL || 'https://sydney-events-zeta.vercel.app', credentials: true }));`

- **`server/routes/authRoutes.js`**
  - Line 14: `res.redirect(\`${process.env.CLIENT_URL || 'https://sydney-events-zeta.vercel.app'}/admin/dashboard\`);`
  - Line 22: `res.redirect(process.env.CLIENT_URL || 'https://sydney-events-zeta.vercel.app');`

## MongoDB (`mongodb://localhost:27017`)
Database connection strings.

- **`server/fix-indexes.js`**
  - Line 9: `await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sydney_events');`

- **`server/services/eventbrite.scraper.js`**
  - Line 13: `await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sydney_events');`

## Documentation
- **`README.md`**: Contains setup instructions with default environment variables.
