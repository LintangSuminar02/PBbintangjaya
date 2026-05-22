# PERENCANAAN, DESKRIPSI DAN HASIL UJI PERANGKAT LUNAK
## APLIKASI: HALL BINTANG JAYA SPORT

**Dipersiapkan oleh:**  
*   2211104009 - Lintang Suminar Tyas Wening  
*   2211104011 - Althafia Defiyandrea Laskanadya Wibowo  
*   2211104013 - Aorinka Anendya Chazanah  
*   2211104016 - Muhammad Idham Cholid  
*   2211104017 - Rizky Hanifa Afania  
*   2211104029 - Rezky Pratiwi  
*   2211104065 - Muhammad Rizaldy Akbar  
*   103122400040 - Ananta Puti Maharani  

**Fakultas Informatika - Universitas Telkom Purwokerto**  
**Purwokerto**  

---

| Nomor Dokumen | Halaman |
| :--- | :--- |
| **PDHUPL - HALL BINTANG JAYA SPORT** | **1/34** |
| **Revisi B** | **Tgl. 19/05/2026** |

### DAFTAR PERUBAHAN
| Revisi | Deskripsi | Tanggal | Ditulis Oleh | Diperiksa Oleh | Disetujui Oleh |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **A** | - Inisiasi struktur dokumen UAT awal.<br>- Penyusunan Bab 1 dan Bab 2.<br>- Identifikasi awal fungsi item sistem. | 18/05/2026 | LSTW | ADLW | AAC |
| **B** | - Pemutakhiran Bab 3 & 4 (Deskripsi Uji detail).<br>- Penyesuaian skenario penanganan benturan jadwal.<br>- Pengujian fungsionalitas visual monitor & admin dashboard. | 19/05/2026 | LSTW | MIC | RHA |

### DAFTAR HALAMAN PERUBAHAN
| Halaman | Revisi | Keterangan Perubahan |
| :---: | :---: | :--- |
| **8-12** | **B** | Perubahan pada subbab 2.1.3 mengenai fungsi-fungsi utama aplikasi HALL BINTANG JAYA SPORT. |
| **13-33** | **B** | Pengisian tabel Bab 4 (Deskripsi dan Hasil Uji) lengkap berdasarkan data uji riil di frontend dengan format flat text dan tabel hasil 3 kolom. |
| **34** | **B** | Pemutakhiran tabel Matriks Keterunutan pada Bab 5. |

---

## Daftar Isi
1. Pendahuluan...................................................................................................................1  
   1.1 Tujuan Pembuatan Dokumen...............................................................................1  
   1.2 Lingkup Masalah..................................................................................................... 1  
   1.3 Definisi, Akronim dan Singkatan............................................................................ 2  
   1.4 Referensi.................................................................................................................. 2  
   1.5 Deskripsi Umum...................................................................................................... 4  
2. Lingkungan Pengujian Perangkat Lunak................................................................... 5  
   2.1 Perangkat Lunak Pengujian..................................................................................... 5  
       2.1.1 Perangkat Lunak yang Digunakan..................................................................5  
       2.1.2 Lisensi Perangkat Lunak.................................................................................5  
       2.1.3 Fungsi Items....................................................................................................5  
           2.1.3.1 Pencarian & Visualisasi Lapangan.......................................................... 5  
           2.1.3.2 Papan Jadwal Bulu Tangkis Interaktif...................................................5  
           2.1.3.3 Detail Pemesanan & Pembayaran............................................................6  
           2.1.3.4 Riwayat Pemesanan & Polling Real-time............................................... 6  
           2.1.3.5 Monitor Fullscreen Layar Utama............................................................6  
           2.1.3.6 Dashboard Admin.................................................................................. 6  
           2.1.3.7 Manajemen Jadwal Member HALL BINTANG JAYA SPORT............................................................6  
   2.2 Perangkat Keras Pengujian...................................................................................... 6  
   2.3 Material Pengujian...................................................................................................7  
       2.3.1. Manual Penggunaan Perangkat Lunak...........................................................7  
   2.4 Sumber Daya Manusia.............................................................................................9  
   2.5 Prosedur Umum Pengujian...................................................................................9  
       2.5.1 Pengenalan dan Pelatihan............................................................................ 9  
       2.5.2 Persiapan Awal................................................................................................9  
           2.5.2.1 Persiapan Prosedural..............................................................................9  
           2.5.2.2 Persiapan Perangkat Keras...................................................................10  
           2.5.2.3 Persiapan Perangkat Lunak..................................................................11  
       2.5.3 Pelaksanaan...................................................................................................11  
       2.5.4 Pelaporan Hasil............................................................................................. 11  
3. Identifikasi dan Rencana Pengujian.......................................................................... 12  
4. Deskripsi dan Hasil Uji................................................................................................14  
   4.1 Pencarian & Visualisasi Lapangan........................................................................... 14  
       4.1.1 Menampilkan Papan Jadwal Utama...........................................................14  
       4.1.2 Melakukan Navigasi Rentang Minggu...........................................................15  
       4.1.3 Pencarian Cepat Lapangan (Quick Search)...................................................15  
   4.2 Papan Jadwal Bulu Tangkis Interaktif.....................................................................16  
       4.2.1 Memblokir Slot Waktu Lampau (Tutup).......................................................16  
       4.2.2 Pemilihan Multi-slot Lapangan & Floating Bar...........................................17  
       4.2.3 Mengosongkan Pilihan Sesi Booking...........................................................18  
   4.3 Detail Pemesanan & Pembayaran............................................................................19  
       4.3.1 Validasi Kolom Kosong Form Pembayaran...................................................19  
       4.3.2 Konfirmasi Bayar & Kalkulasi Pajak 5%......................................................19  
       4.3.3 Pemilihan Metode Pembayaran.....................................................................20  
   4.4 Riwayat Pemesanan & Polling Real-time............................................................... 21  
       4.4.1 Menyaring & Mencari Data Riwayat........................................................... 21  
       4.4.2 Polling Status Real-time Riwayat................................................................. 21  
   4.5 Monitor Fullscreen Layar Utama............................................................................23  
       4.5.1 Menampilkan Monitor Fullscreen (Display Mode)....................................... 23  
   4.6 Dashboard Admin.................................................................................................. 24  
       4.6.1 Login Admin.................................................................................................24  
       4.6.2 Menampilkan Dashboard Ringkasan & Statistik Admin.............................. 24  
   4.7 Manajemen Lapangan & Jadwal Member HALL BINTANG JAYA SPORT........................................................ 26  
       4.7.1 Manajemen Lapangan (Tambah Data & Harga)...........................................26  
       4.7.2 Manajemen Lapangan (Hapus Lapangan).....................................................26  
       4.7.3 Blokir Jadwal Rutin Member HALL BINTANG JAYA SPORT (Collision Avoidance)...............................27  
       4.7.4 Pengaturan Parameter Sistem (Settings Tab)...............................................28  
