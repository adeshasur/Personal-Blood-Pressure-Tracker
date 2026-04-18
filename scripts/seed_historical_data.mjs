import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in environment!');
  console.log('Please run: $env:DATABASE_URL="your_neon_url_here"; node scripts/seed_historical_data.mjs');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// All 13 historical readings: Apr 13–18 2026
// Pulse defaults to 72 BPM (not recorded at time of measurement)
const historicalData = [
  // Apr 13
  { date: '2026-04-13', systolic: 116, diastolic: 90, pulse: 72, category: 'Morning' },
  { date: '2026-04-13', systolic: 118, diastolic: 70, pulse: 72, category: 'Afternoon' },
  { date: '2026-04-13', systolic: 119, diastolic: 75, pulse: 72, category: 'Evening' },
  // Apr 14
  { date: '2026-04-14', systolic: 120, diastolic: 78, pulse: 72, category: 'Morning' },
  { date: '2026-04-14', systolic: 114, diastolic: 66, pulse: 72, category: 'Afternoon' },
  { date: '2026-04-14', systolic: 121, diastolic: 79, pulse: 72, category: 'Evening' },
  // Apr 15
  { date: '2026-04-15', systolic: 120, diastolic: 82, pulse: 72, category: 'Morning' },
  { date: '2026-04-15', systolic: 119, diastolic: 72, pulse: 72, category: 'Afternoon' },
  { date: '2026-04-15', systolic: 113, diastolic: 54, pulse: 72, category: 'Evening' },
  // Apr 16
  { date: '2026-04-16', systolic: 131, diastolic: 73, pulse: 72, category: 'Morning' },
  { date: '2026-04-16', systolic: 129, diastolic: 78, pulse: 72, category: 'Afternoon' },
  { date: '2026-04-16', systolic: 135, diastolic: 112, pulse: 72, category: 'Evening' },
  // Apr 17 — only Morning logged
  { date: '2026-04-17', systolic: 131, diastolic: 91, pulse: 72, category: 'Morning' },
  // Apr 18 — only Afternoon logged
  { date: '2026-04-18', systolic: 123, diastolic: 75, pulse: 72, category: 'Afternoon' },
];

async function seed() {
  console.log('🚀 Starting data seed to Neon Database...');
  console.log(`📊 Total records to insert: ${historicalData.length}`);
  let inserted = 0;
  let skipped = 0;

  try {
    for (const record of historicalData) {
      // Check if record already exists to avoid duplicates
      const existing = await sql(
        'SELECT id FROM pressure_readings WHERE date = $1 AND category = $2',
        [record.date, record.category]
      );

      if (existing.length > 0) {
        console.log(`⏩ Skip (exists): ${record.date} ${record.category}`);
        skipped++;
        continue;
      }

      await sql(
        'INSERT INTO pressure_readings (systolic, diastolic, pulse, category, date, notes) VALUES ($1, $2, $3, $4, $5, $6)',
        [record.systolic, record.diastolic, record.pulse, record.category, record.date, 'Historical Data']
      );
      console.log(`✅ Inserted: ${record.date} ${record.category} — ${record.systolic}/${record.diastolic}`);
      inserted++;
    }

    console.log('\n🎉 Seed complete!');
    console.log(`   ✅ Inserted: ${inserted}`);
    console.log(`   ⏩ Skipped (duplicates): ${skipped}`);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
