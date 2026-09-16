# FinLens — Spesifikasi Teknis: Fondasi Sistem (FND)

Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar `TASK_CREATOR.md`.

Total Task dalam modul ini: **4 subitem**

---

## 📌 [FND-01] Monorepo dan layanan lokal

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `FND-01` |
| Modul | FONDASE |
| Service | Backend / DevOps / Architecture Foundation |
| Status | OPEN |
| Story Point | 2 SP |
| Durasi | 8 jam (1 SP = 4 jam bersih) |
| Depends On | `—` |
| Blocks | `—` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Scope | apps/web/src/features/, apps/api/src/modules/, packages/db/ |

#### Context & Deskripsi
Buat workspace apps/web, apps/api, packages/contracts, packages/db, workers/ai, infra. Compose PostgreSQL, RabbitMQ, MinIO, ClamAV, Mailpit dan Redis opsional; env.example tanpa secret. Health/readiness, shutdown aman dan bootstrap satu perintah.

#### Flow Logic (Step by Step)
1. Baca kontrak dan dependency, buat perubahan dalam target monorepo baru setelah user memberi perintah coding.
2. Implementasikan scope kartu dan adapter konfigurasi lokal; gunakan seed/fixture synthetic tanpa credential reference.
3. Jalankan acceptance berikut dan catat output; hubungkan ke task bisnis terkait.

**Acceptance / QC:**
- [ ] Given checkout/database lokal bersih, when scope dijalankan, then Install/build/typecheck bisa diulang dari checkout bersih; readiness gagal jika dependency wajib unavailable.

<a id="fnd-02"></a>

#### Acceptance & QC Checklist
- [ ] Setup berhasil dijalankan dan diverifikasi.


---

## 📌 [FND-02] Migration, seed dan integritas data

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `FND-02` |
| Modul | FONDASE |
| Service | Backend / DevOps / Architecture Foundation |
| Status | OPEN |
| Story Point | 3 SP |
| Durasi | 12 jam (1 SP = 4 jam bersih) |
| Depends On | `FND-01` |
| Blocks | `—` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Scope | apps/web/src/features/, apps/api/src/modules/, packages/db/ |

#### Context & Deskripsi
Implementasikan seluruh DBML, constraints/deferrable FKs/triggers, seed severity/permission dan user-role bootstrap. Gunakan SQL migration untuk constraint yang tidak terwakili Prisma. Tidak mengimpor SQLite production.

#### Flow Logic (Step by Step)
1. Baca kontrak dan dependency, buat perubahan dalam target monorepo baru setelah user memberi perintah coding.
2. Implementasikan scope kartu dan adapter konfigurasi lokal; gunakan seed/fixture synthetic tanpa credential reference.
3. Jalankan acceptance berikut dan catat output; hubungkan ke task bisnis terkait.

**Acceptance / QC:**
- [ ] Given checkout/database lokal bersih, when scope dijalankan, then Reset database disposable menghasilkan schema lengkap; duplikat nama aktif, FK lintas tenant, assignment race dan UPDATE CHECKED ditolak.

<a id="fnd-03"></a>

#### Acceptance & QC Checklist
- [ ] Setup berhasil dijalankan dan diverifikasi.


---

## 📌 [FND-03] Guard API dan shell reusable

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `FND-03` |
| Modul | FONDASE |
| Service | Backend / DevOps / Architecture Foundation |
| Status | OPEN |
| Story Point | 3 SP |
| Durasi | 12 jam (1 SP = 4 jam bersih) |
| Depends On | `FND-02` |
| Blocks | `—` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Scope | apps/web/src/features/, apps/api/src/modules/, packages/db/ |

#### Context & Deskripsi
Bangun auth context, permission evaluator, tenant repository, DTO/error mapper, version locking, correlation/redaction. FE atomic primitives/layout, typed client, form/table/filter/modal state; tanpa hard-code persona.

#### Flow Logic (Step by Step)
1. Baca kontrak dan dependency, buat perubahan dalam target monorepo baru setelah user memberi perintah coding.
2. Implementasikan scope kartu dan adapter konfigurasi lokal; gunakan seed/fixture synthetic tanpa credential reference.
3. Jalankan acceptance berikut dan catat output; hubungkan ke task bisnis terkait.

**Acceptance / QC:**
- [ ] Given checkout/database lokal bersih, when scope dijalankan, then Direct API tanpa izin 403, foreign ID 404, forged tenant tidak mengubah scope; shell keyboard/tablet usable.

<a id="fnd-04"></a>

#### Acceptance & QC Checklist
- [ ] Setup berhasil dijalankan dan diverifikasi.


---

## 📌 [FND-04] Outbox, quarantine dan adapter worker

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | `FND-04` |
| Modul | FONDASE |
| Service | Backend / DevOps / Architecture Foundation |
| Status | OPEN |
| Story Point | 5 SP |
| Durasi | 20 jam (1 SP = 4 jam bersih) |
| Depends On | `FND-02` |
| Blocks | `—` |
| Critical Path | Tidak |
| Risk Level | Sedang |
| Target Scope | apps/web/src/features/, apps/api/src/modules/, packages/db/ |

#### Context & Deskripsi
Implement outbox/inbox, idempotency leases, email metadata + retry, private object store, scan worker fail-closed, queue publisher confirm, AI lease protocol dan DLQ. Kontrak internal lihat arsitektur.

#### Flow Logic (Step by Step)
1. Baca kontrak dan dependency, buat perubahan dalam target monorepo baru setelah user memberi perintah coding.
2. Implementasikan scope kartu dan adapter konfigurasi lokal; gunakan seed/fixture synthetic tanpa credential reference.
3. Jalankan acceptance berikut dan catat output; hubungkan ke task bisnis terkait.

**Acceptance / QC:**
- [ ] Given checkout/database lokal bersih, when scope dijalankan, then Crash setelah commit sebelum publish dan duplicate delivery tidak menggandakan business result/notifikasi; scan belum CLEAN tak terbaca AI.

<a id="lgn-01"></a>

#### Acceptance & QC Checklist
- [ ] Setup berhasil dijalankan dan diverifikasi.


---

