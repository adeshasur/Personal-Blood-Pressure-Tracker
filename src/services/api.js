const STORAGE_KEY = "bp_tracker_readings";

// Helper to get data from localStorage
const getLocalData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper to save data to localStorage
const saveLocalData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const pressureService = {
  // Create new reading
  createReading: async (data) => {
    try {
      const readings = getLocalData();
      const newReading = {
        id: Date.now().toString(),
        ...data,
        systolic: parseInt(data.systolic),
        diastolic: parseInt(data.diastolic),
        created_at: new Date().toISOString()
      };
      
      readings.push(newReading);
      saveLocalData(readings);
      
      return { data: newReading };
    } catch (err) {
      console.error("Storage Error (Create):", err);
      throw err;
    }
  },

  // Get all readings (flat list)
  getReadings: async (maxCount = 50) => {
    try {
      const readings = getLocalData()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, maxCount);

      return { data: readings };
    } catch (err) {
      console.error("Storage Error (Read):", err);
      return { data: [] };
    }
  },

  // Get Latest Readings (Dashboard)
  getLatestReadings: async (maxCount = 5) => {
    try {
      const all = getLocalData()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, maxCount);

      // Group by date
      const groupedMap = all.reduce((acc, r) => {
        if (!acc[r.date]) acc[r.date] = [];
        acc[r.date].push(r);
        return acc;
      }, {});

      const CATEGORY_ORDER = { Morning: 1, Evening: 2, Night: 3 };

      const result = Object.entries(groupedMap)
        .map(([date, dayReadings]) => ({
          date,
          readings: dayReadings.sort((a, b) => 
            (CATEGORY_ORDER[a.category] || 4) - (CATEGORY_ORDER[b.category] || 4)
          )
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

      return { data: result };
    } catch (err) {
      console.error("Storage Error (History):", err);
      return { data: [] };
    }
  },

  // Dashboard Stats (Daily Averages)
  getDashboardStats: async () => {
    try {
      const readings = getLocalData();
      
      const groupedMap = readings.reduce((acc, r) => {
        if (!acc[r.date]) acc[r.date] = { systolic: 0, diastolic: 0, count: 0 };
        acc[r.date].systolic += (r.systolic || 0);
        acc[r.date].diastolic += (r.diastolic || 0);
        acc[r.date].count += 1;
        return acc;
      }, {});

      const stats = Object.entries(groupedMap)
        .map(([date, data]) => ({
          date,
          avg_systolic: data.systolic / data.count,
          avg_diastolic: data.diastolic / data.count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return { data: stats };
    } catch (err) {
      console.error("Storage Error (Stats):", err);
      return { data: [] };
    }
  }
};

