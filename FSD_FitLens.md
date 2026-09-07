PT CIPTA SEDAYA DIGITAL INDONESIA
-
Functional Specification Document
Author : Fredericus Dwi Nugraha Putra
Version : 1.0.0
Last Update : 2026.08.24
Soft Copy Name : FSD_ FinLens (24082026).docx
Copyright © 2022 PT. Cipta Sedaya Digital Indonesia. All rights reserved. These
materials are confidential and proprietary to PT. Cipta Sedaya Digital Indonesia
and no part of these materials should be reproduced, published in any form by any
means, electronic or mechanical including photocopy or any information storage or
retrieval system nor should the materials be disclosed to third parties without the
express written authorization of PT. Cipta Sedaya Digital Indonesia.

Riwayat Versi

| Versi  Tanggal     | Penulis            |                      | Riwayat   |
| ------------------ | ------------------ | -------------------- | --------- |
| 1.0.0  24/08/2026  | Fredericus Dwi NP  | ●  Terbitan pertama  |           |

|     |     | ●    |     |
| --- | --- | ---- | --- |
|     |     | ●    |     |
|     |     | ●    |     |
|     |     | ●    |     |
|     |     | ●    |     |
|     |     | ●    |     |

Kaidah Simbol dan Istilah
| a.  Tipe Kolom   |     |     |
| ---------------- | --- | --- |

| Singkata | Keterangan  | Ilustrasi  |
| -------- | ----------- | ---------- |
n
| TSL  Textbox Single Line  |     |     |
| ------------------------- | --- | --- |

| TAR  Text Area  |     |     |
| --------------- | --- | --- |

| TML  Textbox Multiple Line  |     |     |
| --------------------------- | --- | --- |

| DDL  Dropdown List  |     |     |
| ------------------- | --- | --- |

| DDS  Dropdown Search  |     |     |
| --------------------- | --- | --- |

| CKB  Check Box  |     |     |
| --------------- | --- | --- |

| RDB  Radio Button  |     |     |
| ------------------ | --- | --- |

| LBL  Label           |     |     |
| -------------------- | --- | --- |
| DPL  Date Pick List  |     |     |

| SCH  Search  |     |     |
| ------------ | --- | --- |
| PHT  Photo   |     |     |

| TGL  Toggle Switch  |     |     |
| ------------------- | --- | --- |
or
| LUMLO  Look Up Multi Line Option  |     |     |
| --------------------------------- | --- | --- |

| FUP  File Uploader  |     |     |
| ------------------- | --- | --- |

| PGB  Progress Bar  |     |     |
| ------------------ | --- | --- |

| UPL  Uploader  |     |     |
| -------------- | --- | --- |

b. Tipe Data
Singkata Penanda Tipe Data atau Format Deskripsi
n
NUM (<length>, <decimal length>) Numeric
APB (<length>) Alphabet
APN (<length>) Alphanumeric
DTE (YYYY-MM-DD) Date
DTM (YYYY-MM-DD HH:ii:ss) Date and Time
TME (HH:ii:ss) Time
IMG Image
TXT Text
c. Status Kolom
Singkata Arti Deskripsi
n
M Mandatory Kolom yang wajib diisi
O Optional Kolom yang tidak wajib diisi
D Display 1. Kolom yang hanya berupa informasi
2. Kolom ini tidak dapat diinput atau tidak dapat diubah
3. Sifat mirip seperti label
C System calculated Kolom yang berisikan nilai yang berasal dari hasil perhitungan tertentu
d. Tipe Kontrol
Singkata Keterangan Ilustrasi
n
BTN Button
HYP Hyperlink View | Edit
TAB Tab
OPT Option
Button or
ROW Table Row

1. Struktur Kebutuhan 6
2. Solusi Kebutuhan 6
3. Login / Authentication 7
3.1. Sistem FinLens Halaman Login 7
3.2. Flow Login
Login 8
3.3. UI & Field Description Project Management Login 11
3.4. Action Control Halaman Login 27
4. Master Tenant Management 28
4.1. Menu Master Tenant 28
4.2. Flow User Master Tenant 29
4.3. UI & Field Description Halaman Master Tenant 32
4.4. Action Control Halaman Master Tenant 39
5. Master User 40
5.1. Menu Master User 40
5.2. Flow User Management Master User 41
5.3. UI & Field Description Halaman Management Master User 43
5.4. Action Control Halaman Master User 51
6. Master Role 53
6.1. Menu Master Role 53
6.2. Flow Master Role 54
6.3. UI & Field Description Halaman Master Role 56
6.4. Action Control Halaman Master Role 65
7. Master Saverity 68
7.1. Menu Master Saverity 68
7.2. Flow Halaman Master Anomali 69
7.3. UI & Field Description Master Anomali 71
7.4. Action Control Menu Master Anomali 80
8. Master Kategori File 81
8.1. Menu Master Kategori File 81
8.2. Flow Management Master Kategori File 82
8.3. UI & Field Description Management Master Kategori File 84
8.4. Action Control Menu Master Kategori File 92
9. Submit Document 94
9.1. Halaman Submit Document 94
9.2. Flow Management Submit Document 95
9.3. UI & Field Description Management Submit Document 97
9.4. Action Control Submit Document 106
10. History Document 108
10.1. Menu History Document 108
10.2. Flow History Document 109
10.3. UI & Field Description History Document 111
10.4. Action Control History Document 118
11. Activity Log User 119
11.1. Menu Activity Log User 119
11.2. Flow Activity Log User 120
11.3. UI & Field Description Activity Log User 122
11.4. Action Control Activity Log User 126

12. Halaman Dashboard 127
12.1. Menu Dashboard 127
12.2. Flow Dashboard 128
12.3. UI & Field Description Dashboard 130
12.4. Action Control Dashboard 133
13. Notifikasi 134
13.1. Menu Notifikasi 134
13.2. Flow Activity Notifikasi 135
13.3. UI & Field Description Notifikasi 136
13.4. Action Control Notifikasi 140
14. Setting Profile 140
14.1. Menu Setting Profile 140
14.2. Flow Activity Setting Profile 141
14.3. UI & Field Description Setting Profile 143
14.4. Action Control Setting Profile 147
1. Struktur Kebutuhan
Deskripsi
Untuk menunjang dalam memvalidasi document Finance/Docuemnt
pengantar lainnya maka dibutuhkan sistem Project Finlens diamana sistem ini
akan menjalankan proses pengecekan dan validasi document melalui engine
AI , yang kemudian admin dapat melakukan pengecekan kembali dari hasil
validasi sistem. Diharapkan dari validasi dan pengecekan by sistem ini dapat
mempermudah dalam pendataan dan validasi document pengantar yang
dibutuhkan Perusahaan dalam pengecekan.
Gambaran Umum
Batasan Pembahasan
Adapun batasan pada sistem FinLens adalah sebagai berikut :
a. Login ke aplikasi mengunakan MFA
b. Super User dimana user ini merupakan owner pemegang/pemilik aplikasi,
user owner ini dapat mengakses semua menu dan menambah Tenant di menu
Tenant Management.
c. User Tenant merupakan role akses yang memiliki akses ke sistem yang dibuat
dari Super User, .
d. User berdasarkan role admin dapat mengakses menu UAM (Master User,
Master Role Manajement), .

e. User berdasarkan role admin dapat mengakses menu Master Saverity, Master
Label, Master Kategori File, Master Detection Setting, Dashboard, dan
Activity Log User) .
f. User berdasarkan role submitter dapat mengakses menu Submit Document
dan History Document.
g. User berdasarkan role Checker dapat mengakses menu Submit Document
2. Solusi Kebutuhan
Pada fase 1 ini akan dibangun Sistem FinLens sebagai Sistem Pengecekan
Document . Pada Sistem FinLens ini akan terdapat beberapa menu dan fitur yang dapat
diakses oleh user. Dari beberapa menu pada aplikasi FinLens ,pada dokumen ini akan
dibahas terkait dengan Login Authentication, Tenant Management, UAM (Master User
dan Master Role Management), Masterize Data (Master Saverity, Master Label, Master
Kategory File, Master Detection Setting, Dashboard, dan Activity Log User), .
3. Login / Authentication
3.1. Sistem FinLens Halaman Login
Halaman Login pada aplikasi ini akan digunakan untuk user dapat melakukan
Login untuk mengakses FinLens. Halaman ini akan muncul jika dalam kondisi user
mengakses sistem aplikasi tanpa melakukan login dan menu yang diakses
memerlukan user untuk login.

3.2. Flow Login
Login
Rincian Flow Detail
1. Verifikasi Pengguna (Master User Management)
- User memasukkan kredensial (Email & Password).
- Sistem melakukan pengecekan ke database Master User Management.
Jika akun tidak ditemukan atau berstatus non-aktif, sistem langsung
menolak akses.
2. Authentication Tahap Pertama (Primary Authentication)
- Jika akun terdaftar, sistem mevalidasi kebenaran username & password.
- Jika usernamne / password salah, proses kembali ke form login.

3. Authentication Multi-Faktor (MFA via Microsoft Authenticator)
- Setelah kredensial utama valid, sistem meminta verifikasi OTP (6 digit)
dari aplikasi Microsoft Authenticator.
- Jika kode OTP yang dimasukkan salah atau sudah kadaluwarsa
(time-out), user diminta memasukkan kembali kode OTP yang baru.
4. Otorisasi & Akses Masuk
- Setelah OTP terverifikasi, sistem menerbitkan token autentikasi
(Session/JWT).
- User berhasil masuk ke halaman utama/Dashboard Project FinLens.

Forgot Password

Rincian Keamanan Proses Reset Password :
- Validasi Email : Sistem hanya memproses permintaan reset jika email tercatat
aktif di database.
- Keamanan Link & Token : Link reset password wajib menyertakan token acak
(cryptographically secure) yang memiliki masa berlaku terbatas (Selama 30
menit) dan otomatis tidak berlaku lagi (expire) setelah digunakan satu kali.
- Invalidasi Token: Setelah password berhasil diperbarui, token lama langsung
expired/tidak berlaku untuk mencegah penggunaan kembali (replay attack).
3.3. UI & Field Description Project Management Login
SISTEM APLIKASI
Halaman Login FinLens

Kondisi False Email & Password

MFA Authentication Awal + QRCode

Input MFA Authentication

Halaman Sukses Authentication

Kondisi OTP salah

Kondisi OTP Expired

Inputan Email - Lupa Password

Sukses link reset password

Halaman Create New Password

Halaman Sukses Reset Password

Halaman Reset Errro Format Password

Password Tidak Sama
Berikut adalah tampilan Login untuk Sistem Aplikasi FinLens. Untuk proses Login
pada Sistem Aplikasi FinLens ada beberapa ketentuan antara lain :
1. Verify & Status Akun (Master User Management)
- Terdaftar di Master User Data: Pengguna wajib sudah didaftarkan
(created/added) terlebih dahulu oleh Administrator pada Master User
Management.
- Status Akun Aktif: Pengguna hanya dapat melakukan autentikasi jika
status akun berada dalam kondisi Aktif. Akun yang dinonaktifkan
(Deleted) otomatis ditolak oleh sistem.
2. Authentication Utama (Primary Authentication)
- Kredensial: Login tahap pertama membutuhkan Email Terdaftar dan
Password yang sesuai.
- Pembatasan Percobaan (Rate Limiting): Terdapat batas maksimal
kesalahan input password (misal: 3 kali percobaan berturut-turut). Jika
terlampaui, akun akan terkunci sementara untuk mencegah serangan
brute force (Harus menunggu selama 3 jam untuk input password lagi).

3. Authentication Multi-Faktor (MFA / Two-Factor Authentication)
- Wajib MFA: Setiap pengguna yang berhasil lolos verifikasi kredensial
utama diwajibkan melewati tahap verifikasi MFA.
- Integrasi Microsoft Authenticator: Kode One-Time Password (OTP) 6
digit diproses dan disinkronkan menggunakan aplikasi Microsoft
Authenticator (TOTP).
- Batas Waktu OTP: Kode OTP berlaku dalam durasi terbatas ( 30 detik).
Jika expired, pengguna harus memasukkan kode terbaru yang muncul di
aplikasi authentication.
4. Manajemen Sesi & Keamanan (Session Management)
- Pembuatan Token : Sesi berjalan hanya setelah verifikasi OTP berhasil,
ditandai dengan pembuatan token autentikasi (JWT / Session Token).
- Single Sign-Active : Jika akun terdeteksi login di perangkat lain, sesi
lama dapat diakhiri secara otomatis.
- Timeout Otomatis : Sesi pengguna akan berakhir secara otomatis (idle
session timeout) jika tidak ada aktivitas dalam jangka waktu 60 menit.
Rincian Alur Logika Multi-Tenant (Flow Detail)
1. Autentikasi Utama & MFA
- User memasukkan Email & Password yang divalidasi ke database
Master User Management.
- Setelah kredensial valid, user diwajibkan melewati verifikasi kode OTP
6-digit dari Microsoft Authenticator.
2. Identifikasi & Validasi Tenant (Multi-Tenant Isolation)
- Pencarian Context Tenant: Setelah MFA berhasil, sistem mengambil
metadata pengguna untuk mengambil Tenant ID (misal:
Organisasi/Perusahaan tempat user berada).
- Status Tenant: Sistem memeriksa apakah status Tenant ID tersebut
berada dalam kondisi Aktif (bukan Deleted/Non Aktif). Jika tenant tidak
valid atau dinonaktifkan, akses akan ditolak meskipun kredensial user
valid.
3. Pembuatan Token & Pembatasan Akses (Scope Enforcement)
- JWT Payload dengan Tenant Context: Token authentication (JWT)
yang dibuat secara eksplisit menyertakan data Tenant ID di dalamnya.
- Isolasi Data: Setiap query data atau API call yang dilakukan oleh
pengguna selama sesi berlangsung akan selalu memuat filter otomatis
berdasarkan Tenant ID pengguna tersebut. Hal ini memastikan pengguna
tidak dapat melihat atau mengakses data milik tenant lain.

Sistem aplikasi FinLens menerapkan prosedur pemulihan kata sandi (password
recovery) yang aman untuk memastikan bahwa tautan reset hanya dapat diakses oleh
pemilik akun yang terdaftar. Berikut adalah ketentuan dan flow bisnis pada proses
Forgot Password:
1. Verifikasi Status Email & Akun (Master User Management)
- Pengecekan Validasi Email: Sistem hanya memproses permintaan reset
password jika alamat email yang dimasukkan terdaftar di database
Master User Management.
- Status Akun Harus Aktif: Email dari akun yang berstatus non-aktif
(Deleted), tidak akan menerima pesan reset password.
2. Mekanisme Link & Token Keamanan (Secure Link Mechanism)
- Pengiriman via Email: Instruksi beserta tautan (link) perubahan
password dikirim secara otomatis ke email terdaftar pengguna.
- Token Sekali Pakai (One-Time Token): Link reset berisi kode token unik
(cryptographically secure token). Token ini otomatis tidak aktif (invalid)
setelah digunakan satu kali.
- Masa Berlaku Terbatas (Expiration Time): Link reset password memiliki
batas waktu aktif yang singkat ( 30 menit). Jika batas waktu terlampaui,
link tidak dapat digunakan lagi dan pengguna harus mengajukan ulang.
3. Ketentuan Password Baru & Invalidasi Sesi
- Ketentuan & Format Password: Password baru wajib memenuhi standar
keamanan sistem FinLens (misal: minimal 8 karakter, kombinasi huruf
besar, huruf kecil, angka, dan karakter spesial).
- Pembersihan Sesi (Session Revocation): Setelah password berhasil
diperbarui :
a. Token reset password langsung diinvalidated.
Login :
Field Tipe Tipe Sample Description (DESC) & Business
No Status Length
Name Data Field Value Rules (BR)
DESC: Menampilkan logo
Logo resmi aplikasi FinLens.BR:
1 D - IMG - logo.png
FinLens Tampil di bagian atas form
login.
DESC: Input alamat email
pengguna.BR: Wajib diisi,
user@comp format email valid, dan harus
2 Email M 100 APN TXT
any.com terdaftar serta aktif pada
database Master User
Management.
DESC: Input kata sandi
pengguna.BR: Wajib diisi. Teks
Passwor P@ssw0rd1 disamarkan (masked) secara
3 M 64 APN TXT
d 23 default. Mengikuti ketentuan
batas maksimal kesalahan
input (rate limiting).

DESC: Tombol untuk
| Show    |       |           |            | menampilkan/menyembunyika       |
| ------- | ----- | --------- | ---------- | ------------------------------- |
| 4       | O  -  | APB  OPT  | Show/Hide  |                                 |
| Passwor |       |           |            | n karakter password.BR:         |
| d       |       |           |            | Mengubah visibilitas teks pada  |
Field Password.
DESC: Tautan untuk navigasi
| Lupa  |     |     |     | ke halaman reset  |
| ----- | --- | --- | --- | ----------------- |
Lupa
| 5  Passwor | O  -  | APB  HYP  |     | password.BR: Mengarahkan  |
| ---------- | ----- | --------- | --- | ------------------------- |
Password?
| d?  |     |     |     | pengguna ke halaman Forgot  |
| --- | --- | --- | --- | --------------------------- |
Password.
DESC: Tombol untuk
memproses autentikasi tahap
pertama.BR: Memvalidasi
kombinasi Email dan
| 6  Masuk  | M  -  | APB  BTN  | MASUK  | Password ke Master User  |
| --------- | ----- | --------- | ------ | ------------------------ |
Management. Jika valid,
sistem memicu
pengiriman/permintaan kode
OTP.
DESC: Input 6 digit kode
OTP.BR: Wajib diisi 6 digit
angka yang dihasilkan oleh
Kode
| 7   | M  6  | NUM  TXT  | 123456  | aplikasi Microsoft  |
| --- | ----- | --------- | ------- | ------------------- |
OTP
Authenticator. Kode memiliki
masa berlaku (time-out 30
detik).
DESC: Tombol untuk
memvalidasi kode OTP
MFA.BR: Memvalidasi OTP.
Jika valid, sistem memeriksa
| 8  Verifikasi  | M  -  | APB  BTN  | VERIFIKASI  |     |
| -------------- | ----- | --------- | ----------- | --- |
Tenant ID aktif pengguna,
menerbitkan JWT token
dengan context tenant, dan
mengarahkan ke Dashboard
FinLens.
DESC: Tombol untuk
membatalkan proses MFA.BR:
Batal /
| 9   | O  -  | APB  BTN  | Batal  | Mengembalikan tampilan  |
| --- | ----- | --------- | ------ | ----------------------- |
Kembali
pengguna ke form input
kredensial (Step 1).

Forgot Password :
|     | Statu Lengt | Tipe  Tipe  | Sample  | Description (DESC) & Business  |
| --- | ----------- | ----------- | ------- | ------------------------------ |
No  Field Name
|     | s  h  | Data  Field  | Value  | Rules (BR)  |
| --- | ----- | ------------ | ------ | ----------- |
1  Logo FinLens  D  -  IMG  -  logo.png  DESC: Menampilkan logo
resmi aplikasi FinLens.
DESC: Input email untuk
pengiriman link reset
password.BR: Wajib diisi
user@comp
| 2  Email Terdaftar  | M  100  | APN  TXT  |          |                             |
| ------------------- | ------- | --------- | -------- | --------------------------- |
|                     |         |           | any.com  | dengan format email valid.  |
Permintaan hanya diproses
jika email terdaftar & aktif di
Master User Management.
DESC: Tombol untuk memicu
pengiriman email reset
password.BR: Menggenerate
KIRIM LINK
3  Kirim Link Reset  M  -  APB  BTN  token reset unik (sekali pakai,
RESET
expired 15-30 menit) dan
mengirimkan link verifikasi ke
email pengguna.

DESC: Tautan navigasi kembali
4  Kembali ke  O  -  APB  HYP  <-- Kembali  ke halaman login.BR:
Login
Mengarahkan pengguna
kembali ke form Login Step 1.
DESC: Input kata sandi baru
(pada form dari link email).BR:
Wajib memenuhi standar
|                   |        |           | N3wP@ssw | keamanan FinLens (min. 8   |
| ----------------- | ------ | --------- | -------- | -------------------------- |
| 5  Password Baru  | M  64  | APN  TXT  |          |                            |
|                   |        |           | 0rd!     | karakter, kombinasi huruf  |
besar/kecil, angka, simbol)
dan tidak boleh sama dengan
password saat ini.
DESC: Input ulang kata sandi
| Konfirmasi     |        |           | N3wP@ssw | baru untuk verifikasi.BR: Nilai  |
| -------------- | ------ | --------- | -------- | -------------------------------- |
| 6              | M  64  | APN  TXT  |          |                                  |
| Password Baru  |        |           | 0rd!     | harus 100% identik dengan        |
Field Password Baru.
DESC: Tombol untuk
memperbarui password di
sistem.BR: Memperbarui
password di Master User
| 7  Simpan  | M  -  | APB  BTN  | SIMPAN    |                              |
| ---------- | ----- | --------- | --------- | ---------------------------- |
| Password   |       |           | PASSWORD  | Management, meng-invalidasi  |
token reset, mengakhiri
seluruh sesi aktif di perangkat
lain, dan mengarahkan ke
halaman login.

3.4.  Action Control Halaman Login

| No  Control  | Type  | Description (DESC)  | Business Rules (BR)  |     |
| ------------ | ----- | ------------------- | -------------------- | --- |
Saat diklik, sistem mengarahkan
Menampilkan atau
| Show / Hide  |      |                               | visibilitas karakter password antara  |     |
| ------------ | ---- | ----------------------------- | ------------------------------------- | --- |
| 1            | OPT  | menyembunyikan karakter teks  |                                       |     |
| Password     |      |                               | mode tersembunyi (masked) dan teks    |     |
pada view Password.
biasa (plain text).
|                    |      | Navigasi cepat dari form login  | Saat diklik, sistem mengarahkan    |     |
| ------------------ | ---- | ------------------------------- | ---------------------------------- | --- |
| 2  Hyperlink Lupa  | HYP  |                                 |                                    |     |
|                    |      | menuju ke proses pemulihan      | pengguna ke layar Forgot Password  |     |
Password
|     |     | akun.  | (Step 1: Request Link).  |     |
| --- | --- | ------ | ------------------------ | --- |
* Memvalidasi apakah Email dan
Password terisi.* Menguji kecocokan
kredensial ke database Master User
Management.* Jika salah: Menampilkan
Eksekusi validasi kredensial
| 3  Button Masuk  | BTN  |     | pesan error dan menambah jumlah  |     |
| ---------------- | ---- | --- | -------------------------------- | --- |
utama (Email dan Password).
percobaan gagal (max try rate limit).*
Jika benar: Menampilkan pop-up /
modal verifikasi Microsoft Authenticator
OTP.
* Memvalidasi kode OTP 6 digit terhadap
sistem Microsoft Authenticator (TOTP).*
Jika OTP salah/kadaluwarsa:
|     |     | Proses validasi kode OTP 6  | Menampilkan pesan error.* Jika OTP  |     |
| --- | --- | --------------------------- | ----------------------------------- | --- |
Button Verifikasi
4  BTN  digit yang dimasukkan  valid: Memeriksa konteks Tenant ID
OTP
|     |     | pengguna.  | pengguna. Jika tenant aktif, sistem  |     |
| --- | --- | ---------- | ------------------------------------ | --- |
menerbitkan JWT token dan
mengarahkan pengguna ke Dashboard
FinLens sesuai batasan tenant-nya.
|                      |      | Membatalkan tahapan         | Menghapus sesi sementara autentikasi  |     |
| -------------------- | ---- | --------------------------- | ------------------------------------- | --- |
| 5  Button Batal OTP  | BTN  |                             |                                       |     |
|                      |      | verifikasi MFA dan menutup  | tahap pertama dan mengembalikan       |     |
modal OTP.
pengguna ke tampilan input kredensial

awal.

3.5.  Action Control Halaman Forgot Password

| No  Control  | Type  Description (DESC)  | Business Rules (BR)  |
| ------------ | ------------------------- | -------------------- |
* Memeriksa ketersediaan dan status aktif email di
|     | Memicu pengiriman  | Master User Management.* Jika terdaftar & aktif:  |
| --- | ------------------ | ------------------------------------------------- |
1  Button Kirim Link  BTN  instruksi dan tautan  Sistem meng-generate token reset unik (sekali pakai,
Reset
|     | pemulihan password ke  | expiry 15–30 menit) dan mengirimkan link ke email.*  |
| --- | ---------------------- | ---------------------------------------------------- |
|     | email terdaftar.       | Menampilkan pesan konfirmasi visual bahwa link       |
telah dikirimkan.
Navigasi untuk
2  Hyperlink  HYP  membatalkan proses  Mengarahkan kembali tampilan browser pengguna ke
| Kembali ke Login  |     | layar awal Login.  |
| ----------------- | --- | ------------------ |
reset dan kembali ke
halaman utama login.
Menampilkan atau
|                 | menyembunyikan  | Mengubah tipe field password dari masked menjadi  |
| --------------- | --------------- | ------------------------------------------------- |
| 3  Show / Hide  | OPT             |                                                   |
Password Baru  karakter pada kolom  plain text secara bersamaan untuk memastikan
|     | Password Baru dan  | akurasi pengetikan.  |
| --- | ------------------ | -------------------- |
Konfirmasi.
* Validasi kesesuaian antara Password Baru dan
Konfirmasi Password (harus identik).* Memastikan
Password Baru memenuhi kriteria tingkat kerumitan
(minimal 8 karakter, huruf besar/kecil, angka, simbol)
Memicu pembaruan
Button Simpan  dan tidak sama dengan password saat ini.* Jika valid:
| 4         | BTN  kata sandi baru ke  |                                                  |
| --------- | ------------------------ | ------------------------------------------------ |
| Password  |                          | Memperbarui password di Master User Management,  |
sistem database.
menghanguskan (burn/invalidate) token reset,
mengakhiri semua sesi login aktif di perangkat lain,
dan mengarahkan pengguna ke halaman login dengan
notifikasi sukses.

4.  Master Tenant Management

4.1.  Menu Master Tenant
Pada pengembangan aplikasi Project Management ini memiliki
mastering data Tenant, dimana informasi tenant akan disimpan terlebih dahulu ke
dalam database sistem, yang nantinya akan digunakan untuk proses di beberapa
halaman lainnya.

4.2. Flow User Master Tenant

Flow Detail :
1. Hak Akses & OTORISASI (Role Check)
- Sebelum membuka halaman Master Tenant Management, sistem
melakukan verifikasi role.
- Akses Menu Master Tenant Management hanya diberikan kepada Super
User (Owner Application FinLens). Pengguna dengan role lain akan
langsung ditolak (Menu Master Tenant Tidak ditampilkan / Access
Denied).
2. Tambah Tenant Baru (Create/Add Tenant)
- Super User memasukkan nama tenant baru.
- Validasi Unique Nama tenant : Sistem memeriksa apakah Nama
Tenant sudah pernah terdaftar (Duplicate) di database.
a. Jika nama sudah ada (duplicate), sistem menampilkan pesan
kesalahan.
b. Jika nama unik, sistem secara otomatis mengisikan :

I. ID Tenant (Auto-generated UUID / format ID khusus).
II. Created Date (Timestamp saat data dibuat).
III. Created By (User ID Super User yang sedang aktif).
c.
3. Ubah Informasi Tenant (Edit Tenant)
- Super User melakukan action edit pada tenant tertentu.
- Jika Nama Tenant diubah, sistem kembali memvalidasi keunikan nama
terhadap tenant lain.
- Saat disimpan, sistem mencatat :
a. Update Date (Timestamp pembaharuan terakhir).
b. Update By (User ID Super User yang melakukan perubahan).
4. Pengelolaan Status Tenant (Activate/Deactivate)
- Super User dapat mengubah status tenant menjadi Aktif atau Non-aktif.
- Jika tenant dinonaktifkan :
a. Seluruh pengguna yang ada di Tenant ID tersebut otomatis tidak
akan dapat meloloskan proses autentikasi/login (sebagaimana
alur login multi-tenant FinLens).
5. Pencatatan Audit Trail (Log Activity)
- Setiap aksi perubahaan data (Create, Update, dan Toggle Status) secara
otomatis memicu fungsi Log Activity.
- Log mencatat informasi penting meliputi :
a. User ID : Super User yang melakukan tindakan.
b. Action Type: CREATE_TENANT, UPDATE_TENANT, atau
CHANGE_TENANT_STATUS.
c. Timestamp: Waktu eksekusi hingga detik.
d. Detail Context: ID Tenant, Nama Tenant, serta data lama vs data
baru (audit trail).
4.3. UI & Field Description Halaman Master Tenant
MASTER TENANT

Image 17
Image 18

Image 19
Image 20

Image 19
Image 20

Panduan Aksesibilitas & Fitur Komponen
1. Search Filter: Kolom pencarian bersifat real-time Search berdasarkan parameter
Nama Tenant.
2. Pagination: Menyediakan navigasi halaman awal (<<), halaman sebelumnya
(<), penomoran halaman aktif ([1]), halaman berikutnya (>), dan halaman akhir
(>>).
3. Visual Status Toggle: Menggunakan warna status visual (misal: Hijau = Active,
Abu-abu/Merah = Non-Active) untuk memperjelas kondisi switch control.
4. Mode Control Modal: Pada aksi View Only, seluruh input box berada dalam
kondisi read-only/disabled dan tombol SIMPAN disembunyikan.
5. Fitur Modal Form & Handling :
- Auto-Focus: Kolom Nama Tenant otomatis menerima fokus
(auto-focused) begitu Modal Add atau Edit terbuka.
- Real-time Validation Indicator: Input Nama Tenant secara instan
memeriksa keunikan karakter saat pengguna mengetik (on-blur /
debounced input) dan memberikan tanda visual warna merah jika
terdeteksi duplikasi.
- Shortcut Action: Pengguna dapat klik tombol X pada keyboard untuk
menutup modal pop-up (Cancel) dan tombol Enter untuk memicu tombol
simpan/submit.
6. State Management Field :
- Read-Only Enforcements: Pada mode View Only, semua elemen form
dibuat disabled/read-only dengan warna latar belakang (greyed out) untuk
membedakan secara visual dari mode Edit.
Proses Bisnis (Business Process & Logic)
1. Aksi Add New Tenant (Tambah Tenant Baru)
- Inisiasi Aksi : Super User mengklik tombol + ADD NEW TENANT.
- Pengisian Data : Super User memasukkan Nama Tenant.
- Validasi Bisnis :
a. Mandatory Check : Nama Tenant tidak boleh kosong.
b. Unique Constraint Check : Sistem memeriksa ke database
apakah Nama Tenant sudah pernah terdaftar (bersifat
case-insensitive). Jika duplikat, sistem menampilkan pesan:
"Nama Tenant sudah digunakan".
- Penyimpanan Data :
a. Sistem mencatat status default tenant sebagai Aktif.
b. Sistem merekam waktu pembuatan secara otomatis di field
Created Date (system timestamp).
c. Sistem merekam identitas pembuat di field Created By
berdasarkan ID Super User yang sedang login.
- Logging : Sistem membuat entri Log Activity baru dengan aksi
CREATE_TENANT.
2. Aksi Edit Tenant (Ubah Data Tenant)
- Inisiasi Aksi : Super User mengklik ikon Edit pada baris tenant yang
dipilih.
- Loading Data: Sistem memuat data tenant terkait ke dalam Modal Edit.
- Pengubahan Data: Super User memperbarui Nama Tenant.
- Validasi Bisnis :

a.  Jika Nama Tenant tidak diubah, proses validasi keunikan dilewati.
b.  Jika Nama Tenant diubah, sistem memvalidasi keunikan nama
baru terhadap seluruh data tenant lain di database.
-  Penyimpanan Pembaruan :
a.  Data nama tenant diperbarui di database Master Tenant.
b.  Sistem memperbarui nilai pada field Update Date dengan waktu
eksekusi saat itu.
c.  Sistem memperbarui nilai pada field Update By dengan User ID
Super User yang melakukan pengubahan.
-  Logging: Sistem mencatat entri Log Activity dengan aksi
UPDATE_TENANT yang memuat detail data sebelum dan sesudah diubah
(Audit Trail).
-  Aksi View Only Data (Lihat Detail Tenant)
a.  Inisiasi Aksi: Super User mengklik ikon View (Detail) pada baris
tenant yang dipilih.
b.  Loading Data Read-Only: Sistem menampilkan modal detail
yang memuat informasi lengkap tenant meliputi :
|     | -   | Nama Tenant    |     |     |
| --- | --- | -------------- | --- | --- |
|     | -   | Created Date   |     |     |
|     | -   | Update Date    |     |     |
|     | -   | Update By      |     |     |
c.  Kontrol Aksesibilitas :
|     | -   | Seluruh inputan dalam keadaan terkunci (disabled).   |     |     |
| --- | --- | ---------------------------------------------------- | --- | --- |
|     | -   | Tombol SIMPAN dihilangkan, hanya menampilkan tombol  |     |     |
OKE.
d.  Batas Akses: Aksi ini murni bersifat pembacaan data
(Read-Only) sehingga tidak mengubah timestamp, tidak
mengubah metadata, dan tidak memicu penulisan Log Activity
perubahan data.

