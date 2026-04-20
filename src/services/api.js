import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase.js';

const COLLECTION_NAME = "bp_readings";

// --- Default Historical Data (April 13th to 18th) ---
const SEED_DATA = [
  { date: '2026-04-13', systolic: 116, diastolic: 90, category: 'Morning' },
  { date: '2026-04-13', systolic: 118, diastolic: 70, category: 'Evening' },
  { date: '2026-04-13', systolic: 119, diastolic: 75, category: 'Night' },
  { date: '2026-04-14', systolic: 120, diastolic: 78, category: 'Morning' },
  { date: '2026-04-14', systolic: 114, diastolic: 66, category: 'Evening' },
  { date: '2026-04-14', systolic: 121, diastolic: 79, category: 'Night' },
  { date: '2026-04-15', systolic: 120, diastolic: 82, category: 'Morning' },
  { date: '2026-04-15', systolic: 119, diastolic: 72, category: 'Evening' },
  { date: '2026-04-15', systolic: 113, diastolic: 54, category: 'Night' },
  { date: '2026-04-16', systolic: 131, diastolic: 73, category: 'Morning' },
  { date: '2026-04-16', systolic: 129, diastolic: 78, category: 'Evening' },
  { date: '2026-04-16', systolic: 135, diastolic: 112, category: 'Night' },
  { date: '2026-04-17', systolic: 131, diastolic: 91, category: 'Morning' },
  { date: '2026-04-18', systolic: 123, diastolic: 75, category: 'Evening' },
];

export const pressureService = {
  // Check if seeding is needed
  _checkAndSeed: async () => {
    try {
      const q = query(collection(db, COLLECTION_NAME), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log("--- Initializing Cloud Persistence with Historical Data ---");
        SEED_DATA.forEach((data) => {
          addDoc(collection(db, COLLECTION_NAME), {
            ...data,
            created_at: serverTimestamp()
          });
        });
        // Note: Batched writes for many records would use batch.set but addDoc is async here.
        // For simplicity, we just trigger them or use a proper batch.
      }
    } catch (err) {
      console.error("Seeding failed:", err);
    }
  },

  // Create new reading
  createReading: async (data) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        systolic: parseInt(data.systolic),
        diastolic: parseInt(data.diastolic),
        created_at: serverTimestamp()
      });
      return { data: { id: docRef.id, ...data } };
    } catch (err) {
      console.error("Firestore Error (Create):", err);
      throw err;
    }
  },

  // Get all readings (flat list)
  getReadings: async (maxCount = 50) => {
    try {
      await pressureService._checkAndSeed();
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy("date", "desc"),
        limit(maxCount)
      );
      const snapshot = await getDocs(q);
      const readings = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        created_at: d.data().created_at?.toDate().toISOString() || new Date().toISOString()
      }));

      return { data: readings };
    } catch (err) {
      console.error("Firestore Error (Read):", err);
      return { data: [] };
    }
  },

  // Get Latest Readings (Dashboard)
  getLatestReadings: async (maxCount = 5) => {
    try {
      await pressureService._checkAndSeed();
      const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"), limit(maxCount));
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

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
      console.error("Firestore Error (History):", err);
      return { data: [] };
    }
  },

  // Dashboard Stats (Daily Averages)
  getDashboardStats: async () => {
    try {
      await pressureService._checkAndSeed();
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const readings = snapshot.docs.map(d => d.data());
      
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
      console.error("Firestore Error (Stats):", err);
      return { data: [] };
    }
  }
};
