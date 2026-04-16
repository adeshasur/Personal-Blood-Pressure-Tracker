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

// GET /api/pressure - Get all readings
router.get('/pressure', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;
    
    // Note: neon() uses template literals somewhat differently or as a function
    const rows = await sql('SELECT * FROM pressure_readings ORDER BY date DESC, created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(rows);
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

// GET /api/pressure/dashboard/stats - Get aggregated stats
router.get('/pressure/dashboard/stats', async (req, res) => {
  try {
    const rows = await sql(`
      SELECT 
        date,
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

// GET /api/pressure/latest - Get today's latest readings
router.get('/latest', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const rows = await sql('SELECT * FROM pressure_readings WHERE date = $1 ORDER BY created_at DESC', [today]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

// Mount the router on /api or /.netlify/functions/api
// Since we will proxy /api/* to this function, we can just use /api prefix or handle it carefully
app.use('/api', router);
app.use('/.netlify/functions/api', router); // Compatibility for direct access

// Initialize DB
initDb();

export const handler = serverless(app);