|     | Stat Leng | Tipe  Tipe  | Sample  | Description (DESC) & Business Rules  |
| --- | --------- | ----------- | ------- | ------------------------------------ |
No  Field Name
|     | us  th  | Data  Field  | Value  | (BR)  |
| --- | ------- | ------------ | ------ | ----- |
DESC: Menampilkan nama/logo
Logo / App
1  D  -  APB  -  FINLENS  aplikasi.BR: Tampil permanen di bagian
Title
header atas.
DESC: Navigasi menu utama Master
Tenant Management.BR: Hanya dapat
| Menu Master  |       |           | Master  |                                    |
| ------------ | ----- | --------- | ------- | ---------------------------------- |
| 2            | D  -  | APB  TAB  |         | diakses dan dilihat oleh pengguna  |
| Tenant       |       |           | Tenant  |                                    |
dengan role Super User (Owner
Application).
DESC: Field pencarian data tenant.BR:
Bank
| Search Nama  |         |           |          | Memfilter daftar tenant di tabel secara  |
| ------------ | ------- | --------- | -------- | ---------------------------------------- |
| 3            | O  100  | APN  TXT  | Central  |                                          |
| Tenant       |         |           |          | real-time atau on-enter berdasarkan      |
Asia
parameter nama tenant.
DESC: Tombol untuk membuka modal
+ ADD
| 4  Add New  | O  -  | APB  BTN  |     | pop-up pembuat tenant baru.BR:  |
| ----------- | ----- | --------- | --- | ------------------------------- |
NEW
| Tenant  |     |     |     | Mengarahkan Super User ke form input  |
| ------- | --- | --- | --- | ------------------------------------- |
TENANT
tenant baru.
Row Data
| 5   | D  -  | APN  ROW  | `1  | PT BCA  |
| --- | ----- | --------- | --- | ------- |
Tenant
DESC: Nomor urut baris data tabel.BR:
| 6  No  | C  5  | NUM  ROW  | 1   |     |
| ------ | ----- | --------- | --- | --- |
Dihasilkan otomatis oleh sistem

menyesuaikan urutan data dan nomor
halaman pagination.
DESC: Nama organisasi atau
|     |     |     | PT Bank  | perusahaan tenant.BR: Wajib diisi.  |
| --- | --- | --- | -------- | ----------------------------------- |
7  Nama Tenant  M  100  APN  TXT  Central  Bersifat unik (case-insensitive), tidak
Asia
boleh sama dengan nama tenant yang
sudah ada di database.
DESC: Tanggal dan waktu pembuatan
|                  |        |           | 2026-01-15  | record tenant.BR: Direkam otomatis oleh  |
| ---------------- | ------ | --------- | ----------- | ---------------------------------------- |
| 8  Created Date  | C  19  | DTM  ROW  |             |                                          |
|                  |        |           | 8:30:00     | sistem (system timestamp) saat tenant    |
pertama kali dibuat.
DESC: Tanggal dan waktu pembaruan
data tenant terakhir.BR: Diperbarui
2026-02-10
9  Update Date  C  19  DTM  ROW  otomatis oleh sistem saat terjadi
14:15:00
pengubahan data tenant. Bernilai - jika
belum pernah diubah.
DESC: User ID yang melakukan
pembaruan data terakhir.BR: Diisi
|                |        |           | superadmi | otomatis oleh sistem sesuai dengan  |
| -------------- | ------ | --------- | --------- | ----------------------------------- |
| 10  Update By  | C  50  | APN  ROW  |           |                                     |
n_01
User ID Super User yang melakukan
eksekusi perubahan data. Bernilai - jika
belum pernah diubah.
DESC: Tombol untuk melihat detail
informasi tenant.BR: Membuka modal
| 11  Action View  | O  -  | APB  BTN  | [Icon View]  |     |
| ---------------- | ----- | --------- | ------------ | --- |
detail tenant dalam mode read-only
(seluruh field terkunci dan tidak memicu
pencatatan log perubahan).
DESC: Tombol untuk mengubah data
tenant.BR: Membuka modal edit tenant.
| 12  Action Edit  | O  -  | APB  BTN  | [Icon Edit]  |     |
| ---------------- | ----- | --------- | ------------ | --- |
Memungkinkan pengubahan Nama
Tenant dengan tetap memvalidasi
keunikan nama.
DESC: Kontrol untuk mengaktifkan atau
menonaktifkan status tenant.BR:
Mengubah status operasional tenant.
| Toggle Active  |       |           | Switch    |                                         |
| -------------- | ----- | --------- | --------- | --------------------------------------- |
| 13             | M  -  | APB  OPT  |           | Menampilkan pop-up konfirmasi validasi  |
| / Non-Active   |       |           | (On/Off)  |                                         |
sebelum status benar-benar diperbarui
di database. Jika Non-Aktif, pengguna
tenant tidak dapat login.
DESC: Indikator status keaktifan
|                    |        |           | Aktif /  | tenant.BR: Diperbarui secara otomatis  |
| ------------------ | ------ | --------- | -------- | -------------------------------------- |
| 14  Status Tenant  | C  10  | APB  ROW  |          |                                        |
Non-Aktif
berdasarkan aksi dari Toggle
Active/Non-Active.
DESC: Tombol konfirmasi pada modal
| Pop-Up   |       |           |           | validasi perubahan status.BR:         |
| -------- | ----- | --------- | --------- | ------------------------------------- |
| 15       | D  -  | APB  BTN  | YA, UBAH  |                                       |
| Confirm  |       |           |           | Memproses pembaruan status tenant di  |
STATUS
| Status  |     |     |     | database, memperbarui UI, dan memicu  |
| ------- | --- | --- | --- | ------------------------------------- |
pencatatan Log Activity.
DESC: Tombol untuk menyimpan data
tenant baru atau perubahan data.BR:
| Button Simpan  |       |           |         | Memvalidasi input nama tenant (tidak   |
| -------------- | ----- | --------- | ------- | -------------------------------------- |
| 16             | M  -  | APB  BTN  | SIMPAN  |                                        |
| Tenant         |       |           |         | boleh kosong & harus unik), menyimpan  |
data ke database, dan merekam entri
Log Activity.
DESC: Tombol untuk menutup modal
pop-up.BR: Menghentikan proses
Button Batal /
17  O  -  APB  BTN  BATAL / [X]  (Add/Edit/View/Toggle) dan menutup
Close
modal tanpa menyimpan perubahan
data.

DESC: Navigasi perpindahan halaman
data tabel.BR: Membagi tampilan daftar
18 Pagination C - NUM HYP 1, 2, 3... tenant menjadi beberapa halaman
sesuai limit baris per halaman yang
ditentukan.
4.4. Action Control Halaman Master Tenant
Description
No Control Type Business Rules (BR)
(DESC)
Navigasi untuk * Hanya dapat diakses dan diklik oleh
berpindah ke pengguna dengan role Super User (Owner
1 Tab Menu Master Tenant TAB halaman utama Application FinLens).* Menampilkan
pengelolaan data halaman daftar tenant beserta fitur
tenant. pencarian dan pagination.
Memicu
Memfilter baris tabel real-time atau
pencarian dan
on-enter/on-click icon secara
pemfilteran
case-insensitive berdasarkan Nama Tenant.
2 Input Search Nama Tenant OPT daftar tenant
Jika data tidak ditemukan, tabel
berdasarkan
menampilkan pesan "Data Tidak
kueri teks yang
Ditemukan".
dimasukkan.
Memicu
* Mengosongkan form dan secara otomatis
pembukaan
memunculkan Tenant ID baru yang
modal form
3 Button Add New Tenant BTN dihasilkan oleh sistem (system-generated).*
untuk
Mengeset fokus kursor (auto-focus)
pendaftaran
langsung pada bidang input Nama Tenant.
tenant baru.
Memicu
pembukaan * Memuat seluruh informasi lengkap tenant
modal pop-up (Tenant ID, Nama Tenant, Status, Created
detail data Date/By, Update Date/By).* Mengunci
4 Button View Detail Tenant BTN
tenant dalam seluruh bidang input (disabled) dan
mode menyembunyikan tombol Simpan. Aksi ini
pembacaan tidak memicu penulisan Log Activity.
(read-only).
Memicu
* Memuat data tenant ke dalam form modal
pembukaan
dengan bidang Tenant ID dalam keadaan
modal pop-up
5 Button Edit Tenant BTN dikunci (read-only).* Mengizinkan
untuk mengubah
pengubahan Nama Tenant dengan tetap
data tenant yang
memvalidasi keunikan nama ke database.
dipilih.
Memicu
* Mengubah status keaktifan tenant (Aktif ↔
pengubahan
Switch Toggle Active / Non-Aktif).* Memicu kemunculan modal
6 OPT status
Non-Active pop-up konfirmasi validasi sebelum status
operasional
resmi diperbarui di database.
keaktifan tenant.
Memicu proses * Memperbarui status tenant di database.*
eksekusi Jika diubah menjadi Non-Aktif, seluruh
perubuhan pengguna di bawah tenant tersebut
7 Button Konfirmasi Ubah Status BTN
status tenant otomatis ditolak saat melakukan login.*
dari modal Memicu pencatatan entri baru pada Log
pop-up validasi. Activity.
Memicu * Memvalidasi input Nama Tenant (wajib
eksekusi validasi diisi dan bersifat unik/tidak duplikat).* Jika
dan validasi gagal: Menampilkan pesan
8 Button Simpan Tenant BTN
penyimpanan kesalahan pada form modal.* Jika validasi
data tenant (Add sukses: Menyimpan/memperbarui data di
Baru atau Edit). database, memperbarui nilai Update Date &

Update By, menutup modal, serta memicu
pencatatan Log Activity.
Memicu
pembatalan aksi Menutup modal pop-up (Add, Edit, View, atau
dan penutupan Konfirmasi Status) tanpa melakukan
9 Button Batal / Close Modal BTN
modal pop-up perubahan atau penyimpanan data ke
yang sedang database.
aktif.
Navigasi untuk
* Mengarahkan tampilan tabel ke halaman
berpindah
Hyperlink Pagination Number / data yang dipilih (<<, <, 1, 2, >, >>).* Mengisi
10 HYP halaman pada
Next / Prev ulang baris tabel sesuai limit batas baris per
tabel daftar data
halaman yang telah ditentukan.
tenant.
5. Master User
5.1. Menu Master User
Menu Master User Management digunakan untuk mengontrol user sistem
FinLens. Pada menu master user ini admin tenant dapat menambahkan, mengedit,
dan menghapus (me non aktifkan) user.

5.2. Flow User Management Master User
Flow Detail :
1. Pembatasan Akses Multi-Tenant (Tenant Isolation)
- Saat pengguna mengakses menu Master User Management, sistem
secara otomatis mengambil Tenant ID dari pengguna yang sedang
login.
- Query database secara eksplisit memfilter data: WHERE tenant_id =
current_user_tenant_id.

- Pengguna hanya dapat melihat, menambah, dan mengubah pengguna
yang berada dalam lingkup tenant-nya sendiri. Data user dari tenant lain
tidak dapat diakses atau dilihat.
2. Tambah User Baru (Create/Add User)
- Pengguna mengisi form dengan ketentuan :
a. Nama User (Mandatory) — Catatan: Nama tidak harus unik.
b. Email User (Mandatory) — Format email valid & unik dalam
sistem.
c. Role User (Mandatory) — Dipilih dari dropdown yang terintegrasi
dengan Master Role Management.
- Auto-Generate Password :
a. istem secara otomatis membentuk password acak yang
memenuhi syarat keamanan: minimal 8 karakter, kombinasi huruf
besar (uppercase), huruf kecil (lowercase), angka (numeric), dan
simbol/karakter spesial.
- Metadata Otomatis :
a. Tenant ID otomatis diset sesuai tenant pengguna yang
membuat.
b. Created Date direkam otomatis oleh sistem (system
timestamp).
c. Created By direkam otomatis menggunakan User ID dari
pengguna yang mengeksekusi penambahan data.
3. Pengiriman Email Kredensial
- Setelah data user baru berhasil disimpan di database, sistem secara
otomatis memicu pengiriman email ke alamat email user baru tersebut.
- Email berisi informasi selamat datang serta kredensial login
(Username/Email dan Password yang di-generate otomatis) agar
pengguna baru dapat melakukan login pertama kali dan mengonfigurasi
MFA.
4. Ubah Data User (Edit User)
- Pengguna dapat memperbarui informasi Nama User atau Role User.
- Saat perubahan disimpan :
a. Sistem merekam timestamp terbaru pada field Update Date.
b. Sistem merekam User ID dari eksekutor perubahan pada field
Update By.
5. Pencatatan Audit Trail (Log Activity)
- Setiap transaksi perubahan (Create, Update, Change Status) akan dicatat
secara otomatis ke dalam Log Activity.
- Log mencatat identitas aktor (pembuat/pengubah), waktu kejadian
(timestamp), tipe aksi (CREATE_USER, UPDATE_USER,
CHANGE_USER_STATUS), serta parameter data terkait.

5.3. UI & Field Description Halaman Management Master User
DESKTOP

Bisnis Proses Halaman Menu User Management
1. Akses & Filter Multi-Tenant (Read Data)
- Akses Menu : Pengguna (Admin Tenant) memilih menu Master User
Management.
- Batasan Tenant :
a. Sistem mengidentifikasi Tenant ID dari Admin yang sedang
login.
b. Sistem memuat daftar pengguna dengan query filter WHERE
tenant_id = current_tenant_id.
c. Admin hanya dapat melihat data pengguna yang terdaftar pada
tenant-nya sendiri (data user tenant lain tidak muncul)
- Pencarian & Navigasi :
a. Admin dapat melakukan pencarian real-time atau on-enter
menggunakan kolom Search berdasarkan parameter Nama User
atau Email User.
b. Tabel data menampilkan pagination (<<, <, 1, 2, >, >>) untuk
membagi daftar pengguna sesuai batas baris per halaman.

2. Alur Tambah User Baru (Add New User Flow)
- Trigger Modal Add New : Admin mengklik tombol + ADD NEW USER.
- Inisialisasi Form :
a. Sistem membuka modal Add User.
b. Sistem menjalankan fungsi auto-generate password secara
otomatis sesuai standar keamanan (minimal 8 karakter, kombinasi
huruf besar, huruf kecil, angka, dan simbol).
c. Disediakan tombol Re-Generate Password jika Admin ingin
membentuk kombinasi password acak lainnya.
3. Pengisian Form : Admin mengisi data mandatory meliputi
- Nama User (Mandatory, teks bebas - tidak harus unik)
- Email User (Mandatory, format email valid)
- Role User (Mandatory, memilih dari dropdown yang bersumber dari
Master Role Management)
- Tenant (Disabled, mengikuti tenant user admin (Khusus Super Admin
Select tenant Enabled))
4. Validasi System (Saat Klik Button SIMPAN) :
- Mandatory Check : Sistem memeriksa apakah Nama, Email, dan Role
telah terisi. Jika ada yang kosong, muncul inline validation error.
- Email Uniqueness Check: Sistem memvalidasi alamat email ke
database. Jika email sudah pernah terdaftar di sistem FinLens, proses
dihentikan dan muncul Banner Alert Gagal Validasi: "Email sudah
terdaftar".
5. Penyimpanan & Pengiriman Kredensial :
- Jika validasi sukses, sistem menyimpan data user dengan menyematkan
Tenant ID Admin, Created Date (system timestamp), dan Created
By (User ID Admin).
- Sistem mentrigger layanan Email Service untuk mengirimkan email
otomatis berisi informasi kredensial login (Email & Generated Password)
ke user baru.
- Sistem merekam entri transaksi ke Log Activity (CREATE_USER).
- Modal tertutup, tabel di-refresh, dan muncul Toast Notification Sukses.
6. Alur Ubah Data User (Edit User Flow)
- Trigger Modal Edit : Admin mengklik ikon Edit pada baris pengguna
yang dipilih.
- Loading Data :
a. Sistem menampilkan modal Edit User beserta data terkini (Nama
User, Email User, Role User).
b. Kolom Email User disabled (read-only) untuk menjaga integritas
identitas akun dan keterkaitan data transaksi.
7. Pengubahan Data
- Admin memperbarui Nama User dan/atau Role User.
- Admin dapat memanfaatkan fitur opsional Reset/Generate Password
Baru jika pengguna meminta pembaruan kredensial.
8. Validasi & Pembaruan Data (Saat Klik Button UPDATE) :
- Mandatory Check : Nama User dan Role User tidak boleh dikosongkan.
- Jika validasi lolos, sistem memperbarui record di database serta
mencatat Update Date (timestamp saat ini) dan Update By (User ID
Admin).
- Jika password di-generate ulang, sistem mengirimkan email notifikasi
kredensial baru ke pengguna terkait.

- Sistem merekam aksi ke Log Activity (UPDATE_USER).
- Modal tertutup, tabel di-refresh, dan muncul Toast Notification Sukses
Update.
9. Alur Lihat Detail User (View Only Flow)
- Trigger Modal: Admin mengklik ikon View pada baris pengguna.
- Penyajian Data Read-Only :
a. Sistem memunculkan modal detail yang memuat seluruh informasi
pengguna (Nama User, Email User, Role User, Status,
Created Date/By, Update Date/By).
b. Seluruh input dikunci (disabled) dan tombol SIMPAN/UPDATE
dihilangkan, hanya menyisakan tombol BATAL / CLOSE.
c. Aksi ini bersifat read-only dan tidak mencatat entri pada Log
Activity.
10. Alur Perubahan Status Keaktifan (Toggle Active / Non-Active Flow)
- Trigger Akses: Admin menggeser Switch Toggle pada kolom Action
tabel.
- Pop-up Validasi Konfirmasi :
a. Sebelum status diperbarui di database, sistem menampilkan
Modal Pop-Up Konfirmasi berisi peringatan dampak perubahan
status.
- Eksekusi Status (Saat Klik Button YA, UBAH STATUS) :
a. Jika Diubah Menjadi Non-Aktif: Status user diperbarui menjadi
Non-Aktif. Sesi login user tersebut (jika sedang aktif)
dihentikan/dihilangkan dan user ditolak saat mencoba login
kembali.
b. Jika Diubah Menjadi Aktif: User kembali diizinkan melakukan
login dan otentikasi MFA.
c. Sistem memperbarui Update Date dan Update By pada record
user.
d. Sistem menyimpan entri aksi ke Log Activity
(CHANGE_USER_STATUS).
e. Pop-up konfirmasi tertutup dan tabel menampilkan indikator status
terbaru beserta Toast Notification Sukses.
N Stat Leng Tipe Tipe Description (DESC) & Business
Field Name Sample Value
o us th Data Field Rules (BR)
DESC: Menampilkan nama
Header Tenant FINLENS - TENANT aplikasi dan konteks modul
1 D - APB -
Info MANAGEMENT tenant.BR: Tampil permanen di
bagian header atas.
DESC: Navigasi menu utama
Master User Management.BR:
Menu Master Hanya menampilkan dan
2 D - APB TAB Master User
User mengelola data user yang berada
di bawah Tenant ID Admin yang
sedang login (terisolasi penuh).
DESC: Field pencarian data
user.BR: Memfilter daftar user di
Search
3 O 100 APN TXT Budi Santoso tabel secara real-time atau
Nama/Email
on-enter berdasarkan parameter
Nama User atau Email User.

DESC: Tombol untuk membuka
modal pop-up pendaftaran user
| 4  Add New User  | O  -  | APB  BTN  | + ADD NEW USER  |     |
| ---------------- | ----- | --------- | --------------- | --- |
baru.BR: Mengarahkan Admin ke
form input user baru dan memicu
fungsi auto-generate password.
| 5  Row Data User  | D  -  | APN  ROW  | `1  | Budi Santoso  |
| ----------------- | ----- | --------- | --- | ------------- |
DESC: Nomor urut baris data
tabel.BR: Dihasilkan otomatis oleh
| 6  No  | C  5  | NUM  ROW  | 1   |     |
| ------ | ----- | --------- | --- | --- |
sistem menyesuaikan urutan data
dan nomor halaman pagination.
DESC: Nama lengkap
pengguna.BR: Wajib diisi pada
| 7  Nama User  | M  100  | APB  TXT  | Budi Santoso  |     |
| ------------- | ------- | --------- | ------------- | --- |
form Add/Edit. Nama pengguna
tidak harus unik.
DESC: Alamat email resmi
pengguna.BR: Wajib diisi pada
form Add dengan format email
8  Email User  M  100  APN  TXT  budi@tenant.com  valid. Harus unik di seluruh sistem
FinLens. Bersifat dikunci
(disabled/read-only) saat form
Edit.
DESC: Hak akses/peran pengguna
pada aplikasi.BR: Wajib dipilih dari
| 9  Role User  | M  50  | APN  OPT  | Finance Manager  |     |
| ------------- | ------ | --------- | ---------------- | --- |
dropdown list yang bersumber
dari Master Role Management.
DESC: Kata sandi sementara
pengguna.BR: Dibuat otomatis
| Password  |        |           |             | oleh sistem (system-generated)  |
| --------- | ------ | --------- | ----------- | ------------------------------- |
| 10        | M  64  | APN  TXT  | K#9xP2$mL8  |                                 |
| (Auto     |        |           |             | saat form Add dibuka. Memenuhi  |
Generated)
kriteria keamanan (min. 8
karakter, kombinasi huruf
besar/kecil, angka, simbol).
DESC: Tombol untuk membuat
ulang kombinasi password acak
| Re-Generate  |       |           | [Icon]       |                                  |
| ------------ | ----- | --------- | ------------ | -------------------------------- |
| 11           | O  -  | APB  BTN  |              | baru.BR: Memperbarui nilai pada  |
| Password     |       |           | RE-GENERATE  |                                  |
field Password dengan kombinasi
acak baru sebelum data disimpan.
DESC: Tanggal dan waktu
pembuatan record user.BR:
12  Created Date  C  19  DTM  ROW  2026-01-15 8:30:00  Direkam otomatis oleh sistem
(system timestamp) saat user
pertama kali dibuat.
DESC: Tanggal dan waktu
pembaruan data user terakhir.BR:
|                  |        |           | 2026-02-10  | Diperbarui otomatis oleh sistem  |
| ---------------- | ------ | --------- | ----------- | -------------------------------- |
| 13  Update Date  | C  19  | DTM  ROW  |             |                                  |
|                  |        |           | 14:15:00    | saat terjadi pengubahan data     |
user. Bernilai - jika belum pernah
diubah.
DESC: User ID Admin yang
melakukan pembaruan data
terakhir.BR: Diisi otomatis oleh
| 14  Update By  | C  50  | APN  ROW  | admin1  |     |
| -------------- | ------ | --------- | ------- | --- |
sistem sesuai dengan User ID
Admin yang melakukan eksekusi
perubahan data. Bernilai - jika
belum pernah diubah.
DESC: Tombol untuk melihat
detail informasi user.BR:
Membuka modal detail user
| 15  Action View  | O  -  | APB  BTN  | [Icon View]  |     |
| ---------------- | ----- | --------- | ------------ | --- |
dalam mode read-only (seluruh
field terkunci dan tidak memicu
pencatatan log perubahan).

DESC: Tombol untuk mengubah
data user.BR: Membuka modal
16 Action Edit O - APB BTN [Icon Edit] edit user. Mengizinkan
pengubahan Nama dan Role User,
serta mengunci field Email User.
DESC: Kontrol untuk mengaktifkan
atau menonaktifkan status
user.BR: Mengubah status
Toggle Active operasional user. Menampilkan
17 M - APB OPT Switch (On/Off)
/ Non-Active pop-up konfirmasi validasi
sebelum status diperbarui di
database. Jika Non-Aktif, user
tidak dapat login.
DESC: Indikator status keaktifan
user.BR: Diperbarui secara
18 Status User C 10 APB ROW Aktif / Non-Aktif
otomatis berdasarkan aksi dari
Toggle Active/Non-Active.
DESC: Tombol konfirmasi pada
modal validasi perubahan
Pop-Up
status.BR: Memproses
19 Confirm D - APB BTN YA, UBAH STATUS
pembaruan status user di
Status
database, memperbarui UI, dan
memicu pencatatan Log Activity.
DESC: Tombol untuk menyimpan
data user baru atau pembaruan
data.BR: Memvalidasi input form,
Button Simpan mengecek keunikan email (saat
20 M - APB BTN SIMPAN / UPDATE
/ Update Add), menyimpan data ke
database, memicu pengiriman
email kredensial, dan merekam
Log Activity.
DESC: Tombol untuk menutup
modal pop-up.BR: Menghentikan
Button Batal /
21 O - APB BTN BATAL / [X] proses (Add/Edit/View/Toggle)
Close
dan menutup modal tanpa
menyimpan perubahan data.
DESC: Navigasi perpindahan
halaman data tabel.BR: Membagi
tampilan daftar user menjadi
22 Pagination C - NUM HYP 1, 2, 3...
beberapa halaman sesuai limit
baris per halaman yang
ditentukan.
5.4. Action Control Halaman Master User
Typ Description
No Control Business Rules (BR)
e (DESC)
Navigasi untuk
berpindah ke
* Mengarahkan tampilan ke modul Master User
halaman
Management.* Hanya memuat dan menampilkan
1 Tab Menu Master User TAB utama
daftar pengguna yang terdaftar pada Tenant ID Admin
pengelolaan
yang sedang login (terisolasi penuh dari tenant lain).
data
pengguna.
Memicu
Memfilter baris tabel secara real-time atau
pemfilteran
on-enter/on-click icon berdasarkan kata kunci Nama
2 Input Search Nama/Email OPT daftar
User atau Email User. Jika tidak ditemukan, tabel
pengguna
menampilkan pesan "Data Tidak Ditemukan".
berdasarkan

pencarian
Nama User
atau Email
User.
Memicu
* Mengosongkan form input (Nama User, Email User,
pembukaan
Role User).* Memunculkan kata sandi acak
modal form
3 Button Add New User BTN (system-generated) yang dibuat otomatis sesuai
pendaftaran
standar keamanan (min. 8 karakter, huruf besar, huruf
pengguna
kecil, angka, dan simbol).
baru.
Memicu
pembuatan
ulang Membuat dan memperbarui nilai pada bidang
Button Re-Generate
4 BTN kombinasi Password (Auto Generated) dengan kombinasi acak
Password
password acak baru sebelum data disimpan.
baru pada
form.
Memicu
pembukaan
* Memuat seluruh informasi pengguna (Nama User,
modal pop-up
Email User, Role User, Status, Created Date/By, Update
detail
5 Button View Detail User BTN Date/By).* Mengunci seluruh bidang input (disabled)
informasi
dan menyembunyikan tombol Simpan/Update. Aksi ini
pengguna
tidak memicu penulisan Log Activity.
dalam mode
read-only.
Memicu
pembukaan
* Memuat data pengguna ke dalam form modal
modal pop-up
dengan bidang Email User dalam keadaan dikunci
6 Button Edit User BTN untuk
(disabled/read-only).* Mengizinkan pengubahan
mengubah
Nama User, Role User, dan opsi reset password baru.
data pengguna
yang dipilih.
Memicu
* Mengubah status keaktifan pengguna (Aktif ↔
pengubahan
Switch Toggle Active / Non-Aktif).* Memicu kemunculan modal pop-up
7 OPT status
Non-Active konfirmasi validasi sebelum status resmi diperbarui di
keaktifan
database.
pengguna.
Memicu
proses
eksekusi * Memperbarui status pengguna di database.* Jika
Button Konfirmasi Ubah perubahan diubah menjadi Non-Aktif, pengguna otomatis tidak
8 BTN
Status status dapat melakukan login ke aplikasi FinLens.* Memicu
pengguna dari pencatatan entri baru pada Log Activity.
modal pop-up
konfirmasi.
Memicu * Memvalidasi input form (Nama, Email, dan Role
eksekusi wajib diisi).* Memvalidasi keunikan email di database.
validasi dan Jika email sudah terdaftar, muncul pesan kesalahan.*
9 Button Simpan User BTN
penyimpanan Jika valid: Menyimpan data ke database, memicu
data pengguna pengiriman email kredensial login ke pengguna baru,
baru. serta merekam entri Log Activity.
Memicu
eksekusi * Memvalidasi input Nama User dan Role User (wajib
validasi dan diisi).* Memperbarui data pengguna di database,
10 Button Update User BTN
pembaruan memperbarui nilai Update Date & Update By, menutup
data pengguna modal, serta merekam entri Log Activity.
yang diedit.
Memicu
pembatalan
Menutup modal pop-up (Add, Edit, View, atau
aksi dan
11 Button Batal / Close Modal BTN Konfirmasi Status) tanpa melakukan perubahan atau
penutupan
penyimpanan data ke database.
modal pop-up
yang sedang

aktif.
Navigasi untuk
berpindah * Mengarahkan tampilan tabel ke halaman data yang
Hyperlink Pagination halaman pada dipilih (<<, <, 1, 2, >, >>).* Mengisi ulang baris tabel
12 HYP
Number / Next / Prev tabel daftar sesuai limit batas baris per halaman yang telah
data ditentukan.
pengguna.
6. Master Role
6.1. Menu Master Role
Master Role Management adalah modul administrasi pada aplikasi
FinLens yang berfungsi untuk mengelola peran (role) dan hak akses pengguna
secara terpusat. Modul ini memungkinkan Administrator untuk membuat,
mengubah, dan menghapus role serta mengatur otorisasi tingkat menu (Menu
Access Control) secara dinamis.
Role yang dikonfigurasi di modul ini nantinya dialokasikan pada Master
User Management untuk menentukan batasan fungsionalitas dan fitur aplikasi
yang dapat diakses oleh setiap pengguna.

6.2. Flow Master Role

Flow Detail :
1. Pembatasan Akses Multi-Tenant (Tenant Isolation)
- Saat pengguna mengakses menu Master Role Management, sistem
secara otomatis mengambil Tenant ID dari Admin/Pengguna yang
sedang login.
- Query database secara eksplisit menyaring data: WHERE tenant_id =
current_tenant_id.
- Pengguna hanya dapat melihat, menambah, dan mengubah role yang
berada dalam lingkup tenant-nya sendiri.
2. Tambah Role Baru (Create/Add Role)
- Pengguna mengisikan Nama Role (Mandatory).
- Validasi Keunikan Nama Role: Sistem mengecek ke database apakah
Nama Role sudah digunakan di tenant tersebut (case-insensitive). Jika
duplikat, sistem menampilkan pesan error.
- Matrix Permission Grid (Tabel Hak Akses Menu) :
a. Sistem menampilkan daftar Menu FinLens dengan kolom aksi:
Add, Edit, Delete, View Only, Download, dan All Akses.
b. Filter Khusus: Menu Master Tenant secara otomatis
disembunyikan (excluded) dari tabel inputan ini karena akses
Master Tenant merupakan hak khusus Super Admin (Owner
FinLens).
c. Pengguna mencentang (checkbox) hak akses yang diizinkan
untuk role tersebut.
d. Aturan Bisnis: Jika sebuah menu tidak memiliki centang sama
sekali pada semua kolom aksi, maka menu tersebut tidak akan
ditampilkan/diakses oleh user yang menggunakan role tersebut.
- Metadata Otomatis :
a. Tenant ID diset otomatis sesuai tenant pengguna yang
membuat.
b. Created Date direkam otomatis oleh sistem (system
timestamp).
c. Created By direkam otomatis menggunakan User ID dari
pengguna yang membuat data.
3. Ubah Data Role (Edit Role)
- Pengguna dapat mengubah Nama Role dan pembaruan kombinasi
centang checkbox pada Matrix Akses Menu.
- Jika Nama Role diubah, sistem memvalidasi keunikan nama baru agar
tidak bentrok dengan role lain di tenant yang sama.
- Saat perubahan disimpan :
a. Sistem merekam timestamp terbaru pada field Update Date.
b. Sistem merekam User ID dari eksekutor perubahan pada field
Update By.
4. Pencatatan Audit Trail (Log Activity)
- Setiap transaksi perubahan (Create, Update, Delete/Change Status) akan
dicatat secara otomatis ke dalam Log Activity.
- Log mencatat identitas aktor (pembuat/pengubah), waktu kejadian
(timestamp), tipe aksi (CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE),
serta parameter data terkait.

6.3. UI & Field Description Halaman Master Role
Desktop

Bisnis Proses Master Role management
1. Akses & Pencarian Data (Read Data & Filtering)
- Akses Menu: Pengguna (Admin Tenant) membuka menu Master Role
Management.
- Mengambil Tenant Otomatis :
a. Sistem mengidentifikasi Tenant ID dari Admin yang sedang
login.
b. Sistem memuat daftar role dengan query filter WHERE
tenant_id = current_tenant_id.
c. Admin hanya dapat melihat dan mengelola role yang terdaftar
pada tenant-nya sendiri.
- Pencarian Multi-Filter & Navigasi :
a. Admin dapat memfilter daftar role berdasarkan kata kunci Nama
Role.
b. Admin dapat memfilter data berdasarkan Range Created Date,
Range Update Date, dan pilihan Update By.
c. Tombol Reset Filter tersedia untuk mengembalikan tampilan ke
seluruh daftar role.
d. Tabel data dilengkapi pagination (<<, <, 1, 2, >, >>) untuk
membagi baris data per halaman.
2. Alur Tambah Role Baru (Add New Role Flow)
- Trigger Modal : Admin mengklik tombol + ADD NEW ROLE.
- Inisialisasi Form & Matrix Permission :
a. Sistem membuka Form Add Role.

b. Sistem menyajikan daftar Menu FinLens dalam bentuk Matrix
Permission Grid dengan kolom checkbox: Add, Edit, Delete,
View, Download, dan All Akses.
c. Pengecualian Khusus: Menu Master Tenant secara otomatis
disembunyikan (excluded) dari tabel matrix permission karena hak
akses tersebut khusus dimiliki oleh Super Admin (Owner FinLens).
- Pengisian Form :
a. Admin mengisikan Nama Role (Mandatory, bersifat unik).
b. Admin menentukan hak akses menu dengan mencentang
checkbox aksi yang diizinkan.
c. All Akses: Jika kolom All Akses dicentang pada baris menu
tertentu, seluruh checkbox aksi (Add, Edit, Delete, View
Only, Download) pada baris tersebut otomatis tercentang secara
simultan.
d. Aturan Hide Menu: Jika sebuah menu tidak memiliki centang
sama sekali pada semua kolom aksi, maka menu tersebut tidak
akan ditampilkan/diakses oleh pengguna yang menggunakan role
tersebut.
- Validasi System & Bisnis (Saat Klik Button SIMPAN) :
a. Mandatory Check : Sistem memastikan Nama Role telah terisi.
b. Unique Check: Sistem mengecek ke database apakah Nama
Role sudah pernah digunakan di tenant tersebut
(case-insensitive). Jika duplikat, proses dihentikan dan muncul
Banner Alert Gagal Validasi: "Nama Role Sudah Digunakan".
- Penyimpanan & Audit Trai l:
a. Jika validasi sukses, sistem menyimpan data role dan detail
pemetaan hak akses menu dengan menyematkan Tenant ID
Admin, Created Date (system timestamp), dan Created By
(User ID Admin).
b. Sistem menyimpan entri transaksi ke Log Activity
(CREATE_ROLE).
c. Modal tertutup, tabel di-refresh, dan muncul Banner Alert Sukses.
3. Alur Ubah Data Role (Edit Role Flow)
- Trigger Modal: Admin mengklik ikon Edit pada baris role yang dipilih.
- Loading Data :
a. Sistem menampilkan form Edit Role beserta data terkini (Nama
Role dan kondisi centang checkbox pada Matrix Permission).
- Pengubahan Data :
a. Admin dapat memperbarui Nama Role dan/atau menyesuaikan
ulang kombinasi centang hak akses menu.
- Validasi & Pembaruan Data (Saat Klik Button UPDATE) :
a. Unique Check: Jika Nama Role diubah, sistem memvalidasi
nama baru agar tidak bentrok dengan role lain di tenant yang
sama.
b. Jika validasi lolos, sistem memperbarui record di database serta
mencatat Update Date (timestamp saat ini) dan Update By
(User ID Admin).

