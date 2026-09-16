# FinLens — Spesifikasi Teknis: Dashboard (DSH)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **3 subitem**

---

## 📌 [DSH-01] Ringkasan Dashboard

### [DSH-01-FE] Ringkasan Dashboard — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `DSH-01-FE` |
| Modul | DASHBOARD |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `DSH-01-BE` |
| Blocks | `DSH-02-FE`, `DSH-03-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-032, FR-033, FR-034, FR-035 • DASHBOARD |

#### Deskripsi
Memberikan gambaran cepat jumlah dokumen dan status proses. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memberikan gambaran cepat jumlah dokumen dan status proses.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/dsh/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Ringkasan Dashboard selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `DSH-01-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Ringkasan Dashboard | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [DSH-01-BE] Ringkasan Dashboard — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `DSH-01-BE` |
| Modul | DASHBOARD |
| Service | [getDashboard](02_SPEC_API.md#getdashboard) |
| Status | OPEN |
| Permission | Mengikuti hak akses DASHBOARD |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-03` |
| Blocks | `DSH-01-FE`, `DSH-02-BE`, `DSH-03-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_document, trn_ai_analysis, trn_ai_finding; tabel pendukung pada ERD final |
| FSD / Spec Ref | [getDashboard](02_SPEC_API.md#getdashboard) |

#### Deskripsi
Memberikan gambaran cepat jumlah dokumen dan status proses. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
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

## 📌 [DSH-02] Grafik Risiko & Kelengkapan Dokumen

### [DSH-02-FE] Grafik Risiko & Kelengkapan Dokumen — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `DSH-02-FE` |
| Modul | DASHBOARD |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `DSH-02-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-032, FR-033, FR-034, FR-035 • DASHBOARD |

#### Deskripsi
Menunjukkan distribusi severity dan dokumen yang belum memiliki nomor. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menunjukkan distribusi severity dan dokumen yang belum memiliki nomor.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/dsh/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Grafik Risiko & Kelengkapan Dokumen selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `DSH-02-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Grafik Risiko & Kelengkapan Dokumen | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [DSH-02-BE] Grafik Risiko & Kelengkapan Dokumen — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `DSH-02-BE` |
| Modul | DASHBOARD |
| Service | [getDashboard](02_SPEC_API.md#getdashboard) |
| Status | OPEN |
| Permission | Mengikuti hak akses DASHBOARD |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `DSH-01` |
| Blocks | `DSH-02-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_document, trn_ai_analysis, trn_ai_finding; tabel pendukung pada ERD final |
| FSD / Spec Ref | [getDashboard](02_SPEC_API.md#getdashboard) |

#### Deskripsi
Menunjukkan distribusi severity dan dokumen yang belum memiliki nomor. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
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

## 📌 [DSH-03] Filter Periode, Drill-down & Refresh

### [DSH-03-FE] Filter Periode, Drill-down & Refresh — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `DSH-03-FE` |
| Modul | DASHBOARD |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `DSH-03-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-032, FR-033, FR-034, FR-035 • DASHBOARD |

#### Deskripsi
Memungkinkan pengguna melihat periode tertentu dan menelusuri sumber angka. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memungkinkan pengguna melihat periode tertentu dan menelusuri sumber angka.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/dsh/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Filter Periode, Drill-down & Refresh selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `DSH-03-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Filter Periode, Drill-down & Refresh | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [DSH-03-BE] Filter Periode, Drill-down & Refresh — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `DSH-03-BE` |
| Modul | DASHBOARD |
| Service | [getDashboard](02_SPEC_API.md#getdashboard) |
| Status | OPEN |
| Permission | Mengikuti hak akses DASHBOARD |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `DSH-01`, `REV-02` |
| Blocks | `DSH-03-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_document, trn_ai_analysis, trn_ai_finding; tabel pendukung pada ERD final |
| FSD / Spec Ref | [getDashboard](02_SPEC_API.md#getdashboard) |

#### Deskripsi
Memungkinkan pengguna melihat periode tertentu dan menelusuri sumber angka. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/dashboard
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

