-- Create database
CREATE DATABASE IF NOT EXISTS blood_pressure_tracker;
USE blood_pressure_tracker;

-- Create pressure_logs table
CREATE TABLE IF NOT EXISTS pressure_logs (
  id VARCHAR(36) PRIMARY KEY,
  systolic INT NOT NULL,
  diastolic INT NOT NULL,
  pulse INT NOT NULL,
  category ENUM('Morning', 'Afternoon', 'Evening') NOT NULL,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recorded_at (recorded_at),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create daily_stats view for dashboard
CREATE VIEW IF NOT EXISTS daily_stats AS
SELECT 
  DATE(recorded_at) as date,
  ROUND(AVG(systolic)) as avg_systolic,
  ROUND(AVG(diastolic)) as avg_diastolic,
  ROUND(AVG(pulse)) as avg_pulse,
  MIN(systolic) as min_systolic,
  MAX(systolic) as max_systolic
FROM pressure_logs
GROUP BY DATE(recorded_at)
ORDER BY date DESC;
