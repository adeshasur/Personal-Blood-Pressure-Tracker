import express from 'express';
import cors from 'cors';
import { sql } from '@vercel/postgres';

const app = express();
app.use(cors());
app.use(express.json());

// Helper to initialize DB on first run
const initDb = async () => {
  await sql`
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
  `;
};

// GET /api/pressure - Get all readings
app.get('/api/pressure', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;
    
    const { rows } = await sql`
      SELECT * FROM pressure_readings 
      ORDER BY date DESC, created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/pressure - Create reading
app.post('/api/pressure', async (req, res) => {
  try {
    const { systolic, diastolic, pulse, category, date, notes } = req.body;
    
    // Default date to today if not provided
    const recordDate = date || new Date().toISOString().split('T')[0];
    
    const { rows } = await sql`
      INSERT INTO pressure_readings (systolic, diastolic, pulse, category, date, notes)
      VALUES (${systolic}, ${diastolic}, ${pulse}, ${category}, ${recordDate}, ${notes || ''})
      RETURNING *
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/pressure/dashboard/stats - Get aggregated stats
app.get('/api/pressure/dashboard/stats', async (req, res) => {
  try {
    const { rows } = await sql`
      SELECT 
        date,
        AVG(systolic) as avg_systolic,
        AVG(diastolic) as avg_diastolic,
        AVG(pulse) as avg_pulse
      FROM pressure_readings
      GROUP BY date
      ORDER BY date ASC
      LIMIT 30
    `;
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/pressure/latest - Get today's latest readings
app.get('/api/pressure/latest', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { rows } = await sql`
      SELECT * FROM pressure_readings
      WHERE date = ${today}
      ORDER BY created_at DESC
    `;
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/pressure/date/:date - Get readings for a specific date
app.get('/api/pressure/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { rows } = await sql`
      SELECT * FROM pressure_readings
      WHERE date = ${date}
      ORDER BY created_at DESC
    `;
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/seed - Temporary endpoint to seed historical data
app.get('/api/seed', async (req, res) => {
  try {
    const historicalData = [
      { date: '2026-04-13', systolic: 116, diastolic: 90, pulse: 72, category: 'Morning' },
      { date: '2026-04-13', systolic: 118, diastolic: 70, pulse: 72, category: 'Afternoon' },
      { date: '2026-04-13', systolic: 119, diastolic: 75, pulse: 72, category: 'Evening' },
      { date: '2026-04-14', systolic: 120, diastolic: 78, pulse: 72, category: 'Morning' },
      { date: '2026-04-14', systolic: 114, diastolic: 66, pulse: 72, category: 'Afternoon' },
      { date: '2026-04-14', systolic: 121, diastolic: 79, pulse: 72, category: 'Evening' },
      { date: '2026-04-15', systolic: 120, diastolic: 82, pulse: 72, category: 'Morning' },
      { date: '2026-04-15', systolic: 119, diastolic: 72, pulse: 72, category: 'Afternoon' },
      { date: '2026-04-15', systolic: 113, diastolic: 54, pulse: 72, category: 'Evening' },
      { date: '2026-04-16', systolic: 131, diastolic: 73, pulse: 72, category: 'Morning' },
      { date: '2026-04-16', systolic: 129, diastolic: 78, pulse: 72, category: 'Afternoon' },
      { date: '2026-04-16', systolic: 135, diastolic: 112, pulse: 72, category: 'Evening' }
    ];

    for (const record of historicalData) {
      await sql`
        INSERT INTO pressure_readings (systolic, diastolic, pulse, category, date, notes)
        VALUES (${record.systolic}, ${record.diastolic}, ${record.pulse}, ${record.category}, ${record.date}, 'Historical Data Seeded')
      `;
    }

    res.json({ message: 'Historical data seeded successfully!', count: historicalData.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed data', details: error.message });
  }
});

// DELETE /api/pressure/:id
app.delete('/api/pressure/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM pressure_readings WHERE id = ${id}`;
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Initialize DB then export the app
initDb().catch(console.error);

export default app;