5. Matriks Keterunutan...................................................................................................30  
6. Lampiran...................................................................................................................... 30  

---

## 1. Pendahuluan
Dokumen ini berisi Perencanaan, Deskripsi, dan Hasil Uji Perangkat Lunak (PDHUPL) untuk aplikasi **HALL BINTANG JAYA SPORT**. Untuk penamaan dokumen ini selanjutnya akan digunakan istilah DPPL. Isi dari dokumen ini sebagian besar adalah terjemahan dari dokumen IEEE Std 1016.1- 1993.

### 1.1 Tujuan Pembuatan Dokumen
Dokumen Perencanaan, Deskripsi dan Hasil Uji Perangkat Lunak (PDHUPL) merupakan dokumen deskripsi dari perancangan serta segala bentuk pengujian terhadap perangkat lunak yang telah dirancang dan direalisasikan. Dokumen ini digunakan oleh pengembang perangkat lunak sebagai acuan teknis pengujian perangkat lunak.

### 1.2 Lingkup Masalah
HALL BINTANG JAYA SPORT merupakan aplikasi berbasis web yang dirancang khusus untuk memodernisasi manajemen dan pemesanan lapangan bulu tangkis secara real-time. Aplikasi ini menyediakan antarmuka bagi pelanggan umum untuk memeriksa ketersediaan lapangan, memesan beberapa jam sesi sewa sekaligus (multi-slot booking), dan memantau status pemesanan.

Dengan pendekatan user-centered design, aplikasi ini menyediakan tampilan visual interaktif untuk publik, serta dashboard manajemen data untuk admin. HALL BINTANG JAYA SPORT tidak hanya digunakan sebagai alat pemantauan, tetapi juga sebagai sarana kolaborasi antara pengelola gedung olahraga, pelanggan umum, serta member tetap PB. Semua deskripsi perancangan yang dijelaskan pada dokumen ini dibatasi oleh spesifikasi fungsional perangkat lunak dengan mengacu pada dokumen SKPL-HALL BINTANG JAYA SPORT.

### 1.3 Definisi, Akronim dan Singkatan
*   **PDHUPL** adalah Perancangan, Deskripsi dan Hasil Uji Perangkat Lunak, merupakan acuan teknis hasil deskripsi perancangan dari perangkat lunak yang telah dibuat.
*   **FCFS (First Come First Served)** adalah aturan di mana pelanggan yang lebih dahulu memesan slot jam sewa akan masuk antrean paling depan untuk disetujui admin.
*   **Polling** adalah proses pengambilan data dari backend ke frontend secara otomatis setiap beberapa detik sekali untuk memastikan pembaruan data secara real-time.
*   **CRUD** adalah Create, Read, Update, Delete, yaitu empat operasi dasar dalam pengelolaan data pada sistem perangkat lunak.
*   **URL** adalah Uniform Resource Locator, yaitu alamat yang digunakan untuk mengakses sumber daya tertentu pada jaringan internet.

### 1.4 Referensi
*   DT-HALLBINTANGJAYASPORT, Dokumen Teknis HALL BINTANG JAYA SPORT, Program Studi Rekayasa Perangkat Lunak-TUP.
*   DPPL-HALLBINTANGJAYASPORT, Deskripsi Perancangan Perangkat Lunak HALL BINTANG JAYA SPORT, Program Studi Rekayasa Perangkat Lunak-TUP.
*   GL03T, Template Dokumen Perencanaan, Deskripsi, dan Hasil Uji Perangkat Lunak, Program Studi Rekayasa Perangkat Lunak-TUP.

### 1.5 Deskripsi Umum
Dokumen PDHUPL ini dibagi menjadi empat bagian utama. Bagian utama berisi penjelasan tentang dokumen PDHUPL yang mencakup tujuan pembuatan dokumen ini, lingkup masalah yang diselesaikan oleh perangkat lunak yang dikembangkan, definisi, referensi, dan deskripsi umum.
Bagian kedua berisi penjelasan mengenai spesifikasi lingkungan pengujian suatu perangkat lunak seperti perangkat lunak pengujian, perangkat keras pengujian, material pengujian, sumber data manusia, dan prosedur umum pengujian tersebut.
Bagian ketiga berisi identifikasi dan rencana pengujian yang merupakan uraian keterkaitan dan kekonsistenan antara DT, DPPL dan perangkat lunak yang dihasilkan.
Bagian terakhir merupakan deskripsi dan hasil pengujian.

---

## 2. Lingkungan Pengujian Perangkat Lunak
### 2.1 Perangkat Lunak Pengujian
#### 2.1.1 Perangkat Lunak yang Digunakan
*   Sistem Operasi: Microsoft Windows 10/11
*   Lingkungan Pengembangan (IDE/Editor): Visual Studio Code
*   Front-End Framework: React.js
*   Back-End Runtime/Environment: Node.js (JavaScript)
*   Versi Kontrol: GitHub
*   Browser Pengujian Utama: Google Chrome / Microsoft Edge

#### 2.1.2 Lisensi Perangkat Lunak
Semua perangkat lunak pengujian ini memiliki hak pemakaian dan open source.

#### 2.1.3 Fungsi Items
##### 2.1.3.1 Pencarian & Visualisasi Lapangan
Fungsi ini digunakan untuk menampilkan menu beranda dan kartu pencarian cepat lapangan badminton. Sistem memberikan kemampuan bagi pengguna untuk memfilter data lapangan berdasarkan nama dan tanggal sewa.

