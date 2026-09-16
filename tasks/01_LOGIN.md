# FinLens — Task Breakdown: Modul Login (LGN)

File ini memuat spesifikasi teknis lengkap untuk subitem dalam grup LOGIN:
1. `[LGN-01-FE]` & `[LGN-01-BE]` — Menu Login
2. `[LGN-02-FE]` & `[LGN-02-BE]` — Forgot Password
3. `[LGN-03-FE]` & `[LGN-03-BE]` — MFA Authentication

---

### [LGN-01-FE] Menu Login — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `LGN-01-FE` |
| Modul | Login / Authentication |
| Service | FE — FinLens Web App |
| Method | Page View (Halaman Login & Initial Password Modal) |
| Status | New |
| Story Point | 2 SP |
| Durasi | 8 jam (1 SP = 4 jam bersih) |
| Depends On | `LGN-01-BE` |
| Blocks | `LGN-02-FE`, `LGN-03-FE` |
| Critical Path | Yes |
| Risk Level | High |
| FSD Ref | Bab 3.1, 3.2, 3.3 — Halaman Login FinLens |

#### Deskripsi
Mengacu pada FSD Bab 3.1, 3.2, dan 3.3, Halaman Login adalah pintu masuk utama pengguna FinLens. Form memuat input Email terdaftar, input Password dengan toggle Show/Hide, tautan "Lupa Password?", dan tombol "MASUK". Frontend menangani validasi instan di browser, respon error kredensial salah / akun terkunci (3 jam), serta mengarahkan alur pengguna sesuai atribut `nextAction` dari backend (`ENROLL`, `VERIFY`, `CHANGE_PASSWORD`, atau `AUTHENTICATED`).

#### Goals
* UI Login responsif dan presisi sesuai Figma FinLens.
* Validasi format email RFC 5322 dan panjang karakter di browser sebelum request dikirim.
* Fitur Show/Hide Password dengan icon interaktif tanpa mengubah nilai input.
* Loading spinner submit, tombol disabled, pesan error inline, banner alert lockout, dan modal Create New Password (jika `must_change_password` aktif).
* Session keeping di background (auto-refresh token via cookie) dan auto-logout saat idle 60 menit.

#### Scope File
* `apps/web/src/features/lgn/pages/LoginPage.tsx`
* `apps/web/src/features/lgn/components/LoginForm.tsx`
* `apps/web/src/features/lgn/components/InitialPasswordModal.tsx`
* `apps/web/src/features/lgn/hooks/useAuth.ts`
* `apps/web/src/features/lgn/services/authService.ts`
* `apps/web/src/context/AuthContext.tsx`

#### Out of Scope
* Interaksi scan QR Code dan input 6-digit TOTP (dikerjakan di `LGN-03-FE`).
* Alur pengiriman email instruksi reset password (dikerjakan di `LGN-02-FE`).

#### Acceptance Criteria
1. Form menampilkan input Email, Password (disamarkan/masked), toggle Show/Hide, link "Lupa Password?", dan tombol "MASUK".
2. Validasi Klien: Jika Email kosong/salah format, muncul error: *"Format email tidak valid"*. Jika Password kosong: *"Kata sandi wajib diisi"*.
3. Tombol "MASUK" menampilkan loading spinner dan disabled saat request autentikasi berlangsung.
4. Jika kredensial salah (401), form tetap terisi dan muncul pesan: *"Email atau kata sandi tidak valid"*.
5. Jika akun terkunci akibat 3x salah password (429), muncul Banner Alert Error: *"Akun Anda terkunci sementara karena 3 kali kesalahan input password. Silakan coba lagi setelah 3 jam."* dan form di-disable.
6. Jika response sukses dengan `nextAction: "ENROLL"` atau `"VERIFY"`, simpan `mfaContextToken` di secure auth state dan redirect ke `/auth/mfa`.
7. Jika response sukses dengan `nextAction: "CHANGE_PASSWORD"`, buka modal pop-up wajib ubah password awal sebelum masuk dashboard.
8. Jika response `nextAction: "AUTHENTICATED"`, simpan `accessToken` di runtime state dan redirect ke `/dashboard`.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien (`LoginForm.tsx`):**
   * Ambil `visitorId` (fingerprint) dan deteksi `isPrivate` window.
   * Validasi email (RFC 5322, maks 100 char) dan password (8-64 char).
   * Jika gagal, pasang pesan error inline di bawah field terkait.
2. **Submit Payload (`useAuth.ts`):**
   * Set `isSubmitting = true`.
   * Dispatch payload `{ email, password, visitorId, isPrivate }` ke `POST /api/v1/auth/login`.
