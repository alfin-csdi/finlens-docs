# FinLens — Spesifikasi Teknis: Master Role (ROL)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **5 subitem**

---

## 📌 [ROL-01] Halaman List Role

### [ROL-01-FE] Halaman List Role — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-01-FE` |
| Modul | MASTER ROLE |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-01-BE` |
| Blocks | `ROL-02-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-007, FR-013, FR-022, FR-027, FR-031, FR-042 • MASTER ROLE |

#### Deskripsi
Membantu administrator melihat role dan status penggunaannya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Membantu administrator melihat role dan status penggunaannya.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rol/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Halaman List Role selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ROL-01-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/roles
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Halaman List Role | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ROL-01-BE] Halaman List Role — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-01-BE` |
| Modul | MASTER ROLE |
| Service | [listRoles](02_SPEC_API.md#listroles), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ROLE |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `LGN-03` |
| Blocks | `ROL-01-FE`, `ROL-02-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listRoles](02_SPEC_API.md#listroles), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |

#### Deskripsi
Membantu administrator melihat role dan status penggunaannya. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/roles
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

## 📌 [ROL-02] View Only Role

### [ROL-02-FE] View Only Role — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-02-FE` |
| Modul | MASTER ROLE |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-02-BE` |
| Blocks | `ROL-03-FE`, `ROL-04-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-007, FR-013, FR-014 • MASTER ROLE |

#### Deskripsi
Menjelaskan hak akses efektif sebuah role sebelum digunakan atau diubah. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menjelaskan hak akses efektif sebuah role sebelum digunakan atau diubah.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rol/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur View Only Role selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ROL-02-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form View Only Role | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ROL-02-BE] View Only Role — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-02-BE` |
| Modul | MASTER ROLE |
| Service | [listPermissions](02_SPEC_API.md#listpermissions), [getRole](02_SPEC_API.md#getrole) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ROLE |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-01` |
| Blocks | `ROL-02-FE`, `ROL-03-BE`, `ROL-04-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listPermissions](02_SPEC_API.md#listpermissions), [getRole](02_SPEC_API.md#getrole) |

#### Deskripsi
Menjelaskan hak akses efektif sebuah role sebelum digunakan atau diubah. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
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

## 📌 [ROL-03] Add Role

### [ROL-03-FE] Add Role — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-03-FE` |
| Modul | MASTER ROLE |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-03-BE` |
| Blocks | `USR-01-FE`, `ROL-05-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-007, FR-013, FR-014 • MASTER ROLE |

#### Deskripsi
Membuat role tenant dengan kombinasi hak akses yang disetujui. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Membuat role tenant dengan kombinasi hak akses yang disetujui.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rol/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Add Role selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ROL-03-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Add Role | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ROL-03-BE] Add Role — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-03-BE` |
| Modul | MASTER ROLE |
| Service | [listPermissions](02_SPEC_API.md#listpermissions), [createRole](02_SPEC_API.md#createrole) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ROLE |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-02` |
| Blocks | `ROL-03-FE`, `USR-01-BE`, `ROL-05-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listPermissions](02_SPEC_API.md#listpermissions), [createRole](02_SPEC_API.md#createrole) |

#### Deskripsi
Membuat role tenant dengan kombinasi hak akses yang disetujui. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
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

## 📌 [ROL-04] Edit Role & Hak Akses

### [ROL-04-FE] Edit Role & Hak Akses — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-04-FE` |
| Modul | MASTER ROLE |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-04-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-007, FR-013, FR-014 • MASTER ROLE |

#### Deskripsi
Memperbarui role dan hak akses tanpa perubahan parsial. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memperbarui role dan hak akses tanpa perubahan parsial.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rol/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Edit Role & Hak Akses selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ROL-04-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Edit Role & Hak Akses | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ROL-04-BE] Edit Role & Hak Akses — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-04-BE` |
| Modul | MASTER ROLE |
| Service | [listPermissions](02_SPEC_API.md#listpermissions), [updateRole](02_SPEC_API.md#updaterole) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ROLE |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-02` |
| Blocks | `ROL-04-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listPermissions](02_SPEC_API.md#listpermissions), [updateRole](02_SPEC_API.md#updaterole) |

#### Deskripsi
Memperbarui role dan hak akses tanpa perubahan parsial. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/permissions
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

## 📌 [ROL-05] Delete & Change Status Role

### [ROL-05-FE] Delete & Change Status Role — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-05-FE` |
| Modul | MASTER ROLE |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-05-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-013, FR-015 • MASTER ROLE |

#### Deskripsi
Mengelola lifecycle role tanpa memutus akses user secara tidak sengaja. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Mengelola lifecycle role tanpa memutus akses user secara tidak sengaja.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rol/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Delete & Change Status Role selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `ROL-05-BE`.
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
| 1 | Buka tampilan / form Delete & Change Status Role | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [ROL-05-BE] Delete & Change Status Role — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `ROL-05-BE` |
| Modul | MASTER ROLE |
| Service | [updateRoleStatus](02_SPEC_API.md#updaterolestatus), [deleteRole](02_SPEC_API.md#deleterole) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER ROLE |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-03` |
| Blocks | `ROL-05-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_role, ref_permission, mst_role_permission; tabel pendukung pada ERD final |
| FSD / Spec Ref | [updateRoleStatus](02_SPEC_API.md#updaterolestatus), [deleteRole](02_SPEC_API.md#deleterole) |

#### Deskripsi
Mengelola lifecycle role tanpa memutus akses user secara tidak sengaja. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

