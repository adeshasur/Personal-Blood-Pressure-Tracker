# Blood Pressure Tracker

A lightweight, web-based blood pressure and heart rate monitoring system designed to log and track readings at specific intervals (8:30 AM, 2:00 PM, and 8:30 PM).

## 🎯 Key Features

- **📱 Time-Specific Logging**: Forms optimized for three daily time slots
- **📊 Dashboard**: Summary view with latest readings and daily averages
- **📈 30-Day Charts**: Visual trends with line and bar charts
- **📋 History Logs**: Chronological list of all previous records
- **🎨 Premium UI**: Glassmorphism design with dark theme
- **📱 Mobile Optimized**: Responsive design for quick logging on mobile devices
- **🟢 Color-Coded Status**: Visual indicators (Normal, Elevated, High, Critical)

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling with utility classes
- **React Router** - Page navigation
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL/MariaDB** - Database (or PlanetScale, Supabase)

### Deployment
- **Vercel** - Frontend hosting
- **Heroku/Railway/Render** - Backend hosting
- **GitHub** - Version control

## 📋 Database Schema

### pressure_logs table
```sql
id (UUID) - Primary Key
systolic (INT) - Upper number
diastolic (INT) - Lower number
pulse (INT) - Heart rate in BPM
category (ENUM) - 'Morning', 'Afternoon', 'Evening'
recorded_at (TIMESTAMP) - When reading was taken
created_at (TIMESTAMP) - Record creation time
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MySQL/MariaDB (or cloud DB like PlanetScale/Supabase)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials

npm install

# Create database and tables
mysql -u root -p < src/database/schema.sql

# Start backend
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local if needed (default points to localhost:5000)

npm install

# Start frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pressure` | Create new reading |
| GET | `/api/pressure` | Get all readings (paginated) |
| GET | `/api/pressure/:id` | Get single reading |
| GET | `/api/pressure/date/:date` | Get readings by date (YYYY-MM-DD) |
| GET | `/api/pressure/latest` | Get latest readings |
| GET | `/api/pressure/dashboard/stats` | Get 30-day statistics |
| PUT | `/api/pressure/:id` | Update reading |
| DELETE | `/api/pressure/:id` | Delete reading |

## 📊 Blood Pressure Categories

| Category | Systolic | Diastolic | Status |
|----------|----------|-----------|--------|
| Normal | < 130 | < 85 | 🟢 |
| Elevated | 130-139 | < 85 | 🟡 |
| High BP Stage 1 | 140-159 | 90-99 | 🟠 |
| High BP Stage 2 | ≥ 160 | ≥ 100 | 🔴 |
| Crisis (Emergency) | ≥ 180 | ≥ 120 | 🔴 Critical |

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set `REACT_APP_API_URL` environment variable
4. Deploy!

### Backend (Railway/Render)
1. Create account on Railway or Render
2. Connect GitHub repo
3. Set environment variables (DB credentials, PORT, etc.)
4. Deploy!

## 📁 Project Structure

```
Personal-Blood-Pressure-Tracker/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express server
│   │   ├── routes/
│   │   │   └── pressure.js          # API routes
│   │   ├── models/
│   │   │   └── PressureLog.js       # Database model
│   │   └── database/
│   │       ├── connection.js        # DB connection
│   │       └── schema.sql           # Database schema
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Common.jsx           # Reusable components
│   │   │   ├── LogForm.jsx          # Reading form
│   │   │   ├── Dashboard.jsx        # Dashboard view
│   │   │   ├── Charts.jsx           # Charts
│   │   │   └── HistoryList.jsx      # History list
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Home page
│   │   │   └── LogPage.jsx          # Log page
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── App.jsx                  # Main app
│   │   └── index.css                # Global styles
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
└── README.md                         # This file
```

## 🔐 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blood_pressure_tracker
DB_PORT=3306
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📖 Usage

1. **Log In Daily**: Visit the app 3 times a day at the specified times
2. **Record Readings**: Enter systolic, diastolic, and pulse values
3. **View Dashboard**: See today's summary and overall health trends
4. **Check History**: Review past readings and download reports

## 💡 Future Enhancements

- [ ] User authentication & multi-user support
- [ ] CSV export for medical records
- [ ] Medication reminders
- [ ] Email/SMS alerts for abnormal readings
- [ ] Doctor's notes integration
- [ ] Family sharing features
- [ ] PWA for offline capability
- [ ] Advanced analytics

## 🐛 Troubleshooting

### Backend won't connect to database
- Check database is running
- Verify credentials in `.env`
- Ensure database user has proper permissions
- Check firewall/network settings for cloud DBs

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env.local`
- Verify CORS settings in backend
- Check browser console for errors

### Commands keep failing
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`
- Make sure you're in correct directory

## 📝 License

MIT

## 👨‍💻 Contributing

Feel free to fork and submit pull requests for any improvements!

## 📞 Support

For issues and questions, please create an issue on GitHub.

---

**Made with ❤️ for better health monitoring**