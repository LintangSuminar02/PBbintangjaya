# DOKUMEN PENGUJIAN BLACK BOX (FUNGSIONAL)
## SISTEM INFORMASI BOOKING LAPANGAN BADMINTON - HALL BINTANG JAYA SPORT

Dokumen ini merekam seluruh skenario pengujian fungsional dengan metode **Black Box Testing** yang disusun berdasarkan format **PDHUPL (Perencanaan, Deskripsi, dan Hasil Uji Perangkat Lunak)**. Setiap butir pengujian menyajikan deskripsi skenario serta hasil uji dalam format tabel 3 kolom (*Yang Diharapkan*, *Pengamatan*, dan *Kesimpulan*).

---

## 👥 PENGUJIAN BLACK BOX - SISI PELANGGAN (CUSTOMER)

### 1. Fitur Pencarian Cepat Lapangan (Quick Search)

#### BB-CUST-PNC-001
Identifikasi BB-CUST-PNC-001  
Nama Kasus Uji Pencarian Cepat Lapangan  
Deskripsi Pencarian Cepat Lapangan - Input Kosong / Null  
Kondisi Awal  
- Halaman beranda website sudah berhasil dibuka  
Tanggal Pengujian  
19 Mei 2026  
Penguji Lintang Suminar  
Skenario  
1. Buka website HALL BINTANG JAYA SPORT (localhost:5173)  
2. Pada bagian *Quick Search*, kosongkan input Nama Pemesan dan Tanggal Booking  
3. Klik tombol "Cari Lapangan"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Sistem tetap mengizinkan pencarian.<br>b. Pengguna langsung dialihkan ke halaman Jadwal (`SchedulePage`) dengan menampilkan seluruh jadwal lapangan yang tersedia tanpa filter nama atau tanggal. | a. Sistem berhasil memproses pencarian tanpa input.<br>b. Pengguna dialihkan ke halaman Jadwal dan seluruh lapangan aktif termuat tanpa adanya filter yang mengunci data. | Fitur pencarian cepat dengan input kosong berfungsi dengan baik (BVA). Sistem tidak memicu error dan menampilkan data secara default. |

<br>

#### BB-CUST-PNC-002
Identifikasi BB-CUST-PNC-002  
Nama Kasus Uji Pencarian Cepat Lapangan  
Deskripsi Pencarian Cepat Lapangan - Input Lengkap Valid  
Kondisi Awal  
- Halaman beranda website sudah berhasil dibuka  
Tanggal Pengujian  
19 Mei 2026  
Penguji Aorinka Anendya  
Skenario  
1. Buka website HALL BINTANG JAYA SPORT (localhost:5173)  
2. Pada form Pencarian Cepat, masukkan Nama: "Lintang" dan pilih Tanggal Hari Esok (misal: 2026-05-20)  
3. Klik tombol "Cari Lapangan"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Pengguna diarahkan ke halaman Jadwal.<br>b. Tampil banner filter berwarna biru bertuliskan "Pemesan: Lintang" dan tanggal sewa terpilih.<br>c. Grid jadwal menyaring data secara dinamis berdasarkan data filter. | a. Berhasil beralih ke halaman jadwal.<br>b. Banner filter biru sukses menampilkan nama "Lintang" dan tanggal sewa.<br>c. Sistem menyaring data slot jadwal sesuai parameter sewa secara akurat. | Skenario pencarian dengan input lengkap valid (Positive Testing) berfungsi sesuai dengan spesifikasi fungsional sistem. |

---

### 2. Fitur Papan Jadwal Bulu Tangkis Interaktif

#### BB-CUST-JDL-001
Identifikasi BB-CUST-JDL-001  
Nama Kasus Uji Papan Jadwal Bulu Tangkis Interaktif  
Deskripsi Papan Jadwal - Memilih Slot Waktu Lampau (Tutup)  
Kondisi Awal  
- Jam komputer pengujian menunjukkan pukul 14:00 WIB  
Tanggal Pengujian  
19 Mei 2026  
Penguji Althafia Defiyandrea  
Skenario  
1. Buka halaman kalender jadwal  
2. Cari slot waktu jam sewa `09.00-10.00` di hari aktif berjalan saat ini  
3. Lakukan klik pada slot tersebut  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Slot waktu lampau berwarna abu-abu redup dengan label teks "TUTUP".<br>b. Aksi klik dari pengguna ditolak oleh sistem, kursor berubah menjadi *not-allowed*, dan data slot tidak masuk ke antrean booking. | a. Berhasil menampilkan slot lampau dengan indikator warna abu-abu redup dan label "TUTUP".<br>b. Aksi klik ditolak, kursor menjadi *not-allowed*, dan data slot tidak terproses ke antrean. | Logika pembatasan slot waktu lampau (Past hours) telah berfungsi sepenuhnya sesuai aturan bisnis guna menghindari pemesanan jam latihan yang telah lewat. |

<br>

