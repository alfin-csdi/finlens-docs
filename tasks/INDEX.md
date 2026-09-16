# FinLens — Master Index Spesifikasi Task (54 Unit Eksekusi)

Baseline resmi implementasi lokal FinLens Phase 1. Setiap subitem telah di-breakdown menjadi **Frontend (`*-FE`)** dan **Backend (`*-BE`)** lengkap dengan tabel metadata, alur flow logic, dan QC checklist sesuai acuan [TASK_CREATOR.md](../TASK_CREATOR.md).

| Modul | File Spesifikasi | Kode Task | Jumlah Subitem | Total SP |
|---|---|---|---:|---:|
| **Fondasi Sistem (FND)** | [00_FONDASI.md](00_FONDASI.md) | `FND-01, FND-02, FND-03, FND-04` | 4 | 13 SP |
| **Login & Authentication (LGN)** | [01_LOGIN.md](01_LOGIN.md) | `LGN-01, LGN-02, LGN-03` | 3 | 14 SP |
| **Master Tenant (TEN)** | [02_TENANT.md](02_TENANT.md) | `TEN-01, TEN-02, TEN-03, TEN-04, TEN-05` | 5 | 5.5 SP |
| **Master User (USR)** | [03_USER.md](03_USER.md) | `USR-01, USR-02, USR-03, USR-04, USR-05` | 5 | 11 SP |
| **Master Role (ROL)** | [04_ROLE.md](04_ROLE.md) | `ROL-01, ROL-02, ROL-03, ROL-04, ROL-05` | 5 | 7.5 SP |
| **Master Anomali (ANO)** | [05_ANOMALI.md](05_ANOMALI.md) | `ANO-01, ANO-02, ANO-03, ANO-04, ANO-05` | 5 | 6.5 SP |
| **Master Kategori File (KAT)** | [06_KATEGORI.md](06_KATEGORI.md) | `KAT-01, KAT-02, KAT-03, KAT-04, KAT-05` | 5 | 5.5 SP |
| **Submit Document (SUB)** | [07_SUBMIT_DOCUMENT.md](07_SUBMIT_DOCUMENT.md) | `SUB-01, SUB-02, SUB-03` | 3 | 15.5 SP |
| **Bucket Document (BUC)** | [08_BUCKET_DOCUMENT.md](08_BUCKET_DOCUMENT.md) | `BUC-01, BUC-02, BUC-03, BUC-04` | 4 | 8 SP |
| **Review & History Document (REV)** | [09_REVIEW_DOCUMENT.md](09_REVIEW_DOCUMENT.md) | `REV-01, REV-02, REV-03, REV-04` | 4 | 13 SP |
| **Activity Log (LOG)** | [10_ACTIVITY_LOG.md](10_ACTIVITY_LOG.md) | `LOG-01, LOG-02` | 2 | 2.5 SP |
| **Dashboard (DSH)** | [11_DASHBOARD.md](11_DASHBOARD.md) | `DSH-01, DSH-02, DSH-03` | 3 | 4 SP |
| **Notifikasi (NOT)** | [12_NOTIFIKASI.md](12_NOTIFIKASI.md) | `NOT-01, NOT-02` | 2 | 2.5 SP |
| **Profile & Setting (PRO)** | [13_PROFILE.md](13_PROFILE.md) | `PRO-01, PRO-02, PRO-03` | 3 | 4 SP |
| **QA Integrasi End-to-End (QA)** | [14_QA_INTEGRASI.md](14_QA_INTEGRASI.md) | `QA-01` | 1 | 5 SP |
| **TOTAL KESELURUHAN** | — | **54 Unit Eksekusi** | **54 Task** | **117.5 SP (470 jam)** |


## Petunjuk Penggunaan untuk Monday.com
1. Buka file modul yang diinginkan di folder `tasks/`.
2. Sorot / blok teks pada subitem yang dituju (misal: `[TEN-01-FE]` atau `[TEN-01-BE]`).
3. Tekan `Ctrl + C`, lalu paste (`Ctrl + V`) ke kolom Update atau Monday Doc pada board Anda.
4. Tabel metadata di bagian atas akan otomatis ter-render rapi dan konsisten.