3. **Handling Response & Navigasi:**
   * Status 200:
     * `nextAction === "VERIFY"` / `"ENROLL"`: simpan `mfaContextToken`, arahkan ke `/auth/mfa`.
     * `nextAction === "CHANGE_PASSWORD"`: tampilkan `InitialPasswordModal`.
     * `nextAction === "AUTHENTICATED"`: simpan `accessToken`, aktifkan idle listener 60 menit, arahkan ke `/dashboard`.
   * Status 401 (`AUTH_INVALID`): tampilkan banner *"Email atau kata sandi tidak valid"*.
   * Status 429 (`AUTH_ACCOUNT_LOCKED`): tampilkan banner akun terkunci 3 jam.

#### Request & Response (Kontrak FE)
* **Request ke BE:**
  `{ "email": "user@example.com", "password": "ExamplePassword123!", "visitorId": "vis_8f9a2b1c4e7d", "isPrivate": false }`
* **Respon Sukses dari BE (MFA Challenge):**
  `{ "data": { "nextAction": "VERIFY", "mfaRequired": true, "mfaContextToken": "ctx_mfa_9a8b7c6d5e4f3a2b", "expiresInSeconds": 300 }, "meta": { "correlationId": "uuid" } }`

#### Notes
* Kredensial dan `accessToken` dilarang disimpan di `localStorage`/`sessionStorage`; simpan di memory runtime.
* Refresh token dikelola otomatis browser melalui secure HttpOnly cookie `finlens_refresh`.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka halaman `/login` | Form bersih, password masked, tombol Masuk aktif |
| 2 | Klik icon eye pada password | Karakter password terlihat (unmask), klik ulang kembali masked |
| 3 | Submit form kosong | Muncul error validasi inline pada field email dan password |
| 4 | Submit format email tanpa `@` | Muncul error *"Format email tidak valid"* |
| 5 | Submit kredensial salah | Muncul error *"Email atau kata sandi tidak valid"*, input email tidak hilang |
| 6 | Submit salah 3x berturut-turut | Akun terkunci 3 jam, tombol submit disabled |
| 7 | Submit kredensial valid | Redirect ke MFA atau Dashboard sesuai `nextAction` |

---

### [LGN-01-BE] Menu Login — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `LGN-01-BE` |
| Modul | Login / Authentication |
| Service | `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`, `POST /api/v1/auth/initial-password` |
| Status | New |
| Permission | `public` (login), `refresh-cookie` (refresh), `authenticated` (logout), `password-context` (initial-password) |
| Story Point | 5 SP |
| Durasi | 20 jam (1 SP = 4 jam bersih) |
| Depends On | `FND-01`, `FND-02`, `FND-03` |
| Blocks | `LGN-01-FE`, `LGN-02-BE`, `LGN-03-BE` |
| Critical Path | Yes |
| Risk Level | High |
| Target Database | `mst_user`, `mst_tenant`, `trn_user_session`, `trn_auth_context` |
| FSD / Spec Ref | Bab 3.1, 3.2 FSD & Spec API `#authlogin`, `#authrefresh`, `#authlogout`, `#completeinitialpassword` |

#### Deskripsi
Endpoint autentikasi primer, proteksi brute force (3x salah lock 3 jam), challenge MFA kontekstual, penerbitan JWT access token RS256 & rotating refresh cookie, serta pembatasan konkurensi (maksimal 5 sesi per akun dengan penggusuran sesi tertua).

#### Flow Logic (Step by Step)
1. **Validasi Request & Rate Limiting (`authLogin`):**
   * Validasi body: `email` (string, max 100, format valid), `password` (string, 8-64), `visitorId` (string).
   * Normalisasi: `email = email.trim().toLowerCase()`. Jangan trim `password`.
   * Kunci baris user (`SELECT ... FOR UPDATE`) untuk evaluasi counter failed attempt.
   * Jika `locked_until > NOW()`, tolak HTTP 429 `AUTH_ACCOUNT_LOCKED`.
2. **Pengecekan Kredensial & Status Entitas:**
   * Query user. Jika tidak ditemukan, `NON_ACTIVE`, atau soft-deleted, jalankan verifikasi hash dummy (mencegah timing attack), lalu return 401 `AUTH_INVALID`.
   * Cek status Tenant (`mst_tenant`): jika `NON_ACTIVE` atau tidak ada, return 401 `AUTH_INVALID`.
   * Verifikasi hash password:
     * Jika salah: increment `failed_attempt_count`. Jika mencapai 3, set `locked_until = NOW() + INTERVAL '3 HOURS'`. Commit dan return 401 `AUTH_INVALID`.
     * Jika benar: reset `failed_attempt_count = 0` dan `locked_until = NULL`.