c. Pembaruan hak akses menu langsung berdampak pada seluruh
pengguna yang sedang terhubung dengan role tersebut saat
mereka memuat ulang (refresh) halaman/sesi aplikasi.
d. Sistem merekam aksi ke Log Activity (UPDATE_ROLE).
e. Modal tertutup, tabel di-refresh, dan muncul Banner Alert Sukses
Update.
4. Alur Lihat Detail Role (View Only Flow)
- Trigger Modal: Admin mengklik ikon View pada baris role.
- Penyajikan Data Read-Only :
a. Sistem memunculkan modal detail yang menampilkan Nama Role,
status, konfigurasi Matrix Permission, serta metadata (Created
Date/By, Update Date/By).
b. Seluruh bidang input dan checkbox dikunci (disabled) dan tombol
SIMPAN/UPDATE dihilangkan, hanya menyisakan tombol
TUTUP.
c. Aksi ini bersifat read-only dan tidak mencatat entri pada Log
Activity.
5. Alur Perubahan Status Keaktifan (Toggle Active / Non-Active Flow)
- Trigger Akses: Admin menggeser Switch Toggle pada kolom Action
tabel.
- Pop-up Validasi Konfirmas i:
a. Sebelum status diperbarui di database, sistem menampilkan
Modal Pop-Up Konfirmasi berisi peringatan bahwa pengguna
yang terhubung dengan role ini tidak akan dapat mengakses
menu yang dikonfigurasi selama statusnya Non-Aktif.
- Eksekusi Status (Saat Klik Button YA, UBAH STATUS) :
a. Status role diperbarui di database (Aktif <--> Non-Aktif).
b. Sistem memperbarui Update Date dan Update By pada record
role.
c. Sistem menyimpan entri aksi ke Log Activity
(CHANGE_ROLE_STATUS).
d. Pop-up konfirmasi tertutup dan tabel menampilkan indikator status
terbaru beserta Banner Alert Sukses.
6. Alur Hapus Permanen Role (Delete Role Flow)
- Trigger Akses: Admin mengklik ikon Delete (Hapus Permanen) pada
baris role.
- Validasi Keterkaitan Data (Dependency Check) :
a. Sistem mengecek ke database Master User Management
apakah role tersebut sedang digunakan oleh satu atau lebih
pengguna aktif.
b. Jika Masih Digunakan: Proses dihentikan dan sistem
menampilkan Banner Alert Error: "Role sedang digunakan oleh X
Pengguna aktif. Ubah role pengguna terlebih dahulu sebelum
menghapus role ini."
- Pop-up Konfirmasi Hapus (Jika Tidak Digunakan) :
a. Jika role tidak terikat dengan pengguna mana pun, sistem
menampilkan Modal Pop-Up Konfirmasi Hapus Permanen
berisi peringatan bahwa tindakan tidak dapat dibatalkan.
- Eksekusi Hapus (Saat Klik Button YA, HAPUS PERMANEN) :
a. Record role beserta pemetaan hak akses menunya dihapus
secara permanen dari database.

b.  Sistem merekam entri transaksi ke Log Activity (DELETE_ROLE).
c.  Pop-up tertutup, tabel di-refresh, dan muncul Banner Alert Sukses
Hapus.

| N           | Sta Len   | Tipe  Tipe   |               | Description (DESC) & Business  |
| ----------- | --------- | ------------ | ------------- | ------------------------------ |
| Field Name  |           |              | Sample Value  |                                |
| o           | tus  gth  | Data  Field  |               | Rules (BR)                     |
DESC: Menampilkan nama aplikasi
Header Tenant  FINLENS - TENANT  dan konteks modul tenant.BR:
| 1     | D  -  | APB  -  |             |                                   |
| ----- | ----- | ------- | ----------- | --------------------------------- |
| Info  |       |         | MANAGEMENT  | Tampil permanen di bagian header  |
atas.
DESC: Navigasi menu utama
Master Role Management.BR:
| Menu Master  |       |           | Master Role  | Hanya menampilkan dan            |
| ------------ | ----- | --------- | ------------ | -------------------------------- |
| 2            | D  -  | APB  TAB  |              |                                  |
| Role         |       |           | Management   | mengelola data role yang berada  |
di bawah Tenant ID Admin yang
sedang login (terisolasi penuh).
DESC: Field pencarian data
| Search Nama  |         |           |                  | role.BR: Memfilter daftar role di  |
| ------------ | ------- | --------- | ---------------- | ---------------------------------- |
| 3            | O  100  | APN  TXT  | Finance Manager  |                                    |
| Role         |         |           |                  | tabel berdasarkan parameter        |
nama role.
DESC: Input rentang tanggal
| Range Created  |        |           | 2026-01-01 -  | pembuatan role.BR: Memfilter      |
| -------------- | ------ | --------- | ------------- | --------------------------------- |
| 4              | O  20  | DTE  TXT  |               |                                   |
| Date           |        |           | 2026-01-31    | daftar role di tabel yang dibuat  |
pada rentang tanggal tertentu.
DESC: Input rentang tanggal
| Range Update  |        |           | 2026-02-01 -  | pembaruan role.BR: Memfilter          |
| ------------- | ------ | --------- | ------------- | ------------------------------------- |
| 5             | O  20  | DTE  TXT  |               |                                       |
| Date          |        |           | 2026-02-28    | daftar role di tabel yang diperbarui  |
pada rentang tanggal tertentu.
DESC: Dropdown pilihan user yang
6  Filter Update  O  50  APN  OPT  admin1  melakukan update.BR: Memfilter
| By  |     |     |     | daftar role berdasarkan User ID  |
| --- | --- | --- | --- | -------------------------------- |
eksekutor pembaruan data.
DESC: Tombol untuk menerapkan
seluruh kriteria filter pencarian.BR:
7  Ceklis Filter  O  -  APB  BTN  [ Ceklis Filter ]  Memproses pemfilteran data tabel
sesuai kombinasi parameter
Search, Created Date, Update Date,
dan Update By.
DESC: Tombol untuk menghapus
seluruh parameter filter.BR:
| 8  Reset Filter  | O  -  | APB  BTN  | [ Reset Filter ]  |     |
| ---------------- | ----- | --------- | ----------------- | --- |
Mengembalikan tampilan tabel ke
seluruh daftar role tanpa filter.
DESC: Tombol untuk membuka
modal pop-up pendaftaran role
9  Add New Role  O  -  APB  BTN  + ADD NEW ROLE  baru.BR: Mengarahkan Admin ke
form input role baru beserta tabel
Matrix Permission Grid.
| 1 Row Data Role  | D  -  | APN  ROW  | `1  | Finance Manager  |
| ---------------- | ----- | --------- | --- | ---------------- |
0
DESC: Nomor urut baris data
| 1   |       |           |     | tabel.BR: Dihasilkan otomatis oleh  |
| --- | ----- | --------- | --- | ----------------------------------- |
| No  | C  5  | NUM  ROW  | 1   |                                     |
| 1   |       |           |     | sistem menyesuaikan urutan data     |
dan nomor halaman pagination.
DESC: Nama hak akses/peran
pengguna.BR: Wajib diisi pada
1
Nama Role  M  100  APN  TXT  Finance Manager  form Add/Edit. Bersifat unik
2
(case-insensitive) pada lingkup
tenant aktif, tidak boleh duplikat.

DESC: Tabel pengawasan dan
penginputan hak akses menu
FinLens.BR: Menampilkan seluruh
daftar menu aplikasi kecuali menu
| Matrix      |       |           |                          | Master Tenant (khusus Super    |
| ----------- | ----- | --------- | ------------------------ | ------------------------------ |
| 1           |       |           | Master User | Add [v] |  |                                |
| Permission  | M  -  | APB  ROW  |                          | Admin). User mencentang akses  |
| 3           |       |           | Edit [v] ...             |                                |
Grid
yang diizinkan (Add, Edit, Delete,
View Only, Download, All Akses).
Jika tidak ada centang pada suatu
menu, menu tersebut
disembunyikan dari user terkait.
DESC: Checkbox utama untuk
memilih seluruh akses pada baris
menu terkait.BR: Jika dicentang,
1 All Akses
|     | O  -  | APB  OPT  | [v] Checkbox  | seluruh checkbox aksi (Add, Edit,  |
| --- | ----- | --------- | ------------- | ---------------------------------- |
4  Checkbox
Delete, View Only, Download) pada
baris menu tersebut otomatis
tercentang.
DESC: Tanggal dan waktu
pembuatan record role.BR:
| 1 Created Date  | C  19  | DTM  ROW  | 2026-01-15 8:30:00  |                               |
| --------------- | ------ | --------- | ------------------- | ----------------------------- |
| 5               |        |           |                     | Direkam otomatis oleh sistem  |
(system timestamp) saat role
pertama kali dibuat.
DESC: Tanggal dan waktu
pembaruan data role terakhir.BR:
| 1            |        |           |                      | Diperbarui otomatis oleh sistem     |
| ------------ | ------ | --------- | -------------------- | ----------------------------------- |
| Update Date  | C  19  | DTM  ROW  | 2026-02-10 14:15:00  |                                     |
| 6            |        |           |                      | saat terjadi pengubahan data role.  |
Bernilai - jika belum pernah
diubah.
DESC: User ID Admin yang
melakukan pembaruan data
terakhir.BR: Diisi otomatis oleh
1
Update By  C  50  APN  ROW  admin1  sistem sesuai dengan User ID
7
Admin yang melakukan eksekusi
perubahan data. Bernilai - jika
belum pernah diubah.
DESC: Tombol untuk melihat detail
informasi role.BR: Membuka
modal detail role dalam mode
| 1 Action View  | O  -  | APB  BTN  | [Icon View]  |     |
| -------------- | ----- | --------- | ------------ | --- |
read-only (seluruh field dan
8
checkbox terkunci dan tidak
memicu pencatatan log
perubahan).
DESC: Tombol untuk mengubah
data role.BR: Membuka modal edit
1
Action Edit  O  -  APB  BTN  [Icon Edit]  role. Mengizinkan pengubahan
9
Nama Role dan penyesuaian
Matrix Permission Grid.
DESC: Kontrol untuk mengaktifkan
atau menonaktifkan status
role.BR: Mengubah status
operasional role. Menampilkan
2 Toggle Active /
|                | M  -  | APB  OPT  | Switch (On/Off)  |                             |
| -------------- | ----- | --------- | ---------------- | --------------------------- |
| 0  Non-Active  |       |           |                  | pop-up konfirmasi validasi  |
sebelum status diperbarui di
database. Jika Non-Aktif,
pengguna dengan role ini tidak
dapat mengakses menu terkait.
DESC: Indikator status keaktifan
| 2            |        |           |                    | role.BR: Diperbarui secara      |
| ------------ | ------ | --------- | ------------------ | ------------------------------- |
| Status Role  | C  10  | APB  ROW  | Aktif / Non-Aktif  |                                 |
| 1            |        |           |                    | otomatis berdasarkan aksi dari  |
Toggle Active/Non-Active.

DESC: Tombol untuk menghapus
role secara permanen.BR:
Memeriksa keterkaitan ke Master
| 2              |       |      |                     | User Management. Jika role masih  |
| -------------- | ----- | ---- | ------------------- | --------------------------------- |
| Action Delete  | O  -  | APB  | BTN  [Icon Delete]  |                                   |
| 2              |       |      |                     | digunakan oleh user aktif, aksi   |
ditolak. Jika tidak digunakan,
memicu modal pop-up konfirmasi
hapus permanen.
DESC: Tombol konfirmasi pada
modal validasi aksi.BR:
| Pop-Up             |       |      | YA, UBAH STATUS /  |                                 |
| ------------------ | ----- | ---- | ------------------ | ------------------------------- |
| 2                  | D  -  | APB  | BTN                | Memproses pembaruan status      |
| 3  Confirm Status  |       |      | YA, HAPUS          |                                 |
| / Delete           |       |      | PERMANEN           | atau penghapusan permanen role  |
di database, memperbarui UI, dan
memicu pencatatan Log Activity.
DESC: Tombol untuk menyimpan
data role baru atau pembaruan
data.BR: Memvalidasi keunikan
2 Button Simpan
|     | M  -  | APB  | BTN  SIMPAN / UPDATE  | Nama Role, menyimpan  |
| --- | ----- | ---- | --------------------- | --------------------- |
4  / Update
konfigurasi hak akses ke database,
memperbarui UI, dan merekam
Log Activity.
DESC: Tombol untuk menutup
modal pop-up.BR: Menghentikan
| 2 Button Batal /  |       |      |                   | proses  |
| ----------------- | ----- | ---- | ----------------- | ------- |
|                   | O  -  | APB  | BTN  BATAL / [X]  |         |
5  Close
(Add/Edit/View/Toggle/Delete)
dan menutup modal tanpa
menyimpan perubahan data.
DESC: Navigasi perpindahan
halaman data tabel.BR: Membagi
2 Pagination  C  -  NUM  HYP  1, 2, 3...  tampilan daftar role menjadi
6
beberapa halaman sesuai limit
baris per halaman yang
ditentukan.

| 6.4.  Action Control Halaman Master Role |     |     |     |     |
| ---------------------------------------- | --- | --- | --- | --- |

| N        |     | Typ |                     |                      |
| -------- | --- | --- | ------------------- | -------------------- |
| Control  |     |     | Description (DESC)  | Business Rules (BR)  |
| o        |     | e   |                     |                      |
* Mengarahkan tampilan ke
modul Master Role
Management.* Hanya
Navigasi untuk berpindah ke
|     |     | TA  |     | memuat dan menampilkan  |
| --- | --- | --- | --- | ----------------------- |
1  Tab Menu Master Role
|     |     | B   | halaman utama pengelolaan  |                             |
| --- | --- | --- | -------------------------- | --------------------------- |
|     |     |     | data role dan hak akses.   | daftar role yang terdaftar  |
pada Tenant ID Admin yang
sedang login (terisolasi
penuh dari tenant lain).
Memfilter baris tabel
berdasarkan kata kunci Nama
Memicu pemfilteran daftar role
|                            |     | OP  |                             | Role. Jika data tidak  |
| -------------------------- | --- | --- | --------------------------- | ---------------------- |
| 2  Input Search Nama Role  |     |     | berdasarkan pencarian teks  |                        |
|                            |     | T   |                             | ditemukan, tabel       |
Nama Role.
menampilkan pesan "Data
Tidak Ditemukan".
Memfilter baris tabel sesuai
|     |     |     | Memicu pemfilteran daftar role  | tanggal pembuatannya  |
| --- | --- | --- | ------------------------------- | --------------------- |
OP
3  Input Range Created Date  berdasarkan rentang tanggal  (Created Date) yang masuk
T
|     |     |     | pembuatan data.  | dalam rentang Start Date  |
| --- | --- | --- | ---------------- | ------------------------- |
hingga End Date.

Memfilter baris tabel sesuai
|                             | Memicu pemfilteran daftar role  | tanggal pembaruan          |
| --------------------------- | ------------------------------- | -------------------------- |
| 4  Input Range Update Date  | OP                              |                            |
|                             | berdasarkan rentang tanggal     | terakhirnya (Update Date)  |
T
|     | pembaruan data.  | yang masuk dalam rentang  |
| --- | ---------------- | ------------------------- |
Start Date hingga End Date.
Memfilter baris tabel untuk
Memicu pemfilteran daftar role
| 5  Dropdown Filter Update By  | OP  | menampilkan role yang  |
| ----------------------------- | --- | ---------------------- |
berdasarkan User ID eksekutor
|     | T   | terakhir diubah oleh User ID  |
| --- | --- | ----------------------------- |
pembaruan.
Admin yang dipilih.
Memproses seluruh
parameter filter yang diisi
|     | Memicu eksekusi proses  | (Search Nama Role, Range  |
| --- | ----------------------- | ------------------------- |
BT
6  Button Ceklis Filter  pemfilteran data tabel secara  Created Date, Range Update
N
|     | kombinasi.  | Date, dan Update By) secara  |
| --- | ----------- | ---------------------------- |
bersamaan untuk menyaring
data tabel.
Mengosongkan seluruh
bidang filter pencarian dan
BT Memicu pengembalian kriteria
| 7  Button Reset Filter  |     | memuat ulang tabel untuk  |
| ----------------------- | --- | ------------------------- |
N  filter ke kondisi awal (default).
menampilkan seluruh daftar
role di tenant aktif.
* Mengosongkan bidang
Nama Role dan membuka
Matrix Permission Grid.*
| 8  Button Add New Role  | BT Memicu pembukaan modal       |                     |
| ----------------------- | ------------------------------- | ------------------- |
|                         | N  form pendaftaran role baru.  | Menu Master Tenant  |
otomatis disembunyikan
(excluded) dari daftar matriks
akses.
Jika dicentang, secara
otomatis mencentang seluruh
checkbox aksi (Add, Edit,
|     | Memicu penandaan seluruh  | Delete, View Only, Download)  |
| --- | ------------------------- | ----------------------------- |
OP
9  Checkbox All Akses (Matrix Grid)  hak akses aksi pada satu baris  pada baris menu tersebut.
T
menu terkait.
Jika dicopot (unchecked),
seluruh centang aksi pada
baris tersebut otomatis
hilang.
Menentukan izin operasional
spesifik pada menu terkait.
Jika pada satu baris menu
Memicu penandaan hak akses
Checkbox Individual Akses (Add /  OP tidak ada satu pun checkbox
| 10                                | spesifik untuk fungsi tertentu  |                       |
| --------------------------------- | ------------------------------- | --------------------- |
| Edit / Delete / View / Download)  | T                               | yang dicentang, menu  |
pada suatu menu.
tersebut otomatis
disembunyikan dari navigasi
pengguna dengan role terkait.
* Memuat seluruh informasi
role dan Matrix Permission
Grid terkini.* Mengunci
|     | Memicu pembukaan modal  | seluruh bidang input dan  |
| --- | ----------------------- | ------------------------- |
BT
11  Button View Detail Role  pop-up detail konfigurasi role  checkbox (disabled) serta
N
|     | dalam mode read-only.  | menyembunyikan tombol  |
| --- | ---------------------- | ---------------------- |
Simpan/Update. Aksi ini tidak
memicu pencatatan Log
Activity.
Memuat data role ke dalam
form modal dan
Memicu pembukaan modal
|     | BT  | memungkinkan pengubahan  |
| --- | --- | ------------------------ |
12  Button Edit Role
N  pop-up untuk mengubah data
|     | role yang dipilih.  | Nama Role serta penyesuaian  |
| --- | ------------------- | ---------------------------- |
ulang kombinasi centang
pada Matrix Permission Grid.
* Mengubah status keaktifan
| 13  Switch Toggle Active / Non-Active  | OP Memicu pengubahan status  |     |
| -------------------------------------- | ---------------------------- | --- |
role (Aktif ↔ Non-Aktif).*
T  keaktifan role.
Memicu kemunculan modal

pop-up konfirmasi validasi
sebelum status resmi
diperbarui di database.
* Memeriksa keterkaitan data
ke database Master User
Management.* Jika role
masih digunakan oleh
Memicu proses penghapusan pengguna aktif: Aksi
BT
14 Button Delete Role role secara permanen dari dibatalkan dan sistem
N
sistem. menampilkan banner error.*
Jika role tidak terikat dengan
pengguna mana pun: Memicu
kemunculan modal pop-up
konfirmasi hapus permanen.
* Memperbarui status
keaktifan atau menghapus
Memicu eksekusi perubahan
record role beserta pemetaan
Button Konfirmasi Ubah Status / BT status atau penghapusan
15 hak aksesnya dari database.*
Delete N permanen dari modal pop-up
Memicu pencatatan entri
konfirmasi.
transaksi baru pada Log
Activity.
* Memvalidasi input Nama
Role (wajib diisi dan bersifat
unik di tenant aktif).* Jika
nama duplikat: Menampilkan
pesan kesalahan pada banner
BT Memicu eksekusi validasi dan
16 Button Simpan Role notification.* Jika valid:
N penyimpanan data role baru.
Menyimpan data role beserta
pemetaan hak akses menu ke
database, memperbarui UI,
serta merekam entri Log
Activity.
* Memvalidasi keunikan
Nama Role jika terdapat
perubahan nama.*
Memicu eksekusi validasi dan Memperbarui record role dan
BT
17 Button Update Role pembaruan data role yang Matrix Permission Grid di
N
diedit. database, memperbarui nilai
Update Date & Update By,
menutup modal, serta
merekam entri Log Activity.
Menutup modal pop-up (Add,
Edit, View, Konfirmasi Status,
Memicu pembatalan aksi dan
BT atau Konfirmasi Hapus) tanpa
18 Button Batal / Close Modal penutupan modal pop-up yang
N melakukan perubahan atau
sedang aktif.
penyimpanan data ke
database.
* Mengarahkan tampilan
tabel ke halaman data yang
Navigasi untuk berpindah dipilih (<<, <, 1, 2, >, >>).*
Hyperlink Pagination Number / Next / HY
19 halaman pada tabel daftar Mengisi ulang baris tabel
Prev P
data role. sesuai limit batas baris per
halaman yang telah
ditentukan.

7. Master Saverity
7.1. Menu Master Saverity
Master Severity Management adalah modul konfigurasi administrasi
pada aplikasi FinLens yang berfungsi untuk mengelola tingkatan risiko (severity
level) dan memetakan aturan jenis anomali secara dinamis. Modul ini digunakan
sebagai acuan utama oleh engine berbasis AI (Artificial Intelligence) saat
melakukan pemindaian, analisis, dan deteksi otomatis terhadap berkas/dokumen
finansial yang diunggah oleh pengguna.
Modul ini menyediakan tingkat severity default secara bawaan sistem,
yaitu :
- Clean: Dokumen aman dan tidak ditemukan adanya anomali atau
kejanggalan.
- Low: Ditemukan indikasi anomali ringan atau penyimpangan minor yang
tidak berdampak signifikan.
- Medium: Ditemukan anomali tingkat menengah yang membutuhkan
peninjauan berkas secara berkala.
- High: Ditemukan indikasi anomali berat atau potensi kecurangan (fraud)
yang memerlukan tindakan korektif cepat.
- Critical: Ditemukan temuan anomali krusial/kritis yang berpotensi
menimbulkan risiko finansial atau pelanggaran regulasi fatal.
Melalui menu ini, pengguna (Admin) diberikan fleksibilitas untuk secara
dinamis mengonfigurasi, menambah, mengubah, atau memindahkan kategori
indikator anomali (anomaly mapping) ke dalam tingkat severity yang sesuai
(Clean, Low, Medium, High, atau Critical) agar proses validasi AI selaras
dengan kebijakan analisis risiko perusahaan.

7.2. Flow Halaman Master Anomali

Flow Detail :
1. Pembatasan Akses Multi-Tenant
- Saat pengguna mengklik menu Master Anomali, sistem secara otomatis
membaca Tenant ID pengguna yang sedang aktif/login.
- Query database memfilter data dengan klausul WHERE tenant_id =
current_tenant_id.
- Pengguna hanya dapat melihat dan mengonfigurasi aturan pemetaan
anomali milik tenant sendiri. Data konfigurasi milik tenant lain tidak dapat
diakses.
2. Tambah Pemetaan Anomali Baru (Create/Add Anomali Mapping)
- Pengguna mengisikan data mandatory :
a. Detail Anomali/Kategori (Mandatory, Teks Bebas, Unik) —
Contoh: "Selisih PPN Tidak Sesuai Faktur", "Tanggal Dokumen
Kadaluwarsa", "Struktur Header Tidak Lengkap".
b. Dropdown Select Severity (Mandatory) — Pilihan tingkat
severity default: Clean, Low, Medium, High, atau Critical.
- Validasi Keunikan: Sistem mengecek ke database apakah Detail
Anomali/Kategori sudah pernah terdaftar di tenant tersebut
(case-insensitive). Jika ditemukan duplikasi, sistem menolak
penyimpanan dan menampilkan peringatan.
- Metadata Otomatis :
a. Tenant ID diset otomatis sesuai tenant dari akun penginput.
b. Created Date direkam otomatis oleh sistem (system timestamp
saat ini).
c. Created By direkam otomatis menggunakan User ID dari
pengguna yang mengeksekusi penambahan data.
3. Ubah Data Pemetaan Anomali (Edit Severity Mapping)
- Pengguna dapat mengubah Detail Anomali/Kategori atau memindahkan
tingkatan Severity (Clean < – > Low < – > Medium < – > High < – >
Critical).
- Validasi Keunikan pada Edit: Jika nama detail anomali diubah, sistem
memvalidasi nama baru agar tidak bentrok dengan deskripsi anomali lain
dalam tenant yang sama.
- Saat berhasil disimpan :
a. Sistem merekam timestamp pembaruan pada field Update
Date.
b. Sistem merekam identitas pengubah pada field Update By.
c. Konfigurasi baru ini akan langsung digunakan oleh Engine AI
FinLens untuk pemindaian berkas dokumen selanjutnya.
4. Pencatatan Audit Trail (Log Activity)
- Setiap transaksi perubahaan data (Create, Update, Delete) memicu
pencatatan otomatis pada Log Activity.
- Log mencatat informasi mencakup User ID , waktu kejadian (timestamp),
jenis aksi (CREATE_ANOMALY, UPDATE_ANOMALY, DELETE_ANOMALY),
serta rincian data anomali dan tingkat severity yang dikonfigurasi.

7.3. UI & Field Description Master Anomali
Desktop

Flow Bisnis :
1. Akses & Pencarian Data (Read Data & Filtering)
- Akses Menu: Pengguna (Admin Tenant) membuka menu Master
Anomali.
- Mengambil Tenant Otomatis:
a. Sistem mengidentifikasi Tenant ID dari Admin yang sedang
login.
b. Sistem mengunakan daftar konfigurasi anomali dengan query filter
WHERE tenant_id = current_tenant_id.
c. Admin hanya dapat melihat dan mengelola data Anomali yang ada
pada tenant-nya sendiri (data tenant lain tidak ditampilkan).
- Fitur Visualisasi & Tooltip Tabel:
a. Kolom Detail Kategori/Anomali menampilkan deskripsi
terpotong (truncated) jika teks terlalu panjang, dan menampilkan
deskripsi lengkap secara otomatis saat kursor diarahkan ke teks
(hover tooltip).
- Pencarian Multi-Filter & Navigasi:
a. Admin dapat memfilter daftar anomali berdasarkan kata kunci
Detail Kategori/Anomali.
b. Admin dapat memfilter data berdasarkan Range Created Date,
Range Update Date, dan pilihan Update By.
c. Tombol Reset Filter mengembalikan tampilan ke seluruh daftar
anomali.
d. Tabel data dilengkapi pagination (<<, <, 1, 2, >, >>) untuk
membagi baris data per halaman.
2. Proses Tambah Anomali Baru (Add New Anomali Flow)
- Trigger Modal: Admin mengklik tombol + ADD NEW ANOMALI.
- Inisialisasi Form:
a. Sistem membuka modal Add New Anomali Detail.
- Pengisian Form:
a. Admin mengisikan Detail Kategori/Anomali (Mandatory, teks
bebas, bersifat unik).
b. Admin memilih tingkat Severity (Mandatory) dari dropdown
pilihan default: Clean, Low, Medium, High, atau Critical.
- Validasi System & Bisnis (Saat Klik Button SIMPAN):

a. Mandatory Check: Sistem memastikan Detail Kategori/Anomali
dan Severity telah diisi/dipilih.
b. Unique Check: Sistem mengecek ke database apakah deskripsi
anomali sudah pernah terdaftar di tenant tersebut
(case-insensitive). Jika duplikat, muncul Banner Alert Gagal
Validasi: "Detail Kategori/Anomali Sudah Ada di Sistem".
- Penyimpanan :
a. Jika validasi sukses, sistem menyimpan data pemetaan anomali
dengan menyematkan Tenant ID Admin, Created Date
(system timestamp), dan Created By (User ID Admin).
b. Kriteria anomali baru ini secara real-time digunakan oleh Engine
AI FinLens untuk analisis dokumen berikutnya.
c. Sistem merekam entri transaksi ke Log Activity
(CREATE_ANOMALY).
d. Modal tertutup, tabel di-refresh, dan muncul Banner Alert Sukses.
3. Proses Ubah Data Anomali (Edit Anomali Flow)
- Trigger Modal: Admin mengklik ikon Edit pada baris anomali yang
dipilih.
- Loading Data:
a. Sistem menampilkan modal Edit Data beserta data terkini (Detail
Kategori/Anomali dan Tingkat Severity).
- Pengubahan Data:
a. Admin dapat memperbarui deskripsi anomali dan/atau
memindahkan tingkatan Severity (Clean < - > Low < - >
Medium < - > High < - > Critical).
- Validasi & Pembaruan Data (Saat Klik Button UPDATE):
a. Unique Check: Jika deskripsi anomali diubah, sistem memvalidasi
nama baru agar tidak bentrok dengan deskripsi anomali lain di
tenant yang sama.
b. Jika validasi lolos, sistem memperbarui record di database serta
mencatat Update Date (timestamp saat ini) dan Update By
(User ID Admin).
c. Perubahan detail kategori/anomali severity langsung berlaku pada
proses pemindaian dokumen oleh Engine AI.
d. Sistem menyimpan ke Log Activity (UPDATE_ANOMALY).

e.  Modal tertutup, tabel di-refresh, dan muncul Banner Alert Sukses
Update.
4.  Proses View Detail Severity (View Only Flow)
-  Trigger Modal: Admin mengklik ikon View pada baris anomali.
-  Data Read-Only:
a.  Sistem  memunculkan  modal  detail  yang  menampilkan  Detail
| Kategori/Anomali  |     | lengkap,  | Tingkat  |     | Severity,  | serta  | metadata  |
| ----------------- | --- | --------- | -------- | --- | ---------- | ------ | --------- |
(Created Date/By, Update Date/By).
| b.  Seluruh    | inputan  | dikunci       |     | (disabled)  |             | dan  | tombol  |
| -------------- | -------- | ------------- | --- | ----------- | ----------- | ---- | ------- |
| SIMPAN/UPDATE  |          | dihilangkan,  |     | hanya       | menyisakan  |      | tombol  |
TUTUP.
c.  Aksi  ini  bersifat  read-only  dan  tidak  mencatat entri pada Log
Activity.

5.  Proses Perubahan Status Keaktifan (Toggle Active / Non-Active Flow)
-  Trigger Akses: Admin menggeser Switch Toggle pada kolom Action tabel.
-  Pop-up Validasi Konfirmasi:
a.  Sebelum status diperbarui di database, sistem menampilkan Modal
| Pop-Up  | Konfirmasi  | berisi  | peringatan  |     | bahwa  | anomali  | yang  |
| ------- | ----------- | ------- | ----------- | --- | ------ | -------- | ----- |
dinonaktifkan tidak akan dipindai oleh Engine AI FinLens.
-  Eksekusi Status (Saat Klik Button YA, UBAH STATUS):
a.  Jika  Diubah  Menjadi  Non-Aktif:  Status  anomali  menjadi
| Non-Aktif  | dan diabaikan oleh Engine AI saat melakukan audit  |     |     |     |     |     |     |
| ---------- | -------------------------------------------------- | --- | --- | --- | --- | --- | --- |
dokumen.
b.  Jika  Diubah  Menjadi  Aktif:  Anomali  kembali  diikutsertakan
dalam pemeriksaan AI.
| c.  Sistem  | memperbarui  |         |     | Date  | dan     |     | By  pada  |
| ----------- | ------------ | ------- | --- | ----- | ------- | --- | --------- |
|             |              | Update  |     |       | Update  |     |           |
record anomali.
| d.  Sistem  | merekam  | entri  |     | aksi  | ke  | Log  | Activity  |
| ----------- | -------- | ------ | --- | ----- | --- | ---- | --------- |
(CHANGE_ANOMALI_STATUS).
e.  Pop-up konfirmasi tertutup dan tabel menampilkan indikator status
terbaru beserta Banner Alert Sukses.
6.  Proses Hapus Permanen Anomali (Delete Anomali Flow)
-  Trigger  Akses: Admin mengklik ikon Delete (Hapus Permanen) pada
baris anomali.
-  Pop-up Konfirmasi Hapus (Jika Tidak Terikat Process) :

|     | a.  Sistem  | menampilkan  | Modal       | Pop-Up  | Konfirmasi     | Hapus     |
| --- | ----------- | ------------ | ----------- | ------- | -------------- | --------- |
|     | Permanen    | berisi       | peringatan  | bahwa   | proses  hapus  | permanen  |
dilanjutkan.
-  Eksekusi Hapus (Saat Klik Button YA, HAPUS PERMANEN):
a.  Record pemetaan anomali dihapus secara permanen dari database.
|     | b.  Sistem  | menyimpan  | entri  | transaksi  | ke  Log  | Activity  |
| --- | ----------- | ---------- | ------ | ---------- | -------- | --------- |
(DELETE_ANOMALY).
c.  Pop-up tertutup, tabel di-refresh, dan muncul Banner Alert Sukses
Hapus.

| N           | Sta Len   | Tipe  Tipe   |               | Description (DESC) & Business  |     |     |
| ----------- | --------- | ------------ | ------------- | ------------------------------ | --- | --- |
| Field Name  |           |              | Sample Value  |                                |     |     |
| o           | tus  gth  | Data  Field  |               | Rules (BR)                     |     |     |
DESC: Menampilkan nama
1  Header Tenant  D  -  APB  -  FINLENS - TENANT  aplikasi dan konteks modul
| Info  |     |     | MANAGEMENT  |     |     |     |
| ----- | --- | --- | ----------- | --- | --- | --- |
tenant.BR: Tampil permanen di
bagian header atas.
DESC: Navigasi menu utama
Master Anomali Management.BR:
Hanya menampilkan dan
| 2  Menu Master  | D  -  | APB  TAB  | Master Anomali  |     |     |     |
| --------------- | ----- | --------- | --------------- | --- | --- | --- |
mengelola data kriteria anomali
Anomali
yang berada di bawah Tenant ID
Admin yang sedang login
(terisolasi penuh).
DESC: Field pencarian data kriteria
| Search Detail  |     |     |     | anomali.BR: Memfilter daftar  |     |     |
| -------------- | --- | --- | --- | ----------------------------- | --- | --- |
3  Kategori/Anom O  100  APN  TXT  Selisih PPN  anomali di tabel berdasarkan
| ali  |     |     |     | parameter deskripsi Detail  |     |     |
| ---- | --- | --- | --- | --------------------------- | --- | --- |
Kategori/Anomali.
DESC: Input rentang tanggal
pembuatan data anomali.BR:
| Range Created  |        |           | 2026-01-01 -  |                                    |     |     |
| -------------- | ------ | --------- | ------------- | ---------------------------------- | --- | --- |
| 4              | O  20  | DTE  TXT  |               | Memfilter daftar anomali di tabel  |     |     |
| Date           |        |           | 2026-01-31    |                                    |     |     |
yang dibuat pada rentang tanggal
tertentu.
DESC: Input rentang tanggal
pembaruan data anomali.BR:
| Range Update  |        |           | 2026-02-01 -  |                                    |     |     |
| ------------- | ------ | --------- | ------------- | ---------------------------------- | --- | --- |
| 5             | O  20  | DTE  TXT  |               | Memfilter daftar anomali di tabel  |     |     |
| Date          |        |           | 2026-02-28    |                                    |     |     |
yang diperbarui pada rentang
tanggal tertentu.
DESC: Dropdown pilihan user yang
melakukan update data.BR:
Filter Update
| 6   | O  50  | APN  OPT  | admin1  | Memfilter daftar anomali  |     |     |
| --- | ------ | --------- | ------- | ------------------------- | --- | --- |
By
berdasarkan User ID eksekutor
pembaruan data.
DESC: Tombol untuk menerapkan
seluruh kriteria filter pencarian.BR:
7  Ceklis Filter  O  -  APB  BTN  [ Ceklis Filter ]  Memproses pemfilteran data tabel
sesuai kombinasi parameter
Search, Created Date, Update
Date, dan Update By.
DESC: Tombol untuk menghapus
8  Reset Filter  O  -  APB  BTN  [ Reset Filter ]  seluruh parameter filter.BR:
Mengembalikan tampilan tabel ke
seluruh daftar kriteria anomali

tanpa filter.
DESC: Tombol untuk membuka
modal pop-up pendaftaran kriteria
| Add New  |       |           |                    | anomali baru.BR: Mengarahkan  |
| -------- | ----- | --------- | ------------------ | ----------------------------- |
| 9        | O  -  | APB  BTN  | + ADD NEW ANOMALI  |                               |
| Anomali  |       |           |                    | Admin ke form input Detail    |
Kategori/Anomali dan pemetaan
tingkat Severity.
1 Row Data
|     | D  -  | APN  ROW  | `1  | Selisih PPN...  |
| --- | ----- | --------- | --- | --------------- |
0  Anomali
DESC: Nomor urut baris data
| 1 No  | C  5  | NUM  ROW  |     | 1  tabel.BR: Dihasilkan otomatis oleh  |
| ----- | ----- | --------- | --- | -------------------------------------- |
1
sistem menyesuaikan urutan data
dan nomor halaman pagination.
DESC: Deskripsi rinci mengenai
jenis kejanggalan atau anomali
dokumen.BR: Wajib diisi pada
Detail
| 1             |         |           | Selisih PPN Tidak  | form Add/Edit. Teks terpotong  |
| ------------- | ------- | --------- | ------------------ | ------------------------------ |
| Kategori/Anom | M  255  | APN  TXT  |                    |                                |
| 2             |         |           | Sesuai Faktur      | pada tabel dilengkapi hover    |
ali
tooltip. Bersifat unik
(case-insensitive) pada lingkup
tenant aktif, tidak boleh duplikat.
DESC: Tingkatan risiko dari
kejanggalan/anomali yang
terdeteksi.BR: Wajib dipilih dari
| 1 Severity Level  | M  20  | APB  OPT  | High  |                                |
| ----------------- | ------ | --------- | ----- | ------------------------------ |
| 3                 |        |           |       | dropdown opsi default: Clean,  |
Low, Medium, High, atau Critical.
Digunakan sebagai acuan
klasifikasi oleh Engine AI FinLens.
DESC: Tanggal dan waktu
pembuatan record anomali.BR:
1
Created Date  C  19  DTM  ROW  2026-01-15 8:30:00  Direkam otomatis oleh sistem
4
(system timestamp) saat kriteria
anomali pertama kali dibuat.
DESC: Tanggal dan waktu
pembaruan data anomali
| 1            |        |           |                      | terakhir.BR: Diperbarui otomatis  |
| ------------ | ------ | --------- | -------------------- | --------------------------------- |
| Update Date  | C  19  | DTM  ROW  | 2026-02-10 14:15:00  |                                   |
| 5            |        |           |                      | oleh sistem saat terjadi          |
pengubahan data anomali. Bernilai
- jika belum pernah diubah.
DESC: User ID Admin yang
melakukan pembaruan data
terakhir.BR: Diisi otomatis oleh
1
| Update By  | C  50  | APN  ROW  | admin1  |                               |
| ---------- | ------ | --------- | ------- | ----------------------------- |
| 6          |        |           |         | sistem sesuai dengan User ID  |
Admin yang melakukan eksekusi
perubahan data. Bernilai - jika
belum pernah diubah.
DESC: Tombol untuk melihat detail
informasi kriteria anomali.BR:
| 1            |       |           |              | Membuka modal detail anomali   |
| ------------ | ----- | --------- | ------------ | ------------------------------ |
| Action View  | O  -  | APB  BTN  | [Icon View]  |                                |
| 7            |       |           |              | dalam mode read-only (seluruh  |
field terkunci dan tidak memicu
pencatatan log perubahan).
DESC: Tombol untuk mengubah
data kriteria anomali.BR:
Membuka modal edit anomali.
1
Action Edit  O  -  APB  BTN  [Icon Edit]  Mengizinkan pengubahan
8
Deskripsi Detail Anomali dan
penyesuaian pilihan tingkat
Severity.

