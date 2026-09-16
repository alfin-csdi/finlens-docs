# FinLens — Spesifikasi Teknis: Notifikasi (NOT)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **2 subitem**

---

## 📌 [NOT-01] Daftar & Jumlah Notifikasi

### [NOT-01-FE] Daftar & Jumlah Notifikasi — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `NOT-01-FE` |
| Modul | NOTIFIKASI |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `NOT-01-BE` |
| Blocks | `NOT-02-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-006, FR-036, FR-037, FR-042 • NOTIFIKASI |

#### Deskripsi
Memberi tahu pengguna mengenai pekerjaan atau perubahan yang relevan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memberi tahu pengguna mengenai pekerjaan atau perubahan yang relevan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/not/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Daftar & Jumlah Notifikasi selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `NOT-01-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/notifications
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Daftar & Jumlah Notifikasi | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [NOT-01-BE] Daftar & Jumlah Notifikasi — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `NOT-01-BE` |
| Modul | NOTIFIKASI |
| Service | [listNotifications](02_SPEC_API.md#listnotifications), [getUnreadNotificationCount](02_SPEC_API.md#getunreadnotificationcount) |
| Status | OPEN |
| Permission | Mengikuti hak akses NOTIFIKASI |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-02`, `FND-04` |
| Blocks | `NOT-01-FE`, `NOT-02-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_notification, trn_notification_recipient, trn_outbox_event; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listNotifications](02_SPEC_API.md#listnotifications), [getUnreadNotificationCount](02_SPEC_API.md#getunreadnotificationcount) |

#### Deskripsi
Memberi tahu pengguna mengenai pekerjaan atau perubahan yang relevan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/notifications
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

## 📌 [NOT-02] Tandai Dibaca & Buka Halaman Terkait

### [NOT-02-FE] Tandai Dibaca & Buka Halaman Terkait — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `NOT-02-FE` |
| Modul | NOTIFIKASI |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `NOT-02-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| FSD Ref | FR-037, FR-038 • NOTIFIKASI |

#### Deskripsi
Memungkinkan pengguna membersihkan inbox dan membuka pekerjaan terkait. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memungkinkan pengguna membersihkan inbox dan membuka pekerjaan terkait.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/not/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Tandai Dibaca & Buka Halaman Terkait selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `NOT-02-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
POST /api/v1/notifications/{id}/read
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Tandai Dibaca & Buka Halaman Terkait | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [NOT-02-BE] Tandai Dibaca & Buka Halaman Terkait — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `NOT-02-BE` |
| Modul | NOTIFIKASI |
| Service | [markNotificationRead](02_SPEC_API.md#marknotificationread), [markAllNotificationsRead](02_SPEC_API.md#markallnotificationsread) |
| Status | OPEN |
| Permission | Mengikuti hak akses NOTIFIKASI |
| Story Point | 0.5 SP |
| Durasi | 2 jam (1 SP = 4 jam bersih) |
| Depends On | `NOT-01`, `REV-02` |
| Blocks | `NOT-02-FE`, `QA-01-BE` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Database | trn_notification, trn_notification_recipient, trn_outbox_event; tabel pendukung pada ERD final |
| FSD / Spec Ref | [markNotificationRead](02_SPEC_API.md#marknotificationread), [markAllNotificationsRead](02_SPEC_API.md#markallnotificationsread) |

#### Deskripsi
Memungkinkan pengguna membersihkan inbox dan membuka pekerjaan terkait. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
POST /api/v1/notifications/{id}/read
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

