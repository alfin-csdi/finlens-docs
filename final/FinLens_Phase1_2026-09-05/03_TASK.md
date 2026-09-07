# FinLens — Task Final

Versi 1.0 • Final baseline implementasi lokal • dimulai 5 September, difinalkan 6 September 2026.

Sumber kebenaran: FSD v1.0.0 tanggal 24 Agustus 2026 dan jawaban user/BA; instruksi terbaru user mengatasi catatan sebelumnya. Dokumen lama, repo, dan Figma adalah referensi turunan/teknis, bukan pengganti aturan bisnis. Status final berarti kontrak untuk coding berikutnya; bukan klaim aplikasi sudah dibuat, diuji, atau siap production.

Urutan baca: [ERD](01_ERD.md) → [Spec API](02_SPEC_API.md) → [Task](03_TASK.md) → [Arsitektur dan evaluasi](04_ARSITEKTUR.md). Hanya empat file ini menjadi paket final baru. Dokumen sumber tetap di lokasi semula.

## Cara eksekusi

Pertahankan **13 group bisnis / 49 subitem** dengan FE+BE dalam satu kartu. Tambahkan empat task fondasi internal dan satu gate QA agar pekerjaan non-UI punya owner: total 54 unit eksekusi. Status awal semuanya OPEN, belum dikerjakan. 1 SP = 4 jam effort bersih; owner belum ditetapkan. Dependency adalah urutan hard delivery; komponen dapat disiapkan dengan mock kontrak. Tidak ada pekerjaan production/deployment dalam scope saat ini.

Login LGN-01/02/03 memakai UI Figma siap develop menurut user. Frame non-login boleh dipakai referensi dan implementasi behavior; styling finalnya menunggu handoff frame, bukan menunggu ulang keputusan BA. FND-03 shared primitives dibuat tanpa membekukan layout semua halaman.
**Total estimasi: 117.5 SP = 470 jam effort bersih**, termasuk fondasi dan QA. Belum termasuk provisioning production, wait time provider/designer, atau buffer kalender. Ukuran SUB-03 adalah epic 9 SP dan wajib dikerjakan melalui langkah kecil worker/OCR/snapshot/similarity/result/retry di kartu, dengan checkpoint per langkah; tidak dianggap satu hari.

## Urutan dan ringkasan