DESC: Kontrol untuk mengaktifkan
atau menonaktifkan status
pemindaian anomali.BR:
Mengubah status operasional
| 1 Toggle Active /  |       |           |                  | anomali. Menampilkan pop-up  |
| ------------------ | ----- | --------- | ---------------- | ---------------------------- |
|                    | M  -  | APB  OPT  | Switch (On/Off)  |                              |
| 9  Non-Active      |       |           |                  | konfirmasi validasi sebelum  |
diperbarui di database. Jika
Non-Aktif, anomali diabaikan oleh
Engine AI FinLens saat analisis
dokumen.
DESC: Indikator status keaktifan
2 Status Anomali  C  10  APB  ROW  Aktif / Non-Aktif  kriteria anomali.BR: Diperbarui
| 0   |     |     |     | secara otomatis berdasarkan aksi  |
| --- | --- | --- | --- | --------------------------------- |
dari Toggle Active/Non-Active.
DESC: Tombol untuk menghapus
kriteria anomali secara
permanen.BR: Memeriksa
| 2              |       |           |                | keterkaitan ke proses aktif Engine  |
| -------------- | ----- | --------- | -------------- | ----------------------------------- |
| Action Delete  | O  -  | APB  BTN  | [Icon Delete]  |                                     |
| 1              |       |           |                | AI. Jika sedang diproses AI, aksi   |
ditolak. Jika tidak terikat proses,
memicu modal pop-up konfirmasi
hapus permanen.
DESC: Tombol konfirmasi pada
modal validasi aksi.BR:
| Pop-Up          |       |           | YA, UBAH STATUS /  | Memproses pembaruan status      |
| --------------- | ----- | --------- | ------------------ | ------------------------------- |
| 2               | D  -  | APB  BTN  |                    |                                 |
| Confirm Status  |       |           | YA, HAPUS          | atau penghapusan permanen data  |
2
| / Delete  |     |     | PERMANEN  | anomali di database,  |
| --------- | --- | --- | --------- | --------------------- |
memperbarui UI, dan memicu
pencatatan Log Activity.
DESC: Tombol untuk menyimpan
data anomali baru atau
pembaruan data.BR: Memvalidasi
keunikan Deskripsi Anomali,
2 Button Simpan
|     | M  -  | APB  BTN  | SIMPAN / UPDATE  | menyimpan pemetaan severity ke  |
| --- | ----- | --------- | ---------------- | ------------------------------- |
3  / Update
database, meng-update
konfigurasi Engine AI,
memperbarui UI, dan merekam
Log Activity.
DESC: Tombol untuk menutup
modal pop-up.BR: Menghentikan
| 2 Button Batal /  |       |           |              | proses                         |
| ----------------- | ----- | --------- | ------------ | ------------------------------ |
|                   | O  -  | APB  BTN  | BATAL / [X]  |                                |
| 4  Close          |       |           |              | (Add/Edit/View/Toggle/Delete)  |
dan menutup modal tanpa
menyimpan perubahan data.
DESC: Navigasi perpindahan
halaman data tabel.BR: Membagi
| 2           |       |           |             | tampilan daftar kriteria anomali  |
| ----------- | ----- | --------- | ----------- | --------------------------------- |
| Pagination  | C  -  | NUM  HYP  | 1, 2, 3...  |                                   |
5
menjadi beberapa halaman sesuai
limit baris per halaman yang
ditentukan.

7.4.  Action Control Menu Master Anomali
| N Control  | Typ Description (DESC)  | Business Rules (BR)  |
| ---------- | ----------------------- | -------------------- |
| o          | e                       |                      |
* Mengarahkan tampilan ke modul Master
Navigasi untuk berpindah ke
Anomali Management.* Hanya memuat dan
| Tab Menu Master  | TA halaman utama pengelolaan  |                                           |
| ---------------- | ----------------------------- | ----------------------------------------- |
| 1                |                               | menampilkan daftar kriteria anomali yang  |
| Anomali          | B                             |                                           |
data kriteria anomali dan
|     | tingkatan severity.  | terdaftar pada Tenant ID Admin yang sedang  |
| --- | -------------------- | ------------------------------------------- |
login (terisolasi penuh dari tenant lain).
|     | Memicu pemfilteran daftar  | Memfilter baris tabel berdasarkan kata kunci  |
| --- | -------------------------- | --------------------------------------------- |
Input Search Detail  OP anomali berdasarkan  deskripsi anomali. Jika data tidak ditemukan,
2
| Kategori/Anomali  | T                      |                                      |
| ----------------- | ---------------------- | ------------------------------------ |
|                   | pencarian teks Detail  | tabel menampilkan pesan "Data Tidak  |
|                   | Kategori/Anomali.      | Ditemukan".                          |
Memicu pemfilteran daftar
Memfilter baris tabel sesuai tanggal
| Input Range Created  | OP anomali berdasarkan        |                                         |
| -------------------- | ----------------------------- | --------------------------------------- |
| 3                    |                               | pembuatannya (Created Date) yang masuk  |
| Date                 | T  rentang tanggal pembuatan  |                                         |
dalam rentang Start Date hingga End Date.
data.
|     | Memicu pemfilteran daftar  | Memfilter baris tabel sesuai tanggal  |
| --- | -------------------------- | ------------------------------------- |
Input Range Update  OP anomali berdasarkan  pembaruan terakhirnya (Update Date) yang
4
Date  T  rentang tanggal pembaruan  masuk dalam rentang Start Date hingga End
|                         | data.                      | Date.                                    |
| ----------------------- | -------------------------- | ---------------------------------------- |
|                         | Memicu pemfilteran daftar  | Memfilter baris tabel untuk menampilkan  |
| Dropdown Filter Update  | OP                         |                                          |
5  anomali berdasarkan User  kriteria anomali yang terakhir diubah oleh
| By  | T                        |                              |
| --- | ------------------------ | ---------------------------- |
|     | ID eksekutor pembaruan.  | User ID Admin yang dipilih.  |
Memproses seluruh parameter filter yang
|                          | Memicu eksekusi proses  | diisi (Search Detail Anomali, Range Created  |
| ------------------------ | ----------------------- | -------------------------------------------- |
| 6  Button Ceklis Filter  | BT                      |                                              |
|                          | pemfilteran data tabel  | Date, Range Update Date, dan Update By)      |
N
|     | secara kombinasi.  | secara bersamaan untuk menyaring data  |
| --- | ------------------ | -------------------------------------- |
tabel.
Mengosongkan seluruh bidang filter
Memicu pengembalian
7  Button Reset Filter  BT pencarian dan memuat ulang tabel untuk
kriteria filter ke kondisi awal
|     | N   | menampilkan seluruh daftar kriteria anomali  |
| --- | --- | -------------------------------------------- |
(default).
di tenant aktif.
Mengosongkan bidang Detail
Memicu pembukaan modal
| 8  Button Add New  | BT                            | Kategori/Anomali dan mengeset pilihan  |
| ------------------ | ----------------------------- | -------------------------------------- |
| Anomali            | N  form pendaftaran kriteria  |                                        |
Severity Level ke nilai default pertama
anomali baru.
(Clean).
Menentukan tingkat risiko dari anomali
|                     | Memicu pemetaan tingkatan  | dokumen. Pilihan terbatas pada opsi bawaan  |
| ------------------- | -------------------------- | ------------------------------------------- |
| 9  Dropdown Select  | OP                         |                                             |
Severity Level  T  severity untuk kriteria  sistem: Clean, Low, Medium, High, atau
|     | anomali yang dikonfigurasi.  | Critical. Pilihan ini langsung diacu oleh  |
| --- | ---------------------------- | ------------------------------------------ |
Engine AI FinLens saat analisis dokumen.
Memicu kemunculan
|                         | popover/tooltip informasi  | Menampilkan teks utuh deskripsi Detail       |
| ----------------------- | -------------------------- | -------------------------------------------- |
| 10  Hover Tooltip Text  | OP                         |                                              |
|                         | deskripsi lengkap anomali  | Kategori/Anomali jika teks pada baris tabel  |
| Anomali                 | T                          |                                              |
|                         | saat kursor diarahkan      | dalam kondisi terpotong (truncated).         |
(hover).
* Memuat seluruh informasi detail kriteria
anomali, tingkat severity, status, dan
Memicu pembukaan modal
metadata (Created Date/By, Update
| Button View Detail  | BT pop-up detail konfigurasi  |                                           |
| ------------------- | ----------------------------- | ----------------------------------------- |
| 11                  |                               | Date/By).* Mengunci seluruh bidang input  |
| Anomali             | N  anomali dalam mode         |                                           |
(disabled) dan menyembunyikan tombol
read-only.
Simpan/Update. Aksi ini tidak memicu
pencatatan Log Activity.
|     | Memicu pembukaan modal    | Memuat data anomali ke dalam form modal  |
| --- | ------------------------- | ---------------------------------------- |
|     | BT pop-up untuk mengubah  | dan memungkinkan pengubahan deskripsi    |
12  Button Edit Anomali
|     | N  data kriteria anomali yang  | Detail Kategori/Anomali serta pemindahan  |
| --- | ------------------------------ | ----------------------------------------- |
|     | dipilih.                       | Severity Level.                           |

* Mengubah status keaktifan pemindaian
anomali (Aktif ↔ Non-Aktif).* Memicu
kemunculan modal pop-up konfirmasi
Switch Toggle Active / OP Memicu pengubahan status
13 validasi sebelum status resmi diperbarui di
Non-Active T keaktifan kriteria anomali.
database.* Jika Non-Aktif, anomali tersebut
diabaikan oleh Engine AI FinLens saat
memproses dokumen.
* Memeriksa keterkaitan data ke proses aktif
Engine AI FinLens.* Jika anomali sedang
Memicu proses
digunakan dalam pemindaian berkas
BT penghapusan kriteria
14 Button Delete Anomali dokumen yang berjalan: Aksi dibatalkan dan
N anomali secara permanen
sistem menampilkan banner error.* Jika tidak
dari sistem.
terikat proses aktif: Memicu kemunculan
modal pop-up konfirmasi hapus permanen.
* Memperbarui status keaktifan atau
Memicu eksekusi perubahan menghapus record kriteria anomali dari
Button Konfirmasi Ubah BT status atau penghapusan database.* Memperbarui kriteria deteksi
15
Status / Delete N permanen dari modal pada Engine AI FinLens secara real-time.*
pop-up konfirmasi. Memicu pencatatan entri transaksi baru pada
Log Activity.
* Memvalidasi input Detail Kategori/Anomali
(wajib diisi dan bersifat unik pada tenant
aktif).* Jika deskripsi duplikat: Menampilkan
Memicu eksekusi validasi
BT pesan kesalahan pada banner notification.*
16 Button Simpan Anomali dan penyimpanan data
N Jika valid: Menyimpan data anomali dan
kriteria anomali baru.
pemetaan severity ke database, meng-update
aturan Engine AI, memperbarui UI, serta
merekam entri Log Activity.
* Memvalidasi keunikan deskripsi Detail
Kategori/Anomali jika terdapat perubahan
Memicu eksekusi validasi teks.* Memperbarui record anomali dan
BT
17 Button Update Anomali dan pembaruan data kriteria tingkat severity di database, memperbarui
N
anomali yang diedit. aturan Engine AI, meng-update nilai Update
Date & Update By, menutup modal, serta
merekam entri Log Activity.
Menutup modal pop-up (Add, Edit, View,
Memicu pembatalan aksi
Button Batal / Close BT Konfirmasi Status, atau Konfirmasi Hapus)
18 dan penutupan modal
Modal N tanpa melakukan perubahan atau
pop-up yang sedang aktif.
penyimpanan data ke database.
* Mengarahkan tampilan tabel ke halaman
Navigasi untuk berpindah
Hyperlink Pagination HY data yang dipilih (<<, <, 1, 2, >, >>).* Mengisi
19 halaman pada tabel daftar
Number / Next / Prev P ulang baris tabel sesuai limit batas baris per
data kriteria anomali.
halaman yang telah ditentukan.
8. Master Kategori File
8.1. Menu Master Kategori File
Master Kategori File adalah modul konfigurasi administrasi pada
aplikasi FinLens yang berfungsi untuk mengelola dan mengelompokkan
jenis/kategori dokumen. Modul ini memungkinkan Administrator untuk
menambah, mengubah, dan mengaktifkan berbagai kategori berkas (seperti File
Finance, File Legal, Laporan Pajak, Faktur/Invoice, dll.) sesuai kebutuhan
operasional tenant.
Kategori berkas yang dikonfigurasi di modul ini nantinya menjadi acuan
atribut wajib (mandatory classification) pada saat pengguna melakukan proses
pengunggahan dokumen (upload file). Klasifikasi ini digunakan oleh Engine AI
FinLens untuk menentukan skema ekstraksi data, jenis validasi aturan, serta
kriteria deteksi anomali yang relevan dengan spesifikasi dokumen tersebut.

8.2. Flow Management Master Kategori File

Flow Detail :
1. Pembatasan Akses Multi-Tenant
- Saat pengguna mengakses menu Master Kategori File, sistem secara
otomatis mengidentifikasi Tenant ID dari akun pengguna yang sedang
login.
- Query database memfilter data dengan klausul WHERE tenant_id =
current_tenant_id.
- Pengguna hanya dapat melihat, menambah, dan mengelola kategori file
milik tenant sendiri. Data kategori file dari tenant lain tidak dapat diakses
atau dilihat.
2. Tambah Kategori File Baru (Create/Add Kategori File)
- Pengguna mengisikan data mandatory:
a. Nama Kategori File (Mandatory, Teks Bebas, Unik) — Contoh:
"File Finance", "File Legal", "Tax & Invoice".
- Validasi Keunikan Nama Kategori: Sistem mengecek ke database
apakah Nama Kategori File sudah pernah terdaftar di tenant tersebut
(case-insensitive). Jika ditemukan duplikasi, sistem menolak
penyimpanan dan menampilkan banner warning.
- Metadata & Timestamp Otomatis:
a. Tenant ID diset otomatis sesuai tenant dari akun pembuat.
b. Created Date disimpan otomatis oleh sistem (system
timestamp saat ini).
c. Created By direkam otomatis menggunakan User ID
pengguna yang mengeksekusi penambahan data.
d. Update Date dan Update By diinisialisasi secara otomatis
mengikuti tanggal dan ID pembuat pada saat pembuatan pertama
kali.
3. Ubah Data Kategori File (Edit Kategori File)
- Pengguna dapat mengubah Nama Kategori File.
- Validasi Keunikan pada Edit: Jika Nama Kategori File diubah, sistem
memvalidasi nama baru agar tidak bentrok dengan nama kategori file lain
dalam tenant yang sama.
- Saat berhasil disimpan:
a. Sistem memperbarui nilai pada field Update Date (timestamp
pembaruan terkini).
b. Sistem menyimpan identitas pengubah pada field Update By
(User ID pengguna saat ini).
c. Kategori file yang diperbarui akan langsung digunakan oleh modul
Upload File dan Engine AI FinLens.
4. Pencatatan Audit Trail (Log Activity)
- Setiap transaksi perubahan data (Create, Update, Delete/Change Status)
memicu pencatatan otomatis pada Log Activity.
- Log mencatat informasi mencakup User ID aktor, waktu kejadian
(timestamp), jenis aksi (CREATE_FILE_CATEGORY,
UPDATE_FILE_CATEGORY, DELETE_FILE_CATEGORY), serta rincian
nama kategori file terkait.

8.3. UI & Field Description Management Master Kategori File
Desktop

Berikut adalah alur proses bisnis (business flow) untuk menu Master Kategori
File pada aplikasi FinLens yang selaras dengan rancangan wireframe, batas tenant,
integrasi modul Upload File & Engine AI, serta aturan validasi sistem:
1. Akses & Pencarian Data (Read Data & Filtering)
- Akses Menu: Pengguna (Admin Tenant) membuka menu Master
Kategori File.
- Detection Tenant :
a. Sistem mengidentifikasi Tenant ID dari Admin yang sedang
login.
b. Sistem memuat daftar kategori file dengan query filter WHERE
tenant_id = current_tenant_id.
c. Admin hanya dapat melihat dan mengelola kategori file yang
terdaftar pada tenant-nya sendiri (data tenant lain tidak
ditampilkan).
- Pencarian Multi-Filter & Navigasi:
a. Admin dapat memfilter daftar kategori berkas berdasarkan kata
kunci Nama Kategori File.
b. Admin dapat memfilter data berdasarkan Range Created Date,
Range Update Date, dan pilihan Update By.
c. Tombol Reset Filter mengembalikan tampilan ke seluruh daftar
kategori file.
d. Tabel data dilengkapi pagination (<<, <, 1, 2, >, >>) untuk
membagi baris data per halaman.

2. Proses Tambah Kategori File Baru (Add New Kategori File Flow)
- Trigger Modal: Admin mengklik tombol + ADD NEW KATEGORI.
- Inisialisasi Form:
a. Sistem membuka modal Add New Kategori File.
- Pengisian Form:
a. Admin mengisikan Nama Kategori File (Mandatory, teks bebas,
bersifat unik) — contoh: "File Finance", "File Legal",
"Dokumen Pajak".
- Validasi System & Bisnis (Saat Klik Button SIMPAN):
a. Mandatory Check: Sistem memastikan Nama Kategori File telah
terisi.
b. Unique Check: Sistem mengecek ke database apakah nama
kategori file sudah pernah terdaftar di tenant tersebut
(case-insensitive). Jika duplikat, muncul Banner Alert Gagal
Validasi: "Nama Kategori File Sudah Ada di Sistem".
- Penyimpanan :
a. Jika validasi sukses, sistem menyimpan data kategori file baru
dengan merekam secara otomatis:
- Tenant ID diset sesuai tenant Admin yang login.
- Created Date & Update Date disimpan berdasarkan
system timestamp saat eksekusi.
- Created By & Update By disimpan berdasarkan User
ID Admin yang mengeksekusi.
b. Kategori file baru ini secara real-time muncul sebagai pilihan
dropdown pada modul Upload File dan mengarahkan skema
pemrosesan Engine AI.
c. Sistem merekam entri transaksi ke Log Activity
(CREATE_FILE_CATEGORY).
d. Modal tertutup, tabel di-refresh, dan muncul Banner Alert Sukses.
3. Proses Ubah Data Kategori File (Edit Kategori File Flow)
- Trigger Modal: Admin mengklik ikon Edit pada baris kategori file yang
dipilih.
- Loading Data:
a. Sistem menampilkan modal Edit Data beserta data terkini (Nama
Kategori File).
- Pengubahan Data:
a. Admin memperbarui deskripsi Nama Kategori File.
- Validasi & Pembaruan Data (Saat Klik Button UPDATE):
a. Unique Check: Jika nama kategori file diubah, sistem
memvalidasi nama baru agar tidak bentrok dengan nama kategori
file lain di tenant yang sama.
b. Jika validasi lolos, sistem memperbarui record di database serta
mencatat Update Date (timestamp saat ini) dan Update By
(User ID Admin).
c. Perubahan nama kategori file langsung terintegrasi ke seluruh
antarmuka yang terhubung (termasuk filter dokumen dan modul
upload).
d. Sistem merekam aksi ke Log Activity
(UPDATE_FILE_CATEGORY).

e. Modal tertutup, tabel di-refresh, dan muncul Banner Alert Sukses
Update.
4. Proses Lihat Detail Kategori File (View Only Flow)
- Trigger Modal: Admin mengklik ikon View pada baris kategori file.
- Penyajian Data Read-Only:
a. Sistem memunculkan modal detail yang menampilkan Nama
Kategori File lengkap, serta metadata (Created Date/By,
Update Date/By).
b. Seluruh inputan dikunci (disabled) dan tombol SIMPAN/UPDATE
dihilangkan, hanya menyisakan tombol TUTUP.
c. Aksi ini bersifat read-only dan tidak mencatat entri pada Log
Activity.
5. Proses Perubahan Status Keaktifan (Toggle Active / Non-Active Flow)
- Trigger Akses: Admin menggeser Switch Toggle pada kolom Action
tabel.
- Pop-up Validasi Konfirmasi:
a. Sebelum status diperbarui di database, sistem menampilkan
Modal Pop-Up Konfirmasi berisi peringatan bahwa kategori file
yang dinonaktifkan tidak dapat dipilih oleh pengguna pada modul
Upload File.
- Eksekusi Status (Saat Klik Button YA, UBAH STATUS):
a. Jika Diubah Menjadi Non-Aktif: Status kategori menjadi
Non-Aktif dan disembunyikan dari dropdown pilihan saat
pengguna mengunggah berkas baru.
b. Jika Diubah Menjadi Aktif: Kategori file kembali dapat dipilih
pada form upload dokumen.
c. Sistem memperbarui Update Date dan Update By pada record
kategori.
d. Sistem menyimpan entri aksi ke Log Activity
(CHANGE_FILE_CATEGORY_STATUS).
e. Pop-up konfirmasi tertutup dan tabel menampilkan indikator status
terbaru beserta Banner Alert Sukses.
6. Proses Hapus Permanen Kategori File (Delete Kategori File Flow)
- Trigger Akses: Admin mengklik ikon Delete (Hapus Permanen) pada
baris kategori file.
- Validasi Keterkaitan Data (Dependency Check):
a. Sistem mengecek apakah kategori file tersebut sedang
terikat/digunakan oleh berkas dokumen aktif di dalam sistem.
b. Jika Masih Terikat Dokumen: Aksi dibatalkan dan sistem
menampilkan Banner Alert Error: "Kategori File sedang digunakan
oleh dokumen aktif. Non-aktifkan status kategori file terlebih
dahulu."
- Pop-up Konfirmasi Hapus (Jika Tidak Terikat Dokumen):
a. Jika kategori file tidak terikat dengan dokumen mana pun, sistem
menampilkan Modal Pop-Up Konfirmasi Hapus Permanen
berisi peringatan bahwa tindakan tidak dapat dibatalkan.
- Eksekusi Hapus (Saat Klik Button YA, HAPUS PERMANEN):
a. Record kategori berkas dihapus secara permanen dari database.
b. Sistem menyimpan entri transaksi ke Log Activity
(DELETE_FILE_CATEGORY).

c.  Pop-up tertutup, tabel di-refresh, dan muncul Banner Alert Sukses
Hapus.