3. **MFA Requirement Check & Context Issuance:**
   * Evaluasi MFA Provider:
     * Belum enroll MFA $\rightarrow$ terbitkan `mfaContextToken` (tipe `ENROLL`, TTL 300s) di `trn_auth_context`. Return 200 `nextAction: "ENROLL"`.
     * Sudah enroll MFA $\rightarrow$ terbitkan `mfaContextToken` (tipe `VERIFY`, TTL 300s). Return 200 `nextAction: "VERIFY"`.
4. **Session Issuance (Jika MFA trusted & kredensial lengkap):**
   * Jika `must_change_password = true`, terbitkan `CHANGE_PASSWORD` context (TTL 300s), return `nextAction: "CHANGE_PASSWORD"`.
   * Jika tuntas:
     * Cek sesi di `trn_user_session`. Jika $\ge 5$ sesi aktif, revoke sesi paling tua.
     * Buat record session baru di `trn_user_session` dengan `idle_timeout = 60 menit`.
     * Terbitkan Access Token (JWT RS256, 15 menit) berisi claim: `sub`, `tenant_id`, `role_id`, `sid`, `credential_version`.
     * Terbitkan Refresh Token (generation 1), simpan hash di DB, pasang cookie `finlens_refresh` (HttpOnly, Secure, SameSite=Strict, Max-Age 7 hari).
5. **Token Refresh (`authRefresh`):**
   * Baca cookie `finlens_refresh`. Tolak jika refresh token dikirim lewat body.
   * Replay Detection: jika token sudah `USED`, revoke seluruh session family user dan return 401 `AUTH_SESSION_REVOKED`.
   * Jika valid: rotate generation, update cookie, terbitkan access token baru (15 menit).
6. **Revokasi Logout (`authLogout`):**
   * Revoke session aktif di DB, clear cookie `finlens_refresh` (Max-Age=0). Return 204 No Content.
7. **Audit Trail Logging:**
   * Catat event `LOGIN_SUCCESS`, `LOGIN_FAILED`, atau `LOGOUT` di `trn_audit_log` tanpa plaintext kredensial/token.

#### Parameter Input
* **Header:** `Content-Type: application/json`
* **Request Body (POST /api/v1/auth/login):**
  `{ "email": "user@example.com", "password": "ExamplePassword123!", "visitorId": "vis_8f9a2b1c4e7d", "isPrivate": false }`

#### Response Schema
* **200 OK (MFA Challenge):**
  `{ "data": { "nextAction": "VERIFY", "mfaRequired": true, "mfaContextToken": "ctx_mfa_9a8b7c6d5e4f3a2b1c0d", "expiresInSeconds": 300 }, "meta": { "correlationId": "uuid" } }`
* **401 Unauthorized (Kredensial Salah):**
  `{ "error": { "code": "AUTH_INVALID", "message": "Email atau kata sandi tidak valid", "correlationId": "uuid" } }`
* **429 Too Many Requests (Akun Terkunci):**
  `{ "error": { "code": "AUTH_ACCOUNT_LOCKED", "message": "Akun Anda terkunci sementara karena 3 kali kesalahan input password. Silakan coba lagi setelah 3 jam.", "correlationId": "uuid" } }`
* **422 Unprocessable Entity (Validasi Format):**
  `{ "error": { "code": "VALIDATION_ERROR", "message": "Data yang dikirim tidak valid", "details": [{ "field": "email", "message": "Format email tidak valid" }] } }`

#### Notes
* Penguncian akun berlaku 10.800 detik (3 jam) sejak kegagalan ke-3.
* Access JWT wajib menyertakan `credential_version`. Perubahan password otomatis membatalkan seluruh token versi lama.

#### QC Checklist (BE / API Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | POST login tanpa body | 400 Bad Request / 422 Validation Error |
| 2 | POST login format email salah | 422 Unprocessable Entity dengan detail field error |
| 3 | POST login user non-aktif / tenant non-aktif | 401 Unauthorized (`AUTH_INVALID`) |
| 4 | POST login password salah ke-1 dan ke-2 | 401 Unauthorized, `failed_attempt_count` bertambah |
| 5 | POST login password salah ke-3 | 429 Too Many Requests, akun terkunci 3 jam |
| 6 | POST login akun valid | 200 OK dengan payload `nextAction` & context token |
| 7 | POST refresh token cookie valid | 200 OK menghasilkan accessToken baru |
| 8 | POST refresh token yang sudah used (replay) | 401 Unauthorized, seluruh sesi user direvoke |
| 9 | POST logout | 204 No Content, cookie dibersihkan, status sesi non-aktif |

