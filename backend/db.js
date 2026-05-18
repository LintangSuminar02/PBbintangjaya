import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  ...(process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL.replace(/['"]/g, '').trim(),
        ssl: { rejectUnauthorized: false } // Required for Supabase
      } 
    : {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'badminton_db',
        port: process.env.DB_PORT || 5432,
      })
});

// Wrapper to mimic mysql2 interface for existing queries
export default {
  query: async (sql, params = []) => {
    // Convert ? to $1, $2, etc.
    let i = 1;
    const pgSql = sql.replace(/\?/g, () => `$${i++}`);
    const result = await pool.query(pgSql, params);
    // mysql2 returns [rows, fields]
    return [result.rows, result.fields];
  },
  pool // expose original pool if needed
};
