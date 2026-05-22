# DOKUMEN USER ACCEPTANCE TESTING (UAT)
## SISTEM INFORMASI BOOKING LAPANGAN BADMINTON - HALL BINTANG JAYA SPORT

Dokumen ini berisi panduan pengujian penerimaan pengguna (**User Acceptance Testing / UAT**) untuk memastikan bahwa seluruh fungsi dan alur kerja aplikasi **HALL BINTANG JAYA SPORT** telah berjalan sesuai dengan persyaratan bisnis dan ekspektasi pengguna.

---

## 📌 DAFTAR ISI
1. [Peran Pengguna (Roles)](#-peran-pengguna-roles)
2. [Prasyarat Pengujian (Prerequisites)](#-prasyarat-pengujian-prerequisites)
3. [Format Tabel Lembar Pengujian](#-format-tabel-lembar-pengujian)
4. [Skenario UAT - Peran Pelanggan (Customer)](#-skenario-uat---peran-pelanggan-customer)
5. [Skenario UAT - Peran Administrator (Admin)](#-skenario-uat---peran-administrator-admin)
6. [Lembar Persetujuan (Sign-off Sheet)](#-lembar-persetujuan-sign-off-sheet)

---

## 👥 PERAN PENGGUNA (ROLES)
Pengujian UAT ini dibagi menjadi 2 peran utama:
1. **Pelanggan (Customer / Guest):** Pengguna umum yang berinteraksi dengan sistem untuk melihat ketersediaan lapangan, melakukan pemesanan (booking), melakukan pembayaran, serta melihat riwayat status transaksi pemesanan mereka secara real-time.
2. **Administrator (Admin):** Pengelola sistem yang memiliki hak akses penuh untuk melakukan verifikasi pembayaran, mengubah status pemesanan, mengelola data lapangan (tambah/edit/hapus), menjadwalkan member tetap PB, serta mengatur variabel operasional sistem.

---

## 📋 PRASYARAT PENGUJIAN (PREREQUISITES)
Sebelum memulai proses pengujian UAT, pastikan hal-hal berikut sudah dipersiapkan:
- Aplikasi frontend dan backend sudah berjalan secara lokal (`http://localhost:5173` atau port yang sesuai).
- Koneksi database aktif dan memiliki data dummy (seperti daftar lapangan awal).
- Browser modern (Google Chrome / Mozilla Firefox / Safari) yang mendukung JavaScript.
- Handphone dengan nomor WhatsApp aktif (untuk simulasi pengisian form WhatsApp).

---

## 📄 FORMAT TABEL LEMBAR PENGUJIAN
Gunakan format di bawah ini untuk mencatat hasil pengujian untuk setiap test case:

| Status Pengujian | Keterangan |
| :---: | :--- |
| **🟢 PASS** | Fitur berjalan dengan sangat baik dan sesuai dengan hasil yang diharapkan. |
| **🟡 CONDITIONAL** | Fitur berjalan, namun ada catatan kecil atau minor defect yang perlu disempurnakan. |
| **🔴 FAIL** | Fitur tidak berfungsi, terjadi error/crash, atau tidak sesuai dengan alur sistem. |

---

## 🏸 SKENARIO UAT - PERAN PELANGGAN (CUSTOMER)

### Modul A: Landing Page & Pencarian Cepat
Melihat visualisasi awal website dan melakukan pencarian cepat lapangan badminton.

| ID Test Case | UAT-CUST-001 |
| :--- | :--- |
| **Nama Pengujian** | Navigasi Landing Page & Pencarian Cepat Lapangan |
| **Prasyarat** | Halaman utama (`explore` / `/`) telah dimuat dengan benar. |
| **Langkah Pengujian** | 1. Buka browser dan arahkan ke alamat website utama.<br>2. Perhatikan bagian header, hero section, daftar lapangan, dan footer.<br>3. Pada bagian *Quick Search*, masukkan Nama Pemesan dan pilih Tanggal Pemesanan.<br>4. Klik tombol "Cari Lapangan". |
| **Hasil Yang Diharapkan** | - Halaman termuat dengan responsif, visual modern, tanpa elemen gambar pecah.<br>- Input nama pemesan dan pilihan tanggal tersimpan dalam state.<br>- Pengguna diarahkan ke halaman Jadwal (`SchedulePage`) dengan filter pencarian cepat yang aktif secara otomatis. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

### Modul B: Pemeriksaan Jadwal & Pemilihan Slot
Melihat ketersediaan lapangan berdasarkan waktu operasional secara real-time.

| ID Test Case | UAT-CUST-002 |
| :--- | :--- |
| **Nama Pengujian** | Pemeriksaan Jadwal Lapangan (Desktop vs Mobile) |
| **Prasyarat** | Berada di halaman `SchedulePage` ('schedule'). |
| **Langkah Pengujian** | 1. Periksa header jadwal yang menampilkan rentang tanggal Senin-Minggu.<br>2. Gunakan tombol navigasi panah kiri/kanan ("Minggu Ke-x") untuk mengganti minggu operasional.<br>3. (Desktop) Perhatikan tampilan tabel grid 7 hari secara horizontal.<br>4. (Mobile - perkecil layar browser) Perhatikan transisi ke pemilih hari horizontal (Tab selector) dan tabel grid yang memfokuskan satu hari aktif saja. |
| **Hasil Yang Diharapkan** | - Rentang tanggal dihitung secara tepat berdasarkan timezone.<br>- Mengubah filter minggu mengubah tanggal yang tampil secara dinamis.<br>- Tampilan berpindah secara adaptif dan mulus sesuai ukuran layar (responsive design). |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

<br>

| ID Test Case | UAT-CUST-003 |
| :--- | :--- |
| **Nama Pengujian** | Pemilihan Slot Waktu Lapangan (Kondisi Slot Berbeda) |
| **Prasyarat** | Berada di halaman jadwal dengan data status slot (Kosong, Terisi, Tutup/Past). |
| **Langkah Pengujian** | 1. Arahkan kursor ke slot waktu yang berstatus lampau (Past hours) atau sebelum hari/jam saat ini.<br>2. Coba klik slot lampau tersebut.<br>3. Cari slot waktu yang sudah dibooking orang lain (berwarna biru/kuning dengan nama pelanggan) atau slot member tetap PB (warna ungu). Coba klik slot tersebut.<br>4. Cari slot kosong (berlabel "KOSONG" / bergaris putus-putus) dan klik slot tersebut. |
| **Hasil Yang Diharapkan** | - Slot waktu lampau tidak bisa diklik (kursor menunjukkan *not-allowed*) dan berlabel "TUTUP".<br>- Slot yang sudah dibooking/member tidak bisa diklik dan menunjukkan nama pemesan secara transparan/terisi.<br>- Slot kosong berubah warna menjadi biru pekat, bertuliskan "OK ✓", dan memicu munculnya Floating Booking Bar di bagian bawah layar. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

<br>

| ID Test Case | UAT-CUST-004 |
| :--- | :--- |
| **Nama Pengujian** | Pemesanan Slot Lapangan Ganda (Multi-slot Booking) |
| **Prasyarat** | Pengguna telah memilih minimal 1 slot kosong pada `SchedulePage`. |
| **Langkah Pengujian** | 1. Klik beberapa slot kosong tambahan pada hari yang sama atau hari berbeda dalam satu minggu.<br>2. Perhatikan informasi jumlah sesi dan total harga di Floating Booking Bar bawah.<br>3. Klik tombol "Batal" di Floating Bar.<br>4. Pilih kembali slot waktu baru, lalu klik tombol "Lanjut Bayar". |
| **Hasil Yang Diharapkan** | - Floating Booking Bar menampilkan jumlah jam yang dipilih secara akurat (misal: "Total 3 Jam").<br>- Total harga dikalkulasi dengan tepat (akumulasi harga sewa masing-masing lapangan).<br>- Mengeklik "Batal" membersihkan seluruh slot yang dipilih.<br>- Mengeklik "Lanjut Bayar" mengarahkan pengguna ke halaman Pembayaran (`PaymentPage`) dengan membawa seluruh data sesi terpilih secara lengkap. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

### Modul C: Formulir Detail Pemesanan & Pembayaran
Mengisi data pemesanan dan memilih metode pembayaran.

| ID Test Case | UAT-CUST-005 |
| :--- | :--- |
| **Nama Pengujian** | Validasi Pengisian Form & Rincian Pembayaran |
| **Prasyarat** | Berada di halaman `PaymentPage` ('payment') dengan slot terkonfirmasi. |
| **Langkah Pengujian** | 1. Periksa rincian biaya lapangan, pajak layanan (5%), dan kalkulasi total bayar.<br>2. Biarkan kolom "Nama Pemesan" dan "Nomor WhatsApp" kosong, kemudian langsung klik tombol "Konfirmasi Pembayaran".<br>3. Isi kolom Nama Pemesan, namun kosongkan Nomor WhatsApp, lalu klik konfirmasi.<br>4. Lengkapi kedua kolom tersebut dengan format valid. |
| **Hasil Yang Diharapkan** | - Rincian harga lapangan dan pajak layanan (5%) dihitung secara tepat.<br>- Sistem memunculkan notifikasi Toast Error: *"Mohon lengkapi Nama dan Nomor WhatsApp Anda"* ketika salah satu/kedua input kosong.<br>- Tombol konfirmasi berjalan tanpa error ketika semua data terisi. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

<br>

| ID Test Case | UAT-CUST-006 |
| :--- | :--- |
| **Nama Pengujian** | Pemilihan Metode Pembayaran & Penyelesaian Pemesanan |
| **Prasyarat** | Form pemesanan di `PaymentPage` telah diisi lengkap. |
| **Langkah Pengujian** | 1. Coba klik opsi metode pembayaran "Transfer Bank" (ikon Landmark).<br>2. Ganti pilihan ke metode pembayaran "E-Wallet / QRIS" (ikon Wallet).<br>3. Perhatikan efek perubahan visual dari metode terpilih.<br>4. Klik tombol "Konfirmasi Pembayaran" untuk memproses sewa. |
| **Hasil Yang Diharapkan** | - Metode pembayaran terpilih mendapatkan fokus visual khusus (warna biru, bayangan halus, ikon aktif).<br>- Tombol berubah status menjadi loading ("Memproses...") saat diklik.<br>- Jika berhasil, memicu Toast Success: *"Pemesanan X Slot Berhasil! Menunggu verifikasi pembayaran."* dan pengguna diarahkan ke halaman Riwayat Pemesanan (`MyBookings`). |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

### Modul D: Riwayat Pemesanan & Polling Real-time
Melihat status transaksi pemesanan secara transparan.

| ID Test Case | UAT-CUST-007 |
| :--- | :--- |
| **Nama Pengujian** | Fitur Pencarian & Filter Status Riwayat Pemesanan |
| **Prasyarat** | Berada di halaman `MyBookings` ('my-bookings') yang menampilkan daftar riwayat. |
| **Langkah Pengujian** | 1. Masukkan nama pemesan atau nama lapangan pada kolom pencarian riwayat.<br>2. Klik filter status "Semua", "Terkonfirmasi" (Confirmed), "Menunggu" (Pending), dan "Ditolak" (Rejected) secara bergantian.<br>3. Perhatikan penyaringan daftar yang tampil. |
| **Hasil Yang Diharapkan** | - Daftar booking langsung tersaring secara dinamis (real-time filtering) sesuai karakter pencarian.<br>- Filter status menyaring data dengan tepat: hanya menampilkan data dengan status Confirmed saat filter "Terkonfirmasi" aktif, dst.<br>- Jika pencarian tidak menemukan hasil, tampil ikon riwayat abu-abu dan tulisan *"Tidak ada pesanan ditemukan."* |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

<br>

| ID Test Case | UAT-CUST-008 |
| :--- | :--- |
| **Nama Pengujian** | Fitur Polling Data Otomatis (Real-time Sync) |
| **Prasyarat** | Halaman `MyBookings` aktif dan terbuka di browser pelanggan. |
| **Langkah Pengujian** | 1. Buat pemesanan baru yang berstatus "Menunggu" (Pending).<br>2. Di tab/browser lain, masuk sebagai Admin dan lakukan konfirmasi (Confirm) terhadap pesanan tersebut.<br>3. Kembali ke layar browser pelanggan (tanpa melakukan refresh manual).<br>4. Tunggu beberapa detik (estimasi 5-10 detik interval polling) dan lihat perubahan statusnya. |
| **Hasil Yang Diharapkan** | - Status pemesanan pelanggan berubah secara otomatis dari "Menunggu" (Pending - warna kuning) menjadi "Terkonfirmasi" (Confirmed - warna hijau).<br>- Perubahan terjadi secara otomatis berkat fungsi interval polling 10 detik tanpa menyebabkan layar berkedip/lag. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

### Modul E: Monitor Jadwal Fullscreen
Melihat monitor jadwal digital lapangan (biasanya diletakkan di lobby PB).

| ID Test Case | UAT-CUST-009 |
| :--- | :--- |
| **Nama Pengujian** | Tampilan Layar Monitor (Fullscreen Display Mode) |
| **Prasyarat** | Pengguna berada di halaman mana pun selain Dasbor Admin. |
| **Langkah Pengujian** | 1. Temukan dan klik tombol ikon Monitor (bulat biru, mengambang di pojok kanan bawah layar).<br>2. Perhatikan transisi layar menuju mode Fullscreen monitor.<br>3. Amati susunan informasi jadwal berjalan (scoreboard-style).<br>4. Klik tombol "Exit/Kembali" untuk keluar dari Display Mode. |
| **Hasil Yang Diharapkan** | - Tombol monitor menampilkan tooltip yang jelas.<br>- Halaman bertransisi menjadi format papan jadwal interaktif layar penuh (Fullscreen overlay) tanpa header/footer standar.<br>- Mengeklik exit mengembalikan pengguna ke halaman utama (explore) dengan mulus. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

## 🔑 SKENARIO UAT - PERAN ADMINISTRATOR (ADMIN)

### Modul F: Otentikasi Admin
Masuk dan keluar dari panel administrator secara aman.

| ID Test Case | UAT-ADM-001 |
| :--- | :--- |
| **Nama Pengujian** | Otentikasi Admin (Login & Logout) |
| **Prasyarat** | Mengakses halaman `admin-dashboard` dari sistem. |
| **Langkah Pengujian** | 1. Akses menu Admin, jika belum login, sistem harus menampilkan `LoginPage`.<br>2. Masukkan kredensial admin (Username & Password) lalu klik tombol Login.<br>3. Perhatikan pengalihan ke halaman Dashboard utama.<br>4. Klik tombol "Keluar" (Logout) pada bagian menu sidebar bawah. |
| **Hasil Yang Diharapkan** | - Jika kredensial valid, token disimpan ke `localStorage` dan dasbor admin dimuat dengan sukses.<br>- Jika kredensial salah, menampilkan notifikasi error.<br>- Ketika logout diklik, token dihapus dari `localStorage` dan halaman langsung dialihkan kembali ke tampilan pelanggan umum (explore). |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

### Modul G: Dasbor & Manajemen Lapangan
Membaca performa sewa dan mengelola inventaris lapangan fisik.

| ID Test Case | UAT-ADM-002 |
| :--- | :--- |
| **Nama Pengujian** | Dasbor Ringkasan & Grafik Statistik (Overview Tab) |
| **Prasyarat** | Login berhasil dan berada di tab "Ringkasan" (Overview). |
| **Langkah Pengujian** | 1. Amati widget statistik utama: Pendapatan Total, Total Pemesanan, Lapangan Aktif, Persentase Okupansi.<br>2. Periksa grafik tren pemesanan yang menyajikan ringkasan visual bulanan/mingguan.<br>3. Perhatikan daftar aktivitas terbaru (transaksi sewa masuk). |
| **Hasil Yang Diharapkan** | - Data numerik terisi dengan benar (tidak bernilai `null` atau `NaN`).<br>- Grafik ter-render secara interaktif dan proporsional.<br>- Ringkasan aktivitas terbaru mencantumkan data real-time dari database. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

<br>

| ID Test Case | UAT-ADM-003 |
| :--- | :--- |
| **Nama Pengujian** | Manajemen Lapangan: Tambah Lapangan Baru |
| **Prasyarat** | Berada di tab "Manajemen Lapangan" (CourtsTab). |
| **Langkah Pengujian** | 1. Klik tombol "Tambah Lapangan" (jika dalam bentuk form terpisah) atau isi form input pembuatan lapangan baru.<br>2. Masukkan data: Nama Lapangan (misal: "Lapangan 4 - Vinyl premium"), Harga per Jam, URL Foto Lapangan (atau upload), dan status operasional.<br>3. Klik tombol simpan/tambah. |
| **Hasil Yang Diharapkan** | - Form memiliki validasi input yang mencegah penyimpanan data kosong.<br>- Data terkirim ke backend via POST request, database menyimpan data baru, dan memicu Toast Success: *"Lapangan baru berhasil ditambahkan"*.<br>- Lapangan baru langsung tampil di daftar manajemen lapangan serta halaman jadwal pelanggan. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

<br>

| ID Test Case | UAT-ADM-004 |
| :--- | :--- |
| **Nama Pengujian** | Manajemen Lapangan: Edit & Hapus Lapangan |
| **Prasyarat** | Daftar lapangan di tab "Manajemen Lapangan" terisi minimal 1 data. |
| **Langkah Pengujian** | 1. Klik tombol "Edit" pada salah satu kartu lapangan.<br>2. Ubah harga sewa lapangan, lalu klik simpan.<br>3. Klik tombol "Hapus" (Delete) pada lapangan tersebut.<br>4. Konfirmasi dialog konfirmasi penghapusan. |
| **Hasil Yang Diharapkan** | - Mode edit memuat data lama lapangan ke dalam input dengan benar.<br>- Perubahan data tersimpan (PATCH request) dan menampilkan Toast Success.<br>- Tombol hapus memicu alert/dialog konfirmasi keamanan.<br>- Lapangan yang dihapus hilang dari UI manajemen dan tidak bisa diakses pelanggan lagi. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

### Modul H: Verifikasi Transaksi Booking
Mengelola antrean pesanan masuk dan memeriksa pembayaran.

| ID Test Case | UAT-ADM-005 |
| :--- | :--- |
| **Nama Pengujian** | Konfirmasi Pembayaran & Validasi Transaksi |
| **Prasyarat** | Terdapat transaksi berstatus "Menunggu" (Pending) di tab "Kelola Pesanan" (BookingsTab). |
| **Langkah Pengujian** | 1. Buka tab "Kelola Pesanan".<br>2. Temukan pesanan pelanggan berstatus "Menunggu" (Pending).<br>3. Klik tombol "Konfirmasi" (Confirm) pada baris pesanan tersebut. |
| **Hasil Yang Diharapkan** | - Status pemesanan di database diperbarui menjadi "Confirmed" (Terkonfirmasi).<br>- Pemicu Toast Success: *"Pesanan berhasil dikonfirmasi!"* dimunculkan di layar.<br>- Baris pesanan berpindah status menjadi hijau (Terkonfirmasi) di panel Admin dan secara real-time tersinkronisasi di panel Pelanggan. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

<br>

| ID Test Case | UAT-ADM-006 |
| :--- | :--- |
| **Nama Pengujian** | Penolakan Booking (Reject Booking) |
| **Prasyarat** | Terdapat transaksi berstatus "Menunggu" (Pending) di tab "Kelola Pesanan" (BookingsTab). |
| **Langkah Pengujian** | 1. Pilih transaksi yang akan ditolak.<br>2. Klik tombol "Tolak" (Reject) pada baris transaksi tersebut.<br>3. Ketika muncul konfirmasi bertuliskan *"Tolak pesanan ini?"*, klik "OK" atau konfirmasi. |
| **Hasil Yang Diharapkan** | - Muncul dialog konfirmasi bawaan browser/modal kustom sebelum aksi dilakukan.<br>- Setelah disetujui, status transaksi berubah menjadi "Rejected" (Ditolak) dengan indikator warna merah.<br>- Slot sewa yang bersangkutan dilepaskan kembali menjadi "KOSONG" sehingga dapat dibooking pelanggan lain. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

### Modul I: Kelola Jadwal Member HALL BINTANG JAYA SPORT & Pengaturan Sistem
Menjadwalkan slot permanen untuk latihan member internal PB dan mengubah konfigurasi global.

| ID Test Case | UAT-ADM-007 |
| :--- | :--- |
| **Nama Pengujian** | Pendaftaran Slot Jadwal Member Tetap PB |
| **Prasyarat** | Berada di tab "Jadwal Member HALL BINTANG JAYA SPORT" (MemberScheduleTab). |
| **Langkah Pengujian** | 1. Buka formulir pendaftaran jadwal member tetap.<br>2. Isi Nama Member (misal: "HALL BINTANG JAYA SPORT Utama"), pilih Lapangan, pilih Hari (Senin-Minggu), masukkan Jam Mulai (misal: 19:00) dan Jam Selesai (misal: 21:00).<br>3. Klik tombol simpan. |
| **Hasil Yang Diharapkan** | - Jadwal member baru tersimpan dalam daftar member tetap.<br>- Sistem secara otomatis melakukan pemblokiran (blocking) slot pada hari dan jam tersebut di halaman jadwal pelanggan, menampilkan nama member dengan warna khusus (ungu) untuk mencegah double booking. |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

<br>

| ID Test Case | UAT-ADM-008 |
| :--- | :--- |
| **Nama Pengujian** | Pengaturan Parameter Sistem (Settings Tab) |
| **Prasyarat** | Berada di tab "Pengaturan Sistem" (SettingsTab). |
| **Langkah Pengujian** | 1. Buka tab Pengaturan.<br>2. Ubah parameter seperti Jam Operasional (Buka/Tutup), Kontak WhatsApp Admin, Persentase Pajak Layanan (%), atau Detail Rekening Transfer Bank.<br>3. Klik tombol "Simpan Pengaturan". |
| **Hasil Yang Diharapkan** | - Toast Success muncul menandakan konfigurasi berhasil diperbarui.<br>- Perubahan parameter langsung diterapkan pada aplikasi (misal: detail rekening transfer baru langsung muncul di `PaymentPage` pelanggan saat memesan lapangan). |
| **Status Pengujian** | **[  ] PASS  /  [  ] CONDITIONAL  /  [  ] FAIL** |
| **Catatan Penguji** | |

---

## 📝 LEMBAR PERSETUJUAN (SIGN-OFF SHEET)

Dengan menandatangani lembar persetujuan ini, para pihak menyatakan bahwa hasil pengujian sistem **HALL BINTANG JAYA SPORT** melalui rangkaian skenario di atas telah disepakati dan aplikasi dinyatakan **[ LAYAK / TIDAK LAYAK ]** untuk dipindahkan ke lingkungan produksi (Production Environment).

**Perwakilan Penguji (Tester/Client):**
```
Nama       : ____________________
Jabatan    : ____________________
Tanggal    : ____________________
Tanda Tangan:
```

**Perwakilan Pengembang (Developer Team):**
```
Nama       : ____________________
Jabatan    : ____________________
Tanggal    : ____________________
Tanda Tangan:
```