##### 2.1.3.2 Papan Jadwal Bulu Tangkis Interaktif
Fungsi ini memungkinkan sistem mengambil jadwal pemesanan dari database dan menampilkan grid waktu 7 hari. Menampilkan informasi slot kosong, antrean sewa pelanggan lain, jam tutup/lampau, dan slot member tetap PB secara responsif.

##### 2.1.3.3 Detail Pemesanan & Pembayaran
Fungsi ini digunakan untuk melakukan checkout data pemesanan, termasuk form isian nama pemesan, nomor WhatsApp aktif, pilihan metode bayar, dan kalkulasi otomatis subtotal serta pajak layanan 5%.

##### 2.1.3.4 Riwayat Pemesanan & Polling Real-time
Fungsi ini mendeteksi perubahan status transaksi (Confirmed, Pending, Rejected) secara real-time menggunakan mekanisme interval polling database otomatis setiap 10 detik.

##### 2.1.3.5 Monitor Fullscreen Layar Utama
Fungsi ini digunakan untuk memproyeksikan visualisasi papan jadwal/scoreboard berjalan (Display Mode) secara penuh tanpa batas browser standar untuk ditaruh di lobby gedung olahraga.

##### 2.1.3.6 Dashboard Admin
Fungsi ini memungkinkan admin untuk memantau performa keuangan, total transaksi sewa masuk, occupancy rate lapangan, kelola status pemesanan, data master lapangan, serta konfigurasi operasional sistem.

##### 2.1.3.7 Manajemen Jadwal Member HALL BINTANG JAYA SPORT
Fungsi ini digunakan untuk pendaftaran dan penguncian slot mingguan tetap bagi member internal PB bulu tangkis agar terjaga dari tabrakan jadwal (*schedule collision*).

### 2.2 Perangkat Keras Pengujian
Spesifikasi minimum perangkat keras yang diperlukan untuk menjalankan aplikasi HALL BINTANG JAYA SPORT pada lingkungan pengujian adalah sebagai berikut:
*   CPU: Intel Core i3 Gen 4 atau AMD Ryzen 3 setara
*   RAM: Minimal 4 GB
*   Storage: Minimal 500 MB ruang kosong
*   Perangkat Input: Keyboard dan mouse
*   Koneksi Internet: Minimal 5 Mbps untuk sinkronisasi DB dan pemuatan Tailwind UI
*   Browser: Google Chrome/Edge/Firefox versi terbaru

### 2.3 Material Pengujian
#### 2.3.1. Manual Penggunaan Perangkat Lunak
1.  Setelah membuka aplikasi HALL BINTANG JAYA SPORT melalui browser (`http://localhost:5173`), pengguna akan diarahkan ke halaman utama yang menampilkan info lapangan aktif.
2.  Pengguna umum dapat langsung mengeklik menu "Pesan Lapangan" untuk menandai slot jam kosong (berwarna hijau) sesuai lapangan dan tanggal sewa yang diinginkan.
3.  Pengguna mengeklik tombol "Lanjut Bayar" di Floating Bar bawah untuk melengkapi nama, WhatsApp, dan opsi transfer bank/E-Wallet.
4.  Setelah menekan tombol "Konfirmasi Pembayaran", pengguna akan otomatis diarahkan ke menu "Riwayat Pemesanan" untuk memantau antrean pembayaran.
5.  Untuk admin, masuk ke `/admin-dashboard` dan login dengan memasukkan kata sandi admin.
6.  Di Dashboard, admin dapat menyetujui (Confirm), menolak (Reject) pesanan sewa pelanggan, menambah data lapangan, menjadwalkan member tetap, atau mengubah rekening bank di Pengaturan.
7.  Admin dan pengguna dapat menekan menu monitor layar untuk menampilkan visual scoreboard fullscreen di lobby.

### 2.4 Sumber Daya Manusia
Persyaratan sumber daya manusia yang akan terlibat dalam proses pengujian perangkat lunak HALL BINTANG JAYA SPORT adalah:
*   Memiliki pengetahuan dasar tentang penggunaan komputer dan internet
*   Memahami konsep dasar sistem informasi berbasis web
*   Memahami penggunaan browser (Chrome/Firefox/Edge)
*   Untuk penguji admin: memahami dasar manajemen data (CRUD) dan alur sewa badminton

### 2.5 Prosedur Umum Pengujian
#### 2.5.1 Pengenalan dan Pelatihan
Pihak yang terlibat dalam proses pengujian telah memenuhi persyaratan pada bagian 2.4 di atas. Mengingat perangkat lunak yang diuji adalah aplikasi web dengan antarmuka yang sederhana serta perangkat keras dan perangkat lunak yang digunakan bersifat umum, maka pengenalan dan pelatihan khusus tidak diperlukan.

#### 2.5.2 Persiapan Awal
Persiapan awal yang khusus tidak dibutuhkan pada pengujian perangkat lunak HALL BINTANG JAYA SPORT ini.
##### 2.5.2.1 Persiapan Prosedural
Pada pengujian perangkat lunak ini tidak diperlukan persiapan prosedural khusus sebelum pelaksanaan pengujian.
##### 2.5.2.2 Persiapan Perangkat Keras
Perangkat keras yang perlu disiapkan adalah perangkat komputer atau laptop dengan spesifikasi minimum:
*   CPU: Intel Core i3 Gen 4 atau AMD Ryzen 3 setara
*   RAM: Minimal 4 GB
*   Storage: Minimal 500 MB ruang kosong
*   Perangkat Input: Keyboard dan mouse
*   Koneksi Internet: Minimal 5 Mbps
*   Browser: Google Chrome/Edge/Firefox versi terbaru

##### 2.5.2.3 Persiapan Perangkat Lunak
Persiapan perangkat lunak untuk melakukan pengujian HALL BINTANG JAYA SPORT adalah sebagai berikut:
1.  Menyiapkan sistem operasi Windows.
2.  Menggunakan browser versi terbaru seperti Google Chrome, Mozilla Firefox, atau Microsoft Edge.
3.  Memastikan database SQLite/MySQL dan server backend Node.js (`http://localhost:3001`) berjalan aktif.
4.  Mengakses aplikasi HALL BINTANG JAYA SPORT melalui URL yang telah disediakan (`http://localhost:5173`).