#### BB-CUST-JDL-002
Identifikasi BB-CUST-JDL-002  
Nama Kasus Uji Papan Jadwal Bulu Tangkis Interaktif  
Deskripsi Papan Jadwal - Memilih Slot Terisi / Member HALL BINTANG JAYA SPORT  
Kondisi Awal  
- Terdapat slot jam sewa yang sudah dibooking pelanggan lain (warna biru) atau dikunci member tetap (warna ungu)  
Tanggal Pengujian  
19 Mei 2026  
Penguji Muhammad Idham  
Skenario  
1. Buka halaman kalender jadwal  
2. Coba klik pada slot jam sewa yang berwarna biru (berlabel nama penyewa lain) atau warna ungu (berlabel nama Member HALL BINTANG JAYA SPORT)  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Slot sewa terisi/member tidak dapat diklik.<br>b. Sistem mencegah terjadinya benturan pemesanan (*double booking*) di sisi klien secara instan. | a. Slot sewa terisi/member terbukti tidak dapat diklik.<br>b. Aksi klik tidak memicu respon apa pun dan mencegah benturan jadwal. | Validasi slot terisi atau jadwal terkunci member tetap telah berjalan dengan aman untuk menghindari tabrakan sewa. |

<br>

#### BB-CUST-JDL-003
Identifikasi BB-CUST-JDL-003  
Nama Kasus Uji Papan Jadwal Bulu Tangkis Interaktif  
Deskripsi Papan Jadwal - Pemilihan Multi-slot & Floating Bar  
Kondisi Awal  
- Halaman jadwal memuat data slot kosong  
Tanggal Pengujian  
19 Mei 2026  
Penguji Rizky Hanifa  
Skenario  
1. Buka halaman kalender jadwal  
2. Klik slot jam `18.00-19.00` Lapangan 1  
3. Klik slot jam `19.00-20.00` Lapangan 1  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Kedua slot jam berubah warna menjadi biru pekat bertuliskan "OK ✓".<br>b. Floating Bar muncul di bagian bawah layar menampilkan total jam: "Total 2 Jam".<br>c. Kalkulasi harga sewa dihitung valid (misal: Rp 160.000). | a. Berhasil mengubah warna kedua slot menjadi biru pekat dengan teks "OK ✓".<br>b. Floating Bar sukses muncul di bawah layar dan mendeteksi total sewa "Total 2 Jam".<br>c. Total harga sewa dihitung akurat bernilai Rp 160.000. | Fitur penandaan sesi sewa ganda (Multi-slot booking) beserta respon Floating Booking Bar telah berjalan dengan sangat baik dan akurat. |

---

### 3. Fitur Form Pembayaran & Metode Bayar (Payment Form)

#### BB-CUST-BYR-001
Identifikasi BB-CUST-BYR-001  
Nama Kasus Uji Form Pembayaran & Metode Bayar  
Deskripsi Form Pembayaran - Validasi Input Kosong / Null  
Kondisi Awal  
- Pengguna berada di halaman PaymentPage dengan membawa data sesi sewa  
Tanggal Pengujian  
19 Mei 2026  
Penguji Rezky Pratiwi  
Skenario  
1. Kosongkan isian form "Nama Pemesan" dan "Nomor WhatsApp"  
2. Klik langsung tombol "Konfirmasi Pembayaran"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Pengiriman data transaksi dibatalkan.<br>b. Memunculkan Toast Alert merah di sisi atas layar bertuliskan: *"Mohon lengkapi Nama dan Nomor WhatsApp Anda."* | a. Berhasil membatalkan proses transaksi sewa.<br>b. Toast Alert merah berisi pesan *"Mohon lengkapi Nama dan Nomor WhatsApp Anda."* sukses ditampilkan. | Validasi data input sisi klien berfungsi dengan baik. Mencegah pengiriman data kosong ke server database. |

<br>

#### BB-CUST-BYR-002
Identifikasi BB-CUST-BYR-002  
Nama Kasus Uji Form Pembayaran & Metode Bayar  
Deskripsi Form Pembayaran - Konfirmasi Bayar & Kalkulasi Pajak 5%  
Kondisi Awal  
- Form diisi Nama: "Lintang", No WhatsApp: "081234567890", subtotal sewa Rp 80.000  
Tanggal Pengujian  
19 Mei 2026  
Penguji Muhammad Rizaldy  
Skenario  
1. Perhatikan rincian biaya sewa lapangan di panel kiri  
2. Klik tombol "Konfirmasi Pembayaran"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Pajak layanan 5% dihitung valid: Rp 4.000.<br>b. Total Bayar dihitung valid: Rp 84.000.<br>c. Sistem memproses sewa, memunculkan Toast Success, dan mengalihkan pengguna ke halaman `MyBookings`. | a. Rincian pajak sewa 5% dihitung tepat Rp 4.000.<br>b. Total bayar dihitung tepat Rp 84.000.<br>c. Berhasil mengirim transaksi, memicu Toast Success, dan mengalihkan layar ke halaman riwayat. | Alur checkout sewa beserta kalkulasi pajak 5% dan integrasi penyimpanan data transaksi telah berjalan optimal dan sesuai spesifikasi. |

---

