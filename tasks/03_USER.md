# FinLens — Spesifikasi Teknis: Master User (USR)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **5 subitem**

---

## 📌 [USR-01] Halaman List User

### [USR-01-FE] Halaman List User — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-01-FE` |
| Modul | MASTER USER |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-01-BE` |
| Blocks | `USR-02-FE`, `USR-03-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-010, FR-042 • MASTER USER |

#### Deskripsi
Memudahkan administrator tenant menemukan dan memantau user. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memudahkan administrator tenant menemukan dan memantau user.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/usr/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Halaman List User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `USR-01-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/users
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Halaman List User | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [USR-01-BE] Halaman List User — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-01-BE` |
| Modul | MASTER USER |
| Service | [listUsers](02_SPEC_API.md#listusers) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER USER |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `ROL-03` |
| Blocks | `USR-01-FE`, `USR-02-BE`, `USR-03-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listUsers](02_SPEC_API.md#listusers) |

#### Deskripsi
Memudahkan administrator tenant menemukan dan memantau user. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**listUsers**
1. Verifikasi user.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_user dalam scope tervalidasi, exclude deleted. Terapkan parameter search/filter/sort allow-list dan pagination, count dengan predicate sama.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/users
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

## 📌 [USR-02] View Only User

### [USR-02-FE] View Only User — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-02-FE` |
| Modul | MASTER USER |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-02-BE` |
| Blocks | `USR-04-FE`, `USR-05-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-010 • MASTER USER |

#### Deskripsi
Menampilkan profil, role, dan status user secara aman. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menampilkan profil, role, dan status user secara aman.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/usr/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur View Only User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `USR-02-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/users/{id}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form View Only User | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [USR-02-BE] View Only User — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-02-BE` |
| Modul | MASTER USER |
| Service | [getUser](02_SPEC_API.md#getuser) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER USER |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-01` |
| Blocks | `USR-02-FE`, `USR-04-BE`, `USR-05-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| FSD / Spec Ref | [getUser](02_SPEC_API.md#getuser) |

#### Deskripsi
Menampilkan profil, role, dan status user secara aman. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
1. FE memuat session/permission dan data dependency, menampilkan state awal sesuai alur kartu.
2. FE memvalidasi field dengan schema final, menonaktifkan submit selama request dan menyertakan versionNo/idempotency bila diwajibkan.
3. BE melaksanakan alur spesifik berikut (bukan hanya generic CRUD):

**getUser**
1. Verifikasi user.view dan scope tenant; tidak mengandalkan nama persona.
2. Query mst_user dalam scope tervalidasi, exclude deleted. ID tidak ditemukan/foreign → 404.
3. Return DTO resource dan metadata; read-only tidak mengubah version/timestamps atau mencatat mutation audit.

4. FE memetakan hasil/error tanpa kehilangan input atau filter yang relevan; refetch yang terdampak setelah sukses.
5. Jalankan QC khusus di bawah dan Definition of Done; lampirkan bukti sebelum READY FOR QA.

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/users/{id}
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

## 📌 [USR-03] Add User

### [USR-03-FE] Add User — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-03-FE` |
| Modul | MASTER USER |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 2 SP |
| Durasi | 8 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-03-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-008, FR-010, FR-011, FR-013 • MASTER USER |

#### Deskripsi
Menambahkan user tenant dan memilih role yang diizinkan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menambahkan user tenant dan memilih role yang diizinkan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/usr/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Add User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `USR-03-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
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

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Add User | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [USR-03-BE] Add User — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-03-BE` |
| Modul | MASTER USER |
| Service | [createUser](02_SPEC_API.md#createuser), [createCredentialDraft](02_SPEC_API.md#createcredentialdraft), [listAssignableRoles](02_SPEC_API.md#listassignableroles), [listPlatformAssignableRoles](02_SPEC_API.md#listplatformassignableroles), [createPlatformCredentialDraft](02_SPEC_API.md#createplatformcredentialdraft), [createPlatformUser](02_SPEC_API.md#createplatformuser) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER USER |
| Story Point | 3 SP |
| Durasi | 12 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-01`, `LGN-02`, `TEN-03` |
| Blocks | `USR-03-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| FSD / Spec Ref | [createUser](02_SPEC_API.md#createuser), [createCredentialDraft](02_SPEC_API.md#createcredentialdraft), [listAssignableRoles](02_SPEC_API.md#listassignableroles), [listPlatformAssignableRoles](02_SPEC_API.md#listplatformassignableroles), [createPlatformCredentialDraft](02_SPEC_API.md#createplatformcredentialdraft), [createPlatformUser](02_SPEC_API.md#createplatformuser) |

#### Deskripsi
Menambahkan user tenant dan memilih role yang diizinkan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
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

## 📌 [USR-04] Edit User

### [USR-04-FE] Edit User — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-04-FE` |
| Modul | MASTER USER |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-04-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-010, FR-013 • MASTER USER |

#### Deskripsi
Memperbarui nama dan role user tanpa mengubah identitas email. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memperbarui nama dan role user tanpa mengubah identitas email.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/usr/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Edit User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `USR-04-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "roleId": "00000000-0000-4000-8000-000000000001",
  "versionNo": 1
}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Edit User | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [USR-04-BE] Edit User — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-04-BE` |
| Modul | MASTER USER |
| Service | [updateUser](02_SPEC_API.md#updateuser), [listAssignableRoles](02_SPEC_API.md#listassignableroles) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER USER |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-02` |
| Blocks | `USR-04-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| FSD / Spec Ref | [updateUser](02_SPEC_API.md#updateuser), [listAssignableRoles](02_SPEC_API.md#listassignableroles) |

#### Deskripsi
Memperbarui nama dan role user tanpa mengubah identitas email. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "name": "Contoh FinLens",
  "roleId": "00000000-0000-4000-8000-000000000001",
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

## 📌 [USR-05] Aktif / Nonaktif dan Reset Akses User

### [USR-05-FE] Aktif / Nonaktif dan Reset Akses User — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-05-FE` |
| Modul | MASTER USER |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-05-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-011, FR-012 • MASTER USER |

#### Deskripsi
Mengendalikan akses user dan mengirim ulang kredensial sementara secara aman. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Mengendalikan akses user dan mengirim ulang kredensial sementara secara aman.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/usr/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Aktif / Nonaktif dan Reset Akses User selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `USR-05-BE`.
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
| 1 | Buka tampilan / form Aktif / Nonaktif dan Reset Akses User | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [USR-05-BE] Aktif / Nonaktif dan Reset Akses User — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `USR-05-BE` |
| Modul | MASTER USER |
| Service | [updateUserStatus](02_SPEC_API.md#updateuserstatus), [resetUserCredential](02_SPEC_API.md#resetusercredential) |
| Status | OPEN |
| Permission | Mengikuti hak akses MASTER USER |
| Story Point | 2 SP |
| Durasi | 8 jam (1 SP = 4 jam bersih) |
| Depends On | `USR-02`, `LGN-02` |
| Blocks | `USR-05-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | mst_user, mst_role, trn_password_reset, trn_user_session; tabel pendukung pada ERD final |
| FSD / Spec Ref | [updateUserStatus](02_SPEC_API.md#updateuserstatus), [resetUserCredential](02_SPEC_API.md#resetusercredential) |

#### Deskripsi
Mengendalikan akses user dan mengirim ulang kredensial sementara secara aman. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