#### 2.5.3 Pelaksanaan
Pelaksanaan pengujian dilakukan dengan menjalankan aplikasi HALL BINTANG JAYA SPORT melalui browser dan mengikuti skenario pengujian yang telah disusun. Skenario mencakup pengujian terhadap fungsi papan jadwal, form checkout, polling riwayat sewa, dashboard admin, manajemen data lapangan, dan pengaturan jadwal rutin member.

#### 2.5.4 Pelaporan Hasil
Hasil pengujian dicatat dan digunakan sebagai bahan evaluasi untuk memastikan kualitas perangkat lunak HALL BINTANG JAYA SPORT sesuai dengan kebutuhan fungsional dan nonfungsional yang telah ditentukan.

---

## 3. Identifikasi dan Rencana Pengujian
Pengujian perangkat lunak HALL BINTANG JAYA SPORT dilakukan berdasarkan kebutuhan yang didefinisikan pada dokumen teknis HALL BINTANG JAYA SPORT. Adapun garis besar proses pengujian dapat dilihat pada Tabel 1.

**Tabel 1. Identifikasi dan Rencana Pengujian HALL BINTANG JAYA SPORT**
| Kelas Uji | Butir Uji | Identifikasi Pengujian | Jenis Pengujian | Jadwal |
| :--- | :--- | :--- | :--- | :--- |
| **Pencarian & Visualisasi**| Menampilkan Papan Jadwal Utama | DT-HALLBINTANGJAYASPORT.K-001 | HALLBINTANGJAYASPORT-PDHUPL.1-001 | Functional Black Box |
| | Melakukan Navigasi Rentang Minggu | DT-HALLBINTANGJAYASPORT.K-001 | HALLBINTANGJAYASPORT-PDHUPL.1-002 | Functional Black Box |
| | Pencarian Cepat Lapangan (Quick Search)| DT-HALLBINTANGJAYASPORT.K-001 | HALLBINTANGJAYASPORT-PDHUPL.1-003 | Functional Black Box |
| **Jadwal Interaktif** | Memblokir Slot Waktu Lampau (Tutup) | DT-HALLBINTANGJAYASPORT.K-002 | HALLBINTANGJAYASPORT-PDHUPL.2-001 | Functional Black Box |
| | Pemilihan Multi-slot & Floating Bar | DT-HALLBINTANGJAYASPORT.K-002 | HALLBINTANGJAYASPORT-PDHUPL.2-002 | Functional Black Box |
| | Mengosongkan Pilihan Sesi Booking | DT-HALLBINTANGJAYASPORT.K-002 | HALLBINTANGJAYASPORT-PDHUPL.2-003 | Functional Black Box |
| **Detail & Pembayaran** | Validasi Kolom Kosong Form Bayar | DT-HALLBINTANGJAYASPORT.K-003 | HALLBINTANGJAYASPORT-PDHUPL.3-001 | Functional Black Box |
| | Konfirmasi Bayar & Kalkulasi Pajak 5%| DT-HALLBINTANGJAYASPORT.K-003 | HALLBINTANGJAYASPORT-PDHUPL.3-002 | Functional Black Box |
| | Pemilihan Metode Pembayaran | DT-HALLBINTANGJAYASPORT.K-003 | HALLBINTANGJAYASPORT-PDHUPL.3-003 | Functional Black Box |
| **Riwayat & Polling** | Menyaring & Mencari Data Riwayat | DT-HALLBINTANGJAYASPORT.K-004 | HALLBINTANGJAYASPORT-PDHUPL.4-001 | Functional Black Box |
| | Polling Status Real-time Riwayat | DT-HALLBINTANGJAYASPORT.K-004 | HALLBINTANGJAYASPORT-PDHUPL.4-002 | Functional Black Box |
| **Layar Monitor** | Menampilkan Monitor Fullscreen | DT-HALLBINTANGJAYASPORT.K-004 | HALLBINTANGJAYASPORT-PDHUPL.5-001 | Functional Black Box |
| **Dashboard Admin** | Login Admin | DT-HALLBINTANGJAYASPORT.K-005 | HALLBINTANGJAYASPORT-PDHUPL.6-001 | Functional Black Box |
| | Menampilkan Dasbor Ringkasan | DT-HALLBINTANGJAYASPORT.K-005 | HALLBINTANGJAYASPORT-PDHUPL.6-002 | Functional Black Box |
| **Kelola Lapangan & Member**| Manajemen Lapangan (Tambah & Harga) | DT-HALLBINTANGJAYASPORT.K-006 | HALLBINTANGJAYASPORT-PDHUPL.7-001 | Functional Black Box |
| | Manajemen Lapangan (Hapus Lapangan) | DT-HALLBINTANGJAYASPORT.K-006 | HALLBINTANGJAYASPORT-PDHUPL.7-002 | Functional Black Box |
| | Blokir Jadwal Member HALL BINTANG JAYA SPORT (Collision) | DT-HALLBINTANGJAYASPORT.K-006 | HALLBINTANGJAYASPORT-PDHUPL.7-003 | Functional Black Box |
| | Pengaturan Parameter Sistem | DT-HALLBINTANGJAYASPORT.K-006 | HALLBINTANGJAYASPORT-PDHUPL.7-004 | Functional Black Box |

---

## 4. Deskripsi dan Hasil Uji

### 4.1 Pencarian & Visualisasi Lapangan

#### 4.1.1 Menampilkan Papan Jadwal Utama
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.1-001  
Nama Kasus Uji Pencarian & Visualisasi Lapangan  
Deskripsi Pencarian & Visualisasi Lapangan - Menampilkan Papan Jadwal Utama  
Kondisi Awal  
- Website HALL BINTANG JAYA SPORT sudah berhasil dibuka  
Tanggal Pengujian  
19 Mei 2026  
Penguji Lintang Suminar  
Skenario  
1. Buka website HALL BINTANG JAYA SPORT (localhost:5173)  
2. Pilih menu "Pesan Lapangan" pada header navigasi  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Muncul papan jadwal utama yang menampilkan informasi grid waktu sewa 7 hari (Senin-Minggu).<br>b. Penanggalan terhitung tepat berdasarkan rentang minggu aktif tanpa pergeseran hari.<br>c. Setiap kolom menampilkan info nama lapangan (Lapangan 1, 2, 3) secara jelas. | a. Berhasil menampilkan papan jadwal utama yang berisi sistem grid waktu sewa 7 hari (Senin-Minggu).<br>b. Tanggal terhitung tepat sesuai rentang minggu berjalan.<br>c. Setiap kolom sukses menampilkan info nama lapangan (Lapangan 1, 2, 3) secara visual. | Semua fitur pada modul papan jadwal utama telah berfungsi sesuai dengan yang diharapkan. Sistem berhasil memuat informasi grid secara dinamis tanpa kendala data. |

