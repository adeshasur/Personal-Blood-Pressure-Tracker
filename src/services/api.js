import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  limit,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "bp_readings";

// --- Default Historical Data (Matching updated Morning/Evening/Night) ---
const SEED_DATA = [
  { date: '2026-04-13', systolic: 116, diastolic: 90, pulse: 72, category: 'Morning' },
  { date: '2026-04-13', systolic: 118, diastolic: 70, pulse: 72, category: 'Evening' },
  { date: '2026-04-13', systolic: 119, diastolic: 75, pulse: 72, category: 'Night' },
  { date: '2026-04-14', systolic: 120, diastolic: 78, pulse: 72, category: 'Morning' },
  { date: '2026-04-14', systolic: 114, diastolic: 66, pulse: 72, category: 'Evening' },
  { date: '2026-04-14', systolic: 121, diastolic: 79, pulse: 72, category: 'Night' },
  { date: '2026-04-15', systolic: 120, diastolic: 82, pulse: 72, category: 'Morning' },
  { date: '2026-04-15', systolic: 119, diastolic: 72, pulse: 72, category: 'Evening' },
  { date: '2026-04-15', systolic: 113, diastolic: 54, pulse: 72, category: 'Night' },
  { date: '2026-04-16', systolic: 131, diastolic: 73, pulse: 72, category: 'Morning' },
  { date: '2026-04-16', systolic: 129, diastolic: 78, pulse: 72, category: 'Evening' },
  { date: '2026-04-16', systolic: 135, diastolic: 112, pulse: 72, category: 'Night' },
  { date: '2026-04-17', systolic: 131, diastolic: 91, pulse: 72, category: 'Morning' },
  { date: '2026-04-18', systolic: 123, diastolic: 75, pulse: 72, category: 'Evening' },
];

export const pressureService = {
  // Check if seeding is needed
  _checkAndSeed: async () => {
    try {
      const q = query(collection(db, COLLECTION_NAME), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log("--- Initializing Cloud Persistence with Historical Data ---");
        const batch = writeBatch(db);
        SEED_DATA.forEach((data) => {
          const docRef = doc(collection(db, COLLECTION_NAME));
          batch.set(docRef, {
            ...data,
            created_at: serverTimestamp()
          });
        });
        await batch.commit();
      }
    } catch (err) {
      console.warn("Seeding skipped (possibly Firestore rules):", err);
    }
  },

  // Create new reading
  createReading: async (data) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        systolic: parseInt(data.systolic),
        diastolic: parseInt(data.diastolic),
        pulse: data.pulse ? parseInt(data.pulse) : null,
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
      console.error("Firestore Error (Get):", err);
      return { data: [] };
    }
  },

  // Get all readings grouped by date (aggregated view)
  getHistory: async () => {
    try {
      await pressureService._checkAndSeed();
      const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
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
        if (!acc[r.date]) acc[r.date] = { systolic: 0, diastolic: 0, pulse: 0, count: 0, pulseCount: 0 };
        acc[r.date].systolic += (r.systolic || 0);
        acc[r.date].diastolic += (r.diastolic || 0);
        acc[r.date].count += 1;
        
        if (r.pulse !== null && r.pulse !== undefined) {
          acc[r.date].pulse += r.pulse;
          acc[r.date].pulseCount += 1;
        }
        return acc;
      }, {});

      const stats = Object.entries(groupedMap)
        .map(([date, data]) => ({
          date,
          avg_systolic: data.systolic / data.count,
          avg_diastolic: data.diastolic / data.count,
          avg_pulse: data.pulseCount > 0 ? data.pulse / data.pulseCount : null
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return { data: stats };
    } catch (err) {
      console.error("Firestore Error (Stats):", err);
      return { data: [] };
    }
  },

  // Latest readings for today
  getLatestReadings: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"), limit(20));
      const snapshot = await getDocs(q);
      const filtered = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.date === today);
      return { data: filtered };
    } catch (err) {
      console.error("Firestore Error (Latest):", err);
      return { data: [] };
    }
  },

  // Delete reading
  deleteReading: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return { data: { message: 'Deleted' } };
    } catch (err) {
      console.error("Firestore Error (Delete):", err);
      throw err;
    }
  }
};

export default pressureService;