---

### [LGN-02-FE] Forgot Password — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `LGN-02-FE` |
| Modul | Login / Authentication |
| Service | FE — FinLens Web App |
| Method | Page View (Halaman Request Reset & Halaman Reset Confirm) |
| Status | New |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `LGN-02-BE` |
| Blocks | `USR-03-FE`, `USR-05-FE` |
| Critical Path | No |
| Risk Level | High |
| FSD Ref | Bab 3.2, 3.3 — Forgot Password FinLens |

#### Deskripsi
Mengacu pada FSD Bab 3.2 & 3.3, modul Forgot Password terdiri atas 2 layar terpisah:
1. **Halaman Input Email (`/auth/forgot-password`):** Input email terdaftar untuk pengiriman tautan pemulihan kata sandi.
2. **Halaman Create New Password (`/auth/reset-password?token=...`):** Halaman pembuatan kata sandi baru yang dibuka melalui tautan email, dilengkapi indikator kekuatan password dan konfirmasi kata sandi.

#### Goals
* Form input email bersih dengan validasi format instan di browser.
* Respon netral saat submit request untuk mencegah penyerang memetakan akun terdaftar (*user enumeration protection*).
* Form input password baru dengan validasi real-time: minimal 8 karakter, huruf besar, huruf kecil, angka, karakter khusus, dan konfirmasi cocok.
* Error state yang jelas saat token expired/invalid dengan tombol aksi untuk meminta link baru.

#### Scope File
* `apps/web/src/features/lgn/pages/ForgotPasswordPage.tsx`
* `apps/web/src/features/lgn/pages/ResetPasswordConfirmPage.tsx`
* `apps/web/src/features/lgn/components/PasswordStrengthMeter.tsx`
* `apps/web/src/features/lgn/hooks/usePasswordReset.ts`

#### Out of Scope
* Pengiriman email langsung dari browser (email dieksekusi oleh backend worker).

#### Acceptance Criteria
1. Pengguna dapat mengklik tautan "Lupa Password?" di halaman login dan diarahkan ke `/auth/forgot-password`.
2. Saat submit email berhasil, muncul pesan sukses netral: *"Jika email terdaftar pada sistem, tautan pemulihan kata sandi telah dikirimkan ke email Anda."*
3. Halaman confirm memvalidasi keberadaan token pada query string URL. Jika tidak ada, redirect ke `/login`.
4. Input "Kata Sandi Baru" menampilkan indikator checklist persyaratan (8-64 karakter, uppercase, lowercase, number, symbol).
5. Jika "Konfirmasi Kata Sandi" tidak sama dengan "Kata Sandi Baru", muncul error inline: *"Konfirmasi kata sandi tidak cocok"*.
6. Jika token expired/invalid (422), muncul tampilan error state dengan opsi *"Kirim Ulang Permintaan Reset"*.
7. Saat password baru berhasil disimpan (204), muncul pesan sukses dan pengguna diarahkan ke halaman login setelah 3 detik.

#### Flow Logic (Step by Step)
1. **Flow Request Reset (`ForgotPasswordPage.tsx`):**
   * Validasi format email di klien (RFC 5322).
   * Kirim `POST /api/v1/auth/password-reset/request` dengan payload `{ email }`.
   * Tampilkan pesan sukses netral terlepas dari apakah email terdaftar atau tidak.
2. **Flow Confirm Reset (`ResetPasswordConfirmPage.tsx`):**
   * Ambil token dari URL (`?token=XYZ`). Jika kosong, arahkan ke `/login`.
   * Validasi input password baru (min 8, max 64 karakter, kombinasi huruf besar, huruf kecil, angka, simbol) dan kecocokan konfirmasi password.
   * Kirim `POST /api/v1/auth/password-reset/confirm` dengan payload `{ token, newPassword, confirmPassword }`.
   * Sukses: Tampilkan banner sukses dan redirect ke `/login`.

#### Request & Response (Kontrak FE)
* **Request Kirim Link:**
  `{ "email": "user@company.com" }`
* **Request Confirm Password:**
  `{ "token": "rst_9a8b7c6d5e4f3a2b1c0d", "newPassword": "NewPassword2026!", "confirmPassword": "NewPassword2026!" }`

