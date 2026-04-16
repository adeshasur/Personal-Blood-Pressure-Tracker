# Blood Pressure Tracker - Frontend

React-based frontend for the Blood Pressure Tracker application with Tailwind CSS and a premium glassmorphism design.

## Features

- **Dashboard**: View today's summary and schedule status
- **30-Day Charts**: Line charts for BP trends and bar charts for pulse data
- **Log Readings**: Form for recording readings at 3 specific times
- **History**: View all previous readings with pagination
- **Status Indicators**: Color-coded status (Normal, Elevated, High, Critical)
- **Responsive Design**: Works great on mobile and desktop

## Tech Stack

- React 18
- React Router DOM
- Tailwind CSS
- Recharts (for data visualization)
- Lucide React (for icons)
- Axios (for API calls)

## Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file:
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running

**Development**:
```bash
npm start
```

**Build for production**:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Common.jsx          # Reusable components (cards, indicators)
│   ├── LogForm.jsx         # Reading input form
│   ├── HistoryList.jsx     # List of past readings
│   ├── Dashboard.jsx       # Dashboard overview
│   └── Charts.jsx          # Charts and data visualization
├── pages/
│   ├── HomePage.jsx        # Dashboard page
│   └── LogPage.jsx         # Log readings page
├── services/
│   └── api.js              # API client
├── App.jsx                 # Main app component
├── index.js                # Entry point
└── index.css               # Global styles & tailwind utilities
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api/pressure`

### Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: `http://localhost:5000/api`)

## Color Coding

- **Normal**: Green (#10b981) - Systolic < 130, Diastolic < 85
- **Elevated**: Yellow (#f59e0b) - Systolic 130-139, Diastolic < 85
- **High**: Orange/Red (#ef4444) - Systolic 140+, Diastolic 90+
- **Critical**: Bright Red (#dc2626) - Systolic 180+, Diastolic 120+

## Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

```bash
vercel
```
