import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function initDB() {
  const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'badminton_db',
    port: process.env.DB_PORT || 5432,
    // ssl: { rejectUnauthorized: false }
  });

  console.log('Connected to PostgreSQL...');

  // Users Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      email VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      membership_status VARCHAR(50) DEFAULT 'Regular',
      points INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courts Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS courts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100),
      location VARCHAR(255),
      price INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Active',
      image TEXT
    )
  `);

  // Bookings Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INT,
      court_id INT,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      total_price INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Pending',
      payment_method VARCHAR(50),
      payment_status VARCHAR(50) DEFAULT 'Unpaid',
      customer_phone VARCHAR(50),
      customer_full_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (court_id) REFERENCES courts(id)
    )
  `);

  // Settings Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      brand_name VARCHAR(255) DEFAULT 'CourtFlow',
      contact_email VARCHAR(255),
      standard_rate INT DEFAULT 45000,
      peak_rate INT DEFAULT 65000,
      opening_time TIME DEFAULT '07:00:00',
      closing_time TIME DEFAULT '22:00:00'
    )
  `);

  // Member Schedules Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS member_schedules (
      id SERIAL PRIMARY KEY,
      member_name VARCHAR(100) NOT NULL,
      court_id INT NOT NULL,
      day_of_week SMALLINT NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      notes VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default admin if not exists
  const admins = await pool.query("SELECT * FROM users WHERE username = 'admin'");
  if (admins.rows.length === 0) {
    // Note: In real app, hash this! admin123
    await pool.query("INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin')");
    console.log('Default admin created.');
  }

  // Seed Courts
  const courts = await pool.query('SELECT COUNT(*) as count FROM courts');
  if (parseInt(courts.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO courts (name, type, location, price, status, image)
      VALUES 
      ('Lapangan 1', 'Sintetis', 'Gedung Utama', 45000, 'Active', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800'),
      ('Lapangan 2', 'Sintetis', 'Gedung Utama', 45000, 'Active', 'https://images.unsplash.com/photo-1545114472-c11ba7969388?auto=format&fit=crop&q=80&w=800')
    `);
    console.log('Default courts seeded.');
  }

  console.log('All tables initialized for PostgreSQL.');
  await pool.end();
}

initDB().catch(err => {
  console.error('Initialization failed:', err);
});
