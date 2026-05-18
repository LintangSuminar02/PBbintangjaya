import db from './db.js';

async function migrate() {
  try {
    console.log('Migrating bookings table: Changing email to phone...');
    
    // Check if customer_phone exists
    try {
      await db.query('ALTER TABLE bookings ADD COLUMN customer_phone VARCHAR(20) AFTER customer_full_name');
      console.log('Added column: customer_phone');
    } catch (e) {
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('Column customer_phone already exists.');
      else throw e;
    }

    // Copy data if needed (optional)
    // await db.query('UPDATE bookings SET customer_phone = customer_email WHERE customer_phone IS NULL');

    // Remove email column if you want to be strict, but let's keep it for now or rename it.
    // We will just stop using email in the app.

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
