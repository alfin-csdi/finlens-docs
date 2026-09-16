# FinLens — Spesifikasi Teknis: Submit Document (SUB)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **3 subitem**

---

## 📌 [SUB-01] Form Submit Document

### [SUB-01-FE] Form Submit Document — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `SUB-01-FE` |
| Modul | SUBMIT DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-01-BE` |
| Blocks | `SUB-02-FE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| FSD Ref | FR-020, FR-023 • SUBMIT DOCUMENT |

#### Deskripsi
Memudahkan submitter memilih file dan informasi dokumen sebelum dikirim. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memudahkan submitter memilih file dan informasi dokumen sebelum dikirim.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/sub/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Form Submit Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `SUB-01-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/document-options/categories
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Form Submit Document | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [SUB-01-BE] Form Submit Document — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `SUB-01-BE` |
| Modul | SUBMIT DOCUMENT |
| Service | [listUploadCategories](02_SPEC_API.md#listuploadcategories) |
| Status | OPEN |
| Permission | Mengikuti hak akses SUBMIT DOCUMENT |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `KAT-03` |
| Blocks | `SUB-01-FE`, `SUB-02-BE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| Target Database | trn_document, trn_document_version, trn_ai_analysis, trn_outbox_event; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listUploadCategories](02_SPEC_API.md#listuploadcategories) |

#### Deskripsi
Memudahkan submitter memilih file dan informasi dokumen sebelum dikirim. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listUploadCategories**
1. Authorize document.add OR document.edit; jangan mensyaratkan file_category.view.
2. Return kategori aktif tenant sendiri yang tidak deleted, pagination 20/100. Tidak memberi akses mengubah master.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/document-options/categories
```

#### Notes
* Pastikan isolasi multi-tenant terjaga (inject tenant_id server-side).
* Rekam aktivitas ke `trn_audit_log` secara atomik.

#### QC Checklist (BE / API Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Hit tanpa header Authorization | 401 Unauthorized |
| 2 | Hit dengan role tanpa permission | 403 Forbidden |
| 3 | Hit dengan payload tidak valid | 400 / 422 Unprocessable Entity + detail error |
| 4 | Hit data duplikat / konflik | 409 Conflict |
| 5 | Hit data valid | 200 / 201 OK, data tersimpan di DB, audit log terekam |


---

## 📌 [SUB-02] Upload & Validasi Dokumen

### [SUB-02-FE] Upload & Validasi Dokumen — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `SUB-02-FE` |
| Modul | SUBMIT DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 2 SP |
| Durasi | 8 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-02-BE` |
| Blocks | `SUB-03-FE`, `BUC-01-FE`, `NOT-01-FE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| FSD Ref | FR-023, FR-024 • SUBMIT DOCUMENT |

#### Deskripsi
Mengirim dokumen sekali dengan progres dan hasil validasi yang jelas. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Mengirim dokumen sekali dengan progres dan hasil validasi yang jelas.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/sub/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Upload & Validasi Dokumen selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `SUB-02-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "file": "<binary PDF>",
  "fileCategoryId": "00000000-0000-4000-8000-000000000001",
  "documentName": "Contoh FinLens"
}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Upload & Validasi Dokumen | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [SUB-02-BE] Upload & Validasi Dokumen — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `SUB-02-BE` |
| Modul | SUBMIT DOCUMENT |
| Service | [createDocument](02_SPEC_API.md#createdocument) |
| Status | OPEN |
| Permission | Mengikuti hak akses SUBMIT DOCUMENT |
| Story Point | 3 SP |
| Durasi | 12 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-01`, `FND-04` |
| Blocks | `SUB-02-FE`, `SUB-03-BE`, `BUC-01-BE`, `NOT-01-BE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| Target Database | trn_document, trn_document_version, trn_ai_analysis, trn_outbox_event; tabel pendukung pada ERD final |
| FSD / Spec Ref | [createDocument](02_SPEC_API.md#createdocument) |

#### Deskripsi
Mengirim dokumen sekali dengan progres dan hasil validasi yang jelas. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "file": "<binary PDF>",
  "fileCategoryId": "00000000-0000-4000-8000-000000000001",
  "documentName": "Contoh FinLens"
}
```

#### Notes
* Pastikan isolasi multi-tenant terjaga (inject tenant_id server-side).
* Rekam aktivitas ke `trn_audit_log` secara atomik.

#### QC Checklist (BE / API Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Hit tanpa header Authorization | 401 Unauthorized |
| 2 | Hit dengan role tanpa permission | 403 Forbidden |
| 3 | Hit dengan payload tidak valid | 400 / 422 Unprocessable Entity + detail error |
| 4 | Hit data duplikat / konflik | 409 Conflict |
| 5 | Hit data valid | 200 / 201 OK, data tersimpan di DB, audit log terekam |


---

## 📌 [SUB-03] Status Pengiriman & Proses Analisis

### [SUB-03-FE] Status Pengiriman & Proses Analisis — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `SUB-03-FE` |
| Modul | SUBMIT DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-03-BE` |
| Blocks | `BUC-03-FE`, `REV-01-FE`, `DSH-01-FE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| FSD Ref | FR-006, FR-022, FR-025 • SUBMIT DOCUMENT |

#### Deskripsi
Memberi kepastian bahwa dokumen sedang dianalisis atau mengalami kegagalan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memberi kepastian bahwa dokumen sedang dianalisis atau mengalami kegagalan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/sub/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Status Pengiriman & Proses Analisis selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `SUB-03-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents/{id}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Status Pengiriman & Proses Analisis | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [SUB-03-BE] Status Pengiriman & Proses Analisis — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `SUB-03-BE` |
| Modul | SUBMIT DOCUMENT |
| Service | [getDocument](02_SPEC_API.md#getdocument) |
| Status | OPEN |
| Permission | Mengikuti hak akses SUBMIT DOCUMENT |
| Story Point | 8 SP |
| Durasi | 32 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-02`, `ANO-03` |
| Blocks | `SUB-03-FE`, `BUC-03-BE`, `REV-01-BE`, `DSH-01-BE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| Target Database | trn_document, trn_document_version, trn_ai_analysis, trn_outbox_event; tabel pendukung pada ERD final |
| FSD / Spec Ref | [getDocument](02_SPEC_API.md#getdocument) |

#### Deskripsi
Memberi kepastian bahwa dokumen sedang dianalisis atau mengalami kegagalan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getDocument**
1. Authorize document.view, tenant dari session.
2. Query dokumen non-deleted; Bucket dapat melihat active/non-active dan semua business state. Resolve ID scope tenant atau 404.
3. Return Document DTO termasuk scanStatus dan currentAnalysis.processingStatus; no signed URL/bytes/raw engine result. Polling tidak menulis mutation audit atau memperpanjang idle.

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents/{id}
```

#### Notes
* Pastikan isolasi multi-tenant terjaga (inject tenant_id server-side).
* Rekam aktivitas ke `trn_audit_log` secara atomik.

#### QC Checklist (BE / API Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Hit tanpa header Authorization | 401 Unauthorized |
| 2 | Hit dengan role tanpa permission | 403 Forbidden |
| 3 | Hit dengan payload tidak valid | 400 / 422 Unprocessable Entity + detail error |
| 4 | Hit data duplikat / konflik | 409 Conflict |
| 5 | Hit data valid | 200 / 201 OK, data tersimpan di DB, audit log terekam |


---

