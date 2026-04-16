# Setup Guide - Blood Pressure Tracker

Complete step-by-step guide to get the Blood Pressure Tracker running locally.

## 🔧 Prerequisites

Before you start, ensure you have installed:
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **MySQL** or **MariaDB** (v5.7+) - [Download](https://www.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

To verify installations:
```bash
node --version
npm --version
mysql --version
git --version
```

## 📥 Clone & Setup Project

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Personal-Blood-Pressure-Tracker.git
cd Personal-Blood-Pressure-Tracker
```

### 2. Install dependencies for both parts

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

## 🗄️ Database Setup

### 1. Create MySQL user (optional but recommended)
```bash
mysql -u root -p
```

Then in MySQL shell:
```sql
CREATE USER 'bp_tracker'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON blood_pressure_tracker.* TO 'bp_tracker'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Create database and import schema
```bash
mysql -u root -p < backend/src/database/schema.sql
```

Or if using the custom user:
```bash
mysql -u bp_tracker -p blood_pressure_tracker < backend/src/database/schema.sql
```

### 3. Verify the database
```bash
mysql -u root -p blood_pressure_tracker
> SHOW TABLES;
```

You should see:
- `pressure_logs`
- `daily_stats` (view)

## ⚙️ Environment Configuration

### Backend Configuration

1. Copy example env file:
```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env`:
```bash
# For Windows (Notepad or any editor)
notepad backend\.env

# For macOS/Linux
nano backend/.env
```

3. Update the following values:
```env
DB_HOST=localhost
DB_USER=bp_tracker          # or 'root' if using root
DB_PASSWORD=secure_password # or your password
DB_NAME=blood_pressure_tracker
DB_PORT=3306
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

1. Copy example env file:
```bash
cp frontend/.env.example frontend/.env.local
```

2. The default value should work:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

If your backend runs on a different port, update this value.

## 🚀 Running the Application

### Option 1: Manual Terminal Setup (Recommended for Development)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:5000
Environment: development
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

Browser will automatically open to `http://localhost:3000`

### Option 2: Using Docker

Make sure Docker and Docker Compose are installed, then:

```bash
docker-compose up --build
```

This will:
- Start MySQL database
- Start Express backend
- Start React frontend

Access the app at `http://localhost:3000`

## 🧪 Testing the Application

### 1. Access the application
Open browser to `http://localhost:3000`

### 2. Test backend API
```bash
# Create a reading
curl -X POST http://localhost:5000/api/pressure \
  -H "Content-Type: application/json" \
  -d '{
    "systolic": 120,
    "diastolic": 80,
    "pulse": 72,
    "category": "Morning"
  }'

# Get all readings
curl http://localhost:5000/api/pressure

# Get dashboard stats
curl http://localhost:5000/api/pressure/dashboard/stats
```

### 3. Test frontend
- Navigate to Dashboard - should show empty state initially
- Go to "Log Reading"
- Select "Morning"
- Enter: Systolic: 120, Diastolic: 80, Pulse: 72
- Click "Record Reading"
- Check History - reading should appear
- Go back to Dashboard - should show the reading

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `backend/.env`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Recreate DB: `mysql -u root -p < backend/src/database/schema.sql`

### Issue: "Port 5000 already in use"
**Solution:**
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `REACT_APP_API_URL` in `frontend/.env.local`

### Issue: "Port 3000 already in use"
**Solution:**
- For macOS/Linux: `PORT=3001 npm start`
- For Windows: `set PORT=3001 && npm start`

### Issue: Frontend shows "Failed to fetch"
**Solution:**
- Ensure backend is running on correct port
- Check `REACT_APP_API_URL` in `frontend/.env.local`
- Check browser console (F12) for exact error
- Check backend CORS_ORIGIN matches frontend URL

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "mysql command not found"
**Solution:**
- macOS: `brew install mysql-client`
- Windows: Add MySQL to PATH or use full path to mysql.exe
- Linux: `sudo apt-get install mysql-client`

## 📦 Production Build

### Build Frontend
```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/build/` directory

### Deploy Backend
See deployment platforms:
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://www.heroku.com/) (no longer free)

### Deploy Frontend
See [Vercel deployment guide](https://vercel.com/docs)

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Vercel Docs](https://vercel.com/docs)

## ✅ Checklist Before Deployment

- [ ] Database is properly set up
- [ ] `.env` files are configured correctly
- [ ] Backend runs without errors (`npm run dev`)
- [ ] Frontend compiles without errors (`npm start`)
- [ ] Can create and view readings in UI
- [ ] API endpoints work with curl/Postman
- [ ] All sensitive data is removed from .gitignore violations
- [ ] `.env` files are NOT committed to git

## 💡 Tips

- Use `.env` for local development only
- Never commit `.env` files with passwords
- Test API endpoints with Postman before assuming frontend is broken
- Check browser console (F12) and Network tab for debugging
- Check server logs for backend errors
- Keep database backups before major changes

## Need Help?

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check backend terminal output
3. Review `.env` configuration
4. Check MySQL database connection
5. Read the error message carefully - it usually tells you what's wrong
6. Search GitHub issues or Stack Overflow

---

**Happy monitoring! 💪**