| N           | Sta Len   | Tipe  Tipe   |               | Description (DESC) & Business Rules  |
| ----------- | --------- | ------------ | ------------- | ------------------------------------ |
| Field Name  |           |              | Sample Value  |                                      |
| o           | tus  gth  | Data  Field  |               | (BR)                                 |
DESC: Menampilkan nama aplikasi
| 1  Header  | D  -  | APB  -  | FINLENS - TENANT  |     |
| ---------- | ----- | ------- | ----------------- | --- |
Tenant Info  MANAGEMENT  dan konteks modul tenant.BR: Tampil
permanen di bagian header atas.
DESC: Navigasi menu utama Master
Kategori File Management.BR: Hanya
| Menu Master  |       |           |                       | menampilkan dan mengelola data  |
| ------------ | ----- | --------- | --------------------- | ------------------------------- |
| 2            | D  -  | APB  TAB  | Master Kategori File  |                                 |
Kategori File
kategori berkas yang berada di bawah
Tenant ID Admin yang sedang login
(terisolasi penuh).
DESC: Field pencarian data kategori
3  Search Nama  O  100  APN  TXT  File Finance  berkas.BR: Memfilter daftar kategori
Kategori File
file di tabel berdasarkan parameter
Nama Kategori File.
DESC: Input rentang tanggal
pembuatan data kategori file.BR:
| 4  Range  | O  20  | DTE  TXT  | 2026-01-01 -  |     |
| --------- | ------ | --------- | ------------- | --- |
Created Date  2026-01-31  Memfilter daftar kategori file di tabel
yang dibuat pada rentang tanggal
tertentu.
DESC: Input rentang tanggal
pembaruan data kategori file.BR:
| 5  Range Update  | O  20  | DTE  TXT  | 2026-02-01 -  |     |
| ---------------- | ------ | --------- | ------------- | --- |
Memfilter daftar kategori file di tabel
| Date  |     |     | 2026-02-28  |     |
| ----- | --- | --- | ----------- | --- |
yang diperbarui pada rentang tanggal
tertentu.
DESC: Dropdown pilihan user yang
6  Filter Update  O  50  APN  OPT  admin1  melakukan update data.BR: Memfilter
By
daftar kategori file berdasarkan User
ID eksekutor pembaruan data.
DESC: Tombol untuk menerapkan
seluruh kriteria filter pencarian.BR:
7  Ceklis Filter  O  -  APB  BTN  [ Ceklis Filter ]  Memproses pemfilteran data tabel
sesuai kombinasi parameter Search,
Created Date, Update Date, dan
Update By.
DESC: Tombol untuk menghapus
seluruh parameter filter.BR:
8  Reset Filter  O  -  APB  BTN  [ Reset Filter ]  Mengembalikan tampilan tabel ke
seluruh daftar kategori berkas tanpa
filter.
DESC: Tombol untuk membuka modal
| Add New   |       |           | + ADD NEW  | pop-up pendaftaran kategori berkas  |
| --------- | ----- | --------- | ---------- | ----------------------------------- |
| 9         | O  -  | APB  BTN  |            |                                     |
| Kategori  |       |           | KATEGORI   | baru.BR: Mengarahkan Admin ke form  |
input Nama Kategori File baru.
| 1 Row Data  | D  -  | APN  ROW  | `1  | File Finance  |
| ----------- | ----- | --------- | --- | ------------- |
0  Kategori File
DESC: Nomor urut baris data tabel.BR:
| 1   |       |           |     | Dihasilkan otomatis oleh sistem     |
| --- | ----- | --------- | --- | ----------------------------------- |
| No  | C  5  | NUM  ROW  | 1   |                                     |
| 1   |       |           |     | menyesuaikan urutan data dan nomor  |
halaman pagination.
DESC: Nama pengelompokan jenis
berkas/dokumen.BR: Wajib diisi pada
| 1 Nama  |         |           |               | form Add/Edit. Bersifat unik  |
| ------- | ------- | --------- | ------------- | ----------------------------- |
|         | M  100  | APN  TXT  | File Finance  |                               |
2  Kategori File
(case-insensitive) pada lingkup tenant
aktif, tidak boleh duplikat. Digunakan
sebagai acuan pilihan dropdown pada

modul Upload File & Engine AI.
DESC: Tanggal dan waktu pembuatan
record kategori berkas.BR: Direkam
1
Created Date  C  19  DTM  ROW  2026-01-15 8:30:00  otomatis oleh sistem (system
3
timestamp) saat kategori file pertama
kali dibuat.
DESC: User ID Admin yang membuat
record kategori berkas pertama
| 1           |        |           |         | kali.BR: Direkam otomatis oleh sistem  |
| ----------- | ------ | --------- | ------- | -------------------------------------- |
| Created By  | C  50  | APN  ROW  | admin1  |                                        |
| 4           |        |           |         | berdasarkan User ID Admin yang         |
sedang login saat eksekusi
pembuatan data.
DESC: Tanggal dan waktu pembaruan
data kategori file terakhir.BR:
| 1            |        |           |                      | Diperbarui otomatis oleh sistem saat  |
| ------------ | ------ | --------- | -------------------- | ------------------------------------- |
| Update Date  | C  19  | DTM  ROW  | 2026-02-10 14:15:00  |                                       |
5
terjadi pengubahan data kategori file.
Diinisialisasi sama dengan Created
Date pada saat pembuatan pertama.
DESC: User ID Admin yang melakukan
pembaruan data terakhir.BR: Diisi
otomatis oleh sistem sesuai dengan
1
Update By  C  50  APN  ROW  admin1  User ID Admin yang melakukan
6
eksekusi perubahan data. Diinisialisasi
sama dengan Created By pada saat
pembuatan pertama.
DESC: Tombol untuk melihat detail
informasi kategori file.BR: Membuka
| 1            |       |           |              | modal detail kategori file dalam mode  |
| ------------ | ----- | --------- | ------------ | -------------------------------------- |
| Action View  | O  -  | APB  BTN  | [Icon View]  |                                        |
| 7            |       |           |              | read-only (seluruh field terkunci dan  |
tidak memicu pencatatan log
perubahan).
DESC: Tombol untuk mengubah data
kategori file.BR: Membuka modal edit
1
| Action Edit  | O  -  | APB  BTN  | [Icon Edit]  |                                        |
| ------------ | ----- | --------- | ------------ | -------------------------------------- |
| 8            |       |           |              | kategori file. Mengizinkan pengubahan  |
Nama Kategori File dengan tetap
memvalidasi keunikan nama.
DESC: Kontrol untuk mengaktifkan
atau menonaktifkan status kategori
berkas.BR: Mengubah status
operasional kategori berkas.
1 Toggle Active
|     | M  -  | APB  OPT  | Switch (On/Off)  | Menampilkan pop-up konfirmasi  |
| --- | ----- | --------- | ---------------- | ------------------------------ |
9  / Non-Active
validasi sebelum diperbarui di
database. Jika Non-Aktif, kategori file
disembunyikan dari dropdown modul
Upload File.
DESC: Indikator status keaktifan
| 2 Status  |        |           |                    | kategori file.BR: Diperbarui secara  |
| --------- | ------ | --------- | ------------------ | ------------------------------------ |
|           | C  10  | APB  ROW  | Aktif / Non-Aktif  |                                      |
0  Kategori File
otomatis berdasarkan aksi dari Toggle
Active/Non-Active.
DESC: Tombol untuk menghapus
kategori berkas secara permanen.BR:
Memeriksa keterkaitan ke dokumen
| 2 Action Delete  | O  -  | APB  BTN  | [Icon Delete]  |                                      |
| ---------------- | ----- | --------- | -------------- | ------------------------------------ |
| 1                |       |           |                | aktif di sistem. Jika masih terikat  |
dokumen, aksi ditolak. Jika tidak
terikat, memicu modal pop-up
konfirmasi hapus permanen.
DESC: Tombol konfirmasi pada modal
| Pop-Up  |     |     |     | validasi aksi.BR: Memproses  |
| ------- | --- | --- | --- | ---------------------------- |
YA, UBAH STATUS /
| 2 Confirm    |       |           |            | pembaruan status atau penghapusan  |
| ------------ | ----- | --------- | ---------- | ---------------------------------- |
|              | D  -  | APB  BTN  | YA, HAPUS  |                                    |
| 2  Status /  |       |           |            | permanen data kategori berkas di   |
PERMANEN
| Delete  |     |     |     | database, memperbarui UI, dan  |
| ------- | --- | --- | --- | ------------------------------ |
memicu pencatatan Log Activity.

DESC: Tombol untuk menyimpan data
kategori berkas baru atau pembaruan
| Button  |     |     |     | data.BR: Memvalidasi keunikan Nama  |
| ------- | --- | --- | --- | ----------------------------------- |
2
Simpan /  M  -  APB  BTN  SIMPAN / UPDATE  Kategori File, menyimpan data ke
3
| Update  |     |     |     | database, meng-update daftar pada  |
| ------- | --- | --- | --- | ---------------------------------- |
modul Upload File, memperbarui UI,
dan merekam Log Activity.
DESC: Tombol untuk menutup modal
pop-up.BR: Menghentikan proses
2 Button Batal /
|     | O  -  | APB  BTN  | BATAL / [X]  | (Add/Edit/View/Toggle/Delete) dan  |
| --- | ----- | --------- | ------------ | ---------------------------------- |
4  Close
menutup modal tanpa menyimpan
perubahan data.
DESC: Navigasi perpindahan halaman
data tabel.BR: Membagi tampilan
2
Pagination  C  -  NUM  HYP  1, 2, 3...  daftar kategori berkas menjadi
5
beberapa halaman sesuai limit baris
per halaman yang ditentukan.

8.4.  Action Control Menu Master Kategori File

| N        |     | Typ                 |                      |     |
| -------- | --- | ------------------- | -------------------- | --- |
| Control  |     | Description (DESC)  | Business Rules (BR)  |     |
| o        |     | e                   |                      |     |
* Mengarahkan tampilan ke modul Master Kategori
Navigasi untuk
File Management.* Hanya memuat dan
| Tab Menu Master  |     | TA berpindah ke halaman  |                                                    |     |
| ---------------- | --- | ------------------------ | -------------------------------------------------- | --- |
| 1                |     |                          | menampilkan daftar kategori berkas yang terdaftar  |     |
| Kategori File    |     | B  utama pengelolaan     |                                                    |     |
pada Tenant ID Admin yang sedang login (terisolasi
data kategori berkas.
penuh dari tenant lain).
Memicu pemfilteran
|                    |     | daftar kategori berkas  | Memfilter baris tabel berdasarkan kata kunci nama  |     |
| ------------------ | --- | ----------------------- | -------------------------------------------------- | --- |
| Input Search Nama  |     | OP                      |                                                    |     |
2  berdasarkan  kategori berkas. Jika data tidak ditemukan, tabel
| Kategori File  |     | T                    |                                            |     |
| -------------- | --- | -------------------- | ------------------------------------------ | --- |
|                |     | pencarian teks Nama  | menampilkan pesan "Data Tidak Ditemukan".  |     |
Kategori File.
Memicu pemfilteran
|                      |     | daftar kategori file  | Memfilter baris tabel sesuai tanggal pembuatannya  |     |
| -------------------- | --- | --------------------- | -------------------------------------------------- | --- |
| Input Range Created  |     | OP                    |                                                    |     |
3  berdasarkan rentang  (Created Date) yang masuk dalam rentang Start
| Date  |     | T                  |                        |     |
| ----- | --- | ------------------ | ---------------------- | --- |
|       |     | tanggal pembuatan  | Date hingga End Date.  |     |
data.
Memicu pemfilteran
|                     |     | daftar kategori file  | Memfilter baris tabel sesuai tanggal pembaruan  |     |
| ------------------- | --- | --------------------- | ----------------------------------------------- | --- |
| Input Range Update  |     | OP                    |                                                 |     |
4  berdasarkan rentang  terakhirnya (Update Date) yang masuk dalam
| Date  |     | T   |     |     |
| ----- | --- | --- | --- | --- |
rentang Start Date hingga End Date.
tanggal pembaruan
data.
Memicu pemfilteran
|                         |     | daftar kategori file  | Memfilter baris tabel untuk menampilkan kategori  |     |
| ----------------------- | --- | --------------------- | ------------------------------------------------- | --- |
| Dropdown Filter Update  |     | OP                    |                                                   |     |
5  berdasarkan User ID  berkas yang terakhir diubah oleh User ID Admin
| By  |     | T   |     |     |
| --- | --- | --- | --- | --- |
yang dipilih.
eksekutor
pembaruan.
|     |     | Memicu eksekusi        | Memproses seluruh parameter filter yang diisi     |     |
| --- | --- | ---------------------- | ------------------------------------------------- | --- |
|     |     | BT proses pemfilteran  | (Search Nama Kategori, Range Created Date, Range  |     |
6  Button Ceklis Filter
N
|     |     | data tabel secara  | Update Date, dan Update By) secara bersamaan  |     |
| --- | --- | ------------------ | --------------------------------------------- | --- |
|     |     | kombinasi.         | untuk menyaring data tabel.                   |     |
Memicu
Mengosongkan seluruh bidang filter pencarian dan
|     |     | BT pengembalian kriteria  |     |     |
| --- | --- | ------------------------- | --- | --- |
7  Button Reset Filter  memuat ulang tabel untuk menampilkan seluruh
|     |     | N  filter ke kondisi awal  |     |     |
| --- | --- | -------------------------- | --- | --- |
daftar kategori berkas di tenant aktif.
(default).
Memicu pembukaan
Mengosongkan bidang Nama Kategori File dan
| Button Add New  |     | BT modal form            |                                          |     |
| --------------- | --- | ------------------------ | ---------------------------------------- | --- |
| 8               |     |                          | menampilkan informasi metadata otomatis  |     |
| Kategori File   |     | N  pendaftaran kategori  |                                          |     |
(Created Date/By dan Update Date/By).
berkas baru.

* Memuat seluruh informasi detail kategori file,
Memicu pembukaan
status keaktifan, dan metadata lengkap (Created
modal pop-up detail
Button View Detail  BT Date/By, Update Date/By).* Mengunci seluruh
| 9   | konfigurasi kategori  |     |
| --- | --------------------- | --- |
Kategori File  N  bidang input (disabled) dan menyembunyikan
berkas dalam mode
tombol Simpan/Update. Aksi ini tidak memicu
read-only.
pencatatan Log Activity.
Memicu pembukaan
|     | modal pop-up untuk  | Memuat data kategori berkas ke dalam form modal  |
| --- | ------------------- | ------------------------------------------------ |
BT
10  Button Edit Kategori File  mengubah data  dan memungkinkan pengubahan deskripsi Nama
N
|     | kategori berkas yang  | Kategori File.  |
| --- | --------------------- | --------------- |
dipilih.
* Mengubah status keaktifan kategori berkas (Aktif
↔ Non-Aktif).* Memicu kemunculan modal pop-up
Memicu pengubahan
Switch Toggle Active /  OP konfirmasi validasi sebelum status resmi diperbarui
| 11  | status keaktifan  |     |
| --- | ----------------- | --- |
Non-Active  T  di database.* Jika Non-Aktif, kategori berkas ini
kategori berkas.
otomatis disembunyikan dari pilihan dropdown
pada modul Upload File.
* Memeriksa keterkaitan data ke berkas dokumen
|                             | Memicu proses  | aktif di sistem FinLens.* Jika kategori file sedang  |
| --------------------------- | -------------- | ---------------------------------------------------- |
|                             | penghapusan    | terikat oleh dokumen aktif: Aksi dibatalkan dan      |
| 12  Button Delete Kategori  | BT             |                                                      |
File  N  kategori berkas  sistem menampilkan banner error.* Jika tidak
|     | secara permanen dari  | terikat oleh dokumen mana pun: Memicu     |
| --- | --------------------- | ----------------------------------------- |
|     | sistem.               | kemunculan modal pop-up konfirmasi hapus  |
permanen.
|                         | Memicu eksekusi   | * Memperbarui status keaktifan atau menghapus  |
| ----------------------- | ----------------- | ---------------------------------------------- |
|                         | perubahan status  | record kategori berkas dari database.*         |
| Button Konfirmasi Ubah  | BT                |                                                |
13  atau penghapusan  Memperbarui daftar opsi pilihan pada modul Upload
| Status / Delete  | N                    |                                                  |
| ---------------- | -------------------- | ------------------------------------------------ |
|                  | permanen dari modal  | File secara real-time.* Memicu pencatatan entri  |
|                  | pop-up konfirmasi.   | transaksi baru pada Log Activity.                |
* Memvalidasi input Nama Kategori File (wajib diisi
dan bersifat unik pada tenant aktif).* Jika nama
|     | Memicu eksekusi  | duplikat: Menampilkan pesan kesalahan pada  |
| --- | ---------------- | ------------------------------------------- |
Button Simpan Kategori  BT validasi dan  banner notification.* Jika valid: Menyimpan data
14
| File  | N                 |                                                  |
| ----- | ----------------- | ------------------------------------------------ |
|       | penyimpanan data  | kategori ke database, merekam Created Date/By &  |
kategori berkas baru.
Update Date/By otomatis, meng-update daftar pada
modul Upload File, memperbarui UI, serta merekam
entri Log Activity.
* Memvalidasi keunikan Nama Kategori File jika
Memicu eksekusi
terdapat perubahan teks.* Memperbarui record
validasi dan
Button Update Kategori  BT kategori berkas di database, merekam Update Date
| 15    | pembaruan data  |                                                     |
| ----- | --------------- | --------------------------------------------------- |
| File  | N               | & Update By terkini, meng-update opsi pilihan pada  |
kategori berkas yang
modul Upload File, menutup modal, serta merekam
diedit.
entri Log Activity.
Memicu pembatalan
Menutup modal pop-up (Add, Edit, View, Konfirmasi
| Button Batal / Close  | BT aksi dan penutupan  |                                                 |
| --------------------- | ---------------------- | ----------------------------------------------- |
| 16                    |                        | Status, atau Konfirmasi Hapus) tanpa melakukan  |
| Modal                 | N  modal pop-up yang   |                                                 |
perubahan atau penyimpanan data ke database.
sedang aktif.
|     | Navigasi untuk  | * Mengarahkan tampilan tabel ke halaman data  |
| --- | --------------- | --------------------------------------------- |
Hyperlink Pagination  HY berpindah halaman  yang dipilih (<<, <, 1, 2, >, >>).* Mengisi ulang baris
17
Number / Next / Prev  P  pada tabel daftar data  tabel sesuai limit batas baris per halaman yang
|     | kategori berkas.  | telah ditentukan.  |
| --- | ----------------- | ------------------ |

9. Submit Document
9.1. Halaman Submit Document
Menu Submit Document adalah modul operasional utama pada aplikasi
FinLens yang digunakan oleh pengguna (Submitter) untuk mengunggah berkas
dokumen berformat PDF ke dalam sistem. Setelah berkas berhasil diunggah,
Engine AI FinLens secara otomatis melakukan pemindaian (scanning), ekstraksi
data, dan identifikasi kriteria anomali berdasarkan konfigurasi pada Master
Anomali dan Master Kategori File.
Sistem menerapkan aturan kontrol status dokumen sebagai berikut:
- Status OPEN : Selama dokumen baru diunggah dan proses pemeriksaan
oleh tim peninjau (User Checker) di menu History Document belum
selesai/final, Submitter masih memiliki akses penuh untuk mengubah,
memperbarui, atau menghapus berkas dokumen tersebut.
- Status CHECKED : Apabila proses verifikasi oleh User Checker telah
selesai dan status dokumen berubah menjadi Checked, maka dokumen
secara otomatis dikunci permanen (locked). Submitter tidak lagi dapat
melakukan pengubahan, penggantian, maupun penghapusan berkas.

9.2. Flow Management Submit Document
Flow Detail :
1. Pembatasan Akses Multi-Tenant
- Saat pengguna (Submitter) mengakses menu Submit Document,
sistem secara otomatis mengidentifikasi Tenant ID dari akun
yang sedang login.
- Query database memfilter data dengan klausul WHERE
tenant_id = current_tenant_id.

- User hanya dapat melihat, mengunggah, dan mengelola dokumen
milik tenant sendiri. Dokumen milik tenant lain tidak dapat
diakses atau dilihat.
2. Proses Unggah Dokumen Baru (Submit/Upload Document)
- Pengguna mengisikan dan memilih data mandatory :
a. Nama Document (Mandatory, Teks Bebas, Unik).
b. Select Kategori File (Mandatory, Dropdown) — Memilih
kategori berkas yang bersumber dari data aktif pada
Master Kategori File.
c. File Document PDF (Mandatory, File Picker) — Hanya
menerima berkas dengan format .pdf. Berkas dengan
ekstensi lain (seperti .docx, .png, .xlsx) otomatis
ditolak oleh sistem.
- Verify Format :
a. Sistem mengecek ke database apakah Nama Document
sudah pernah digunakan di tenant tersebut
(case-insensitive).
b. Sistem melakukan verifikasi ekstensi dan MIME-type
(Multipurpose Internet Mail Extensions type) berkas untuk
memastikan berkas valid PDF.
- Metadata & Status Awal :
a. Status dokumen secara otomatis di-set ke OPEN.
b. Tenant ID diset otomatis sesuai tenant pengguna yang
mengunggah.
c. Created Date & Created By direkam otomatis oleh
sistem berdasarkan timestamp dan User ID pengunggah.
d. Update Date & Update By diinisialisasi secara otomatis
mengikuti data pembuat.
- Trigger Engine AI: Setelah penyimpan berkas berhasil, sistem
mengirimkan pemicu (trigger) ke Engine AI FinLens untuk
langsung menjalankan proses scanning, ekstraksi teks/data, dan
deteksi kriteria anomali.
3. Proses Ubah Dokumen (Edit Document & Hak Akses Kontrol)
- User memilih dokumen yang ingin diubah.
- Pemeriksaan Status Dokumen (Kunci Hak Akses):
a. Status OPEN: Pengguna diizinkan mengubah Nama
Document, memindahkan Kategori File, atau
mengunggah ulang (replace) berkas PDF. Jika berkas
PDF diganti, sistem memicu ulang Engine AI untuk
pemindaian berkas baru.
b. Status CHECKED: Jika proses checker di menu History
Document telah selesai/final oleh User Checker, status
dokumen berubah menjadi CHECKED. Aksi edit dan hapus
secara otomatis dikunci/ditolak oleh sistem, dan sistem
menampilkan pesan: "Dokumen telah diverifikasi (Status
CHECKED) dan tidak dapat diubah lagi."
- Validasi Keunikan pada Edit: Jika Nama Document diubah,
sistem memvalidasi nama baru agar tidak bentrok dengan
dokumen lain di tenant yang sama.

- Saat berhasil disimpan, sistem memperbarui field Update Date
dan Update By.
4. Pencatatan Audit Trail (Log Activity)
- Setiap transaksi unggah, pengubahan, maupun penghapusan
dokumen mentrigger penyimpanan otomatis pada Log Activity.
- Log menyimpan identitas user (User ID), timestamp activity, tipe
activity (SUBMIT_DOCUMENT, UPDATE_SUBMIT_DOCUMENT,
DELETE_SUBMIT_DOCUMENT), nama dokumen, serta status
dokumen (OPEN / CHECKED).
9.3. UI & Field Description Management Submit Document
Desktop

Berikut adalah proses bisnis (business flow) menu Submit Document pada aplikasi
FinLens sesuai rancangan UI, batas tenant, integrasi Engine AI, serta log status
dokumen:
1. Akses & Pencarian Data (Read Data & Filtering)
- Akses Menu: Pengguna (Submitter) membuka menu Submit Document.
- Lock Tenant :
a. Sistem mengidentifikasi Tenant ID dari akun yang sedang
login.
b. Sistem memuat daftar dokumen dengan query filter WHERE
tenant_id = current_tenant_id.
c. User hanya dapat melihat dan mengelola berkas dokumen milik
tenant sendiri (dokumen tenant lain tidak dimunculkan).
- Pencarian Multi-Filter & Navigasi:
a. Pengguna dapat memfilter daftar dokumen berdasarkan kata kunci
Nama Document.
b. Pengguna dapat memfilter data berdasarkan Range Created Date,
Range Update Date, dan pilihan Update By.
c. Tombol Reset Filter mengembalikan tampilan ke seluruh daftar
dokumen.
d. Tabel data dilengkapi pagination (<<, <, 1, 2, >, >>) untuk
membagi baris data per halaman.
2. Proses Unggah Dokumen Baru (Add New Document Flow)
- Trigger Modal: Pengguna mengklik tombol + ADD NEW DOCUMENT.
- Inisialisasi Form:
a. Sistem membuka modal Tambah Document Baru.
b. Dropdown Kategori File secara otomatis memuat daftar kategori
aktif dari Master Kategori File.
- Pengisian Form & Upload File:
a. User mengisikan Nama Document File (Mandatory, teks bebas,
bersifat unik).
b. User memilih Kategori File (Mandatory).
c. User mengunggah file pada bidang Upload File PDF (Mandatory,
format wajib .pdf).
- Validasi System & Format File (Saat Upload / Klik Button SIMPAN):
a. Mandatory Check: Sistem memastikan Nama Document,
Kategori File, dan File PDF telah terisi.

b.  Format  &  Extension  Check:  Sistem  memvalidasi  bahwa file
yang diunggah hanya berformat PDF (.pdf). Jika mengunggah
format lain (seperti .docx, .png, .xlsx), proses dihentikan dan
muncul Banner Alert Error: "Format Berkas Harus PDF (.pdf)".
c.  Unique  Check:  Sistem  mengecek  ke  database  apakah  Nama
|     | Document             | sudah  | pernah           |     | terdaftar  | di      | tenant  | tersebut  |
| --- | -------------------- | ------ | ---------------- | --- | ---------- | ------- | ------- | --------- |
|     | (case-insensitive).  |        | Jika  duplikat,  |     | muncul     | Banner  | Alert   | Gagal     |
Validasi: "Nama Document Sudah Ada di Sistem".
-  PDF Preview :
a.  File  PDF  yang  valid  langsung  ditampilkan  pada  komponen
Preview / View PDF Hasil Upload di dalam modal agar pengguna
dapat mengecek ulang isi dokumen sebelum disimpan.
-  Penyimpanan, Trigger Engine AI, & Audit Trail:
a.  Jika validasi sukses, sistem menyimpan data dan File PDF dengan
menyimpan secara otomatis :
|     | -   | Tenant ID diset sesuai tenant pengguna yang login.   |       |     |         |     |       |           |
| --- | --- | ---------------------------------------------------- | ----- | --- | ------- | --- | ----- | --------- |
|     | -   | Status Document otomatis diset ke OPEN.              |       |     |         |     |       |           |
|     | -   | Created                                              | Date  | &   | Update  |     | Date  | disimpan  |
berdasarkan system timestamp saat berjalan.
|     | -   | Created  | By  &  | Update  | By  | disimpan  |     | berdasarkan  |
| --- | --- | -------- | ------ | ------- | --- | --------- | --- | ------------ |
User ID pengguna yang mengeksekusi.
b.  Sistem  mengirimkan  trigger  ke  Engine  AI  FinLens  untuk
pemindaian (scanning), ekstraksi data, dan identifikasi anomali.
| c.  | Sistem  | merecord  | entri  |     | transaksi  | ke  | Log  | Activity  |
| --- | ------- | --------- | ------ | --- | ---------- | --- | ---- | --------- |
(SUBMIT_DOCUMENT).
d.  Modal tertutup, tabel di-refresh, dan muncul Banner Alert Sukses.
3.  Proses Ubah Data Dokumen (Edit Document Flow & Akses Kontrol)
-  Trigger Modal: Pengguna mengklik ikon Edit pada baris dokumen yang
dipilih.
-  Pemeriksaan Status Dokumen (Kunci Hak Akses):
a.  Status OPEN: Pengguna diizinkan masuk ke modal edit.
b.  Status CHECKED: Jika proses pemeriksaan oleh User Checker
|     | di  menu  | History  | Document  | telah  | selesai/final,  |     | status dokumen  |     |
| --- | --------- | -------- | --------- | ------ | --------------- | --- | --------------- | --- |
berubah menjadi CHECKED. Tombol Edit pada tabel dalam kondisi
terkunci (disabled/lock). Jika dipaksa, sistem menampilkan Banner

Alert Error: "Akses Ditolak: Dokumen dalam Status CHECKED.
Dokumen yang sudah selesai diperiksa tidak dapat
diubah/dihapus."
- Pengubahan Data (Status OPEN):
a. User dapat mengubah Nama Document File, mengganti Kategori
File, atau mengunggah ulang (replace) file PDF Baru.
b. Komponen PDF Preview menampilkan pratinjau berkas baru yang
diunggah.
- Validasi & Pembaruan Data (Saat Klik Button UPDATE):
a. Unique Check: Jika nama dokumen diubah, sistem memvalidasi
nama baru agar tidak bentrok dengan dokumen lain di tenant yang
sama.
b. Jika validasi lolos, sistem memperbarui record di database serta
mencatat Update Date (timestamp saat ini) dan Update By
(User ID pengguna).
c. Re-Trigger AI Engine: Jika berkas PDF diganti dengan file baru,
sistem memicu ulang Engine AI FinLens untuk melakukan
pemindaian ulang.
d. Sistem menyimpan aksi ke Log Activity
(UPDATE_SUBMIT_DOCUMENT).
e. Modal tertutup, tabel di-refresh, dan muncul Banner Alert Sukses
Update.
4. Proses Lihat Detail Dokumen (View Only Flow)
- Trigger Modal: Pengguna mengklik ikon View / [PDF] View.pdf pada
baris dokumen.
- Data Read-Only:
a. Sistem memunculkan modal detail yang menampilkan Nama
Document, Kategori File, Status Dokumen (OPEN / CHECKED),
pratinjau lengkap berkas PDF (PDF Viewer), serta metadata
(Created Date/By, Update Date/By).
b. Seluruh inputan dikunci (disabled) dan tombol
SIMPAN/UPDATE dihilangkan, hanya menyisakan tombol
TUTUP.
c. Aksi ini dapat diakses pada dokumen berstatus OPEN maupun
CHECKED, dan tidak mencatat entri pada Log Activity.

5. Proses Perubahan Status Keaktifan (Toggle Active / Non-Active Flow)
- Trigger Akses: Pengguna menggeser Switch Toggle pada kolom Action
tabel.
- Pemeriksaan Status Dokumen:
a. Aksi ini hanya dapat dilakukan jika status dokumen masih
OPEN. Jika status CHECKED, tombol toggle terkunci.
- Pop-up Validasi Konfirmasi:
a. Sebelum status diperbarui di database, sistem menampilkan Modal
Pop-Up Konfirmasi berisi peringatan bahwa dokumen yang
Non-Aktif tidak akan diproses oleh Engine AI dan disembunyikan
dari antrean User Checker.
- Eksekusi Status (Saat Klik Button YA, UBAH STATUS):
a. Jika Diubah Menjadi Non-Aktif: Status keaktifan dokumen
menjadi Non-Aktif dan dihentikan sementara dari antrean
pemeriksaan AI/Checker.
b. Jika Diubah Menjadi Aktif: Dokumen kembali dimasukkan ke
dalam antrean pemrosesan.
c. Sistem memperbarui Update Date dan Update By pada
record dokumen.
d. Sistem merekam entri aksi ke Log Activity
(CHANGE_SUBMIT_DOCUMENT_STATUS).
e. Pop-up konfirmasi tertutup dan tabel menampilkan indikator status
terbaru beserta Banner Alert Sukses.
-
6. Proses Hapus Permanen Dokumen (Delete Document Flow)
- Trigger Akses: Pengguna mengklik ikon Delete (Hapus Permanen) pada
baris dokumen.
- Pemeriksaan Status Dokumen (Kunci Hak Akses):
a. Status CHECKED: Aksi hapus ditolak dan tombol terkunci
(disabled).
b. Status OPEN: Sistem melanjutkan ke proses konfirmasi.
- Pop-up Konfirmasi Hapus:
a. Sistem menampilkan Modal Pop-Up Konfirmasi Hapus
Permanen berisi peringatan bahwa berkas PDF dan data dokumen
akan terhapus dari sistem dan penyimpan cloud storage.

-  Eksekusi Hapus (Saat Klik Button YA, HAPUS PERMANEN):
a.  Record dokumen dan berkas fisik PDF dihapus secara permanen
dari database dan penyimpanan storage.
|     | b.  Sistem  | menyimpan  | entri  transaksi  | ke  Log  | Activity  |
| --- | ----------- | ---------- | ----------------- | -------- | --------- |
(DELETE_SUBMIT_DOCUMENT).
c.  Pop-up tertutup, tabel di-refresh, dan muncul Banner Alert Sukses
Hapus.

N Field Name  Stat Len Tipe  Tipe  Sample Value  Description (DESC) &
| o   | us  gth  | Data  Field  |     | Business Rules (BR)  |     |
| --- | -------- | ------------ | --- | -------------------- | --- |
DESC: Menampilkan nama
| Header Tenant  |       |         | FINLENS - TENANT  | aplikasi dan konteks modul  |     |
| -------------- | ----- | ------- | ----------------- | --------------------------- | --- |
| 1              | D  -  | APB  -  |                   |                             |     |
| Info           |       |         | MANAGEMENT        |                             |     |
tenant.BR: Tampil permanen
di bagian header atas.
DESC: Navigasi menu utama
Submit Document.BR:
Hanya menampilkan dan
2  Menu Submit  D  -  APB  TAB  Submit Document  mengelola data dokumen
| Document  |     |     |     | yang diunggah di bawah  |     |
| --------- | --- | --- | --- | ----------------------- | --- |
Tenant ID pengguna yang
sedang login (terisolasi
penuh).
DESC: Field pencarian data
dokumen.BR: Memfilter
Search Nama
3  O  100  APN  TXT  Doc_PPN_Jan2026  daftar dokumen di tabel
Document
berdasarkan parameter
Nama Document File.
DESC: Input rentang tanggal
pengunggahan
| Range Created  |        |           | 2026-01-01 -  | dokumen.BR: Memfilter    |     |
| -------------- | ------ | --------- | ------------- | ------------------------ | --- |
| 4              | O  20  | DTE  TXT  |               |                          |     |
| Date           |        |           | 2026-01-31    | daftar dokumen di tabel  |     |
yang dibuat pada rentang
tanggal tertentu.
DESC: Input rentang tanggal
pembaruan dokumen.BR:
| Range Update  |        |           | 2026-02-01 -  |                              |     |
| ------------- | ------ | --------- | ------------- | ---------------------------- | --- |
| 5             | O  20  | DTE  TXT  |               |                              |     |
| Date          |        |           | 2026-02-28    | Memfilter daftar dokumen di  |     |
tabel yang diperbarui pada
rentang tanggal tertentu.
DESC: Dropdown pilihan
user yang melakukan
6  Filter Update By  O  50  APN  OPT  admin1  update data.BR: Memfilter
daftar dokumen
berdasarkan User ID
eksekutor pembaruan data.
DESC: Tombol untuk
menerapkan seluruh kriteria
filter pencarian.BR:
Memproses pemfilteran
| 7  Ceklis Filter  | O  -  | APB  BTN  | [ Ceklis Filter ]  |     |     |
| ----------------- | ----- | --------- | ------------------ | --- | --- |
data tabel sesuai kombinasi
parameter Search, Created
Date, Update Date, dan
Update By.
DESC: Tombol untuk
8  Reset Filter  O  -  APB  BTN  [ Reset Filter ]  menghapus seluruh
parameter filter.BR:

Mengembalikan tampilan
tabel ke seluruh daftar
dokumen tanpa filter.
DESC: Tombol untuk
membuka modal pop-up
pengunggahan dokumen
Add New + ADD NEW PDF baru.BR: Mengarahkan
9 O - APB BTN
Document DOCUMENT Submitter ke form input
Nama Document File,
Kategori File, dan Upload
File PDF.
Row Data
10 Submit D - APN ROW `1 Doc_PPN_Jan2026
Document
DESC: Nomor urut baris
data tabel.BR: Dihasilkan
otomatis oleh sistem
11 No C 5 NUM ROW 1
menyesuaikan urutan data
dan nomor halaman
pagination.
DESC: Nama identifikasi
dokumen yang diunggah.BR:
Wajib diisi pada form
Add/Edit. Bersifat unik
Nama
12 M 100 APN TXT Doc_PPN_Jan2026 (case-insensitive) pada
Document File
lingkup tenant aktif, tidak
boleh duplikat. Hanya dapat
diubah jika status dokumen
masih OPEN.
DESC: Pengelompokan jenis
dokumen yang diunggah.BR:
Wajib dipilih dari dropdown
pilihan aktif pada Master
13 Kategori File M 50 APB OPT File Finance
Kategori File. Digunakan
sebagai acuan skema
analisis oleh Engine AI
FinLens.
DESC: Control untuk
memilih dan mengunggah
file dokumen.BR: Wajib diisi.
Format file yang diizinkan
hanya PDF (.pdf). File
14 Upload File PDF M - APN BTN [ Choose File ] Doc.pdf
berformat lain otomatis
ditolak sistem.
Mengunggah/mengganti
berkas akan memicu Engine
AI secara otomatis.
DESC: Komponen
visualisasi pratinjau isi
dokumen PDF.BR:
Preview / View [PDF] View.pdf / PDF Menampilkan rendering
15 D - - HYP
PDF Viewer halaman PDF secara
real-time di dalam modal
form maupun melalui tautan
pada tabel.
DESC: Indikator status
tahapan verifikasi dokumen
oleh User Checker.BR:
Default bernilai OPEN saat
Status
16 C 10 APB ROW OPEN / CHECKED baru diunggah. Jika berubah
Document
menjadi CHECKED
(verifikasi di History
Document selesai),
dokumen dikunci permanen

(Submitter tidak dapat
melakukan
Edit/Delete/Toggle).
DESC: Tanggal dan waktu
pertama kali dokumen
diunggah.BR: Direkam
17 Created Date C 19 DTM ROW 2026-01-15 8:30:00
otomatis oleh sistem
(system timestamp) saat
dokumen berhasil diunggah.
DESC: User ID pengunggah
dokumen.BR: Direkam
otomatis oleh sistem
18 Created By C 50 APN ROW submitter1
berdasarkan User ID akun
yang sedang login saat
eksekusi pengunggahan.
DESC: Tanggal dan waktu
pembaruan dokumen
terakhir.BR: Diperbarui
otomatis oleh sistem saat
19 Update Date C 19 DTM ROW 2026-02-10 14:15:00 terjadi pengubahan
data/berkas dokumen.
Diinisialisasi sama dengan
Created Date saat pertama
diunggah.
DESC: User ID yang
melakukan pembaruan data
terakhir.BR: Diisi otomatis
oleh sistem sesuai dengan
20 Update By C 50 APN ROW submitter1
User ID yang melakukan
perubahan. Diinisialisasi
sama dengan Created By
saat pertama diunggah.
DESC: Tombol untuk melihat
detail informasi dan isi
dokumen PDF.BR: Membuka
modal detail dokumen
21 Action View O - APB BTN [Icon View]
beserta PDF Viewer dalam
mode read-only. Dapat
diakses pada status OPEN
maupun CHECKED.
DESC: Tombol untuk
mengubah data/berkas
dokumen.BR: Membuka
modal edit dokumen. Hanya
22 Action Edit O - APB BTN [Icon Edit]
aktif jika status dokumen
OPEN. Jika status
CHECKED, tombol terkunci
(disabled) dan aksi ditolak.
DESC: Kontrol untuk
mengaktifkan atau
menonaktifkan status
pemrosesan dokumen.BR:
Hanya aktif jika status
dokumen OPEN.
Toggle Active /
23 M - APB OPT Switch (On/Off) Menampilkan pop-up
Non-Active
konfirmasi sebelum status
diubah. Jika Non-Aktif,
dokumen dihentikan
sementara dari antrean
pemeriksaan AI dan
Checker.
DESC: Indikator status
Status Keaktifan
24 C 10 APB ROW Aktif / Non-Aktif operasional dokumen.BR:
Dokumen
Diperbarui secara otomatis

berdasarkan aksi dari
Toggle Active/Non-Active.
DESC: Tombol untuk
menghapus dokumen
secara permanen.BR: Hanya
aktif jika status dokumen
OPEN. Jika status
25 Action Delete O - APB BTN [Icon Delete]
CHECKED, tombol terkunci.
Jika diizinkan, memicu
modal pop-up konfirmasi
hapus permanen dari
database dan cloud storage.
DESC: Tombol konfirmasi
pada modal validasi
aksi.BR: Memproses
pembaruan status keaktifan
Pop-Up Confirm YA, UBAH STATUS / YA,
26 D - APB BTN atau penghapusan
Status / Delete HAPUS PERMANEN
permanen dokumen dan file
PDF, memperbarui UI, serta
memicu pencatatan Log
Activity.
DESC: Tombol untuk
menyimpan dokumen baru
atau pembaruan data.BR:
Memvalidasi keunikan
Button Simpan / Nama Document & format
27 M - APB BTN SIMPAN / UPDATE
Update PDF, menyimpan berkas ke
storage, memicu Engine AI
FinLens untuk pemindaian,
memperbarui UI, dan
merekam Log Activity.
DESC: Tombol untuk
menutup modal pop-up.BR:
Menghentikan proses
Button Batal /
28 O - APB BTN BATAL / [X] (Add/Edit/View/Toggle/Dele
Close
te) dan menutup modal
tanpa menyimpan
perubahan data.
DESC: Navigasi perpindahan
halaman data tabel.BR:
Membagi tampilan daftar
29 Pagination C - NUM HYP 1, 2, 3... dokumen yang diunggah
menjadi beberapa halaman
sesuai limit baris per
halaman yang ditentukan.
9.4. Action Control Submit Document
N Typ
Control Description (DESC) Business Rules (BR)
o e
* Mengarahkan tampilan ke modul Submit
Navigasi untuk berpindah ke Document Management.* Hanya memuat
Tab Menu Submit TA halaman utama pengelolaan dan menampilkan daftar dokumen yang
1
Document B pengunggahan dan daftar diunggah pada Tenant ID pengguna yang
dokumen. sedang login (terisolasi penuh dari tenant
lain).
Memicu pemfilteran daftar Memfilter baris tabel berdasarkan kata
Input Search Nama OP dokumen berdasarkan kunci nama dokumen. Jika data tidak
2
Document T pencarian teks Nama ditemukan, tabel menampilkan pesan "Data
Document File. Tidak Ditemukan".

