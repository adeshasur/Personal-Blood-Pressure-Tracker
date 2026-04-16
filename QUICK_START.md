# ⚡ Quick Start (5 Minutes)

Get the Blood Pressure Tracker running in 5 minutes!

## Prerequisites ✅
- Node.js v18+ (with npm)
- MySQL/MariaDB running locally
- A code editor

## Step 1: Install Dependencies
```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## Step 2: Setup Database
```bash
# MySQL should be running
mysql -u root -p < backend/src/database/schema.sql
```

## Step 3: Configure Environment
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

## Step 4: Start Backend
```bash
cd backend
npm run dev
```
✅ Backend runs on `http://localhost:5000`

## Step 5: Start Frontend (New Terminal)
```bash
cd frontend
npm start
```
✅ Frontend opens automatically at `http://localhost:3000`

## 🎉 Success!
You now have:
- ✅ Dashboard with today's summary
- ✅ Forms to log BP readings
- ✅ History of all readings
- ✅ 30-day charts and trends

## 📝 Log Your First Reading
1. Click "Log Reading" button
2. Select "Morning" (8:30 AM)
3. Enter: Systolic 120, Diastolic 80, Pulse 72
4. Click "Record Reading"
5. See it appear in dashboard and history!

## 🐛 Common Issues

**"MySQL connection failed"**
- Ensure MySQL is running: `mysql -u root -p`

**"Port 5000 already in use"**
- Change PORT in `backend/.env` to `5001`
- Update `REACT_APP_API_URL` in `frontend/.env.local` to `http://localhost:5001/api`

**"npm install fails"**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps
- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- Check [API.md](./API.md) for API documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy online
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for complete overview

## 🚀 Ready to Deploy?
See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Frontend on Vercel (free!)
- Backend on Railway (free tier available)
- Database on PlanetScale (free!)

---

**Questions? Open an issue on GitHub!**