<br>

#### 4.1.2 Melakukan Navigasi Rentang Minggu
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.1-002  
Nama Kasus Uji Pencarian & Visualisasi Lapangan  
Deskripsi Pencarian & Visualisasi Lapangan - Melakukan Navigasi Rentang Minggu  
Kondisi Awal  
- Website HALL BINTANG JAYA SPORT sudah berhasil dibuka  
Tanggal Pengujian  
19 Mei 2026  
Penguji Aorinka Anendya  
Skenario  
1. Buka website HALL BINTANG JAYA SPORT (localhost:5173)  
2. Pilih menu "Pesan Lapangan" pada header navigasi  
3. Klik tombol panah kanan ("Minggu Ke-2") pada selector rentang minggu di kanan atas  
4. Klik tombol panah kiri ("Minggu Ke-1") untuk kembali  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Papan jadwal memperbarui tanggal Senin-Minggu dengan cara maju 7 hari saat tombol panah kanan diklik.<br>b. Papan jadwal memperbarui tanggal kembali ke rentang semula saat panah kiri diklik. | a. Berhasil memperbarui penanggalan Senin-Minggu maju 7 hari ketika panah kanan diklik.<br>b. Penanggalan sukses kembali ke rentang awal ketika tombol panah kiri diklik. | Fitur navigasi rentang minggu berjalan sesuai dengan ekspektasi. Pengguna dapat berganti melihat ketersediaan jadwal minggu depan tanpa hambatan pemuatan data. |

<br>

#### 4.1.3 Pencarian Cepat Lapangan (Quick Search)
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.1-003  
Nama Kasus Uji Pencarian & Visualisasi Lapangan  
Deskripsi Pencarian & Visualisasi Lapangan - Pencarian Cepat Lapangan  
Kondisi Awal  
- Website HALL BINTANG JAYA SPORT sudah berhasil dibuka  
Tanggal Pengujian  
19 Mei 2026  
Penguji Althafia Defiyandrea  
Skenario  
1. Buka website HALL BINTANG JAYA SPORT (localhost:5173)  
2. Pada form Pencarian Cepat di Landing Page, masukkan Nama: "Lintang" dan pilih Tanggal Hari Esok  
3. Klik tombol "Cari Lapangan"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Pengguna dialihkan otomatis ke halaman jadwal.<br>b. Tampil banner filter biru bertuliskan nama "Lintang" dan tanggal filter yang dipilih secara tepat.<br>c. Sistem menyorot ketersediaan slot yang dicari. | a. Berhasil mengalihkan pengguna ke halaman jadwal.<br>b. Banner filter berwarna biru berisi "Pemesan: Lintang" dan tanggal sewa sukses ditampilkan.<br>c. Menampilkan sorotan slot jadwal sesuai kriteria pencarian. | Fitur Pencarian Cepat (Quick Search) berjalan optimal. Masukan data dari form Landing Page berhasil dioperasikan ke state filter halaman jadwal tanpa kendala. |

---

### 4.2 Papan Jadwal Bulu Tangkis Interaktif

#### 4.2.1 Memblokir Slot Waktu Lampau (Tutup)
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.2-001  
Nama Kasus Uji Papan Jadwal Bulu Tangkis Interaktif  
Deskripsi Papan Jadwal Bulu Tangkis Interaktif - Memblokir Slot Waktu Lampau (Tutup)  
Kondisi Awal  
- Pukul komputer pengujian menunjukkan jam 14:00 WIB  
Tanggal Pengujian  
19 Mei 2026  
Penguji Muhammad Idham  
Skenario  
1. Akses halaman jadwal  
2. Arahkan kursor dan klik pada slot jam `09.00-10.00` di hari aktif saat ini  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Slot waktu sebelum jam 14:00 di hari aktif berwarna abu-abu redup dan menampilkan teks "TUTUP".<br>b. Aksi klik tidak memicu apa pun, dan kursor menampilkan tanda *not-allowed*. | a. Berhasil menampilkan slot waktu lampau dengan warna abu-abu redup dan label "TUTUP".<br>b. Aksi klik terbukti ditolak oleh sistem dan kursor berubah menjadi *not-allowed*. | Logika pembatasan slot waktu lampau (Past hours) telah berfungsi sepenuhnya sesuai aturan bisnis guna menghindari pemesanan jam latihan yang telah lewat. |

<br>

#### 4.2.2 Pemilihan Multi-slot Lapangan & Floating Bar
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.2-002  
Nama Kasus Uji Papan Jadwal Bulu Tangkis Interaktif  
Deskripsi Papan Jadwal Bulu Tangkis Interaktif - Pemilihan Multi-slot & Floating Bar  
Kondisi Awal  
- Halaman jadwal telah dimuat dengan data slot kosong  
Tanggal Pengujian  
19 Mei 2026  
Penguji Rizky Hanifa  
Skenario  
1. Klik slot jam `18.00-19.00` Lapangan 1 (Harga Rp 80.000)  
2. Klik slot jam `19.00-20.00` Lapangan 1 (Harga Rp 80.000)  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Kedua slot jam berubah warna menjadi biru pekat bertuliskan "OK ✓".<br>b. Floating Bar muncul di bagian bawah layar menampilkan total jam: "Total 2 Jam".<br>c. Kalkulasi harga sewa dihitung valid: Rp 160.000. | a. Berhasil mengubah warna kedua slot menjadi biru pekat dengan teks "OK ✓".<br>b. Floating Bar sukses muncul di bawah layar dan mendeteksi total sewa "Total 2 Jam".<br>c. Total harga sewa dihitung akurat bernilai Rp 160.000. | Fitur penandaan sesi sewa ganda (Multi-slot booking) beserta respon Floating Booking Bar telah berjalan dengan sangat baik dan akurat. |

