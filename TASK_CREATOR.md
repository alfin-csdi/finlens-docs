# FinLens — Task Creator & Specification Standard

Dokumen ini adalah acuan baku (standard operating procedure / master boilerplate) untuk mem-breakdown setiap kebutuhan fitur atau subitem proyek FinLens menjadi tiket spesifikasi teknis siap eksekusi di Monday.com, Jira, maupun repository monorepo.

---

## 1. Aturan Penamaan & Konvensi Tiket

Setiap subitem di-breakdown menjadi 2 tiket terpisah yang saling berpasangan:
1. **Frontend Ticket:** `[KODE-XX-FE] Nama Subitem — Frontend`
2. **Backend Ticket:** `[KODE-XX-BE] Nama Subitem — Backend`

Contoh:
- `[LGN-01-FE] Menu Login — Frontend`
- `[LGN-01-BE] Menu Login — Backend`
- `[TEN-03-FE] Add Tenant — Frontend`
- `[TEN-03-BE] Add Tenant — Backend`

### Standar Story Point (SP) & Durasi
- **0.5 SP:** 2 – 3 jam kerja bersih (tugas sederhana, table view read-only, toggle status tunggal).
- **1 SP:** 4 – 6 jam kerja bersih / baseline 4 jam (form CRUD standar, validasi inline, modal dialog).
- **2 SP:** 8 – 12 jam kerja bersih (form kompleks, multiple flow state, otentikasi login, comparison view).
- **3 SP:** 12 – 16 jam kerja bersih (integrasi provider eksternal, worker pipeline dasar, setup MFA).
- **5 SP:** 20 – 25 jam kerja bersih (alur kritis arsitektural, multi-scenario session engine, AI analysis worker).

---

## 2. Boilerplate Acuan Frontend (`*-FE`)

### [KODE-XX-FE] Nama Fitur / Subitem — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | [KODE-XX-FE] |
| Modul | [Nama Modul FSD, misal: Master Tenant / Login / Submit Document] |
| Service | FE — FinLens Web App |
| Method | [Page View / Form Modal / Table View / Dialog / Widget] |
| Status | [New / Update] |
| Story Point | [0.5 SP / 1 SP / 2 SP] |
| Durasi | [X jam] (1 SP = 4 jam bersih) |
| Depends On | [KODE-XX-BE] (Endpoint Backend yang wajib siap lebih dulu) |
| Blocks | [Task FE lain yang terblokir, atau "—"] |
| Critical Path | [Yes / No] |
| Risk Level | [Low / Medium / High] |
| FSD Ref | Bab [X.X] — [Judul Bab FSD] |

#### Deskripsi
[Penjelasan konteks tampilan visual, form input, interaksi tombol, dan alur pengalaman pengguna sesuai FSD]

#### Goals
* [Goal 1: Kesiapan komponen antarmuka pengguna]
* [Goal 2: Validasi input sisi browser dan indikator visual]
* [Goal 3: Umpan balik visual respon sukses/gagal (Toast / Banner Alert)]

#### Scope File
* `apps/web/src/features/[modul]/pages/[NamaPage].tsx`
* `apps/web/src/features/[modul]/components/[NamaKomponen].tsx`
* `apps/web/src/features/[modul]/hooks/[useNamaHook].ts`
* `apps/web/src/features/[modul]/services/[namaService].ts`

#### Out of Scope
* [Hal-hal yang tidak dikerjakan pada tiket FE ini]

#### Acceptance Criteria
1. [Kriteria 1: Kondisi awal form/halaman saat dibuka]
2. [Kriteria 2: Skenario validasi inline field mandatory atau format khusus]
3. [Kriteria 3: Kondisi tombol saat proses submit berlangsung (spinner/disabled)]
4. [Kriteria 4: Penanganan respon sukses dan penutupan modal / trigger refresh tabel]
5. [Kriteria 5: Penanganan respon error (400/401/409/422)]

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Validasi format regex dan panjang karakter sebelum memanggil API.
   * State management untuk error inline pada masing-masing field.
2. **Submit & Payload Dispatch:**
   * Penguncian tombol aksi (`isSubmitting = true`).
   * Penyusunan payload JSON yang dikirimkan ke endpoint Backend.