Memfilter baris tabel sesuai tanggal
Memicu pemfilteran daftar
3  Input Range Created  OP pengunggahannya (Created Date) yang
| Date  | T  dokumen berdasarkan rentang  |     |
| ----- | ------------------------------- | --- |
masuk dalam rentang Start Date hingga
tanggal pengunggahan data.
End Date.
Memfilter baris tabel sesuai tanggal
Memicu pemfilteran daftar
4  Input Range Update  OP pembaruan terakhirnya (Update Date) yang
| Date  | T  dokumen berdasarkan rentang  |                                        |
| ----- | ------------------------------- | -------------------------------------- |
|       | tanggal pembaruan data.         | masuk dalam rentang Start Date hingga  |
End Date.
|                  | Memicu pemfilteran daftar  | Memfilter baris tabel untuk menampilkan  |
| ---------------- | -------------------------- | ---------------------------------------- |
| Dropdown Filter  | OP                         |                                          |
5  dokumen berdasarkan User ID  dokumen yang terakhir diubah oleh User ID
| Update By  | T                     |                         |
| ---------- | --------------------- | ----------------------- |
|            | eksekutor pembaruan.  | pengguna yang dipilih.  |
Memproses seluruh parameter filter yang
|     | Memicu eksekusi proses  | diisi (Search Nama Document, Range  |
| --- | ----------------------- | ----------------------------------- |
BT
6  Button Ceklis Filter  pemfilteran data tabel secara  Created Date, Range Update Date, dan
N
|     | kombinasi.  | Update By) secara bersamaan untuk  |
| --- | ----------- | ---------------------------------- |
menyaring data tabel.
Mengosongkan seluruh bidang filter
|     | BT Memicu pengembalian kriteria  | pencarian dan memuat ulang tabel untuk  |
| --- | -------------------------------- | --------------------------------------- |
7  Button Reset Filter
|     | N  filter ke kondisi awal (default).  | menampilkan seluruh daftar dokumen di  |
| --- | ------------------------------------- | -------------------------------------- |
tenant aktif.
Mengosongkan bidang Nama Document
|                 | Memicu pembukaan modal  | File, memasukkan daftar opsi Kategori File  |
| --------------- | ----------------------- | ------------------------------------------- |
| Button Add New  | BT                      |                                             |
8  form pengunggahan dokumen  aktif, mengosongkan File Picker, dan
| Document  | N          |                                          |
| --------- | ---------- | ---------------------------------------- |
|           | PDF baru.  | menampilkan informasi metadata otomatis  |
(Created Date/By dan Update Date/By).
Menentukan skema analisis dan deteksi
Memicu pemilihan
| Dropdown Select  | OP                   | anomali pada Engine AI FinLens. Pilihan  |
| ---------------- | -------------------- | ---------------------------------------- |
| 9                | pengelompokan jenis  |                                          |
Kategori File  T  kategori berkas bersumber dari data aktif di
dokumen yang diunggah.
Master Kategori File.
* Format Wajib PDF (.pdf): Berkas dengan
|                          | Memicu jendela dialog sistem  | format selain PDF otomatis ditolak oleh  |
| ------------------------ | ----------------------------- | ---------------------------------------- |
| File Picker Upload File  | BT                            |                                          |
10  lokal untuk memilih file  sistem.* Menampilkan pratinjau dokumen
| PDF  | N                            |                                     |
| ---- | ---------------------------- | ----------------------------------- |
|      | dokumen yang akan diunggah.  | secara real-time pada komponen PDF  |
Viewer di dalam modal form.
|                      | Memicu penayangan pratinjau  | Membuka jendela/komponen PDF Viewer  |
| -------------------- | ---------------------------- | ------------------------------------ |
| Hyperlink Preview /  | HY                           |                                      |
11  isi dokumen PDF secara  untuk menampilkan halaman berkas PDF
| View PDF  | P        |                       |
| --------- | -------- | --------------------- |
|           | visual.  | yang telah diunggah.  |
* Memuat seluruh informasi detail
dokumen, Kategori File, status dokumen
(OPEN / CHECKED), pratinjau PDF, dan
Memicu pembukaan modal
metadata lengkap (Created Date/By, Update
| Button View Detail  | BT pop-up detail informasi  |                                           |
| ------------------- | --------------------------- | ----------------------------------------- |
| 12                  |                             | Date/By).* Mengunci seluruh bidang input  |
| Document            | N                           |                                           |
dokumen dan PDF Viewer
|     | dalam mode read-only.  | (disabled) dan menyembunyikan tombol  |
| --- | ---------------------- | ------------------------------------- |
Simpan/Update. Aksi ini tidak memicu
pencatatan Log Activity. Dapat diakses
pada status OPEN maupun CHECKED.
* Status OPEN: Mengizinkan pengubahan
Nama Document File, Kategori File, dan
Memicu pembukaan modal
pengunggahan ulang (replace) berkas PDF.*
BT pop-up untuk mengubah data
| 13  Button Edit Document  |     | Status CHECKED: Tombol terkunci  |
| ------------------------- | --- | -------------------------------- |
N  atau mengganti berkas PDF
(disabled/locked). Aksi ditolak karena
yang dipilih.
pemeriksaan oleh User Checker telah
selesai/final.
* Status OPEN: Mengubah status keaktifan
dokumen (Aktif ↔ Non-Aktif) dan memicu
|                             | Memicu pengubahan status  | modal pop-up konfirmasi validasi. Jika  |
| --------------------------- | ------------------------- | --------------------------------------- |
| 14  Switch Toggle Active /  | OP                        |                                         |
Non-Active  T  keaktifan operasional  Non-Aktif, dokumen dihentikan sementara
dokumen.
dari antrean pemrosesan AI dan peninjauan
User Checker.* Status CHECKED: Kontrol
switch terkunci (disabled/locked).
15  Button Delete  BT Memicu proses penghapusan  * Status CHECKED: Tombol terkunci
| Document  | N                        |                                          |
| --------- | ------------------------ | ---------------------------------------- |
|           | dokumen secara permanen  | (disabled/locked). Aksi hapus ditolak.*  |

dari database dan storage Status OPEN: Memicu kemunculan modal
cloud. pop-up konfirmasi hapus permanen dari
database dan penyimpanan server.
* Memperbarui status keaktifan atau
Memicu eksekusi perubahan
menghapus record dokumen beserta
Button Konfirmasi BT status keaktifan atau
16 berkas fisik PDF dari sistem.* Memicu
Ubah Status / Delete N penghapusan permanen dari
pencatatan entri transaksi baru pada Log
modal pop-up konfirmasi.
Activity.
* Memvalidasi Nama Document File (wajib
diisi & unik), Kategori File (wajib diisi), dan
File PDF (wajib diunggah & format .pdf).*
Jika valid: Menyimpan record dan berkas
Button Simpan BT Memicu eksekusi validasi dan PDF ke cloud storage, mengeset status
17
Document N penyimpanan dokumen baru. dokumen awal ke OPEN, merekam
metadata Created Date/By & Update
Date/By otomatis, memicu Engine AI
FinLens untuk scanning, memperbarui UI,
serta merekam entri Log Activity.
* Memvalidasi status dokumen masih
OPEN serta keunikan Nama Document File
jika terdapat perubahan.* Memperbarui
Memicu eksekusi validasi dan
Button Update BT record di database, merekam Update Date
18 pembaruan dokumen yang
Document N & Update By terkini, memicu ulang
diedit.
(re-trigger) Engine AI FinLens jika ada
penggantian berkas PDF, menutup modal,
serta merekam entri Log Activity.
Menutup modal pop-up (Add, Edit, View,
Memicu pembatalan aksi dan
Button Batal / Close BT Konfirmasi Status, atau Konfirmasi Hapus)
19 penutupan modal pop-up yang
Modal N tanpa melakukan perubahan atau
sedang aktif.
penyimpanan data ke database.
* Mengarahkan tampilan tabel ke halaman
Navigasi untuk berpindah
Hyperlink Pagination HY data yang dipilih (<<, <, 1, 2, >, >>).* Mengisi
20 halaman pada tabel daftar
Number / Next / Prev P ulang baris tabel sesuai limit batas baris
data dokumen.
per halaman yang telah ditentukan.
10. History Document
10.1. Menu History Document
History Document adalah modul peninjauan dan verifikasi operasional
pada aplikasi FinLens yang digunakan oleh pengguna (User Checker) untuk
menampilkan seluruh riwayat berkas dokumen yang telah diunggah melalui
menu Submit Document, terisolasi secara otomatis berdasarkan tenant
masing-masing (Multi-Tenant Isolation).
Melalui menu ini, User Checker dapat melakukan evaluasi mendalam
terhadap hasil analisis yang dilakukan oleh Engine AI FinLens. Pada
halaman detail dokumen hasil analisis AI, hasil scanning engine AI
menampilkan daftar rekomendasi dokumen terdahulu (Identical Document
Recommendation) yang memiliki tingkat kemiripan identik, sehingga Checker
dapat mengidentifikasi serta mendeteksi potensi duplikasi berkas atau
manipulasi dokumen lama.
Setelah proses verifikasi selesai dilakukan, User Checker dapat
mengubah status dokumen dari OPEN menjadi CHECKED, yang secara
otomatis mengunci (lock) dokumen tersebut sehingga tidak dapat lagi diubah
atau dihapus oleh user submiter.

10.2. Flow History Document

Flow Detail :
1. Pembatasan Akses Multi-Tenant
- Saat User Checker mengakses menu History Document, sistem secara
otomatis mengidentifikasi Tenant ID dari akun yang sedang login.
- Query database memfilter data dengan klausul WHERE tenant_id =
current_tenant_id.
- Checker hanya dapat melihat, meninjau, dan memverifikasi dokumen
yang diunggah di lingkup tenant-nya sendiri. Data milik tenant lain tidak
ditampilkan samasekali dan tidak dapat diakses.
2. Peninjauan Detail Dokumen & Hasil Analisis AI (Review & Similarity Checking)
- User Checker memilih salah satu dokumen dari tabel untuk masuk ke
tampilan Detail History Document.
- Sistem memuat dan menyajikan informasi lengkap:
a. Metadata Dokumen: Nama Document, Kategori File, Created
Date/By, serta Update Date/By.
b. Interactive PDF Viewer: Pratinjau (preview) berkas PDF untuk
diperiksa langsung di layar tanpa harus mengunduh berkas.
c. Button Download PDF: Fasilitas untuk mengunduh berkas fisik
PDF ke penyimpanan lokal pengguna.
d. Hasil Pemindaian Anomali AI: Daftar temuan kejanggalan
dokumen beserta kriteria severity-nya.
e. Rekomendasi Dokumen Identik (Identical Document
Recommendation): Algoritma Engine AI menampilkan daftar
dokumen terdahulu yang memiliki tingkat kemiripan tinggi
(similarity match). Checker dapat mengklik rekomendasi tersebut
untuk membandingkan isi dokumen baru dengan dokumen lama
guna mendeteksi kecurangan (fraud) atau duplikasi pengajuan.
- Pengubahan Status Menjadi CHECKED (Final Verification)
a. Batas akses User Checker pada menu ini difokuskan pada
kegiatan peninjauan detail (read-only review) dan aksi
pengubahan status verifikasi.
b. Jika Checker telah selesai mereview document dan memastikan
dokumen valid/final, Checker mengklik tombol SET TO
CHECKED.
c. Eksekusi & Implikasi Sistem:
- Status dokumen di database diperbarui secara permanen
dari OPEN menjadi CHECKED.
- System secara otomatis menyimpan Update Date
(timestamp perubahan) dan Update By (User ID
Checker).
- Pembaruan status ini secara otomatis mengunci (lock)
dokumen di menu Submit Document, sehingga pengguna
pengunggah (Submitter) tidak lagi memiliki akses untuk
mengedit, mengganti file, atau menghapus dokumen
tersebut.

- History Audit Trail (Log Activity)
a. Setiap transaksi review detail (jika menjadi trigger) user checker
dapat melakukan aksi pengunduhan berkas, dan pengubahan
status dokumen menjadi CHECKED dicatat secara otomatis pada
Log Activity.
b. Log menyimpan informasi mencakup User ID Checker,
timestamp, tipe aksi (REVIEW_DOCUMENT,
DOWNLOAD_DOCUMENT, VERIFY_DOCUMENT_CHECKED), Nama
Document, serta status akhir dokumen.
10.3. UI & Field Description History Document
Desktop

Detail Fitur Komponen UI & Logika Bisnis
Berikut adalah alur proses bisnis (business flow) untuk menu History Document
pada aplikasi FinLens dari rancangan UI, batasan tenant, integrasi Engine AI,
pemeriksaan kemiripan dokumen (similarity detection), serta mekanisme finalisasi status
verifikasi oleh User Checker:
1. Akses & Pencarian Data Multi-Filter (Read Data & Filtering)
- Akses Menu: Pengguna (User Checker) membuka menu History
Document.
- Lock Tenant Otomatis
a. Sistem secara otomatis mengambil Tenant ID dari User
Checker yang sedang login.
b. Sistem memuat daftar seluruh dokumen yang pernah diunggah
melalui menu Submit Document dengan filter query WHERE
tenant_id = current_tenant_id.
c. User Checker hanya dapat mengakses dan meninjau dokumen
yang berada pada tenant sendiri (data tenant lain tidak
ditampilkan sama sekali).
- Pencarian Multi-Filter & Navigasi:
a. User Checker dapat memfilter daftar dokumen berdasarkan kata
kunci Nama Document.
b. User Checker dapat menyaring data berdasarkan Kategori File,
tingkat Severity (Clean, Low, Medium, High, Critical),
Created By, dan Update By.
c. User Checker dapat memfilter berdasarkan rentang Range
Created Date dan Range Update Date.
d. Tombol Reset Filter mengembalikan tampilan tabel ke kondisi
default (menampilkan seluruh daftar dokumen tenant aktif).
e. Tabel dilengkapi pagination (<<, <, 1, 2, 3, >, >>) untuk
memudahkan pemuatan data dalam jumlah besar.
2. Proses Review Detail Dokumen (Review & Verification Flow)
- Trigger Modal/Halaman Detail: User Checker mengklik ikon View Detail
/ Review pada baris dokumen yang ingin dievaluasi.
- Menampilkan Data & Visualisasi PDF Viewer:
a. Sistem membuka modal/halaman Detail Review & Verifikasi
Dokumen AI.
b. Sistem menampilkan Informasi Metadata Dokumen: Nama
Document, Kategori File, Status Dokumen (OPEN / CHECKED),
Hasil Severity, serta log pembuat/pengubah (Created Date/By
dan Update Date/By).
c. Sistem menyajikan file PDF di dalam komponen Preview
Dokumen (PDF Viewer) sehingga Checker dapat membaca isi
berkas tanpa perlu mengunduhnya.
- Fasilitas Download Berkas:
a. User Checker dapat mengklik tombol Download PDF File jika
memerlukan salinan berkas fisik untuk disimpan di penyimpanan
lokal.