#### Notes
* Tidak boleh menampilkan pesan error seperti *"Email tidak terdaftar"* demi melindungi privasi data user.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka form Forgot Password | Input email bersih, tombol Kirim aktif |
| 2 | Submit format email salah | Validasi inline *"Format email tidak valid"* |
| 3 | Submit email sembarang | Tampil pesan sukses netral terkirim |
| 4 | Buka confirm tanpa token | Redirect otomatis ke halaman login |
| 5 | Input password baru < 8 karakter | Checklist indikator keamanan berwarna merah |
| 6 | Input password konfirmasi beda | Muncul pesan error *"Konfirmasi kata sandi tidak cocok"* |
| 7 | Submit password valid | Muncul banner sukses dan diarahkan ke login |

---

### [LGN-02-BE] Forgot Password — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `LGN-02-BE` |
| Modul | Login / Authentication |
| Service | `POST /api/v1/auth/password-reset/request`, `POST /api/v1/auth/password-reset/confirm` |
| Status | New |
| Permission | `public` |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `LGN-01-BE`, `FND-04` |
| Blocks | `LGN-02-FE`, `USR-03-BE`, `USR-05-BE` |
| Critical Path | No |
| Risk Level | High |
| Target Database | `mst_user`, `trn_password_reset`, `trn_user_session` |
| FSD / Spec Ref | Bab 3.2, 3.3 FSD & Spec API `#authpasswordresetrequest`, `#authpasswordresetconfirm` |

#### Deskripsi
Menghasilkan token reset terenkripsi (digest aktif 30 menit), memicu outbox pengiriman email, validasi token single-use, update password hash, serta revokasi seluruh sesi aktif pengguna.

#### Flow Logic (Step by Step)
1. **Eksekusi Request Reset (`authPasswordResetRequest`):**
   * Terapkan rate limiting per IP dan per email untuk mencegah spam.
   * Cari user berdasarkan email.
   * **Proteksi Privasi:** Jika email tidak ditemukan, non-aktif, atau tenant non-aktif: tetap return HTTP 202 Accepted dengan pesan netral.
   * Jika user aktif:
     * Invalidasi seluruh token reset aktif sebelumnya di `trn_password_reset`.
     * Generate secure cryptographically random token (UUID/Hex 32-byte).
     * Simpan hash token ke `trn_password_reset` dengan `expires_at = NOW() + INTERVAL '30 MINUTES'`.
     * Terbitkan event `SEND_PASSWORD_RESET_EMAIL` ke antrean Outbox.
   * Return HTTP 202 Accepted.
2. **Eksekusi Konfirmasi Reset (`authPasswordResetConfirm`):**
   * Validasi body: `token`, `newPassword` (8-64 char, kompleksitas lengkap), `confirmPassword` (wajib sama).
   * Query token di `trn_password_reset`: pastikan token ada, `used_at IS NULL`, dan `expires_at > NOW()`. Jika tidak valid -> return 422 `RESET_TOKEN_INVALID`.
   * Pengecekan password: password baru tidak boleh sama dengan password lama di `mst_user`. Jika sama -> return 422 `PASSWORD_MUST_BE_DIFFERENT`.
   * **Transaksi Database Atomik:**
     * Hash password baru menggunakan Bcrypt/Argon2.
     * Update hash di `mst_user`, set `must_change_password = false`.
     * Increment `credential_version` pada `mst_user` (+1).
     * Set `used_at = NOW()` pada token reset terkait.
     * Revoke seluruh sesi aktif user di `trn_user_session` (otomatis membatalkan seluruh token JWT yang beredar).
     * Catat audit log `EVENT: PASSWORD_RESET_COMPLETED`.
   * Return HTTP 204 No Content.

#### Parameter Input
* **Request Body Request (`POST /api/v1/auth/password-reset/request`):**
  `{ "email": "user@company.com" }`
* **Request Body Confirm (`POST /api/v1/auth/password-reset/confirm`):**
  `{ "token": "rst_9a8b7c6d5e4f3a2b1c0d", "newPassword": "NewSecurePassword2026!", "confirmPassword": "NewSecurePassword2026!" }`

#### Response Schema
* **202 Accepted (Request Reset):**
  `{ "data": { "message": "Jika email terdaftar pada sistem, tautan pemulihan kata sandi telah dikirimkan ke email Anda." }, "meta": { "correlationId": "uuid" } }`
* **204 No Content (Confirm Reset):** *(Tanpa body)*
* **422 Unprocessable Entity (Token Expired/Invalid):**
  `{ "error": { "code": "RESET_TOKEN_INVALID", "message": "Tautan pemulihan kata sandi tidak valid atau telah kedaluwarsa." } }`
