# FinLens — Spesifikasi Teknis: Bucket Document (BUC)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **4 subitem**

---

## 📌 [BUC-01] Halaman List Bucket Document

### [BUC-01-FE] Halaman List Bucket Document — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `BUC-01-FE` |
| Modul | BUCKET DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `BUC-01-BE` |
| Blocks | `BUC-02-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-007, FR-022, FR-027, FR-031, FR-042 • BUCKET DOCUMENT |

#### Deskripsi
Menampilkan seluruh dokumen tenant beserta status bisnis dan analisisnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menampilkan seluruh dokumen tenant beserta status bisnis dan analisisnya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/buc/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Halaman List Bucket Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `BUC-01-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Halaman List Bucket Document | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [BUC-01-BE] Halaman List Bucket Document — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `BUC-01-BE` |
| Modul | BUCKET DOCUMENT |
| Service | [listDocuments](02_SPEC_API.md#listdocuments), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| Status | OPEN |
| Permission | Mengikuti hak akses BUCKET DOCUMENT |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-02` |
| Blocks | `BUC-01-FE`, `BUC-02-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_document, trn_document_version, trn_ai_analysis; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listDocuments](02_SPEC_API.md#listdocuments), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |

#### Deskripsi
Menampilkan seluruh dokumen tenant beserta status bisnis dan analisisnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents
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

## 📌 [BUC-02] View Only Document

### [BUC-02-FE] View Only Document — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `BUC-02-FE` |
| Modul | BUCKET DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `BUC-02-BE` |
| Blocks | `BUC-03-FE`, `BUC-04-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-022, FR-025, FR-027, FR-028, FR-044 • BUCKET DOCUMENT |

#### Deskripsi
Menampilkan metadata dan file dokumen tanpa mengubahnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menampilkan metadata dan file dokumen tanpa mengubahnya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/buc/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur View Only Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `BUC-02-BE`.
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
| 1 | Buka tampilan / form View Only Document | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [BUC-02-BE] View Only Document — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `BUC-02-BE` |
| Modul | BUCKET DOCUMENT |
| Service | [getDocument](02_SPEC_API.md#getdocument), [downloadDocument](02_SPEC_API.md#downloaddocument), [previewDocument](02_SPEC_API.md#previewdocument), [streamPrivateFile](02_SPEC_API.md#streamprivatefile) |
| Status | OPEN |
| Permission | Mengikuti hak akses BUCKET DOCUMENT |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `BUC-01` |
| Blocks | `BUC-02-FE`, `BUC-03-BE`, `BUC-04-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_document, trn_document_version, trn_ai_analysis; tabel pendukung pada ERD final |
| FSD / Spec Ref | [getDocument](02_SPEC_API.md#getdocument), [downloadDocument](02_SPEC_API.md#downloaddocument), [previewDocument](02_SPEC_API.md#previewdocument), [streamPrivateFile](02_SPEC_API.md#streamprivatefile) |

#### Deskripsi
Menampilkan metadata dan file dokumen tanpa mengubahnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

## 📌 [BUC-03] Edit Metadata & Replace Document

### [BUC-03-FE] Edit Metadata & Replace Document — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `BUC-03-FE` |
| Modul | BUCKET DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `BUC-03-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-023, FR-024, FR-025, FR-026 • BUCKET DOCUMENT |

#### Deskripsi
Memperbaiki metadata atau mengganti PDF dokumen yang masih OPEN. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memperbaiki metadata atau mengganti PDF dokumen yang masih OPEN.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/buc/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Edit Metadata & Replace Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `BUC-03-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "documentName": "Contoh FinLens",
  "versionNo": 1
}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Edit Metadata & Replace Document | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [BUC-03-BE] Edit Metadata & Replace Document — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `BUC-03-BE` |
| Modul | BUCKET DOCUMENT |
| Service | [updateDocumentMetadata](02_SPEC_API.md#updatedocumentmetadata), [uploadDocumentVersion](02_SPEC_API.md#uploaddocumentversion) |
| Status | OPEN |
| Permission | Mengikuti hak akses BUCKET DOCUMENT |
| Story Point | 2 SP |
| Durasi | 8 jam (1 SP = 4 jam bersih) |
| Depends On | `BUC-02`, `SUB-03` |
| Blocks | `BUC-03-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_document, trn_document_version, trn_ai_analysis; tabel pendukung pada ERD final |
| FSD / Spec Ref | [updateDocumentMetadata](02_SPEC_API.md#updatedocumentmetadata), [uploadDocumentVersion](02_SPEC_API.md#uploaddocumentversion) |

#### Deskripsi
Memperbaiki metadata atau mengganti PDF dokumen yang masih OPEN. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "documentName": "Contoh FinLens",
  "versionNo": 1
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

## 📌 [BUC-04] Download, Delete & Change Status Document

### [BUC-04-FE] Download, Delete & Change Status Document — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `BUC-04-FE` |
| Modul | BUCKET DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `BUC-04-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-025, FR-026, FR-044 • BUCKET DOCUMENT |

#### Deskripsi
Menjalankan aksi file/lifecycle sesuai status dan kewenangan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menjalankan aksi file/lifecycle sesuai status dan kewenangan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/buc/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Download, Delete & Change Status Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `BUC-04-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents/{id}/download
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Download, Delete & Change Status Document | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [BUC-04-BE] Download, Delete & Change Status Document — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `BUC-04-BE` |
| Modul | BUCKET DOCUMENT |
| Service | [downloadDocument](02_SPEC_API.md#downloaddocument), [toggleDocumentActiveStatus](02_SPEC_API.md#toggledocumentactivestatus), [deleteDocument](02_SPEC_API.md#deletedocument) |
| Status | OPEN |
| Permission | Mengikuti hak akses BUCKET DOCUMENT |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `BUC-02` |
| Blocks | `BUC-04-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_document, trn_document_version, trn_ai_analysis; tabel pendukung pada ERD final |
| FSD / Spec Ref | [downloadDocument](02_SPEC_API.md#downloaddocument), [toggleDocumentActiveStatus](02_SPEC_API.md#toggledocumentactivestatus), [deleteDocument](02_SPEC_API.md#deletedocument) |

#### Deskripsi
Menjalankan aksi file/lifecycle sesuai status dan kewenangan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/documents/{id}/download
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

