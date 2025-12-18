# 🚀 Quick Start: Deploy to Render

Your code is now on GitHub! Follow these steps to deploy:

## Prerequisites Checklist
- ✅ Code pushed to GitHub: `https://github.com/jTamay-218/car-parts-finder-proj`
- [ ] Render account created (free): https://render.com
- [ ] Supabase account created (free): https://supabase.com

---

## Step 1: Set Up Supabase Database (5 minutes)

1. **Create Supabase Project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Name: `car-parts-finder`
   - Create a strong database password (save it!)
   - Choose a region close to you
   - Click "Create new project"

2. **Set Up Database Schema**
   - Wait for project to finish setting up (~2 minutes)
   - Go to "SQL Editor" in left sidebar
   - Open your project's `backend/schema.sql` file
   - Copy and paste the entire content
   - Click "Run" or press Ctrl+Enter
   - Repeat for `backend/add_sample_data.sql` (optional, for sample data)

3. **Set Up Storage for Images**
   - Go to "Storage" in left sidebar
   - Click "Create a new bucket"
   - Name: `product-images`
   - Make it **Public**
   - Click "Create bucket"
   - Go to bucket → Policies → Add policy
   - Enable public read access

4. **Get Your Database Credentials**
   - Go to "Project Settings" (gear icon) → "Database"
   - Find "Connection String" → "URI"
   - Copy this string (you'll need it for Render)
   - Go to "Project Settings" → "API"
   - Copy your "Project URL" (SUPABASE_URL)
   - Copy your "anon public" key (SUPABASE_ANON_KEY)

---

## Step 2: Deploy to Render Using Blueprint (10 minutes)

### Option A: Automatic Deployment (Recommended)

1. **Connect to Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub account if not already connected
   - Select repository: `jTamay-218/car-parts-finder-proj`
   - Render will detect `render.yaml`
   - Click "Apply"

2. **Add Environment Variables**
   
   After services are created, go to **Backend Service** → "Environment":
   
   ```
   DATABASE_URL = [paste your Supabase connection string]
   SUPABASE_URL = [paste your Supabase project URL]
   SUPABASE_ANON_KEY = [paste your Supabase anon key]
   ```
   
   Click "Save Changes" - backend will automatically redeploy

3. **Update Frontend API URL**
   
   Go to **Frontend Service** → "Environment":
   
   ```
   VITE_API_URL = [paste your backend URL from Render]
   ```
   
   Your backend URL will look like: `https://car-parts-finder-backend.onrender.com`
   
   Click "Save Changes" - frontend will automatically redeploy

4. **Wait for Deployment**
   - Backend: ~5 minutes
   - Frontend: ~3 minutes
   - Check "Logs" tab to monitor progress

### Option B: Manual Deployment

If Blueprint doesn't work, follow the detailed instructions in `RENDER_DEPLOYMENT.md`

---

## Step 3: Verify Deployment (2 minutes)

1. **Test Backend**
   - Open your backend URL: `https://your-backend.onrender.com/api/health`
   - Should see: `{"status": "ok"}` or similar

2. **Test Frontend**
   - Open your frontend URL: `https://your-frontend.onrender.com`
   - Should see your car parts finder homepage
   - Try searching for parts
   - Check browser console for errors (F12)

3. **Test Full Flow**
   - [ ] Homepage loads
   - [ ] Search works
   - [ ] Login works
   - [ ] Can view parts
   - [ ] Can add to cart

---

## Step 4: Update CORS (if needed)

If you get CORS errors in browser console:

1. Go to Backend Service → Environment
2. Update `FRONTEND_URL` to your actual frontend URL
3. Save and wait for redeploy

---

## 🎉 You're Done!

Your app should now be live at:
- **Frontend**: `https://car-parts-finder-frontend.onrender.com`
- **Backend**: `https://car-parts-finder-backend.onrender.com`

---

## ⚠️ Important Notes

### Free Tier Behavior
- Services spin down after 15 mins of inactivity
- First request may take 30-60 seconds (cold start)
- This is normal for free tier!

### Monitoring
- Check logs: Dashboard → Service → Logs
- Set up alerts: Service Settings → Notifications

### Custom Domain (Optional)
- Service Settings → Custom Domains
- Add your domain and follow DNS instructions

---

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check these:
1. Is DATABASE_URL correct?
2. Is Supabase project active?
3. Check backend logs for errors
```

### Frontend Shows Errors
```bash
# Check these:
1. Is VITE_API_URL pointing to backend?
2. Check browser console (F12)
3. Verify backend is running
4. Check for CORS errors
```

### Database Connection Failed
```bash
# Fix:
1. Verify DATABASE_URL in backend environment
2. Check Supabase project status
3. Ensure Supabase is not paused
4. Test connection string locally first
```

---

## 📚 Additional Resources

- Full deployment guide: `RENDER_DEPLOYMENT.md`
- Frontend setup: `frontend/DEPLOYMENT_SETUP.md`
- Render docs: https://render.com/docs
- Supabase docs: https://supabase.com/docs

---

## 💡 Next Steps

After deployment:
1. Test all features thoroughly
2. Update any hardcoded URLs in your code
3. Set up monitoring and alerts
4. Consider upgrading for production (no cold starts)
5. Add custom domain if needed

---

**Need help?** Check the logs first:
- Render: Dashboard → Service → Logs
- Browser: F12 → Console tab
- Supabase: Project → Logs

