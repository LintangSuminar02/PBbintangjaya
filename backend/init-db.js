import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'badminton_db'}`);
  await connection.query(`USE ${process.env.DB_NAME || 'badminton_db'}`);

  console.log('Database created or already exists.');

  // Users Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      membership_status VARCHAR(50) DEFAULT 'Regular',
      points INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courts Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS courts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100),
      location VARCHAR(255),
      price INT DEFAULT 0,
      status ENUM('Active', 'Maintenance', 'Repair') DEFAULT 'Active',
      image LONGTEXT
    )
  `);

  // Bookings Table (FCFS relevant: created_at)
  await connection.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      court_id INT,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
      payment_status ENUM('Unpaid', 'Paid') DEFAULT 'Unpaid',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (court_id) REFERENCES courts(id)
    )
  `);

  // Settings Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      brand_name VARCHAR(255) DEFAULT 'CourtFlow',
      contact_email VARCHAR(255),
      standard_rate INT DEFAULT 45000,
      peak_rate INT DEFAULT 65000,
      opening_time TIME DEFAULT '07:00:00',
      closing_time TIME DEFAULT '22:00:00'
    )
  `);

  // Member Schedules Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS member_schedules (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      member_name  VARCHAR(100) NOT NULL,
      court_id     INT NOT NULL,
      day_of_week  TINYINT NOT NULL COMMENT '1=Senin, 2=Selasa ... 7=Minggu',
      start_time   TIME NOT NULL,
      end_time     TIME NOT NULL,
      is_active    BOOLEAN DEFAULT TRUE,
      notes        VARCHAR(255),
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default admin if not exists
  const [admins] = await connection.query('SELECT * FROM users WHERE username = "admin"');
  if (admins.length === 0) {
    // Note: In real app, hash this! admin123
    await connection.query('INSERT INTO users (username, password, role) VALUES ("admin", "admin123", "admin")');
    console.log('Default admin created.');
  }

  // Seed Courts
  const [courts] = await connection.query('SELECT COUNT(*) as count FROM courts');
  if (courts[0].count === 0) {
    await connection.query(`
      INSERT INTO courts (name, type, location, price, status, image)
      VALUES 
      ('Lapangan 1', 'Sintetis', 'Gedung Utama', 45000, 'Active', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800'),
      ('Lapangan 2', 'Sintetis', 'Gedung Utama', 45000, 'Active', 'https://images.unsplash.com/photo-1545114472-c11ba7969388?auto=format&fit=crop&q=80&w=800')
    `);
    console.log('Default courts seeded.');
  }

  console.log('All tables initialized.');
  await connection.end();
}

initDB().catch(err => {
  console.error('Initialization failed:', err);
});
