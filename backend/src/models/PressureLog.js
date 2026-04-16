import pool from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export class PressureLog {
  static async create(systolic, diastolic, pulse, category) {
    const id = uuidv4();
    const query = `
      INSERT INTO pressure_logs (id, systolic, diastolic, pulse, category)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const connection = await pool.getConnection();
    try {
      await connection.execute(query, [id, systolic, diastolic, pulse, category]);
      return this.getById(id);
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    const query = `
      SELECT * FROM pressure_logs WHERE id = ?
    `;
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(query, [id]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async getAll(limit = 100, offset = 0) {
    const query = `
      SELECT * FROM pressure_logs 
      ORDER BY recorded_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(query, [limit, offset]);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getAllByDate(date) {
    const query = `
      SELECT * FROM pressure_logs 
      WHERE DATE(recorded_at) = ? 
      ORDER BY recorded_at DESC
    `;
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(query, [date]);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getLatestByCategory() {
    const query = `
      SELECT * FROM pressure_logs
      WHERE recorded_at >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      ORDER BY recorded_at DESC
    `;
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(query);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getDashboardStats() {
    const query = `
      SELECT 
        DATE(recorded_at) as date,
        AVG(systolic) as avg_systolic,
        AVG(diastolic) as avg_diastolic,
        AVG(pulse) as avg_pulse,
        MIN(systolic) as min_systolic,
        MAX(systolic) as max_systolic,
        MIN(diastolic) as min_diastolic,
        MAX(diastolic) as max_diastolic
      FROM pressure_logs
      WHERE recorded_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(recorded_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(query);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async update(id, systolic, diastolic, pulse) {
    const query = `
      UPDATE pressure_logs 
      SET systolic = ?, diastolic = ?, pulse = ?
      WHERE id = ?
    `;
    
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(query, [systolic, diastolic, pulse, id]);
      return result.affectedRows > 0 ? this.getById(id) : null;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM pressure_logs WHERE id = ?
    `;
    
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(query, [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}
