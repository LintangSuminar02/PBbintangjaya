import db from './db.js';

async function migrate() {
  try {
    console.log('Migrating users table...');
    
    // Check if columns exist first (optional, but safer with IF NOT EXISTS in some SQL versions)
    // For MySQL 8.0.19+, we can use ADD COLUMN IF NOT EXISTS, but for older we might need separate checks.
    // We'll try the common way.
    
    try {
      await db.query('ALTER TABLE users ADD COLUMN name VARCHAR(100)');
      console.log('Added column: name');
    } catch (e) {
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('Column name already exists.');
      else throw e;
    }

    try {
      await db.query('ALTER TABLE users ADD COLUMN email VARCHAR(100)');
      console.log('Added column: email');
    } catch (e) {
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('Column email already exists.');
      else throw e;
    }

    try {
      await db.query('ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT "admin"');
      console.log('Added column: role');
    } catch (e) {
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('Column role already exists.');
      else throw e;
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
