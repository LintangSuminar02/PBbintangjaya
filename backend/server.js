import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // handle preflight
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ─────────────────────────────────────────────────
// Swagger / OpenAPI Setup
// ─────────────────────────────────────────────────
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '🏸 CourtFlow API',
    version: '1.0.0',
    description:
      'REST API untuk sistem reservasi lapangan bulu tangkis **CourtFlow**. ' +
      'Mendukung booking publik (tanpa login), manajemen lapangan, jadwal member PB, dan sistem FCFS.',
    contact: { name: 'CourtFlow Admin', email: 'admin@courtflow.id' },
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Development Server' },
  ],
  tags: [
    { name: 'Auth',             description: 'Login & Registrasi pengguna' },
    { name: 'Courts',           description: 'Manajemen lapangan bulu tangkis' },
    { name: 'Bookings',         description: 'Pemesanan lapangan (sistem FCFS)' },
    { name: 'Users',            description: 'Manajemen pengguna' },
    { name: 'Settings',         description: 'Pengaturan sistem & tarif' },
    { name: 'Member Schedules', description: 'Jadwal tetap mingguan member PB' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan token JWT yang didapat dari endpoint /api/login',
      },
    },
    schemas: {
      Court: {
        type: 'object',
        properties: {
          id:       { type: 'integer',  example: 1 },
          name:     { type: 'string',   example: 'Lapangan 1' },
          type:     { type: 'string',   example: 'Sintetis' },
          location: { type: 'string',   example: 'Gedung A, Lantai 2' },
          price:    { type: 'integer',  example: 45000 },
          status:   { type: 'string',   enum: ['Active', 'Maintenance', 'Repair'], example: 'Active' },
          image:    { type: 'string',   example: 'https://example.com/court.jpg' },
        },
      },
      CourtInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name:     { type: 'string',  example: 'Lapangan 3' },
          type:     { type: 'string',  example: 'Parquet' },
          location: { type: 'string',  example: 'Gedung B' },
          price:    { type: 'integer', example: 50000 },
          status:   { type: 'string',  enum: ['Active', 'Maintenance', 'Repair'], example: 'Active' },
          image:    { type: 'string',  example: 'https://example.com/img.jpg' },
        },
      },
      Booking: {
        type: 'object',
        properties: {
          id:                 { type: 'integer', example: 1 },
          user_id:            { type: 'integer', example: 2, nullable: true },
          court_id:           { type: 'integer', example: 1 },
          court_name:         { type: 'string',  example: 'Lapangan 1' },
          customer_name:      { type: 'string',  example: 'John Doe' },
          customer_full_name: { type: 'string',  example: 'John Doe' },
          customer_email:     { type: 'string',  example: 'john@example.com' },
          booking_date:       { type: 'string',  format: 'date',  example: '2025-05-20' },
          start_time:         { type: 'string',  example: '08:00:00' },
          end_time:           { type: 'string',  example: '09:00:00' },
          total_price:        { type: 'integer', example: 47250 },
          payment_method:     { type: 'string',  enum: ['Bank Transfer', 'E-Wallet'], example: 'Bank Transfer' },
          payment_status:     { type: 'string',  enum: ['Unpaid', 'Paid'], example: 'Unpaid' },
          status:             { type: 'string',  enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'Rejected'], example: 'Pending' },
          created_at:         { type: 'string',  format: 'date-time' },
        },
      },
      BookingInput: {
        type: 'object',
        required: ['court_id', 'booking_date', 'start_time', 'end_time', 'total_price', 'payment_method', 'customer_email', 'customer_full_name'],
        properties: {
          user_id:            { type: 'integer', example: 2, nullable: true },
          court_id:           { type: 'integer', example: 1 },
          booking_date:       { type: 'string',  format: 'date',  example: '2025-05-20' },
          start_time:         { type: 'string',  example: '08:00' },
          end_time:           { type: 'string',  example: '09:00' },
          total_price:        { type: 'integer', example: 47250 },
          payment_method:     { type: 'string',  enum: ['Bank Transfer', 'E-Wallet'], example: 'Bank Transfer' },
          customer_email:     { type: 'string',  example: 'john@example.com' },
          customer_full_name: { type: 'string',  example: 'John Doe' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id:               { type: 'integer', example: 1 },
          username:         { type: 'string',  example: 'john_doe' },
          email:            { type: 'string',  example: 'john@example.com' },
          role:             { type: 'string',  enum: ['admin', 'user'], example: 'user' },
          membership_status:{ type: 'string',  example: 'Regular' },
          points:           { type: 'integer', example: 0 },
        },
      },
      MemberSchedule: {
        type: 'object',
        properties: {
          id:          { type: 'integer', example: 1 },
          member_name: { type: 'string',  example: 'PB Garuda' },
          court_id:    { type: 'integer', example: 1 },
          day_of_week: { type: 'integer', example: 1, description: '1=Senin ... 7=Minggu' },
          start_time:  { type: 'string',  example: '07:00:00' },
          end_time:    { type: 'string',  example: '09:00:00' },
          is_active:   { type: 'boolean', example: true },
          notes:       { type: 'string',  example: 'Latihan rutin' },
        },
      },
      Settings: {
        type: 'object',
        properties: {
          brand_name:     { type: 'string',  example: 'CourtFlow' },
          contact_email:  { type: 'string',  example: 'admin@courtflow.id' },
          standard_rate:  { type: 'integer', example: 45000 },
          peak_rate:      { type: 'integer', example: 65000 },
          opening_time:   { type: 'string',  example: '07:00:00' },
          closing_time:   { type: 'string',  example: '22:00:00' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string',  example: 'Operasi berhasil.' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string',  example: 'Terjadi kesalahan.' },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: ['./server.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: '🏸 CourtFlow API Docs',
  customCss: `.swagger-ui .topbar { background-color: #1A4B9F; } .swagger-ui .topbar-wrapper img { content: none; } .swagger-ui .topbar-wrapper::after { content: "🏸 CourtFlow API"; color: white; font-size: 1.2rem; font-weight: bold; }`,
}));
// Raw JSON spec endpoint
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// --- Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ─────────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login pengguna atau admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: admin }
 *               password: { type: string, example: admin123 }
 *     responses:
 *       200:
 *         description: Login berhasil, kembalikan JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 token:   { type: string,  example: eyJhbGciOiJIUzI1NiJ9... }
 *                 user:    { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Username atau password salah
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
// --- Auth Routes ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.status(401).json({ success: false, message: 'User not found' });

    const user = users[0];
    const isMatch = (password === user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'supersecretkey');
      res.json({ 
        success: true, 
        token,
        user: { id: user.id, name: user.username, username: user.username, email: user.email || '', role: user.role }
      });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register new user
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(409).json({ success: false, message: 'Username sudah digunakan.' });
    await db.query(
      'INSERT INTO users (username, password, email, role, membership_status, points) VALUES (?, ?, ?, "user", "Standard", 0)',
      [username, password, email || '']
    );
    res.json({ success: true, message: 'Akun berhasil dibuat.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: Daftar akun pengguna baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: john_doe }
 *               password: { type: string, example: secret123 }
 *               email:    { type: string, example: john@example.com }
 *     responses:
 *       200:
 *         description: Akun berhasil dibuat
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       409:
 *         description: Username sudah digunakan
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

// --- Admin Management Routes ---

app.get('/api/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, name, email, role, created_at FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, name, email, role } = req.body;
  try {
    // Note: In real app, we should hash password. For simplicity in current stack:
    await db.query(
      'INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)',
      [username, password, name, email, role || 'admin']
    );
    res.json({ success: true, message: 'Admin berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, name, email, role } = req.body;
  try {
    if (password) {
      await db.query(
        'UPDATE users SET username = ?, password = ?, name = ?, email = ?, role = ? WHERE id = ?',
        [username, password, name, email, role, id]
      );
    } else {
      await db.query(
        'UPDATE users SET username = ?, name = ?, email = ?, role = ? WHERE id = ?',
        [username, name, email, role, id]
      );
    }
    res.json({ success: true, message: 'Admin berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'Admin berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────
// COURT ROUTES
// ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/courts:
 *   get:
 *     tags: [Courts]
 *     summary: Ambil semua data lapangan
 *     responses:
 *       200:
 *         description: Daftar lapangan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Court' }
 *   post:
 *     tags: [Courts]
 *     summary: Tambah lapangan baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CourtInput' }
 *     responses:
 *       200:
 *         description: Lapangan berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - { $ref: '#/components/schemas/SuccessResponse' }
 *                 - type: object
 *                   properties:
 *                     id: { type: integer, example: 3 }
 *       400:
 *         description: Nama lapangan wajib diisi
 */
// --- Court Routes ---
app.get('/api/courts', async (req, res) => {
  try {
    const [courts] = await db.query('SELECT * FROM courts');
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Booking Routes (FCFS Implementation) ---
app.get('/api/bookings', async (req, res) => {
  try {
    await db.query("SET timezone = 'Asia/Jakarta'");
    const [bookings] = await db.query(`
      SELECT 
        b.id, b.user_id, b.court_id, b.start_time, b.end_time, b.total_price, 
        b.payment_method, b.payment_status, b.status, b.customer_phone, b.customer_full_name, b.payment_proof, b.created_at,
        TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date,
        u.username as customer_name, 
        c.name as court_name 
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      JOIN courts c ON b.court_id = c.id
      ORDER BY b.created_at ASC
    `);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { 
    user_id, 
    court_id, 
    booking_date, 
    start_time, 
    end_time, 
    total_price, 
    payment_method, 
    customer_phone, 
    customer_full_name,
    payment_proof_base64
  } = req.body;
  
  try {
    // FCFS Check: See if there is a confirmed booking for this slot
    const [conflicts] = await db.query(`
      SELECT * FROM bookings 
      WHERE court_id = ? AND booking_date = ? AND status = 'Confirmed'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?)
      )
    `, [court_id, booking_date, start_time, start_time, end_time, end_time]);

    if (conflicts.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Slot ini sudah terpesan oleh orang lain (FCFS).' 
      });
    }

    // Process base64 file upload if provided
    let savedFilename = null;
    if (payment_proof_base64) {
      const matches = payment_proof_base64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Import dynamic fs if not at top, but we will import it or use dynamic import/fs module
        const fs = await import('fs');
        const uploadsDir = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        savedFilename = `proof-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
        const filePath = path.join(uploadsDir, savedFilename);
        fs.writeFileSync(filePath, buffer);
      }
    }

    // Insert directly as Confirmed & Paid (Auto-confirmed as requested)
    await db.query("SET timezone = 'Asia/Jakarta'"); // Paksa zona waktu Jakarta
    const [rows] = await db.query(
      `INSERT INTO bookings 
      (user_id, court_id, booking_date, start_time, end_time, total_price, payment_method, customer_phone, customer_full_name, status, payment_status, payment_proof) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', 'Paid', ?) RETURNING id`,
      [user_id || null, court_id, booking_date, start_time, end_time, total_price, payment_method, customer_phone, customer_full_name, savedFilename]
    );

    // FCFS auto-reject: Auto-reject all other PENDING bookings for the same court/date that overlap this time
    await db.query(`
      UPDATE bookings 
      SET status = 'Rejected'
      WHERE court_id = ? AND booking_date = ? AND status = 'Pending'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?)
      )
    `, [court_id, booking_date, start_time, start_time, end_time, end_time]);

    res.json({ 
      success: true, 
      id: rows[0].id, 
      message: 'Pemesanan berhasil dikonfirmasi secara otomatis!' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new court
app.post('/api/courts', async (req, res) => {
  const { name, type, location, price, price_night, status, image } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Nama lapangan wajib diisi.' });
  try {
    const [rows] = await db.query(
      'INSERT INTO courts (name, type, location, price, price_night, status, image) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
      [name, type || 'Sintetis', location || '', price || 0, price_night || 0, status || 'Active', image || '']
    );
    res.json({ success: true, id: rows[0].id, message: 'Lapangan berhasil ditambahkan.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/courts/{id}:
 *   patch:
 *     tags: [Courts]
 *     summary: Update data lapangan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CourtInput' }
 *     responses:
 *       200:
 *         description: Lapangan berhasil diperbarui
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *   delete:
 *     tags: [Courts]
 *     summary: Hapus lapangan (hanya jika tidak ada pesanan aktif)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lapangan berhasil dihapus
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       400:
 *         description: Lapangan masih memiliki pesanan aktif
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
// Update existing court
app.patch('/api/courts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, location, price, price_night, status, image } = req.body;
  try {
    await db.query(
      'UPDATE courts SET name = ?, type = ?, location = ?, price = ?, price_night = ?, status = ?, image = ? WHERE id = ?',
      [name, type, location, price, price_night, status, image, id]
    );
    res.json({ success: true, message: 'Lapangan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete court
app.delete('/api/courts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Cascade delete is now handled by DB (ON DELETE CASCADE)
    await db.query('DELETE FROM courts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Lapangan dan semua pesanannya berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────
// BOOKING ROUTES
// ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Ambil semua data pemesanan (join nama user & lapangan)
 *     responses:
 *       200:
 *         description: Daftar semua booking, urut dari yang pertama masuk (FCFS)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Booking' }
 *   post:
 *     tags: [Bookings]
 *     summary: Buat booking baru (cek konflik FCFS)
 *     description: |
 *       Membuat booking baru dengan status **Pending**. Sistem memeriksa apakah ada booking
 *       yang sudah `Confirmed` di slot yang sama — jika ada, booking ditolak otomatis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookingInput' }
 *     responses:
 *       200:
 *         description: Booking berhasil dibuat (status Pending)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - { $ref: '#/components/schemas/SuccessResponse' }
 *                 - type: object
 *                   properties:
 *                     id: { type: integer, example: 5 }
 *       400:
 *         description: Slot sudah terpesan oleh orang lain (FCFS)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @swagger
 * /api/bookings/{id}/confirm:
 *   patch:
 *     tags: [Bookings]
 *     summary: Konfirmasi booking (trigger FCFS auto-reject)
 *     description: |
 *       Mengonfirmasi satu booking dan **otomatis menolak** semua booking Pending lain
 *       yang bentrok di court + tanggal + jam yang sama.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Booking dikonfirmasi, pesanan bentrok auto-rejected
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       404:
 *         description: Booking tidak ditemukan
 */

/**
 * @swagger
 * /api/bookings/{id}/reject:
 *   patch:
 *     tags: [Bookings]
 *     summary: Tolak booking secara manual oleh admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Pesanan berhasil ditolak
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       404:
 *         description: Booking tidak ditemukan
 */
// Admin action to manually reject a booking
app.patch('/api/bookings/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Booking tidak ditemukan.' });
    await db.query("UPDATE bookings SET status = 'Rejected' WHERE id = ?", [id]);
    res.json({ success: true, message: 'Pesanan berhasil ditolak.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/bookings/{id}/payment:
 *   patch:
 *     tags: [Bookings]
 *     summary: Update status pembayaran booking (Paid / Unpaid)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [payment_status]
 *             properties:
 *               payment_status:
 *                 type: string
 *                 enum: [Paid, Unpaid]
 *                 example: Paid
 *     responses:
 *       200:
 *         description: Status pembayaran berhasil diperbarui
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       400:
 *         description: Status pembayaran tidak valid
 */
// Admin action to toggle payment status (Unpaid <-> Paid)
app.patch('/api/bookings/:id/payment', async (req, res) => {
  const { id } = req.params;
  const { payment_status } = req.body;
  if (!['Paid', 'Unpaid'].includes(payment_status)) {
    return res.status(400).json({ success: false, message: 'Status pembayaran tidak valid.' });
  }
  try {
    await db.query('UPDATE bookings SET payment_status = ? WHERE id = ?', [payment_status, id]);
    res.json({ success: true, message: `Status pembayaran diperbarui menjadi ${payment_status}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin action to confirm booking (FCFS: auto-reject all other pending for same slot)
app.patch('/api/bookings/:id/confirm', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Get the booking being confirmed
    const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
    const booking = rows[0];

    // 2. Confirm this booking
    await db.query("UPDATE bookings SET status = 'Confirmed' WHERE id = ?", [id]);

    // 3. FCFS: Auto-reject all other PENDING bookings for the same court/date that overlap this time
    await db.query(`
      UPDATE bookings 
      SET status = 'Rejected'
      WHERE id != ? 
        AND court_id = ? 
        AND booking_date = ? 
        AND status = 'Pending'
        AND (
          (start_time < ? AND end_time > ?) OR
          (start_time < ? AND end_time > ?)
        )
    `, [id, booking.court_id, booking.booking_date, 
        booking.end_time, booking.start_time,
        booking.end_time, booking.start_time]);

    res.json({ success: true, message: 'Pesanan dikonfirmasi. Pesanan lain yang bentrok otomatis ditolak (FCFS).' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────
// USER ROUTES
// ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Ambil semua pengguna terdaftar
 *     responses:
 *       200:
 *         description: Daftar pengguna
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Hapus pengguna (proteksi admin & pesanan aktif)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       400:
 *         description: User masih memiliki pesanan aktif
 *       403:
 *         description: Tidak bisa menghapus akun admin
 *       404:
 *         description: User tidak ditemukan
 */
// --- User Routes ---
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email, role, membership_status, points FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (cannot delete admin or user with active bookings)
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    if (rows[0].role === 'admin') return res.status(403).json({ success: false, message: 'Tidak bisa menghapus akun admin.' });
    const [activeBookings] = await db.query(
      "SELECT id FROM bookings WHERE user_id = ? AND status IN ('Pending', 'Confirmed')",
      [id]
    );
    if (activeBookings.length > 0) {
      return res.status(400).json({ success: false, message: 'Tidak bisa menghapus user yang masih memiliki pesanan aktif.' });
    }
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'User berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────
// SETTINGS ROUTES
// ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/settings:
 *   get:
 *     tags: [Settings]
 *     summary: Ambil pengaturan sistem
 *     responses:
 *       200:
 *         description: Data pengaturan
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Settings' }
 *   put:
 *     tags: [Settings]
 *     summary: Update pengaturan sistem (brand, tarif, email)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand_name:    { type: string,  example: CourtFlow }
 *               contact_email: { type: string,  example: admin@courtflow.id }
 *               standard_rate: { type: integer, example: 45000 }
 *               peak_rate:     { type: integer, example: 65000 }
 *     responses:
 *       200:
 *         description: Pengaturan berhasil diperbarui
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 */
// --- Settings Routes ---
app.get('/api/settings', async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM settings LIMIT 1');
    res.json(settings[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  const { brand_name, contact_email, standard_rate, peak_rate } = req.body;
  try {
    await db.query(`
      UPDATE settings SET 
      brand_name = ?, contact_email = ?, standard_rate = ?, peak_rate = ?
      WHERE id = 1
    `, [brand_name, contact_email, standard_rate, peak_rate]);
    res.json({ success: true, message: 'Pengaturan diperbarui.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Member Schedule Routes (PB Member Fixed Weekly Slots) ---

// Init table if not exists
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS member_schedules (
        id           SERIAL PRIMARY KEY,
        member_name  VARCHAR(100) NOT NULL,
        court_id     INT NOT NULL,
        day_of_week  SMALLINT NOT NULL,
        start_time   TIME NOT NULL,
        end_time     TIME NOT NULL,
        is_active    BOOLEAN DEFAULT TRUE,
        notes        VARCHAR(255),
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('member_schedules table ready.');
  } catch (err) {
    console.error('member_schedules init error:', err);
  }
})();

// ─────────────────────────────────────────────────
// MEMBER SCHEDULE ROUTES
// ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/member-schedules:
 *   get:
 *     tags: [Member Schedules]
 *     summary: Ambil semua jadwal tetap member PB
 *     responses:
 *       200:
 *         description: Daftar jadwal member, urut per hari & jam
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/MemberSchedule' }
 *   post:
 *     tags: [Member Schedules]
 *     summary: Tambah jadwal tetap baru untuk member PB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [member_name, court_id, day_of_week, start_time, end_time]
 *             properties:
 *               member_name: { type: string,  example: PB Garuda }
 *               court_id:    { type: integer, example: 1 }
 *               day_of_week: { type: integer, example: 1, description: '1=Senin ... 7=Minggu' }
 *               start_time:  { type: string,  example: '07:00' }
 *               end_time:    { type: string,  example: '09:00' }
 *               notes:       { type: string,  example: Latihan rutin mingguan }
 *               is_active:   { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Jadwal member berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 */

/**
 * @swagger
 * /api/member-schedules/{id}:
 *   patch:
 *     tags: [Member Schedules]
 *     summary: Update jadwal member (partial update)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_name: { type: string }
 *               court_id:    { type: integer }
 *               day_of_week: { type: integer }
 *               start_time:  { type: string }
 *               end_time:    { type: string }
 *               is_active:   { type: boolean }
 *               notes:       { type: string }
 *     responses:
 *       200:
 *         description: Jadwal berhasil diperbarui
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *   delete:
 *     tags: [Member Schedules]
 *     summary: Hapus jadwal tetap member PB
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Jadwal berhasil dihapus
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 */
app.get('/api/member-schedules', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM member_schedules ORDER BY day_of_week ASC, start_time ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/member-schedules', async (req, res) => {
  const { member_name, court_id, day_of_week, start_time, end_time, notes, is_active } = req.body;
  try {
    await db.query(
      'INSERT INTO member_schedules (member_name, court_id, day_of_week, start_time, end_time, notes, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [member_name, court_id, day_of_week, start_time, end_time, notes || '', is_active !== false]
    );
    res.json({ success: true, message: 'Jadwal member ditambahkan.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/member-schedules/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  try {
    const sets = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    const vals = [...Object.values(fields), id];
    await db.query(`UPDATE member_schedules SET ${sets} WHERE id = ?`, vals);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/member-schedules/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM member_schedules WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