### 4. Fitur Riwayat Pemesanan (My Bookings)

#### BB-CUST-RWT-001
Identifikasi BB-CUST-RWT-001  
Nama Kasus Uji Riwayat Pemesanan (My Bookings)  
Deskripsi Riwayat Pemesanan - Polling Status Real-time  
Kondisi Awal  
- Tab riwayat pelanggan terbuka dengan transaksi berstatus "Menunggu" (Pending)  
Tanggal Pengujian  
19 Mei 2026  
Penguji Ananta Puti  
Skenario  
1. Biarkan tab riwayat terbuka tanpa melakukan interaksi.<br>2. Di tab admin terpisah, lakukan "Confirm" pada pesanan tersebut.<br>3. Tunggu hingga 10 detik.  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Label status transaksi Pending berubah otomatis menjadi Confirmed (hijau) di layar pelanggan tanpa dimuat ulang manual. | a. Berhasil mengubah status transaksi menjadi Confirmed secara otomatis setelah interval polling backend terpenuhi. | Logika interval polling database latar belakang 10 detik berfungsi optimal, mensinkronkan status data riwayat secara real-time. |

---

## 🔑 PENGUJIAN BLACK BOX - SISI ADMINISTRATOR (ADMIN)

### 5. Fitur Otentikasi Admin (Login Form)

#### BB-ADM-ATH-001
Identifikasi BB-ADM-ATH-001  
Nama Kasus Uji Otentikasi Admin (Login Form)  
Deskripsi Otentikasi Admin - Login Kata Sandi Salah  
Kondisi Awal  
- Halaman `/admin-dashboard` memuat `LoginPage`  
Tanggal Pengujian  
19 Mei 2026  
Penguji Lintang Suminar  
Skenario  
1. Masukkan Username: `admin`, Password: `passwordsalah123`<br>2. Klik tombol "Masuk ke Dashboard"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Sistem menolak akses masuk.<br>b. Muncul Toast/notifikasi error dan halaman tetap bertahan pada form login. | a. Sistem menolak kata sandi salah.<br>b. Pesan kesalahan sukses ditampilkan dan akses ke dasbor admin tetap terblokir. | Validasi kredensial login admin berfungsi dengan aman. Mencegah akses ilegal dari pihak luar. |

---

### 6. Fitur Kelola Lapangan (Courts Management)

#### BB-ADM-CRT-001
Identifikasi BB-ADM-CRT-001  
Nama Kasus Uji Kelola Lapangan (Courts Management)  
Deskripsi Kelola Lapangan - Tambah Lapangan Harga Negatif  
Kondisi Awal  
- Login sebagai admin, buka tab "Manajemen Lapangan" (CourtsTab)  
Tanggal Pengujian  
19 Mei 2026  
Penguji Aorinka Anendya  
Skenario  
1. Klik tombol tambah lapangan baru<br>2. Isi Nama Lapangan: "Lapangan Baru 5", Harga per Jam: "-50000"<br>3. Klik tombol simpan  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Sistem menolak penyimpanan data (baik melalui form input yang mendeteksi batas min="0" maupun validasi backend).<br>b. Menampilkan pesan error bahwa harga sewa tidak boleh minus. | a. Masukan harga negatif ditolak oleh validasi form.<br>b. Pesan error harga tidak boleh bernilai negatif sukses ditampilkan. | Pengujian batas nilai (BVA) harga sewa bernilai negatif berhasil ditangani sistem guna menjaga kevalidan data finansial. |

---

### 7. Fitur Kelola Jadwal Member HALL BINTANG JAYA SPORT (Member Schedule Tab)

#### BB-ADM-MBR-001
Identifikasi BB-ADM-MBR-001  
Nama Kasus Uji Kelola Jadwal Member HALL BINTANG JAYA SPORT  
Deskripsi Kelola Jadwal Member HALL BINTANG JAYA SPORT - Benturan Jadwal (Collision)  
Kondisi Awal  
- Pelanggan sewa umum memiliki transaksi aktif hari Rabu jam 19:00 - 20:00 (Sudah Confirmed)  
Tanggal Pengujian  
19 Mei 2026  
Penguji Althafia Defiyandrea  
Skenario  
1. Masuk ke tab "Jadwal Member HALL BINTANG JAYA SPORT" (MemberScheduleTab) sebagai Admin<br>2. Daftarkan jadwal rutin PB: Nama: "PB Jaya", Lapangan: "Lapangan 1", Hari: "Rabu", Jam: "19:00 - 21:00"<br>3. Klik Simpan  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Sistem mendeteksi adanya transaksi aktif di hari dan jam yang sama.<br>b. Penyimpanan ditolak dan memunculkan pesan error/notifikasi benturan jadwal (*schedule collision*). | a. Sistem menolak pendaftaran jadwal rutin.<br>b. Pesan error benturan jadwal dengan penyewa umum sukses ditampilkan di layar admin. | Mekanisme proteksi benturan jadwal sewa (*schedule collision protection*) berfungsi optimal untuk mencegah tumpang tindih waktu latihan. |