* **422 Unprocessable Entity (Password Sama):**
  `{ "error": { "code": "PASSWORD_MUST_BE_DIFFERENT", "message": "Kata sandi baru tidak boleh sama dengan kata sandi sebelumnya." } }`

#### Notes
* Token reset bersifat single-use dan hangus permanen setelah 30 menit.
* Plaintext token tidak boleh masuk ke database, outbox payload, maupun application log.

#### QC Checklist (BE / API Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | POST request email valid | 202 Accepted, record token di DB, job outbox terbit |
| 2 | POST request email tidak terdaftar | 202 Accepted (respon netral), tidak ada email keluar |
| 3 | POST confirm token acak/palsu | 422 Unprocessable Entity (`RESET_TOKEN_INVALID`) |
| 4 | POST confirm setelah 31 menit | 422 Unprocessable Entity (`RESET_TOKEN_INVALID`) |
| 5 | POST confirm password baru sama dengan lama | 422 Unprocessable Entity (`PASSWORD_MUST_BE_DIFFERENT`) |
| 6 | POST confirm valid | 204 No Content, password terupdate, sesi aktif terputus |
| 7 | POST confirm kedua kali dengan token sama | 422 Unprocessable Entity (mencegah replay attack) |

---

### [LGN-03-FE] MFA Authentication — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `LGN-03-FE` |
| Modul | Login / Authentication |
| Service | FE — FinLens Web App |
| Method | Screen View (MFA Setup QR & Form Input 6-Digit TOTP / Recovery Code) |
| Status | New |
| Story Point | 2 SP |
| Durasi | 8 jam (1 SP = 4 jam bersih) |
| Depends On | `LGN-03-BE` |
| Blocks | Seluruh Task FE pasca-login (`TEN-01-FE`, `ROL-01-FE`, `KAT-01-FE`, dll.) |
| Critical Path | Yes |
| Risk Level | High |
| FSD Ref | Bab 3.2, 3.3 — MFA Authentication via Microsoft Authenticator |

#### Deskripsi
Mengacu pada FSD Bab 3.2 & 3.3, verifikasi multi-faktor (MFA via Microsoft Authenticator) bersifat mandatory untuk seluruh pengguna FinLens. Jika user baru pertama kali login (`nextAction: "ENROLL"`), sistem menyajikan layar aktivasi berupa QR Code, setup key manual, dan 3 kode darurat (Recovery Codes). Pada login berikutnya (`nextAction: "VERIFY"`), user disajikan form 6 digit angka OTP dinamis (30 detik) dari aplikasi authenticator dengan opsi fallback menggunakan Recovery Code.

#### Goals
* Antarmuka pendaftaran MFA dengan tampilan QR Code tajam, tombol copy key, dan konfirmasi simpan recovery code.
* Komponen input 6-digit OTP responsif (auto-focus per kotak, paste 6 angka langsung terisi, auto-submit pada digit ke-6).
* Opsi toggle antara form OTP dan form Recovery Code jika perangkat hilang.
* Indikator visual saat kode salah atau expired tanpa mereset form secara kasar.
* Tombol "Batal" untuk membatalkan konteks login sementara dan kembali ke halaman login.

#### Scope File
* `apps/web/src/features/lgn/pages/MfaEnrollPage.tsx`
* `apps/web/src/features/lgn/pages/MfaVerifyPage.tsx`
* `apps/web/src/features/lgn/components/OtpInput.tsx`
* `apps/web/src/features/lgn/components/RecoveryCodeModal.tsx`
* `apps/web/src/features/lgn/hooks/useMfa.ts`

#### Out of Scope
* Reset konfigurasi MFA oleh admin (dikerjakan pada modul `USR-05-FE`).

#### Acceptance Criteria
1. Jika login merespon `nextAction: "ENROLL"`, user diarahkan ke `/auth/mfa/enroll` yang memuat QR Code, setup key text, dan 3 recovery codes.
2. User wajib mencentang persetujuan: *"Saya telah menyimpan kode pemulihan dengan aman"* sebelum tombol verifikasi aktif.
3. Jika login merespon `nextAction: "VERIFY"`, user diarahkan ke `/auth/mfa/verify` dengan 6 kotak input OTP.
4. Input OTP hanya menerima angka (0-9) dan mendukung paste 6 digit angka secara langsung.
5. Jika kode salah (401), kotak input bergetar/merah dengan pesan: *"Kode OTP salah. Silakan coba lagi."*.
6. Jika kode expired (401), muncul pesan: *"Kode OTP telah kadaluwarsa. Masukkan kode terbaru dari aplikasi Authenticator."*.
7. Tautan *"Gunakan Kode Pemulihan"* dapat diklik untuk beralih ke form input recovery code teks.
8. Tombol "Batal" membatalkan sesi sementara dan mengarahkan kembali ke `/login`.
9. Verifikasi sukses membawa user ke dashboard dengan sesi penuh.

