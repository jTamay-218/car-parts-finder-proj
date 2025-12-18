# Frontend Deployment Setup

## Environment Variables for Production

After deploying to Render, you need to configure the backend API URL.

### Option 1: Using Render Environment Variables (Recommended)

In your Render dashboard for the frontend service:

1. Go to **Environment** tab
2. Add this environment variable:
   ```
   VITE_API_URL=https://your-backend-service.onrender.com
   ```
3. Save and redeploy

### Option 2: Using .env.production file

Create a `.env.production` file in the frontend directory (not committed to git):

```bash
# .env.production
VITE_API_URL=https://car-parts-finder-backend.onrender.com
```

## API Configuration

The frontend now uses a centralized API configuration file at `src/config/api.js`.

This file reads from `import.meta.env.VITE_API_URL` and falls back to `http://localhost:3001` for local development.

## Update Instructions After Backend Deployment

1. Deploy your backend first
2. Copy the backend URL from Render (e.g., `https://car-parts-finder-backend-xxxx.onrender.com`)
3. Update the `VITE_API_URL` environment variable in Render
4. Trigger a manual redeploy of the frontend

## Local Development

For local development, you can create a `.env` file:

```bash
# .env (for local development)
VITE_API_URL=http://localhost:3001
```

If not specified, it will default to `http://localhost:3001`.

