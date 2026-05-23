import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function migrate() {
  const pool = new pg.Pool({
    ...(process.env.DATABASE_URL 
      ? { 
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        } 
      : {
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASS || '',
          database: process.env.DB_NAME || 'badminton_db',
          port: process.env.DB_PORT || 5432,
        })
  });

  try {
    await pool.query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS midtrans_order_id VARCHAR(255);');
    console.log('Successfully added midtrans_order_id to bookings table.');
  } catch (error) {
    console.error('Error altering table:', error);
  } finally {
    await pool.end();
  }
}

migrate();
