# FinLens — Spec API Final

Versi 1.0 • Final baseline implementasi lokal • dimulai 5 September, difinalkan 6 September 2026.

Sumber kebenaran: FSD v1.0.0 tanggal 24 Agustus 2026 dan jawaban user/BA; instruksi terbaru user mengatasi catatan sebelumnya. Dokumen lama, repo, dan Figma adalah referensi turunan/teknis, bukan pengganti aturan bisnis. Status final berarti kontrak untuk coding berikutnya; bukan klaim aplikasi sudah dibuat, diuji, atau siap production.

Urutan baca: [ERD](01_ERD.md) → [Spec API](02_SPEC_API.md) → [Task](03_TASK.md) → [Arsitektur dan evaluasi](04_ARSITEKTUR.md). Hanya empat file ini menjadi paket final baru. Dokumen sumber tetap di lokasi semula.

## Acuan dan prioritas

| ID | Acuan | Pemakaian |
|---|---|---|
| S1 | [FSD asli](../../FSD_FinLens%20%2824082026%29.pdf), [ekstraksi FSD](../../FSD_FitLens.md) | Requirement dan field bisnis; Bab 3–14 |
| S2 | [Jawaban BA dan user](../../catatan.txt) | Lifecycle, terminal CHECKED, permission, role dependency, snapshot anomaly, scope |
| S3 | [Keputusan sebelumnya](../../output/discovery/discovery_questions.md), [context](../../project_context.md) | BA-001–BA-024; baseline v0.4 berlaku sampai user mengubahnya |
| S4 | Instruksi user 5 September 2026 di task ini | Empat dokumen final di folder baru; Login siap develop; coding setelah perintah berikutnya |
| R1 | [Repo Python](../../reference/finlens-be), [repo FE prototype](../../reference/finlens-fe) | Referensi logic AI dan integrasi; kontrak prototype tidak diadopsi otomatis |
| R2 | [Express template](../../reference/template%20js/express-js-template-development), [Next.js template](../../reference/template%20js/nextjs-development) | Struktur kerja lokal yang tersedia; repo bernama seva-agency-cms tidak ditemukan di folder |
| R3 | [Figma FinLens](https://www.figma.com/design/HSkVVcOU5xQOgjR5vQ2AUZ/FinLens?node-id=4-45916) | Visual Login siap develop menurut user; readiness modul lain tidak diasumsikan |

S2 memuat material konfigurasi sensitif. Referensikan keputusan bisnisnya saja; jangan menyalin isinya secara utuh ke repository, prompt, log, atau paket distribusi.

## Konvensi final

- Base `/api/v1`; JSON camelCase; DB snake_case. Success `{data,meta:{correlationId}}`; list `data` array dan meta `page,perPage,total`. Error `{error:{code,message,correlationId,details?}}`, details array objek field/message. Jangan memakai envelope lama `status:boolean` atau `traceId` alternatif.
- Master status ACTIVE/NON_ACTIVE, document business status ANALYZE/OPEN/CHECKED, `activeStatus` terpisah. Dot permission codes. `review.edit` adalah finalize; `review.download` mengatur download History; preview mengikuti view. Identitas UUID, versionNo mulai 1.
- FSD limits: tenant/user/role/category/document/profile name 100, anomaly detail 255, email 100 global unik, password 8–64 dan uppercase/lowercase/digit/symbol, confirmPassword harus identik, password baru berbeda dari lama. Normalisasi nama/email, jangan trim password. DTO anomaly name ↔ anomaly_detail, severityCode ↔ severity_code; tidak ada severity UUID atau description ekstra.
- PATCH master wajib versionNo. DELETE master/document dan admin credential reset memakai query versionNo. Unknown fields → 422; invalid query/date/range → 422; malformed JSON → 400. Status stale, uniqueness dan guard → 409. Foreign ID → 404 setelah permission check. Tidak ada client API physical purge.
- Search case-insensitive, kombinasi filter AND, pagination page=1/perPage=20/max=100; stable sort tie-breaker id. UI date range inklusif dikonversi start<=timestamp<next-day UTC memakai Asia/Jakarta. Nama field sortBy `name` memetakan nama resource, documentName untuk dokumen. Filter enum divalidasi, bukan string SQL bebas.
- Access JWT RS256 15 menit + durable session; refresh cookie 7 hari absolut, rotate/single-use; idle 60 menit di server. Polling/refresh background tidak memperpanjang idle. Header aktivitas FE hanya diterima dari sesi/origin sah dan interaksi eksplisit; ini bukan pengaman terhadap client yang sengaja memalsukan aktivitas sendiri.
- JWT claims wajib sub(userId), tenantId, sid, jti, iat, exp, iss, aud, credentialVersion. Backend memvalidasi signature/issuer/audience/expiry, sid aktif, credentialVersion sama dengan user, dan permission terbaru dari role. Password change membuat access token lama (termasuk current device) tidak berlaku melalui credentialVersion; current device mendapatkan access baru melalui rotating refresh cookie yang baru. Jangan menjadikan roleName atau claim tenant dari token yang belum diverifikasi sebagai otoritas.
- Semua cookie mutation memakai Origin allow-list, SameSite Strict dan CORS eksplisit. `Secure` aktif selain HTTP localhost; cookie HttpOnly tidak dibaca FE. Tidak ada refresh token di JSON/body/localStorage. Auth/bootstrap responses `Cache-Control:no-store`.
- Idempotency wajib untuk createDocument, uploadDocumentVersion dan finalizeReview. Scope tenant+actor+operation+target; request_hash mencakup metadata ternormalisasi, versionNo/analysisId, checksum file. In-progress lease hidup → 409 IDEMPOTENCY_IN_PROGRESS; lease kedaluwarsa direkonsiliasi sebelum takeover. Replay sukses tidak menerbitkan event baru. Row final tidak dipurge Phase 1.
- Hapus Tenant tidak punya flow delete terpisah di FSD Bab 4; gunakan status. Hapus User di FSD Bab 5 berarti nonaktif. Label task “Delete & Change Aktif” di dua modul ini berarti aksi status, tanpa DELETE endpoint. Role/anomaly/category/document memakai soft DELETE sesuai BA-019.
- Upload 202 adalah diterima untuk quarantine scan, bukan AI berhasil atau file sudah aman. Validasi PDF dasar terjadi sebelum 202; scan async terlihat lewat scan/processing status. Byte PDF tidak tersedia sebelum CLEAN. Default polling proses 5 detik lalu 15 detik; berhenti hidden/completed/session invalid.
- File API memberikan proxy ticket privat 60 detik; byte proxy menggunakan GET path tiket dan menegakkan ulang auth saat request/Range, inline vs attachment. Jangan memasukkan raw storage_key atau signed object URL ke DTO umum; tidak menjanjikan preview membuat bytes mustahil disalin.
- Daftar, view master, dan fetch audit tidak menulis mutation audit. Submit/update/status/delete/finalize/password/session, download dan security events dicatat. Review detail menghasilkan REVIEW_DOCUMENT yang boleh dideduplikasi per session/document/analysis untuk menghindari log setiap polling.
- Lookup upload category / assignable role / filter options memakai izin modul yang dilayaninya. User yang hanya bisa submit tidak diwajibkan punya hak melihat master administrasi.

## Guard lintas modul

| Operasi | Guard wajib | Error |
|---|---|---|
| Tenant status | platform-managed grant tenant.edit; tidak nonaktifkan tenant sistem sendiri | TENANT_STATUS_CONFLICT |
| Assign role | aktif, tenant sama, bukan platform role untuk assignment tenant | ROLE_NOT_ASSIGNABLE |
| Role delete/nonaktif | tidak ada assignment user termasuk nonaktif | ROLE_IN_USE |
| Anomaly delete | tidak ada snapshot job/finding historis | ANOMALY_IN_USE |
| Category delete | tidak ada dokumen yang mereferensi | CATEGORY_IN_USE |
| Document edit/status/delete/version | OPEN; tenant, permission, version cocok | DOCUMENT_STATE_CONFLICT / VERSION_CONFLICT |
| Finalize | active OPEN; current CLEAN version + current COMPLETED analysis | ANALYSIS_CONFLICT / DOCUMENT_STATE_CONFLICT |
| Preview/download | authorized current/scoped candidate, CLEAN | FILE_NOT_READY |
| Revoke session row | hanya sesi sendiri selain current | CURRENT_SESSION_NOT_REVOCABLE |

Master Tenant adalah operasi platform-global yang diizinkan permission platform-managed, bukan berdasarkan nama Super User. Aksi ini tidak menghapus filter tenant dari API user/document. FSD 5.3 tenant selector khusus Super Admin dilaksanakan lewat tiga endpoint khusus `/tenants/{id}/user-options/roles`, `/tenants/{id}/credential-drafts`, `/tenants/{id}/users`: wajib platform_managed + tenant.view AND user.add. Backend memvalidasi target dari path dan mengikat draft/role ke target; raw tenantId dalam body tetap ditolak. Tenant user biasa memakai tenant sesi dan tidak dapat memilih tenant lain. Tidak ada grant otomatis membuka dokumen tenant lain.

## Penyelesaian semantik AI

Engine-policy-v1 mempertahankan OCR, deteksi deterministik, agregasi score, dan historical similarity Python. Adapter wajib menerima daftar candidate yang sudah disaring tenant, active/non-deleted, versi CLEAN dengan hasil COMPLETED sebelum cutoff job; exclude dokumen sumber. Candidate IDs/version/analysis dibekukan di candidate_scope_snapshot. Tidak ada kandidat → empty list, bukan mengambil semua tenant.

Master anomaly snapshot harus benar-benar diterapkan pada evaluasi AI (deskripsi+severity), bukan sekadar tersimpan di DB. Engine deterministik existing tetap versioned; rule tenant dievaluasi dari snapshot melalui adapter, findings menyimpan anomalyId/snapshot. Severity akhir tetap dihitung engine; tidak ada manual override. FSD tidak menyediakan DSL eksekusi atau mapping rule ID: penerapan snapshot ke prompt/check adapter merupakan detail teknis yang harus dibuktikan dengan fixture pada task SUB-03, jangan menyamakan simpan snapshot dengan fitur sudah bekerja.

Dashboard tidak memakai status prototype PENDING/APPROVED/REJECTED. Nomor dokumen read-only dari extraction; perubahan kategori memicu analisis ulang karena mempengaruhi interpretasi (FSD Bab 8). Konvensi kosong/null nomor berbeda dari engine anomaly INVOICE_TANPA_NOMOR, keduanya dilestarikan sebagai data berbeda.

## Indeks endpoint

| Method | Path | Operation ID | Permission | Requirement |
|---|---|---|---|---|
| POST | `/api/v1/auth/login` | [authLogin](#authlogin) | public | FR-001, FR-003 |
| POST | `/api/v1/auth/mfa/enroll` | [authMfaEnroll](#authmfaenroll) | mfa-context:ENROLL | FR-002 |
| POST | `/api/v1/auth/mfa/verify` | [authMfaVerify](#authmfaverify) | mfa-context:ENROLL|VERIFY | FR-002, FR-005 |
| POST | `/api/v1/auth/refresh` | [authRefresh](#authrefresh) | refresh-cookie | FR-005 |
| POST | `/api/v1/auth/logout` | [authLogout](#authlogout) | authenticated | FR-005 |
| POST | `/api/v1/auth/password-reset/request` | [authPasswordResetRequest](#authpasswordresetrequest) | public | FR-004 |
| POST | `/api/v1/auth/password-reset/confirm` | [authPasswordResetConfirm](#authpasswordresetconfirm) | public | FR-004 |
| GET | `/api/v1/tenants` | [listTenants](#listtenants) | tenant.view | FR-008, FR-042 |
| POST | `/api/v1/tenants` | [createTenant](#createtenant) | tenant.add | FR-008 |
| GET | `/api/v1/tenants/{id}` | [getTenant](#gettenant) | tenant.view | FR-008 |
| PATCH | `/api/v1/tenants/{id}` | [updateTenant](#updatetenant) | tenant.edit | FR-008 |
| PATCH | `/api/v1/tenants/{id}/status` | [updateTenantStatus](#updatetenantstatus) | tenant.edit | FR-009 |
| GET | `/api/v1/users` | [listUsers](#listusers) | user.view | FR-006, FR-010, FR-042 |
| POST | `/api/v1/users` | [createUser](#createuser) | user.add | FR-010, FR-011 |
| GET | `/api/v1/users/{id}` | [getUser](#getuser) | user.view | FR-006, FR-010 |
| PATCH | `/api/v1/users/{id}` | [updateUser](#updateuser) | user.edit | FR-006, FR-010 |
| PATCH | `/api/v1/users/{id}/status` | [updateUserStatus](#updateuserstatus) | user.edit | FR-012 |
| POST | `/api/v1/users/{id}/credential-reset` | [resetUserCredential](#resetusercredential) | user.edit | FR-011, FR-012 |
| GET | `/api/v1/permissions` | [listPermissions](#listpermissions) | role.view | FR-007, FR-014 |
| GET | `/api/v1/roles` | [listRoles](#listroles) | role.view | FR-006, FR-013, FR-042 |
| POST | `/api/v1/roles` | [createRole](#createrole) | role.add | FR-013, FR-014 |
| GET | `/api/v1/roles/{id}` | [getRole](#getrole) | role.view | FR-006, FR-013, FR-014 |
| PATCH | `/api/v1/roles/{id}` | [updateRole](#updaterole) | role.edit | FR-013, FR-014 |
| DELETE | `/api/v1/roles/{id}` | [deleteRole](#deleterole) | role.delete | FR-015 |
| PATCH | `/api/v1/roles/{id}/status` | [updateRoleStatus](#updaterolestatus) | role.edit | FR-013 |
| GET | `/api/v1/severity-levels` | [listSeverityLevels](#listseveritylevels) | anomaly.view | FR-017 |
| GET | `/api/v1/anomalies` | [listAnomalies](#listanomalies) | anomaly.view | FR-006, FR-016, FR-042 |
| POST | `/api/v1/anomalies` | [createAnomaly](#createanomaly) | anomaly.add | FR-016, FR-017 |
| PATCH | `/api/v1/anomalies/{id}` | [updateAnomaly](#updateanomaly) | anomaly.edit | FR-016, FR-017 |
| DELETE | `/api/v1/anomalies/{id}` | [deleteAnomaly](#deleteanomaly) | anomaly.delete | FR-018 |
| GET | `/api/v1/anomalies/{id}` | [getAnomaly](#getanomaly) | anomaly.view | FR-006, FR-016 |
| PATCH | `/api/v1/anomalies/{id}/status` | [updateAnomalyStatus](#updateanomalystatus) | anomaly.edit | FR-016, FR-017 |
| GET | `/api/v1/file-categories` | [listFileCategories](#listfilecategories) | file_category.view | FR-006, FR-019, FR-020, FR-042 |
| POST | `/api/v1/file-categories` | [createFileCategory](#createfilecategory) | file_category.add | FR-019 |
| GET | `/api/v1/file-categories/{id}` | [getFileCategory](#getfilecategory) | file_category.view | FR-006, FR-019 |
| PATCH | `/api/v1/file-categories/{id}` | [updateFileCategory](#updatefilecategory) | file_category.edit | FR-019 |
| DELETE | `/api/v1/file-categories/{id}` | [deleteFileCategory](#deletefilecategory) | file_category.delete | FR-021 |
| PATCH | `/api/v1/file-categories/{id}/status` | [updateFileCategoryStatus](#updatefilecategorystatus) | file_category.edit | FR-019, FR-020 |
| GET | `/api/v1/documents` | [listDocuments](#listdocuments) | document.view | FR-006, FR-022, FR-042 |
| POST | `/api/v1/documents` | [createDocument](#createdocument) | document.add | FR-023, FR-024 |
| GET | `/api/v1/documents/{id}` | [getDocument](#getdocument) | document.view | FR-006, FR-022, FR-025 |
| PATCH | `/api/v1/documents/{id}` | [updateDocumentMetadata](#updatedocumentmetadata) | document.edit | FR-025, FR-026 |
| DELETE | `/api/v1/documents/{id}` | [deleteDocument](#deletedocument) | document.delete | FR-025, FR-026 |
| POST | `/api/v1/documents/{id}/versions` | [uploadDocumentVersion](#uploaddocumentversion) | document.edit | FR-023, FR-024, FR-025, FR-026 |
| PATCH | `/api/v1/documents/{id}/status` | [toggleDocumentActiveStatus](#toggledocumentactivestatus) | document.edit | FR-025, FR-026 |
| GET | `/api/v1/documents/{id}/download` | [downloadDocument](#downloaddocument) | document.download | FR-044 |
| GET | `/api/v1/reviews` | [listReviewHistory](#listreviewhistory) | review.view | FR-006, FR-027, FR-042 |
| GET | `/api/v1/reviews/{id}` | [getReviewDetail](#getreviewdetail) | review.view | FR-027, FR-043, FR-044 |
| GET | `/api/v1/reviews/{id}/similarities` | [listReviewSimilarities](#listreviewsimilarities) | review.view | FR-028 |
| GET | `/api/v1/reviews/{id}/compare/{matchDocumentId}` | [compareReviewDocument](#comparereviewdocument) | review.view | FR-028, FR-044 |
| POST | `/api/v1/reviews/{id}/finalize` | [finalizeReview](#finalizereview) | review.edit | FR-026, FR-029 |
| GET | `/api/v1/audit-logs` | [listAuditLogs](#listauditlogs) | audit.view | FR-006, FR-030, FR-031, FR-042, FR-045 |
| GET | `/api/v1/audit-logs/{id}` | [getAuditLog](#getauditlog) | audit.view | FR-006, FR-030, FR-031, FR-045 |
| GET | `/api/v1/dashboard` | [getDashboard](#getdashboard) | dashboard.view | FR-006, FR-032, FR-033, FR-034, FR-035 |
| GET | `/api/v1/notifications` | [listNotifications](#listnotifications) | authenticated | FR-006, FR-036, FR-037, FR-042 |
| GET | `/api/v1/notifications/unread-count` | [getUnreadNotificationCount](#getunreadnotificationcount) | authenticated | FR-036, FR-037 |
| POST | `/api/v1/notifications/{id}/read` | [markNotificationRead](#marknotificationread) | authenticated | FR-037, FR-038 |
| POST | `/api/v1/notifications/read-all` | [markAllNotificationsRead](#markallnotificationsread) | authenticated | FR-037 |
| GET | `/api/v1/me` | [getMyProfile](#getmyprofile) | authenticated | FR-039 |
| PATCH | `/api/v1/me` | [updateMyProfile](#updatemyprofile) | authenticated | FR-039 |
| POST | `/api/v1/me/change-password` | [changeMyPassword](#changemypassword) | authenticated | FR-040 |
| GET | `/api/v1/me/sessions` | [listMySessions](#listmysessions) | authenticated | FR-005, FR-041 |
| DELETE | `/api/v1/me/sessions/{sessionId}` | [revokeMySession](#revokemysession) | authenticated | FR-041 |
| POST | `/api/v1/auth/initial-password` | [completeInitialPassword](#completeinitialpassword) | password-context | FR-001, FR-005, FR-011 |
| POST | `/api/v1/auth/context/cancel` | [cancelAuthContext](#cancelauthcontext) | mfa-context | FR-002 |
| POST | `/api/v1/users/credential-drafts` | [createCredentialDraft](#createcredentialdraft) | user.add | FR-010, FR-011 |
| GET | `/api/v1/documents/{id}/preview` | [previewDocument](#previewdocument) | document.view | FR-022, FR-044 |
| GET | `/api/v1/reviews/{id}/file` | [getReviewFile](#getreviewfile) | review.view | FR-027, FR-028, FR-044 |
| GET | `/api/v1/document-options/categories` | [listUploadCategories](#listuploadcategories) | document.add|document.edit | FR-020, FR-023 |
| GET | `/api/v1/user-options/roles` | [listAssignableRoles](#listassignableroles) | user.add|user.edit | FR-010, FR-013 |
| GET | `/api/v1/filter-options` | [listFilterOptions](#listfilteroptions) | menu-context | FR-007, FR-022, FR-027, FR-031, FR-042 |
| GET | `/api/v1/tenants/{id}/user-options/roles` | [listPlatformAssignableRoles](#listplatformassignableroles) | platform:tenant.view AND user.add | FR-008, FR-010, FR-013 |
| POST | `/api/v1/tenants/{id}/credential-drafts` | [createPlatformCredentialDraft](#createplatformcredentialdraft) | platform:tenant.view AND user.add | FR-008, FR-010, FR-011 |
| POST | `/api/v1/tenants/{id}/users` | [createPlatformUser](#createplatformuser) | platform:tenant.view AND user.add | FR-008, FR-010, FR-011 |
| GET | `/api/v1/files/{ticket}` | [streamPrivateFile](#streamprivatefile) | ticket-bound view/download | FR-027, FR-028, FR-044 |

## Detail endpoint

<a id="authlogin"></a>
### authLogin
`POST /api/v1/auth/login` • Permission `public` • FR-001, FR-003

**Input**

- Body `application/json`: `LoginRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "email": "user@example.com",
  "password": "ExampleOnly9!",
  "visitorId": "xxxxxxxxxxxxxxxxxxxx",
  "isPrivate": false
}
```

**Flow Logic**

1. Validasi email maksimal 100 dan password 8–64; normalisasi hanya email. Rate-limit account/IP. Unknown/inactive/locked user memperoleh 401 AUTH_INVALID generik; kegagalan ketiga mengunci 3 jam secara atomik.
2. Periksa user, role, tenant aktif dan temporary password belum expired/consumed. Verifikasi hash; update failed counter/lock di row user lock.
3. Panggil provider check-requirement HIGH, forceMfa=false dengan visitorId/isPrivate; trusted harus dikonfirmasi status.isSessionVerified=true. Tidak enrolled → konteks ENROLL; challenge → VERIFY, keduanya 300 detik.
4. Sesudah MFA terpenuhi, jika must_change_password, tandai temporary password used dan buat CHANGE_PASSWORD context terikat credential_version, 300 detik; tidak ada access/refresh session. Jika konteks habis, gunakan forgot password/admin credential reset.
5. Jika semua syarat selesai, lock row user, batasi lima sesi, buat durable session + refresh hash generation 1 dan access JWT 900 detik. Set cookie refresh 7 hari; idle server 60 menit. Return AUTHENTICATED.
6. Provider gagal → 503; tidak membuat sesi. Audit tanpa credential. Validasi status user/tenant/credential_version kembali sebelum commit akhir untuk menutup perubahan selama MFA.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | LoginResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 503 | ErrorResponse |
| 422 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "nextAction": "ENROLL",
    "mfaRequired": true,
    "mfaContextToken": "xxxxxxxxxxxxxxxxxxxx",
    "expiresInSeconds": 300
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="authmfaenroll"></a>
### authMfaEnroll
`POST /api/v1/auth/mfa/enroll` • Permission `mfa-context:ENROLL` • FR-002

**Input**

- Body: tidak ada.

**Flow Logic**

1. Validate the unexpired, unused `ENROLL` MFA context and derive user ID/email server-side.
2. Call provider `/enroll` with `userIdentifier = mst_user.user_id` and `userName = normalized email`.
3. Resolve the relative QR path against the configured provider origin, reject cross-origin/non-HTTPS values, then return `setupKey`, safe absolute `qrCodeDataUrl`, and exactly three recovery codes once; set `Cache-Control: no-store`.
4. Never persist or log setup material. Map provider `409` to `MFA_ALREADY_ENROLLED` and provider failure to `MFA_PROVIDER_UNAVAILABLE`.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | MfaEnrollmentResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 503 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "setupKey": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "qrCodeDataUrl": "https://mfa.example.invalid/qr/example",
    "recoveryCodes": [
      "xxxxxxxxxx",
      "xxxxxxxxxx",
      "xxxxxxxxxx"
    ]
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="authmfaverify"></a>
### authMfaVerify
`POST /api/v1/auth/mfa/verify` • Permission `mfa-context:ENROLL|VERIFY` • FR-002, FR-005

**Input**

- Body `application/json`: `MfaVerifyRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "code": "123456"
}
```

**Flow Logic**

1. Validasi konteks ENROLL/VERIFY, expiry, user/role/tenant/credential version dan binding device; hanya satu code 6 digit atau recoveryCode sesuai kontrak provider.
2. ENROLL memakai verify-setup, VERIFY memakai verify. Jangan auto-retry pemakaian OTP. Provider owns replay/lockout; 401 MFA_INVALID, 429 MFA_LOCKED dengan Retry-After, 503 MFA_PROVIDER_UNAVAILABLE.
3. Code sukses wajib status.isSessionVerified=true. Consume konteks atomik; temporary user ke CHANGE_PASSWORD tanpa full session, user biasa ke AUTHENTICATED dan session dengan batas lima.
4. Recovery sukses menonaktifkan MFA di provider: return ENROLL baru tanpa access/refresh. Consume context lama. Setup/recovery material tidak disimpan/log.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | MfaVerificationResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 503 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "nextAction": "AUTHENTICATED",
    "accessToken": "xxxxxxxxxxxxxxxxxxxx",
    "expiresInSeconds": 900
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="authrefresh"></a>
### authRefresh
`POST /api/v1/auth/refresh` • Permission `refresh-cookie` • FR-005

**Input**

- Body: tidak ada.

**Flow Logic**

1. Baca cookie finlens_refresh; tolak refreshToken dari body. Verifikasi Origin terhadap origin web yang diizinkan; SameSite Strict dan allow-list CORS, credentialed request.
2. Lock hash token dan session; cek unused, expiry 7 hari absolut, idle<60 menit, user/role/tenant aktif. Token used berarti replay: revoke session family dan return 401.
3. Tandai token lama used dan insert generasi baru satu transaksi. Terbitkan access JWT 15 menit dan cookie baru dengan sisa absolute expiry; concurrent refresh FE harus single-flight.
4. Refresh otomatis dan polling tidak memperpanjang idle. Aktivitas interaktif terotorisasi memperbarui last_activity_at maksimal sekali per menit; logout/revocation memblokir seluruh JTI session.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | authRefreshResponse |
| 400 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 401 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "accessToken": "xxxxxxxxxxxxxxxxxxxx",
    "expiresInSeconds": 900
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="authlogout"></a>
### authLogout
`POST /api/v1/auth/logout` • Permission `authenticated` • FR-005

**Input**

- Body: tidak ada.

**Flow Logic**

1. Authorize session aktif, revoke current session dan semua refresh generations atomik.
2. Hapus refresh cookie dengan atribut Path yang sama; hapus access token FE memory; audit tanpa token. Return 204.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Command completed with no response body |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

<a id="authpasswordresetrequest"></a>
### authPasswordResetRequest
`POST /api/v1/auth/password-reset/request` • Permission `public` • FR-004

**Input**

- Body `application/json`: `PasswordResetRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "email": "user@example.com"
}
```

**Flow Logic**

1. Validasi email 100, rate-limit account/IP; respons tetap 202 Message netral untuk known/unknown/inactive.
2. Untuk akun/tenant aktif, simpan email intent; email worker menghasilkan secure token, digest 30 menit dan invalidasi reset aktif sebelumnya dalam transaksi, lalu kirim link dari memory.
3. Retry/restart mengikuti email-delivery policy; token plaintext tidak masuk outbox. Tidak mengubah password sampai confirm valid.

**Respons**

| HTTP | Kontrak |
|---|---|
| 202 | authPasswordResetRequestResponse |
| 400 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 202 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "message": "xxxxxxxxxxxxxxxxxxxx"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="authpasswordresetconfirm"></a>
### authPasswordResetConfirm
`POST /api/v1/auth/password-reset/confirm` • Permission `public` • FR-004

**Input**

- Body `application/json`: `PasswordResetConfirmRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "token": "xxxxxxxxxxxxxxxxxxxx",
  "newPassword": "ExampleOnly9!",
  "confirmPassword": "ExampleOnly9!"
}
```

**Flow Logic**

1. Validasi token digest aktif, expiry 30 menit, new/confirmPassword identik 8–64 kompleks dan berbeda dari hash lama.
2. Lock user/reset row; update hash, increment credential version, clear temporary flags, consume semua reset/auth contexts dan revoke semua session satu transaksi.
3. Audit teredaksi, return Message; FE kembali login. Invalid/expired/used token → 422 RESET_TOKEN_INVALID tanpa perubahan.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Success; no body |
| 400 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

<a id="listtenants"></a>
### listTenants
`GET /api/v1/tenants` • Permission `tenant.view` • FR-008, FR-042

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"in": "query", "schema": {"type": "string", "enum": ["ACTIVE", "NON_ACTIVE"]}} — opsional
- `query.createdFrom`: {"type": "string", "format": "date"} — opsional
- `query.createdTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedFrom`: {"type": "string", "format": "date"} — opsional
- `query.updatedTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedBy`: {"type": "string", "format": "uuid"} — opsional
- `query.sortBy`: {"type": "string", "enum": ["createdAt", "updatedAt", "name"], "default": "createdAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Verifikasi tenant.view dan scope global platform; tidak mengandalkan nama persona.
2. Query mst_tenant dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listTenantsResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="createtenant"></a>
### createTenant
`POST /api/v1/tenants` • Permission `tenant.add` • FR-008

**Input**

- Body `application/json`: `TenantCreateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens"
}
```

**Flow Logic**

1. Verifikasi tenant.add dan scope global platform. Validasi Nama 100 unik case-insensitive.
2. Lock target/parent terkait; cek uniqueness atomik dan create UUID server.
3. Tulis mst_tenant, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Create tenant juga seed role Admin Tenant yang non-platform dengan permission tenant yang tersedia untuk onboarding awal.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | createTenantResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="gettenant"></a>
### getTenant
`GET /api/v1/tenants/{id}` • Permission `tenant.view` • FR-008

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Verifikasi tenant.view dan scope global platform; tidak mengandalkan nama persona.
2. Query mst_tenant dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getTenantResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updatetenant"></a>
### updateTenant
`PATCH /api/v1/tenants/{id}` • Permission `tenant.edit` • FR-008

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `TenantUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1
}
```

**Flow Logic**

1. Verifikasi tenant.edit dan scope global platform. Validasi Nama 100 unik case-insensitive.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_tenant, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. 
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateTenantResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updatetenantstatus"></a>
### updateTenantStatus
`PATCH /api/v1/tenants/{id}/status` • Permission `tenant.edit` • FR-009

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `StatusUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

**Flow Logic**

1. Authorize tenant.edit dalam scope global platform; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Tenant sistem sendiri tidak boleh nonaktif.
3. Update status/version/metadata dan audit atomik. NON_ACTIVE langsung revoke semua session tenant/user terkait; activation tidak memulihkan token lama.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateTenantStatusResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listusers"></a>
### listUsers
`GET /api/v1/users` • Permission `user.view` • FR-006, FR-010, FR-042

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"in": "query", "schema": {"type": "string", "enum": ["ACTIVE", "NON_ACTIVE"]}} — opsional
- `query.createdFrom`: {"type": "string", "format": "date"} — opsional
- `query.createdTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedFrom`: {"type": "string", "format": "date"} — opsional
- `query.updatedTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedBy`: {"type": "string", "format": "uuid"} — opsional
- `query.sortBy`: {"type": "string", "enum": ["createdAt", "updatedAt", "name"], "default": "createdAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Verifikasi user.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_user dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listUsersResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="createuser"></a>
### createUser
`POST /api/v1/users` • Permission `user.add` • FR-010, FR-011

**Input**

- Body `application/json`: `UserCreateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "email": "user@example.com",
  "roleId": "00000000-0000-4000-8000-000000000001",
  "credentialDraftToken": "xxxxxxxxxxxxxxxxxxxx",
  "temporaryPassword": "ExampleOnly9!"
}
```

**Flow Logic**

1. Validasi permission user.add dan input name/email/roleId/draft; email global unik, nama 100, email 100.
2. Pastikan role aktif tenant sama dan bukan platform_managed; validasi draft actor, tenant, expiry, password hash, unused.
3. Dalam transaksi lock role/draft, create user must_change_password=true, expiry temporary 30 menit, consume draft, create email-delivery dan audit/outbox metadata tanpa secret.
4. Kirim credential dari request memory melalui email adapter setelah commit; retry mengikuti kebijakan delivery. Return User DTO tanpa password; kegagalan email ditandai FAILED, bukan menghapus user yang sudah committed.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | createUserResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "email": "user@example.com",
    "roleId": "00000000-0000-4000-8000-000000000001",
    "status": "ACTIVE",
    "credentialDeliveryStatus": "QUEUED",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="getuser"></a>
### getUser
`GET /api/v1/users/{id}` • Permission `user.view` • FR-006, FR-010

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Verifikasi user.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_user dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getUserResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "email": "user@example.com",
    "roleId": "00000000-0000-4000-8000-000000000001",
    "status": "ACTIVE",
    "credentialDeliveryStatus": "QUEUED",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updateuser"></a>
### updateUser
`PATCH /api/v1/users/{id}` • Permission `user.edit` • FR-006, FR-010

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `UserUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "roleId": "00000000-0000-4000-8000-000000000001",
  "versionNo": 1
}
```

**Flow Logic**

1. Verifikasi user.edit dan scope tenant. Validasi Nama 100, email global unik immutable, role aktif tenant sama.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_user, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. 
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateUserResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "email": "user@example.com",
    "roleId": "00000000-0000-4000-8000-000000000001",
    "status": "ACTIVE",
    "credentialDeliveryStatus": "QUEUED",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updateuserstatus"></a>
### updateUserStatus
`PATCH /api/v1/users/{id}/status` • Permission `user.edit` • FR-012

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `StatusUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

**Flow Logic**

1. Authorize user.edit dalam scope tenant; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Validasi current version dan dependency resource.
3. Update status/version/metadata dan audit atomik. NON_ACTIVE langsung revoke semua session tenant/user terkait; activation tidak memulihkan token lama.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateUserStatusResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "email": "user@example.com",
    "roleId": "00000000-0000-4000-8000-000000000001",
    "status": "ACTIVE",
    "credentialDeliveryStatus": "QUEUED",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="resetusercredential"></a>
### resetUserCredential
`POST /api/v1/users/{id}/credential-reset` • Permission `user.edit` • FR-011, FR-012

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `query.versionNo`: {"type": "integer", "minimum": 1} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize user.edit, tenant dan versionNo; target aktif, role/tenant sah.
2. Lock user, increment credential_version, revoke seluruh session/context/reset/draft terkait user; buat delivery intent credential reset dan must_change_password.
3. Email worker generate password kompleks, hash-only, expiry 30 menit dan send memory; FAILED terpantau lewat User. Return 202 Message, tidak pernah mengembalikan password user dari endpoint ini.

**Respons**

| HTTP | Kontrak |
|---|---|
| 202 | resetUserCredentialResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 202 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "message": "xxxxxxxxxxxxxxxxxxxx"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listpermissions"></a>
### listPermissions
`GET /api/v1/permissions` • Permission `role.view` • FR-007, FR-014

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize role.view.
2. Return katalog menu/action tenant saja; exclude tenant.* dan disabled/unsupported actions; All adalah affordance UI, tidak disimpan sebagai wildcard.
3. Pagination 20/100; default action mappings: tenant view/add/edit; user view/add/edit; role/anomaly/file_category view/add/edit/delete; document view/add/edit/delete/download; review view/edit/download; audit/dashboard view. Notification/profile authenticated self-service.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listPermissionsResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="listroles"></a>
### listRoles
`GET /api/v1/roles` • Permission `role.view` • FR-006, FR-013, FR-042

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"in": "query", "schema": {"type": "string", "enum": ["ACTIVE", "NON_ACTIVE"]}} — opsional
- `query.createdFrom`: {"type": "string", "format": "date"} — opsional
- `query.createdTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedFrom`: {"type": "string", "format": "date"} — opsional
- `query.updatedTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedBy`: {"type": "string", "format": "uuid"} — opsional
- `query.sortBy`: {"type": "string", "enum": ["createdAt", "updatedAt", "name"], "default": "createdAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Verifikasi role.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_role dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listRolesResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="createrole"></a>
### createRole
`POST /api/v1/roles` • Permission `role.add` • FR-013, FR-014

**Input**

- Body `application/json`: `RoleUpsertRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "permissionCodes": []
}
```

**Flow Logic**

1. Verifikasi role.add dan scope tenant. Validasi Nama 100 unik tenant; permission codes valid, tidak ada tenant.* atau platform-managed assignment.
2. Lock target/parent terkait; cek uniqueness atomik dan create UUID server.
3. Tulis mst_role, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Role change menaikkan permissions_version dan berlaku pada authorization request berikutnya.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | createRoleResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "permissionCodes": [],
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="getrole"></a>
### getRole
`GET /api/v1/roles/{id}` • Permission `role.view` • FR-006, FR-013, FR-014

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Verifikasi role.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_role dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getRoleResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "permissionCodes": [],
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updaterole"></a>
### updateRole
`PATCH /api/v1/roles/{id}` • Permission `role.edit` • FR-013, FR-014

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `RoleUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "permissionCodes": [],
  "versionNo": 1
}
```

**Flow Logic**

1. Verifikasi role.edit dan scope tenant. Validasi Nama 100 unik tenant; permission codes valid, tidak ada tenant.* atau platform-managed assignment.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_role, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Role change menaikkan permissions_version dan berlaku pada authorization request berikutnya.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateRoleResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "permissionCodes": [],
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="deleterole"></a>
### deleteRole
`DELETE /api/v1/roles/{id}` • Permission `role.delete` • FR-015

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `query.versionNo`: {"type": "integer", "minimum": 1} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize role.delete, resolve tenant ID dan query versionNo.
2. Lock parent row yang sama dengan flow assignment/snapshot; periksa semua mst_user yang masih merujuk role, termasuk nonaktif/soft-deleted. Jika masih dirujuk → 409 ROLE_IN_USE.
3. Set mst_role.deleted_at dan increment version, tulis audit satu transaksi; jangan physical DELETE/cascade/purge.
4. Return 204; nama tetap reserved.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Command completed with no response body |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updaterolestatus"></a>
### updateRoleStatus
`PATCH /api/v1/roles/{id}/status` • Permission `role.edit` • FR-013

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `StatusUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

**Flow Logic**

1. Authorize role.edit dalam scope tenant; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Validasi current version dan dependency resource.
3. Update status/version/metadata dan audit atomik. Role tanpa assignment boleh berubah status.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateRoleStatusResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "permissionCodes": [],
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listseveritylevels"></a>
### listSeverityLevels
`GET /api/v1/severity-levels` • Permission `anomaly.view` • FR-017

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize anomaly.view; return lima kode seeded CLEAN/LOW/MEDIUM/HIGH/CRITICAL dan rank 0–4.
2. Read-only, pagination default memuat semua lima; tidak ada endpoint edit severity levels.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listSeverityLevelsResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="listanomalies"></a>
### listAnomalies
`GET /api/v1/anomalies` • Permission `anomaly.view` • FR-006, FR-016, FR-042

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"in": "query", "schema": {"type": "string", "enum": ["ACTIVE", "NON_ACTIVE"]}} — opsional
- `query.createdFrom`: {"type": "string", "format": "date"} — opsional
- `query.createdTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedFrom`: {"type": "string", "format": "date"} — opsional
- `query.updatedTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedBy`: {"type": "string", "format": "uuid"} — opsional
- `query.sortBy`: {"type": "string", "enum": ["createdAt", "updatedAt", "name"], "default": "createdAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Verifikasi anomaly.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_anomaly dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listAnomaliesResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="createanomaly"></a>
### createAnomaly
`POST /api/v1/anomalies` • Permission `anomaly.add` • FR-016, FR-017

**Input**

- Body `application/json`: `AnomalyUpsertRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "severityCode": "CLEAN"
}
```

**Flow Logic**

1. Verifikasi anomaly.add dan scope tenant. Validasi Detail 255 unik tenant, severityCode salah satu lima kode.
2. Lock target/parent terkait; cek uniqueness atomik dan create UUID server.
3. Tulis mst_anomaly, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Anomaly change diserialkan bersama snapshot job; tidak mengubah snapshot sebelumnya.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | createAnomalyResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "severityCode": "CLEAN",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updateanomaly"></a>
### updateAnomaly
`PATCH /api/v1/anomalies/{id}` • Permission `anomaly.edit` • FR-016, FR-017

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `AnomalyUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1,
  "severityCode": "CLEAN"
}
```

**Flow Logic**

1. Verifikasi anomaly.edit dan scope tenant. Validasi Detail 255 unik tenant, severityCode salah satu lima kode.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_anomaly, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. Anomaly change diserialkan bersama snapshot job; tidak mengubah snapshot sebelumnya.
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateAnomalyResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "severityCode": "CLEAN",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="deleteanomaly"></a>
### deleteAnomaly
`DELETE /api/v1/anomalies/{id}` • Permission `anomaly.delete` • FR-018

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `query.versionNo`: {"type": "integer", "minimum": 1} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize anomaly.delete, resolve tenant ID dan query versionNo.
2. Lock parent row yang sama dengan flow assignment/snapshot; periksa semua snapshot analysis dan finding aktif/historis. Jika masih dirujuk → 409 ANOMALY_IN_USE.
3. Set mst_anomaly.deleted_at dan increment version, tulis audit satu transaksi; jangan physical DELETE/cascade/purge.
4. Return 204; nama tetap reserved.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Command completed with no response body |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="getanomaly"></a>
### getAnomaly
`GET /api/v1/anomalies/{id}` • Permission `anomaly.view` • FR-006, FR-016

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Periksa anomaly.view; cari ID pada tenant sendiri dan belum deleted.
2. Return anomaly detail dan metadata lengkap; 404 bila tidak ada, tanpa mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getAnomalyResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "severityCode": "CLEAN",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updateanomalystatus"></a>
### updateAnomalyStatus
`PATCH /api/v1/anomalies/{id}/status` • Permission `anomaly.edit` • FR-016, FR-017

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `StatusUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

**Flow Logic**

1. Authorize anomaly.edit dalam scope tenant; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Validasi current version dan dependency resource.
3. Update status/version/metadata dan audit atomik. Anomaly/category nonaktif hanya mempengaruhi job/selection baru; snapshot/history tidak berubah.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateAnomalyStatusResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "severityCode": "CLEAN",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listfilecategories"></a>
### listFileCategories
`GET /api/v1/file-categories` • Permission `file_category.view` • FR-006, FR-019, FR-020, FR-042

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"in": "query", "schema": {"type": "string", "enum": ["ACTIVE", "NON_ACTIVE"]}} — opsional
- `query.createdFrom`: {"type": "string", "format": "date"} — opsional
- `query.createdTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedFrom`: {"type": "string", "format": "date"} — opsional
- `query.updatedTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedBy`: {"type": "string", "format": "uuid"} — opsional
- `query.sortBy`: {"type": "string", "enum": ["createdAt", "updatedAt", "name"], "default": "createdAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Verifikasi file_category.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_file_category dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listFileCategoriesResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="createfilecategory"></a>
### createFileCategory
`POST /api/v1/file-categories` • Permission `file_category.add` • FR-019

**Input**

- Body `application/json`: `CategoryUpsertRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens"
}
```

**Flow Logic**

1. Verifikasi file_category.add dan scope tenant. Validasi Nama 100 unik tenant.
2. Lock target/parent terkait; cek uniqueness atomik dan create UUID server.
3. Tulis mst_file_category, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. 
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | createFileCategoryResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="getfilecategory"></a>
### getFileCategory
`GET /api/v1/file-categories/{id}` • Permission `file_category.view` • FR-006, FR-019

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Verifikasi file_category.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_file_category dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getFileCategoryResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updatefilecategory"></a>
### updateFileCategory
`PATCH /api/v1/file-categories/{id}` • Permission `file_category.edit` • FR-019

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `CategoryUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1
}
```

**Flow Logic**

1. Verifikasi file_category.edit dan scope tenant. Validasi Nama 100 unik tenant.
2. Lock target/parent terkait; wajib versionNo saat ini; konflik → 409; name/role saja untuk user, email/tenant immutable.
3. Tulis mst_file_category, metadata dan audit dalam satu transaksi; version_no mulai 1/increment. 
4. Return DTO lengkap tanpa credential; unique/version/assignment failure rollback seluruh mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateFileCategoryResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="deletefilecategory"></a>
### deleteFileCategory
`DELETE /api/v1/file-categories/{id}` • Permission `file_category.delete` • FR-021

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `query.versionNo`: {"type": "integer", "minimum": 1} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize file_category.delete, resolve tenant ID dan query versionNo.
2. Lock parent row yang sama dengan flow assignment/snapshot; periksa semua dokumen yang merujuk kategori. Jika masih dirujuk → 409 CATEGORY_IN_USE.
3. Set mst_file_category.deleted_at dan increment version, tulis audit satu transaksi; jangan physical DELETE/cascade/purge.
4. Return 204; nama tetap reserved.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Command completed with no response body |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updatefilecategorystatus"></a>
### updateFileCategoryStatus
`PATCH /api/v1/file-categories/{id}/status` • Permission `file_category.edit` • FR-019, FR-020

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `StatusUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

**Flow Logic**

1. Authorize file_category.edit dalam scope tenant; status ACTIVE/NON_ACTIVE dan versionNo wajib.
2. Lock row; role yang assigned user termasuk nonaktif → ROLE_IN_USE. Validasi current version dan dependency resource.
3. Update status/version/metadata dan audit atomik. Anomaly/category nonaktif hanya mempengaruhi job/selection baru; snapshot/history tidak berubah.
4. Return DTO resource; 409 untuk stale/dependency dan 404 foreign ID.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateFileCategoryStatusResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "status": "ACTIVE",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listdocuments"></a>
### listDocuments
`GET /api/v1/documents` • Permission `document.view` • FR-006, FR-022, FR-042

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"type": "string", "enum": ["ANALYZE", "OPEN", "CHECKED"]} — opsional
- `query.createdFrom`: {"type": "string", "format": "date"} — opsional
- `query.createdTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedFrom`: {"type": "string", "format": "date"} — opsional
- `query.updatedTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedBy`: {"type": "string", "format": "uuid"} — opsional
- `query.fileCategoryId`: {"type": "string", "format": "uuid"} — opsional
- `query.activeStatus`: {"type": "string", "enum": ["ACTIVE", "NON_ACTIVE"]} — opsional
- `query.sortBy`: {"type": "string", "enum": ["createdAt", "updatedAt", "name"], "default": "createdAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize document.view, tenant dari session.
2. Query dokumen non-deleted; Bucket dapat melihat active/non-active dan semua business state. Filter/sort/pagination dengan count predicate sama.
3. Return Document DTO termasuk scanStatus dan currentAnalysis.processingStatus; no signed URL/bytes/raw engine result. Polling tidak menulis mutation audit atau memperpanjang idle.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listDocumentsResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="createdocument"></a>
### createDocument
`POST /api/v1/documents` • Permission `document.add` • FR-023, FR-024

**Input**

- `header.Idempotency-Key`: {"type": "string", "minLength": 16, "maxLength": 128} — wajib
- Body `multipart/form-data`: `DocumentUploadRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "file": "<binary PDF>",
  "fileCategoryId": "00000000-0000-4000-8000-000000000001",
  "documentName": "Contoh FinLens"
}
```

**Flow Logic**

1. Periksa permission document.add, auth scope, dan Idempotency-Key; hash metadata+SHA256 file. Key sama/payload beda → 409. Key completed sama → response awal setelah otorisasi ulang.
2. Validasi nama 100 dan kategori aktif untuk create; replacement wajib versionNo dan status OPEN. Stream PDF maksimal 20971520 byte; cek signature/MIME, parser 1–100 halaman dan tidak encrypted. Tolak format/size invalid 413/415/422.
3. Simpan private immutable object di quarantine. Dalam transaksi recheck category/status/version/unique name; create document/version ANALYZE dengan scan PENDING, create analysis QUEUED + category/anomaly/candidate snapshot, audit dan outbox scan-request. Selesai idempotency bersama commit.
4. Return 202 Document DTO; 202 berarti diterima untuk scan/AI, belum dinyatakan CLEAN. Scan job ClamAV harus CLEAN sebelum outbox analysis-request dibuat. INFECTED/ERROR terminal → processing FAILED, tanpa akses bytes; status bisnis tetap ANALYZE.
5. Worker memproses snapshot; hasil diterima hanya untuk lease aktif/current version. Commit analysis COMPLETED+findings+similarities dan document OPEN satu transaksi. Retry 30/120 detik, attempt 15 menit, max 3 lalu DLQ.

**Respons**

| HTTP | Kontrak |
|---|---|
| 202 | createDocumentResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 413 | ErrorResponse |
| 415 | ErrorResponse |
| 503 | ErrorResponse |

Contoh bentuk sukses 202 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "documentName": "Contoh FinLens",
    "fileCategoryId": "00000000-0000-4000-8000-000000000001",
    "categoryName": "xxxxxxxxxxxxxxxxxxxx",
    "documentNumber": null,
    "documentStatus": "ANALYZE",
    "activeStatus": "ACTIVE",
    "currentVersionId": "00000000-0000-4000-8000-000000000001",
    "scanStatus": "PENDING",
    "currentAnalysis": null,
    "checkedAnalysisId": null,
    "checkedAt": null,
    "checkedBy": null,
    "checkedComment": null,
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="getdocument"></a>
### getDocument
`GET /api/v1/documents/{id}` • Permission `document.view` • FR-006, FR-022, FR-025

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize document.view, tenant dari session.
2. Query dokumen non-deleted; Bucket dapat melihat active/non-active dan semua business state. Resolve ID scope tenant atau 404.
3. Return Document DTO termasuk scanStatus dan currentAnalysis.processingStatus; no signed URL/bytes/raw engine result. Polling tidak menulis mutation audit atau memperpanjang idle.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getDocumentResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "documentName": "Contoh FinLens",
    "fileCategoryId": "00000000-0000-4000-8000-000000000001",
    "categoryName": "xxxxxxxxxxxxxxxxxxxx",
    "documentNumber": null,
    "documentStatus": "ANALYZE",
    "activeStatus": "ACTIVE",
    "currentVersionId": "00000000-0000-4000-8000-000000000001",
    "scanStatus": "PENDING",
    "currentAnalysis": null,
    "checkedAnalysisId": null,
    "checkedAt": null,
    "checkedBy": null,
    "checkedComment": null,
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updatedocumentmetadata"></a>
### updateDocumentMetadata
`PATCH /api/v1/documents/{id}` • Permission `document.edit` • FR-025, FR-026

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `DocumentMetadataRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "documentName": "Contoh FinLens",
  "versionNo": 1
}
```

**Flow Logic**

1. Periksa document.edit, tenant, versionNo dan status OPEN; CHECKED/ANALYZE ditolak 409.
2. Validasi documentName 100 unik; nomor dokumen output engine, tidak boleh diinput. Kategori baru harus aktif.
3. Rename saja: update metadata/version/audit dan return 200. Kategori berubah: snapshot konfigurasi baru, analysis QUEUED pada PDF CLEAN versi yang sama, document ANALYZE + outbox + audit satu transaksi, return 202.
4. Pointer analysis lama tetap ada di histori, tidak boleh dipakai finalize setelah input kategori berubah.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateDocumentMetadataResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 202 | updateDocumentMetadataResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "documentName": "Contoh FinLens",
    "fileCategoryId": "00000000-0000-4000-8000-000000000001",
    "categoryName": "xxxxxxxxxxxxxxxxxxxx",
    "documentNumber": null,
    "documentStatus": "ANALYZE",
    "activeStatus": "ACTIVE",
    "currentVersionId": "00000000-0000-4000-8000-000000000001",
    "scanStatus": "PENDING",
    "currentAnalysis": null,
    "checkedAnalysisId": null,
    "checkedAt": null,
    "checkedBy": null,
    "checkedComment": null,
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "DOCUMENT_STATE_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="deletedocument"></a>
### deleteDocument
`DELETE /api/v1/documents/{id}` • Permission `document.delete` • FR-025, FR-026

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `query.versionNo`: {"type": "integer", "minimum": 1} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize document.delete dan scope tenant; lock versionNo + status OPEN.
2. Set deleted_at dan version/audit satu transaksi; CHECKED/ANALYZE ditolak 409.
3. PDF/version/analysis/evidence tetap disimpan private, tidak physical purge; target hilang dari list/candidate/view biasa. Return 204.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Command completed with no response body |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "DOCUMENT_STATE_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="uploaddocumentversion"></a>
### uploadDocumentVersion
`POST /api/v1/documents/{id}/versions` • Permission `document.edit` • FR-023, FR-024, FR-025, FR-026

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `header.Idempotency-Key`: {"type": "string", "minLength": 16, "maxLength": 128} — wajib
- Body `multipart/form-data`: `DocumentVersionUploadRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "file": "<binary PDF>",
  "versionNo": 1
}
```

**Flow Logic**

1. Periksa permission document.edit, auth scope, dan Idempotency-Key; hash metadata+SHA256 file. Key sama/payload beda → 409. Key completed sama → response awal setelah otorisasi ulang.
2. Validasi nama 100 dan kategori aktif untuk create; replacement wajib versionNo dan status OPEN. Stream PDF maksimal 20971520 byte; cek signature/MIME, parser 1–100 halaman dan tidak encrypted. Tolak format/size invalid 413/415/422.
3. Simpan private immutable object di quarantine. Dalam transaksi recheck category/status/version/unique name; create document/version ANALYZE dengan scan PENDING, create analysis QUEUED + category/anomaly/candidate snapshot, audit dan outbox scan-request. Selesai idempotency bersama commit.
4. Return 202 Document DTO; 202 berarti diterima untuk scan/AI, belum dinyatakan CLEAN. Scan job ClamAV harus CLEAN sebelum outbox analysis-request dibuat. INFECTED/ERROR terminal → processing FAILED, tanpa akses bytes; status bisnis tetap ANALYZE.
5. Worker memproses snapshot; hasil diterima hanya untuk lease aktif/current version. Commit analysis COMPLETED+findings+similarities dan document OPEN satu transaksi. Retry 30/120 detik, attempt 15 menit, max 3 lalu DLQ.

**Respons**

| HTTP | Kontrak |
|---|---|
| 202 | uploadDocumentVersionResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 413 | ErrorResponse |
| 415 | ErrorResponse |
| 503 | ErrorResponse |

Contoh bentuk sukses 202 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "documentName": "Contoh FinLens",
    "fileCategoryId": "00000000-0000-4000-8000-000000000001",
    "categoryName": "xxxxxxxxxxxxxxxxxxxx",
    "documentNumber": null,
    "documentStatus": "ANALYZE",
    "activeStatus": "ACTIVE",
    "currentVersionId": "00000000-0000-4000-8000-000000000001",
    "scanStatus": "PENDING",
    "currentAnalysis": null,
    "checkedAnalysisId": null,
    "checkedAt": null,
    "checkedBy": null,
    "checkedComment": null,
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="toggledocumentactivestatus"></a>
### toggleDocumentActiveStatus
`PATCH /api/v1/documents/{id}/status` • Permission `document.edit` • FR-025, FR-026

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `StatusUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

**Flow Logic**

1. Authorize document.edit dan scope tenant; lock document dengan versionNo.
2. Hanya OPEN boleh toggle ACTIVE/NON_ACTIVE; ANALYZE/CHECKED → 409.
3. Set active_flag Y/N dan version/audit. Non-active keluar antrean review/dashboard/candidate; active kembali eligible tanpa reanalysis bila input tetap sama. Return Document.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | toggleDocumentActiveStatusResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "documentName": "Contoh FinLens",
    "fileCategoryId": "00000000-0000-4000-8000-000000000001",
    "categoryName": "xxxxxxxxxxxxxxxxxxxx",
    "documentNumber": null,
    "documentStatus": "ANALYZE",
    "activeStatus": "ACTIVE",
    "currentVersionId": "00000000-0000-4000-8000-000000000001",
    "scanStatus": "PENDING",
    "currentAnalysis": null,
    "checkedAnalysisId": null,
    "checkedAt": null,
    "checkedBy": null,
    "checkedComment": null,
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "DOCUMENT_STATE_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="downloaddocument"></a>
### downloadDocument
`GET /api/v1/documents/{id}/download` • Permission `document.download` • FR-044

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize document.download dan tenant non-deleted.
2. Resolve current version CLEAN; signed proxy ticket 60 detik dengan disposition attachment.
3. Periksa session dan izin setiap byte request, termasuk Range; append DOWNLOAD_DOCUMENT audit teredaksi, jangan audit URL/token.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | downloadDocumentResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 409 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "url": "/api/v1/files/example-ticket",
    "expiresAt": "2026-09-05T03:00:00Z",
    "documentVersionId": "00000000-0000-4000-8000-000000000001",
    "disposition": "inline"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listreviewhistory"></a>
### listReviewHistory
`GET /api/v1/reviews` • Permission `review.view` • FR-006, FR-027, FR-042

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"type": "string", "enum": ["ANALYZE", "OPEN", "CHECKED"]} — opsional
- `query.createdFrom`: {"type": "string", "format": "date"} — opsional
- `query.createdTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedFrom`: {"type": "string", "format": "date"} — opsional
- `query.updatedTo`: {"type": "string", "format": "date"} — opsional
- `query.updatedBy`: {"type": "string", "format": "uuid"} — opsional
- `query.fileCategoryId`: {"type": "string", "format": "uuid"} — opsional
- `query.severityCode`: {"type": "string", "enum": ["CLEAN", "LOW", "MEDIUM", "HIGH", "CRITICAL"]} — opsional
- `query.createdBy`: {"type": "string", "format": "uuid"} — opsional
- `query.sortBy`: {"type": "string", "enum": ["createdAt", "updatedAt", "name"], "default": "createdAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize review.view dan tenant; query dokumen active non-deleted termasuk ANALYZE untuk transparansi proses.
2. Filter nama/category/severity/status/createdBy/updatedBy/date; severity hanya current completed result, stable sort/pagination.
3. Return Document list; tidak melakukan finalize, tidak mengubah status atau metadata.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listReviewHistoryResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="getreviewdetail"></a>
### getReviewDetail
`GET /api/v1/reviews/{id}` • Permission `review.view` • FR-027, FR-043, FR-044

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize review.view, resolve active non-deleted tenant document; foreign/inactive/deleted → 404.
2. Resolve current analysis dan versi, atau checked_analysis_id untuk CHECKED. Findings/extractedData hanya dari analysis COMPLETED; untuk ANALYZE/FAILED return empty findings/data dan canFinalize=false.
3. Return ReviewDetail dengan canFinalize berdasarkan izin review.edit + active OPEN + current completed, canDownload berdasarkan review.download. Tidak menulis CHECKED. Catat REVIEW_DOCUMENT access audit terdeduplikasi, bukan mutation.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getReviewDetailResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "document": {
      "id": "00000000-0000-4000-8000-000000000001",
      "tenantId": "00000000-0000-4000-8000-000000000001",
      "documentName": "Contoh FinLens",
      "fileCategoryId": "00000000-0000-4000-8000-000000000001",
      "categoryName": "xxxxxxxxxxxxxxxxxxxx",
      "documentNumber": null,
      "documentStatus": "ANALYZE",
      "activeStatus": "ACTIVE",
      "currentVersionId": "00000000-0000-4000-8000-000000000001",
      "scanStatus": "PENDING",
      "currentAnalysis": null,
      "checkedAnalysisId": null,
      "checkedAt": null,
      "checkedBy": null,
      "checkedComment": null,
      "createdAt": "2026-09-05T03:00:00Z",
      "createdBy": null,
      "updatedAt": null,
      "updatedBy": null,
      "versionNo": 1
    },
    "analysis": null,
    "findings": [],
    "extractedData": {},
    "canFinalize": false,
    "canDownload": false
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listreviewsimilarities"></a>
### listReviewSimilarities
`GET /api/v1/reviews/{id}/similarities` • Permission `review.view` • FR-028

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize review.view pada dokumen source active/non-deleted.
2. Ambil matches dari current completed/checked analysis dan snapshot exact candidate versions; filter candidate yang kini tidak authorized/active/non-deleted.
3. Return pagination Similarity DTO; score nullable bila engine tidak memberi metrik, jangan mengarang persentase. Tidak menulis status dokumen.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listReviewSimilaritiesResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="comparereviewdocument"></a>
### compareReviewDocument
`GET /api/v1/reviews/{id}/compare/{matchDocumentId}` • Permission `review.view` • FR-028, FR-044

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `path.matchDocumentId`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize review.view dan kedua resource tenant sama.
2. matchDocumentId wajib anggota similarity source current/checked analysis; jika kandidat buatan atau versi tidak terkait → 404.
3. Return source/candidate metadata dan exact sourceVersionId/candidateVersionId historis. Berkas dibuka melalui getReviewFile matchId, bukan mengambil file kandidat current terbaru.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | compareReviewDocumentResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "source": {
      "id": "00000000-0000-4000-8000-000000000001",
      "tenantId": "00000000-0000-4000-8000-000000000001",
      "documentName": "Contoh FinLens",
      "fileCategoryId": "00000000-0000-4000-8000-000000000001",
      "categoryName": "xxxxxxxxxxxxxxxxxxxx",
      "documentNumber": null,
      "documentStatus": "ANALYZE",
      "activeStatus": "ACTIVE",
      "currentVersionId": "00000000-0000-4000-8000-000000000001",
      "scanStatus": "PENDING",
      "currentAnalysis": null,
      "checkedAnalysisId": null,
      "checkedAt": null,
      "checkedBy": null,
      "checkedComment": null,
      "createdAt": "2026-09-05T03:00:00Z",
      "createdBy": null,
      "updatedAt": null,
      "updatedBy": null,
      "versionNo": 1
    },
    "candidate": {
      "id": "00000000-0000-4000-8000-000000000001",
      "tenantId": "00000000-0000-4000-8000-000000000001",
      "documentName": "Contoh FinLens",
      "fileCategoryId": "00000000-0000-4000-8000-000000000001",
      "categoryName": "xxxxxxxxxxxxxxxxxxxx",
      "documentNumber": null,
      "documentStatus": "ANALYZE",
      "activeStatus": "ACTIVE",
      "currentVersionId": "00000000-0000-4000-8000-000000000001",
      "scanStatus": "PENDING",
      "currentAnalysis": null,
      "checkedAnalysisId": null,
      "checkedAt": null,
      "checkedBy": null,
      "checkedComment": null,
      "createdAt": "2026-09-05T03:00:00Z",
      "createdBy": null,
      "updatedAt": null,
      "updatedBy": null,
      "versionNo": 1
    },
    "match": {
      "id": "00000000-0000-4000-8000-000000000001",
      "matchedDocumentId": "00000000-0000-4000-8000-000000000001",
      "matchedVersionId": "00000000-0000-4000-8000-000000000001",
      "documentName": "Contoh FinLens",
      "matchType": "xxxxxxxxxxxxxxxxxxxx",
      "score": null,
      "severityCode": "CLEAN",
      "rank": 1,
      "algorithmVersion": "xxxxxxxxxxxxxxxxxxxx",
      "signals": {},
      "explanation": {}
    },
    "sourceVersionId": "00000000-0000-4000-8000-000000000001",
    "candidateVersionId": "00000000-0000-4000-8000-000000000001"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="finalizereview"></a>
### finalizeReview
`POST /api/v1/reviews/{id}/finalize` • Permission `review.edit` • FR-026, FR-029

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `FinalizeReviewRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "analysisId": "00000000-0000-4000-8000-000000000001",
  "versionNo": 1
}
```

**Flow Logic**

1. Validasi review.edit, tenant dan Idempotency-Key; duplicate completed sama di-replay setelah auth.
2. Lock document; wajib OPEN, ACTIVE, current version CLEAN, versionNo cocok dan analysisId adalah current COMPLETED analysis milik dokumen/version tersebut.
3. Set CHECKED, checkedAnalysisId/checkedBy/checkedAt/comment dan metadata; append audit + notification outbox + idempotency response satu transaksi.
4. Return Document; stale version/analysis, inactive, ANALYZE atau already CHECKED dengan key berbeda → 409 tanpa perubahan. Trigger mempertahankan immutable terminal state.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | finalizeReviewResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "documentName": "Contoh FinLens",
    "fileCategoryId": "00000000-0000-4000-8000-000000000001",
    "categoryName": "xxxxxxxxxxxxxxxxxxxx",
    "documentNumber": null,
    "documentStatus": "ANALYZE",
    "activeStatus": "ACTIVE",
    "currentVersionId": "00000000-0000-4000-8000-000000000001",
    "scanStatus": "PENDING",
    "currentAnalysis": null,
    "checkedAnalysisId": null,
    "checkedAt": null,
    "checkedBy": null,
    "checkedComment": null,
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "DOCUMENT_STATE_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listauditlogs"></a>
### listAuditLogs
`GET /api/v1/audit-logs` • Permission `audit.view` • FR-006, FR-030, FR-031, FR-042, FR-045

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"in": "query", "schema": {"type": "string", "enum": ["ACTIVE", "NON_ACTIVE"]}} — opsional
- `query.from`: {"type": "string", "format": "date"} — opsional
- `query.to`: {"type": "string", "format": "date"} — opsional
- `query.module`: {"type": "string", "maxLength": 100} — opsional
- `query.action`: {"type": "string", "maxLength": 100} — opsional
- `query.actorId`: {"type": "string", "format": "uuid"} — opsional
- `query.sortBy`: {"type": "string", "enum": ["occurredAt"], "default": "occurredAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize audit.view dan tenant session.
2. Query append-only audit, filter search pada snapshot actor/module/action, actor/module/action/date dan stable paging.
3. Return redacted DTO snapshot actor/role/target dan before/after. Tidak ada create/update/delete/export endpoint dan read tidak menulis mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listAuditLogsResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="getauditlog"></a>
### getAuditLog
`GET /api/v1/audit-logs/{id}` • Permission `audit.view` • FR-006, FR-030, FR-031, FR-045

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize audit.view dan tenant session.
2. Query append-only audit, ID tenant terkait atau 404.
3. Return redacted DTO snapshot actor/role/target dan before/after. Tidak ada create/update/delete/export endpoint dan read tidak menulis mutation audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getAuditLogResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "actorId": null,
    "actorName": null,
    "actorRoleName": null,
    "module": "xxxxxxxxxxxxxxxxxxxx",
    "action": "xxxxxxxxxxxxxxxxxxxx",
    "targetId": null,
    "targetName": null,
    "result": "xxxxxxxxxxxxxxxxxxxx",
    "occurredAt": "2026-09-05T03:00:00Z",
    "before": null,
    "after": null,
    "correlationId": "example-correlation-id"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="getdashboard"></a>
### getDashboard
`GET /api/v1/dashboard` • Permission `dashboard.view` • FR-006, FR-032, FR-033, FR-034, FR-035

**Input**

- `query.from`: {"type": "string", "format": "date"} — opsional
- `query.to`: {"type": "string", "format": "date"} — opsional
- `query.timezone`: {"type": "string", "default": "Asia/Jakarta"} — opsional
- `query.missingPage`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.missingPerPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize dashboard.view; filter submitted date from/to inklusif UI → [start,nextDay) UTC Asia/Jakarta, default All Time.
2. Gunakan satu snapshot transaksi read-only: total dokumen aktif non-deleted; analyze/open/checked harus menjumlah total. OPEN/CHECKED percent = jumlah/total*100, denominator 0 → 0.
3. Severity hanya latest COMPLETED current analysis per dokumen; tanpa hasil tidak dihitung CLEAN. Mapping engine HIGH RISK→HIGH, MEDIUM RISK→MEDIUM, LOW RISK→LOW.
4. Kelengkapan nomor memakai document_info.invoice_number trim; completed with/without; unknown untuk belum completed. with+without+unknown=total; persen kelengkapan memakai analyzedTotal, nol→0. Persist flag anomali engine INVOICE_TANPA_NOMOR sebagai evidence terpisah, bukan pengganti nomor hasil ekstraksi.
5. Return ringkasan+missing-number page+snapshotAt; chart scale dinamis. Refresh tanpa full reload; hidden tab hentikan polling.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getDashboardResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "total": 0,
    "analyze": 0,
    "open": 0,
    "checked": 0,
    "openPercent": 0,
    "checkedPercent": 0,
    "analyzedTotal": 0,
    "severityDistribution": {
      "CLEAN": 0,
      "LOW": 0,
      "MEDIUM": 0,
      "HIGH": 0,
      "CRITICAL": 0
    },
    "withNumber": 0,
    "withoutNumber": 0,
    "unknownNumber": 0,
    "withNumberPercent": 0,
    "withoutNumberPercent": 0,
    "missingNumberDocuments": [],
    "missingPage": 1,
    "missingPerPage": 1,
    "missingTotal": 0,
    "snapshotAt": "2026-09-05T03:00:00Z"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listnotifications"></a>
### listNotifications
`GET /api/v1/notifications` • Permission `authenticated` • FR-006, FR-036, FR-037, FR-042

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- `query.search`: {"type": "string", "maxLength": 200} — opsional
- `query.status`: {"in": "query", "schema": {"type": "string", "enum": ["ACTIVE", "NON_ACTIVE"]}} — opsional
- `query.from`: {"type": "string", "format": "date"} — opsional
- `query.to`: {"type": "string", "format": "date"} — opsional
- `query.readStatus`: {"type": "string", "enum": ["ALL", "READ", "UNREAD"], "default": "ALL"} — opsional
- `query.sortBy`: {"type": "string", "enum": ["createdAt"], "default": "createdAt"} — opsional
- `query.sortOrder`: {"type": "string", "enum": ["asc", "desc"], "default": "desc"} — opsional
- `query.timezone`: {"type": "string", "enum": ["Asia/Jakarta"], "default": "Asia/Jakarta"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize authenticated user; filter tenant_id+recipient_user_id.
2. Filter ALL/READ/UNREAD dan date, newest first ID tie-breaker, pagination 20/100.
3. Return Notification DTO; notification tidak memberi hak tambahan ke target dokumen.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listNotificationsResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="getunreadnotificationcount"></a>
### getUnreadNotificationCount
`GET /api/v1/notifications/unread-count` • Permission `authenticated` • FR-036, FR-037

**Input**

- Body: tidak ada.

**Flow Logic**

1. Authorize authenticated user.
2. COUNT unread recipient rows pada tenant/user sendiri; return unreadCount. Polling tidak memperpanjang idle.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getUnreadNotificationCountResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "unreadCount": 0
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="marknotificationread"></a>
### markNotificationRead
`POST /api/v1/notifications/{id}/read` • Permission `authenticated` • FR-037, FR-038

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Resolve tenant+recipient user dari session; tidak boleh menandai notification user lain.
2. Tandai unread→read satu transaksi, readAt tidak berubah untuk replay. Mark-all memakai created_at<=server cutoff transaksi sehingga event baru sesudah cutoff tetap unread.
3. Return updatedCount, unreadCount terbaru dan documentId (null untuk mark-all). FE revalidasi izin target; penerima tanpa review.view mendapat akses ditolak tanpa membuka data.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | markNotificationReadResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "updatedCount": 0,
    "unreadCount": 0,
    "documentId": null
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="markallnotificationsread"></a>
### markAllNotificationsRead
`POST /api/v1/notifications/read-all` • Permission `authenticated` • FR-037

**Input**

- Body: tidak ada.

**Flow Logic**

1. Resolve tenant+recipient user dari session; tidak boleh menandai notification user lain.
2. Tandai unread→read satu transaksi, readAt tidak berubah untuk replay. Mark-all memakai created_at<=server cutoff transaksi sehingga event baru sesudah cutoff tetap unread.
3. Return updatedCount, unreadCount terbaru dan documentId (null untuk mark-all). FE revalidasi izin target; penerima tanpa review.view mendapat akses ditolak tanpa membuka data.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | markAllNotificationsReadResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "updatedCount": 0,
    "unreadCount": 0,
    "documentId": null
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="getmyprofile"></a>
### getMyProfile
`GET /api/v1/me` • Permission `authenticated` • FR-039

**Input**

- Body: tidak ada.

**Flow Logic**

1. Authorize authenticated user+tenant.
2. Load own user/profile, active role permissions terbaru dan derived delivery status.
3. Return MyProfile, email read-only; tidak memberi akses user lain dan tidak mengubah metadata.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getMyProfileResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "email": "user@example.com",
    "roleId": "00000000-0000-4000-8000-000000000001",
    "status": "ACTIVE",
    "credentialDeliveryStatus": "QUEUED",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1,
    "permissionCodes": []
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="updatemyprofile"></a>
### updateMyProfile
`PATCH /api/v1/me` • Permission `authenticated` • FR-039

**Input**

- Body `application/json`: `ProfileUpdateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1
}
```

**Flow Logic**

1. Authorize own user, validasi name 100 nonblank dan versionNo; tolak email/roleId/tenantId dari body.
2. Lock user dan version; update name/version/metadata/audit atomik.
3. Return MyProfile dengan effective permission terbaru.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | updateMyProfileResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "email": "user@example.com",
    "roleId": "00000000-0000-4000-8000-000000000001",
    "status": "ACTIVE",
    "credentialDeliveryStatus": "QUEUED",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1,
    "permissionCodes": []
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="changemypassword"></a>
### changeMyPassword
`POST /api/v1/me/change-password` • Permission `authenticated` • FR-040

**Input**

- Body `application/json`: `ChangePasswordRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "currentPassword": "ExampleOnly9!",
  "newPassword": "ExampleOnly9!",
  "confirmPassword": "ExampleOnly9!"
}
```

**Flow Logic**

1. Authorize session own user; verifikasi currentPassword, new/confirmPassword identik 8–64 kompleks dan berbeda.
2. Lock user; update hash/credential version, revoke session lain dan auth/reset contexts, rotate current refresh + access session secara atomik.
3. Return Message, cookie refresh baru dan FE melakukan refresh terkontrol untuk access baru; audit tanpa secret.

**Respons**

| HTTP | Kontrak |
|---|---|
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 200 | changeMyPasswordResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "message": "xxxxxxxxxxxxxxxxxxxx"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listmysessions"></a>
### listMySessions
`GET /api/v1/me/sessions` • Permission `authenticated` • FR-005, FR-041

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize own user+tenant; query session durable yang aktif, belum absolute expiry atau idle cutoff.
2. Return Session DTO dengan isCurrent dari sid JWT, default pagination 20 memuat maksimal 5. Never return refresh hashes/JTI.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listMySessionsResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="revokemysession"></a>
### revokeMySession
`DELETE /api/v1/me/sessions/{sessionId}` • Permission `authenticated` • FR-041

**Input**

- `path.sessionId`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize own user+tenant dan resolve sessionId kepunyaan user.
2. Jika sessionId=current session → 409 CURRENT_SESSION_NOT_REVOCABLE; gunakan authLogout untuk current.
3. Revoke target session dan seluruh refresh generations atomik, audit; 204, replay sesi milik sendiri yang sudah revoked tetap 204. Request berikutnya dari perangkat target → 401.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Command completed with no response body |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Error memakai ErrorResponse; contoh konflik state:
```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Operasi tidak sesuai kondisi data saat ini.",
    "correlationId": "example-correlation-id"
  }
}
```

<a id="completeinitialpassword"></a>
### completeInitialPassword
`POST /api/v1/auth/initial-password` • Permission `password-context` • FR-001, FR-005, FR-011

**Input**

- Body `application/json`: `InitialPasswordRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "newPassword": "ExampleOnly9!",
  "confirmPassword": "ExampleOnly9!"
}
```

**Flow Logic**

1. Validasi CHANGE_PASSWORD context, expiry, consumed_at, credential_version, dan MFA evidence; tidak menerima bearer access biasa.
2. Validasi newPassword dan confirmPassword identik, 8–64 huruf besar/kecil/angka/simbol dan berbeda dari password lama; lock user/context.
3. Ganti hash; clear must_change_password, invalidasi temporary credential dan seluruh auth/reset contexts; increment credential_version; revoke semua session.
4. Consume context dan audit satu transaksi, 204. FE kembali login dengan password baru; token penuh tidak diberikan melalui endpoint ini.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Success; no body |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

<a id="cancelauthcontext"></a>
### cancelAuthContext
`POST /api/v1/auth/context/cancel` • Permission `mfa-context` • FR-002

**Input**

- Body: tidak ada.

**Flow Logic**

1. Validasi context token yang masih sah; tandai consumed jika belum dipakai.
2. Batalkan konteks server dan hapus state sensitif FE, kembali login; 204 tanpa mengubah MFA provider enrollment.

**Respons**

| HTTP | Kontrak |
|---|---|
| 204 | Success; no body |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

<a id="createcredentialdraft"></a>
### createCredentialDraft
`POST /api/v1/users/credential-drafts` • Permission `user.add` • FR-010, FR-011

**Input**

- Body `application/json`: `CredentialDraftRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{}
```

**Flow Logic**

1. Periksa user.add dan scope tenant; rate-limit.
2. Jika replaceDraftToken ada, validasi kepemilikan dan consume draft lama.
3. Generate password acak 8–64 dengan semua kelas karakter; simpan hanya hash, token digest, actor/tenant dan expiry 5 menit.
4. Return draftToken dan temporaryPassword sekali, Cache-Control no-store. Form menampung memory saja; generate ulang memanggil endpoint yang sama.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | CredentialDraftResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "draftToken": "xxxxxxxxxxxxxxxxxxxx",
    "temporaryPassword": "ExampleOnly9!",
    "expiresInSeconds": 300
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="previewdocument"></a>
### previewDocument
`GET /api/v1/documents/{id}/preview` • Permission `document.view` • FR-022, FR-044

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body: tidak ada.

**Flow Logic**

1. Authorize document.view dan tenant dokumen non-deleted.
2. Resolusi current version CLEAN; scan PENDING/ERROR/INFECTED → 409 FILE_NOT_READY.
3. Return endpoint proxy bertiket 60 detik, inline; proxy rechecks current permission/session pada setiap request termasuk Range. Tidak public URL.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | previewDocumentResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "url": "/api/v1/files/example-ticket",
    "expiresAt": "2026-09-05T03:00:00Z",
    "documentVersionId": "00000000-0000-4000-8000-000000000001",
    "disposition": "inline"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="getreviewfile"></a>
### getReviewFile
`GET /api/v1/reviews/{id}/file` • Permission `review.view` • FR-027, FR-028, FR-044

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `query.disposition`: {"type": "string", "enum": ["inline", "attachment"], "default": "inline"} — opsional
- `query.matchId`: {"type": "string", "format": "uuid"} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize review.view; untuk attachment juga wajib review.download.
2. Tanpa matchId gunakan source current/checked version; dengan matchId hanya candidate version pada similarity tersimpan dari analisis source. Validasi tenant, membership dan visibility kedua dokumen.
3. Return endpoint proxy bertiket 60 detik inline/attachment; proxy mengecek permission/session dan CLEAN pada setiap Range request. Download dicatat audit.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | getReviewFileResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "url": "/api/v1/files/example-ticket",
    "expiresAt": "2026-09-05T03:00:00Z",
    "documentVersionId": "00000000-0000-4000-8000-000000000001",
    "disposition": "inline"
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="listuploadcategories"></a>
### listUploadCategories
`GET /api/v1/document-options/categories` • Permission `document.add|document.edit` • FR-020, FR-023

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize document.add OR document.edit; jangan mensyaratkan file_category.view.
2. Return kategori aktif tenant sendiri yang tidak deleted, pagination 20/100. Tidak memberi akses mengubah master.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listUploadCategoriesResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="listassignableroles"></a>
### listAssignableRoles
`GET /api/v1/user-options/roles` • Permission `user.add|user.edit` • FR-010, FR-013

**Input**

- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Authorize user.add OR user.edit.
2. Return hanya role aktif tenant sendiri, platform_managed=false; pagination 20/100.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listAssignableRolesResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="listfilteroptions"></a>
### listFilterOptions
`GET /api/v1/filter-options` • Permission `menu-context` • FR-007, FR-022, FR-027, FR-031, FR-042

**Input**

- `query.context`: {"type": "string", "enum": ["roles", "anomalies", "file-categories", "documents", "reviews", "audit-logs"]} — wajib
- `query.field`: {"type": "string", "enum": ["createdBy", "updatedBy", "category", "severity", "actor", "module", "action"]} — wajib
- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Validasi context+field dari matriks yang diizinkan; wajib permission view modul context.
2. Query DISTINCT opsi yang benar-benar ada pada data modul tenant yang boleh dibaca: roles/anomalies/file-categories updatedBy; documents createdBy/updatedBy/category; reviews createdBy/updatedBy/category/severity; audit-logs actor/module/action. Kombinasi lain → 422.
3. Return value/label dengan pagination; tidak mengembalikan email, full user list, atau permission yang tidak diperlukan.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listFilterOptionsResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="listplatformassignableroles"></a>
### listPlatformAssignableRoles
`GET /api/v1/tenants/{id}/user-options/roles` • Permission `platform:tenant.view AND user.add` • FR-008, FR-010, FR-013

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- `query.page`: {"type": "integer", "minimum": 1, "default": 1} — opsional
- `query.perPage`: {"type": "integer", "minimum": 1, "maximum": 100, "default": 20} — opsional
- Body: tidak ada.

**Flow Logic**

1. Wajib actor dengan role platform_managed dan permission tenant.view AND user.add; tenant user biasa selalu 403.
2. Resolve path tenant {id} aktif sebagai target context di server. Return role aktif non-platform tenant target, tanpa user/document data.
3. Role bootstrap Admin Tenant dibuat saat createTenant. Target tenant tidak berubah hanya karena body menyertakan tenantId.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | listPlatformAssignableRolesResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 200 (data ilustratif, bukan data pengujian):
```json
{
  "data": [],
  "meta": {
    "correlationId": "example-correlation-id",
    "page": 1,
    "perPage": 1,
    "total": 0
  }
}
```

<a id="createplatformcredentialdraft"></a>
### createPlatformCredentialDraft
`POST /api/v1/tenants/{id}/credential-drafts` • Permission `platform:tenant.view AND user.add` • FR-008, FR-010, FR-011

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `CredentialDraftRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{}
```

**Flow Logic**

1. Wajib platform_managed dan tenant.view AND user.add; validasi target tenant aktif.
2. Jalankan createCredentialDraft dengan actor_tenant_id dari session dan tenant_id target dari path tervalidasi.
3. Draft terikat actor+target tenant, expiry 5 menit; tidak dapat dipakai pada tenant lain. Return one-time draft/password; no-store.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | CredentialDraftResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "draftToken": "xxxxxxxxxxxxxxxxxxxx",
    "temporaryPassword": "ExampleOnly9!",
    "expiresInSeconds": 300
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="createplatformuser"></a>
### createPlatformUser
`POST /api/v1/tenants/{id}/users` • Permission `platform:tenant.view AND user.add` • FR-008, FR-010, FR-011

**Input**

- `path.id`: {"type": "string", "format": "uuid"} — wajib
- Body `application/json`: `UserCreateRequest`. Definisi field normatif pada lampiran OpenAPI.

```json
{
  "name": "Contoh FinLens",
  "email": "user@example.com",
  "roleId": "00000000-0000-4000-8000-000000000001",
  "credentialDraftToken": "xxxxxxxxxxxxxxxxxxxx",
  "temporaryPassword": "ExampleOnly9!"
}
```

**Flow Logic**

1. Wajib platform_managed + tenant.view AND user.add; resolve tenant target aktif dari path, bukan body.
2. Jalankan flow createUser dengan role/draft berasal dari tenant target, email global unique, actor audit platform tercatat terpisah dari tenant data.
3. Return hanya user yang baru dibuat; seluruh operasi user list/update/status biasa tetap tenant-scoped. Tidak ada session tenant switching atau akses dokumen lintas tenant.

**Respons**

| HTTP | Kontrak |
|---|---|
| 201 | createPlatformUserResponse |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |

Contoh bentuk sukses 201 (data ilustratif, bukan data pengujian):
```json
{
  "data": {
    "id": "00000000-0000-4000-8000-000000000001",
    "tenantId": "00000000-0000-4000-8000-000000000001",
    "name": "Contoh FinLens",
    "email": "user@example.com",
    "roleId": "00000000-0000-4000-8000-000000000001",
    "status": "ACTIVE",
    "credentialDeliveryStatus": "QUEUED",
    "createdAt": "2026-09-05T03:00:00Z",
    "createdBy": null,
    "updatedAt": null,
    "updatedBy": null,
    "versionNo": 1
  },
  "meta": {
    "correlationId": "example-correlation-id"
  }
}
```

<a id="streamprivatefile"></a>
### streamPrivateFile
`GET /api/v1/files/{ticket}` • Permission `ticket-bound view/download` • FR-027, FR-028, FR-044

**Input**

- `path.ticket`: {"type": "string", "maxLength": 4096, "minLength": 32} — wajib
- `header.Range`: {"type": "string", "maxLength": 100} — opsional
- Body: tidak ada.

**Flow Logic**

1. Validate bearer session dan signed ticket 60 detik: tenant/user/sid/version/disposition/source analysis+match relation semuanya terikat. URL ticket tidak berisi JWT/access token.
2. Periksa ulang permission view/download yang sesuai context, CLEAN, active/non-deleted visibility, source/candidate membership; expired ticket 401, revoked session 401, foreign/missing 404.
3. Stream bytes private object dengan Content-Type application/pdf, Content-Disposition inline/attachment, no-store, Accept-Ranges; valid single Range → 206 Content-Range, unsatisfiable/multiple unsupported range → 416.
4. FE PDF viewer mengambil bytes dengan Authorization header (PDF.js authenticated fetch/worker transport); iframe URL tanpa auth bukan jalur yang didukung. Jangan memperpanjang idle dari background Range/polling.

**Respons**

| HTTP | Kontrak |
|---|---|
| 200 | Full authorized PDF |
| 400 | ErrorResponse |
| 401 | ErrorResponse |
| 403 | ErrorResponse |
| 404 | ErrorResponse |
| 409 | ErrorResponse |
| 422 | ErrorResponse |
| 429 | ErrorResponse |
| 500 | ErrorResponse |
| 206 | Authorized byte range |
| 416 | Unsatisfiable byte range |

## Lampiran kontrak OpenAPI 3.0.3

Blok JSON berikut adalah OpenAPI lengkap (JSON juga valid YAML 1.2). Saat coding, ekstrak ke packages/contracts/openapi.json; jangan memakai output/spec/openapi.yaml lama. Field schema dan aturan flow bersama-sama normatif. Hanya extractedData/evidence/signals dan audit redacted payload yang sengaja fleksibel.

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "FinLens Phase 1 API",
    "version": "1.0.0",
    "description": "Final FinLens local implementation baseline. FSD and recorded BA answers govern. Embedded in 02_SPEC_API.md."
  },
  "servers": [
    {
      "url": "/api/v1"
    }
  ],
  "tags": [
    {
      "name": "Authentication"
    },
    {
      "name": "Tenants"
    },
    {
      "name": "Users"
    },
    {
      "name": "Roles"
    },
    {
      "name": "Anomalies"
    },
    {
      "name": "File Categories"
    },
    {
      "name": "Documents"
    },
    {
      "name": "Reviews"
    },
    {
      "name": "Audit"
    },
    {
      "name": "Dashboard"
    },
    {
      "name": "Notifications"
    },
    {
      "name": "Profile"
    }
  ],
  "paths": {
    "/auth/login": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Authenticate email and password",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "authLogin",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "public",
        "x-requirement-ids": [
          "FR-001",
          "FR-003"
        ],
        "security": [],
        "responses": {
          "200": {
            "description": "Password accepted; result is enrollment, MFA verification, or trusted authenticated session",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginResponse"
                }
              }
            },
            "headers": {
              "Set-Cookie": {
                "schema": {
                  "type": "string"
                },
                "description": "Only after AUTHENTICATED: rotating finlens_refresh HttpOnly cookie; never put refreshToken in JSON."
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "503": {
            "$ref": "#/components/responses/ServiceUnavailable"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginRequest"
              }
            }
          }
        }
      }
    },
    "/auth/mfa/enroll": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Start MFA Provider enrollment",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "authMfaEnroll",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "mfa-context:ENROLL",
        "x-requirement-ids": [
          "FR-002"
        ],
        "security": [
          {
            "mfaContext": []
          }
        ],
        "responses": {
          "201": {
            "description": "Enrollment initiated; one-time setup material returned",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MfaEnrollmentResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "503": {
            "$ref": "#/components/responses/ServiceUnavailable"
          }
        }
      }
    },
    "/auth/mfa/verify": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Verify TOTP and create session",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "authMfaVerify",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "mfa-context:ENROLL|VERIFY",
        "x-requirement-ids": [
          "FR-002",
          "FR-005"
        ],
        "security": [
          {
            "mfaContext": []
          }
        ],
        "responses": {
          "200": {
            "description": "MFA verified: AUTHENTICATED or CHANGE_PASSWORD; recovery yields ENROLL without session.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MfaVerificationResponse"
                }
              }
            },
            "headers": {
              "Set-Cookie": {
                "schema": {
                  "type": "string"
                },
                "description": "Only after AUTHENTICATED: rotating finlens_refresh HttpOnly cookie; never put refreshToken in JSON."
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "503": {
            "$ref": "#/components/responses/ServiceUnavailable"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MfaVerifyRequest"
              }
            }
          }
        }
      }
    },
    "/auth/refresh": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Rotate refresh token",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "authRefresh",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "refresh-cookie",
        "x-requirement-ids": [
          "FR-005"
        ],
        "security": [
          {
            "refreshCookie": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/authRefreshResponse"
                }
              }
            },
            "headers": {
              "Set-Cookie": {
                "schema": {
                  "type": "string"
                },
                "description": "Only after AUTHENTICATED: rotating finlens_refresh HttpOnly cookie; never put refreshToken in JSON."
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          }
        }
      }
    },
    "/auth/logout": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Revoke current session",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "authLogout",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-005"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "204": {
            "description": "Command completed with no response body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/auth/password-reset/request": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Request password reset",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "authPasswordResetRequest",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "public",
        "x-requirement-ids": [
          "FR-004"
        ],
        "security": [],
        "responses": {
          "202": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/authPasswordResetRequestResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PasswordResetRequest"
              }
            }
          }
        }
      }
    },
    "/auth/password-reset/confirm": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Confirm password reset",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "authPasswordResetConfirm",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "public",
        "x-requirement-ids": [
          "FR-004"
        ],
        "security": [],
        "responses": {
          "204": {
            "description": "Success; no body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PasswordResetConfirmRequest"
              }
            }
          }
        }
      }
    },
    "/tenants": {
      "get": {
        "tags": [
          "Tenants"
        ],
        "summary": "List tenants",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listTenants",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "tenant.view",
        "x-requirement-ids": [
          "FR-008",
          "FR-042"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listTenantsResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "in": "query",
              "schema": {
                "type": "string",
                "enum": [
                  "ACTIVE",
                  "NON_ACTIVE"
                ]
              }
            }
          },
          {
            "name": "createdFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "createdTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedBy",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "createdAt",
                "updatedAt",
                "name"
              ],
              "default": "createdAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      },
      "post": {
        "tags": [
          "Tenants"
        ],
        "summary": "Create tenant",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "createTenant",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "tenant.add",
        "x-requirement-ids": [
          "FR-008"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createTenantResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TenantCreateRequest"
              }
            }
          }
        }
      }
    },
    "/tenants/{id}": {
      "get": {
        "tags": [
          "Tenants"
        ],
        "summary": "Get tenant detail",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getTenant",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "tenant.view",
        "x-requirement-ids": [
          "FR-008"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getTenantResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      },
      "patch": {
        "tags": [
          "Tenants"
        ],
        "summary": "Update tenant",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateTenant",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "tenant.edit",
        "x-requirement-ids": [
          "FR-008"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateTenantResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TenantUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/tenants/{id}/status": {
      "patch": {
        "tags": [
          "Tenants"
        ],
        "summary": "Activate or deactivate tenant",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateTenantStatus",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "tenant.edit",
        "x-requirement-ids": [
          "FR-009"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateTenantStatusResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StatusUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/users": {
      "get": {
        "tags": [
          "Users"
        ],
        "summary": "List tenant users",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listUsers",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "user.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-010",
          "FR-042"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listUsersResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "in": "query",
              "schema": {
                "type": "string",
                "enum": [
                  "ACTIVE",
                  "NON_ACTIVE"
                ]
              }
            }
          },
          {
            "name": "createdFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "createdTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedBy",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "createdAt",
                "updatedAt",
                "name"
              ],
              "default": "createdAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      },
      "post": {
        "tags": [
          "Users"
        ],
        "summary": "Create tenant user",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "createUser",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "user.add",
        "x-requirement-ids": [
          "FR-010",
          "FR-011"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createUserResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserCreateRequest"
              }
            }
          }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "tags": [
          "Users"
        ],
        "summary": "Get tenant user detail",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getUser",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "user.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-010"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getUserResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      },
      "patch": {
        "tags": [
          "Users"
        ],
        "summary": "Update tenant user",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateUser",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "user.edit",
        "x-requirement-ids": [
          "FR-006",
          "FR-010"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateUserResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/users/{id}/status": {
      "patch": {
        "tags": [
          "Users"
        ],
        "summary": "Activate or deactivate user",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateUserStatus",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "user.edit",
        "x-requirement-ids": [
          "FR-012"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateUserStatusResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StatusUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/users/{id}/credential-reset": {
      "post": {
        "tags": [
          "Users"
        ],
        "summary": "Issue user credential reset",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "resetUserCredential",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "user.edit",
        "x-requirement-ids": [
          "FR-011",
          "FR-012"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "202": {
            "description": "Credential delivery queued",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/resetUserCredentialResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "versionNo",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          }
        ]
      }
    },
    "/permissions": {
      "get": {
        "tags": [
          "Roles"
        ],
        "summary": "List assignable permissions",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listPermissions",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "role.view",
        "x-requirement-ids": [
          "FR-007",
          "FR-014"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listPermissionsResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          }
        ]
      }
    },
    "/roles": {
      "get": {
        "tags": [
          "Roles"
        ],
        "summary": "List tenant roles",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listRoles",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "role.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-013",
          "FR-042"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listRolesResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "in": "query",
              "schema": {
                "type": "string",
                "enum": [
                  "ACTIVE",
                  "NON_ACTIVE"
                ]
              }
            }
          },
          {
            "name": "createdFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "createdTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedBy",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "createdAt",
                "updatedAt",
                "name"
              ],
              "default": "createdAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      },
      "post": {
        "tags": [
          "Roles"
        ],
        "summary": "Create tenant role",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "createRole",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "role.add",
        "x-requirement-ids": [
          "FR-013",
          "FR-014"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createRoleResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RoleUpsertRequest"
              }
            }
          }
        }
      }
    },
    "/roles/{id}": {
      "get": {
        "tags": [
          "Roles"
        ],
        "summary": "Get tenant role detail",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getRole",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "role.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-013",
          "FR-014"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getRoleResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      },
      "patch": {
        "tags": [
          "Roles"
        ],
        "summary": "Update role and permissions",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateRole",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "role.edit",
        "x-requirement-ids": [
          "FR-013",
          "FR-014"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateRoleResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RoleUpdateRequest"
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Roles"
        ],
        "summary": "Delete unused role",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "deleteRole",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "role.delete",
        "x-requirement-ids": [
          "FR-015"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "204": {
            "description": "Command completed with no response body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "versionNo",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          }
        ]
      }
    },
    "/roles/{id}/status": {
      "patch": {
        "tags": [
          "Roles"
        ],
        "summary": "Activate or deactivate an unassigned role",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateRoleStatus",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "role.edit",
        "x-requirement-ids": [
          "FR-013"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateRoleStatusResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StatusUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/severity-levels": {
      "get": {
        "tags": [
          "Anomalies"
        ],
        "summary": "List severity catalogue",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listSeverityLevels",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "anomaly.view",
        "x-requirement-ids": [
          "FR-017"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listSeverityLevelsResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          }
        ]
      }
    },
    "/anomalies": {
      "get": {
        "tags": [
          "Anomalies"
        ],
        "summary": "List tenant anomalies",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listAnomalies",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "anomaly.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-016",
          "FR-042"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listAnomaliesResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "in": "query",
              "schema": {
                "type": "string",
                "enum": [
                  "ACTIVE",
                  "NON_ACTIVE"
                ]
              }
            }
          },
          {
            "name": "createdFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "createdTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedBy",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "createdAt",
                "updatedAt",
                "name"
              ],
              "default": "createdAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      },
      "post": {
        "tags": [
          "Anomalies"
        ],
        "summary": "Create tenant anomaly",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "createAnomaly",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "anomaly.add",
        "x-requirement-ids": [
          "FR-016",
          "FR-017"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createAnomalyResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AnomalyUpsertRequest"
              }
            }
          }
        }
      }
    },
    "/anomalies/{id}": {
      "patch": {
        "tags": [
          "Anomalies"
        ],
        "summary": "Update tenant anomaly",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateAnomaly",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "anomaly.edit",
        "x-requirement-ids": [
          "FR-016",
          "FR-017"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateAnomalyResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AnomalyUpdateRequest"
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Anomalies"
        ],
        "summary": "Delete unused anomaly",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "deleteAnomaly",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "anomaly.delete",
        "x-requirement-ids": [
          "FR-018"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "204": {
            "description": "Command completed with no response body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "versionNo",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          }
        ]
      },
      "get": {
        "operationId": "getAnomaly",
        "summary": "getAnomaly",
        "x-permission": "anomaly.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-016"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getAnomalyResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/anomalies/{id}/status": {
      "patch": {
        "tags": [
          "Anomalies"
        ],
        "summary": "Activate or deactivate anomaly",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateAnomalyStatus",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "anomaly.edit",
        "x-requirement-ids": [
          "FR-016",
          "FR-017"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateAnomalyStatusResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StatusUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/file-categories": {
      "get": {
        "tags": [
          "File Categories"
        ],
        "summary": "List file categories",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listFileCategories",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "file_category.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-019",
          "FR-020",
          "FR-042"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listFileCategoriesResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "in": "query",
              "schema": {
                "type": "string",
                "enum": [
                  "ACTIVE",
                  "NON_ACTIVE"
                ]
              }
            }
          },
          {
            "name": "createdFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "createdTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedBy",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "createdAt",
                "updatedAt",
                "name"
              ],
              "default": "createdAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      },
      "post": {
        "tags": [
          "File Categories"
        ],
        "summary": "Create file category",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "createFileCategory",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "file_category.add",
        "x-requirement-ids": [
          "FR-019"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createFileCategoryResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CategoryUpsertRequest"
              }
            }
          }
        }
      }
    },
    "/file-categories/{id}": {
      "get": {
        "tags": [
          "File Categories"
        ],
        "summary": "Get file category detail",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getFileCategory",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "file_category.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-019"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getFileCategoryResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      },
      "patch": {
        "tags": [
          "File Categories"
        ],
        "summary": "Update file category",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateFileCategory",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "file_category.edit",
        "x-requirement-ids": [
          "FR-019"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateFileCategoryResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CategoryUpdateRequest"
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "File Categories"
        ],
        "summary": "Delete unused file category",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "deleteFileCategory",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "file_category.delete",
        "x-requirement-ids": [
          "FR-021"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "204": {
            "description": "Command completed with no response body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "versionNo",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          }
        ]
      }
    },
    "/file-categories/{id}/status": {
      "patch": {
        "tags": [
          "File Categories"
        ],
        "summary": "Activate or deactivate file category",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateFileCategoryStatus",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "file_category.edit",
        "x-requirement-ids": [
          "FR-019",
          "FR-020"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateFileCategoryStatusResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StatusUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/documents": {
      "get": {
        "tags": [
          "Documents"
        ],
        "summary": "List tenant documents",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listDocuments",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "document.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-022",
          "FR-042"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listDocumentsResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "ANALYZE",
                "OPEN",
                "CHECKED"
              ]
            }
          },
          {
            "name": "createdFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "createdTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedBy",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "fileCategoryId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "activeStatus",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "ACTIVE",
                "NON_ACTIVE"
              ]
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "createdAt",
                "updatedAt",
                "name"
              ],
              "default": "createdAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      },
      "post": {
        "tags": [
          "Documents"
        ],
        "summary": "Upload and submit PDF",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "createDocument",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "document.add",
        "x-requirement-ids": [
          "FR-023",
          "FR-024"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "202": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createDocumentResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "413": {
            "description": "PDF_TOO_LARGE",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "415": {
            "description": "PDF_FORMAT_INVALID",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "503": {
            "description": "STORAGE_OR_SCANNER_UNAVAILABLE",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/DocumentUploadRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "Idempotency-Key",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "minLength": 16,
              "maxLength": 128
            }
          }
        ]
      }
    },
    "/documents/{id}": {
      "get": {
        "tags": [
          "Documents"
        ],
        "summary": "Get document detail",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getDocument",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "document.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-022",
          "FR-025"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getDocumentResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      },
      "patch": {
        "tags": [
          "Documents"
        ],
        "summary": "Update OPEN document metadata",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateDocumentMetadata",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "document.edit",
        "x-requirement-ids": [
          "FR-025",
          "FR-026"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateDocumentMetadataResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "202": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateDocumentMetadataResponse"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DocumentMetadataRequest"
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Documents"
        ],
        "summary": "Delete OPEN document under retention policy",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "deleteDocument",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "document.delete",
        "x-requirement-ids": [
          "FR-025",
          "FR-026"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "204": {
            "description": "Command completed with no response body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "versionNo",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          }
        ]
      }
    },
    "/documents/{id}/versions": {
      "post": {
        "tags": [
          "Documents"
        ],
        "summary": "Upload replacement PDF version",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "uploadDocumentVersion",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "document.edit",
        "x-requirement-ids": [
          "FR-023",
          "FR-024",
          "FR-025",
          "FR-026"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "202": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/uploadDocumentVersionResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "413": {
            "description": "PDF_TOO_LARGE",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "415": {
            "description": "PDF_FORMAT_INVALID",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "503": {
            "description": "STORAGE_OR_SCANNER_UNAVAILABLE",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "Idempotency-Key",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "minLength": 16,
              "maxLength": 128
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/DocumentVersionUploadRequest"
              }
            }
          }
        }
      }
    },
    "/documents/{id}/status": {
      "patch": {
        "tags": [
          "Documents"
        ],
        "summary": "Toggle OPEN document active status",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "toggleDocumentActiveStatus",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "document.edit",
        "x-requirement-ids": [
          "FR-025",
          "FR-026"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/toggleDocumentActiveStatusResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StatusUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/documents/{id}/download": {
      "get": {
        "tags": [
          "Documents"
        ],
        "summary": "Download authorized private PDF",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "downloadDocument",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "document.download",
        "x-requirement-ids": [
          "FR-044"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/downloadDocumentResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      }
    },
    "/reviews": {
      "get": {
        "tags": [
          "Reviews"
        ],
        "summary": "List checker review history",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listReviewHistory",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "review.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-027",
          "FR-042"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listReviewHistoryResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "ANALYZE",
                "OPEN",
                "CHECKED"
              ]
            }
          },
          {
            "name": "createdFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "createdTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedFrom",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedTo",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "updatedBy",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "fileCategoryId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "severityCode",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "CLEAN",
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
              ]
            }
          },
          {
            "name": "createdBy",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "createdAt",
                "updatedAt",
                "name"
              ],
              "default": "createdAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      }
    },
    "/reviews/{id}": {
      "get": {
        "tags": [
          "Reviews"
        ],
        "summary": "Get review detail, findings, and evidence",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getReviewDetail",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "review.view",
        "x-requirement-ids": [
          "FR-027",
          "FR-043",
          "FR-044"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getReviewDetailResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      }
    },
    "/reviews/{id}/similarities": {
      "get": {
        "tags": [
          "Reviews"
        ],
        "summary": "List similarity recommendations",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listReviewSimilarities",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "review.view",
        "x-requirement-ids": [
          "FR-028"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listReviewSimilaritiesResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          }
        ]
      }
    },
    "/reviews/{id}/compare/{matchDocumentId}": {
      "get": {
        "tags": [
          "Reviews"
        ],
        "summary": "Get side-by-side comparison data",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "compareReviewDocument",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "review.view",
        "x-requirement-ids": [
          "FR-028",
          "FR-044"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/compareReviewDocumentResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "matchDocumentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      }
    },
    "/reviews/{id}/finalize": {
      "post": {
        "tags": [
          "Reviews"
        ],
        "summary": "Finalize OPEN document as immutable CHECKED",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "finalizeReview",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "review.edit",
        "x-requirement-ids": [
          "FR-026",
          "FR-029"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/finalizeReviewResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FinalizeReviewRequest"
              }
            }
          }
        }
      }
    },
    "/audit-logs": {
      "get": {
        "tags": [
          "Audit"
        ],
        "summary": "List immutable activity logs",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listAuditLogs",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "audit.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-030",
          "FR-031",
          "FR-042",
          "FR-045"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listAuditLogsResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "in": "query",
              "schema": {
                "type": "string",
                "enum": [
                  "ACTIVE",
                  "NON_ACTIVE"
                ]
              }
            }
          },
          {
            "name": "from",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "to",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "module",
            "in": "query",
            "schema": {
              "type": "string",
              "maxLength": 100
            }
          },
          {
            "name": "action",
            "in": "query",
            "schema": {
              "type": "string",
              "maxLength": 100
            }
          },
          {
            "name": "actorId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "occurredAt"
              ],
              "default": "occurredAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      }
    },
    "/audit-logs/{id}": {
      "get": {
        "tags": [
          "Audit"
        ],
        "summary": "Get immutable activity detail",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getAuditLog",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "audit.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-030",
          "FR-031",
          "FR-045"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getAuditLogResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      }
    },
    "/dashboard": {
      "get": {
        "tags": [
          "Dashboard"
        ],
        "summary": "Get tenant dashboard snapshot",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getDashboard",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "dashboard.view",
        "x-requirement-ids": [
          "FR-006",
          "FR-032",
          "FR-033",
          "FR-034",
          "FR-035"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getDashboardResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "from",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "to",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "default": "Asia/Jakarta"
            }
          },
          {
            "name": "missingPage",
            "in": "query",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "missingPerPage",
            "in": "query",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 20
            }
          }
        ]
      }
    },
    "/notifications": {
      "get": {
        "tags": [
          "Notifications"
        ],
        "summary": "List current user's notifications",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listNotifications",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-006",
          "FR-036",
          "FR-037",
          "FR-042"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listNotificationsResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          },
          {
            "$ref": "#/components/parameters/Search"
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "in": "query",
              "schema": {
                "type": "string",
                "enum": [
                  "ACTIVE",
                  "NON_ACTIVE"
                ]
              }
            }
          },
          {
            "name": "from",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "to",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "readStatus",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "ALL",
                "READ",
                "UNREAD"
              ],
              "default": "ALL"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "createdAt"
              ],
              "default": "createdAt"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            }
          },
          {
            "name": "timezone",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "Asia/Jakarta"
              ],
              "default": "Asia/Jakarta"
            }
          }
        ]
      }
    },
    "/notifications/unread-count": {
      "get": {
        "tags": [
          "Notifications"
        ],
        "summary": "Get unread notification count",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getUnreadNotificationCount",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-036",
          "FR-037"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getUnreadNotificationCountResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/notifications/{id}/read": {
      "post": {
        "tags": [
          "Notifications"
        ],
        "summary": "Mark one notification read",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "markNotificationRead",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-037",
          "FR-038"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/markNotificationReadResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      }
    },
    "/notifications/read-all": {
      "post": {
        "tags": [
          "Notifications"
        ],
        "summary": "Mark all notifications read",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "markAllNotificationsRead",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-037"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/markAllNotificationsReadResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/me": {
      "get": {
        "tags": [
          "Profile"
        ],
        "summary": "Get own profile",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "getMyProfile",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-039"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getMyProfileResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      },
      "patch": {
        "tags": [
          "Profile"
        ],
        "summary": "Update own profile name",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "updateMyProfile",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-039"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateMyProfileResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ProfileUpdateRequest"
              }
            }
          }
        }
      }
    },
    "/me/change-password": {
      "post": {
        "tags": [
          "Profile"
        ],
        "summary": "Change own password",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "changeMyPassword",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-040"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/changeMyPasswordResponse"
                }
              }
            },
            "headers": {
              "Set-Cookie": {
                "schema": {
                  "type": "string"
                },
                "description": "Rotated current finlens_refresh cookie; other sessions revoked. FE performs one controlled refresh for a current-version access token."
              }
            }
          }
        },
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChangePasswordRequest"
              }
            }
          }
        }
      }
    },
    "/me/sessions": {
      "get": {
        "tags": [
          "Profile"
        ],
        "summary": "List own active sessions",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "listMySessions",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-005",
          "FR-041"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listMySessionsResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          }
        ]
      }
    },
    "/me/sessions/{sessionId}": {
      "delete": {
        "tags": [
          "Profile"
        ],
        "summary": "Revoke another owned session",
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md.",
        "operationId": "revokeMySession",
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "x-permission": "authenticated",
        "x-requirement-ids": [
          "FR-041"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "204": {
            "description": "Command completed with no response body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "sessionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ]
      }
    },
    "/auth/initial-password": {
      "post": {
        "operationId": "completeInitialPassword",
        "summary": "completeInitialPassword",
        "x-permission": "password-context",
        "x-requirement-ids": [
          "FR-001",
          "FR-005",
          "FR-011"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "passwordContext": []
          }
        ],
        "responses": {
          "204": {
            "description": "Success; no body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/InitialPasswordRequest"
              }
            }
          }
        },
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/auth/context/cancel": {
      "post": {
        "operationId": "cancelAuthContext",
        "summary": "cancelAuthContext",
        "x-permission": "mfa-context",
        "x-requirement-ids": [
          "FR-002"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "mfaContext": []
          },
          {
            "passwordContext": []
          }
        ],
        "responses": {
          "204": {
            "description": "Success; no body"
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/users/credential-drafts": {
      "post": {
        "operationId": "createCredentialDraft",
        "summary": "createCredentialDraft",
        "x-permission": "user.add",
        "x-requirement-ids": [
          "FR-010",
          "FR-011"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CredentialDraftResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CredentialDraftRequest"
              }
            }
          }
        },
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/documents/{id}/preview": {
      "get": {
        "operationId": "previewDocument",
        "summary": "previewDocument",
        "x-permission": "document.view",
        "x-requirement-ids": [
          "FR-022",
          "FR-044"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/previewDocumentResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/reviews/{id}/file": {
      "get": {
        "operationId": "getReviewFile",
        "summary": "getReviewFile",
        "x-permission": "review.view",
        "x-requirement-ids": [
          "FR-027",
          "FR-028",
          "FR-044"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getReviewFileResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "disposition",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "inline",
                "attachment"
              ],
              "default": "inline"
            }
          },
          {
            "name": "matchId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/document-options/categories": {
      "get": {
        "operationId": "listUploadCategories",
        "summary": "listUploadCategories",
        "x-permission": "document.add|document.edit",
        "x-requirement-ids": [
          "FR-020",
          "FR-023"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listUploadCategoriesResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          }
        ],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/user-options/roles": {
      "get": {
        "operationId": "listAssignableRoles",
        "summary": "listAssignableRoles",
        "x-permission": "user.add|user.edit",
        "x-requirement-ids": [
          "FR-010",
          "FR-013"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listAssignableRolesResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          }
        ],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/filter-options": {
      "get": {
        "operationId": "listFilterOptions",
        "summary": "listFilterOptions",
        "x-permission": "menu-context",
        "x-requirement-ids": [
          "FR-007",
          "FR-022",
          "FR-027",
          "FR-031",
          "FR-042"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listFilterOptionsResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "context",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "roles",
                "anomalies",
                "file-categories",
                "documents",
                "reviews",
                "audit-logs"
              ]
            }
          },
          {
            "name": "field",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "createdBy",
                "updatedBy",
                "category",
                "severity",
                "actor",
                "module",
                "action"
              ]
            }
          },
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          }
        ],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/tenants/{id}/user-options/roles": {
      "get": {
        "operationId": "listPlatformAssignableRoles",
        "summary": "listPlatformAssignableRoles",
        "x-permission": "platform:tenant.view AND user.add",
        "x-requirement-ids": [
          "FR-008",
          "FR-010",
          "FR-013"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/listPlatformAssignableRolesResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "$ref": "#/components/parameters/Page"
          },
          {
            "$ref": "#/components/parameters/PerPage"
          }
        ],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/tenants/{id}/credential-drafts": {
      "post": {
        "operationId": "createPlatformCredentialDraft",
        "summary": "createPlatformCredentialDraft",
        "x-permission": "platform:tenant.view AND user.add",
        "x-requirement-ids": [
          "FR-008",
          "FR-010",
          "FR-011"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CredentialDraftResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CredentialDraftRequest"
              }
            }
          }
        },
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/tenants/{id}/users": {
      "post": {
        "operationId": "createPlatformUser",
        "summary": "createPlatformUser",
        "x-permission": "platform:tenant.view AND user.add",
        "x-requirement-ids": [
          "FR-008",
          "FR-010",
          "FR-011"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createPlatformUserResponse"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        },
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserCreateRequest"
              }
            }
          }
        },
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    },
    "/files/{ticket}": {
      "get": {
        "operationId": "streamPrivateFile",
        "summary": "streamPrivateFile",
        "x-permission": "ticket-bound view/download",
        "x-requirement-ids": [
          "FR-027",
          "FR-028",
          "FR-044"
        ],
        "x-status": "Ready",
        "x-phase": "Phase 1",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Full authorized PDF",
            "content": {
              "application/pdf": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/BadRequest"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "403": {
            "$ref": "#/components/responses/Forbidden"
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "409": {
            "$ref": "#/components/responses/Conflict"
          },
          "422": {
            "$ref": "#/components/responses/Unprocessable"
          },
          "429": {
            "$ref": "#/components/responses/TooManyRequests"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          },
          "206": {
            "description": "Authorized byte range",
            "content": {
              "application/pdf": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          },
          "416": {
            "description": "Unsatisfiable byte range"
          }
        },
        "parameters": [
          {
            "name": "ticket",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "maxLength": 4096,
              "minLength": 32
            }
          },
          {
            "name": "Range",
            "in": "header",
            "schema": {
              "type": "string",
              "maxLength": 100
            }
          }
        ],
        "description": "Final contract; tenant and permissions checked server-side. See normative flow in 02_SPEC_API.md."
      }
    }
  },
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Short-lived RS256 access token bound to an active server-side session."
      },
      "mfaContext": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Five-minute FinLens token bound to one user and ENROLL or VERIFY purpose. It is not the MFA provider credential."
      },
      "refreshCookie": {
        "type": "apiKey",
        "in": "cookie",
        "name": "finlens_refresh",
        "description": "HttpOnly; Secure outside HTTP localhost; SameSite Strict; Path /api/v1/auth. Never JavaScript readable."
      },
      "passwordContext": {
        "type": "http",
        "scheme": "bearer",
        "description": "Single-use CHANGE_PASSWORD context after successful password + required provider verification; expires after five minutes."
      }
    },
    "parameters": {
      "Page": {
        "name": "page",
        "in": "query",
        "schema": {
          "type": "integer",
          "minimum": 1,
          "default": 1
        }
      },
      "PerPage": {
        "name": "perPage",
        "in": "query",
        "schema": {
          "type": "integer",
          "minimum": 1,
          "maximum": 100,
          "default": 20
        }
      },
      "Search": {
        "name": "search",
        "in": "query",
        "schema": {
          "type": "string",
          "maxLength": 200
        }
      },
      "Status": {
        "name": "status",
        "in": "query",
        "schema": {
          "type": "string"
        }
      }
    },
    "responses": {
      "Success": {
        "description": "Successful response",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/SuccessResponse"
            }
          }
        }
      },
      "BadRequest": {
        "description": "Malformed request",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      "Unauthorized": {
        "description": "Authentication required or expired",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      "Forbidden": {
        "description": "Permission denied",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      "NotFound": {
        "description": "Resource not found in the authorized scope",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      "Conflict": {
        "description": "Business state, uniqueness, idempotency, or optimistic-lock conflict",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      "Unprocessable": {
        "description": "Semantically invalid input",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      "TooManyRequests": {
        "description": "Rate limit exceeded",
        "headers": {
          "Retry-After": {
            "schema": {
              "type": "integer"
            }
          }
        },
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      "InternalError": {
        "description": "Unexpected error with safe correlation ID",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      "ServiceUnavailable": {
        "description": "MFA provider is unavailable, rejected request signing/timestamp, or returned an invalid response; fail closed and create no session",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorResponse"
            }
          }
        }
      }
    },
    "schemas": {
      "SuccessResponse": {
        "type": "object",
        "required": [
          "data"
        ],
        "properties": {
          "data": {
            "type": "object",
            "additionalProperties": true
          },
          "meta": {
            "$ref": "#/components/schemas/ResponseMeta"
          }
        }
      },
      "ResponseMeta": {
        "type": "object",
        "properties": {
          "correlationId": {
            "type": "string"
          },
          "page": {
            "type": "integer",
            "minimum": 1
          },
          "perPage": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100
          },
          "total": {
            "type": "integer",
            "minimum": 0
          },
          "snapshotAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "correlationId"
        ]
      },
      "ErrorResponse": {
        "type": "object",
        "required": [
          "error"
        ],
        "properties": {
          "error": {
            "type": "object",
            "required": [
              "code",
              "message",
              "correlationId"
            ],
            "properties": {
              "code": {
                "type": "string"
              },
              "message": {
                "type": "string"
              },
              "correlationId": {
                "type": "string"
              },
              "details": {
                "type": "array",
                "items": {
                  "type": "object",
                  "additionalProperties": true
                }
              }
            }
          }
        }
      },
      "LoginRequest": {
        "type": "object",
        "required": [
          "email",
          "password",
          "visitorId",
          "isPrivate"
        ],
        "additionalProperties": false,
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "maxLength": 100
          },
          "password": {
            "type": "string",
            "format": "password",
            "minLength": 8,
            "maxLength": 64,
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          },
          "visitorId": {
            "type": "string",
            "minLength": 1,
            "maxLength": 255,
            "description": "Collected with @mfa-client/frontend getVisitorId()."
          },
          "isPrivate": {
            "type": "boolean",
            "description": "Collected with @mfa-client/frontend checkPrivateMode()."
          }
        }
      },
      "MfaVerifyRequest": {
        "type": "object",
        "oneOf": [
          {
            "required": [
              "code"
            ]
          },
          {
            "required": [
              "recoveryCode"
            ]
          }
        ],
        "minProperties": 1,
        "maxProperties": 1,
        "additionalProperties": false,
        "properties": {
          "code": {
            "type": "string",
            "pattern": "^[0-9]{6}$"
          },
          "recoveryCode": {
            "type": "string",
            "minLength": 10,
            "maxLength": 10
          }
        }
      },
      "LoginResponse": {
        "type": "object",
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "oneOf": [
              {
                "type": "object",
                "required": [
                  "nextAction",
                  "mfaRequired",
                  "mfaContextToken",
                  "expiresInSeconds"
                ],
                "properties": {
                  "nextAction": {
                    "type": "string",
                    "enum": [
                      "ENROLL",
                      "VERIFY"
                    ]
                  },
                  "mfaRequired": {
                    "type": "boolean",
                    "enum": [
                      true
                    ]
                  },
                  "mfaContextToken": {
                    "type": "string"
                  },
                  "expiresInSeconds": {
                    "type": "integer",
                    "enum": [
                      300
                    ]
                  }
                }
              },
              {
                "type": "object",
                "required": [
                  "nextAction",
                  "mfaRequired",
                  "accessToken",
                  "expiresInSeconds"
                ],
                "properties": {
                  "nextAction": {
                    "type": "string",
                    "enum": [
                      "AUTHENTICATED"
                    ]
                  },
                  "mfaRequired": {
                    "type": "boolean",
                    "enum": [
                      false
                    ]
                  },
                  "accessToken": {
                    "type": "string"
                  },
                  "expiresInSeconds": {
                    "type": "integer",
                    "enum": [
                      900
                    ]
                  }
                }
              },
              {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "nextAction",
                  "passwordContextToken",
                  "expiresInSeconds"
                ],
                "properties": {
                  "nextAction": {
                    "type": "string",
                    "enum": [
                      "CHANGE_PASSWORD"
                    ]
                  },
                  "passwordContextToken": {
                    "type": "string",
                    "maxLength": 2048
                  },
                  "expiresInSeconds": {
                    "type": "integer",
                    "enum": [
                      300
                    ]
                  }
                }
              }
            ]
          },
          "meta": {
            "$ref": "#/components/schemas/ResponseMeta"
          }
        }
      },
      "MfaEnrollmentResponse": {
        "type": "object",
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "object",
            "required": [
              "setupKey",
              "qrCodeDataUrl",
              "recoveryCodes"
            ],
            "properties": {
              "setupKey": {
                "type": "string",
                "minLength": 32,
                "maxLength": 32,
                "description": "One-time Base32 setup key; never persist in FinLens."
              },
              "qrCodeDataUrl": {
                "type": "string",
                "format": "uri-reference"
              },
              "recoveryCodes": {
                "type": "array",
                "minItems": 3,
                "maxItems": 3,
                "items": {
                  "type": "string",
                  "minLength": 10,
                  "maxLength": 10
                }
              }
            }
          },
          "meta": {
            "$ref": "#/components/schemas/ResponseMeta"
          }
        }
      },
      "MfaVerificationResponse": {
        "type": "object",
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "oneOf": [
              {
                "type": "object",
                "required": [
                  "nextAction",
                  "accessToken",
                  "expiresInSeconds"
                ],
                "properties": {
                  "nextAction": {
                    "type": "string",
                    "enum": [
                      "AUTHENTICATED"
                    ]
                  },
                  "accessToken": {
                    "type": "string"
                  },
                  "expiresInSeconds": {
                    "type": "integer",
                    "enum": [
                      900
                    ]
                  }
                }
              },
              {
                "type": "object",
                "required": [
                  "nextAction",
                  "mfaContextToken",
                  "expiresInSeconds"
                ],
                "properties": {
                  "nextAction": {
                    "type": "string",
                    "enum": [
                      "ENROLL"
                    ]
                  },
                  "mfaContextToken": {
                    "type": "string"
                  },
                  "expiresInSeconds": {
                    "type": "integer",
                    "enum": [
                      300
                    ]
                  }
                }
              },
              {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "nextAction",
                  "passwordContextToken",
                  "expiresInSeconds"
                ],
                "properties": {
                  "nextAction": {
                    "type": "string",
                    "enum": [
                      "CHANGE_PASSWORD"
                    ]
                  },
                  "passwordContextToken": {
                    "type": "string",
                    "maxLength": 2048
                  },
                  "expiresInSeconds": {
                    "type": "integer",
                    "enum": [
                      300
                    ]
                  }
                }
              }
            ]
          },
          "meta": {
            "$ref": "#/components/schemas/ResponseMeta"
          }
        }
      },
      "PasswordResetRequest": {
        "type": "object",
        "required": [
          "email"
        ],
        "additionalProperties": false,
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "maxLength": 100
          }
        }
      },
      "PasswordResetConfirmRequest": {
        "type": "object",
        "required": [
          "token",
          "newPassword",
          "confirmPassword"
        ],
        "additionalProperties": false,
        "properties": {
          "token": {
            "type": "string",
            "minLength": 20
          },
          "newPassword": {
            "type": "string",
            "format": "password",
            "minLength": 8,
            "maxLength": 64,
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          },
          "confirmPassword": {
            "type": "string",
            "maxLength": 64,
            "minLength": 8,
            "format": "password",
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          }
        }
      },
      "StatusUpdateRequest": {
        "type": "object",
        "required": [
          "status",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "NON_ACTIVE"
            ]
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "TenantCreateRequest": {
        "type": "object",
        "required": [
          "name"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          }
        }
      },
      "TenantUpdateRequest": {
        "type": "object",
        "required": [
          "name",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "UserCreateRequest": {
        "type": "object",
        "required": [
          "name",
          "email",
          "roleId",
          "credentialDraftToken",
          "temporaryPassword"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "email": {
            "type": "string",
            "format": "email",
            "maxLength": 100
          },
          "roleId": {
            "type": "string",
            "format": "uuid"
          },
          "credentialDraftToken": {
            "type": "string",
            "maxLength": 2048,
            "writeOnly": true
          },
          "temporaryPassword": {
            "type": "string",
            "maxLength": 64,
            "minLength": 8,
            "format": "password",
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          }
        }
      },
      "UserUpdateRequest": {
        "type": "object",
        "required": [
          "name",
          "roleId",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "roleId": {
            "type": "string",
            "format": "uuid"
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "RoleUpsertRequest": {
        "type": "object",
        "required": [
          "name",
          "permissionCodes"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "permissionCodes": {
            "type": "array",
            "uniqueItems": true,
            "items": {
              "type": "string"
            }
          }
        }
      },
      "AnomalyUpsertRequest": {
        "type": "object",
        "required": [
          "name",
          "severityCode"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 255
          },
          "severityCode": {
            "type": "string",
            "enum": [
              "CLEAN",
              "LOW",
              "MEDIUM",
              "HIGH",
              "CRITICAL"
            ]
          }
        }
      },
      "CategoryUpsertRequest": {
        "type": "object",
        "required": [
          "name"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          }
        }
      },
      "DocumentUploadRequest": {
        "type": "object",
        "required": [
          "documentName",
          "fileCategoryId",
          "file"
        ],
        "properties": {
          "file": {
            "type": "string",
            "format": "binary"
          },
          "fileCategoryId": {
            "type": "string",
            "format": "uuid"
          },
          "documentName": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1
          }
        },
        "additionalProperties": false
      },
      "DocumentVersionUploadRequest": {
        "type": "object",
        "required": [
          "file",
          "versionNo"
        ],
        "properties": {
          "file": {
            "type": "string",
            "format": "binary"
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        },
        "additionalProperties": false
      },
      "DocumentMetadataRequest": {
        "type": "object",
        "required": [
          "documentName",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "documentName": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "fileCategoryId": {
            "type": "string",
            "format": "uuid"
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "FinalizeReviewRequest": {
        "type": "object",
        "required": [
          "analysisId",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "analysisId": {
            "type": "string",
            "format": "uuid"
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          },
          "comment": {
            "type": "string",
            "maxLength": 2000
          }
        }
      },
      "ProfileUpdateRequest": {
        "type": "object",
        "required": [
          "name",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "ChangePasswordRequest": {
        "type": "object",
        "required": [
          "currentPassword",
          "newPassword",
          "confirmPassword"
        ],
        "additionalProperties": false,
        "properties": {
          "currentPassword": {
            "type": "string",
            "format": "password",
            "maxLength": 64,
            "minLength": 8,
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          },
          "newPassword": {
            "type": "string",
            "format": "password",
            "minLength": 8,
            "maxLength": 64,
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          },
          "confirmPassword": {
            "type": "string",
            "maxLength": 64,
            "minLength": 8,
            "format": "password",
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          }
        }
      },
      "InitialPasswordRequest": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "newPassword",
          "confirmPassword"
        ],
        "properties": {
          "newPassword": {
            "type": "string",
            "maxLength": 64,
            "minLength": 8,
            "format": "password",
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          },
          "confirmPassword": {
            "type": "string",
            "maxLength": 64,
            "minLength": 8,
            "format": "password",
            "writeOnly": true,
            "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$"
          }
        }
      },
      "CredentialDraftResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "draftToken",
              "temporaryPassword",
              "expiresInSeconds"
            ],
            "properties": {
              "draftToken": {
                "type": "string",
                "maxLength": 2048
              },
              "temporaryPassword": {
                "type": "string",
                "maxLength": 64
              },
              "expiresInSeconds": {
                "type": "integer",
                "enum": [
                  300
                ]
              }
            }
          },
          "meta": {
            "$ref": "#/components/schemas/ResponseMeta"
          }
        }
      },
      "RoleUpdateRequest": {
        "type": "object",
        "required": [
          "name",
          "permissionCodes",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "permissionCodes": {
            "type": "array",
            "uniqueItems": true,
            "items": {
              "type": "string"
            }
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "AnomalyUpdateRequest": {
        "type": "object",
        "required": [
          "name",
          "severityCode",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 255
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          },
          "severityCode": {
            "type": "string",
            "enum": [
              "CLEAN",
              "LOW",
              "MEDIUM",
              "HIGH",
              "CRITICAL"
            ]
          }
        }
      },
      "CategoryUpdateRequest": {
        "type": "object",
        "required": [
          "name",
          "versionNo"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "Tenant": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "status",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
          "versionNo"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "maxLength": 100
          },
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "NON_ACTIVE"
            ]
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "createdBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "updatedBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "User": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "tenantId",
          "name",
          "email",
          "roleId",
          "status",
          "credentialDeliveryStatus",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
          "versionNo"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "tenantId": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "maxLength": 100
          },
          "email": {
            "type": "string",
            "maxLength": 100,
            "format": "email"
          },
          "roleId": {
            "type": "string",
            "format": "uuid"
          },
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "NON_ACTIVE"
            ]
          },
          "credentialDeliveryStatus": {
            "type": "string",
            "enum": [
              "QUEUED",
              "SENDING",
              "SENT",
              "FAILED"
            ]
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "createdBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "updatedBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "Role": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "tenantId",
          "name",
          "status",
          "permissionCodes",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
          "versionNo"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "tenantId": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "maxLength": 100
          },
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "NON_ACTIVE"
            ]
          },
          "permissionCodes": {
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 100
            }
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "createdBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "updatedBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "Anomaly": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "severityCode",
          "status",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
          "versionNo"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "maxLength": 255
          },
          "severityCode": {
            "type": "string",
            "enum": [
              "CLEAN",
              "LOW",
              "MEDIUM",
              "HIGH",
              "CRITICAL"
            ]
          },
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "NON_ACTIVE"
            ]
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "createdBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "updatedBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "FileCategory": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "status",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
          "versionNo"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "maxLength": 100
          },
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "NON_ACTIVE"
            ]
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "createdBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "updatedBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "Permission": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "code",
          "menuCode",
          "actionCode",
          "label"
        ],
        "properties": {
          "code": {
            "type": "string",
            "maxLength": 100
          },
          "menuCode": {
            "type": "string",
            "maxLength": 50
          },
          "actionCode": {
            "type": "string",
            "enum": [
              "view",
              "add",
              "edit",
              "delete",
              "download"
            ]
          },
          "label": {
            "type": "string",
            "maxLength": 100
          }
        }
      },
      "SeverityLevel": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "code",
          "rank",
          "label"
        ],
        "properties": {
          "code": {
            "type": "string",
            "enum": [
              "CLEAN",
              "LOW",
              "MEDIUM",
              "HIGH",
              "CRITICAL"
            ]
          },
          "rank": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4
          },
          "label": {
            "type": "string",
            "maxLength": 30
          }
        }
      },
      "AnalysisSummary": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "processingStatus",
          "attemptCount",
          "failureCode",
          "enginePolicyVersion",
          "fraudScore",
          "severityCode",
          "completedAt"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "processingStatus": {
            "type": "string",
            "enum": [
              "QUEUED",
              "PROCESSING",
              "COMPLETED",
              "FAILED",
              "CANCELLED"
            ]
          },
          "attemptCount": {
            "type": "integer",
            "minimum": 0,
            "maximum": 3
          },
          "failureCode": {
            "type": "string",
            "maxLength": 100,
            "nullable": true
          },
          "enginePolicyVersion": {
            "type": "string",
            "maxLength": 100
          },
          "fraudScore": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "nullable": true
          },
          "severityCode": {
            "type": "string",
            "enum": [
              "CLEAN",
              "LOW",
              "MEDIUM",
              "HIGH",
              "CRITICAL"
            ],
            "nullable": true
          },
          "completedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          }
        }
      },
      "Document": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "tenantId",
          "documentName",
          "fileCategoryId",
          "categoryName",
          "documentNumber",
          "documentStatus",
          "activeStatus",
          "currentVersionId",
          "scanStatus",
          "currentAnalysis",
          "checkedAnalysisId",
          "checkedAt",
          "checkedBy",
          "checkedComment",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
          "versionNo"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "tenantId": {
            "type": "string",
            "format": "uuid"
          },
          "documentName": {
            "type": "string",
            "maxLength": 100
          },
          "fileCategoryId": {
            "type": "string",
            "format": "uuid"
          },
          "categoryName": {
            "type": "string",
            "maxLength": 100
          },
          "documentNumber": {
            "type": "string",
            "maxLength": 255,
            "nullable": true
          },
          "documentStatus": {
            "type": "string",
            "enum": [
              "ANALYZE",
              "OPEN",
              "CHECKED"
            ]
          },
          "activeStatus": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "NON_ACTIVE"
            ]
          },
          "currentVersionId": {
            "type": "string",
            "format": "uuid"
          },
          "scanStatus": {
            "type": "string",
            "enum": [
              "PENDING",
              "CLEAN",
              "INFECTED",
              "ERROR"
            ]
          },
          "currentAnalysis": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "id",
              "processingStatus",
              "attemptCount",
              "failureCode",
              "enginePolicyVersion",
              "fraudScore",
              "severityCode",
              "completedAt"
            ],
            "properties": {
              "id": {
                "type": "string",
                "format": "uuid"
              },
              "processingStatus": {
                "type": "string",
                "enum": [
                  "QUEUED",
                  "PROCESSING",
                  "COMPLETED",
                  "FAILED",
                  "CANCELLED"
                ]
              },
              "attemptCount": {
                "type": "integer",
                "minimum": 0,
                "maximum": 3
              },
              "failureCode": {
                "type": "string",
                "maxLength": 100,
                "nullable": true
              },
              "enginePolicyVersion": {
                "type": "string",
                "maxLength": 100
              },
              "fraudScore": {
                "type": "number",
                "minimum": 0,
                "maximum": 100,
                "nullable": true
              },
              "severityCode": {
                "type": "string",
                "enum": [
                  "CLEAN",
                  "LOW",
                  "MEDIUM",
                  "HIGH",
                  "CRITICAL"
                ],
                "nullable": true
              },
              "completedAt": {
                "type": "string",
                "format": "date-time",
                "nullable": true
              }
            },
            "nullable": true
          },
          "checkedAnalysisId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "checkedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "checkedBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "checkedComment": {
            "type": "string",
            "maxLength": 2000,
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "createdBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "updatedBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "Finding": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "anomalyId",
          "name",
          "severityCode",
          "confidence",
          "pageNumber",
          "evidenceText",
          "evidence"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "anomalyId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "name": {
            "type": "string",
            "maxLength": 255
          },
          "severityCode": {
            "type": "string",
            "enum": [
              "CLEAN",
              "LOW",
              "MEDIUM",
              "HIGH",
              "CRITICAL"
            ]
          },
          "confidence": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "nullable": true
          },
          "pageNumber": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "nullable": true
          },
          "evidenceText": {
            "type": "string",
            "maxLength": 2000,
            "nullable": true
          },
          "evidence": {
            "type": "object",
            "additionalProperties": true
          }
        }
      },
      "Similarity": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "matchedDocumentId",
          "matchedVersionId",
          "documentName",
          "matchType",
          "score",
          "severityCode",
          "rank",
          "algorithmVersion",
          "signals",
          "explanation"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "matchedDocumentId": {
            "type": "string",
            "format": "uuid"
          },
          "matchedVersionId": {
            "type": "string",
            "format": "uuid"
          },
          "documentName": {
            "type": "string",
            "maxLength": 100
          },
          "matchType": {
            "type": "string",
            "maxLength": 50
          },
          "score": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "nullable": true
          },
          "severityCode": {
            "type": "string",
            "enum": [
              "CLEAN",
              "LOW",
              "MEDIUM",
              "HIGH",
              "CRITICAL"
            ]
          },
          "rank": {
            "type": "integer",
            "minimum": 1
          },
          "algorithmVersion": {
            "type": "string",
            "maxLength": 100
          },
          "signals": {
            "type": "object",
            "additionalProperties": true
          },
          "explanation": {
            "type": "object",
            "additionalProperties": true
          }
        }
      },
      "ReviewDetail": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "document",
          "analysis",
          "findings",
          "extractedData",
          "canFinalize",
          "canDownload"
        ],
        "properties": {
          "document": {
            "$ref": "#/components/schemas/Document"
          },
          "analysis": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "id",
              "processingStatus",
              "attemptCount",
              "failureCode",
              "enginePolicyVersion",
              "fraudScore",
              "severityCode",
              "completedAt"
            ],
            "properties": {
              "id": {
                "type": "string",
                "format": "uuid"
              },
              "processingStatus": {
                "type": "string",
                "enum": [
                  "QUEUED",
                  "PROCESSING",
                  "COMPLETED",
                  "FAILED",
                  "CANCELLED"
                ]
              },
              "attemptCount": {
                "type": "integer",
                "minimum": 0,
                "maximum": 3
              },
              "failureCode": {
                "type": "string",
                "maxLength": 100,
                "nullable": true
              },
              "enginePolicyVersion": {
                "type": "string",
                "maxLength": 100
              },
              "fraudScore": {
                "type": "number",
                "minimum": 0,
                "maximum": 100,
                "nullable": true
              },
              "severityCode": {
                "type": "string",
                "enum": [
                  "CLEAN",
                  "LOW",
                  "MEDIUM",
                  "HIGH",
                  "CRITICAL"
                ],
                "nullable": true
              },
              "completedAt": {
                "type": "string",
                "format": "date-time",
                "nullable": true
              }
            },
            "nullable": true
          },
          "findings": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Finding"
            }
          },
          "extractedData": {
            "type": "object",
            "additionalProperties": true
          },
          "canFinalize": {
            "type": "boolean"
          },
          "canDownload": {
            "type": "boolean"
          }
        }
      },
      "FileAccess": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "url",
          "expiresAt",
          "documentVersionId",
          "disposition"
        ],
        "properties": {
          "url": {
            "type": "string",
            "maxLength": 4096,
            "format": "uri-reference"
          },
          "expiresAt": {
            "type": "string",
            "format": "date-time"
          },
          "documentVersionId": {
            "type": "string",
            "format": "uuid"
          },
          "disposition": {
            "type": "string",
            "enum": [
              "inline",
              "attachment"
            ]
          }
        }
      },
      "Compare": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "source",
          "candidate",
          "match",
          "sourceVersionId",
          "candidateVersionId"
        ],
        "properties": {
          "source": {
            "$ref": "#/components/schemas/Document"
          },
          "candidate": {
            "$ref": "#/components/schemas/Document"
          },
          "match": {
            "$ref": "#/components/schemas/Similarity"
          },
          "sourceVersionId": {
            "type": "string",
            "format": "uuid"
          },
          "candidateVersionId": {
            "type": "string",
            "format": "uuid"
          }
        }
      },
      "AuditLog": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "tenantId",
          "actorId",
          "actorName",
          "actorRoleName",
          "module",
          "action",
          "targetId",
          "targetName",
          "result",
          "occurredAt",
          "before",
          "after",
          "correlationId"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "tenantId": {
            "type": "string",
            "format": "uuid"
          },
          "actorId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "actorName": {
            "type": "string",
            "maxLength": 100,
            "nullable": true
          },
          "actorRoleName": {
            "type": "string",
            "maxLength": 100,
            "nullable": true
          },
          "module": {
            "type": "string",
            "maxLength": 50
          },
          "action": {
            "type": "string",
            "maxLength": 50
          },
          "targetId": {
            "type": "string",
            "maxLength": 100,
            "nullable": true
          },
          "targetName": {
            "type": "string",
            "maxLength": 255,
            "nullable": true
          },
          "result": {
            "type": "string",
            "maxLength": 20
          },
          "occurredAt": {
            "type": "string",
            "format": "date-time"
          },
          "before": {
            "type": "object",
            "additionalProperties": true,
            "nullable": true
          },
          "after": {
            "type": "object",
            "additionalProperties": true,
            "nullable": true
          },
          "correlationId": {
            "type": "string",
            "maxLength": 100
          }
        }
      },
      "Notification": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "type",
          "title",
          "message",
          "documentId",
          "createdAt",
          "readAt",
          "readStatus"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "type": {
            "type": "string",
            "maxLength": 50
          },
          "title": {
            "type": "string",
            "maxLength": 150
          },
          "message": {
            "type": "string",
            "maxLength": 500
          },
          "documentId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "readAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "readStatus": {
            "type": "string",
            "enum": [
              "READ",
              "UNREAD"
            ]
          }
        }
      },
      "Session": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "deviceName",
          "os",
          "browser",
          "ipAddress",
          "createdAt",
          "lastActivityAt",
          "expiresAt",
          "isCurrent"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "deviceName": {
            "type": "string",
            "maxLength": 100,
            "nullable": true
          },
          "os": {
            "type": "string",
            "maxLength": 100,
            "nullable": true
          },
          "browser": {
            "type": "string",
            "maxLength": 255,
            "nullable": true
          },
          "ipAddress": {
            "type": "string",
            "maxLength": 45,
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "lastActivityAt": {
            "type": "string",
            "format": "date-time"
          },
          "expiresAt": {
            "type": "string",
            "format": "date-time"
          },
          "isCurrent": {
            "type": "boolean"
          }
        }
      },
      "MyProfile": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "tenantId",
          "name",
          "email",
          "roleId",
          "status",
          "credentialDeliveryStatus",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
          "versionNo",
          "permissionCodes"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "tenantId": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "maxLength": 100
          },
          "email": {
            "type": "string",
            "maxLength": 100,
            "format": "email"
          },
          "roleId": {
            "type": "string",
            "format": "uuid"
          },
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "NON_ACTIVE"
            ]
          },
          "credentialDeliveryStatus": {
            "type": "string",
            "enum": [
              "QUEUED",
              "SENDING",
              "SENT",
              "FAILED"
            ]
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "createdBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "updatedBy": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "versionNo": {
            "type": "integer",
            "minimum": 1
          },
          "permissionCodes": {
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 100
            }
          }
        }
      },
      "Dashboard": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "total",
          "analyze",
          "open",
          "checked",
          "openPercent",
          "checkedPercent",
          "analyzedTotal",
          "severityDistribution",
          "withNumber",
          "withoutNumber",
          "unknownNumber",
          "withNumberPercent",
          "withoutNumberPercent",
          "missingNumberDocuments",
          "missingPage",
          "missingPerPage",
          "missingTotal",
          "snapshotAt"
        ],
        "properties": {
          "total": {
            "type": "integer",
            "minimum": 0
          },
          "analyze": {
            "type": "integer",
            "minimum": 0
          },
          "open": {
            "type": "integer",
            "minimum": 0
          },
          "checked": {
            "type": "integer",
            "minimum": 0
          },
          "openPercent": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          },
          "checkedPercent": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          },
          "analyzedTotal": {
            "type": "integer",
            "minimum": 0
          },
          "severityDistribution": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "CLEAN",
              "LOW",
              "MEDIUM",
              "HIGH",
              "CRITICAL"
            ],
            "properties": {
              "CLEAN": {
                "type": "integer",
                "minimum": 0
              },
              "LOW": {
                "type": "integer",
                "minimum": 0
              },
              "MEDIUM": {
                "type": "integer",
                "minimum": 0
              },
              "HIGH": {
                "type": "integer",
                "minimum": 0
              },
              "CRITICAL": {
                "type": "integer",
                "minimum": 0
              }
            }
          },
          "withNumber": {
            "type": "integer",
            "minimum": 0
          },
          "withoutNumber": {
            "type": "integer",
            "minimum": 0
          },
          "unknownNumber": {
            "type": "integer",
            "minimum": 0
          },
          "withNumberPercent": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          },
          "withoutNumberPercent": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          },
          "missingNumberDocuments": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Document"
            }
          },
          "missingPage": {
            "type": "integer",
            "minimum": 1
          },
          "missingPerPage": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100
          },
          "missingTotal": {
            "type": "integer",
            "minimum": 0
          },
          "snapshotAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "Message": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "message"
        ],
        "properties": {
          "message": {
            "type": "string",
            "maxLength": 500
          }
        }
      },
      "UnreadCount": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "unreadCount"
        ],
        "properties": {
          "unreadCount": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "MarkReadResult": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "updatedCount",
          "unreadCount",
          "documentId"
        ],
        "properties": {
          "updatedCount": {
            "type": "integer",
            "minimum": 0
          },
          "unreadCount": {
            "type": "integer",
            "minimum": 0
          },
          "documentId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          }
        }
      },
      "TokenPair": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "accessToken",
          "expiresInSeconds"
        ],
        "properties": {
          "accessToken": {
            "type": "string",
            "maxLength": 4096
          },
          "expiresInSeconds": {
            "type": "integer",
            "enum": [
              900
            ]
          }
        }
      },
      "CredentialDraftRequest": {
        "type": "object",
        "additionalProperties": false,
        "required": [],
        "properties": {
          "replaceDraftToken": {
            "type": "string",
            "maxLength": 2048,
            "writeOnly": true
          }
        }
      },
      "FilterOption": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "value",
          "label"
        ],
        "properties": {
          "value": {
            "type": "string",
            "maxLength": 255
          },
          "label": {
            "type": "string",
            "maxLength": 255
          }
        }
      },
      "authRefreshResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/TokenPair"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "authPasswordResetRequestResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Message"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listTenantsResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Tenant"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "createTenantResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Tenant"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getTenantResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Tenant"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateTenantResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Tenant"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateTenantStatusResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Tenant"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listUsersResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/User"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "createUserResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/User"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getUserResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/User"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateUserResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/User"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateUserStatusResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/User"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "resetUserCredentialResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Message"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listPermissionsResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Permission"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "listRolesResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Role"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "createRoleResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Role"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getRoleResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Role"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateRoleResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Role"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateRoleStatusResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Role"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listSeverityLevelsResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SeverityLevel"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "listAnomaliesResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Anomaly"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "createAnomalyResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Anomaly"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateAnomalyResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Anomaly"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getAnomalyResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Anomaly"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateAnomalyStatusResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Anomaly"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listFileCategoriesResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/FileCategory"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "createFileCategoryResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/FileCategory"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getFileCategoryResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/FileCategory"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateFileCategoryResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/FileCategory"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateFileCategoryStatusResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/FileCategory"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listDocumentsResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Document"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "createDocumentResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Document"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getDocumentResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Document"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateDocumentMetadataResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Document"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "uploadDocumentVersionResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Document"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "toggleDocumentActiveStatusResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Document"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "downloadDocumentResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/FileAccess"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listReviewHistoryResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Document"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "getReviewDetailResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/ReviewDetail"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listReviewSimilaritiesResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Similarity"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "compareReviewDocumentResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Compare"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "finalizeReviewResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Document"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listAuditLogsResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AuditLog"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "getAuditLogResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/AuditLog"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getDashboardResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Dashboard"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listNotificationsResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Notification"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "getUnreadNotificationCountResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/UnreadCount"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "markNotificationReadResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/MarkReadResult"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "markAllNotificationsReadResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/MarkReadResult"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getMyProfileResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/MyProfile"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "updateMyProfileResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/MyProfile"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "changeMyPasswordResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/Message"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listMySessionsResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Session"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "previewDocumentResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/FileAccess"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "getReviewFileResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/FileAccess"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      },
      "listUploadCategoriesResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/FileCategory"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "listAssignableRolesResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Role"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "listFilterOptionsResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/FilterOption"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "listPlatformAssignableRolesResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Role"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId",
              "page",
              "perPage",
              "total"
            ]
          }
        }
      },
      "createPlatformUserResponse": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "data",
          "meta"
        ],
        "properties": {
          "data": {
            "$ref": "#/components/schemas/User"
          },
          "meta": {
            "type": "object",
            "properties": {
              "correlationId": {
                "type": "string"
              },
              "page": {
                "type": "integer",
                "minimum": 1
              },
              "perPage": {
                "type": "integer",
                "minimum": 1,
                "maximum": 100
              },
              "total": {
                "type": "integer",
                "minimum": 0
              },
              "snapshotAt": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "correlationId"
            ]
          }
        }
      }
    }
  }
}
```