#### Flow Logic (Step by Step)
1. **Flow Enrollment (`MfaEnrollPage.tsx`):**
   * Ambil `mfaContextToken` dari auth state.
   * Hit `POST /api/v1/auth/mfa/enroll` dengan Authorization header context token.
   * Tampilkan `qrCodeDataUrl`, `setupKey`, dan daftar 3 `recoveryCodes`.
   * User memasukkan kode 6 digit pertama dari Microsoft Authenticator untuk aktivasi.
   * Kirim `POST /api/v1/auth/mfa/verify` dengan body `{ code: otpCode }`.
2. **Flow Verification (`MfaVerifyPage.tsx`):**
   * Komponen `OtpInput` mengatur pergerakan fokus otomatis.
   * Saat digit ke-6 selesai diisi, sistem otomatis melakukan submit payload.
   * Kirim `POST /api/v1/auth/mfa/verify` dengan payload `{ code: otpCode }` atau `{ recoveryCode: codeText }`.
   * Sukses: simpan access token dan redirect ke `/dashboard`.
   * Gagal: hapus nilai input, kembalikan fokus ke kotak pertama, dan tampilkan pesan kesalahan.

#### Request & Response (Kontrak FE)
* **Request Verify OTP:**
  `{ "code": "482910" }`
* **Request Verify Recovery Code:**
  `{ "recoveryCode": "RC1-8F9A-2B1C" }`
* **Respon Sukses dari BE (200 OK):**
  `{ "data": { "nextAction": "AUTHENTICATED", "accessToken": "eyJhbGciOi...", "expiresInSeconds": 900 }, "meta": { "correlationId": "uuid" } }`

#### Notes
* Setup key dan recovery codes tidak boleh disimpan di local storage atau tercatat di console log browser.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka layar MFA Enroll | QR code tampil, setup key bisa dicopy, 3 recovery codes tampil |
| 2 | Verifikasi enroll tanpa checklist | Tombol verifikasi tidak aktif sebelum checklist dicentang |
| 3 | Input OTP huruf/simbol | Karakter diabaikan, hanya angka yang diterima |
| 4 | Paste 6 angka ke kotak pertama | Keenam kotak terisi dan auto-submit |
| 5 | Input kode OTP salah | Kotak error merah, muncul pesan *"Kode OTP salah"*, form di-clear |
| 6 | Klik "Gunakan Kode Pemulihan" | Tampilan berganti ke form recovery code |
| 7 | Submit OTP valid | Berhasil masuk ke halaman dashboard |

---

### [LGN-03-BE] MFA Authentication — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `LGN-03-BE` |
| Modul | Login / Authentication |
| Service | `POST /api/v1/auth/mfa/enroll`, `POST /api/v1/auth/mfa/verify`, `POST /api/v1/auth/context/cancel` |
| Status | New |
| Permission | `mfa-context:ENROLL` & `mfa-context:VERIFY` |
| Story Point | 3 SP |
| Durasi | 12 jam (1 SP = 4 jam bersih) |
| Depends On | `LGN-01-BE` |
| Blocks | `LGN-03-FE`, Seluruh endpoint operasional pasca-login |
| Critical Path | Yes |
| Risk Level | High |
| Target Database | `trn_auth_context`, `trn_user_session`, `mst_user` |
| FSD / Spec Ref | Bab 3.2, 3.3 FSD & Spec API `#authmfaenroll`, `#authmfaverify` |

#### Deskripsi
Endpoint penanganan verifikasi multi-faktor (MFA via Microsoft Authenticator). Menangani inisiasi enrollment QR code & secret key, verifikasi kode OTP 6 digit berbasis TOTP, verifikasi kode pemulihan (recovery code), proteksi replay attack OTP, serta penerbitan session final (JWT Access Token & rotating refresh cookie).