<br>

#### 4.2.3 Mengosongkan Pilihan Sesi Booking
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.2-003  
Nama Kasus Uji Papan Jadwal Bulu Tangkis Interaktif  
Deskripsi Papan Jadwal Bulu Tangkis Interaktif - Mengosongkan Pilihan Sesi Booking  
Kondisi Awal  
- Pengguna telah memilih minimal 2 slot sewa aktif  
Tanggal Pengujian  
19 Mei 2026  
Penguji Rezky Pratiwi  
Skenario  
1. Klik tombol "Batal" pada sebelah kiri tombol "Lanjut Bayar" di Floating Bar bawah  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Floating Bar di bawah layar menghilang.<br>b. Seluruh slot jam sewa yang bertanda biru pekat "OK ✓" kembali berubah menjadi grid kosong bergaris putus-putus ("KOSONG"). | a. Berhasil menyembunyikan Floating Bar.<br>b. Semua slot yang telah ditandai berhasil dinetralkan kembali menjadi status "KOSONG". | Fungsi pembatalan pemilihan slot berjalan lancar. Seluruh state pilihan di-reset kembali ke nilai awal saat tombol Batal ditekan. |

---

### 4.3 Detail Pemesanan & Pembayaran

#### 4.3.1 Validasi Kolom Kosong Form Pembayaran
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.3-001  
Nama Kasus Uji Detail Pemesanan & Pembayaran  
Deskripsi Detail Pemesanan & Pembayaran - Validasi Kolom Kosong Form Pembayaran  
Kondisi Awal  
- Pengguna berada di halaman PaymentPage dengan membawa data sesi sewa  
Tanggal Pengujian  
19 Mei 2026  
Penguji Muhammad Rizaldy  
Skenario  
1. Kosongkan isian form "Nama Pemesan" dan "Nomor WhatsApp"  
2. Klik langsung tombol "Konfirmasi Pembayaran"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Pengiriman data transaksi dibatalkan.<br>b. Memunculkan Toast Alert merah di sisi atas layar bertuliskan: *"Mohon lengkapi Nama dan Nomor WhatsApp Anda."* | a. Berhasil membatalkan proses transaksi sewa.<br>b. Toast Alert merah berisi pesan *"Mohon lengkapi Nama dan Nomor WhatsApp Anda."* sukses ditampilkan. | Validasi data input sisi klien berfungsi dengan baik. Mencegah pengiriman data kosong ke server database. |

<br>

#### 4.3.2 Konfirmasi Bayar & Kalkulasi Pajak 5%
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.3-002  
Nama Kasus Uji Detail Pemesanan & Pembayaran  
Deskripsi Detail Pemesanan & Pembayaran - Konfirmasi Bayar & Kalkulasi Pajak 5%  
Kondisi Awal  
- Form diisi Nama: "Lintang" dan No WhatsApp valid, subtotal sewa Rp 80.000  
Tanggal Pengujian  
19 Mei 2026  
Penguji Ananta Puti  
Skenario  
1. Amati rincian biaya pada panel kiri<br>2. Klik tombol "Konfirmasi Pembayaran"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Pajak layanan 5% dihitung valid: Rp 4.000.<br>b. Total Bayar dihitung valid: Rp 84.000.<br>c. Sistem memproses sewa, memunculkan Toast Success, dan mengalihkan pengguna ke halaman `MyBookings`. | a. Rincian pajak sewa 5% dihitung tepat Rp 4.000.<br>b. Total bayar dihitung tepat Rp 84.000.<br>c. Berhasil mengirim transaksi, memicu Toast Success, dan mengalihkan layar ke halaman riwayat. | Alur checkout sewa beserta kalkulasi pajak 5% dan integrasi penyimpanan data transaksi telah berjalan optimal dan sesuai spesifikasi. |

<br>

#### 4.3.3 Pemilihan Metode Pembayaran
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.3-003  
Nama Kasus Uji Detail Pemesanan & Pembayaran  
Deskripsi Detail Pemesanan & Pembayaran - Pemilihan Metode Pembayaran  
Kondisi Awal  
- Berada di halaman form checkout pembayaran  
Tanggal Pengujian  
19 Mei 2026  
Penguji Lintang Suminar  
Skenario  
1. Klik tombol opsi pembayaran "E-Wallet / QRIS"<br>2. Klik tombol opsi pembayaran "Transfer Bank"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Tombol metode yang diklik mendapatkan fokus visual (warna biru pekat, bayangan halus).<br>b. State `method` di dalam form berubah sesuai pilihan aktif. | a. Metode terpilih berhasil mendapatkan aksen visual fokus.<br>b. State pembayaran terbukti berubah secara akurat sesuai tombol metode aktif. | Pilihan metode bayar interaktif bekerja dengan lancar tanpa ada kelambatan transisi visual. |

---

### 4.4 Riwayat Pemesanan & Polling Real-time

#### 4.4.1 Menyaring & Mencari Data Riwayat
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.4-001  
Nama Kasus Uji Riwayat Pemesanan & Polling Real-time  
Deskripsi Riwayat Pemesanan & Polling Real-time - Menyaring & Mencari Data Riwayat  
Kondisi Awal  
- Berada di halaman `MyBookings` ('my-bookings')  
Tanggal Pengujian  
19 Mei 2026  
Penguji Aorinka Anendya  
Skenario  
1. Ketik nama "Lintang" pada kolom pencarian riwayat<br>2. Klik tombol filter status "Menunggu" (Pending)  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Baris riwayat tersaring dinamis menampilkan transaksi milik Lintang saja.<br>b. Daftar riwayat menyempit hanya memuat transaksi berstatus Pending. | a. Baris riwayat berhasil tersaring menampilkan transaksi nama Lintang.<br>b. Filter status Pending sukses menyaring data riwayat transaksi secara dinamis. | Fitur pencarian cepat dan penyaringan status transaksi di riwayat sewa berfungsi dengan sangat responsif dan akurat. |

<br>

