# Deployment Guide

Complete guide to deploy the Blood Pressure Tracker to production.

## 🚀 Deployment Overview

### Architecture
```
Frontend (Vercel)
    ↓
API Gateway (Backend on Railway/Render)
    ↓
Database (PlanetScale/AWS RDS)
```

---

## 📱 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
```bash
cd frontend
npm run build
```

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Deploy
1. Click "New Project"
2. Select your GitHub repository
3. Set Environment Variables:
   - `REACT_APP_API_URL` = Your backend URL (e.g., https://bp-tracker-api.herokuapp.com/api)
4. Click "Deploy"

### Step 4: Configure Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Vercel Environment Variables (.env.production)
```
REACT_APP_API_URL=https://your-backend.com/api
```

---

## 🔧 Backend Deployment

### Option A: Railway (Recommended - Easy)

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway

#### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Choose your repository
4. Select `backend` as root directory (or configure in settings)

#### Step 3: Set Environment Variables
In Railway Dashboard:
1. Go to your project → Variables
2. Add all variables from `backend/.env`:
   ```
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=blood_pressure_tracker
   DB_PORT=3306
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

#### Step 4: Generate Public URL
- Railway will automatically generate a URL
- Use this as your `REACT_APP_API_URL` in Vercel

#### Step 5: Initialize Database
1. Connect to Railway database
2. Run schema:
   ```bash
   mysql -h your-railway-host -u user -p database < backend/src/database/schema.sql
   ```

---

### Option B: Render

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up or log in
3. Connect GitHub

#### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Select your repository
3. Set Name and Region
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Instance Type: Free (for testing)

#### Step 3: Set Environment Variables
Add in Environment section:
```
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=blood_pressure_tracker
DB_PORT=3306
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

#### Step 4: Add Database Service
1. Click "New +" → "MySQL"
2. Set Name, Region, MySQL Version
3. Get connection string
4. Update backend environment variables

---

### Option C: Heroku (No Longer Free - Paid Plan $7+/month)

#### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
choco install heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### Step 2: Login to Heroku
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
heroku create your-app-name
```

#### Step 4: Add Database
```bash
heroku addons:create cleardb:ignite
```

#### Step 4: Set Environment Variables
```bash
heroku config:set \
  DB_HOST=your-host \
  DB_USER=your-user \
  DB_PASSWORD=your-password \
  DB_NAME=blood_pressure_tracker \
  NODE_ENV=production \
  CORS_ORIGIN=https://your-frontend.vercel.app
```

#### Step 5: Deploy
```bash
git push heroku main
```

---

## 🗄️ Database Deployment (Production)

### Option A: PlanetScale (MySQL Compatible - Recommended)

#### Step 1: Create PlanetScale Account
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up
3. Create new database

#### Step 2: Get Connection String
1. Go to Database → Connect
2. Copy the connection string
3. Extract credentials:
   ```
   mysql://user:password@host/database_name
   ```

#### Step 3: Create Database
```bash
# Create tables using schema.sql
mysql -h your-host -u user -p < backend/src/database/schema.sql
```

#### Step 4: Update Backend Environment
```
DB_HOST=your-planetscale-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=blood_pressure_tracker
DB_PORT=3306
```

### Option B: AWS RDS

#### Step 1: Create RDS Instance
1. Go to AWS Console → RDS
2. Click "Create database"
3. Choose MySQL
4. Set Master username and password
5. Choose t3.micro for free tier
6. Create

#### Step 2: Configure Security Group
1. Allow inbound traffic on port 3306
2. Add your backend IP

#### Step 3: Create Database
```bash
mysql -h your-rds-endpoint -u admin -p < backend/src/database/schema.sql
```

#### Step 4: Update Backend Environment
```
DB_HOST=your-rds-endpoint
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=blood_pressure_tracker
```

### Option C: Supabase (PostgreSQL)

**Note:** Supabase uses PostgreSQL, not MySQL. Would need to modify the backend code.

---

## 🔍 Post-Deployment Verification

### Check Frontend
1. Visit your Vercel URL
2. Test all pages load
3. Check console for errors (F12)

### Check Backend
```bash
# Health check
curl https://your-backend-url/api/health

# Create test reading
curl -X POST https://your-backend-url/api/pressure \
  -H "Content-Type: application/json" \
  -d '{"systolic": 120, "diastolic": 80, "pulse": 72, "category": "Morning"}'

# Get all readings
curl https://your-backend-url/api/pressure
```

### Check Database
1. Verify data is being stored
2. Check query performance
3. Set up automated backups

---

## 🔐 Production Security Checklist

- [ ] Set `NODE_ENV=production` in backend
- [ ] Use strong database passwords (20+ characters)
- [ ] Enable SSL/TLS for database connections
- [ ] Use HTTPS for all URLs
- [ ] Set proper CORS origins (not wildcards)
- [ ] Add rate limiting to API
- [ ] Set up monitoring and alerts
- [ ] Enable database backups
- [ ] Rotate secrets regularly
- [ ] Use environment variables (never commit secrets)
- [ ] Enable HTTPS enforcement
- [ ] Add authentication/authorization
- [ ] Set up error logging (Sentry, LogRocket, etc.)

---

## 📊 Monitoring & Logging

### Frontend (Vercel)
- Vercel dashboards show build/deployment status
- Check real-time logs in Vercel dashboard

### Backend (Railway/Render)
- Check deployment logs
- Monitor resource usage
- View application logs

### Database
- Regular backups
- Monitor query performance
- Set up slow query logs

### Third-party Services
- **Error Tracking:** [Sentry.io](https://sentry.io)
- **Logging:** [LogRocket](https://logrocket.com) or [Papertrail](https://www.papertrail.com)
- **Uptime Monitoring:** [UptimeRobot](https://uptimerobot.com)

---

## 💰 Cost Estimates (Monthly)

### Free Tier
- Frontend (Vercel): Free
- Backend (Railway/Render Free Tier): Free
- Database (PlanetScale Free): Free
- **Total: $0** (suitable for personal use)

### Starter Tier
- Frontend (Vercel): $20
- Backend (Railway): $5-10
- Database (PlanetScale): $29
- **Total: ~$54/month**

### Production Tier
- Frontend (Vercel Pro): $20
- Backend (Railway): $20
- Database (AWS RDS): $15-30
- **Total: ~$55-70/month**

---

## 🆘 Troubleshooting Deployment

### "Cannot connect to database"
- Check database host is correct
- Verify credentials
- Check firewall/security groups allow connections
- Ensure database is running

### "Frontend cannot reach backend"
- Check backend is deployed and running
- Verify `REACT_APP_API_URL` is correct
- Check CORS_ORIGIN in backend matches frontend URL
- Look at browser Network tab for actual error

### "504 Gateway Timeout"
- Backend process might be crashing
- Check backend logs
- May need more resources/paid tier

### "BUILD_FAILED"
- Check logs for build errors
- Ensure all dependencies are in package.json
- Verify Node version compatibility
- Check for hardcoded local paths

---

## 🔄 Continuous Deployment

### GitHub Actions
`.github/workflows/deploy.yml` is included for automated deployments.

Set up GitHub secrets:
```
VERCEL_TOKEN=your-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

Commits to `main` branch will auto-deploy.

---

## 📝 Rollback Procedure

### Railway
1. Go to Project → Deployments
2. Select previous deployment
3. Click "Redeploy"

### Render
1. Go to Web Service → Logs
2. Click "Previous Deployments"
3. Select and click "Deploy"

### Vercel
1. Go to Deployments
2. Click on previous successful deploy
3. Click "Promote to Production"

---

## 📞 Support Resources

- Railway Support: [docs.railway.app](https://docs.railway.app)
- Render Support: [render.com/docs](https://render.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- PlanetScale Support: [docs.planetscale.com](https://docs.planetscale.com)

---

**Deployment Complete! 🎉**

Your Blood Pressure Tracker is now live and ready for use!