3. Proses Analisis Hasil AI & Pembandingan Dokumen Identik (Similarity Checking)
- Review Temuan Anomali AI
a. Pada panel Analisis Anomali & Dokumen Identik, sistem
menampilkan daftar kejanggalan hasil pindaian Engine AI FinLens
yang merujuk pada kriteria Master Anomali (misal: "Selisih PPN
Tidak Sesuai Faktur", "Format Tanggal Non-Standar").
- Pemeriksaan Dokumen Identik (Identical Document Recommendation):
a. Algoritma Engine AI FinLens secara otomatis menyajikan daftar
rekomendasi dokumen lama yang diunggah sebelumnya di tenant
tersebut jika ditemukan indikasi kemiripan tingkat tinggi
(menampilkan skor persentase kemiripan, misal:
Doc_PPN_Des2025.pdf - Kemiripan 100%).
b. User Checker dapat mengklik tombol Compare / View Similarity
untuk membandingkan secara langsung (side-by-side) dokumen
baru dengan dokumen lama guna mendeteksi potensi duplikasi
pengajuan atau kecurangan (fraud).
4. Proses Finalisasi Status Verifikasi (Set to CHECKED Flow)
- Trigger Perubahan Status: Setelah proses peninjauan berkas, temuan
AI, dan pembandingan dokumen identik dinyatakan selesai, User
Checker mengklik tombol SET TO CHECKED (Verifikasi Selesai).
- Pemeriksaan Kondisi Awal:
a. Sistem mengecek status dokumen saat ini. Jika status dokumen
sudah bernilai CHECKED, tombol di-nonaktifkan.
b. Jika status masih OPEN, sistem memicu Modal Pop-Up
Konfirmasi Finalisasi Verifikasi Dokumen.
- Konfirmasi & Eksekusi System (Saat Klik Button YA, SET TO CHECKED):
a. Status dokumen di database diperbarui secara permanen dari
OPEN menjadi CHECKED.
b. Sistem secara otomatis mencatat Update Date (system
timestamp saat ini) dan Update By (User ID Checker).
c. Penguncian Akses Submitter (Dokumen Lock): Pembaruan
status menjadi CHECKED secara otomatis mengunci dokumen di
menu Submit Document. Pengguna pengunggah (Submitter)
tidak dapat lagi melakukan edit, penggantian file PDF,
penonaktifan status, maupun penghapusan permanen
terhadap dokumen tersebut.
- Respon Visual & Audit Trail:
a. Modal konfirmasi tertutup, sistem menampilkan Banner Alert
Sukses Verifikasi, dan status dokumen pada tabel utama
diperbarui menjadi CHECKED.
b. Sistem merekam entri transaksi perubahan status ke Log Activity
(VERIFY_DOCUMENT_CHECKED).

| N           | Stat Len | Tipe  Tipe   |               | Description (DESC) & Business  |
| ----------- | -------- | ------------ | ------------- | ------------------------------ |
| Field Name  |          |              | Sample Value  |                                |
| o           | us  gth  | Data  Field  |               | Rules (BR)                     |
DESC: Menampilkan nama aplikasi
FINLENS -
| Header Tenant  |       |         |         | dan konteks modul tenant.BR:      |
| -------------- | ----- | ------- | ------- | --------------------------------- |
| 1              | D  -  | APB  -  | TENANT  |                                   |
| Info           |       |         |         | Tampil permanen di bagian header  |
MANAGEMENT
atas.
DESC: Navigasi menu utama
History Document
Management.BR: Hanya
Menu History
2  D  -  APB  TAB  History Document  menampilkan daftar riwayat
Document
dokumen yang diunggah di bawah
Tenant ID pengguna yang sedang
login (terisolasi penuh).
DESC: Field pencarian data riwayat
| Search Nama  |         |           | Doc_PPN_Jan202 | dokumen.BR: Memfilter daftar  |
| ------------ | ------- | --------- | -------------- | ----------------------------- |
| 3            | O  100  | APN  TXT  |                |                               |
| Document     |         |           | 6              |                               |
dokumen di tabel berdasarkan
parameter Nama Document File.
DESC: Dropdown pilihan kategori
berkas dokumen.BR: Memfilter
4  Filter Kategori  O  50  APB  OPT  File Finance  baris tabel berdasarkan
File
pengelompokan Kategori File yang
bersumber dari Master Kategori
File.
DESC: Dropdown pilihan tingkat
keparahan anomali dokumen.BR:
Filter Severity
| 5   | O  20  | APB  OPT  | High  | Memfilter baris tabel berdasarkan  |
| --- | ------ | --------- | ----- | ---------------------------------- |
Level
opsi tingkat severity (Clean, Low,
Medium, High, Critical).
DESC: Dropdown pilihan
pengunggah dokumen.BR:
Filter Created
| 6   | O  50  | APN  OPT  | submitter1  | Memfilter daftar dokumen  |
| --- | ------ | --------- | ----------- | ------------------------- |
By
berdasarkan User ID
pembuat/pengunggah awal.
DESC: Dropdown pilihan user
peninjau/pengubah data.BR:
7  Filter Update By  O  50  APN  OPT  checker1  Memfilter daftar dokumen
berdasarkan User ID eksekutor
pembaruan/verifikasi data.
DESC: Input rentang tanggal
pengunggahan dokumen.BR:
| Range Created  |        |           | 2026-01-01 -  |                                    |
| -------------- | ------ | --------- | ------------- | ---------------------------------- |
| 8              | O  20  | DTE  TXT  |               | Memfilter daftar dokumen di tabel  |
| Date           |        |           | 2026-01-31    |                                    |
yang dibuat pada rentang tanggal
tertentu.
DESC: Input rentang tanggal
pembaruan/verifikasi dokumen.BR:
| Range Update  |        |           | 2026-02-01 -  |                                    |
| ------------- | ------ | --------- | ------------- | ---------------------------------- |
| 9             | O  20  | DTE  TXT  |               | Memfilter daftar dokumen di tabel  |
| Date          |        |           | 2026-02-28    |                                    |
yang diperbarui/diverifikasi pada
rentang tanggal tertentu.
DESC: Tombol untuk menerapkan
seluruh kriteria filter pencarian.BR:
Memproses pemfilteran data tabel
| 10  Ceklis Filter  | O  -  | APB  BTN  | [ Ceklis Filter ]  |     |
| ------------------ | ----- | --------- | ------------------ | --- |
sesuai kombinasi parameter
Search, Kategori, Severity, Created
By/Date, dan Update By/Date.
DESC: Tombol untuk menghapus
seluruh parameter filter.BR:
| 11  Reset Filter  | O  -  | APB  BTN  | [ Reset Filter ]  |     |
| ----------------- | ----- | --------- | ----------------- | --- |
Mengembalikan tampilan tabel ke
seluruh daftar riwayat dokumen
tanpa filter.
Row Data
| 12  | D  -  | APN  ROW  | `1  | Doc_PPN_Jan2026  |
| --- | ----- | --------- | --- | ---------------- |
History
Document

DESC: Nomor urut baris data
tabel.BR: Dihasilkan otomatis oleh
13 No C 5 NUM ROW 1
sistem menyesuaikan urutan data
dan nomor halaman pagination.
DESC: Nama identifikasi dokumen
Nama Doc_PPN_Jan202 yang diunggah.BR: Bersifat
14 D 100 APN ROW
Document File 6 read-only pada menu History
Document.
DESC: Pengelompokan jenis
dokumen.BR: Bersifat read-only
15 Kategori File D 50 APB ROW File Finance sesuai dengan kategori yang
dipilih pada saat pengunggahan di
menu Submit Document.
DESC: Indikator status tahapan
verifikasi dokumen oleh User
Status Checker.BR: Berstatus OPEN saat
16 C 10 APB ROW OPEN / CHECKED
Document baru ditinjau. Berubah menjadi
CHECKED setelah User Checker
melakukan finalisasi verifikasi.
DESC: Indikator tingkat risiko
tertinggi dari kejanggalan
dokumen hasil analisis AI.BR:
17 Hasil Severity C 20 APB ROW High
Ditampilkan otomatis berdasarkan
evaluasi Engine AI FinLens yang
merujuk pada Master Anomali.
DESC: Tanggal dan waktu pertama
kali dokumen diunggah.BR:
2026-01-15
18 Created Date C 19 DTM ROW Direkam otomatis oleh sistem
8:30:00
(system timestamp) dari data
Submit Document.
DESC: User ID pengunggah
dokumen.BR: Menampilkan
19 Created By C 50 APN ROW submitter1
identitas pengguna yang pertama
kali mengunggah berkas.
DESC: Tanggal dan waktu
pembaruan/verifikasi dokumen
2026-02-10 terakhir.BR: Diperbarui otomatis
20 Update Date C 19 DTM ROW
14:15:00 oleh sistem saat terjadi
pembaruan data atau saat status
diubah menjadi CHECKED.
DESC: User ID yang melakukan
pembaruan/verifikasi data
21 Update By C 50 APN ROW checker1 terakhir.BR: Diisi otomatis oleh
sistem sesuai dengan User ID yang
melakukan perubahan/verifikasi.
DESC: Tombol untuk membuka
halaman/modal detail review dan
verifikasi dokumen.BR: Membuka
Action View tampilan peninjauan detail
22 O - APB BTN [Icon View Detail]
Detail / Review mencakup metadata, PDF Viewer,
temuan anomali AI, rekomendasi
dokumen identik, serta kontrol
verifikasi status.
DESC: Komponen visualisasi
interaktif isi dokumen PDF di
dalam modal detail.BR:
PDF Viewer PDF Preview Menampilkan rendering halaman
23 D - - ROW
Component Component PDF secara utuh agar User
Checker dapat memeriksa
dokumen tanpa harus
mengunduhnya.
24 Download PDF O - APB BTN [ Download PDF DESC: Tombol untuk mengunduh

| File  |     |     | File ]  | fisik berkas PDF.BR: Memicu  |
| ----- | --- | --- | ------- | ---------------------------- |
unduhan file dokumen PDF dari
cloud storage ke media
penyimpanan lokal pengguna.
DESC: Daftar kejanggalan
|             |       |           | 1. Selisih PPN  | dokumen yang teridentifikasi oleh  |
| ----------- | ----- | --------- | --------------- | ---------------------------------- |
| 25  Temuan  | D  -  | TXT  ROW  |                 |                                    |
| Anomali AI  |       |           | Tidak Sesuai    | Engine AI.BR: Menampilkan rincian  |
|             |       |           | Faktur          | temuan anomali beserta deskripsi   |
lokasi penyimpangan dokumen.
DESC: Daftar rekomendasi berkas
terdahulu yang memiliki tingkat
| Rekomendasi  |     |     |     | kemiripan identik.BR: Menyajikan  |
| ------------ | --- | --- | --- | --------------------------------- |
Doc_PPN_Des202
26  Dokumen  D  -  APN  ROW  hasil kalkulasi kemiripan oleh AI
5.pdf (95%)
| Identik  |     |     |     | beserta skor persentase  |
| -------- | --- | --- | --- | ------------------------ |
kecocokannya untuk penelusuran
potensi duplikasi berkas.
DESC: Tombol untuk
membandingkan dokumen secara
Action Compare  [ Compare / View  langsung.BR: Membuka tampilan
| 27          | O  -  | APB  BTN  |               |     |
| ----------- | ----- | --------- | ------------- | --- |
| Similarity  |       |           | Similarity ]  |     |
pembandingan side-by-side antara
dokumen baru dengan dokumen
rekomendasi identik.
DESC: Tombol untuk
menyelesaikan dan memfinalisasi
proses verifikasi dokumen.BR:
Hanya aktif jika status dokumen
| Button Set To  |       |           | [V] SET TO  | OPEN. Memicu modal konfirmasi.  |
| -------------- | ----- | --------- | ----------- | ------------------------------- |
| 28             | M  -  | APB  BTN  |             |                                 |
| CHECKED        |       |           | CHECKED     | Mengubah status dokumen         |
menjadi CHECKED, meng-update
Update Date/By, serta mengunci
permanen akses
Edit/Delete/Toggle milik Submitter.
DESC: Tombol konfirmasi pada
modal validasi pengubahan status
ke CHECKED.BR: Memproses
| Pop-Up Confirm  |       |           | YA, SET TO  |                           |
| --------------- | ----- | --------- | ----------- | ------------------------- |
| 29              | D  -  | APB  BTN  |             | pembaruan status dokumen  |
| Set CHECKED     |       |           | CHECKED     |                           |
menjadi CHECKED di database,
mengunci dokumen, memperbarui
UI, dan merekam Log Activity.
DESC: Tombol untuk menutup
modal pop-up detail review.BR:
Button Tutup /  TUTUP / KEMBALI  Menghentikan proses peninjauan
| 30       | O  -  | APB  BTN  |        |                          |
| -------- | ----- | --------- | ------ | ------------------------ |
| Kembali  |       |           | / [X]  | dan menutup modal tanpa  |
mengubah status verifikasi
dokumen.
DESC: Navigasi perpindahan
halaman data tabel.BR: Membagi
31  Pagination  C  -  NUM  HYP  1, 2, 3...  tampilan daftar riwayat dokumen
menjadi beberapa halaman sesuai
limit baris per halaman yang
ditentukan.

| 10.4.  Action Control History Document |     |     |     |     |
| -------------------------------------- | --- | --- | --- | --- |

Typ
| No  Control  |     | Description (DESC)  |     | Business Rules (BR)  |
| ------------ | --- | ------------------- | --- | -------------------- |
e

* Mengarahkan tampilan ke modul
History Document Management.*
Navigasi untuk berpindah ke Hanya memuat dan menampilkan
Tab Menu History
1 TAB halaman utama riwayat dan daftar dokumen yang diunggah pada
Document
verifikasi dokumen. Tenant ID pengguna yang sedang
login (terisolasi penuh dari tenant
lain).
Memfilter baris tabel berdasarkan
Memicu pemfilteran daftar riwayat
Input Search Nama kata kunci nama dokumen. Jika data
2 OPT dokumen berdasarkan pencarian
Document tidak ditemukan, tabel menampilkan
teks Nama Document File.
pesan "Data Tidak Ditemukan".
Memfilter baris tabel untuk
Memicu pemfilteran daftar riwayat menampilkan dokumen sesuai
Dropdown Filter
3 OPT dokumen berdasarkan kategori kategori berkas yang dipilih
Kategori File
berkas. (bersumber dari Master Kategori
File).
Memfilter baris tabel untuk
Memicu pemfilteran daftar riwayat menampilkan dokumen berdasarkan
Dropdown Filter
4 OPT dokumen berdasarkan tingkat risiko kriteria keparahan hasil pemindaian
Severity Level
anomali. AI (Clean, Low, Medium, High, atau
Critical).
Memfilter baris tabel untuk
Memicu pemfilteran daftar riwayat
Dropdown Filter menampilkan dokumen yang
5 OPT dokumen berdasarkan User ID
Created By dibuat/diunggah oleh User ID
pengunggah awal.
Submitter yang dipilih.
Memfilter baris tabel untuk
Memicu pemfilteran daftar riwayat
Dropdown Filter menampilkan dokumen yang terakhir
6 OPT dokumen berdasarkan User ID
Update By diubah atau diverifikasi oleh User ID
eksekutor pembaruan/verifikasi.
Checker/Admin yang dipilih.
Memfilter baris tabel sesuai tanggal
Memicu pemfilteran daftar riwayat
Input Range Created pengunggahannya (Created Date)
7 OPT dokumen berdasarkan rentang
Date yang masuk dalam rentang Start
tanggal pengunggahan.
Date hingga End Date.
Memfilter baris tabel sesuai tanggal
Memicu pemfilteran daftar riwayat
Input Range Update pembaruan/verifikasi terakhirnya
8 OPT dokumen berdasarkan rentang
Date (Update Date) yang masuk dalam
tanggal pembaruan/verifikasi.
rentang Start Date hingga End Date.
Memproses seluruh parameter filter
Memicu eksekusi proses yang diisi (Search Nama, Kategori,
9 Button Ceklis Filter BTN pemfilteran data tabel secara Severity, Created By/Date, dan
kombinasi. Update By/Date) secara bersamaan
untuk menyaring data tabel.
Mengosongkan seluruh bidang filter
Memicu pengembalian kriteria filter pencarian dan memuat ulang tabel
10 Button Reset Filter BTN
ke kondisi awal (default). untuk menampilkan seluruh daftar
riwayat dokumen di tenant aktif.
* Memuat informasi detail metadata
dokumen, PDF Viewer, hasil temuan
Memicu pembukaan
Button View Detail / anomali AI, dan daftar rekomendasi
11 BTN modal/halaman detail review dan
Review dokumen identik.* Menyediakan
verifikasi dokumen.
akses pengubahan status verifikasi
dokumen bagi User Checker.
Mengunduh berkas fisik PDF
Memicu proses pengunduhan fisik
Button Download PDF dokumen yang sedang ditinjau ke
12 BTN berkas PDF dokumen dari
File media penyimpanan lokal perangkat
server/storage.
pengguna.
Membuka antarmuka pembandingan
langsung antara dokumen yang
Memicu pembukaan modal
Button Compare / sedang ditinjau dengan dokumen
13 BTN pembandingan dokumen secara
View Similarity rekomendasi yang memiliki skor
side-by-side.
kemiripan tinggi untuk pengecekan
duplikasi.

* Status OPEN: Memicu kemunculan
modal pop-up konfirmasi finalisasi
Memicu proses pengubahan dan
Button Set To verifikasi dokumen.* Status
14 BTN pemfinalisan status verifikasi
CHECKED CHECKED: Tombol terkunci
dokumen menjadi CHECKED.
(disabled) atau tersembunyi karena
verifikasi telah selesai/final.
* Memperbarui status dokumen di
database menjadi CHECKED.*
Mengisi nilai Update Date dengan
timestamp saat ini dan Update By
Memicu eksekusi pembaruan status
Button Konfirmasi Set dengan User ID Checker.* Mengunci
15 BTN dokumen menjadi CHECKED dari
To CHECKED (lock) dokumen secara permanen
modal konfirmasi.
sehingga Submitter tidak dapat lagi
melakukan Edit, Delete, atau Toggle
Status.* Memicu pencatatan entri
transaksi baru pada Log Activity.
Menutup modal pop-up (Detail
Review, Compare Similarity, atau
Memicu penutupan modal detail
Button Tutup / Konfirmasi Verifikasi) dan
16 BTN review atau modal konfirmasi yang
Kembali Modal mengembalikan tampilan ke daftar
sedang aktif.
utama tabel History Document tanpa
mengubah status data.
* Mengarahkan tampilan tabel ke
halaman data yang dipilih (<<, <, 1, 2,
Hyperlink Pagination Navigasi untuk berpindah halaman
17 HYP 3, >, >>).* Mengisi ulang baris tabel
Number / Next / Prev pada tabel daftar riwayat dokumen.
sesuai limit batas baris per halaman
yang telah ditentukan.
11. Activity Log User
11.1. Menu Activity Log User
Activity Log User adalah modul rekam jejak audit (audit trail) dan
pengawasan operasional pada aplikasi FinLens yang digunakan untuk
menyajikan seluruh riwayat aktivitas, transaksi, serta aksi yang dilakukan
oleh pengguna (User) di dalam sistem.
Setiap aktivitas pengguna—mulai dari pembuatan, pembaruan,
penonaktifan, pengunggahan dokumen, hingga verifikasi status data pada
modul Master Anomali, Master Kategori File, Submit Document, dan History
Document—dicatat secara otomatis dan sistematis oleh sistem. Modul ini
menerapkan mekanisme Multi-Tenant secara ketat, di mana pengguna
hanya dapat melihat riwayat log aktivitas dari tenant milik tenantnya sendiri,
dan data log aktivitas tenant lain tidak akan ditampilkan.

11.2. Flow Activity Log User

Flow Detail :
1. Batasan Akses Multi-Tenant
- Saat pengguna mengklik menu Activity Log User, sistem secara
otomatis mengidentifikasi Tenant ID dari akun yang sedang login.
- Query database memfilter data log dengan klausul WHERE tenant_id
= current_tenant_id.
- User hanya dapat melihat dan menelusuri riwayat aktivitas yang terjadi
pada lingkup tenant-nya sendiri. Data Activity Log milik tenant lain
terisolasi penuh dan tidak dapat diakses atau ditampilkan.
2. List Log Activity (Filtering & Search)
- User dapat mencari dan memfilter riwayat aktivitas log berdasarkan
beberapa parameter:
a. Search Keyword: Nama User, Action Type, atau Nama Modul.
b. Filter Modul Target: Master Anomali, Master Kategori File,
Submit Document, History Document, dll.
c. Filter Tipe Aksi (Action Type): CREATE, UPDATE, DELETE,
VERIFY, STATUS_CHANGE, LOGIN, dll.
d. Filter User Actor: Pilihan user di dalam tenant tersebut yang
melakukan aktivitas.
e. Range Timestamp Log: Rentang tanggal dan waktu kejadian
(Start Date/Time hingga End Date/Time).
3. Peninjauan Detail Log Activity (View Detail - Read Only)
- Pengguna mengklik ikon View Detail pada salah satu baris riwayat
aktivitas log.
- Sistem membuka modal pop-up yang menyajikan detail rincian audit
secara utuh:
a. Informasi Transaksi: ID Log, Tanggal & Waktu Kejadian (System
Timestamp).
b. Identitas User : User ID, Nama Pengguna, dan Role dari
eksekutor aksi.
c. Objek & Modul : Modul yang diakses dan Nama
Record/Dokumen target.
d. Perubahan Payload (Data Audit Trail): Menampilkan
perbandingan data sebelum diubah (Data Before) dan data
setelah diubah (Data After) untuk aktivitas pembaruan/edit.
- Proses Read-Only Tanpa Modifikasi: Modul ini bersifat immutable log
stream (hanya dapat dilihat). Pengguna tidak memiliki akses untuk
mengubah, menambah, atau menghapus entri log aktivitas guna
menjaga integritas keamanan dan kepatuhan audit sistem (compliance).

11.3. UI & Field Description Activity Log User
Desktop

Berikut adalah alur proses bisnis (business flow) menyeluruh untuk menu
Activity Log User Management pada aplikasi FinLens yang selaras dengan
rancangan wireframe, batas tenant, serta mekanisme audit jejak aktivitas (audit trail):
1. Akses & Pencarian Audit Trail (Read Data & Filtering)
- Akses Menu: Pengguna (Admin Tenant / Checker) membuka menu
Activity Log User.
- Lock Tenant Otomatis (Tenant Isolation):
a. Sistem secara otomatis mengidentifikasi Tenant ID dari
pengguna yang sedang login.
b. Sistem memuat daftar riwayat aktivitas log dengan saringan query
WHERE tenant_id = current_tenant_id.
c. User hanya dapat melihat dan menelusuri rekam jejak aktivitas
pengguna di dalam tenant miliknya sendiri. Data log milik tenant
lain tidak dapat diakses atau ditampilkan.
- Pencarian Multi-Filter & Navigasi:
a. User dapat memfilter daftar log berdasarkan kata kunci pada
kolom pencarian Search Log (Nama User, Modul Target, atau
Tipe Aksi).
b. User dapat menyaring data log secara spesifik berdasarkan
Modul Target (Master Anomali, Master Kategori File, Submit
Document, History Document, dll.).
c. User dapat menyaring log berdasarkan Action Type (CREATE,
UPDATE, DELETE, VERIFY_CHECKED, STATUS_CHANGE, LOGIN,
dll.).
d. User dapat memfilter aktivitas yang dieksekusi oleh pengguna
tertentu melalui dropdown User Actor.
e. User dapat menyaring rentang waktu kejadian log berdasarkan
Range Log Timestamp (Start Date/Time hingga End Date/Time).
f. Tombol Reset Filter mengembalikan tampilan ke kondisi default
(menampilkan seluruh daftar log activity tenant aktif).
g. Tabel dilengkapi pagination (<<, <, 1, 2, 3, >, >>) untuk membagi
ribuan entri data log per halaman.
2. Detail Audit Log (View Detail Audit Trail)
- Trigger Modal Detail: Pengguna mengklik ikon View Detail ([*]) pada
baris riwayat aktivitas log yang ingin ditinjau.
- Data Audit:
a. Sistem membuka modal Detail History Activity Log User.
b. Sistem menampilkaninformasi rincian jejak audit secara utuh yang
dikelompokkan menjadi:
- Informasi Identitas Transaksi & Aktor: Unique Log ID,
Log Timestamp (system timestamp saat eksekusi), User
Actor (User ID, Nama, Role), dan Tenant ID.
- Informasi Modul & Aksi Audit: Target Modul yang
diakses, Tipe Aksi yang dieksekusi, serta Target Record ID
/ Nama File target.
- Rincian Perubahan Data (Payload Audit Trail):
Menampilkan pembandingan data sebelum diubah (Data
Before) dan data setelah diubah (Data After) dalam
format terstruktur (JSON/Text) untuk aksi bernilai UPDATE
atau STATUS_CHANGE.

3.  Keamanan & Integritas Data (Immutable Audit Trail)
-  Data Read-Only (Hanya Lihat):
a.  Modul Activity Log User bersifat read-only (hanya baca).
b.  Pada modul ini tidak terdapat aksi Tambah (Create), Edit
(Update), maupun Hapus (Delete) data log.
-  Perlindungan Integritas Log:
a.  Seluruh entri aktivitas dipicu secara otomatis oleh sistem
(system-generated) dari aksi pengguna pada modul lain.
b.  Pengguna tidak dapat memanipulasi, memodifikasi, atau
menghapus catatan log aktivitas guna menjamin kepatuhan audit
(audit compliance) dan keamanan data tenant.
-  Penutupan Modal: Pengguna mengklik tombol TUTUP / KEMBALI atau
tombol [X] untuk menutup modal detail dan kembali ke antarmuka utama
tabel Activity Log User.

| N           | Stat Len | Tipe  Tipe   |               | Description (DESC) & Business Rules  |
| ----------- | -------- | ------------ | ------------- | ------------------------------------ |
| Field Name  |          |              | Sample Value  |                                      |
| o           | us  gth  | Data  Field  |               | (BR)                                 |
|             |          |              | FINLENS -     | DESC: Menampilkan nama aplikasi      |
Header
| 1            | D  -  | APB  -  |             |                                      |
| ------------ | ----- | ------- | ----------- | ------------------------------------ |
| Tenant Info  |       |         | TENANT      | dan konteks modul tenant.BR: Tampil  |
|              |       |         | MANAGEMENT  | permanen di bagian header atas.      |
DESC: Navigasi menu utama Activity
Log User Management.BR: Hanya
menampilkan daftar rekam jejak
| 2  Menu Activity  | D  -  | APB  TAB  | Activity Log User  |                                         |
| ----------------- | ----- | --------- | ------------------ | --------------------------------------- |
| Log User          |       |           |                    | aktivitas (audit trail) yang terdaftar  |
pada Tenant ID pengguna yang
sedang login (terisolasi penuh dari
tenant lain).
DESC: Field pencarian data riwayat
aktivitas pengguna.BR: Memfilter
3  Search Log  O  100  APN  TXT  admin1  daftar log di tabel berdasarkan
parameter Nama User, Target Modul,
atau Tipe Aksi.
DESC: Dropdown pilihan modul target
aktivitas.BR: Memfilter baris tabel
| Filter Modul  |        |           |                 | berdasarkan modul aplikasi yang  |
| ------------- | ------ | --------- | --------------- | -------------------------------- |
| 4             | O  50  | APB  OPT  | Master Anomali  |                                  |
| Target        |        |           |                 | diakses/diubah (misal: Master    |
Anomali, Master Kategori File, Submit
Document, History Document).
DESC: Dropdown pilihan jenis aksi
transaksi audit.BR: Memfilter baris
| Filter Action  |        |           |         | tabel berdasarkan tipe aksi log  |
| -------------- | ------ | --------- | ------- | -------------------------------- |
| 5              | O  30  | APB  OPT  | UPDATE  |                                  |
Type
(CREATE, UPDATE, DELETE,
VERIFY_CHECKED, STATUS_CHANGE,
LOGIN).
DESC: Dropdown pilihan pengguna
eksekutor aksi.BR: Memfilter daftar
| 6  Filter User  | O  50  | APN  OPT  | admin1  |                                   |
| --------------- | ------ | --------- | ------- | --------------------------------- |
| Actor           |        |           |         | log berdasarkan User ID pengguna  |
yang melakukan aktivitas pada tenant
aktif.
DESC: Input rentang tanggal dan
waktu kejadian log.BR: Memfilter baris
| 7  Range Log  | O  40  | DTM  TXT  | 2026-08-01 00:00 -  |                             |
| ------------- | ------ | --------- | ------------------- | --------------------------- |
| Timestamp     |        |           | 2026-08-30 23:59    | tabel sesuai rentang waktu  |
pencatatan eksekusi aktivitas (Start
Date/Time hingga End Date/Time).
DESC: Tombol untuk menerapkan
| 8  Ceklis Filter  | O  -  | APB  BTN  | [ Ceklis Filter ]  |     |
| ----------------- | ----- | --------- | ------------------ | --- |
seluruh kriteria filter pencarian.BR:

Memproses pemfilteran data tabel
secara kombinasi berdasarkan
parameter Search, Modul, Action
Type, User Actor, dan Range
Timestamp.
DESC: Tombol untuk menghapus
seluruh parameter filter.BR:
9  Reset Filter  O  -  APB  BTN  [ Reset Filter ]  Mengembalikan tampilan tabel ke
seluruh daftar riwayat log aktivitas
tanpa filter.
Row Data
| 1   | D  -  | APN  ROW  | `1  |     | 2026-08-30 14:15:00  |
| --- | ----- | --------- | --- | --- | -------------------- |
Activity Log
0
User
DESC: Nomor urut baris data tabel.BR:
| 1   |       |           |     | Dihasilkan otomatis oleh sistem  |     |
| --- | ----- | --------- | --- | -------------------------------- | --- |
| No  | C  5  | NUM  ROW  | 1   |                                  |     |
1
menyesuaikan urutan data dan nomor
halaman pagination.
DESC: Tanggal dan waktu pasti saat
| 1 Log         |        |           | 2026-08-30  | eksekusi aktivitas terjadi.BR: Direkam  |     |
| ------------- | ------ | --------- | ----------- | --------------------------------------- | --- |
|               | C  19  | DTM  ROW  |             |                                         |     |
| 2  Timestamp  |        |           | 14:15:00    |                                         |     |
secara otomatis oleh sistem (system
timestamp) dan bersifat read-only.
DESC: Identitas pengguna yang
melakukan eksekusi aksi.BR:
1
User Actor  C  50  APN  ROW  admin1 (Admin)  Menampilkan User ID dan Role dari
3
pengguna yang sedang login saat
transaksi terjadi.
DESC: Nama modul target tempat
eksekusi transaksi dilakukan.BR:
1
| Target Modul  | C  50  | APB  ROW  | Master Anomali  |                               |     |
| ------------- | ------ | --------- | --------------- | ----------------------------- | --- |
| 4             |        |           |                 | Direkam otomatis oleh sistem  |     |
berdasarkan lokasi fitur tempat aksi
dijalankan.
DESC: Jenis/kategori aksi audit
trail.BR: Menunjukkan jenis transaksi
| 1 Action Type  | C  30  | APB  ROW  | UPDATE  |                                   |     |
| -------------- | ------ | --------- | ------- | --------------------------------- | --- |
| 5              |        |           |         | yang dieksekusi (CREATE, UPDATE,  |     |
DELETE, VERIFY_CHECKED,
STATUS_CHANGE).
DESC: Alamat IP perangkat pengguna
saat melakukan eksekusi.BR:
| 1 IP Address  | C  45  | APN  ROW  | 192.168.1.105  |                                     |     |
| ------------- | ------ | --------- | -------------- | ----------------------------------- | --- |
| 6             |        |           |                | Terekam otomatis oleh sistem untuk  |     |
kebutuhan investigasi keamanan dan
pelacakan akses audit.
DESC: Tombol untuk membuka modal
detail informasi rekam jejak audit.BR:
Membuka modal pop-up yang
1 Action View
|     | O  -  | APB  BTN  | [Icon View Detail]  | menampilkan rincian metadata log,  |     |
| --- | ----- | --------- | ------------------- | ---------------------------------- | --- |
7  Detail
spesifikasi browser, target record ID,
serta perbandingan Data Before vs
Data After dalam mode read-only.
DESC: Kode unik identifikasi entri
transaksi log.BR: Dihasilkan secara
| 1   |     |     | LOG-20260830-00 |     |     |
| --- | --- | --- | --------------- | --- | --- |
Log ID  C  30  APN  ROW  otomatis oleh sistem (auto-generated
| 8   |     |     | 891  |     |     |
| --- | --- | --- | ---- | --- | --- |
primary key) saat entri log tercatat di
database.
DESC: Spesifikasi peramban dan
sistem operasi yang digunakan
| 1   |     |     | Chrome 127.0  |     |     |
| --- | --- | --- | ------------- | --- | --- |
Browser Info  C  255  APN  ROW  pengguna.BR: Ditangkap otomatis
| 9   |     |     | (Windows 11)  |     |     |
| --- | --- | --- | ------------- | --- | --- |
dari header User-Agent peramban
pengguna saat transaksi terjadi.
DESC: Identifikasi unik entri data yang
| 2 Target      |         |           | ANM-004 (Selisih  | menjadi objek perubahan.BR:  |     |
| ------------- | ------- | --------- | ----------------- | ---------------------------- | --- |
|               | C  100  | APN  ROW  |                   |                              |     |
| 0  Record ID  |         |           | PPN Faktur)       |                              |     |
Menampilkan ID dan nama record
target yang dibuat, diubah, diverifikasi,

atau dihapus.
DESC: Rekaman nilai data sebelum
| Data Before  |     |     |                     | terjadi perubahan.BR: Ditampilkan  |
| ------------ | --- | --- | ------------------- | ---------------------------------- |
| 2            |     |     | {"severity_level":  |                                    |
(Payload  C  -  TXT  ROW  pada modal detail untuk aksi bertipe
| 1       |     |     | "Medium"}  |                                  |
| ------- | --- | --- | ---------- | -------------------------------- |
| Audit)  |     |     |            | UPDATE atau STATUS_CHANGE untuk  |
menganalisis histori nilai lama.
DESC: Rekaman nilai data setelah
Data After
| 2         |       |           | {"severity_level":  | terjadi perubahan.BR: Ditampilkan     |
| --------- | ----- | --------- | ------------------- | ------------------------------------- |
| (Payload  | C  -  | TXT  ROW  |                     |                                       |
| 2         |       |           | "High"}             | pada modal detail untuk menganalisis  |
Audit)
nilai baru hasil pembaruan transaksi.
DESC: Tombol untuk menutup modal
pop-up detail log.BR: Menghentikan
| 2 Button Tutup  |       |           | TUTUP / KEMBALI  |                                      |
| --------------- | ----- | --------- | ---------------- | ------------------------------------ |
|                 | O  -  | APB  BTN  |                  | peninjauan detail dan menutup modal  |
| 3  / Kembali    |       |           | / [X]            |                                      |
kembali ke daftar utama tabel Activity
Log User.
DESC: Navigasi perpindahan halaman
data tabel.BR: Membagi tampilan
2
Pagination  C  -  NUM  HYP  1, 2, 3...  daftar riwayat aktivitas log menjadi
4
beberapa halaman sesuai limit baris
per halaman yang ditentukan.

| 11.4.  Action Control Activity Log User  |     |     |     |     |
| ---------------------------------------- | --- | --- | --- | --- |

| N        | Ty  |                     |     |                      |
| -------- | --- | ------------------- | --- | -------------------- |
| Control  |     | Description (DESC)  |     | Business Rules (BR)  |
| o        | pe  |                     |     |                      |
* Mengarahkan tampilan ke modul Activity
|     |     | Navigasi untuk berpindah ke  |     | Log User Management.* Hanya memuat  |
| --- | --- | ---------------------------- | --- | ----------------------------------- |
Tab Menu Activity  TA halaman utama pengelolaan dan  dan menampilkan daftar riwayat aktivitas
1
Log User  B  penelusuran audit trail log  yang terjadi pada Tenant ID pengguna yang
|     |     | aktivitas.  |     | sedang login (terisolasi penuh dari tenant  |
| --- | --- | ----------- | --- | ------------------------------------------- |
lain).
Memfilter baris tabel berdasarkan pencarian
|     |     | Memicu pemfilteran daftar riwayat  |     | kata kunci Nama User Actor, Target Modul,  |
| --- | --- | ---------------------------------- | --- | ------------------------------------------ |
OP
2  Input Search Log  aktivitas berdasarkan pencarian  atau Tipe Aksi. Jika data tidak ditemukan,
T
|     |     | kata kunci teks.  |     | tabel menampilkan pesan "Data Tidak  |
| --- | --- | ----------------- | --- | ------------------------------------ |
Ditemukan".
Memfilter baris tabel untuk menampilkan
|                  |     | Memicu pemfilteran daftar riwayat  |     | log aktivitas pada modul spesifik yang  |
| ---------------- | --- | ---------------------------------- | --- | --------------------------------------- |
| Dropdown Filter  | OP  |                                    |     |                                         |
3  log berdasarkan modul aplikasi  dipilih (misal: Master Anomali, Master
| Modul Target  | T   |                |     |                                       |
| ------------- | --- | -------------- | --- | ------------------------------------- |
|               |     | yang diakses.  |     | Kategori File, Submit Document, atau  |
History Document).
Memfilter baris tabel berdasarkan tipe aksi
Memicu pemfilteran daftar riwayat
| Dropdown Filter  | OP  |                                 |     | transaksi audit yang dipilih (CREATE,  |
| ---------------- | --- | ------------------------------- | --- | -------------------------------------- |
| 4                |     | log berdasarkan kategori jenis  |     |                                        |
| Action Type      | T   |                                 |     | UPDATE, DELETE, VERIFY_CHECKED,        |
aksi audit.
STATUS_CHANGE, LOGIN).
|                  |     | Memicu pemfilteran daftar riwayat  |     | Memfilter baris tabel untuk menampilkan  |
| ---------------- | --- | ---------------------------------- | --- | ---------------------------------------- |
| Dropdown Filter  | OP  |                                    |     |                                          |
5  log berdasarkan User ID pengguna  seluruh log aktivitas yang dieksekusi oleh
| User Actor  | T   |             |     |                                           |
| ----------- | --- | ----------- | --- | ----------------------------------------- |
|             |     | eksekutor.  |     | pengguna tertentu di dalam tenant aktif.  |
Memfilter baris tabel sesuai waktu
Memicu pemfilteran daftar riwayat
| 6  Input Range Log  | OP  |     |     | pencatatan eksekusi aktivitas (Log  |
| ------------------- | --- | --- | --- | ----------------------------------- |
log berdasarkan rentang tanggal
| Timestamp  | T   |     |     | Timestamp) yang masuk dalam rentang  |
| ---------- | --- | --- | --- | ------------------------------------ |
dan waktu kejadian.
Start Date/Time hingga End Date/Time.
Memproses seluruh parameter filter yang
|                          |     | Memicu eksekusi proses         |     | diisi (Search Log, Modul Target, Action Type,  |
| ------------------------ | --- | ------------------------------ | --- | ---------------------------------------------- |
| 7  Button Ceklis Filter  | BT  |                                |     |                                                |
|                          |     | pemfilteran data tabel secara  |     | User Actor, dan Range Log Timestamp)           |
N
|     |     | kombinasi.  |     | secara bersamaan untuk menyaring data  |
| --- | --- | ----------- | --- | -------------------------------------- |
tabel.

Mengosongkan seluruh bidang filter
BT Memicu pengembalian kriteria pencarian dan memuat ulang tabel untuk
8 Button Reset Filter
N filter ke kondisi awal (default). menampilkan seluruh daftar riwayat log
aktivitas di tenant aktif.
* Memuat seluruh informasi rinci audit
mencakup Log ID, Log Timestamp, User
Actor, IP Address, Browser Info, Target
Modul, Action Type, Target Record ID, serta
Memicu pembukaan modal
Button View Detail BT perbandingan Data Before vs Data After.*
9 pop-up rincian detail audit trail
Log Activity N Seluruh tampilan di dalam modal bersifat
dari baris log yang dipilih.
read-only (hanya baca). Modul ini tidak
menyediakan tombol Edit, Tambah, atau
Hapus untuk menjaga integritas audit
(compliance).
Menutup modal pop-up detail log dan
Memicu penutupan modal pop-up
Button Tutup / BT mengembalikan tampilan ke tabel utama
10 detail audit trail log yang sedang
Kembali Modal N Activity Log User Management tanpa
aktif.
mengubah kondisi data.
* Mengarahkan tampilan tabel ke halaman
Hyperlink Navigasi untuk berpindah
HY data yang dipilih (<<, <, 1, 2, 3, >, >>).*
11 Pagination Number halaman pada tabel daftar riwayat
P Mengisi ulang baris tabel sesuai limit batas
/ Next / Prev log aktivitas.
baris per halaman yang telah ditentukan.
12. Halaman Dashboard
12.1. Menu Dashboard
Dashboard adalah halaman utama dan pusat pemantauan visual
(monitoring hub) pada aplikasi FinLens yang menyajikan ringkasan data,
metrik performa analisis Engine AI, serta status verifikasi dokumen secara
real-time berbasis tenant pengguna (Multi-Tenant Isolation).
Halaman Dashboard dirancang untuk memberikan gambaran eksekutif
mengenai kondisi dokumen finansial dan legal melalui beberapa komponen
utama:
1. Menampilkan metrik Jumlah Total Document, Jumlah Document
Status OPEN, dan Jumlah Document Status CHECKED.
2. Persentase Status: Menyajikan rasio persentase dokumen yang
berstatus OPEN vs CHECKED untuk memantau progres beban kerja tim
Checker.
3. Grafik Batang "Distribusi Anomaly Score": Visualisasi diagram batang
untuk memetakan sebaran tingkat keparahan dokumen. Sumbu Y
menggambarkan skala kuantitas (0, 400, 800, 1200, 1600) dan sumbu X
menampilkan tingkatan Severity (Clean, Low, Medium, High,
Critical).
4. Metrik & Grafik Donat Dokumen Tanpa Nomor (No. Document
Detection): Menampilkan informasi total dokumen yang tidak memiliki
No. Document beserta perbandingannya terhadap total keseluruhan
dokumen, yang juga divisualisasikan melalui Grafik Donat (Persentase
Dokumen Dengan No. Document vs Tanpa No. Document).
5. Tabel List Dokumen Tanpa No. Document: Menyajikan daftar rincian
dan jumlah dokumen yang terdeteksi tidak memiliki Nomor Dokumen
berdasarkan hasil ekstraksi otomatis oleh Engine AI FinLens untuk
memudahkan penelusuran dan tindakan korektif cepat.

12.2. Flow Dashboard

Flow Detail :
1. Pembatasan Akses Multi-Tenant
- Saat user mengakses halaman Dashboard, sistem secara otomatis
membaca Tenant ID dari akun yang sedang login.
- Pengguna hanya melihat visualisasi grafik, metrik summary, dan tabel
dokumen milik tenant-nya sendiri. Data tenant lain tidak dapat diakses
atau ditampilkan.
2. Data Default & Kalkulasi Grafik/Matrik Summary
- Kondisi Awal (Default): Parameter filter tanggal diset ke All Time
(menampilkan kalkulasi dari seluruh dokumen yang pernah diunggah).
- Sistem melakukan kalkulasi metrik secara otomatis:
a. Metrik & Persentase : Membaca total akumulasi dokumen,
menghitung total serta persentase rasio dokumen berstatus OPEN
vs CHECKED.
b. Grafik Batang "Distribusi Anomaly Score": Menghitung
sebaran dokumen hasil analisis Engine AI FinLens ke dalam 5
kategori Severity (Clean, Low, Medium, High, Critical)
dengan rentang sumbu Y ber-skala (0, 400, 800, 1200, 1600).
c. Analisis No. Document & Grafik Donat: Menghitung jumlah dan
persentase perbandingan dokumen yang terdeteksi memiliki
Nomor Dokumen (With No. Document) versus dokumen yang
tidak memiliki Nomor Dokumen (Without No. Document).
d. Tabel List Dokumen Tanpa No. Document: Menampilkan daftar
rincian dan total akumulasi berkas yang diidentifikasi oleh Engine
AI tidak memiliki Nomor Dokumen.
3. Interaksi Filter & Refresh data
- Filter Range Date Submit Document:
a. Pengguna dapat memilih tanggal awal (Start Date) dan tanggal
akhir (End Date) pengunggahan dokumen.
b. Saat diterapkan, sistem mengkalkulasi ulang seluruh metrik
summary, grafik batang, grafik donat, dan tabel daftar dokumen
berdasarkan rentang tanggal tersebut.
- Button Refresh Data:
a. Pengguna mengklik tombol Refresh Data untuk memicu
pembaruan data visual secara real-time tanpa mengulang muat
(reload) seluruh halaman web. Sistem mengambil data terbaru
dari database dan hasil pemindaian Engine AI.

12.3. UI & Field Description Dashboard
Desktop
Fitur Utama UI Dashboard :
1. Komponen Header & Control Filter:
- Range Date Submit Document : Memungkinkan filter data dashboard
berdasarkan kurun waktu tertentu.
- Button Refresh Data : Memperbarui seluruh metrik summary, grafik, dan
baris tabel secara real-time dari database dan hasil pindaian Engine AI.
2. Statistik Metrik & Rasio Persentase:
- Metric Summary : Menampilkan Total Document, Total OPEN, Total
CHECKED, serta Tanpa No. Document beserta angka pembandingnya
terhadap total keseluruhan.
- Bar Chart Status: Visualisasi persentase rasio perbandingan dokumen
OPEN (misal 40%) vs CHECKED (misal 60%).
3. Visual Grafik :
- Grafik Batang (Distribusi Anomaly Score): Menampilkan frekuensi
dokumen dengan Sumbu Y bertingkat (0, 400, 800, 1200, 1600) dan
Sumbu X berupa 5 skala Severity (Clean, Low, Medium, High,
Critical).
- Grafik Donat (Kelengkapan No. Document): Membandingkan
persentase dokumen yang terdeteksi memiliki Nomor Dokumen vs
dokumen yang tanpa Nomor Dokumen.

4.  Tabel List Dokumen Tanpa No. Document :
-  Menampilkan rincian dokumen yang teridentifikasi oleh Engine AI tidak
memiliki Nomor Dokumen, lengkap dengan jumlah akumulasinya, status
dokumen, serta akses navigasi langsung (Action View) ke modul review.

| N           | Stat Len | Tipe  Tipe   |               | Description (DESC) & Business  |
| ----------- | -------- | ------------ | ------------- | ------------------------------ |
| Field Name  |          |              | Sample Value  |                                |
| o           | us  gth  | Data  Field  |               | Rules (BR)                     |
DESC: Menampilkan nama aplikasi
FINLENS -
| Header Tenant  |       |         |         | dan konteks modul tenant.BR:      |
| -------------- | ----- | ------- | ------- | --------------------------------- |
| 1              | D  -  | APB  -  | TENANT  |                                   |
| Info           |       |         |         | Tampil permanen di bagian header  |
MANAGEMENT
atas.
DESC: Navigasi menu utama
Executive Dashboard.BR:
Menu
2  D  -  APB  TAB  Dashboard  Menyajikan visualisasi metrik dan
Dashboard
data yang terisolasi khusus untuk
Tenant ID pengguna yang login.
DESC: Input rentang tanggal
pengunggahan dokumen.BR:
Memfilter seluruh kalkulasi metrik,
| Filter Submit  |        |           | 2026-08-01 -  |                              |
| -------------- | ------ | --------- | ------------- | ---------------------------- |
| 3              | O  20  | DTE  TXT  |               |                              |
| Date           |        |           | 2026-08-31    | grafik, dan tabel dashboard  |
berdasarkan kurun waktu tanggal
pembuatan dokumen. Default
bernilai seluruh data (All Time).
DESC: Tombol untuk menerapkan
filter rentang tanggal
| Button Ceklis  |       |           |             | pengunggahan.BR: Memproses      |
| -------------- | ----- | --------- | ----------- | ------------------------------- |
| 4              | O  -  | APB  BTN  | [ Ceklis ]  |                                 |
| Filter         |       |           |             | ulang kalkulasi data dashboard  |
sesuai parameter Filter Submit
Date yang diinput.
DESC: Tombol untuk memperbarui
seluruh data dashboard secara
| Button Refresh  |       |           |                   | real-time.BR: Mengambil ulang   |
| --------------- | ----- | --------- | ----------------- | ------------------------------- |
| 5               | O  -  | APB  BTN  | [ REFRESH DATA ]  |                                 |
| Data            |       |           |                   | data terbaru dari database dan  |
pindaian Engine AI tanpa memuat
ulang seluruh halaman web.
DESC: Kartu metrik total seluruh
dokumen yang diunggah.BR:
| Total Document  |        |           |        | Menampilkan akumulasi total  |
| --------------- | ------ | --------- | ------ | ---------------------------- |
| 6               | C  10  | NUM  ROW  | 1,500  |                              |
Card
dokumen pada tenant aktif
berdasarkan filter tanggal yang
diterapkan.
DESC: Kartu metrik total dokumen
berstatus OPEN.BR: Menampilkan
| 7  Total Document  | C  10  | NUM  ROW  | 600  |                               |
| ------------------ | ------ | --------- | ---- | ----------------------------- |
| Open Card          |        |           |      | akumulasi dokumen yang masih  |
membutuhkan peninjauan dan
verifikasi oleh User Checker.
DESC: Kartu metrik total dokumen
berstatus CHECKED.BR:
| 8  Total Document  | C  10  | NUM  ROW  | 900  |     |
| ------------------ | ------ | --------- | ---- | --- |
Menampilkan akumulasi dokumen
Checked Card
yang telah selesai diverifikasi dan
dikunci permanen.
DESC: Kartu metrik total dokumen
yang terdeteksi tidak memiliki
Nomor Dokumen.BR:
Total Tanpa No.
| 9   | C  20  | APN  ROW  | 150 / 1,500  | Menampilkan jumlah dokumen  |
| --- | ------ | --------- | ------------ | --------------------------- |
Doc Card
tanpa No. Document beserta
perbandingannya terhadap total
keseluruhan dokumen tenant.
10  Progres Status  C  10  APN  ROW  `40% OPEN  60% CHECKED`

Verifikasi Bar
DESC: Visualisasi diagram batang
distribusi tingkat keparahan
anomali dokumen.BR: Sumbu Y
Grafik Batang  Diagram Batang  bertingkat (0, 400, 800, 1200,
| 11             | C  -  | APN  ROW  |           |     |
| -------------- | ----- | --------- | --------- | --- |
| Anomaly Score  |       |           | Severity  |     |
1600) menggambarkan frekuensi,
dan Sumbu X menampilkan 5
tingkatan Severity (Clean, Low,
Medium, High, Critical).
DESC: Visualisasi diagram donat
rasio kelengkapan Nomor
Dokumen.BR: Menampilkan
| Grafik Donat  |       |           | Diagram Donat  | persentase perbandingan      |
| ------------- | ----- | --------- | -------------- | ---------------------------- |
| 12            | C  -  | APN  ROW  |                |                              |
| No. Document  |       |           | (90% vs 10%)   | dokumen yang memiliki Nomor  |
Dokumen (With No. Doc) vs
dokumen tanpa Nomor Dokumen
(Without No. Doc).
Row Dokumen
| 13  | D  -  | APN  ROW  | `1  | Invoice_Vendor_Unknown  |
| --- | ----- | --------- | --- | ----------------------- |
Tanpa No. Doc
DESC: Nomor urut baris data tabel
dokumen tanpa Nomor
| 14  No  | C  5  | NUM  ROW  | 1   | Dokumen.BR: Dihasilkan otomatis  |
| ------- | ----- | --------- | --- | -------------------------------- |
oleh sistem menyesuaikan urutan
data dan pagination.
DESC: Nama dokumen yang
terdeteksi tidak memiliki Nomor
| Nama           |         |           | Invoice_Vendor_U |                                 |
| -------------- | ------- | --------- | ---------------- | ------------------------------- |
| 15             | D  100  | APN  ROW  |                  | Dokumen.BR: Bersifat read-only  |
| Document File  |         |           | nknown           |                                 |
sesuai dengan data pengunggahan
awal.
DESC: Pengelompokan jenis
dokumen.BR: Bersifat read-only
| 16  Kategori File  | D  50  | APB  ROW  | File Finance  |     |
| ------------------ | ------ | --------- | ------------- | --- |
sesuai dengan kategori berkas
yang terpilih.
DESC: Tanggal dan waktu
|                   |        |           | 2026-08-28  | pengunggahan dokumen.BR:    |
| ----------------- | ------ | --------- | ----------- | --------------------------- |
| 17  Created Date  | C  19  | DTM  ROW  |             |                             |
|                   |        |           | 10:15:00    | Menampilkan timestamp saat  |
dokumen diunggah ke sistem.
DESC: Indikator status verifikasi
18  Status  C  10  APB  ROW  OPEN / CHECKED  dokumen.BR: Menunjukkan status
| Document  |     |     |     | tahapan verifikasi dokumen saat  |
| --------- | --- | --- | --- | -------------------------------- |
ini (OPEN atau CHECKED).
DESC: Tombol akses langsung ke
halaman detail review
| Action View  |       |           |                     | dokumen.BR: Mengarahkan     |
| ------------ | ----- | --------- | ------------------- | --------------------------- |
| 19           | O  -  | APB  BTN  | [Icon View Detail]  |                             |
| Detail       |       |           |                     | pengguna langsung ke modul  |
peninjauan dokumen PDF Viewer
dan verifikasi.
DESC: Navigasi perpindahan
halaman tabel dokumen tanpa No.
Document.BR: Membagi tampilan
| 20  Pagination  | C  -  | NUM  HYP  | 1, 2, 3...  |     |
| --------------- | ----- | --------- | ----------- | --- |
daftar rincian dokumen menjadi
beberapa halaman sesuai limit
baris per halaman.

12.4.  Action Control Dashboard

| N        | Typ                 |                      |
| -------- | ------------------- | -------------------- |
| Control  | Description (DESC)  | Business Rules (BR)  |
| o        | e                   |                      |
* Mengarahkan tampilan ke antarmuka
|     | Navigasi untuk           | Dashboard utama.* Memuat dan menyajikan         |
| --- | ------------------------ | ----------------------------------------------- |
|     | TA berpindah ke halaman  | data visualisasi, kartu metrik, dan tabel yang  |
1  Tab Menu Dashboard
|     | B  utama Executive  | terisolasi khusus untuk Tenant ID pengguna  |
| --- | ------------------- | ------------------------------------------- |
|     | Dashboard.          | yang sedang login (terisolasi penuh dari    |
tenant lain).
Menjadi parameter acuan waktu untuk
Memicu penentuan
memfilter seluruh metrik akumulasi, grafik
rentang tanggal
|                              | OP                    | distribusi severity, grafik donat kelengkapan  |
| ---------------------------- | --------------------- | ---------------------------------------------- |
| 2  Input Filter Submit Date  | pengunggahan dokumen  |                                                |
|                              | T                     | dokumen, dan tabel rincian dokumen tanpa       |
(Start Date hingga End
|     | Date).  | Nomor Dokumen. Default bernilai seluruh data  |
| --- | ------- | --------------------------------------------- |
(All Time).
Memproses ulang seluruh kalkulasi kartu
Memicu eksekusi
metrik, merender ulang Grafik Batang
penyaringan data
3  Button Ceklis Filter  BT "Distribusi Anomaly Score", Grafik Donat No.
N  dashboard berdasarkan
Document, serta memfilter isi tabel dokumen
rentang tanggal yang
tanpa No. Document sesuai Filter Submit
dipilih.
Date.
Memicu pembaruan
Mengambil ulang (re-query) data terkini dari
seluruh data visualisasi
4  Button Refresh Data  BT database dan hasil pindaian Engine AI FinLens
dan metrik dashboard
|     | N   | tanpa memuat ulang (reload) seluruh halaman  |
| --- | --- | -------------------------------------------- |
secara langsung
web.
(real-time).
Memicu sorotan (hover)
|                        | atau interaksi klik pada  | Menampilkan tooltip rincian jumlah pasti  |
| ---------------------- | ------------------------- | ----------------------------------------- |
| Interactive Bar Chart  | HY                        |                                           |
5  batang tingkatan  dokumen pada kategori severity yang dipilih
| (Distribusi Anomaly Score)  | P                       |                                            |
| --------------------------- | ----------------------- | ------------------------------------------ |
|                             | keparahan (Clean, Low,  | saat kursor berada di atas batang grafik.  |
Medium, High, Critical).
Memicu sorotan (hover)
Menampilkan tooltip persentase dan jumlah
atau interaksi klik pada
| Interactive Donut Chart  | HY                   | nominal dokumen sesuai segmen  |
| ------------------------ | -------------------- | ------------------------------ |
| 6                        | segmen grafik donat  |                                |
(Rasio No. Document)  P  kelengkapan Nomor Dokumen yang ditunjuk
(With No. Doc vs
kursor.
Without No. Doc).
Memicu pembukaan
Mengarahkan pengguna langsung ke tampilan
modal/halaman
detail PDF Viewer dan modul review dokumen
| Button View Detail     | BT peninjauan detail   |                                           |
| ---------------------- | ---------------------- | ----------------------------------------- |
| 7                      |                        | untuk melakukan evaluasi atau verifikasi  |
| Dokumen Tanpa No. Doc  | N  dokumen dari tabel  |                                           |
berkas yang terdeteksi tidak memiliki Nomor
|     | rincian dokumen tanpa  | Dokumen.  |
| --- | ---------------------- | --------- |
Nomor Dokumen.
* Mengarahkan tampilan tabel dokumen tanpa
Navigasi untuk
No. Document ke halaman data yang dipilih
| Hyperlink Pagination  | HY berpindah halaman pada  |                                                      |
| --------------------- | -------------------------- | ---------------------------------------------------- |
| 8                     |                            | (<<, <, 1, 2, 3, >, >>).* Mengisi ulang baris tabel  |
| Number / Next / Prev  | P                          |                                                      |
tabel daftar dokumen
|     | tanpa No. Document.  | sesuai limit batas baris per halaman yang  |
| --- | -------------------- | ------------------------------------------ |
telah ditentukan.

13. Notifikasi
13.1. Menu Notifikasi
Menu Notifikasi adalah modul pusat pemberitahuan (alerting hub) pada
aplikasi FinLens yang digunakan untuk menyajikan daftar riwayat
pemberitahuan secara real-time terkait aktivitas pengajuan dan verifikasi
dokumen.
Modul ini memfasilitasi komunikasi alur kerja antara pengguna Submitter
dan User Checker:
- Menampilkan Notifikasi: Sistem secara otomatis mengirimkan notifikasi
kepada User Checker saat Submitter berhasil mengunggah berkas
dokumen baru melalui menu Submit Document.
- Multi-Tenant : Notifikasi yang ditampilkan terikat secara penuh dengan
Tenant ID pengguna yang sedang login, sehingga notifikasi dari tenant
lain tidak akan pernah dimunculkan.
- Navigasi Langsung (Direct Action): Setiap item notifikasi bersifat
interaktif. Saat item notifikasi diklik, sistem akan langsung mengarahkan
pengguna (redirect) ke halaman Detail Review Document yang
bersangkutan untuk peninjauan berkas, hasil analisis AI, dan verifikasi
status lebih lanjut.

13.2. Flow Activity Notifikasi
Flow Detail :
1. Pembatasan Akses Multi-Tenant
- Saat user (Checker / Submitter) membuka Menu Notifikasi, sistem
secara otomatis membaca Tenant ID dari akun yang sedang login.
- Query database memfilter data pemberitahuan dengan saringan WHERE
tenant_id = current_tenant_id.
- User hanya melihat dan mengelola notifikasi yang berasal dari aktivitas
tenant nya sendiri. Notifikasi milik tenant lain tidak ditampilkan.
2. Trigger & Penerimaan Notifikasi (Event Notification Trigger)
- Setiap kali Submitter berhasil melakukan pengunggahan dokumen baru di
menu Submit Document, sistem secara otomatis membuat record
notifikasi baru untuk seluruh User Checker di tenant tersebut.
- Notifikasi secara default diset berstatus UNREAD (Belum Dibaca).

3. Filter & Pengelolaan Status Read (Filter & Mark All as Read)
- Filter Status read: Pengguna dapat menyaring daftar notifikasi
berdasarkan pilihan:
a. Show All: Menampilkan seluruh riwayat notifikasi (Read &
Unread).
b. Show Unread: Hanya menampilkan notifikasi yang belum dibaca.
c. Show Read: Hanya menampilkan notifikasi yang sudah dibaca.
- Action Mark All as Read: User dapat mengklik tombol Mark All as Read
untuk mengubah seluruh status notifikasi yang berstatus UNREAD menjadi
READ pada tenant tersebut secara instan.
4. Navigasi ke Detail Dokumen (Direct Redirection)
- Saat user mengklik salah satu item baris notifikasi:
a. Sistem secara otomatis mengubah status notifikasi tersebut
menjadi READ.
b. Sistem langsung mengarahkan pengguna (redirect) ke tampilan
Detail Review Document pada menu History Document (sesuai
Document ID yang tertaut pada notifikasi tersebut).
c. Pengguna dapat langsung meninjau metadata, berkas PDF, hasil
pemindaian AI, dan melakukan verifikasi status dokumen.
13.3. UI & Field Description Notifikasi
Desktop

Bisnis Proses :
1. Akses & Pencarian Notifikasi (Read Data & Filtering)
- Akses Menu: Pengguna (Submitter / User Checker) membuka Menu
Notifikasi.
- By Tenant
a. Sistem mengidentifikasi Tenant ID dari pengguna yang sedang
login.
b. Sistem memuat daftar notifikasi dengan query filter WHERE
tenant_id = current_tenant_id.
c. Pengguna hanya dapat melihat dan mengelola notifikasi dari
tenant miliknya sendiri. Notifikasi dari tenant lain tidak
ditampilkan.
- Pengurutan Data (Default Sorting):
a. Notifikasi ditampilkan secara berurut dari yang paling baru ke
paling lama (Descending by Notification Date / data baru berada di
urutan paling atas).
- Pencarian & Pemfilteran Multi-Kriteria:
a. Filter Status Baca: user dapat memfilter tampilan berdasarkan
pilihan All (seluruh notifikasi), Unread (belum dibaca), atau Read
(sudah dibaca).
b. Filter Range Date: user dapat memfilter waktu keterimaan
notifikasi berdasarkan tanggal awal (Start Date) dan tanggal akhir
(End Date). Secara default, filter ini menampilkan seluruh data (All
Time).
c. Tombol Ceklis Filter mengeksekusi penyaringan data tabel, dan
pagination (<<, <, 1, 2, 3, >, >>) digunakan untuk membagi
halaman data log pemberitahuan.
2. Proses Pengiriman Notifikasi (Event Trigger Notification)
- Trigger Upload Dokumen Baru: Saat Submitter berhasil mengunggah
dokumen baru pada menu Submit Document, sistem membuat record
notifikasi baru secara otomatis.
- Penentuan Penerima & Status Awal:
a. Notifikasi ditujukan kepada seluruh User Checker pada Tenant
ID yang sama.
b. Status notifikasi awal secara default di-set ke UNREAD.
c. Counter badge notifikasi belum dibaca pada header menu utama
bertambah secara real-time (misal: NOTIFIKASI (3)).
3. Proses Read Notif (Direct Redirection to Detail Document)
- Trigger Interaksi: Pengguna mengklik [ Icon View ] atau mengeklik salah
satu baris notifikasi pada tabel.
- Pembaruan Status Read :
a. Sistem mengubah status notifikasi yang diklik secara otomatis dari
UNREAD menjadi READ di database.
b. Jumlah counter badge notifikasi di sidemenu berkurang secara
otomatis.
- Direct Redirection :
a. Sistem membaca Document ID yang tertaut pada item notifikasi
tersebut.
b. Sistem mengarahkan pengguna (redirect) langsung ke antarmuka
Detail Review Document pada menu History Document.

c.  User dapat langsung meninjau PDF Viewer, metadata dokumen,
temuan anomali AI, rekomendasi dokumen identik, serta
memverifikasi status dokumen.
4.  Proses Tandai Semua Sudah Dibaca (Mark All as Read Flow)
-  Trigger Aksi Massal: Pengguna mengklik tombol [V] MARK ALL AS
READ.
-  Konfirmasi & Eksekusi Sistem:
a.  Sistem mencari seluruh notifikasi yang berstatus UNREAD pada
tenant aktif pengguna.
b.  Sistem memperbarui status seluruh notifikasi tersebut menjadi
READ secara simultan.
c.  Counter badge notifikasi belum dibaca pada sidemenu diset
menjadi 0.
-  Pembaruan Tampilan UI:
a.  Sistem me-refresh tampilan tabel Notifikasi. Seluruh label status
notifikasi pada tabel berubah menjadi [ READ ] dan muncul
Banner Alert Sukses: "Seluruh Notifikasi Berhasil Ditandai Sudah
Dibaca".

| N           | Sta Len   | Tipe  Tipe   |               | Description (DESC) & Business  |
| ----------- | --------- | ------------ | ------------- | ------------------------------ |
| Field Name  |           |              | Sample Value  |                                |
| o           | tus  gth  | Data  Field  |               | Rules (BR)                     |
DESC: Menampilkan nama
| Header Tenant  |       |         | FINLENS - TENANT  | aplikasi dan konteks modul     |
| -------------- | ----- | ------- | ----------------- | ------------------------------ |
| 1              | D  -  | APB  -  |                   |                                |
| Info           |       |         | MANAGEMENT        | tenant.BR: Tampil permanen di  |
bagian header atas.
DESC: Navigasi menu utama
Notifikasi.BR: Menampilkan
| Menu        |       |           |                 | indikator angka (badge counter)  |
| ----------- | ----- | --------- | --------------- | -------------------------------- |
| 2           | D  -  | APB  TAB  | NOTIFIKASI (3)  |                                  |
| Notifikasi  |       |           |                 | jumlah notifikasi berstatus      |
UNREAD pada tenant aktif
pengguna.
DESC: Dropdown pilihan status
pembacaan notifikasi.BR:
| Filter Status  |        |           |         | Memfilter baris tabel berdasarkan  |
| -------------- | ------ | --------- | ------- | ---------------------------------- |
| 3              | O  10  | APB  OPT  | Unread  |                                    |
Baca
opsi status All (seluruh notifikasi),
Unread (belum dibaca), atau Read
(sudah dibaca).
DESC: Input rentang tanggal
penerimaan notifikasi.BR:
Memfilter daftar notifikasi di tabel
| Range Date  |        |           | 2026-08-01 -  |                           |
| ----------- | ------ | --------- | ------------- | ------------------------- |
| 4           | O  20  | DTE  TXT  |               | yang masuk dalam rentang  |
| Notifikasi  |        |           | 2026-08-31    |                           |
tanggal tertentu. Secara default
menampilkan seluruh data (All
Time).
DESC: Tombol untuk menerapkan
kriteria filter status baca dan
| Button Ceklis  |       |           |             | rentang tanggal.BR: Memproses  |
| -------------- | ----- | --------- | ----------- | ------------------------------ |
| 5              | O  -  | APB  BTN  | [ Ceklis ]  |                                |
| Filter         |       |           |             | ulang penyaringan data tabel   |
notifikasi sesuai parameter yang
diisi.
DESC: Teks indikator total
akumulasi notifikasi dan jumlah
Total Notifikasi  Total Notifikasi: 45 Item  yang belum dibaca.BR: Dihitung
| 6        | C  50  | APN  ROW  |             |     |
| -------- | ------ | --------- | ----------- | --- |
| Counter  |        |           | (3 Unread)  |     |
otomatis oleh sistem berdasarkan
total record notifikasi pada tenant
aktif pengguna.

DESC: Tombol untuk menandai
seluruh notifikasi yang belum
dibaca menjadi sudah dibaca.BR:
Mengubah seluruh record
Button Mark All
7 O - APB BTN [V] MARK ALL AS READ notifikasi berstatus UNREAD
As Read
menjadi READ secara simultan
pada lingkup tenant aktif dan
mengeset counter badge header
menjadi 0.
Row Data
8 D - APN ROW `1 2026-08-31 15:45:00
Notifikasi
DESC: Nomor urut baris data tabel
notifikasi.BR: Dihasilkan otomatis
9 No C 5 NUM ROW 1 oleh sistem menyesuaikan urutan
data dan nomor halaman
pagination.
DESC: Tanggal dan waktu pasti
pemberitahuan dibuat oleh
1 Waktu sistem.BR: Direkam otomatis oleh
C 19 DTM ROW 2026-08-31 15:45:00
0 Notifikasi sistem (system timestamp) saat
event pengunggahan/analisis
dokumen terjadi.
DESC: Teks rincian pesan
informasi aktivitas notifikasi.BR:
Pesan / Submitter1 Menampilkan informasi nama
1
Aktivitas D 255 APN ROW mengunggah dokumen pemicu (Submitter/System AI),
1
Notifikasi "Doc_PPN_Jan2026" nama dokumen target, dan
instruksi aksi review secara
otomatis.
DESC: Indikator status
keterbacaan pesan notifikasi.BR:
Default bernilai UNREAD saat
1 Status
C 10 APB ROW UNREAD / READ notifikasi baru terbentuk. Berubah
2 Notifikasi
menjadi READ ketika notifikasi
diklik atau saat tombol Mark All
As Read dieksekusi.
DESC: Tombol/ikon untuk
membuka rincian dokumen yang
tertaut.BR: Secara otomatis
Action View mengeset status notifikasi baris
1
Detail / Direct O - APB BTN [ Icon View ] tersebut menjadi READ dan
3
Document mengarahkan (direct redirect)
pengguna langsung ke halaman
Detail Review Document di modul
History Document.
DESC: Navigasi perpindahan
halaman tabel data notifikasi.BR:
1 Membagi tampilan daftar riwayat
Pagination C - NUM HYP 1, 2, 3...
4 pemberitahuan menjadi beberapa
halaman sesuai limit baris per
halaman yang ditentukan.

13.4. Action Control Notifikasi
Typ
No Control Description (DESC) & Business Rules (BR)
e
Navigasi untuk berpindah ke halaman pusat pemberitahuan (Notification
Tab Menu Center).* Mengarahkan tampilan ke modul Notifikasi.* Memuat daftar
1 TAB
Notifikasi pemberitahuan yang terisolasi penuh khusus untuk Tenant ID pengguna yang
sedang login (terisolasi dari tenant lain).
Memicu penyaringan daftar notifikasi berdasarkan status pembacaan pesan.*
Dropdown Filter OP Memfilter baris tabel untuk menampilkan notifikasi sesuai opsi pilihan (All untuk
2
Status Baca T seluruh data, Unread untuk notifikasi belum dibaca, atau Read untuk notifikasi
sudah dibaca).
Memicu penyaringan daftar notifikasi berdasarkan rentang tanggal penerimaan
Input Range Date OP pesan.* Memfilter baris tabel sesuai waktu notifikasi masuk yang berada di
3
Notifikasi T dalam rentang Start Date hingga End Date. Secara default menampilkan seluruh
data (All Time).
Memicu eksekusi proses pemfilteran data tabel notifikasi secara kombinasi.*
BT
4 Button Ceklis Filter Memproses parameter filter Status Baca dan Range Date Notifikasi secara
N
bersamaan untuk menyaring data pada tabel utama.
Memicu perubahan status massal seluruh notifikasi yang belum dibaca menjadi
Button Mark All As BT sudah dibaca.* Mengubah semua record notifikasi berstatus UNREAD menjadi
5
Read N READ secara simultan pada lingkup tenant aktif.* Mengeset angka counter badge
notifikasi belum dibaca pada header utama menjadi 0.
Memicu pembaharuan status baris notifikasi dan pengarahan langsung (direct
redirection) ke dokumen terkait.* Mengubah status notifikasi baris tersebut
Button / Baris Item BT
6 secara otomatis dari UNREAD menjadi READ.* Mengarahkan (redirect) pengguna
View Notifikasi N
langsung ke antarmuka Detail Review Document di modul History Document
berdasarkan Document ID yang tertaut pada pesan notifikasi.
Navigasi untuk berpindah halaman pada tabel daftar riwayat notifikasi.*
Hyperlink
HY Mengarahkan tampilan tabel ke halaman data yang dipilih (<<, <, 1, 2, 3, >, >>).*
7 Pagination Number
P Mengisi ulang baris tabel sesuai limit batas baris per halaman yang telah
/ Next / Prev
ditentukan.
14. Setting Profile
14.1. Menu Setting Profile
Setting Profile adalah modul pengelolaan identitas akun dan keamanan
pengguna pada aplikasi FinLens yang digunakan untuk mengatur informasi
profil pribadi, memperbarui kredensial kata sandi, serta memantau dan
mengamankan sesi perangkat yang aktif secara mandiri.
Melalui menu ini, pengguna dapat memanfaatkan beberapa fitur utama:
1. Pengelolaan Profil: Pengguna dapat mengubah Nama Profile
pengguna, sementara informasi Email dikunci (disabled / read-only) demi
menjaga integritas data otentikasi akun.
2. Fitur Ubah Password: Fasilitas pembaruan kata sandi keamanan yang
dilengkapi dengan tiga kolom verifikasi wajib, yaitu Input Password
Lama, Input Password Baru, dan Input Ulang Password Baru guna
memastikan validitas pengubahan kredensial.
3. Manajemen Perangkat Aktif (Active Device Session Management):
Menampilkan daftar rincian informasi perangkat yang sedang terhubung
dan menggunakan akun tersebut (seperti nama perangkat, browser,
lokasi/IP, dan status sesi). Pengguna diberikan wewenang untuk
mengeluarkan (log out / terminate session) perangkat lain yang terhubung

secara individual hanya dengan mengklik informasi pada baris perangkat
yang dipilih.
14.2. Flow Activity Setting Profile
Flow Detail :
1. Pembatasan Akses Identitas Profil
- Saat user mengakses menu Setting Profile, sistem memuat data profil
secara spesifik berdasarkan User ID dan Tenant ID yang sedang
aktif.
- Informasi Email ditampilkan dalam kondisi disabled (disabled / read-only)
dan tidak dapat diedit untuk menjaga integritas kredensial otentikasi
utama.
2. ProsesPengubahan Nama Profile (Update Profile Flow)
- User mengubah data pada kolom Nama Profile.

- User mengklik tombol SIMPAN PROFIL.
- Sistem mengecek kelengkapan input (Mandatory Check). Jika valid,
nama pengguna diperbarui di database.
- Sistem menyimpan transaksi ke Log Activity (UPDATE_PROFILE) dan
menampilkan Banner Alert Sukses.
3. Proses Pengubahan Password (Change Password Flow)
- User mengisikan tiga kolom formulir: Input Password Lama, Input
Password Baru, dan Input Ulang Password Baru.
- User mengklik tombol UBAH PASSWORD.
- Validasi Keamanan Sistem:
a. Password Lama Match: Sistem menguji apakah Password Lama
yang diinput sesuai dengan hash kata sandi aktif di database. Jika
salah, proses dihentikan dengan pesan error "Password Lama
Tidak Sesuai".
b. Password Baru Difference: Password Baru tidak boleh sama
dengan Password Lama.
c. Confirmation Match: Password Baru dan Input Ulang Password
Baru harus identik.
d. Complexity Standard: Memenuhi syarat panjang minimal dan
kombinasi karakter yang ditentukan.
- Jika seluruh validasi lolos, kata sandi baru di-hash dan diperbarui di
database.
- Sistem menyimpan entri ke Log Activity (CHANGE_PASSWORD) dan
menampilkan Banner Alert Sukses Pembaruan Password.
4. Proses Manajemen Perangkat Aktif (Active Device Session Management)
- Sistem menyajikan daftar seluruh sesi perangkat yang sedang terhubung
ke akun pengguna tersebut (menampilkan nama perangkat, sistem
operasi, browser, IP Address, waktu login, dan indikator "Perangkat Ini").
- Pengguna mengklik salah satu baris Perangkat Lain yang ingin
dikeluarkan dari sistem.
- Modal Pop-up Konfirmasi Logout: Sistem menampilkan pesan validasi
"Apakah Anda yakin ingin mengeluarkan perangkat ini dari akun Anda?".
- Eksekusi Pemutusan Sesi (Terminasi Sesi):
a. Jika disetujui, token sesi (JWT/Session Token) pada perangkat
target dibatalkan (revoked/invalidated) secara seketika di server.
b. Perangkat target otomatis ter-logout ke halaman login saat
mencoba melakukan interaksi berikutnya.
- Daftar perangkat aktif pada antarmuka diperbarui, sistem merekam aksi
ke Log Activity (TERMINATE_DEVICE_SESSION), dan menampilkan
Banner Alert Sukses Logout Perangkat.

14.3. UI & Field Description Setting Profile
Desktop

Berikut adalah alur proses bisnis (business flow) menyeluruh untuk Menu Setting
Profile pada aplikasi FinLens :
1. Akses & Pemuatan Data Profil (Load User Profile Data)
- Akses Menu: User mengklik menu Setting Profile pada sidemenu
utama.
- Identifikasi Sesi Pengguna
a. Sistem membaca data kredensial dan User ID pengguna yang
sedang aktif login.
b. Sistem menampilkan antarmuka Setting Profile yang terdiri dari 3
modul utama:
- Informasi Profil Pengguna : Field Nama Profile terisi
otomatis dengan data nama aktif (status: editable),
sedangkan field Email terisi alamat email terdaftar
pengguna (status: disabled / read-only).
- Ubah Kata Sandi (Change Password): Form berisi
inputan Password Lama, Password Baru, dan Input
Ulang Password Baru.
- Daftar Sesi Perangkat Aktif: Tabel yang memuat seluruh
perangkat yang sedang menggunakan akun tersebut.
2. Proses Pengubahan Informasi Profil (Edit Profile Flow)
- Modifikasi Data : Pengguna memperbarui isi teks pada kolom Nama
Profile.
- Lock Email: Kolom Email disabled (read-only) dan tidak dapat diklik atau
diubah oleh pengguna.
- Trigger Action : User mengklik button SIMPAN PROFIL.
- Validasi & Pembaruan Sistem :
a. Sistem memvalidasi input Nama Profile (wajib diisi / tidak boleh
kosong).
b. Jika validasi lolos, sistem memperbarui nama user di database.
c. Sistem menyimpan aktivitas ke modul audit log
(UPDATE_PROFILE).
d. Sistem menampilkan Alert Sukses: "Profil Pengguna Berhasil
Diperbarui".
3. Proses Pengubahan Kata Sandi (Change Password Flow)
- Pengisian Form: Pengguna mengisikan 3 field wajib pada fitur ubah
password:
a. Password Lama : Kata sandi yang sedang digunakan saat ini.
b. Password Baru : Kata sandi baru yang ingin diterapkan.
c. Input Ulang Password Baru : Konfirmasi kata sandi baru.
- Trigger Eksekusi: Pengguna mengklik tombol [KEY] UBAH
PASSWORD.
- Validasi Keamanan Sistem (Sequential Validation):
a. Mandatory Check : Memastikan ketiga field password terisi.
b. Password Lama Match/Sama : Sistem memverifikasi kata sandi
lama terhadap hash password pengguna di database. Jika salah,
muncul pesan error "Password Lama Tidak Sesuai".
c. Password Baru Uniqueness: Password Baru tidak boleh identik
dengan Password Lama. Jika sama, muncul pesan error
"Password Baru Tidak Boleh Sama Dengan Password Lama".

d. Confirmation Match: Password Baru dan Input Ulang Password
Baru harus 100% cocok. Jika tidak sama, muncul pesan error
"Konfirmasi Password Baru Tidak Sama".
- Action Pembaruan Data :
a. Jika Proses Pembaruan Password sudah proses, sistem
meng-enkripsi (hash) kata sandi baru dan memperbaruinya di
database.
b. Form di-reset menjadi kosong, sistem merekam log aktivitas
(CHANGE_PASSWORD), dan menampilkan Banner Alert Sukses:
"Kata Sandi Berhasil Diperbarui".
4. Proses Manajemen Perangkat Aktif (Active Device Session Management Flow)
- Pengecekan Daftar Perangkat: User meninjau tabel Daftar Sesi
Perangkat Aktif yang menampilkan detail Perangkat/OS, Browser Info,
IP Address, dan Status Sesi.
- Identifikasi Perangkat Utama:
a. Baris perangkat yang sedang digunakan oleh pengguna saat ini
bertanda status [ SESI INI ] dan tombol aksinya dinonaktifkan.
- Trigger Logout Perangkat Lain (Terminate Session):
a. User memilih baris perangkat lain yang terhubung dan mengklik
tombol Logout.
- Modal Pop-Up Konfirmasi:
a. Sistem menampilkan modal pop-up konfirmasi: "Apakah Anda
yakin ingin mengeluarkan perangkat ini dari akun Anda?" beserta
detail rincian perangkat target.
- Eksekusi Pemutusan Sesi :
a. Jika pengguna mengklik BATAL, modal tertutup dan tidak ada
perubahan sesi.
b. Jika pengguna mengklik YA, KELUARKAN PERANGKAT :
- Sistem membatalkan (revoke/invalidate) token autentikasi
(JWT/Session Token) milik perangkat target di server
secara realtime.
- Perangkat target otomatis akan ter-logout secara paksa ke
halaman login utama saat melakukan aktivitas/interaksi
berikutnya.
- Baris perangkat target dihapus dari tabel Daftar Sesi
Perangkat Aktif.
- Sistem menyimpan entri transaksi action ke log aktivitas
(TERMINATE_DEVICE_SESSION) dan menampilkan
Banner Alert Sukses: "Perangkat Berhasil Dikeluarkan dari
Akun".

| N Field  | Sta Len   | Tipe  Tipe   |               |                                           |
| -------- | --------- | ------------ | ------------- | ----------------------------------------- |
|          |           |              | Sample Value  | Description (DESC) & Business Rules (BR)  |
| o  Name  | tus  gth  | Data  Field  |               |                                           |
FINLENS -
| Header  |     |     |     | DESC: Menampilkan nama aplikasi dan konteks  |
| ------- | --- | --- | --- | -------------------------------------------- |
TENANT
1  Tenant  D  -  APB  -  modul tenant.BR: Tampil permanen di bagian
MANAGEMEN
| Info  |     |     |     | header atas.  |
| ----- | --- | --- | --- | ------------- |
T
DESC: Navigasi menu utama Setting Profile &
Account Security.BR: Menyajikan pengaturan
Menu
profil, kredensial kata sandi, dan manajemen
| 2  Setting  | D  -  | APB  TAB  | Setting Profile  |     |
| ----------- | ----- | --------- | ---------------- | --- |
sesi perangkat aktif yang terisolasi khusus
Profile
untuk identitas pengguna (User ID) yang sedang
login.
DESC: Field input nama pengguna yang sedang
| Nama     |         |           |               | login.BR: Bersifat dapat diubah (editable). Wajib  |
| -------- | ------- | --------- | ------------- | -------------------------------------------------- |
| 3        | M  100  | APB  TXT  | Budi Santoso  |                                                    |
| Profile  |         |           |               | diisi (tidak boleh kosong) saat pengguna           |
menyimpan pembaruan profil.
DESC: Field alamat email akun pengguna.BR:
budi.santoso
Bersifat terkunci permanen (disabled /
| 4  Email  | D  100  | APN  TXT  | @company.co |     |
| --------- | ------- | --------- | ----------- | --- |
read-only). Pengguna tidak dapat mengubah isi
m
email ini demi alasan keamanan otentikasi.
DESC: Tombol untuk menyimpan pembaruan
| Button  |     |     |     | informasi profil.BR: Memvalidasi bahwa Nama  |
| ------- | --- | --- | --- | -------------------------------------------- |
[V] SIMPAN
5  Simpan  O  -  APB  BTN  Profile diisi, lalu meng-update data nama
PROFIL
| Profil  |     |     |     | pengguna di database dan merekam log  |
| ------- | --- | --- | --- | ------------------------------------- |
aktivitas (UPDATE_PROFILE).
DESC: Field input kata sandi yang sedang
digunakan pengguna.BR: Field berjenis rahasia
| Password  |     |     | *************** |     |
| --------- | --- | --- | --------------- | --- |
6  M  64  APN  TXT  (password input mask). Memerlukan verifikasi
| Lama  |     |     | ***  |     |
| ----- | --- | --- | ---- | --- |
kecocokan terhadap hash kata sandi aktif di
database saat pengubahan password.
DESC: Field input kata sandi baru yang ingin
diterapkan.BR: Field berjenis rahasia. Tidak
| Password  |     |     | *************** |     |
| --------- | --- | --- | --------------- | --- |
7  M  64  APN  TXT  boleh sama dengan Password Lama dan harus
| Baru  |     |     | ***  |     |
| ----- | --- | --- | ---- | --- |
memenuhi standar kompleksitas keamanan
password.
Input
DESC: Field input konfirmasi kata sandi
| Ulang  |     |     | *************** |     |
| ------ | --- | --- | --------------- | --- |
8  M  64  APN  TXT  baru.BR: Field berjenis rahasia. Harus identik
| Password  |     |     | ***  |     |
| --------- | --- | --- | ---- | --- |
100% dengan isi field Password Baru.
Baru
DESC: Tombol untuk memproses pengubahan
kata sandi pengguna.BR: Memvalidasi
Button
|          |       |           | [KEY] UBAH  | ketepatan Password Lama, kecocokan  |
| -------- | ----- | --------- | ----------- | ----------------------------------- |
| 9  Ubah  | O  -  | APB  BTN  |             |                                     |
PASSWORD
| Password  |     |     |     | Password Baru dengan Konfirmasi, serta  |
| --------- | --- | --- | --- | --------------------------------------- |
pemenuhan standar kompleksitas sebelum
memperbarui hash kata sandi di database.
Row Data
1
| Perangkat  | D  -  | APN  ROW  | `1  | Windows 11 PC  |
| ---------- | ----- | --------- | --- | -------------- |
0
Aktif
DESC: Nomor urut baris tabel perangkat
| 1   |       |           |     | aktif.BR: Dihasilkan otomatis oleh sistem  |
| --- | ----- | --------- | --- | ------------------------------------------ |
| No  | C  5  | NUM  ROW  | 1   |                                            |
| 1   |       |           |     | berdasarkan urutan daftar sesi perangkat   |
terdaftar.
DESC: Nama dan tipe sistem operasi perangkat
1 Perangkat  Windows 11  pengguna.BR: Ditangkap otomatis dari
|          | C  50  | APN  ROW  |     |                                              |
| -------- | ------ | --------- | --- | -------------------------------------------- |
| 2  / OS  |        |           | PC  | informasi User-Agent peramban atau aplikasi  |
saat sesi dibuat.
DESC: Spesifikasi peramban atau aplikasi yang
| 1 Browser  | C  50  | APN  ROW  | Chrome 127.0  |     |
| ---------- | ------ | --------- | ------------- | --- |
digunakan.BR: Ditangkap otomatis dari header
3  Info
User-Agent saat sesi login diinisiasi.

DESC: Alamat IP perangkat pengguna.BR:
| 1 IP Address  | C  45  | APN  ROW  | 192.168.1.105  |                                                |
| ------------- | ------ | --------- | -------------- | ---------------------------------------------- |
| 4             |        |           |                | Direkam oleh sistem untuk identifikasi lokasi  |
dan audit keamanan akses.
DESC: Indikator kondisi sesi perangkat.BR:
1 Status  [ SESI INI ] / [  Berisi label [ SESI INI ] untuk perangkat yang
|          | C  20  | APB  ROW  |          |     |
| -------- | ------ | --------- | -------- | --- |
| 5  Sesi  |        |           | Aktif ]  |     |
sedang digunakan aktif bertransaksi saat ini,
dan [ Aktif ] untuk perangkat terhubung lainnya.
DESC: Tombol untuk mengakhiri sesi perangkat
lain secara individual.BR: Menampilkan tombol
Action
| 1       |       |           |                   | [*] Logout pada perangkat lain yang jika diklik  |
| ------- | ----- | --------- | ----------------- | ------------------------------------------------ |
| Logout  | O  -  | APB  BTN  | [*] Logout / [-]  |                                                  |
6
| Perangkat  |     |     |     | akan memicu modal pop-up konfirmasi  |
| ---------- | --- | --- | --- | ------------------------------------ |
terminasi sesi. Berstatus disabled ([-]) pada
baris perangkat sesi saat ini.
DESC: Modal pop-up dialog konfirmasi
| Pop-up         |       |         | Modal       |                                               |
| -------------- | ----- | ------- | ----------- | --------------------------------------------- |
| 1              |       |         |             | pengeluaran perangkat.BR: Tampil saat tombol  |
|                | D  -  | APB  -  |             |                                               |
| 7  Konfirmasi  |       |         | Konfirmasi  |                                               |
| Logout         |       |         | Logout      | [*] Logout diklik untuk mengonfirmasi ulang   |
aksi pembatalan sesi (session revocation).
DESC: Tombol untuk membatalkan proses
Button
| 1      |       |           |        | pengeluaran perangkat.BR: Menutup modal  |
| ------ | ----- | --------- | ------ | ---------------------------------------- |
| Batal  | O  -  | APB  BTN  | BATAL  |                                          |
8
| Logout  |     |     |     | pop-up konfirmasi tanpa mengubah status sesi  |
| ------- | --- | --- | --- | --------------------------------------------- |
perangkat target.
DESC: Tombol eksekusi pemutusan sesi
perangkat target.BR: Membatalkan token
| Button Ya  |       |           | [!] YA,    |                                                |
| ---------- | ----- | --------- | ---------- | ---------------------------------------------- |
| 1          |       |           |            | autentikasi perangkat target di server secara  |
|            | O  -  | APB  BTN  |            |                                                |
| 9  Keluar  |       |           | KELUARKAN  |                                                |
Perangkat  PERANGKAT  seketika, mengeluarkannya dari akun, merekam
log (TERMINATE_DEVICE_SESSION), dan
memperbarui tabel sesi.

| 14.4.  Action Control Setting Profile  |     |     |     |     |
| -------------------------------------- | --- | --- | --- | --- |

| No  Control  |     | Type  | Description (DESC) & Business Rules (BR)  |     |
| ------------ | --- | ----- | ----------------------------------------- | --- |
Navigasi untuk berpindah ke halaman pengelolaan profil dan
keamanan akun.* Mengarahkan tampilan ke modul Setting
1  Tab Menu Setting Profile  TAB  Profile.* Memuat data nama profil, email (locked), formulir
password, dan daftar sesi perangkat yang terisolasi khusus untuk
User ID pengguna yang sedang login.
Memicu pengisian atau pengubahan nama pengguna pada profil
akun.* Menampung karakter teks nama profil pengguna (status:
| 2  Input Nama Profile  |     | OPT  |     |     |
| ---------------------- | --- | ---- | --- | --- |
editable).* Wajib diisi (tidak boleh kosong) saat melakukan
penyimpanan data profil.
Memicu eksekusi penyimpanan pembaruan nama pengguna.*
3  Button Simpan Profil  BTN  Memvalidasi kelengkapan isi bidang Nama Profile.* Memperbarui
data nama pengguna di database, merekam aktivitas ke log audit
(UPDATE_PROFILE), dan menampilkan pesan sukses.
Memicu pengisian kata sandi yang sedang digunakan aktif saat
ini.* Menampung masukan kata sandi lama (berjenis password
| 4  Input Password Lama  |     | OPT  |     |     |
| ----------------------- | --- | ---- | --- | --- |
input mask).* Memerlukan validasi kecocokan secara real-time
dengan hash kata sandi aktif di database saat tombol ubah
password diklik.
Memicu pengisian kata sandi baru yang ingin diterapkan pada
5  Input Password Baru  OPT  akun.* Menampung masukan kata sandi baru.* Wajib berbeda
dengan Password Lama dan harus memenuhi kriteria
kompleksitas keamanan kata sandi sistem.
Memicu pengisian ulang konfirmasi kata sandi baru.*
6  Input Ulang Password Baru  OPT  Menampung masukan konfirmasi kata sandi baru.* Harus cocok
100% (exact match) dengan karakter yang dimasukkan pada
kolom Input Password Baru.

Memicu eksekusi proses pembaruan dan enkripsi kata sandi
akun.* Memvalidasi ketepatan Password Lama, kesamaan
pasangan Password Baru & Konfirmasi, serta kepatuhan aturan
7 Button Ubah Password BTN
kompleksitas.* Meng-update hash kata sandi di database,
mematikan/mengosongkan form input, merekam log audit
(CHANGE_PASSWORD), dan menampilkan pesan sukses.
Memicu pembukaan modal dialog konfirmasi untuk mengakhiri
sesi perangkat lain secara spesifik.* Hanya aktif ([*] Logout) pada
Button Logout Perangkat
8 BTN baris perangkat lain yang terhubung.* Berstatus dinonaktifkan ([-])
(Tabel)
pada baris perangkat yang sedang digunakan aktif saat ini (SESI
INI).
Memicu penutupan dialog konfirmasi pengeluaran perangkat.*
Button Batal Logout (Modal
9 BTN Menutup modal pop-up konfirmasi tanpa mengubah atau
Pop-Up)
membatalkan sesi perangkat target.
Memicu pemutusan dan pembatalan token sesi (session
revocation) perangkat target.* Membatalkan token autentikasi
Button Ya Keluarkan Perangkat perangkat target di server secara seketika sehingga memaksa
10 BTN
(Modal Pop-Up) perangkat tersebut ter-logout.* Menghapus baris perangkat dari
tabel sesi aktif, merekam log audit
(TERMINATE_DEVICE_SESSION), dan menyegarkan tampilan UI.