| ID | Task | FE SP | BE/shared SP | Depends On | Jalur utama |
|---|---|---:|---:|---|---|
| [FND-01](#fnd-01) | Monorepo dan layanan lokal | 0 | 2 | — | Ya |
| [FND-02](#fnd-02) | Migration, seed dan integritas data | 0 | 3 | FND-01 | Ya |
| [FND-03](#fnd-03) | Guard API dan shell reusable | 0 | 3 | FND-02 | Ya |
| [FND-04](#fnd-04) | Outbox, quarantine dan adapter worker | 0 | 5 | FND-02 | Ya |
| [LGN-01](#lgn-01) | Menu Login | 2 | 5 | FND-01, FND-02, FND-03 | Ya |
| [LGN-02](#lgn-02) | Forgot Password | 1 | 1 | LGN-01, FND-04 | Tidak |
| [LGN-03](#lgn-03) | MFA Authentication | 2 | 3 | LGN-01 | Ya |
| [TEN-01](#ten-01) | Halaman List Tenant | 0.5 | 0.5 | LGN-03 | Tidak |
| [TEN-02](#ten-02) | View Only Tenant | 0.5 | 0.5 | TEN-01 | Tidak |
| [TEN-03](#ten-03) | Add Tenant | 0.5 | 0.5 | TEN-01 | Tidak |
| [TEN-04](#ten-04) | Edit Tenant | 0.5 | 0.5 | TEN-02 | Tidak |
| [TEN-05](#ten-05) | Aktif / Nonaktif Tenant | 0.5 | 1 | TEN-02 | Tidak |
| [USR-01](#usr-01) | Halaman List User | 0.5 | 0.5 | ROL-03 | Tidak |
| [USR-02](#usr-02) | View Only User | 0.5 | 0.5 | USR-01 | Tidak |
| [USR-03](#usr-03) | Add User | 2 | 3 | USR-01, LGN-02, TEN-03 | Tidak |
| [USR-04](#usr-04) | Edit User | 0.5 | 0.5 | USR-02 | Tidak |
| [USR-05](#usr-05) | Aktif / Nonaktif dan Reset Akses User | 1 | 2 | USR-02, LGN-02 | Tidak |
| [ROL-01](#rol-01) | Halaman List Role | 0.5 | 0.5 | LGN-03 | Tidak |
| [ROL-02](#rol-02) | View Only Role | 0.5 | 0.5 | ROL-01 | Tidak |
| [ROL-03](#rol-03) | Add Role | 1 | 1 | ROL-02 | Tidak |
| [ROL-04](#rol-04) | Edit Role & Hak Akses | 1 | 1 | ROL-02 | Tidak |
| [ROL-05](#rol-05) | Delete & Change Status Role | 0.5 | 1 | ROL-03 | Tidak |
| [ANO-01](#ano-01) | Halaman List Anomali | 0.5 | 0.5 | LGN-03 | Tidak |
| [ANO-02](#ano-02) | View Only Anomali | 0.5 | 0.5 | ANO-01 | Tidak |
| [ANO-03](#ano-03) | Add Anomali | 0.5 | 1 | ANO-01 | Ya |
| [ANO-04](#ano-04) | Edit Anomali | 0.5 | 1 | ANO-02 | Tidak |
| [ANO-05](#ano-05) | Delete & Change Status Anomali | 0.5 | 1 | ANO-03 | Tidak |
| [KAT-01](#kat-01) | Halaman List Kategori File | 0.5 | 0.5 | LGN-03 | Tidak |
| [KAT-02](#kat-02) | View Only Kategori File | 0.5 | 0.5 | KAT-01 | Tidak |
| [KAT-03](#kat-03) | Add Kategori File | 0.5 | 0.5 | KAT-01 | Ya |
| [KAT-04](#kat-04) | Edit Kategori File | 0.5 | 0.5 | KAT-02 | Tidak |
| [KAT-05](#kat-05) | Delete & Change Status Kategori File | 0.5 | 1 | KAT-03 | Tidak |
| [SUB-01](#sub-01) | Form Submit Document | 1 | 0.5 | KAT-03 | Ya |
| [SUB-02](#sub-02) | Upload & Validasi Dokumen | 2 | 3 | SUB-01, FND-04 | Ya |
| [SUB-03](#sub-03) | Status Pengiriman & Proses Analisis | 1 | 8 | SUB-02, ANO-03 | Ya |
| [BUC-01](#buc-01) | Halaman List Bucket Document | 1 | 1 | SUB-02 | Tidak |
| [BUC-02](#buc-02) | View Only Document | 0.5 | 0.5 | BUC-01 | Tidak |
| [BUC-03](#buc-03) | Edit Metadata & Replace Document | 1 | 2 | BUC-02, SUB-03 | Tidak |
| [BUC-04](#buc-04) | Download, Delete & Change Status Document | 1 | 1 | BUC-02 | Tidak |
| [REV-01](#rev-01) | Halaman History Document | 1 | 1 | SUB-03 | Ya |
| [REV-02](#rev-02) | Detail Hasil Analisis | 1 | 1 | REV-01 | Ya |
| [REV-03](#rev-03) | Similarity & Compare Document | 2 | 3 | REV-02 | Ya |
| [REV-04](#rev-04) | Finalisasi Review Document | 1 | 3 | REV-03 | Ya |
| [LOG-01](#log-01) | Halaman List Activity Log | 0.5 | 1 | LGN-03 | Tidak |
| [LOG-02](#log-02) | View Detail Activity Log | 0.5 | 0.5 | LOG-01 | Tidak |
| [DSH-01](#dsh-01) | Ringkasan Dashboard | 0.5 | 0.5 | SUB-03 | Tidak |
| [DSH-02](#dsh-02) | Grafik Risiko & Kelengkapan Dokumen | 1 | 1 | DSH-01 | Tidak |
| [DSH-03](#dsh-03) | Filter Periode, Drill-down & Refresh | 0.5 | 0.5 | DSH-01, REV-02 | Tidak |
| [NOT-01](#not-01) | Daftar & Jumlah Notifikasi | 0.5 | 1 | SUB-02, FND-04 | Tidak |
| [NOT-02](#not-02) | Tandai Dibaca & Buka Halaman Terkait | 0.5 | 0.5 | NOT-01, REV-02 | Tidak |
| [PRO-01](#pro-01) | View & Edit Profile | 0.5 | 0.5 | LGN-03 | Tidak |
| [PRO-02](#pro-02) | Change Password | 0.5 | 1 | PRO-01 | Tidak |
| [PRO-03](#pro-03) | Active Sessions & Logout Perangkat | 0.5 | 1 | PRO-01 | Tidak |
| [QA-01](#qa-01) | Validasi integrasi dan kesiapan lokal | 0 | 5 | Semua 53 unit | Ya |

Jalur utama adalah urutan domain menuju upload → AI → review → CHECKED; bukan hasil optimisasi kalender dengan kapasitas tim. Target 1 Oktober 2026 tetap target sebelumnya, bukan janji berdasarkan SP ini. Bandingkan throughput aktual setelah coding dimulai.

## Definition of Done bersama

- [ ] Behavior positif dan negatif sesuai endpoint, FSD/BA dan ERD; lint/typecheck/build lulus untuk scope perubahan.
- [ ] FE memetakan loading/empty/error/success/401/403/409, keyboard/focus/label, tablet tanpa aksi tersembunyi; data mock diberi label hanya pada dev.
- [ ] Mutation mengecek tenant/permission/version/state di BE, menghasilkan audit teredaksi dan event tepat satu secara logis.
- [ ] Test penting membuktikan cross-tenant, concurrency, replay dan failure-path untuk task yang menyentuhnya; simpan hasil nyata, jangan centang berdasarkan dokumen.
- [ ] Endpoint dan field mengikuti 02_SPEC_API.md; schema/response tidak berubah diam-diam demi menyesuaikan prototype.
- [ ] Files Scope di bawah adalah target repo konseptual, bukan file aplikasi yang sudah dibuat.

## Fondasi

<a id="fnd-01"></a>
### FND-01 — Monorepo dan layanan lokal
**Status:** OPEN • **SP:** 2 • **Depends On:** —

**Context / Scope:** Buat workspace apps/web, apps/api, packages/contracts, packages/db, workers/ai, infra. Compose PostgreSQL, RabbitMQ, MinIO, ClamAV, Mailpit dan Redis opsional; env.example tanpa secret. Health/readiness, shutdown aman dan bootstrap satu perintah.

**Spec Ref:** [Aturan lintas modul](02_SPEC_API.md) • **ERD Ref:** [Model dan constraints](01_ERD.md) • **Files Scope:** infra/, packages/, apps/, workers/.

### Flow Logic (step by step)
1. Baca kontrak dan dependency, buat perubahan dalam target monorepo baru setelah user memberi perintah coding.
2. Implementasikan scope kartu dan adapter konfigurasi lokal; gunakan seed/fixture synthetic tanpa credential reference.
3. Jalankan acceptance berikut dan catat output; hubungkan ke task bisnis terkait.

**Acceptance / QC:**
- [ ] Given checkout/database lokal bersih, when scope dijalankan, then Install/build/typecheck bisa diulang dari checkout bersih; readiness gagal jika dependency wajib unavailable.

<a id="fnd-02"></a>
### FND-02 — Migration, seed dan integritas data
**Status:** OPEN • **SP:** 3 • **Depends On:** FND-01

**Context / Scope:** Implementasikan seluruh DBML, constraints/deferrable FKs/triggers, seed severity/permission dan user-role bootstrap. Gunakan SQL migration untuk constraint yang tidak terwakili Prisma. Tidak mengimpor SQLite production.

**Spec Ref:** [Aturan lintas modul](02_SPEC_API.md) • **ERD Ref:** [Model dan constraints](01_ERD.md) • **Files Scope:** infra/, packages/, apps/, workers/.

### Flow Logic (step by step)
1. Baca kontrak dan dependency, buat perubahan dalam target monorepo baru setelah user memberi perintah coding.
2. Implementasikan scope kartu dan adapter konfigurasi lokal; gunakan seed/fixture synthetic tanpa credential reference.
3. Jalankan acceptance berikut dan catat output; hubungkan ke task bisnis terkait.

**Acceptance / QC:**
- [ ] Given checkout/database lokal bersih, when scope dijalankan, then Reset database disposable menghasilkan schema lengkap; duplikat nama aktif, FK lintas tenant, assignment race dan UPDATE CHECKED ditolak.

<a id="fnd-03"></a>
### FND-03 — Guard API dan shell reusable
**Status:** OPEN • **SP:** 3 • **Depends On:** FND-02

**Context / Scope:** Bangun auth context, permission evaluator, tenant repository, DTO/error mapper, version locking, correlation/redaction. FE atomic primitives/layout, typed client, form/table/filter/modal state; tanpa hard-code persona.

**Spec Ref:** [Aturan lintas modul](02_SPEC_API.md) • **ERD Ref:** [Model dan constraints](01_ERD.md) • **Files Scope:** infra/, packages/, apps/, workers/.

### Flow Logic (step by step)
1. Baca kontrak dan dependency, buat perubahan dalam target monorepo baru setelah user memberi perintah coding.
2. Implementasikan scope kartu dan adapter konfigurasi lokal; gunakan seed/fixture synthetic tanpa credential reference.
3. Jalankan acceptance berikut dan catat output; hubungkan ke task bisnis terkait.

**Acceptance / QC:**
- [ ] Given checkout/database lokal bersih, when scope dijalankan, then Direct API tanpa izin 403, foreign ID 404, forged tenant tidak mengubah scope; shell keyboard/tablet usable.

<a id="fnd-04"></a>
### FND-04 — Outbox, quarantine dan adapter worker
**Status:** OPEN • **SP:** 5 • **Depends On:** FND-02

**Context / Scope:** Implement outbox/inbox, idempotency leases, email metadata + retry, private object store, scan worker fail-closed, queue publisher confirm, AI lease protocol dan DLQ. Kontrak internal lihat arsitektur.

**Spec Ref:** [Aturan lintas modul](02_SPEC_API.md) • **ERD Ref:** [Model dan constraints](01_ERD.md) • **Files Scope:** infra/, packages/, apps/, workers/.

### Flow Logic (step by step)
1. Baca kontrak dan dependency, buat perubahan dalam target monorepo baru setelah user memberi perintah coding.
2. Implementasikan scope kartu dan adapter konfigurasi lokal; gunakan seed/fixture synthetic tanpa credential reference.
3. Jalankan acceptance berikut dan catat output; hubungkan ke task bisnis terkait.

**Acceptance / QC:**
- [ ] Given checkout/database lokal bersih, when scope dijalankan, then Crash setelah commit sebelum publish dan duplicate delivery tidak menggandakan business result/notifikasi; scan belum CLEAN tak terbaca AI.

<a id="lgn-01"></a>
## LGN-01 — Menu Login

| Field | Detail |
|---|---|
| Group | LOGIN |
| Status | OPEN |
| Story Point | FE 2 + BE 5 = 7 SP (28 jam) |
| Depends On | FND-01, FND-02, FND-03 |
| Blocks | LGN-02, LGN-03 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/lgn/, apps/api/src/modules/lgn/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [authLogin](02_SPEC_API.md#authlogin), [authRefresh](02_SPEC_API.md#authrefresh), [authLogout](02_SPEC_API.md#authlogout), [completeInitialPassword](02_SPEC_API.md#completeinitialpassword) |
| ERD Ref | mst_user, mst_tenant, trn_user_session, trn_password_reset; tabel pendukung pada ERD final |
| Requirement Ref | FR-001, FR-003, FR-005, FR-011 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memungkinkan pengguna masuk dengan email dan kata sandi serta diarahkan ke langkah keamanan berikutnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memungkinkan pengguna masuk dengan email dan kata sandi serta diarahkan ke langkah keamanan berikutnya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form email/password, validasi wajib dan format email, indikator loading, pesan login gagal/terkunci, redirect berdasarkan `nextAction`, penjagaan route, refresh sesi, dan logout.
- Integrasi terhadap service: `POST /api/v1/auth/login`, `/refresh`, `/logout`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `authLogin`: Authenticate email and password
- `authRefresh`: Rotate refresh token
- `authLogout`: Revoke current session
- `completeInitialPassword`: completeInitialPassword

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Menu Login selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**authLogin**
1. Validasi email maksimal 100 dan password 8–64; normalisasi hanya email. Rate-limit account/IP. Unknown/inactive/locked user memperoleh 401 AUTH_INVALID generik; kegagalan ketiga mengunci 3 jam secara atomik.
2. Periksa user, role, tenant aktif dan temporary password belum expired/consumed. Verifikasi hash; update failed counter/lock di row user lock.
3. Panggil provider check-requirement HIGH, forceMfa=false dengan visitorId/isPrivate; trusted harus dikonfirmasi status.isSessionVerified=true. Tidak enrolled → konteks ENROLL; challenge → VERIFY, keduanya 300 detik.
4. Sesudah MFA terpenuhi, jika must_change_password, tandai temporary password used dan buat CHANGE_PASSWORD context terikat credential_version, 300 detik; tidak ada access/refresh session. Jika konteks habis, gunakan forgot password/admin credential reset.
5. Jika semua syarat selesai, lock row user, batasi lima sesi, buat durable session + refresh hash generation 1 dan access JWT 900 detik. Set cookie refresh 7 hari; idle server 60 menit. Return AUTHENTICATED.
6. Provider gagal → 503; tidak membuat sesi. Audit tanpa credential. Validasi status user/tenant/credential_version kembali sebelum commit akhir untuk menutup perubahan selama MFA.

**authRefresh**
1. Baca cookie finlens_refresh; tolak refreshToken dari body. Verifikasi Origin terhadap origin web yang diizinkan; SameSite Strict dan allow-list CORS, credentialed request.
2. Lock hash token dan session; cek unused, expiry 7 hari absolut, idle<60 menit, user/role/tenant aktif. Token used berarti replay: revoke session family dan return 401.
3. Tandai token lama used dan insert generasi baru satu transaksi. Terbitkan access JWT 15 menit dan cookie baru dengan sisa absolute expiry; concurrent refresh FE harus single-flight.
4. Refresh otomatis dan polling tidak memperpanjang idle. Aktivitas interaktif terotorisasi memperbarui last_activity_at maksimal sekali per menit; logout/revocation memblokir seluruh JTI session.

**authLogout**
1. Authorize session aktif, revoke current session dan semua refresh generations atomik.
2. Hapus refresh cookie dengan atribut Path yang sama; hapus access token FE memory; audit tanpa token. Return 204.

**completeInitialPassword**
1. Validasi CHANGE_PASSWORD context, expiry, consumed_at, credential_version, dan MFA evidence; tidak menerima bearer access biasa.
2. Validasi newPassword dan confirmPassword identik, 8–64 huruf besar/kecil/angka/simbol dan berbeda dari password lama; lock user/context.
3. Ganti hash; clear must_change_password, invalidasi temporary credential dan seluruh auth/reset contexts; increment credential_version; revoke semua session.
4. Consume context dan audit satu transaksi, 204. FE kembali login dengan password baru; token penuh tidak diberikan melalui endpoint ini.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji idle 60 menit, login keenam serentak, context reuse, provider outage dan refresh replay; temporary login tidak memperoleh sesi penuh.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "email": "user@example.com",
  "password": "ExampleOnly9!",
  "visitorId": "xxxxxxxxxxxxxxxxxxxx",
  "isPrivate": false
}
```

### Prompt implementasi
```text
Implement LGN-01: Menu Login. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="lgn-02"></a>
## LGN-02 — Forgot Password

| Field | Detail |
|---|---|
| Group | LOGIN |
| Status | OPEN |
| Story Point | FE 1 + BE 1 = 2 SP (8 jam) |
| Depends On | LGN-01, FND-04 |
| Blocks | USR-03, USR-05 |
| Critical Path | Tidak |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/lgn/, apps/api/src/modules/lgn/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [authPasswordResetRequest](02_SPEC_API.md#authpasswordresetrequest), [authPasswordResetConfirm](02_SPEC_API.md#authpasswordresetconfirm) |
| ERD Ref | mst_user, mst_tenant, trn_user_session, trn_password_reset; tabel pendukung pada ERD final |
| Requirement Ref | FR-004 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Membantu pengguna memulihkan akses tanpa bantuan administrator. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Membantu pengguna memulihkan akses tanpa bantuan administrator.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Halaman request, halaman confirm, validasi email, konfirmasi kata sandi, indikator kekuatan sesuai kebijakan, state token valid/kedaluwarsa/terpakai, dan kembali ke login.
- Integrasi terhadap service: `POST /api/v1/auth/password-reset/request`, `/confirm`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `authPasswordResetRequest`: Request password reset
- `authPasswordResetConfirm`: Confirm password reset

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Forgot Password selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**authPasswordResetRequest**
1. Validasi email 100, rate-limit account/IP; respons tetap 202 Message netral untuk known/unknown/inactive.
2. Untuk akun/tenant aktif, simpan email intent; email worker menghasilkan secure token, digest 30 menit dan invalidasi reset aktif sebelumnya dalam transaksi, lalu kirim link dari memory.
3. Retry/restart mengikuti email-delivery policy; token plaintext tidak masuk outbox. Tidak mengubah password sampai confirm valid.

**authPasswordResetConfirm**
1. Validasi token digest aktif, expiry 30 menit, new/confirmPassword identik 8–64 kompleks dan berbeda dari hash lama.
2. Lock user/reset row; update hash, increment credential version, clear temporary flags, consume semua reset/auth contexts dan revoke semua session satu transaksi.
3. Audit teredaksi, return Message; FE kembali login. Invalid/expired/used token → 422 RESET_TOKEN_INVALID tanpa perubahan.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji idle 60 menit, login keenam serentak, context reuse, provider outage dan refresh replay; temporary login tidak memperoleh sesi penuh.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "email": "user@example.com"
}
```

### Prompt implementasi
```text
Implement LGN-02: Forgot Password. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="lgn-03"></a>
## LGN-03 — MFA Authentication

| Field | Detail |
|---|---|
| Group | LOGIN |
| Status | OPEN |
| Story Point | FE 2 + BE 3 = 5 SP (20 jam) |
| Depends On | LGN-01 |
| Blocks | TEN-01, ROL-01, ANO-01, KAT-01, LOG-01, PRO-01 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/lgn/, apps/api/src/modules/lgn/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [authMfaEnroll](02_SPEC_API.md#authmfaenroll), [authMfaVerify](02_SPEC_API.md#authmfaverify), [cancelAuthContext](02_SPEC_API.md#cancelauthcontext) |
| ERD Ref | mst_user, mst_tenant, trn_user_session, trn_password_reset; tabel pendukung pada ERD final |
| Requirement Ref | FR-002, FR-005 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menambahkan verifikasi kedua sebelum sesi FinLens diterbitkan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menambahkan verifikasi kedua sebelum sesi FinLens diterbitkan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Tampilan QR/setup key, verifikasi setup, input OTP aksesibel, paste/autofill, recovery code, forced re-enrollment, countdown konteks, serta error provider/lockout.
- Integrasi terhadap service: `POST /api/v1/auth/mfa/enroll`, `/mfa/verify`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `authMfaEnroll`: Start MFA Provider enrollment
- `authMfaVerify`: Verify TOTP and create session
- `cancelAuthContext`: cancelAuthContext

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur MFA Authentication selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**authMfaEnroll**
1. Validate the unexpired, unused `ENROLL` MFA context and derive user ID/email server-side.
2. Call provider `/enroll` with `userIdentifier = mst_user.user_id` and `userName = normalized email`.
3. Resolve the relative QR path against the configured provider origin, reject cross-origin/non-HTTPS values, then return `setupKey`, safe absolute `qrCodeDataUrl`, and exactly three recovery codes once; set `Cache-Control: no-store`.
4. Never persist or log setup material. Map provider `409` to `MFA_ALREADY_ENROLLED` and provider failure to `MFA_PROVIDER_UNAVAILABLE`.

**authMfaVerify**
1. Validasi konteks ENROLL/VERIFY, expiry, user/role/tenant/credential version dan binding device; hanya satu code 6 digit atau recoveryCode sesuai kontrak provider.
2. ENROLL memakai verify-setup, VERIFY memakai verify. Jangan auto-retry pemakaian OTP. Provider owns replay/lockout; 401 MFA_INVALID, 429 MFA_LOCKED dengan Retry-After, 503 MFA_PROVIDER_UNAVAILABLE.
3. Code sukses wajib status.isSessionVerified=true. Consume konteks atomik; temporary user ke CHANGE_PASSWORD tanpa full session, user biasa ke AUTHENTICATED dan session dengan batas lima.
4. Recovery sukses menonaktifkan MFA di provider: return ENROLL baru tanpa access/refresh. Consume context lama. Setup/recovery material tidak disimpan/log.

**cancelAuthContext**
1. Validasi context token yang masih sah; tandai consumed jika belum dipakai.
2. Batalkan konteks server dan hapus state sensitif FE, kembali login; 204 tanpa mengubah MFA provider enrollment.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji idle 60 menit, login keenam serentak, context reuse, provider outage dan refresh replay; temporary login tidak memperoleh sesi penuh.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
POST /api/v1/auth/mfa/enroll
```

### Prompt implementasi
```text
Implement LGN-03: MFA Authentication. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ten-01"></a>
## TEN-01 — Halaman List Tenant

| Field | Detail |
|---|---|
| Group | MASTER TENANT |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | LGN-03 |
| Blocks | TEN-02, TEN-03 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ten/, apps/api/src/modules/ten/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listTenants](02_SPEC_API.md#listtenants) |
| ERD Ref | mst_tenant; tabel pendukung pada ERD final |
| Requirement Ref | FR-008, FR-042 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Membantu Super User menemukan dan memantau tenant. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Membantu Super User menemukan dan memantau tenant.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Tabel tenant dengan pencarian, filter status, sorting, pagination, loading, empty, error, serta action sesuai permission.
- Integrasi terhadap service: `GET /api/v1/tenants`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listTenants`: List tenants

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Halaman List Tenant selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listTenants**
1. Verifikasi tenant.view dan scope global platform; tidak mengandalkan nama persona.
2. Query mst_tenant dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji permission platform-managed, duplicate tenant name case-insensitive dan pencabutan akses seluruh tenant saat nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/tenants
```

### Prompt implementasi
```text
Implement TEN-01: Halaman List Tenant. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ten-02"></a>
## TEN-02 — View Only Tenant

| Field | Detail |
|---|---|
| Group | MASTER TENANT |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | TEN-01 |
| Blocks | TEN-04, TEN-05 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ten/, apps/api/src/modules/ten/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getTenant](02_SPEC_API.md#gettenant) |
| ERD Ref | mst_tenant; tabel pendukung pada ERD final |
| Requirement Ref | FR-008 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menampilkan informasi tenant tanpa risiko perubahan tidak sengaja. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menampilkan informasi tenant tanpa risiko perubahan tidak sengaja.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Detail nama, status, metadata pencatatan, dan action yang diizinkan dalam mode baca.
- Integrasi terhadap service: `GET /api/v1/tenants/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getTenant`: Get tenant detail

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur View Only Tenant selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getTenant**
1. Verifikasi tenant.view dan scope global platform; tidak mengandalkan nama persona.
2. Query mst_tenant dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji permission platform-managed, duplicate tenant name case-insensitive dan pencabutan akses seluruh tenant saat nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/tenants/{id}
```

### Prompt implementasi
```text
Implement TEN-02: View Only Tenant. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ten-03"></a>
## TEN-03 — Add Tenant

| Field | Detail |
|---|---|
| Group | MASTER TENANT |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | TEN-01 |
| Blocks | USR-03 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ten/, apps/api/src/modules/ten/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [createTenant](02_SPEC_API.md#createtenant) |
| ERD Ref | mst_tenant; tabel pendukung pada ERD final |
| Requirement Ref | FR-008 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memungkinkan Super User menambahkan tenant baru. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memungkinkan Super User menambahkan tenant baru.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Modal tambah tenant, validasi field sesuai FSD, error inline/konflik, loading, toast sukses, tutup modal, dan refresh list.
- Integrasi terhadap service: `POST /api/v1/tenants`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `createTenant`: Create tenant

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Add Tenant selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**createTenant**
1. Verifikasi tenant.add dan scope global platform. Validasi Nama 100 unik case-insensitive.
2. Lock target/parent terkait; cek uniqueness atomik dan create UUID server.
3. Tulis mst_tenant, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Create tenant juga seed role Admin Tenant yang non-platform dengan permission tenant yang tersedia untuk onboarding awal.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji permission platform-managed, duplicate tenant name case-insensitive dan pencabutan akses seluruh tenant saat nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens"
}
```

### Prompt implementasi
```text
Implement TEN-03: Add Tenant. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ten-04"></a>
## TEN-04 — Edit Tenant

| Field | Detail |
|---|---|
| Group | MASTER TENANT |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | TEN-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ten/, apps/api/src/modules/ten/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateTenant](02_SPEC_API.md#updatetenant) |
| ERD Ref | mst_tenant; tabel pendukung pada ERD final |
| Requirement Ref | FR-008 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memperbarui informasi tenant dengan kontrol konflik perubahan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memperbarui informasi tenant dengan kontrol konflik perubahan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form terisi data terakhir, validasi, dirty-state warning, submit, konflik versi, toast, dan refresh detail/list.
- Integrasi terhadap service: `PATCH /api/v1/tenants/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateTenant`: Update tenant

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Edit Tenant selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateTenant**
1. Verifikasi tenant.edit dan scope global platform. Validasi Nama 100 unik case-insensitive.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_tenant, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. 
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji permission platform-managed, duplicate tenant name case-insensitive dan pencabutan akses seluruh tenant saat nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement TEN-04: Edit Tenant. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ten-05"></a>
## TEN-05 — Aktif / Nonaktif Tenant

| Field | Detail |
|---|---|
| Group | MASTER TENANT |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | TEN-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ten/, apps/api/src/modules/ten/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateTenantStatus](02_SPEC_API.md#updatetenantstatus) |
| ERD Ref | mst_tenant; tabel pendukung pada ERD final |
| Requirement Ref | FR-009 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Mengaktifkan atau menonaktifkan tenant dengan penjelasan dampak. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Mengaktifkan atau menonaktifkan tenant dengan penjelasan dampak.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Action status, dialog konfirmasi, ringkasan dampak, loading, sukses/gagal, dan refresh. Label board mempertahankan kata “Delete”, tetapi kontrak Phase 1 hanya mengizinkan nonaktifkan/aktifkan.
- Integrasi terhadap service: `PATCH /api/v1/tenants/{id}/status`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateTenantStatus`: Activate or deactivate tenant

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Aktif / Nonaktif Tenant selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateTenantStatus**
1. Authorize tenant.edit dalam scope global platform; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Tenant sistem sendiri tidak boleh nonaktif.
3. Update status/version/metadata dan audit atomik. NON_ACTIVE langsung revoke semua session tenant/user terkait; activation tidak memulihkan token lama.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji permission platform-managed, duplicate tenant name case-insensitive dan pencabutan akses seluruh tenant saat nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement TEN-05: Aktif / Nonaktif Tenant. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="usr-01"></a>
## USR-01 — Halaman List User

| Field | Detail |
|---|---|
| Group | MASTER USER |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | ROL-03 |
| Blocks | USR-02, USR-03 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/usr/, apps/api/src/modules/usr/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listUsers](02_SPEC_API.md#listusers) |
| ERD Ref | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-010, FR-042 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memudahkan administrator tenant menemukan dan memantau user. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memudahkan administrator tenant menemukan dan memantau user.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Tabel user tenant dengan search, filter role/status, sort, pagination, dan action sesuai permission.
- Integrasi terhadap service: `GET /api/v1/users`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listUsers`: List tenant users

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Halaman List User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listUsers**
1. Verifikasi user.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_user dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji email immutable/global unique, role tenant lain/nonaktif, draft expiry/regenerate, delivery failure dan credential terbaru setelah retry.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/users
```

### Prompt implementasi
```text
Implement USR-01: Halaman List User. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="usr-02"></a>
## USR-02 — View Only User

| Field | Detail |
|---|---|
| Group | MASTER USER |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | USR-01 |
| Blocks | USR-04, USR-05 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/usr/, apps/api/src/modules/usr/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getUser](02_SPEC_API.md#getuser) |
| ERD Ref | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-010 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menampilkan profil, role, dan status user secara aman. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menampilkan profil, role, dan status user secara aman.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Detail read-only nama, email, role, status, dan metadata yang diizinkan.
- Integrasi terhadap service: `GET /api/v1/users/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getUser`: Get tenant user detail

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur View Only User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getUser**
1. Verifikasi user.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_user dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji email immutable/global unique, role tenant lain/nonaktif, draft expiry/regenerate, delivery failure dan credential terbaru setelah retry.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/users/{id}
```

### Prompt implementasi
```text
Implement USR-02: View Only User. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="usr-03"></a>
## USR-03 — Add User

| Field | Detail |
|---|---|
| Group | MASTER USER |
| Status | OPEN |
| Story Point | FE 2 + BE 3 = 5 SP (20 jam) |
| Depends On | USR-01, LGN-02, TEN-03 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/usr/, apps/api/src/modules/usr/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [createUser](02_SPEC_API.md#createuser), [createCredentialDraft](02_SPEC_API.md#createcredentialdraft), [listAssignableRoles](02_SPEC_API.md#listassignableroles), [listPlatformAssignableRoles](02_SPEC_API.md#listplatformassignableroles), [createPlatformCredentialDraft](02_SPEC_API.md#createplatformcredentialdraft), [createPlatformUser](02_SPEC_API.md#createplatformuser) |
| ERD Ref | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| Requirement Ref | FR-008, FR-010, FR-011, FR-013 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menambahkan user tenant dan memilih role yang diizinkan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menambahkan user tenant dan memilih role yang diizinkan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form nama, email, role, validasi, state role kosong, submit, dan informasi bahwa kredensial sementara dikirim melalui email.
- Integrasi terhadap service: `POST /api/v1/users`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `createUser`: Create tenant user
- `createCredentialDraft`: createCredentialDraft
- `listAssignableRoles`: listAssignableRoles
- `listPlatformAssignableRoles`: listPlatformAssignableRoles
- `createPlatformCredentialDraft`: createPlatformCredentialDraft
- `createPlatformUser`: createPlatformUser

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Add User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**createUser**
1. Validasi permission user.add dan input name/email/roleId/draft; email global unik, nama 100, email 100.
2. Pastikan role aktif tenant sama dan bukan platform_managed; validasi draft actor, tenant, expiry, password hash, unused.
3. Dalam transaksi lock role/draft, create user must_change_password=true, expiry temporary 30 menit, consume draft, create email-delivery dan audit/outbox metadata tanpa secret.
4. Kirim credential dari request memory melalui email adapter setelah commit; retry mengikuti kebijakan delivery. Return User DTO tanpa password; kegagalan email ditandai FAILED, bukan menghapus user yang sudah committed.

**createCredentialDraft**
1. Periksa user.add dan scope tenant; rate-limit.
2. Jika replaceDraftToken ada, validasi kepemilikan dan consume draft lama.
3. Generate password acak 8–64 dengan semua kelas karakter; simpan hanya hash, token digest, actor/tenant dan expiry 5 menit.
4. Return draftToken dan temporaryPassword sekali, Cache-Control no-store. Form menampung memory saja; generate ulang memanggil endpoint yang sama.

**listAssignableRoles**
1. Authorize user.add OR user.edit.
2. Return hanya role aktif tenant sendiri, platform_managed=false; pagination 20/100.

**listPlatformAssignableRoles**
1. Wajib actor dengan role platform_managed dan permission tenant.view AND user.add; tenant user biasa selalu 403.
2. Resolve path tenant {id} aktif sebagai target context di server. Return role aktif non-platform tenant target, tanpa user/document data.
3. Role bootstrap Admin Tenant dibuat saat createTenant. Target tenant tidak berubah hanya karena body menyertakan tenantId.

**createPlatformCredentialDraft**
1. Wajib platform_managed dan tenant.view AND user.add; validasi target tenant aktif.
2. Jalankan createCredentialDraft dengan actor_tenant_id dari session dan tenant_id target dari path tervalidasi.
3. Draft terikat actor+target tenant, expiry 5 menit; tidak dapat dipakai pada tenant lain. Return one-time draft/password; no-store.

**createPlatformUser**
1. Wajib platform_managed + tenant.view AND user.add; resolve tenant target aktif dari path, bukan body.
2. Jalankan flow createUser dengan role/draft berasal dari tenant target, email global unique, actor audit platform tercatat terpisah dari tenant data.
3. Return hanya user yang baru dibuat; seluruh operasi user list/update/status biasa tetap tenant-scoped. Tidak ada session tenant switching atau akses dokumen lintas tenant.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji email immutable/global unique, role tenant lain/nonaktif, draft expiry/regenerate, delivery failure dan credential terbaru setelah retry.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "email": "user@example.com",
  "roleId": "00000000-0000-4000-8000-000000000001",
  "credentialDraftToken": "xxxxxxxxxxxxxxxxxxxx",
  "temporaryPassword": "ExampleOnly9!"
}
```

### Prompt implementasi
```text
Implement USR-03: Add User. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="usr-04"></a>
## USR-04 — Edit User

| Field | Detail |
|---|---|
| Group | MASTER USER |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | USR-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/usr/, apps/api/src/modules/usr/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateUser](02_SPEC_API.md#updateuser), [listAssignableRoles](02_SPEC_API.md#listassignableroles) |
| ERD Ref | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-010, FR-013 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memperbarui nama dan role user tanpa mengubah identitas email. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memperbarui nama dan role user tanpa mengubah identitas email.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form prefilled nama/role, email read-only, dirty warning, version conflict, toast/refetch.
- Integrasi terhadap service: `PATCH /api/v1/users/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateUser`: Update tenant user
- `listAssignableRoles`: listAssignableRoles

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Edit User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateUser**
1. Verifikasi user.edit dan scope tenant. Validasi Nama 100, email global unik immutable, role aktif tenant sama.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_user, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. 
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**listAssignableRoles**
1. Authorize user.add OR user.edit.
2. Return hanya role aktif tenant sendiri, platform_managed=false; pagination 20/100.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji email immutable/global unique, role tenant lain/nonaktif, draft expiry/regenerate, delivery failure dan credential terbaru setelah retry.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "roleId": "00000000-0000-4000-8000-000000000001",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement USR-04: Edit User. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="usr-05"></a>
## USR-05 — Aktif / Nonaktif dan Reset Akses User

| Field | Detail |
|---|---|
| Group | MASTER USER |
| Status | OPEN |
| Story Point | FE 1 + BE 2 = 3 SP (12 jam) |
| Depends On | USR-02, LGN-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/usr/, apps/api/src/modules/usr/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateUserStatus](02_SPEC_API.md#updateuserstatus), [resetUserCredential](02_SPEC_API.md#resetusercredential) |
| ERD Ref | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| Requirement Ref | FR-011, FR-012 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Mengendalikan akses user dan mengirim ulang kredensial sementara secara aman. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Mengendalikan akses user dan mengirim ulang kredensial sementara secara aman.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Dialog aktif/nonaktif dan reset access, penjelasan pencabutan sesi, loading, hasil email, serta refresh. Label “Delete” pada board dipenuhi sebagai nonaktifkan karena tidak ada endpoint hard delete user.
- Integrasi terhadap service: `PATCH /api/v1/users/{id}/status`; `POST /credential-reset`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateUserStatus`: Activate or deactivate user
- `resetUserCredential`: Issue user credential reset

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Aktif / Nonaktif dan Reset Akses User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateUserStatus**
1. Authorize user.edit dalam scope tenant; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Validasi current version dan dependency resource.
3. Update status/version/metadata dan audit atomik. NON_ACTIVE langsung revoke semua session tenant/user terkait; activation tidak memulihkan token lama.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**resetUserCredential**
1. Authorize user.edit, tenant dan versionNo; target aktif, role/tenant sah.
2. Lock user, increment credential_version, revoke seluruh session/context/reset/draft terkait user; buat delivery intent credential reset dan must_change_password.
3. Email worker generate password kompleks, hash-only, expiry 30 menit dan send memory; FAILED terpantau lewat User. Return 202 Message, tidak pernah mengembalikan password user dari endpoint ini.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji email immutable/global unique, role tenant lain/nonaktif, draft expiry/regenerate, delivery failure dan credential terbaru setelah retry.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement USR-05: Aktif / Nonaktif dan Reset Akses User. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rol-01"></a>
## ROL-01 — Halaman List Role

| Field | Detail |
|---|---|
| Group | MASTER ROLE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | LGN-03 |
| Blocks | ROL-02 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/rol/, apps/api/src/modules/rol/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listRoles](02_SPEC_API.md#listroles), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| ERD Ref | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-007, FR-013, FR-022, FR-027, FR-031, FR-042 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Membantu administrator melihat role dan status penggunaannya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Membantu administrator melihat role dan status penggunaannya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Tabel role tenant dengan search, status, sort, pagination, jumlah user bila tersedia, dan action berbasis permission.
- Integrasi terhadap service: `GET /api/v1/roles`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listRoles`: List tenant roles
- `listFilterOptions`: listFilterOptions

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Halaman List Role selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listRoles**
1. Verifikasi role.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_role dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**listFilterOptions**
1. Validasi context+field dari matriks yang diizinkan; wajib permission view modul context.
2. Query DISTINCT opsi yang benar-benar ada pada data modul tenant yang boleh dibaca: roles/anomalies/file-categories updatedBy; documents createdBy/updatedBy/category; reviews createdBy/updatedBy/category/severity; audit-logs actor/module/action. Kombinasi lain → 422.
3. Return value/label dengan pagination; tidak mengembalikan email, full user list, atau permission yang tidak diperlukan.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji All checkbox hanya aksi valid, tenant.* tidak dapat di-grant, role assigned inactive user tetap tidak dapat dihapus/nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/roles
```

### Prompt implementasi
```text
Implement ROL-01: Halaman List Role. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rol-02"></a>
## ROL-02 — View Only Role

| Field | Detail |
|---|---|
| Group | MASTER ROLE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | ROL-01 |
| Blocks | ROL-03, ROL-04 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/rol/, apps/api/src/modules/rol/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listPermissions](02_SPEC_API.md#listpermissions), [getRole](02_SPEC_API.md#getrole) |
| ERD Ref | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-007, FR-013, FR-014 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menjelaskan hak akses efektif sebuah role sebelum digunakan atau diubah. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menjelaskan hak akses efektif sebuah role sebelum digunakan atau diubah.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Detail role, status, grouped permissions, dan metadata dalam mode baca.
- Integrasi terhadap service: `GET /api/v1/roles/{id}`, `GET /api/v1/permissions`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listPermissions`: List assignable permissions
- `getRole`: Get tenant role detail

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur View Only Role selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listPermissions**
1. Authorize role.view.
2. Return katalog menu/action tenant saja; exclude tenant.* dan disabled/unsupported actions; All adalah affordance UI, tidak disimpan sebagai wildcard.
3. Pagination 20/100; default action mappings: tenant view/add/edit; user view/add/edit; role/anomaly/file_category view/add/edit/delete; document view/add/edit/delete/download; review view/edit/download; audit/dashboard view. Notification/profile authenticated self-service.

**getRole**
1. Verifikasi role.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_role dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji All checkbox hanya aksi valid, tenant.* tidak dapat di-grant, role assigned inactive user tetap tidak dapat dihapus/nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
```

### Prompt implementasi
```text
Implement ROL-02: View Only Role. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rol-03"></a>
## ROL-03 — Add Role

| Field | Detail |
|---|---|
| Group | MASTER ROLE |
| Status | OPEN |
| Story Point | FE 1 + BE 1 = 2 SP (8 jam) |
| Depends On | ROL-02 |
| Blocks | USR-01, ROL-05 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/rol/, apps/api/src/modules/rol/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listPermissions](02_SPEC_API.md#listpermissions), [createRole](02_SPEC_API.md#createrole) |
| ERD Ref | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| Requirement Ref | FR-007, FR-013, FR-014 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Membuat role tenant dengan kombinasi hak akses yang disetujui. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Membuat role tenant dengan kombinasi hak akses yang disetujui.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Nama role, deskripsi bila ada di kontrak, grouped permission matrix, pilihan “Semua” per grup dengan indeterminate state, validasi, dan feedback.
- Integrasi terhadap service: `POST /api/v1/roles`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listPermissions`: List assignable permissions
- `createRole`: Create tenant role

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Add Role selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listPermissions**
1. Authorize role.view.
2. Return katalog menu/action tenant saja; exclude tenant.* dan disabled/unsupported actions; All adalah affordance UI, tidak disimpan sebagai wildcard.
3. Pagination 20/100; default action mappings: tenant view/add/edit; user view/add/edit; role/anomaly/file_category view/add/edit/delete; document view/add/edit/delete/download; review view/edit/download; audit/dashboard view. Notification/profile authenticated self-service.

**createRole**
1. Verifikasi role.add dan scope tenant. Validasi Nama 100 unik tenant; permission codes valid, tidak ada tenant.* atau platform-managed assignment.
2. Lock target/parent terkait; cek uniqueness atomik dan create UUID server.
3. Tulis mst_role, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Role change menaikkan permissions_version dan berlaku pada authorization request berikutnya.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji All checkbox hanya aksi valid, tenant.* tidak dapat di-grant, role assigned inactive user tetap tidak dapat dihapus/nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
```

### Prompt implementasi
```text
Implement ROL-03: Add Role. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rol-04"></a>
## ROL-04 — Edit Role & Hak Akses

| Field | Detail |
|---|---|
| Group | MASTER ROLE |
| Status | OPEN |
| Story Point | FE 1 + BE 1 = 2 SP (8 jam) |
| Depends On | ROL-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/rol/, apps/api/src/modules/rol/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listPermissions](02_SPEC_API.md#listpermissions), [updateRole](02_SPEC_API.md#updaterole) |
| ERD Ref | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| Requirement Ref | FR-007, FR-013, FR-014 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memperbarui role dan hak akses tanpa perubahan parsial. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memperbarui role dan hak akses tanpa perubahan parsial.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form prefilled, matrix izin, dirty warning, dampak perubahan akses, version conflict, dan refresh.
- Integrasi terhadap service: `PATCH /api/v1/roles/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listPermissions`: List assignable permissions
- `updateRole`: Update role and permissions

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Edit Role & Hak Akses selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listPermissions**
1. Authorize role.view.
2. Return katalog menu/action tenant saja; exclude tenant.* dan disabled/unsupported actions; All adalah affordance UI, tidak disimpan sebagai wildcard.
3. Pagination 20/100; default action mappings: tenant view/add/edit; user view/add/edit; role/anomaly/file_category view/add/edit/delete; document view/add/edit/delete/download; review view/edit/download; audit/dashboard view. Notification/profile authenticated self-service.

**updateRole**
1. Verifikasi role.edit dan scope tenant. Validasi Nama 100 unik tenant; permission codes valid, tidak ada tenant.* atau platform-managed assignment.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_role, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Role change menaikkan permissions_version dan berlaku pada authorization request berikutnya.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji All checkbox hanya aksi valid, tenant.* tidak dapat di-grant, role assigned inactive user tetap tidak dapat dihapus/nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
```

### Prompt implementasi
```text
Implement ROL-04: Edit Role & Hak Akses. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rol-05"></a>
## ROL-05 — Delete & Change Status Role

| Field | Detail |
|---|---|
| Group | MASTER ROLE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | ROL-03 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/rol/, apps/api/src/modules/rol/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateRoleStatus](02_SPEC_API.md#updaterolestatus), [deleteRole](02_SPEC_API.md#deleterole) |
| ERD Ref | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| Requirement Ref | FR-013, FR-015 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Mengelola lifecycle role tanpa memutus akses user secara tidak sengaja. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Mengelola lifecycle role tanpa memutus akses user secara tidak sengaja.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Dialog status dan delete dengan dampak serta penanganan role masih dipakai.
- Integrasi terhadap service: `PATCH /api/v1/roles/{id}/status`; `DELETE /api/v1/roles/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateRoleStatus`: Activate or deactivate an unassigned role
- `deleteRole`: Delete unused role

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Delete & Change Status Role selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateRoleStatus**
1. Authorize role.edit dalam scope tenant; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Validasi current version dan dependency resource.
3. Update status/version/metadata dan audit atomik. Role tanpa assignment boleh berubah status.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**deleteRole**
1. Authorize role.delete, resolve tenant ID dan query versionNo.
2. Lock parent row yang sama dengan flow assignment/snapshot; periksa semua mst_user yang masih merujuk role, termasuk nonaktif/soft-deleted. Jika masih dirujuk → 409 ROLE_IN_USE.
3. Set mst_role.deleted_at dan increment version, tulis audit satu transaksi; jangan physical DELETE/cascade/purge.
4. Return 204; nama tetap reserved.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji All checkbox hanya aksi valid, tenant.* tidak dapat di-grant, role assigned inactive user tetap tidak dapat dihapus/nonaktif.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement ROL-05: Delete & Change Status Role. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ano-01"></a>
## ANO-01 — Halaman List Anomali

| Field | Detail |
|---|---|
| Group | MASTER ANOMALI |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | LGN-03 |
| Blocks | ANO-02, ANO-03 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ano/, apps/api/src/modules/ano/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listSeverityLevels](02_SPEC_API.md#listseveritylevels), [listAnomalies](02_SPEC_API.md#listanomalies), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| ERD Ref | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-007, FR-016, FR-017, FR-022, FR-027, FR-031, FR-042 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menampilkan aturan anomali dan tingkat risiko yang digunakan pemeriksaan dokumen. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menampilkan aturan anomali dan tingkat risiko yang digunakan pemeriksaan dokumen.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Search, severity/status filter, sort, pagination, badge aksesibel, dan action permission.
- Integrasi terhadap service: `GET /api/v1/anomalies`, `GET /api/v1/severity-levels`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listSeverityLevels`: List severity catalogue
- `listAnomalies`: List tenant anomalies
- `listFilterOptions`: listFilterOptions

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Halaman List Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listSeverityLevels**
1. Authorize anomaly.view; return lima kode seeded CLEAN/LOW/MEDIUM/HIGH/CRITICAL dan rank 0–4.
2. Read-only, pagination default memuat semua lima; tidak ada endpoint edit severity levels.

**listAnomalies**
1. Verifikasi anomaly.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_anomaly dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**listFilterOptions**
1. Validasi context+field dari matriks yang diizinkan; wajib permission view modul context.
2. Query DISTINCT opsi yang benar-benar ada pada data modul tenant yang boleh dibaca: roles/anomalies/file-categories updatedBy; documents createdBy/updatedBy/category; reviews createdBy/updatedBy/category/severity; audit-logs actor/module/action. Kombinasi lain → 422.
3. Return value/label dengan pagination; tidak mengembalikan email, full user list, atau permission yang tidak diperlukan.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji anomaly aktif menjadi snapshot; edit/nonaktif tidak mengubah snapshot berjalan/historis; dependency snapshot memblokir delete.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/severity-levels
```

### Prompt implementasi
```text
Implement ANO-01: Halaman List Anomali. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ano-02"></a>
## ANO-02 — View Only Anomali

| Field | Detail |
|---|---|
| Group | MASTER ANOMALI |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | ANO-01 |
| Blocks | ANO-04 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ano/, apps/api/src/modules/ano/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getAnomaly](02_SPEC_API.md#getanomaly) |
| ERD Ref | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-016 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menjelaskan definisi anomali dan severity sebelum diubah. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menjelaskan definisi anomali dan severity sebelum diubah.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Detail read-only field anomali sesuai FSD, severity, status, dan metadata audit yang diizinkan. Kontrak tidak memiliki endpoint detail khusus; gunakan record list atau lookup service yang sama tanpa membuat endpoint Monday baru.
- Integrasi terhadap service: Read model dari `GET /api/v1/anomalies`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getAnomaly`: getAnomaly

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur View Only Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getAnomaly**
1. Periksa anomaly.view; cari ID pada tenant sendiri dan belum deleted.
2. Return anomaly detail dan metadata lengkap; 404 bila tidak ada, tanpa mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji anomaly aktif menjadi snapshot; edit/nonaktif tidak mengubah snapshot berjalan/historis; dependency snapshot memblokir delete.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/anomalies/{id}
```

### Prompt implementasi
```text
Implement ANO-02: View Only Anomali. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ano-03"></a>
## ANO-03 — Add Anomali

| Field | Detail |
|---|---|
| Group | MASTER ANOMALI |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | ANO-01 |
| Blocks | ANO-05, SUB-03 |
| Critical Path | Ya — jalur domain utama |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ano/, apps/api/src/modules/ano/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listSeverityLevels](02_SPEC_API.md#listseveritylevels), [createAnomaly](02_SPEC_API.md#createanomaly) |
| ERD Ref | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| Requirement Ref | FR-016, FR-017 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menambahkan aturan anomali yang akan berlaku untuk analisis baru. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menambahkan aturan anomali yang akan berlaku untuk analisis baru.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form field sesuai FSD, pilihan severity, validasi, duplicate feedback, sukses/refetch.
- Integrasi terhadap service: `POST /api/v1/anomalies`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listSeverityLevels`: List severity catalogue
- `createAnomaly`: Create tenant anomaly

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Add Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listSeverityLevels**
1. Authorize anomaly.view; return lima kode seeded CLEAN/LOW/MEDIUM/HIGH/CRITICAL dan rank 0–4.
2. Read-only, pagination default memuat semua lima; tidak ada endpoint edit severity levels.

**createAnomaly**
1. Verifikasi anomaly.add dan scope tenant. Validasi Detail 255 unik tenant, severityCode salah satu lima kode.
2. Lock target/parent terkait; cek uniqueness atomik dan create UUID server.
3. Tulis mst_anomaly, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Anomaly change diserialkan bersama snapshot job; tidak mengubah snapshot sebelumnya.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji anomaly aktif menjadi snapshot; edit/nonaktif tidak mengubah snapshot berjalan/historis; dependency snapshot memblokir delete.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/severity-levels
```

### Prompt implementasi
```text
Implement ANO-03: Add Anomali. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ano-04"></a>
## ANO-04 — Edit Anomali

| Field | Detail |
|---|---|
| Group | MASTER ANOMALI |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | ANO-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ano/, apps/api/src/modules/ano/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateAnomaly](02_SPEC_API.md#updateanomaly) |
| ERD Ref | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| Requirement Ref | FR-016, FR-017 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memperbarui definisi/severity anomali untuk pemeriksaan berikutnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memperbarui definisi/severity anomali untuk pemeriksaan berikutnya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form prefilled, severity, warning dampak hanya untuk analisis baru, version conflict, toast/refetch.
- Integrasi terhadap service: `PATCH /api/v1/anomalies/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateAnomaly`: Update tenant anomaly

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Edit Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateAnomaly**
1. Verifikasi anomaly.edit dan scope tenant. Validasi Detail 255 unik tenant, severityCode salah satu lima kode.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_anomaly, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Anomaly change diserialkan bersama snapshot job; tidak mengubah snapshot sebelumnya.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji anomaly aktif menjadi snapshot; edit/nonaktif tidak mengubah snapshot berjalan/historis; dependency snapshot memblokir delete.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1,
  "severityCode": "CLEAN"
}
```

### Prompt implementasi
```text
Implement ANO-04: Edit Anomali. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="ano-05"></a>
## ANO-05 — Delete & Change Status Anomali

| Field | Detail |
|---|---|
| Group | MASTER ANOMALI |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | ANO-03 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/ano/, apps/api/src/modules/ano/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateAnomalyStatus](02_SPEC_API.md#updateanomalystatus), [deleteAnomaly](02_SPEC_API.md#deleteanomaly) |
| ERD Ref | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| Requirement Ref | FR-016, FR-017, FR-018 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menghentikan pemakaian anomaly atau menghapus record yang aman dilepas. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menghentikan pemakaian anomaly atau menghapus record yang aman dilepas.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Dialog aktif/nonaktif/delete, dampak terhadap job baru dan riwayat, conflict guidance.
- Integrasi terhadap service: `PATCH /api/v1/anomalies/{id}/status`; `DELETE /api/v1/anomalies/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateAnomalyStatus`: Activate or deactivate anomaly
- `deleteAnomaly`: Delete unused anomaly

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Delete & Change Status Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateAnomalyStatus**
1. Authorize anomaly.edit dalam scope tenant; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Validasi current version dan dependency resource.
3. Update status/version/metadata dan audit atomik. Anomaly/category nonaktif hanya mempengaruhi job/selection baru; snapshot/history tidak berubah.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**deleteAnomaly**
1. Authorize anomaly.delete, resolve tenant ID dan query versionNo.
2. Lock parent row yang sama dengan flow assignment/snapshot; periksa semua snapshot analysis dan finding aktif/historis. Jika masih dirujuk → 409 ANOMALY_IN_USE.
3. Set mst_anomaly.deleted_at dan increment version, tulis audit satu transaksi; jangan physical DELETE/cascade/purge.
4. Return 204; nama tetap reserved.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji anomaly aktif menjadi snapshot; edit/nonaktif tidak mengubah snapshot berjalan/historis; dependency snapshot memblokir delete.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement ANO-05: Delete & Change Status Anomali. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="kat-01"></a>
## KAT-01 — Halaman List Kategori File

| Field | Detail |
|---|---|
| Group | MASTER KATEGORI FILE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | LGN-03 |
| Blocks | KAT-02, KAT-03 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/kat/, apps/api/src/modules/kat/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listFileCategories](02_SPEC_API.md#listfilecategories), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| ERD Ref | mst_file_category, trn_document; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-007, FR-019, FR-020, FR-022, FR-027, FR-031, FR-042 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menampilkan kategori yang dapat digunakan saat pengiriman dokumen. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menampilkan kategori yang dapat digunakan saat pengiriman dokumen.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Tabel kategori tenant dengan search, status, sort, pagination, dan action permission.
- Integrasi terhadap service: `GET /api/v1/file-categories`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listFileCategories`: List file categories
- `listFilterOptions`: listFilterOptions

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Halaman List Kategori File selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listFileCategories**
1. Verifikasi file_category.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_file_category dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**listFilterOptions**
1. Validasi context+field dari matriks yang diizinkan; wajib permission view modul context.
2. Query DISTINCT opsi yang benar-benar ada pada data modul tenant yang boleh dibaca: roles/anomalies/file-categories updatedBy; documents createdBy/updatedBy/category; reviews createdBy/updatedBy/category/severity; audit-logs actor/module/action. Kombinasi lain → 422.
3. Return value/label dengan pagination; tidak mengembalikan email, full user list, atau permission yang tidak diperlukan.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji kategori nonaktif hilang dari lookup upload; rename tidak mengubah snapshot histori; delete dengan dokumen tertolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/file-categories
```

### Prompt implementasi
```text
Implement KAT-01: Halaman List Kategori File. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="kat-02"></a>
## KAT-02 — View Only Kategori File

| Field | Detail |
|---|---|
| Group | MASTER KATEGORI FILE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | KAT-01 |
| Blocks | KAT-04 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/kat/, apps/api/src/modules/kat/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getFileCategory](02_SPEC_API.md#getfilecategory) |
| ERD Ref | mst_file_category, trn_document; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-019 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menampilkan informasi kategori dan status penggunaannya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menampilkan informasi kategori dan status penggunaannya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Detail kategori read-only, status, metadata, dan action yang diizinkan.
- Integrasi terhadap service: `GET /api/v1/file-categories/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getFileCategory`: Get file category detail

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur View Only Kategori File selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getFileCategory**
1. Verifikasi file_category.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_file_category dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji kategori nonaktif hilang dari lookup upload; rename tidak mengubah snapshot histori; delete dengan dokumen tertolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/file-categories/{id}
```

### Prompt implementasi
```text
Implement KAT-02: View Only Kategori File. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="kat-03"></a>
## KAT-03 — Add Kategori File

| Field | Detail |
|---|---|
| Group | MASTER KATEGORI FILE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | KAT-01 |
| Blocks | KAT-05, SUB-01 |
| Critical Path | Ya — jalur domain utama |
| Risk | Sedang |
| Files Scope | apps/web/src/features/kat/, apps/api/src/modules/kat/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [createFileCategory](02_SPEC_API.md#createfilecategory) |
| ERD Ref | mst_file_category, trn_document; tabel pendukung pada ERD final |
| Requirement Ref | FR-019 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menambahkan kategori baru untuk pengelompokan dokumen. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menambahkan kategori baru untuk pengelompokan dokumen.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form field kategori sesuai FSD, validasi, duplicate feedback, loading, sukses/refetch.
- Integrasi terhadap service: `POST /api/v1/file-categories`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `createFileCategory`: Create file category

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Add Kategori File selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**createFileCategory**
1. Verifikasi file_category.add dan scope tenant. Validasi Nama 100 unik tenant.
2. Lock target/parent terkait; cek uniqueness atomik dan create UUID server.
3. Tulis mst_file_category, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. 
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji kategori nonaktif hilang dari lookup upload; rename tidak mengubah snapshot histori; delete dengan dokumen tertolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens"
}
```

### Prompt implementasi
```text
Implement KAT-03: Add Kategori File. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="kat-04"></a>
## KAT-04 — Edit Kategori File

| Field | Detail |
|---|---|
| Group | MASTER KATEGORI FILE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | KAT-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/kat/, apps/api/src/modules/kat/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateFileCategory](02_SPEC_API.md#updatefilecategory) |
| ERD Ref | mst_file_category, trn_document; tabel pendukung pada ERD final |
| Requirement Ref | FR-019 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memperbarui nama/informasi kategori tanpa mengubah dokumen historis. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memperbarui nama/informasi kategori tanpa mengubah dokumen historis.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Form prefilled, dirty warning, duplicate/stale conflict, toast, dan refresh.
- Integrasi terhadap service: `PATCH /api/v1/file-categories/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateFileCategory`: Update file category

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Edit Kategori File selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateFileCategory**
1. Verifikasi file_category.edit dan scope tenant. Validasi Nama 100 unik tenant.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_file_category, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. 
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji kategori nonaktif hilang dari lookup upload; rename tidak mengubah snapshot histori; delete dengan dokumen tertolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement KAT-04: Edit Kategori File. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="kat-05"></a>
## KAT-05 — Delete & Change Status Kategori File

| Field | Detail |
|---|---|
| Group | MASTER KATEGORI FILE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | KAT-03 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/kat/, apps/api/src/modules/kat/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateFileCategoryStatus](02_SPEC_API.md#updatefilecategorystatus), [deleteFileCategory](02_SPEC_API.md#deletefilecategory) |
| ERD Ref | mst_file_category, trn_document; tabel pendukung pada ERD final |
| Requirement Ref | FR-019, FR-020, FR-021 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menghentikan penggunaan kategori pada upload baru atau menghapus yang belum dipakai. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menghentikan penggunaan kategori pada upload baru atau menghapus yang belum dipakai.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Dialog status/delete dengan dampak terhadap pilihan upload dan konflik dokumen existing.
- Integrasi terhadap service: `PATCH /api/v1/file-categories/{id}/status`; `DELETE /api/v1/file-categories/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateFileCategoryStatus`: Activate or deactivate file category
- `deleteFileCategory`: Delete unused file category

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Delete & Change Status Kategori File selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateFileCategoryStatus**
1. Authorize file_category.edit dalam scope tenant; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Validasi current version dan dependency resource.
3. Update status/version/metadata dan audit atomik. Anomaly/category nonaktif hanya mempengaruhi job/selection baru; snapshot/history tidak berubah.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**deleteFileCategory**
1. Authorize file_category.delete, resolve tenant ID dan query versionNo.
2. Lock parent row yang sama dengan flow assignment/snapshot; periksa semua dokumen yang merujuk kategori. Jika masih dirujuk → 409 CATEGORY_IN_USE.
3. Set mst_file_category.deleted_at dan increment version, tulis audit satu transaksi; jangan physical DELETE/cascade/purge.
4. Return 204; nama tetap reserved.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji kategori nonaktif hilang dari lookup upload; rename tidak mengubah snapshot histori; delete dengan dokumen tertolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement KAT-05: Delete & Change Status Kategori File. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="sub-01"></a>
## SUB-01 — Form Submit Document

| Field | Detail |
|---|---|
| Group | SUBMIT DOCUMENT |
| Status | OPEN |
| Story Point | FE 1 + BE 0.5 = 1.5 SP (6 jam) |
| Depends On | KAT-03 |
| Blocks | SUB-02 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/sub/, apps/api/src/modules/sub/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listUploadCategories](02_SPEC_API.md#listuploadcategories) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis, trn_outbox_event; tabel pendukung pada ERD final |
| Requirement Ref | FR-020, FR-023 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memudahkan submitter memilih file dan informasi dokumen sebelum dikirim. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memudahkan submitter memilih file dan informasi dokumen sebelum dikirim.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Drag-drop/file picker, kategori aktif, nomor dokumen opsional sesuai kontrak, ringkasan file, validasi awal PDF/ukuran, reset/cancel, dan aksesibilitas.
- Integrasi terhadap service: Lookup `GET /api/v1/file-categories`; kontrak multipart `POST /documents`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listUploadCategories`: listUploadCategories

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Form Submit Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listUploadCategories**
1. Authorize document.add OR document.edit; jangan mensyaratkan file_category.view.
2. Return kategori aktif tenant sendiri yang tidak deleted, pagination 20/100. Tidak memberi akses mengubah master.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji 20 MiB/100 halaman, MIME spoof/encrypted/malware, scan outage, duplicate upload, restart worker, 3-attempt DLQ, snapshot benar-benar diterapkan dan tenant-scoped candidate.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/document-options/categories
```

### Prompt implementasi
```text
Implement SUB-01: Form Submit Document. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="sub-02"></a>
## SUB-02 — Upload & Validasi Dokumen

| Field | Detail |
|---|---|
| Group | SUBMIT DOCUMENT |
| Status | OPEN |
| Story Point | FE 2 + BE 3 = 5 SP (20 jam) |
| Depends On | SUB-01, FND-04 |
| Blocks | SUB-03, BUC-01, NOT-01 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/sub/, apps/api/src/modules/sub/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [createDocument](02_SPEC_API.md#createdocument) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis, trn_outbox_event; tabel pendukung pada ERD final |
| Requirement Ref | FR-023, FR-024 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Mengirim dokumen sekali dengan progres dan hasil validasi yang jelas. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Mengirim dokumen sekali dengan progres dan hasil validasi yang jelas.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Multipart submit, idempotency key per pengiriman logis, progress, cancel sebelum commit, retry aman, serta pesan PDF malformed/encrypted/infected/over-limit.
- Integrasi terhadap service: `POST /api/v1/documents`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `createDocument`: Upload and submit PDF

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Upload & Validasi Dokumen selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**createDocument**
1. Periksa permission document.add, auth scope, dan Idempotency-Key; hash metadata+SHA256 file. Key sama/payload beda → 409. Key completed sama → response awal setelah otorisasi ulang.
2. Validasi nama 100 dan kategori aktif untuk create; replacement wajib versionNo dan status OPEN. Stream PDF maksimal 20971520 byte; cek signature/MIME, parser 1–100 halaman dan tidak encrypted. Tolak format/size invalid 413/415/422.
3. Simpan private immutable object di quarantine. Dalam transaksi recheck category/status/version/unique name; create document/version ANALYZE dengan scan PENDING, create analysis QUEUED + category/anomaly/candidate snapshot, audit dan outbox scan-request. Selesai idempotency bersama commit.
4. Return 202 Document DTO; 202 berarti diterima untuk scan/AI, belum dinyatakan CLEAN. Scan job ClamAV harus CLEAN sebelum outbox analysis-request dibuat. INFECTED/ERROR terminal → processing FAILED, tanpa akses bytes; status bisnis tetap ANALYZE.
5. Worker memproses snapshot; hasil diterima hanya untuk lease aktif/current version. Commit analysis COMPLETED+findings+similarities dan document OPEN satu transaksi. Retry 30/120 detik, attempt 15 menit, max 3 lalu DLQ.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji 20 MiB/100 halaman, MIME spoof/encrypted/malware, scan outage, duplicate upload, restart worker, 3-attempt DLQ, snapshot benar-benar diterapkan dan tenant-scoped candidate.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "file": "<binary PDF>",
  "fileCategoryId": "00000000-0000-4000-8000-000000000001",
  "documentName": "Contoh FinLens"
}
```

### Prompt implementasi
```text
Implement SUB-02: Upload & Validasi Dokumen. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="sub-03"></a>
## SUB-03 — Status Pengiriman & Proses Analisis

| Field | Detail |
|---|---|
| Group | SUBMIT DOCUMENT |
| Status | OPEN |
| Story Point | FE 1 + BE 8 = 9 SP (36 jam) |
| Depends On | SUB-02, ANO-03 |
| Blocks | BUC-03, REV-01, DSH-01 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/sub/, apps/api/src/modules/sub/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getDocument](02_SPEC_API.md#getdocument) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis, trn_outbox_event; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-022, FR-025 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memberi kepastian bahwa dokumen sedang dianalisis atau mengalami kegagalan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memberi kepastian bahwa dokumen sedang dianalisis atau mengalami kegagalan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Status `ANALYZE`, progress bila tersedia, bounded polling/subscription, terminal `OPEN` atau `FAILED`, last update, dan arahan kegagalan tanpa tombol retry user Phase 1.
- Integrasi terhadap service: Document status read model + queue worker.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getDocument`: Get document detail

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Status Pengiriman & Proses Analisis selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getDocument**
1. Authorize document.view, tenant dari session.
2. Query dokumen non-deleted; Bucket dapat melihat active/non-active dan semua business state. Resolve ID scope tenant atau 404.
3. Return Document DTO termasuk scanStatus dan currentAnalysis.processingStatus; no signed URL/bytes/raw engine result. Polling tidak menulis mutation audit atau memperpanjang idle.

### Checkpoint implementasi AI (di dalam subitem yang sama)
- [ ] A — Worker claim/lease/fencing dan synthetic fixture: 1 BE SP. Bukti: dua worker tidak menerima lease aktif yang sama.
- [ ] B — OCR/tamper adapter existing dan category snapshot: 2 BE SP. Bukti: output fixture/reference terpelihara, kategori dipakai pada pemilihan skema.
- [ ] C — Dynamic anomaly snapshot evaluation: 2 BE SP. Bukti: rule baru dievaluasi; nonaktif setelah job dibuat tidak mengubah job tersebut.
- [ ] D — Historical similarity + few-shot candidates tenant scoped: 1 BE SP. Bukti: kandidat tenant lain dan versi baru sesudah cutoff tidak masuk.
- [ ] E — Result transaction/normalization/idempotency: 1 BE SP. Bukti: hasil duplikat identik tidak menggandakan finding/event dan late result ditolak.
- [ ] F — Timeout/retry/DLQ regression: 1 BE SP. Bukti: tiga attempts 15 menit lalu FAILED/DLQ, dokumen tetap ANALYZE.
- [ ] G — FE polling, scan/AI progress, failed state: 1 FE SP. Bukti: polling berhenti saat hidden/session invalid/selesai dan tidak memperpanjang idle.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji 20 MiB/100 halaman, MIME spoof/encrypted/malware, scan outage, duplicate upload, restart worker, 3-attempt DLQ, snapshot benar-benar diterapkan dan tenant-scoped candidate.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents/{id}
```

### Prompt implementasi
```text
Implement SUB-03: Status Pengiriman & Proses Analisis. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="buc-01"></a>
## BUC-01 — Halaman List Bucket Document

| Field | Detail |
|---|---|
| Group | BUCKET DOCUMENT |
| Status | OPEN |
| Story Point | FE 1 + BE 1 = 2 SP (8 jam) |
| Depends On | SUB-02 |
| Blocks | BUC-02 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/buc/, apps/api/src/modules/buc/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listDocuments](02_SPEC_API.md#listdocuments), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-007, FR-022, FR-027, FR-031, FR-042 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menampilkan seluruh dokumen tenant beserta status bisnis dan analisisnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menampilkan seluruh dokumen tenant beserta status bisnis dan analisisnya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Search, kategori, status, tanggal, sort, pagination, dua badge terpisah untuk status dokumen dan processing, serta action permission/state.
- Integrasi terhadap service: `GET /api/v1/documents`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listDocuments`: List tenant documents
- `listFilterOptions`: listFilterOptions

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Halaman List Bucket Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listDocuments**
1. Authorize document.view, tenant dari session.
2. Query dokumen non-deleted; Bucket dapat melihat active/non-active dan semua business state. Filter/sort/pagination dengan count predicate sama.
3. Return Document DTO termasuk scanStatus dan currentAnalysis.processingStatus; no signed URL/bytes/raw engine result. Polling tidak menulis mutation audit atau memperpanjang idle.

**listFilterOptions**
1. Validasi context+field dari matriks yang diizinkan; wajib permission view modul context.
2. Query DISTINCT opsi yang benar-benar ada pada data modul tenant yang boleh dibaca: roles/anomalies/file-categories updatedBy; documents createdBy/updatedBy/category; reviews createdBy/updatedBy/category/severity; audit-logs actor/module/action. Kombinasi lain → 422.
3. Return value/label dengan pagination; tidak mengembalikan email, full user list, atau permission yang tidak diperlukan.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji OPEN vs ANALYZE/CHECKED, stale version, ganti kategori/PDF memicu analysis baru, preview CLEAN dan attachment permission.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents
```

### Prompt implementasi
```text
Implement BUC-01: Halaman List Bucket Document. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="buc-02"></a>
## BUC-02 — View Only Document

| Field | Detail |
|---|---|
| Group | BUCKET DOCUMENT |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | BUC-01 |
| Blocks | BUC-03, BUC-04 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/buc/, apps/api/src/modules/buc/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getDocument](02_SPEC_API.md#getdocument), [downloadDocument](02_SPEC_API.md#downloaddocument), [previewDocument](02_SPEC_API.md#previewdocument), [streamPrivateFile](02_SPEC_API.md#streamprivatefile) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-022, FR-025, FR-027, FR-028, FR-044 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menampilkan metadata dan file dokumen tanpa mengubahnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menampilkan metadata dan file dokumen tanpa mengubahnya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Metadata, versi aktif, status, preview/download action, loading/error/not-found, dan permission.
- Integrasi terhadap service: `GET /api/v1/documents/{id}`, `/download`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getDocument`: Get document detail
- `downloadDocument`: Download authorized private PDF
- `previewDocument`: previewDocument
- `streamPrivateFile`: streamPrivateFile

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur View Only Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getDocument**
1. Authorize document.view, tenant dari session.
2. Query dokumen non-deleted; Bucket dapat melihat active/non-active dan semua business state. Resolve ID scope tenant atau 404.
3. Return Document DTO termasuk scanStatus dan currentAnalysis.processingStatus; no signed URL/bytes/raw engine result. Polling tidak menulis mutation audit atau memperpanjang idle.

**downloadDocument**
1. Authorize document.download dan tenant non-deleted.
2. Resolve current version CLEAN; signed proxy ticket 60 detik dengan disposition attachment.
3. Periksa session dan izin setiap byte request, termasuk Range; append DOWNLOAD_DOCUMENT audit teredaksi, jangan audit URL/token.

**previewDocument**
1. Authorize document.view dan tenant dokumen non-deleted.
2. Resolusi current version CLEAN; scan PENDING/ERROR/INFECTED → 409 FILE_NOT_READY.
3. Return endpoint proxy bertiket 60 detik, inline; proxy rechecks current permission/session pada setiap request termasuk Range. Tidak public URL.

**streamPrivateFile**
1. Validate bearer session dan signed ticket 60 detik: tenant/user/sid/version/disposition/source analysis+match relation semuanya terikat. URL ticket tidak berisi JWT/access token.
2. Periksa ulang permission view/download yang sesuai context, CLEAN, active/non-deleted visibility, source/candidate membership; expired ticket 401, revoked session 401, foreign/missing 404.
3. Stream bytes private object dengan Content-Type application/pdf, Content-Disposition inline/attachment, no-store, Accept-Ranges; valid single Range → 206 Content-Range, unsatisfiable/multiple unsupported range → 416.
4. FE PDF viewer mengambil bytes dengan Authorization header (PDF.js authenticated fetch/worker transport); iframe URL tanpa auth bukan jalur yang didukung. Jangan memperpanjang idle dari background Range/polling.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji OPEN vs ANALYZE/CHECKED, stale version, ganti kategori/PDF memicu analysis baru, preview CLEAN dan attachment permission.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents/{id}
```

### Prompt implementasi
```text
Implement BUC-02: View Only Document. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="buc-03"></a>
## BUC-03 — Edit Metadata & Replace Document

| Field | Detail |
|---|---|
| Group | BUCKET DOCUMENT |
| Status | OPEN |
| Story Point | FE 1 + BE 2 = 3 SP (12 jam) |
| Depends On | BUC-02, SUB-03 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/buc/, apps/api/src/modules/buc/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [updateDocumentMetadata](02_SPEC_API.md#updatedocumentmetadata), [uploadDocumentVersion](02_SPEC_API.md#uploaddocumentversion) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis; tabel pendukung pada ERD final |
| Requirement Ref | FR-023, FR-024, FR-025, FR-026 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memperbaiki metadata atau mengganti PDF dokumen yang masih OPEN. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memperbaiki metadata atau mengganti PDF dokumen yang masih OPEN.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Edit metadata, upload versi pengganti, validasi file/progress, dirty warning, version conflict, dan perubahan status kembali ANALYZE.
- Integrasi terhadap service: `PATCH /api/v1/documents/{id}`; `POST /documents/{id}/versions`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `updateDocumentMetadata`: Update OPEN document metadata
- `uploadDocumentVersion`: Upload replacement PDF version

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Edit Metadata & Replace Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**updateDocumentMetadata**
1. Periksa document.edit, tenant, versionNo dan status OPEN; CHECKED/ANALYZE ditolak 409.
2. Validasi documentName 100 unik; nomor dokumen output engine, tidak boleh diinput. Kategori baru harus aktif.
3. Rename saja: update metadata/version/audit dan return 200. Kategori berubah: snapshot konfigurasi baru, analysis QUEUED pada PDF CLEAN versi yang sama, document ANALYZE + outbox + audit satu transaksi, return 202.
4. Pointer analysis lama tetap ada di histori, tidak boleh dipakai finalize setelah input kategori berubah.

**uploadDocumentVersion**
1. Periksa permission document.edit, auth scope, dan Idempotency-Key; hash metadata+SHA256 file. Key sama/payload beda → 409. Key completed sama → response awal setelah otorisasi ulang.
2. Validasi nama 100 dan kategori aktif untuk create; replacement wajib versionNo dan status OPEN. Stream PDF maksimal 20971520 byte; cek signature/MIME, parser 1–100 halaman dan tidak encrypted. Tolak format/size invalid 413/415/422.
3. Simpan private immutable object di quarantine. Dalam transaksi recheck category/status/version/unique name; create document/version ANALYZE dengan scan PENDING, create analysis QUEUED + category/anomaly/candidate snapshot, audit dan outbox scan-request. Selesai idempotency bersama commit.
4. Return 202 Document DTO; 202 berarti diterima untuk scan/AI, belum dinyatakan CLEAN. Scan job ClamAV harus CLEAN sebelum outbox analysis-request dibuat. INFECTED/ERROR terminal → processing FAILED, tanpa akses bytes; status bisnis tetap ANALYZE.
5. Worker memproses snapshot; hasil diterima hanya untuk lease aktif/current version. Commit analysis COMPLETED+findings+similarities dan document OPEN satu transaksi. Retry 30/120 detik, attempt 15 menit, max 3 lalu DLQ.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji OPEN vs ANALYZE/CHECKED, stale version, ganti kategori/PDF memicu analysis baru, preview CLEAN dan attachment permission.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "documentName": "Contoh FinLens",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement BUC-03: Edit Metadata & Replace Document. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="buc-04"></a>
## BUC-04 — Download, Delete & Change Status Document

| Field | Detail |
|---|---|
| Group | BUCKET DOCUMENT |
| Status | OPEN |
| Story Point | FE 1 + BE 1 = 2 SP (8 jam) |
| Depends On | BUC-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/buc/, apps/api/src/modules/buc/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [downloadDocument](02_SPEC_API.md#downloaddocument), [toggleDocumentActiveStatus](02_SPEC_API.md#toggledocumentactivestatus), [deleteDocument](02_SPEC_API.md#deletedocument) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis; tabel pendukung pada ERD final |
| Requirement Ref | FR-025, FR-026, FR-044 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menjalankan aksi file/lifecycle sesuai status dan kewenangan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menjalankan aksi file/lifecycle sesuai status dan kewenangan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Download, aktif/nonaktif, soft-delete, konfirmasi dampak, loading, permission/status guards, dan refresh.
- Integrasi terhadap service: `GET /download`; `PATCH /status`; `DELETE /documents/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `downloadDocument`: Download authorized private PDF
- `toggleDocumentActiveStatus`: Toggle OPEN document active status
- `deleteDocument`: Delete OPEN document under retention policy

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Download, Delete & Change Status Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**downloadDocument**
1. Authorize document.download dan tenant non-deleted.
2. Resolve current version CLEAN; signed proxy ticket 60 detik dengan disposition attachment.
3. Periksa session dan izin setiap byte request, termasuk Range; append DOWNLOAD_DOCUMENT audit teredaksi, jangan audit URL/token.

**toggleDocumentActiveStatus**
1. Authorize document.edit dan scope tenant; lock document dengan versionNo.
2. Hanya OPEN boleh toggle ACTIVE/NON_ACTIVE; ANALYZE/CHECKED → 409.
3. Set active_flag Y/N dan version/audit. Non-active keluar antrean review/dashboard/candidate; active kembali eligible tanpa reanalysis bila input tetap sama. Return Document.

**deleteDocument**
1. Authorize document.delete dan scope tenant; lock versionNo + status OPEN.
2. Set deleted_at dan version/audit satu transaksi; CHECKED/ANALYZE ditolak 409.
3. PDF/version/analysis/evidence tetap disimpan private, tidak physical purge; target hilang dari list/candidate/view biasa. Return 204.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji OPEN vs ANALYZE/CHECKED, stale version, ganti kategori/PDF memicu analysis baru, preview CLEAN dan attachment permission.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents/{id}/download
```

### Prompt implementasi
```text
Implement BUC-04: Download, Delete & Change Status Document. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rev-01"></a>
## REV-01 — Halaman History Document

| Field | Detail |
|---|---|
| Group | HISTORY / REVIEW DOCUMENT |
| Status | OPEN |
| Story Point | FE 1 + BE 1 = 2 SP (8 jam) |
| Depends On | SUB-03 |
| Blocks | REV-02 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/rev/, apps/api/src/modules/rev/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listReviewHistory](02_SPEC_API.md#listreviewhistory), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis, trn_ai_finding, trn_similarity_match; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-007, FR-022, FR-027, FR-031, FR-042 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Membantu checker menemukan dokumen yang siap atau telah selesai diperiksa. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Membantu checker menemukan dokumen yang siap atau telah selesai diperiksa.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Search, status, severity, anomaly, kategori, tanggal, sort, pagination, summary findings, dan action review.
- Integrasi terhadap service: `GET /api/v1/reviews`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listReviewHistory`: List checker review history
- `listFilterOptions`: listFilterOptions

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Halaman History Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listReviewHistory**
1. Authorize review.view dan tenant; query dokumen active non-deleted termasuk ANALYZE untuk transparansi proses.
2. Filter nama/category/severity/status/createdBy/updatedBy/date; severity hanya current completed result, stable sort/pagination.
3. Return Document list; tidak melakukan finalize, tidak mengubah status atau metadata.

**listFilterOptions**
1. Validasi context+field dari matriks yang diizinkan; wajib permission view modul context.
2. Query DISTINCT opsi yang benar-benar ada pada data modul tenant yang boleh dibaca: roles/anomalies/file-categories updatedBy; documents createdBy/updatedBy/category; reviews createdBy/updatedBy/category/severity; audit-logs actor/module/action. Kombinasi lain → 422.
3. Return value/label dengan pagination; tidak mengembalikan email, full user list, atau permission yang tidak diperlukan.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji stale analysis finalize vs replacement, dua finalisasi serentak, candidate ID buatan, izin download terpisah dan semua mutasi CHECKED ditolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews
```

### Prompt implementasi
```text
Implement REV-01: Halaman History Document. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rev-02"></a>
## REV-02 — Detail Hasil Analisis

| Field | Detail |
|---|---|
| Group | HISTORY / REVIEW DOCUMENT |
| Status | OPEN |
| Story Point | FE 1 + BE 1 = 2 SP (8 jam) |
| Depends On | REV-01 |
| Blocks | REV-03, DSH-03, NOT-02 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/rev/, apps/api/src/modules/rev/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getReviewDetail](02_SPEC_API.md#getreviewdetail), [getReviewFile](02_SPEC_API.md#getreviewfile) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis, trn_ai_finding, trn_similarity_match; tabel pendukung pada ERD final |
| Requirement Ref | FR-027, FR-028, FR-043, FR-044 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menyajikan metadata, hasil ekstraksi, temuan, severity, dan bukti untuk pemeriksaan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menyajikan metadata, hasil ekstraksi, temuan, severity, dan bukti untuk pemeriksaan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- PDF preview, metadata/version, extracted fields, findings, lokasi halaman/evidence, confidence, rekomendasi, loading/error, dan read-only CHECKED.
- Integrasi terhadap service: `GET /api/v1/reviews/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getReviewDetail`: Get review detail, findings, and evidence
- `getReviewFile`: getReviewFile

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Detail Hasil Analisis selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getReviewDetail**
1. Authorize review.view, resolve active non-deleted tenant document; foreign/inactive/deleted → 404.
2. Resolve current analysis dan versi, atau checked_analysis_id untuk CHECKED. Findings/extractedData hanya dari analysis COMPLETED; untuk ANALYZE/FAILED return empty findings/data dan canFinalize=false.
3. Return ReviewDetail dengan canFinalize berdasarkan izin review.edit + active OPEN + current completed, canDownload berdasarkan review.download. Tidak menulis CHECKED. Catat REVIEW_DOCUMENT access audit terdeduplikasi, bukan mutation.

**getReviewFile**
1. Authorize review.view; untuk attachment juga wajib review.download.
2. Tanpa matchId gunakan source current/checked version; dengan matchId hanya candidate version pada similarity tersimpan dari analisis source. Validasi tenant, membership dan visibility kedua dokumen.
3. Return endpoint proxy bertiket 60 detik inline/attachment; proxy mengecek permission/session dan CLEAN pada setiap Range request. Download dicatat audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji stale analysis finalize vs replacement, dua finalisasi serentak, candidate ID buatan, izin download terpisah dan semua mutasi CHECKED ditolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews/{id}
```

### Prompt implementasi
```text
Implement REV-02: Detail Hasil Analisis. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rev-03"></a>
## REV-03 — Similarity & Compare Document

| Field | Detail |
|---|---|
| Group | HISTORY / REVIEW DOCUMENT |
| Status | OPEN |
| Story Point | FE 2 + BE 3 = 5 SP (20 jam) |
| Depends On | REV-02 |
| Blocks | REV-04 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/rev/, apps/api/src/modules/rev/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listReviewSimilarities](02_SPEC_API.md#listreviewsimilarities), [compareReviewDocument](02_SPEC_API.md#comparereviewdocument), [getReviewFile](02_SPEC_API.md#getreviewfile) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis, trn_ai_finding, trn_similarity_match; tabel pendukung pada ERD final |
| Requirement Ref | FR-027, FR-028, FR-044 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Membantu checker memahami kemiripan dokumen dan membandingkan bukti. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Membantu checker memahami kemiripan dokumen dan membandingkan bukti.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Kandidat similarity, match type, score opsional, severity, signals/explanation, side-by-side PDF, navigasi halaman sinkron/mandiri, dan download sesuai izin.
- Integrasi terhadap service: `GET /reviews/{id}/similarities`; `GET /compare/{matchDocumentId}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listReviewSimilarities`: List similarity recommendations
- `compareReviewDocument`: Get side-by-side comparison data
- `getReviewFile`: getReviewFile

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Similarity & Compare Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listReviewSimilarities**
1. Authorize review.view pada dokumen source active/non-deleted.
2. Ambil matches dari current completed/checked analysis dan snapshot exact candidate versions; filter candidate yang kini tidak authorized/active/non-deleted.
3. Return pagination Similarity DTO; score nullable bila engine tidak memberi metrik, jangan mengarang persentase. Tidak menulis status dokumen.

**compareReviewDocument**
1. Authorize review.view dan kedua resource tenant sama.
2. matchDocumentId wajib anggota similarity source current/checked analysis; jika kandidat buatan atau versi tidak terkait → 404.
3. Return source/candidate metadata dan exact sourceVersionId/candidateVersionId historis. Berkas dibuka melalui getReviewFile matchId, bukan mengambil file kandidat current terbaru.

**getReviewFile**
1. Authorize review.view; untuk attachment juga wajib review.download.
2. Tanpa matchId gunakan source current/checked version; dengan matchId hanya candidate version pada similarity tersimpan dari analisis source. Validasi tenant, membership dan visibility kedua dokumen.
3. Return endpoint proxy bertiket 60 detik inline/attachment; proxy mengecek permission/session dan CLEAN pada setiap Range request. Download dicatat audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji stale analysis finalize vs replacement, dua finalisasi serentak, candidate ID buatan, izin download terpisah dan semua mutasi CHECKED ditolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews/{id}/similarities
```

### Prompt implementasi
```text
Implement REV-03: Similarity & Compare Document. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="rev-04"></a>
## REV-04 — Finalisasi Review Document

| Field | Detail |
|---|---|
| Group | HISTORY / REVIEW DOCUMENT |
| Status | OPEN |
| Story Point | FE 1 + BE 3 = 4 SP (16 jam) |
| Depends On | REV-03 |
| Blocks | QA-01 |
| Critical Path | Ya — jalur domain utama |
| Risk | Tinggi |
| Files Scope | apps/web/src/features/rev/, apps/api/src/modules/rev/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [finalizeReview](02_SPEC_API.md#finalizereview) |
| ERD Ref | trn_document, trn_document_version, trn_ai_analysis, trn_ai_finding, trn_similarity_match; tabel pendukung pada ERD final |
| Requirement Ref | FR-026, FR-029 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memastikan checker sengaja mengunci hasil review menjadi final. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memastikan checker sengaja mengunci hasil review menjadi final.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Tombol permission-based, precondition summary, dialog finalisasi, loading, success redirect/refetch, dan conflict handling.
- Integrasi terhadap service: `POST /api/v1/reviews/{id}/finalize`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `finalizeReview`: Finalize OPEN document as immutable CHECKED

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Finalisasi Review Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**finalizeReview**
1. Validasi review.edit, tenant dan Idempotency-Key; duplicate completed sama di-replay setelah auth.
2. Lock document; wajib OPEN, ACTIVE, current version CLEAN, versionNo cocok dan analysisId adalah current COMPLETED analysis milik dokumen/version tersebut.
3. Set CHECKED, checkedAnalysisId/checkedBy/checkedAt/comment dan metadata; append audit + notification outbox + idempotency response satu transaksi.
4. Return Document; stale version/analysis, inactive, ANALYZE atau already CHECKED dengan key berbeda → 409 tanpa perubahan. Trigger mempertahankan immutable terminal state.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji stale analysis finalize vs replacement, dua finalisasi serentak, candidate ID buatan, izin download terpisah dan semua mutasi CHECKED ditolak.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "analysisId": "00000000-0000-4000-8000-000000000001",
  "versionNo": 1
}
```

### Prompt implementasi
```text
Implement REV-04: Finalisasi Review Document. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="log-01"></a>
## LOG-01 — Halaman List Activity Log

| Field | Detail |
|---|---|
| Group | ACTIVITY LOG USER |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | LGN-03 |
| Blocks | LOG-02 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/log/, apps/api/src/modules/log/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listAuditLogs](02_SPEC_API.md#listauditlogs), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| ERD Ref | trn_audit_log, trn_outbox_event; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-007, FR-022, FR-027, FR-030, FR-031, FR-042, FR-045 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Membantu pihak berwenang menelusuri aktivitas pengguna dan perubahan data. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Membantu pihak berwenang menelusuri aktivitas pengguna dan perubahan data.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Search/filter actor, action, module/entity, outcome, date, sort, pagination, dan redaction indicator.
- Integrasi terhadap service: `GET /api/v1/audit-logs`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listAuditLogs`: List immutable activity logs
- `listFilterOptions`: listFilterOptions

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Halaman List Activity Log selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listAuditLogs**
1. Authorize audit.view dan tenant session.
2. Query append-only audit, filter search pada snapshot actor/module/action, actor/module/action/date dan stable paging.
3. Return redacted DTO snapshot actor/role/target dan before/after. Tidak ada create/update/delete/export endpoint dan read tidak menulis mutation audit.

**listFilterOptions**
1. Validasi context+field dari matriks yang diizinkan; wajib permission view modul context.
2. Query DISTINCT opsi yang benar-benar ada pada data modul tenant yang boleh dibaca: roles/anomalies/file-categories updatedBy; documents createdBy/updatedBy/category; reviews createdBy/updatedBy/category/severity; audit-logs actor/module/action. Kombinasi lain → 422.
3. Return value/label dengan pagination; tidak mengembalikan email, full user list, atau permission yang tidak diperlukan.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji filter actor/module/action/date, redaction, actor name snapshot, append-only dan penolakan edit/delete melalui runtime DB role.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/audit-logs
```

### Prompt implementasi
```text
Implement LOG-01: Halaman List Activity Log. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="log-02"></a>
## LOG-02 — View Detail Activity Log

| Field | Detail |
|---|---|
| Group | ACTIVITY LOG USER |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | LOG-01 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/log/, apps/api/src/modules/log/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getAuditLog](02_SPEC_API.md#getauditlog) |
| ERD Ref | trn_audit_log, trn_outbox_event; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-030, FR-031, FR-045 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menjelaskan siapa melakukan apa, kapan, dan perubahan aman sebelum/sesudah. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menjelaskan siapa melakukan apa, kapan, dan perubahan aman sebelum/sesudah.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Ringkasan actor/action/entity/time/outcome/correlation, diff before-after yang mudah dibaca, dan redaction marker.
- Integrasi terhadap service: `GET /api/v1/audit-logs/{id}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getAuditLog`: Get immutable activity detail

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur View Detail Activity Log selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getAuditLog**
1. Authorize audit.view dan tenant session.
2. Query append-only audit, ID tenant terkait atau 404.
3. Return redacted DTO snapshot actor/role/target dan before/after. Tidak ada create/update/delete/export endpoint dan read tidak menulis mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji filter actor/module/action/date, redaction, actor name snapshot, append-only dan penolakan edit/delete melalui runtime DB role.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/audit-logs/{id}
```

### Prompt implementasi
```text
Implement LOG-02: View Detail Activity Log. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="dsh-01"></a>
## DSH-01 — Ringkasan Dashboard

| Field | Detail |
|---|---|
| Group | DASHBOARD |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | SUB-03 |
| Blocks | DSH-02, DSH-03 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/dsh/, apps/api/src/modules/dsh/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getDashboard](02_SPEC_API.md#getdashboard) |
| ERD Ref | trn_document, trn_ai_analysis, trn_ai_finding; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-032, FR-033, FR-034, FR-035 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memberikan gambaran cepat jumlah dokumen dan status proses. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memberikan gambaran cepat jumlah dokumen dan status proses.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Kartu total, ANALYZE, OPEN, CHECKED, last refreshed, loading/empty/error, dan navigation bila disetujui.
- Integrasi terhadap service: `GET /api/v1/dashboard` — summary projection.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getDashboard`: Get tenant dashboard snapshot

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Ringkasan Dashboard selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getDashboard**
1. Authorize dashboard.view; filter submitted date from/to inklusif UI → [start,nextDay) UTC Asia/Jakarta, default All Time.
2. Gunakan satu snapshot transaksi read-only: total dokumen aktif non-deleted; analyze/open/checked harus menjumlah total. OPEN/CHECKED percent = jumlah/total*100, denominator 0 → 0.
3. Severity hanya latest COMPLETED current analysis per dokumen; tanpa hasil tidak dihitung CLEAN. Mapping engine HIGH RISK→HIGH, MEDIUM RISK→MEDIUM, LOW RISK→LOW.
4. Kelengkapan nomor memakai document_info.invoice_number trim; completed with/without; unknown untuk belum completed. with+without+unknown=total; persen kelengkapan memakai analyzedTotal, nol→0. Persist flag anomali engine INVOICE_TANPA_NOMOR sebagai evidence terpisah, bukan pengganti nomor hasil ekstraksi.
5. Return ringkasan+missing-number page+snapshotAt; chart scale dinamis. Refresh tanpa full reload; hidden tab hentikan polling.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji empty denominator, status sum, pending bukan CLEAN/missing, current completed analysis saja, filter UTC/Jakarta dan coherent snapshot.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
```

### Prompt implementasi
```text
Implement DSH-01: Ringkasan Dashboard. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="dsh-02"></a>
## DSH-02 — Grafik Risiko & Kelengkapan Dokumen

| Field | Detail |
|---|---|
| Group | DASHBOARD |
| Status | OPEN |
| Story Point | FE 1 + BE 1 = 2 SP (8 jam) |
| Depends On | DSH-01 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/dsh/, apps/api/src/modules/dsh/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getDashboard](02_SPEC_API.md#getdashboard) |
| ERD Ref | trn_document, trn_ai_analysis, trn_ai_finding; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-032, FR-033, FR-034, FR-035 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Menunjukkan distribusi severity dan dokumen yang belum memiliki nomor. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Menunjukkan distribusi severity dan dokumen yang belum memiliki nomor.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Severity chart, completeness/missing-number chart/list, legend, tooltip, table alternatif, empty state, dan drilldown.
- Integrasi terhadap service: `GET /api/v1/dashboard` — risk/completeness projection.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getDashboard`: Get tenant dashboard snapshot

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Grafik Risiko & Kelengkapan Dokumen selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getDashboard**
1. Authorize dashboard.view; filter submitted date from/to inklusif UI → [start,nextDay) UTC Asia/Jakarta, default All Time.
2. Gunakan satu snapshot transaksi read-only: total dokumen aktif non-deleted; analyze/open/checked harus menjumlah total. OPEN/CHECKED percent = jumlah/total*100, denominator 0 → 0.
3. Severity hanya latest COMPLETED current analysis per dokumen; tanpa hasil tidak dihitung CLEAN. Mapping engine HIGH RISK→HIGH, MEDIUM RISK→MEDIUM, LOW RISK→LOW.
4. Kelengkapan nomor memakai document_info.invoice_number trim; completed with/without; unknown untuk belum completed. with+without+unknown=total; persen kelengkapan memakai analyzedTotal, nol→0. Persist flag anomali engine INVOICE_TANPA_NOMOR sebagai evidence terpisah, bukan pengganti nomor hasil ekstraksi.
5. Return ringkasan+missing-number page+snapshotAt; chart scale dinamis. Refresh tanpa full reload; hidden tab hentikan polling.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji empty denominator, status sum, pending bukan CLEAN/missing, current completed analysis saja, filter UTC/Jakarta dan coherent snapshot.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
```

### Prompt implementasi
```text
Implement DSH-02: Grafik Risiko & Kelengkapan Dokumen. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="dsh-03"></a>
## DSH-03 — Filter Periode, Drill-down & Refresh

| Field | Detail |
|---|---|
| Group | DASHBOARD |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | DSH-01, REV-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/dsh/, apps/api/src/modules/dsh/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getDashboard](02_SPEC_API.md#getdashboard) |
| ERD Ref | trn_document, trn_ai_analysis, trn_ai_finding; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-032, FR-033, FR-034, FR-035 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memungkinkan pengguna melihat periode tertentu dan menelusuri sumber angka. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memungkinkan pengguna melihat periode tertentu dan menelusuri sumber angka.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Date range, timezone visible, apply/reset, manual refresh, last refreshed, URL/query persistence, dan drilldown route.
- Integrasi terhadap service: `GET /api/v1/dashboard` — filters/cache orchestration.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getDashboard`: Get tenant dashboard snapshot

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Filter Periode, Drill-down & Refresh selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getDashboard**
1. Authorize dashboard.view; filter submitted date from/to inklusif UI → [start,nextDay) UTC Asia/Jakarta, default All Time.
2. Gunakan satu snapshot transaksi read-only: total dokumen aktif non-deleted; analyze/open/checked harus menjumlah total. OPEN/CHECKED percent = jumlah/total*100, denominator 0 → 0.
3. Severity hanya latest COMPLETED current analysis per dokumen; tanpa hasil tidak dihitung CLEAN. Mapping engine HIGH RISK→HIGH, MEDIUM RISK→MEDIUM, LOW RISK→LOW.
4. Kelengkapan nomor memakai document_info.invoice_number trim; completed with/without; unknown untuk belum completed. with+without+unknown=total; persen kelengkapan memakai analyzedTotal, nol→0. Persist flag anomali engine INVOICE_TANPA_NOMOR sebagai evidence terpisah, bukan pengganti nomor hasil ekstraksi.
5. Return ringkasan+missing-number page+snapshotAt; chart scale dinamis. Refresh tanpa full reload; hidden tab hentikan polling.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji empty denominator, status sum, pending bukan CLEAN/missing, current completed analysis saja, filter UTC/Jakarta dan coherent snapshot.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
```

### Prompt implementasi
```text
Implement DSH-03: Filter Periode, Drill-down & Refresh. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="not-01"></a>
## NOT-01 — Daftar & Jumlah Notifikasi

| Field | Detail |
|---|---|
| Group | NOTIFIKASI |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | SUB-02, FND-04 |
| Blocks | NOT-02 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/not/, apps/api/src/modules/not/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listNotifications](02_SPEC_API.md#listnotifications), [getUnreadNotificationCount](02_SPEC_API.md#getunreadnotificationcount) |
| ERD Ref | trn_notification, trn_notification_recipient, trn_outbox_event; tabel pendukung pada ERD final |
| Requirement Ref | FR-006, FR-036, FR-037, FR-042 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memberi tahu pengguna mengenai pekerjaan atau perubahan yang relevan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memberi tahu pengguna mengenai pekerjaan atau perubahan yang relevan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Unread badge, inbox paginated, read/unread state, timestamp, empty/error/loading, dan refresh ringan.
- Integrasi terhadap service: `GET /api/v1/notifications`; `/unread-count`; event consumer.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listNotifications`: List current user's notifications
- `getUnreadNotificationCount`: Get unread notification count

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Daftar & Jumlah Notifikasi selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listNotifications**
1. Authorize authenticated user; filter tenant_id+recipient_user_id.
2. Filter ALL/READ/UNREAD dan date, newest first ID tie-breaker, pagination 20/100.
3. Return Notification DTO; notification tidak memberi hak tambahan ke target dokumen.

**getUnreadNotificationCount**
1. Authorize authenticated user.
2. COUNT unread recipient rows pada tenant/user sendiri; return unreadCount. Polling tidak memperpanjang idle.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji duplicate event, recipient isolation, mark-all cutoff race, unread count dan target permission sesudah role berubah.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/notifications
```

### Prompt implementasi
```text
Implement NOT-01: Daftar & Jumlah Notifikasi. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="not-02"></a>
## NOT-02 — Tandai Dibaca & Buka Halaman Terkait

| Field | Detail |
|---|---|
| Group | NOTIFIKASI |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | NOT-01, REV-02 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/not/, apps/api/src/modules/not/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [markNotificationRead](02_SPEC_API.md#marknotificationread), [markAllNotificationsRead](02_SPEC_API.md#markallnotificationsread) |
| ERD Ref | trn_notification, trn_notification_recipient, trn_outbox_event; tabel pendukung pada ERD final |
| Requirement Ref | FR-037, FR-038 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memungkinkan pengguna membersihkan inbox dan membuka pekerjaan terkait. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memungkinkan pengguna membersihkan inbox dan membuka pekerjaan terkait.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Mark one/all, optimistic feedback dengan rollback, unread badge sync, dan redirect ke route yang diizinkan.
- Integrasi terhadap service: `POST /notifications/{id}/read`; `/notifications/read-all`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `markNotificationRead`: Mark one notification read
- `markAllNotificationsRead`: Mark all notifications read

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Tandai Dibaca & Buka Halaman Terkait selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**markNotificationRead**
1. Resolve tenant+recipient user dari session; tidak boleh menandai notification user lain.
2. Tandai unread→read satu transaksi, readAt tidak berubah untuk replay. Mark-all memakai created_at<=server cutoff transaksi sehingga event baru sesudah cutoff tetap unread.
3. Return updatedCount, unreadCount terbaru dan documentId (null untuk mark-all). FE revalidasi izin target; penerima tanpa review.view mendapat akses ditolak tanpa membuka data.

**markAllNotificationsRead**
1. Resolve tenant+recipient user dari session; tidak boleh menandai notification user lain.
2. Tandai unread→read satu transaksi, readAt tidak berubah untuk replay. Mark-all memakai created_at<=server cutoff transaksi sehingga event baru sesudah cutoff tetap unread.
3. Return updatedCount, unreadCount terbaru dan documentId (null untuk mark-all). FE revalidasi izin target; penerima tanpa review.view mendapat akses ditolak tanpa membuka data.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji duplicate event, recipient isolation, mark-all cutoff race, unread count dan target permission sesudah role berubah.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
POST /api/v1/notifications/{id}/read
```

### Prompt implementasi
```text
Implement NOT-02: Tandai Dibaca & Buka Halaman Terkait. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="pro-01"></a>
## PRO-01 — View & Edit Profile

| Field | Detail |
|---|---|
| Group | SETTING PROFILE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 0.5 = 1 SP (4 jam) |
| Depends On | LGN-03 |
| Blocks | PRO-02, PRO-03 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/pro/, apps/api/src/modules/pro/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [getMyProfile](02_SPEC_API.md#getmyprofile), [updateMyProfile](02_SPEC_API.md#updatemyprofile) |
| ERD Ref | mst_user, trn_user_session; tabel pendukung pada ERD final |
| Requirement Ref | FR-039 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memungkinkan pengguna melihat dan memperbarui nama profilnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memungkinkan pengguna melihat dan memperbarui nama profilnya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Tampilkan nama, email read-only, role/status informatif, mode edit nama, dirty warning, loading/success/error.
- Integrasi terhadap service: `GET /api/v1/me`; `PATCH /api/v1/me`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `getMyProfile`: Get own profile
- `updateMyProfile`: Update own profile name

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur View & Edit Profile selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getMyProfile**
1. Authorize authenticated user+tenant.
2. Load own user/profile, active role permissions terbaru dan derived delivery status.
3. Return MyProfile, email read-only; tidak memberi akses user lain dan tidak mengubah metadata.

**updateMyProfile**
1. Authorize own user, validasi name 100 nonblank dan versionNo; tolak email/roleId/tenantId dari body.
2. Lock user dan version; update name/version/metadata/audit atomik.
3. Return MyProfile dengan effective permission terbaru.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji email injection ditolak, password confirmation/old/new, revoke current row ditolak dan other-device token langsung gagal.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/me
```

### Prompt implementasi
```text
Implement PRO-01: View & Edit Profile. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="pro-02"></a>
## PRO-02 — Change Password

| Field | Detail |
|---|---|
| Group | SETTING PROFILE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | PRO-01 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/pro/, apps/api/src/modules/pro/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [changeMyPassword](02_SPEC_API.md#changemypassword) |
| ERD Ref | mst_user, trn_user_session; tabel pendukung pada ERD final |
| Requirement Ref | FR-040 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Memungkinkan pengguna mengganti kata sandi setelah memverifikasi kata sandi saat ini. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Memungkinkan pengguna mengganti kata sandi setelah memverifikasi kata sandi saat ini.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Current/new/confirm fields, show/hide aksesibel, policy feedback, loading, sukses, dan penjelasan dampak sesi.
- Integrasi terhadap service: `POST /api/v1/me/change-password`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `changeMyPassword`: Change own password

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Change Password selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**changeMyPassword**
1. Authorize session own user; verifikasi currentPassword, new/confirmPassword identik 8–64 kompleks dan berbeda.
2. Lock user; update hash/credential version, revoke session lain dan auth/reset contexts, rotate current refresh + access session secara atomik.
3. Return Message, cookie refresh baru dan FE melakukan refresh terkontrol untuk access baru; audit tanpa secret.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji email injection ditolak, password confirmation/old/new, revoke current row ditolak dan other-device token langsung gagal.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "currentPassword": "ExampleOnly9!",
  "newPassword": "ExampleOnly9!",
  "confirmPassword": "ExampleOnly9!"
}
```

### Prompt implementasi
```text
Implement PRO-02: Change Password. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="pro-03"></a>
## PRO-03 — Active Sessions & Logout Perangkat

| Field | Detail |
|---|---|
| Group | SETTING PROFILE |
| Status | OPEN |
| Story Point | FE 0.5 + BE 1 = 1.5 SP (6 jam) |
| Depends On | PRO-01 |
| Blocks | QA-01 |
| Critical Path | Tidak |
| Risk | Sedang |
| Files Scope | apps/web/src/features/pro/, apps/api/src/modules/pro/, packages/db/; sesuaikan nama domain pada arsitektur |
| Spec Ref | [listMySessions](02_SPEC_API.md#listmysessions), [revokeMySession](02_SPEC_API.md#revokemysession) |
| ERD Ref | mst_user, trn_user_session; tabel pendukung pada ERD final |
| Requirement Ref | FR-005, FR-041 |
| Owner | Belum ditetapkan |

### Context dan deskripsi
Membantu pengguna mengenali dan mengeluarkan perangkat lain. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

### Goals
- Membantu pengguna mengenali dan mengeluarkan perangkat lain.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

### Scope Frontend
- Daftar maksimal lima sesi dengan current marker, device/browser/IP kasar/last active sesuai kebijakan privasi, dialog revoke, dan feedback.
- Integrasi terhadap service: `GET /api/v1/me/sessions`; `DELETE /api/v1/me/sessions/{sessionId}`.
- State loading, empty, validation, success, error, permission, dan conflict bila relevan.
- Unit/component/integration test pada perilaku utama subitem.

### Scope Backend
- `listMySessions`: List own active sessions
- `revokeMySession`: Revoke another owned session

### Out of scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

### Acceptance Criteria (Given–When–Then)
- [ ] Given actor berizin dan input valid, when alur Active Sessions & Logout Perangkat selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

### Flow Logic (step by step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listMySessions**
1. Authorize own user+tenant; query session durable yang aktif, belum absolute expiry atau idle cutoff.
2. Return Session DTO dengan isCurrent dari sid JWT, default pagination 20 memuat maksimal 5. Never return refresh hashes/JTI.

**revokeMySession**
1. Authorize own user+tenant dan resolve sessionId kepunyaan user.
2. Jika sessionId=current session → 409 CURRENT_SESSION_NOT_REVOCABLE; gunakan authLogout untuk current.
3. Revoke target session dan seluruh refresh generations atomik, audit; 204, replay sesi milik sendiri yang sudah revoked tetap 204. Request berikutnya dari perangkat target → 401.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

### QC khusus
- [ ] Uji email injection ditolak, password confirmation/old/new, revoke current row ditolak dan other-device token langsung gagal.

### Request / response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/me/sessions
```

### Prompt implementasi
```text
Implement PRO-03: Active Sessions & Logout Perangkat. Read final/FinLens_Phase1_2026-09-05/01_ERD.md, 02_SPEC_API.md, this task and 04_ARSITEKTUR.md first. Implement the listed operations and FE states in the new monorepo after the user requests coding. Preserve FSD and BA invariants, include meaningful boundary/failure tests, and report actual validation. Reference repositories are examples only. Do not claim mocks, documents or generated tests prove the real integration works.
```

<a id="qa-01"></a>
## QA-01 — Validasi end-to-end lokal

**Status:** OPEN • **SP:** 5 • **Depends On:** seluruh FND dan 49 task bisnis.

### Flow Logic (step by step)
1. Jalankan migration/seed di DB test disposable dan boot semua layanan lokal; build/typecheck/lint seluruh package.
2. Jalankan user onboarding → login/MFA → ganti password awal → submit PDF → scan CLEAN → AI OPEN → compare → CHECKED → immutable rejection.
3. Jalankan cross-tenant, revoked session, permission changes, race, email failure, duplicate event, scan fail, worker timeout/retry/DLQ, signed file access, dashboard dan notification recipient scenarios.
4. Verifikasi desktop/tablet dan Login terhadap Figma pada ukuran target, simpan bukti visual serta hasil test.
5. Jalankan fixture local MFA terpisah dari real-provider smoke test; laporkan provider yang belum tersedia, jangan menyebut mock sebagai real integration.

### Acceptance dan QC
- [ ] Semua 45 FR baseline dan gap tambahan yang dipilih implementasinya mempunyai hasil nyata, bukan hanya test design.
- [ ] Tidak ada leak tenant, mutable CHECKED, bypass MFA, duplicate side effect atau PDF yang dibuka sebelum CLEAN.
- [ ] Semua layanan dapat diulang lokal dan seluruh task DONE punya bukti. Production readiness tetap gate terpisah.