#### 4.4.2 Polling Status Real-time Riwayat
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.4-002  
Nama Kasus Uji Riwayat Pemesanan & Polling Real-time  
Deskripsi Riwayat Pemesanan & Polling Real-time - Polling Status Real-time Riwayat  
Kondisi Awal  
- Tab riwayat pelanggan terbuka dengan transaksi Pending  
Tanggal Pengujian  
19 Mei 2026  
Penguji Althafia Defiyandrea  
Skenario  
1. Biarkan tab riwayat terbuka tanpa melakukan interaksi.<br>2. Di tab admin terpisah, lakukan "Confirm" pada pesanan tersebut.<br>3. Tunggu hingga 10 detik.  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Label status transaksi Pending berubah otomatis menjadi Confirmed (hijau) di layar pelanggan tanpa dimuat ulang manual. | a. Berhasil mengubah status transaksi menjadi Confirmed secara otomatis setelah interval polling backend terpenuhi. | Logika interval polling database latar belakang 10 detik berfungsi optimal, mensinkronkan status data riwayat secara real-time. |

---

### 4.5 Monitor Fullscreen Layar Utama

#### 4.5.1 Menampilkan Monitor Fullscreen (Display Mode)
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.5-001  
Nama Kasus Uji Monitor Fullscreen Layar Utama  
Deskripsi Monitor Fullscreen Layar Utama - Menampilkan Monitor Fullscreen  
Kondisi Awal  
- Halaman beranda termuat dengan benar  
Tanggal Pengujian  
19 Mei 2026  
Penguji Muhammad Idham  
Skenario  
1. Klik tombol bulat biru berikon Monitor di kanan bawah layar.<br>2. Klik tombol "Exit/Kembali" pada halaman monitor.  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Halaman beralih ke papan jadwal layar penuh digital scoreboard tanpa header/footer.<br>b. Mengeklik exit mengembalikan pengguna ke halaman utama. | a. Berhasil memicu transisi ke Display Mode digital scoreboard fullscreen.<br>b. Tombol exit sukses memulihkan tampilan ke beranda awal. | Tampilan scoreboard monitor lobby (Display Mode) telah terintegrasi dengan baik dan dapat dioperasikan secara penuh. |

---

### 4.6 Dashboard Admin

#### 4.6.1 Login Admin
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.6-001  
Nama Kasus Uji Dashboard Admin  
Deskripsi Dashboard Admin - Login Admin  
Kondisi Awal  
- Halaman `/admin-dashboard` memuat `LoginPage`  
Tanggal Pengujian  
19 Mei 2026  
Penguji Rizky Hanifa  
Skenario  
1. Masukkan Username: `admin`, Password: `admin` (Kredensial valid)<br>2. Klik "Masuk ke Dashboard"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Otentikasi diterima.<br>b. Sistem menyimpan token keamanan ke localStorage dan memuat halaman utama Dasbor Admin beserta menu navigasi sidebar. | a. Otentikasi masuk sukses diterima.<br>b. Token keamanan berhasil disimpan dan sistem memuat menu Dashboard Admin lengkap. | Otentikasi admin (Login) telah bekerja dengan aman. Akses menu dasbor terkunci bagi user umum tanpa token valid. |

<br>

#### 4.6.2 Menampilkan Dashboard Ringkasan & Statistik Admin
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.6-002  
Nama Kasus Uji Dashboard Admin  
Deskripsi Dashboard Admin - Menampilkan Dashboard Ringkasan  
Kondisi Awal  
- Admin berhasil login  
Tanggal Pengujian  
19 Mei 2026  
Penguji Rezky Pratiwi  
Skenario  
1. Buka tab "Ringkasan" (OverviewTab) pada menu sidebar admin  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Menampilkan empat widget card statistik: Pendapatan Total, Total Pemesanan, Lapangan Aktif, dan Persentase Okupansi.<br>b. Menampilkan grafik data statistik tren mingguan sistem secara visual. | a. Berhasil menampilkan empat card ringkasan statistik.<br>b. Grafik tren mingguan termuat secara visual dengan baik. | Halaman ringkasan statistik (Overview) admin berjalan lancar. Seluruh data numerik termuat akurat berdasarkan catatan database. |

---

### 4.7 Manajemen Lapangan & Jadwal Member HALL BINTANG JAYA SPORT

#### 4.7.1 Manajemen Lapangan (Tambah Data & Harga)
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.7-001  
Nama Kasus Uji Manajemen Lapangan & Jadwal Member HALL BINTANG JAYA SPORT  
Deskripsi Manajemen Lapangan - Tambah Data & Harga Lapangan  
Kondisi Awal  
- Login sebagai admin, buka tab "Manajemen Lapangan"  
Tanggal Pengujian  
19 Mei 2026  
Penguji Muhammad Rizaldy  
Skenario  
1. Isi form input: Nama Lapangan: `Lapangan 4 - Semen`, Harga: `60000`, upload URL foto valid.<br>2. Klik tombol "Simpan" / "Tambah"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Data tersimpan dalam server database.<br>b. Tampil Toast Success: *"Lapangan baru berhasil ditambahkan"*.<br>c. Lapangan baru termuat di tabel admin dan jadwal sewa pelanggan. | a. Data lapangan baru berhasil disimpan.<br>b. Toast Success berhasil terpicu.<br>c. Lapangan baru sukses ditampilkan di grid jadwal pelanggan. | Operasi penambahan master data lapangan baru berjalan dengan sukses dan langsung terintegrasi secara instan di sisi pengguna. |

<br>

#### 4.7.2 Manajemen Lapangan (Hapus Lapangan)
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.7-002  
Nama Kasus Uji Manajemen Lapangan & Jadwal Member HALL BINTANG JAYA SPORT  
Deskripsi Manajemen Lapangan - Hapus Lapangan  
Kondisi Awal  
- Terdapat minimal satu data lapangan aktif  
Tanggal Pengujian  
19 Mei 2026  
Penguji Ananta Puti  
Skenario  
1. Klik tombol "Hapus" (ikon tong sampah) pada salah satu baris lapangan di tabel admin  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Muncul dialog konfirmasi browser/modal keamanan.<br>b. Setelah disetujui, data terhapus dari DB dan langsung menghilang dari daftar tabel admin. | a. Dialog konfirmasi keamanan berhasil dimunculkan.<br>b. Data lapangan sukses terhapus dan hilang dari UI tabel admin. | Fitur penghapusan data lapangan berfungsi dengan aman didukung oleh dialog konfirmasi pencegah ketidaksengajaan. |