#### Flow Logic (Step by Step)
1. **Pendaftaran MFA (`authMfaEnroll`):**
   * Validasi Header `Authorization: Bearer <mfaContextToken>`.
   * Pastikan token konteks valid di `trn_auth_context`, tipe `ENROLL`, belum expired (TTL 300 detik), dan belum digunakan.
   * Panggil MFA Provider:
     * Generate TOTP Secret Key baru dan 3 Recovery Codes hash.
     * Buat QR Code data URL dengan format: `otpauth://totp/FinLens:<user_email>?secret=<secret>&issuer=FinLens`.
   * Pasang header response `Cache-Control: no-store`.
   * Return `setupKey`, `qrCodeDataUrl`, dan `recoveryCodes`.
2. **Verifikasi MFA (`authMfaVerify`):**
   * Validasi Header `Authorization: Bearer <mfaContextToken>`.
   * Ekstrak user_id dan validasi status context di `trn_auth_context`.
   * **Jika payload berisi `code` (6 digit):**
     * Validasi format numerik 6 digit.
     * Verifikasi TOTP ke provider dengan toleransi clock drift (+-1 window 30 detik).
     * Provider mengunci kode yang sudah dipakai untuk mencegah replay attack.
     * Jika salah/expired -> return 401 `MFA_INVALID`.
     * Jika gagal berulang -> return 429 `MFA_LOCKED`.
   * **Jika payload berisi `recoveryCode`:**
     * Verifikasi hash recovery code terhadap data user.
     * Jika valid: tandai recovery code sebagai USED/hangus.
   * **Penerbitan Sesi Final:**
     * Tandai `mfaContextToken` sebagai `CONSUMED`.
     * Cek `must_change_password`: jika true, terbitkan konteks `CHANGE_PASSWORD` (return 200 `nextAction: "CHANGE_PASSWORD"`).
     * Jika false:
       * Buat sesi baru di `trn_user_session` (cek batasan max 5 sesi).
       * Terbitkan Access Token (JWT RS256, 15 menit).
       * Pasang HttpOnly Cookie `finlens_refresh` (7 hari).
       * Return HTTP 200 dengan `nextAction: "AUTHENTICATED"`.
3. **Pembatalan Konteks (`cancelAuthContext`):**
   * Validasi token context. Tandai status token sebagai dibatalkan di DB.
   * Return HTTP 204 No Content.

#### Parameter Input
* **Header:** `Authorization: Bearer <mfaContextToken>`, `Content-Type: application/json`
* **Request Body Verify OTP (`POST /api/v1/auth/mfa/verify`):**
  `{ "code": "482910" }`
* **Request Body Verify Recovery Code (`POST /api/v1/auth/mfa/verify`):**
  `{ "recoveryCode": "RC1-8F9A-2B1C" }`

#### Response Schema
* **201 Created (authMfaEnroll):**
  `{ "data": { "setupKey": "JBSWY3DPEHPK3PXP...", "qrCodeDataUrl": "data:image/png;base64,...", "recoveryCodes": ["RC1-XXXX", "RC2-XXXX", "RC3-XXXX"] } }`
* **200 OK (authMfaVerify Sukses):**
  `{ "data": { "nextAction": "AUTHENTICATED", "accessToken": "eyJhbGciOi...", "expiresInSeconds": 900 } }`
* **401 Unauthorized (Kode OTP Salah):**
  `{ "error": { "code": "MFA_INVALID", "message": "Kode OTP salah atau telah kadaluwarsa. Silakan masukkan kode terbaru." } }`
* **429 Too Many Requests (MFA Terkunci):**
  `{ "error": { "code": "MFA_LOCKED", "message": "Terlalu banyak percobaan kode MFA yang gagal. Silakan tunggu beberapa saat." } }`

#### Notes
* Kode OTP bersifat single-use dan hangus seketika setelah digunakan (mencegah replay).
* Konteks token MFA kedaluwarsa dalam 300 detik (5 menit). Jika expired, pengguna harus mengulang dari halaman login.

#### QC Checklist (BE / API Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | POST enroll tanpa token context | 401 Unauthorized |
| 2 | POST enroll token context expired (> 300s) | 401 Unauthorized (`AUTH_CONTEXT_EXPIRED`) |
| 3 | POST verify kode selain 6 digit angka | 422 Unprocessable Entity |
| 4 | POST verify kode OTP salah | 401 Unauthorized (`MFA_INVALID`) |
| 5 | POST verify kode OTP yang sudah dipakai | 401 Unauthorized (replay dicegah) |
| 6 | POST verify kode recovery valid | 200 OK, recovery code hangus di DB |
| 7 | POST verify kode valid | 200 OK, sesi aktif terbit, cookie refresh terpasang |
| 8 | POST cancel context | 204 No Content, token context dibatalkan |
