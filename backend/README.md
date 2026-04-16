# Blood Pressure Tracker - Backend API

Express.js backend API for the Blood Pressure Tracker application.

## Setup

### Prerequisites
- Node.js (v18+)
- MySQL/MariaDB (or PlanetScale, Supabase)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Configure your database connection in `.env`

4. Create the database and tables:
   ```bash
   mysql -u root -p < src/database/schema.sql
   ```

### Running

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

## API Endpoints

### Create Reading
```
POST /api/pressure
Body: {
  "systolic": 120,
  "diastolic": 80,
  "pulse": 72,
  "category": "Morning"
}
```

### Get All Readings
```
GET /api/pressure?limit=50&offset=0
```

### Get Reading by ID
```
GET /api/pressure/:id
```

### Get Readings by Date
```
GET /api/pressure/date/2024-04-16
```

### Get Dashboard Stats
```
GET /api/pressure/dashboard/stats
```

### Get Latest Readings
```
GET /api/pressure/latest
```

### Update Reading
```
PUT /api/pressure/:id
Body: {
  "systolic": 120,
  "diastolic": 80,
  "pulse": 72
}
```

### Delete Reading
```
DELETE /api/pressure/:id
```

## Database Schema

### pressure_logs table
- `id` (UUID) - Primary Key
- `systolic` (INT) - Systolic pressure (higher number)
- `diastolic` (INT) - Diastolic pressure (lower number)
- `pulse` (INT) - Heart rate in BPM
- `category` (ENUM) - 'Morning', 'Afternoon', 'Evening'
- `recorded_at` (TIMESTAMP) - When reading was taken
- `created_at` (TIMESTAMP) - Record creation time