<br>

#### 4.7.3 Blokir Jadwal Rutin Member HALL BINTANG JAYA SPORT (Collision Avoidance)
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.7-003  
Nama Kasus Uji Manajemen Lapangan & Jadwal Member HALL BINTANG JAYA SPORT  
Deskripsi Manajemen Lapangan - Blokir Jadwal Rutin Member HALL BINTANG JAYA SPORT  
Kondisi Awal  
- Berada di tab "Jadwal Member HALL BINTANG JAYA SPORT" (MemberScheduleTab)  
Tanggal Pengujian  
19 Mei 2026  
Penguji Lintang Suminar  
Skenario  
1. Daftarkan member rutin: Nama: "HALL BINTANG JAYA SPORT Raya", Lapangan: "Lapangan 1", Hari: "Jumat", Jam: "19:00 - 21:00".<br>2. Klik Simpan.<br>3. Buka halaman jadwal pelanggan di hari Jumat jam 19:00.  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Data member terdaftar di database.<br>b. Kalender pelanggan secara otomatis mengunci jam sewa tersebut, berwarna ungu, bertuliskan label "Member HALL BINTANG JAYA SPORT - HALL BINTANG JAYA SPORT Raya" (tidak bisa disewa umum). | a. Data member tetap berhasil didaftarkan.<br>b. Kalender sewa pelanggan otomatis mengunci slot hari Jumat jam 19:00-21:00 dengan warna ungu dan label member tetap. | Logika penanganan dan perlindungan benturan jadwal (*schedule collision*) untuk member tetap PB berfungsi sepenuhnya sesuai dengan aturan bisnis. |

<br>

#### 4.7.4 Pengaturan Parameter Sistem (Settings Tab)
Identifikasi HALLBINTANGJAYASPORT-PDHUPL.7-004  
Nama Kasus Uji Manajemen Lapangan & Jadwal Member HALL BINTANG JAYA SPORT  
Deskripsi Manajemen Lapangan - Pengaturan Parameter Sistem  
Kondisi Awal  
- Berada di tab "Pengaturan Sistem" (SettingsTab)  
Tanggal Pengujian  
19 Mei 2026  
Penguji Aorinka Anendya  
Skenario  
1. Ubah nomor WhatsApp Admin menjadi: `081299998888`<br>2. Klik tombol "Simpan Pengaturan"  
Hasil  
| Yang Diharapkan | Pengamatan | Kesimpulan |
| :--- | :--- | :--- |
| a. Muncul Toast Success menandakan data baru tersimpan di database config.<br>b. Informasi kontak pada footer website pelanggan berubah secara otomatis mengikuti konfigurasi baru. | a. Toast Success tanda data tersimpan berhasil dimunculkan.<br>b. Informasi kontak WhatsApp di footer website pelanggan sukses berubah otomatis. | Fitur penyesuaian parameter global sistem operasional berjalan lancar dan perubahannya ter-sync dinamis ke halaman publik. |

---

## 5. Matriks Keterunutan

**Tabel 2. Matriks Keterunutan**
| No. | Kebutuhan | Skenario Pengujian |
| :---: | :--- | :--- |
| **1** | DT-HALLBINTANGJAYASPORT.K-001 | HALLBINTANGJAYASPORT-PDHUPL.1-001, HALLBINTANGJAYASPORT-PDHUPL.1-002, HALLBINTANGJAYASPORT-PDHUPL.1-003 |
| **2** | DT-HALLBINTANGJAYASPORT.K-002 | HALLBINTANGJAYASPORT-PDHUPL.2-001, HALLBINTANGJAYASPORT-PDHUPL.2-002, HALLBINTANGJAYASPORT-PDHUPL.2-003 |
| **3** | DT-HALLBINTANGJAYASPORT.K-003 | HALLBINTANGJAYASPORT-PDHUPL.3-001, HALLBINTANGJAYASPORT-PDHUPL.3-002, HALLBINTANGJAYASPORT-PDHUPL.3-003 |
| **4** | DT-HALLBINTANGJAYASPORT.K-004 | HALLBINTANGJAYASPORT-PDHUPL.4-001, HALLBINTANGJAYASPORT-PDHUPL.4-002, HALLBINTANGJAYASPORT-PDHUPL.5-001 |
| **5** | DT-HALLBINTANGJAYASPORT.K-005 | HALLBINTANGJAYASPORT-PDHUPL.6-001, HALLBINTANGJAYASPORT-PDHUPL.6-002 |
| **6** | DT-HALLBINTANGJAYASPORT.K-006 | HALLBINTANGJAYASPORT-PDHUPL.7-001, HALLBINTANGJAYASPORT-PDHUPL.7-002, HALLBINTANGJAYASPORT-PDHUPL.7-003, HALLBINTANGJAYASPORT-PDHUPL.7-004 |

---

## 6. Lampiran
### 🖥️ Spesifikasi Tampilan Layar Pengujian
Pengujian visual responsivitas layout aplikasi sewa bulu tangkis HALL BINTANG JAYA SPORT diuji menggunakan simulasi browser Chrome DevTools Device Mode dengan parameter:
1.  **Layar Desktop/PC:** Resolusi 1920 x 1080 piksel (Kalender 7 hari penuh ditampilkan secara mendatar).
2.  **Layar Tablet (iPad Mini):** Resolusi 768 x 1024 piksel (Tampilan kalender adaptif dengan gulir horizontal otomatis).
3.  **Layar Mobile (iPhone 13):** Resolusi 390 x 844 piksel (Kalender berganti format menjadi Tab Selector Hari horizontal, memuat grid 1 hari aktif per tab).

### ✍️ Tanda Tangan Penanggung Jawab Tim Penguji

Purwokerto, 19 Mei 2026

```
Dipersiapkan oleh:
Ketua Tim Penguji / QA


( Lintang Suminar Tyas Wening )
NIM. 2211104009
```