3. **Handling Response & UI Feedback:**
   * Skenario Sukses: Tampilkan alert sukses, reset/tutup modal, refresh tabel (invalidation query).
   * Skenario Gagal: Tampilkan pesan error inline di kolom terkait atau banner alert error.

#### Request & Response (Kontrak FE)
* **Request Payload ke BE:**
  `{ "field_1": "string", "field_2": 123 }`
* **Respon Sukses dari BE:**
  `{ "data": { ... }, "meta": { "correlationId": "uuid" } }`

#### Notes
* [Catatan sanitasi input teks (auto-trim), debounce search, UX edge case, dll.]

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan halaman / form | Kondisi default bersih, tombol aksi sesuai state awal |
| 2 | Submit field kosong / format salah | Muncul pesan error inline merah pada kolom terkait |
| 3 | Submit data valid | Tombol loading spinner, data terkirim ke backend |
| 4 | Respon backend gagal (4xx) | Pesan error backend tampil jelas di antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil feedback sukses, form tertutup / data terefresh |

---

## 3. Boilerplate Acuan Backend (`*-BE`)

### [KODE-XX-BE] Nama Fitur / Subitem — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | [KODE-XX-BE] |
| Modul | [Nama Modul, misal: Master Tenant / Authentication] |
| Service | [POST / GET / PUT / PATCH / DELETE] /api/v1/[endpoint] |
| Status | [New / Update] |
| Permission | [Permission Code, misal: tenant.view / public / authenticated] |
| Story Point | [0.5 SP / 1 SP / 2 SP / dst.] |
| Durasi | [X jam] (1 SP = 4 jam bersih) |
| Depends On | [Migrasi Database / FND-XX / Middleware Auth] |
| Blocks | [KODE-XX-FE] |
| Critical Path | [Yes / No] |
| Risk Level | [Low / Medium / High] |
| Target Database | [Tabel utama: `mst_...` / `trn_...`] |
| FSD / Spec Ref | Bab [X.X] FSD & Spec API #[endpoint] |

#### Deskripsi
[Penjelasan fungsional endpoint, efek mutasi terhadap database, invariant bisnis, dan isolasi tenant]

#### Flow Logic (Step by Step)
1. **Autentikasi & Autorisasi:**
   * Validasi token JWT / context token.
   * Pengecekan hak akses permission role terhadap endpoint.
2. **Validasi Request & Sanitasi Data:**
   * Sanitasi data (trim teks, lowercase email).
   * Validasi tipe data, batas karakter, enum, dan mandatory field.
3. **Pengecekan Keunikan & State Guard:**
   * Query cek duplikasi (case-insensitive).
   * Pengecekan status aktif/non-aktif entitas terkait.
4. **Eksekusi Transaksi Database:**
   * Query insert/update/delete atomik.
   * Auto-inject metadata: `created_by`, `updated_by`, `created_date`, `tenant_id`.
5. **Pencatatan Audit Trail:**
   * Rekam aksi perubahan data ke tabel `trn_audit_log`.
6. **Return Response:**
   * Kembalikan JSON baku `{ data, meta }` atau `{ error }`.

#### Parameter Input
* **Header:** `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Query Params (bila GET):** `page`, `perPage`, `search`, `status`
* **Request Body (bila POST/PUT/PATCH):**
  `{ "field_1": "value", "field_2": "value" }`

#### Response Schema
* **200 OK / 201 Created:**
  `{ "data": { ... }, "meta": { "correlationId": "uuid" } }`
* **400 / 422 Validation Error:**
  `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`
* **409 Conflict:**
  `{ "error": { "code": "DATA_ALREADY_EXISTS", "message": "..." } }`

#### Notes
* [Catatan multi-tenant isolation, database constraint, transaksi lock, dll.]

#### QC Checklist (BE / API Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Hit tanpa header Authorization / Token Expired | 401 Unauthorized |
| 2 | Hit dengan role yang tidak memiliki izin | 403 Forbidden |
| 3 | Hit dengan data body kosong / format tidak valid | 400 / 422 Unprocessable Entity + detail error |
| 4 | Hit dengan nilai yang sudah ada di database | 409 Conflict + pesan error sesuai FSD |
| 5 | Hit data valid | 200/201 OK, data tersimpan di DB, audit log terekam |
