import express from 'express';
import { PressureLog } from '../models/PressureLog.js';

const router = express.Router();

// POST /api/pressure - Create new reading
router.post('/', async (req, res) => {
  try {
    const { systolic, diastolic, pulse, category } = req.body;

    // Validation
    if (!systolic || !diastolic || !pulse || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['Morning', 'Afternoon', 'Evening'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const log = await PressureLog.create(systolic, diastolic, pulse, category);
    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating pressure log:', error);
    res.status(500).json({ error: 'Failed to create pressure log' });
  }
});

// GET /api/pressure - Get all readings (paginated)
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    const logs = await PressureLog.getAll(limit, offset);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching pressure logs:', error);
    res.status(500).json({ error: 'Failed to fetch pressure logs' });
  }
});

// GET /api/pressure/date/:date - Get readings for specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Basic date validation (YYYY-MM-DD format)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const logs = await PressureLog.getAllByDate(date);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching pressure logs by date:', error);
    res.status(500).json({ error: 'Failed to fetch pressure logs' });
  }
});

// GET /api/pressure/dashboard - Get dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await PressureLog.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/pressure/latest - Get latest readings
router.get('/latest', async (req, res) => {
  try {
    const logs = await PressureLog.getLatestByCategory();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching latest readings:', error);
    res.status(500).json({ error: 'Failed to fetch latest readings' });
  }
});

// GET /api/pressure/:id - Get single reading
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const log = await PressureLog.getById(id);

    if (!log) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    res.json(log);
  } catch (error) {
    console.error('Error fetching pressure log:', error);
    res.status(500).json({ error: 'Failed to fetch pressure log' });
  }
});

// PUT /api/pressure/:id - Update reading
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { systolic, diastolic, pulse } = req.body;

    if (!systolic || !diastolic || !pulse) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updated = await PressureLog.update(id, systolic, diastolic, pulse);

    if (!updated) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating pressure log:', error);
    res.status(500).json({ error: 'Failed to update pressure log' });
  }
});

// DELETE /api/pressure/:id - Delete reading
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PressureLog.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    res.json({ message: 'Reading deleted successfully' });
  } catch (error) {
    console.error('Error deleting pressure log:', error);
    res.status(500).json({ error: 'Failed to delete pressure log' });
  }
});

export default router;
