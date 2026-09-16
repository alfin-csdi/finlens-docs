# FinLens — Spesifikasi Teknis: Master Anomali (ANO)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **5 subitem**

---

## 📌 [ANO-01] Halaman List Anomali

### [ANO-01-FE] Halaman List Anomali — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-01-FE` |
| Modul | MASTER ANOMALI |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-01-BE` |
| Blocks | `ANO-02-FE`, `ANO-03-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-007, FR-016, FR-017, FR-022, FR-027, FR-031, FR-042 • MASTER ANOMALI |

#### Deskripsi
Menampilkan aturan anomali dan tingkat risiko yang digunakan pemeriksaan dokumen. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menampilkan aturan anomali dan tingkat risiko yang digunakan pemeriksaan dokumen.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/ano/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Halaman List Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ANO-01-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/severity-levels
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Halaman List Anomali | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ANO-01-BE] Halaman List Anomali — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-01-BE` |
| Modul | MASTER ANOMALI |
| Service | [listSeverityLevels](02_SPEC_API.md#listseveritylevels), [listAnomalies](02_SPEC_API.md#listanomalies), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ANOMALI |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `LGN-03` |
| Blocks | `ANO-01-FE`, `ANO-02-BE`, `ANO-03-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listSeverityLevels](02_SPEC_API.md#listseveritylevels), [listAnomalies](02_SPEC_API.md#listanomalies), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |

#### Deskripsi
Menampilkan aturan anomali dan tingkat risiko yang digunakan pemeriksaan dokumen. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/severity-levels
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

## 📌 [ANO-02] View Only Anomali

### [ANO-02-FE] View Only Anomali — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-02-FE` |
| Modul | MASTER ANOMALI |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-02-BE` |
| Blocks | `ANO-04-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-016 • MASTER ANOMALI |

#### Deskripsi
Menjelaskan definisi anomali dan severity sebelum diubah. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menjelaskan definisi anomali dan severity sebelum diubah.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/ano/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur View Only Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ANO-02-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/anomalies/{id}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form View Only Anomali | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ANO-02-BE] View Only Anomali — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-02-BE` |
| Modul | MASTER ANOMALI |
| Service | [getAnomaly](02_SPEC_API.md#getanomaly) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ANOMALI |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-01` |
| Blocks | `ANO-02-FE`, `ANO-04-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| FSD / Spec Ref | [getAnomaly](02_SPEC_API.md#getanomaly) |

#### Deskripsi
Menjelaskan definisi anomali dan severity sebelum diubah. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getAnomaly**
1. Periksa anomaly.view; cari ID pada tenant sendiri dan belum deleted.
2. Return anomaly detail dan metadata lengkap; 404 bila tidak ada, tanpa mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/anomalies/{id}
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

## 📌 [ANO-03] Add Anomali

### [ANO-03-FE] Add Anomali — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-03-FE` |
| Modul | MASTER ANOMALI |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-03-BE` |
| Blocks | `ANO-05-FE`, `SUB-03-FE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Sedang |
| FSD Ref | FR-016, FR-017 • MASTER ANOMALI |

#### Deskripsi
Menambahkan aturan anomali yang akan berlaku untuk analisis baru. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menambahkan aturan anomali yang akan berlaku untuk analisis baru.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/ano/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Add Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ANO-03-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/severity-levels
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Add Anomali | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ANO-03-BE] Add Anomali — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-03-BE` |
| Modul | MASTER ANOMALI |
| Service | [listSeverityLevels](02_SPEC_API.md#listseveritylevels), [createAnomaly](02_SPEC_API.md#createanomaly) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ANOMALI |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-01` |
| Blocks | `ANO-03-FE`, `ANO-05-BE`, `SUB-03-BE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Sedang |
| Target Database | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listSeverityLevels](02_SPEC_API.md#listseveritylevels), [createAnomaly](02_SPEC_API.md#createanomaly) |

#### Deskripsi
Menambahkan aturan anomali yang akan berlaku untuk analisis baru. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/severity-levels
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

## 📌 [ANO-04] Edit Anomali

### [ANO-04-FE] Edit Anomali — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-04-FE` |
| Modul | MASTER ANOMALI |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-04-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-016, FR-017 • MASTER ANOMALI |

#### Deskripsi
Memperbarui definisi/severity anomali untuk pemeriksaan berikutnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memperbarui definisi/severity anomali untuk pemeriksaan berikutnya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/ano/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Edit Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ANO-04-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1,
  "severityCode": "CLEAN"
}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Edit Anomali | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ANO-04-BE] Edit Anomali — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-04-BE` |
| Modul | MASTER ANOMALI |
| Service | [updateAnomaly](02_SPEC_API.md#updateanomaly) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ANOMALI |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-02` |
| Blocks | `ANO-04-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| FSD / Spec Ref | [updateAnomaly](02_SPEC_API.md#updateanomaly) |

#### Deskripsi
Memperbarui definisi/severity anomali untuk pemeriksaan berikutnya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "versionNo": 1,
  "severityCode": "CLEAN"
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

## 📌 [ANO-05] Delete & Change Status Anomali

### [ANO-05-FE] Delete & Change Status Anomali — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-05-FE` |
| Modul | MASTER ANOMALI |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-05-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-016, FR-017, FR-018 • MASTER ANOMALI |

#### Deskripsi
Menghentikan pemakaian anomaly atau menghapus record yang aman dilepas. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menghentikan pemakaian anomaly atau menghapus record yang aman dilepas.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/ano/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Delete & Change Status Anomali selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ANO-05-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "status": "ACTIVE",
  "versionNo": 1
}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Delete & Change Status Anomali | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ANO-05-BE] Delete & Change Status Anomali — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ANO-05-BE` |
| Modul | MASTER ANOMALI |
| Service | [updateAnomalyStatus](02_SPEC_API.md#updateanomalystatus), [deleteAnomaly](02_SPEC_API.md#deleteanomaly) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ANOMALI |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `ANO-03` |
| Blocks | `ANO-05-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | ref_severity_level, mst_anomaly, trn_ai_finding; tabel pendukung pada ERD final |
| FSD / Spec Ref | [updateAnomalyStatus](02_SPEC_API.md#updateanomalystatus), [deleteAnomaly](02_SPEC_API.md#deleteanomaly) |

#### Deskripsi
Menghentikan pemakaian anomaly atau menghapus record yang aman dilepas. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "status": "ACTIVE",
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

