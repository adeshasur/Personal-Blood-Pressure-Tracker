import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// Initialize Neon database client
const sql = neon(process.env.DATABASE_URL);

// Helper to initialize DB
const initDb = async () => {
  try {
    await sql(`
      CREATE TABLE IF NOT EXISTS pressure_readings (
        id SERIAL PRIMARY KEY,
        systolic INTEGER NOT NULL,
        diastolic INTEGER NOT NULL,
        pulse INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error('DB Init Error:', err);
  }
};

// GET /api/pressure - Get all readings (flat, paginated)
router.get('/pressure', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;
    const rows = await sql('SELECT * FROM pressure_readings ORDER BY date DESC, created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/pressure/history - Get all readings grouped by date (calendar view)
router.get('/pressure/history', async (req, res) => {
  try {
    const rows = await sql(`
      SELECT 
        id, systolic, diastolic, pulse, category, 
        date::text AS date, notes, created_at
      FROM pressure_readings 
      ORDER BY date DESC, 
        CASE category 
          WHEN 'Morning'   THEN 1 
          WHEN 'Afternoon' THEN 2 
          WHEN 'Evening'   THEN 3 
          ELSE 4 
        END ASC
    `);

    // Group by date on the server
    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.date]) grouped[row.date] = [];
      grouped[row.date].push(row);
    }

    // Convert to sorted array of { date, readings[] }
    const result = Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? -1 : 1))
      .map(([date, readings]) => ({ date, readings }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/pressure - Create reading
router.post('/pressure', async (req, res) => {
  try {
    const { systolic, diastolic, pulse, category, date, notes } = req.body;
    const recordDate = date || new Date().toISOString().split('T')[0];
    
    const rows = await sql(
      'INSERT INTO pressure_readings (systolic, diastolic, pulse, category, date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [systolic, diastolic, pulse, category, recordDate, notes || '']
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/pressure/dashboard/stats - Aggregated daily averages
router.get('/pressure/dashboard/stats', async (req, res) => {
  try {
    const rows = await sql(`
      SELECT 
        date::text AS date,
        AVG(systolic) as avg_systolic,
        AVG(diastolic) as avg_diastolic,
        AVG(pulse) as avg_pulse
      FROM pressure_readings
      GROUP BY date
      ORDER BY date ASC
      LIMIT 30
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/pressure/latest - Today's readings
router.get('/pressure/latest', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const rows = await sql('SELECT * FROM pressure_readings WHERE date = $1 ORDER BY created_at DESC', [today]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/pressure/date/:date - Readings for a specific date
router.get('/pressure/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const rows = await sql('SELECT * FROM pressure_readings WHERE date = $1 ORDER BY created_at DESC', [date]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/seed - Idempotent seed of all historical data (Apr 13–18 2026)
router.get('/seed', async (req, res) => {
  try {
    const historicalData = [
      // Apr 13
      { date: '2026-04-13', systolic: 116, diastolic: 90,  pulse: 72, category: 'Morning'   },
      { date: '2026-04-13', systolic: 118, diastolic: 70,  pulse: 72, category: 'Afternoon'  },
      { date: '2026-04-13', systolic: 119, diastolic: 75,  pulse: 72, category: 'Evening'    },
      // Apr 14
      { date: '2026-04-14', systolic: 120, diastolic: 78,  pulse: 72, category: 'Morning'   },
      { date: '2026-04-14', systolic: 114, diastolic: 66,  pulse: 72, category: 'Afternoon'  },
      { date: '2026-04-14', systolic: 121, diastolic: 79,  pulse: 72, category: 'Evening'    },
      // Apr 15
      { date: '2026-04-15', systolic: 120, diastolic: 82,  pulse: 72, category: 'Morning'   },
      { date: '2026-04-15', systolic: 119, diastolic: 72,  pulse: 72, category: 'Afternoon'  },
      { date: '2026-04-15', systolic: 113, diastolic: 54,  pulse: 72, category: 'Evening'    },
      // Apr 16
      { date: '2026-04-16', systolic: 131, diastolic: 73,  pulse: 72, category: 'Morning'   },
      { date: '2026-04-16', systolic: 129, diastolic: 78,  pulse: 72, category: 'Afternoon'  },
      { date: '2026-04-16', systolic: 135, diastolic: 112, pulse: 72, category: 'Evening'    },
      // Apr 17 — Morning only
      { date: '2026-04-17', systolic: 131, diastolic: 91,  pulse: 72, category: 'Morning'   },
      // Apr 18 — Afternoon only
      { date: '2026-04-18', systolic: 123, diastolic: 75,  pulse: 72, category: 'Afternoon'  },
    ];

    const inserted = [];
    const skipped  = [];

    for (const record of historicalData) {
      // Check for duplicate (same date + category)
      const existing = await sql(
        'SELECT id FROM pressure_readings WHERE date = $1 AND category = $2',
        [record.date, record.category]
      );

      if (existing.length > 0) {
        skipped.push(`${record.date} ${record.category}`);
        continue;
      }

      await sql(
        'INSERT INTO pressure_readings (systolic, diastolic, pulse, category, date, notes) VALUES ($1, $2, $3, $4, $5, $6)',
        [record.systolic, record.diastolic, record.pulse, record.category, record.date, 'Historical Data']
      );
      inserted.push(`${record.date} ${record.category}`);
    }

    res.json({
      message: 'Seed complete',
      inserted: inserted.length,
      skipped:  skipped.length,
      insertedRecords: inserted,
      skippedRecords:  skipped,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed data', details: error.message });
  }
});

// DELETE /api/pressure/:id
router.delete('/pressure/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql('DELETE FROM pressure_readings WHERE id = $1', [id]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mount router
app.use('/api', router);
app.use('/.netlify/functions/api', router);

// Initialize DB
initDb();

export const handler = serverless(app);
