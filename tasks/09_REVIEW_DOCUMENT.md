# FinLens — Spesifikasi Teknis: Review & History Document (REV)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **4 subitem**

---

## 📌 [REV-01] Halaman History Document

### [REV-01-FE] Halaman History Document — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `REV-01-FE` |
| Modul | HISTORY / REVIEW DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `REV-01-BE` |
| Blocks | `REV-02-FE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| FSD Ref | FR-006, FR-007, FR-022, FR-027, FR-031, FR-042 • HISTORY / REVIEW DOCUMENT |

#### Deskripsi
Membantu checker menemukan dokumen yang siap atau telah selesai diperiksa. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Membantu checker menemukan dokumen yang siap atau telah selesai diperiksa.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rev/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Halaman History Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `REV-01-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Halaman History Document | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [REV-01-BE] Halaman History Document — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `REV-01-BE` |
| Modul | HISTORY / REVIEW DOCUMENT |
| Service | [listReviewHistory](02_SPEC_API.md#listreviewhistory), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |
| Status | OPEN |
| Permission | Mengikuti hak akses HISTORY / REVIEW DOCUMENT |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `SUB-03` |
| Blocks | `REV-01-FE`, `REV-02-BE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| Target Database | trn_document, trn_document_version, trn_ai_analysis, trn_ai_finding, trn_similarity_match; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listReviewHistory](02_SPEC_API.md#listreviewhistory), [listFilterOptions](02_SPEC_API.md#listfilteroptions) |

#### Deskripsi
Membantu checker menemukan dokumen yang siap atau telah selesai diperiksa. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews
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

## 📌 [REV-02] Detail Hasil Analisis

### [REV-02-FE] Detail Hasil Analisis — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `REV-02-FE` |
| Modul | HISTORY / REVIEW DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `REV-02-BE` |
| Blocks | `REV-03-FE`, `DSH-03-FE`, `NOT-02-FE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| FSD Ref | FR-027, FR-028, FR-043, FR-044 • HISTORY / REVIEW DOCUMENT |

#### Deskripsi
Menyajikan metadata, hasil ekstraksi, temuan, severity, dan bukti untuk pemeriksaan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Menyajikan metadata, hasil ekstraksi, temuan, severity, dan bukti untuk pemeriksaan.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rev/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Detail Hasil Analisis selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `REV-02-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews/{id}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Detail Hasil Analisis | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [REV-02-BE] Detail Hasil Analisis — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `REV-02-BE` |
| Modul | HISTORY / REVIEW DOCUMENT |
| Service | [getReviewDetail](02_SPEC_API.md#getreviewdetail), [getReviewFile](02_SPEC_API.md#getreviewfile) |
| Status | OPEN |
| Permission | Mengikuti hak akses HISTORY / REVIEW DOCUMENT |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `REV-01` |
| Blocks | `REV-02-FE`, `REV-03-BE`, `DSH-03-BE`, `NOT-02-BE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| Target Database | trn_document, trn_document_version, trn_ai_analysis, trn_ai_finding, trn_similarity_match; tabel pendukung pada ERD final |
| FSD / Spec Ref | [getReviewDetail](02_SPEC_API.md#getreviewdetail), [getReviewFile](02_SPEC_API.md#getreviewfile) |

#### Deskripsi
Menyajikan metadata, hasil ekstraksi, temuan, severity, dan bukti untuk pemeriksaan. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews/{id}
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

## 📌 [REV-03] Similarity & Compare Document

### [REV-03-FE] Similarity & Compare Document — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `REV-03-FE` |
| Modul | HISTORY / REVIEW DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 2 SP |
| Durasi | 8 jam (1 SP = 4 jam bersih) |
| Depends On | `REV-03-BE` |
| Blocks | `REV-04-FE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| FSD Ref | FR-027, FR-028, FR-044 • HISTORY / REVIEW DOCUMENT |

#### Deskripsi
Membantu checker memahami kemiripan dokumen dan membandingkan bukti. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Membantu checker memahami kemiripan dokumen dan membandingkan bukti.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rev/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Similarity & Compare Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `REV-03-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews/{id}/similarities
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Similarity & Compare Document | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [REV-03-BE] Similarity & Compare Document — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `REV-03-BE` |
| Modul | HISTORY / REVIEW DOCUMENT |
| Service | [listReviewSimilarities](02_SPEC_API.md#listreviewsimilarities), [compareReviewDocument](02_SPEC_API.md#comparereviewdocument), [getReviewFile](02_SPEC_API.md#getreviewfile) |
| Status | OPEN |
| Permission | Mengikuti hak akses HISTORY / REVIEW DOCUMENT |
| Story Point | 3 SP |
| Durasi | 12 jam (1 SP = 4 jam bersih) |
| Depends On | `REV-02` |
| Blocks | `REV-03-FE`, `REV-04-BE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| Target Database | trn_document, trn_document_version, trn_ai_analysis, trn_ai_finding, trn_similarity_match; tabel pendukung pada ERD final |
| FSD / Spec Ref | [listReviewSimilarities](02_SPEC_API.md#listreviewsimilarities), [compareReviewDocument](02_SPEC_API.md#comparereviewdocument), [getReviewFile](02_SPEC_API.md#getreviewfile) |

#### Deskripsi
Membantu checker memahami kemiripan dokumen dan membandingkan bukti. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```text
GET /api/v1/reviews/{id}/similarities
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

## 📌 [REV-04] Finalisasi Review Document

### [REV-04-FE] Finalisasi Review Document — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `REV-04-FE` |
| Modul | HISTORY / REVIEW DOCUMENT |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | OPEN |
| Story Point | 1 SP |
| Durasi | 4 jam (1 SP = 4 jam bersih) |
| Depends On | `REV-04-BE` |
| Blocks | `QA-01-FE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| FSD Ref | FR-026, FR-029 • HISTORY / REVIEW DOCUMENT |

#### Deskripsi
Memastikan checker sengaja mengunci hasil review menjadi final. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Goals
- Memastikan checker sengaja mengunci hasil review menjadi final.
- Outcome dapat diuji tanpa mengandalkan nama persona atau data tenant lain.

#### Scope File
* `apps/web/src/features/rev/`

#### Out of Scope
- Modul Master Label, Master Detection Setting, reopen CHECKED, manual admin unlock, manual AI retry UI, physical purge, dan provisioning hosted production.
- Perubahan business contract di luar kartu ini; keputusan baru harus memperbarui ERD/API/task/arsitektur bersama.

#### Acceptance Criteria
- [ ] Given actor berizin dan input valid, when alur Finalisasi Review Document selesai, then outcome dan DTO sesuai endpoint terkait.
- [ ] Given input invalid atau field tambahan, when request dipaksa melewati FE, then 400/422 dan tidak ada perubahan.
- [ ] Given tenant/permission tidak sesuai, when direct API dipanggil, then 403/404 tanpa data, count, file, atau mutation lintas tenant (untuk public auth gunakan expired/wrong-purpose context).
- [ ] Given concurrent mutation/replay/expired session yang relevan, when request dijalankan ulang, then state tidak rusak dan error/response idempotent sesuai kontrak.

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint `REV-04-BE`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "analysisId": "00000000-0000-4000-8000-000000000001",
  "versionNo": 1
}
```

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form Finalisasi Review Document | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [REV-04-BE] Finalisasi Review Document — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `REV-04-BE` |
| Modul | HISTORY / REVIEW DOCUMENT |
| Service | [finalizeReview](02_SPEC_API.md#finalizereview) |
| Status | OPEN |
| Permission | Mengikuti hak akses HISTORY / REVIEW DOCUMENT |
| Story Point | 3 SP |
| Durasi | 12 jam (1 SP = 4 jam bersih) |
| Depends On | `REV-03` |
| Blocks | `REV-04-FE`, `QA-01-BE` |
| Critical Path | Ya — jalur domain utama |
| Risk Level | Tinggi |
| Target Database | trn_document, trn_document_version, trn_ai_analysis, trn_ai_finding, trn_similarity_match; tabel pendukung pada ERD final |
| FSD / Spec Ref | [finalizeReview](02_SPEC_API.md#finalizereview) |

#### Deskripsi
Memastikan checker sengaja mengunci hasil review menjadi final. Satu kartu mencakup FE dan BE dengan kontrak yang sama. Baca guard bersama sebelum mengubah data. Selesaikan dependency dan gunakan referensi FSD/BA melalui empat dokumen final ini.

#### Flow Logic (Step by Step)
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

#### Parameter Input & Response
Contoh dan schema lengkap ada pada tautan Spec Ref untuk setiap operasi; jangan menyalin contoh lama dari output/task.

```json
{
  "analysisId": "00000000-0000-4000-8000-000000000001",
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

