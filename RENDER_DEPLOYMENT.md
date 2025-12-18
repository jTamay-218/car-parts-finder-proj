# Render Deployment Guide

## Prerequisites
- GitHub account with your repository
- Render account (sign up at https://render.com)
- Supabase account (for database and file storage)

## Option 1: Deploy Using render.yaml (Recommended)

1. **Connect to Render**
   - Go to https://render.com/dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository: `jTamay-218/car-parts-finder-proj`
   - Render will automatically detect the `render.yaml` file

2. **Configure Environment Variables**
   
   After deployment is initiated, you'll need to add these secret environment variables in the Render dashboard:

   **For Backend Service:**
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
     - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres`
     - Find this in Supabase: Project Settings → Database → Connection String → URI
   
   - `SUPABASE_URL`: Your Supabase project URL
     - Find in: Supabase Project Settings → API → Project URL
   
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - Find in: Supabase Project Settings → API → Project API keys → `anon` `public`

3. **Update Frontend API URL**
   
   After backend is deployed, update the frontend to use the backend URL:
   - Get your backend URL from Render (e.g., `https://car-parts-finder-backend.onrender.com`)
   - Update `frontend/src/App.jsx` or create `frontend/.env.production`:
     ```
     VITE_API_URL=https://car-parts-finder-backend.onrender.com
     ```

4. **Redeploy Frontend**
   - After updating the API URL, trigger a manual redeploy of the frontend service

## Option 2: Manual Deployment

### Step 1: Deploy Backend

1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `car-parts-finder-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<your-supabase-connection-string>
   JWT_SECRET=<generate-a-strong-secret>
   JWT_EXPIRES_IN=7d
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>
   FRONTEND_URL=https://car-parts-finder-frontend.onrender.com
   MAX_FILE_SIZE=5242880
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. Click "Create Web Service"

### Step 2: Deploy Frontend

1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: `car-parts-finder-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=<your-backend-url-from-step-1>
   ```

5. Click "Create Static Site"

## Step 3: Update CORS Settings

After both services are deployed, update the backend's CORS settings:

1. Go to your backend service in Render
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Trigger a manual redeploy

## Step 4: Database Setup (Supabase)

1. Go to your Supabase project dashboard
2. Go to SQL Editor
3. Run the schema from `backend/schema.sql`
4. Run the seed data from `backend/add_sample_data.sql`
5. Set up Storage bucket for product images:
   - Go to Storage
   - Create a new bucket called `product-images`
   - Make it public
   - Set appropriate policies

## Important Notes

### Free Tier Limitations
- Backend will spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month of usage (shared across services)

### SSL/HTTPS
- Render automatically provides SSL certificates
- Your services will be accessible via HTTPS

### Custom Domain (Optional)
- Go to service settings → Custom Domains
- Add your domain and follow DNS configuration instructions

### Monitoring
- View logs in real-time from the Render dashboard
- Set up email alerts for deployment failures

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure DATABASE_URL is valid

### Frontend can't connect to backend
- Check browser console for CORS errors
- Verify FRONTEND_URL in backend matches actual frontend URL
- Verify VITE_API_URL in frontend points to backend

### Database connection issues
- Test your Supabase connection string locally first
- Ensure Supabase project is not paused
- Check if you need to enable IPv6 in Supabase settings

## Post-Deployment Checklist

- [ ] Backend service is running and healthy
- [ ] Frontend is accessible
- [ ] API calls from frontend to backend work
- [ ] Database queries are successful
- [ ] Image uploads to Supabase work
- [ ] Authentication works correctly
- [ ] CORS is configured properly

## Useful Links

- Backend URL: `https://car-parts-finder-backend.onrender.com`
- Frontend URL: `https://car-parts-finder-frontend.onrender.com`
- Render Dashboard: https://dashboard.render.com
- Supabase Dashboard: https://app.supabase.com

## Support

If you encounter issues:
1. Check Render logs (Dashboard → Service → Logs)
2. Check browser console for frontend errors
3. Review Supabase logs for database issues
4. Consult Render documentation: https://render.com/docs

