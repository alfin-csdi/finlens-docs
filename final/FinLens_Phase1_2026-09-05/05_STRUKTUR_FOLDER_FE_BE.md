# FinLens — Struktur Folder FE/BE Mengikuti Repository Acuan

Tanggal: 7 September 2026. Status: **acuan foldering dan separation of concerns untuk implementasi berikutnya**. Analisis berdasarkan inspeksi source lokal, bukan asumsi dari nama folder.

## 1. Keputusan dan ruang lingkup

Ikuti pola **layer-based** dari dua repository yang ditentukan user:

- FE: [seva-agency-cms](</D:/Repository/seva-agency-cms>) — App Router, atomic components, custom hooks, API functions, query/mutation hooks, dan konfigurasi kolom.
- BE: [product-service-accone](</D:/Repository/product-service-accone>) — routes, middlewares, controllers, services, validators, interfaces, configs, utils, dan Prisma.

Layer-based berarti kode dikelompokkan berdasarkan tanggung jawabnya. Satu fitur dapat memiliki file pada beberapa folder, dengan nama domain yang konsisten. Contoh: `document.routes.ts` → `document.controller.ts` → `document.service.ts`.

**Dokumen ini menggantikan arahan foldering pada bagian “Struktur repository saat coding” di [04_ARSITEKTUR.md](04_ARSITEKTUR.md), serta memperbarui referensi R2 yang sebelumnya menyatakan repo SEVA belum ditemukan.** FE tidak memakai `features/` sebagai struktur utama; BE tidak memakai `modules/` sebagai struktur utama. Dua repo FinLens yang sudah ada dipertahankan, dengan worker Python di repo BE.

Aturan bisnis, kontrak API, database, otorisasi, dan protokol worker tetap mengacu pada [01_ERD.md](01_ERD.md), [02_SPEC_API.md](02_SPEC_API.md), [03_TASK.md](03_TASK.md), dan bagian lain [04_ARSITEKTUR.md](04_ARSITEKTUR.md). Mengikuti foldering tidak berarti menyalin domain bisnis, autentikasi, semua dependency, atau infrastruktur repo acuan.

Deliverable pekerjaan ini hanya dokumen. Belum ada pemindahan source, perubahan dependency, migration database, atau implementasi fitur. Contoh kode di bawah bersifat ilustratif dan belum menjadi source executable yang diuji.

## 2. Apa yang benar-benar ditemukan

### 2.1 FE SEVA

```text
seva-agency-cms/src/
├── app/                         (auth), (dashboard), API routes
├── assets/                      icons, images, styles
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── providers/
├── config/columns/
├── constants/
├── data/                        termasuk dummy JSON
├── hooks/
├── interfaces/
├── services/
│   ├── api/
│   ├── config/
│   ├── query/
│   ├── satellite/
│   └── session/
├── store/
├── types/
└── utils/
```

Alur nyata yang ditelusuri adalah Manajemen Email Agen:

1. [page.tsx](</D:/Repository/seva-agency-cms/src/app/(dashboard)/manajemen-email-agen/page.tsx>) merangkai search, button, table, dan dialog.
2. [useEmailCabang.ts](</D:/Repository/seva-agency-cms/src/hooks/useEmailCabang.ts>) mengelola pagination, search, dialog, submit/delete, serta mengembalikan `{ state, actions }`.
3. [services/query/emailCabang.ts](</D:/Repository/seva-agency-cms/src/services/query/emailCabang.ts>) berisi **useQuery sekaligus useMutation**, query keys, invalidation, serta sebagian notifikasi/error mapping.
4. [services/api/emailCabang.ts](</D:/Repository/seva-agency-cms/src/services/api/emailCabang.ts>) membentuk payload dan memanggil endpoint melalui satellite.
5. [services/satellite/index.tsx](</D:/Repository/seva-agency-cms/src/services/satellite/index.tsx>) memiliki Axios instance, token injection, dan interceptor respons.
6. [emailCabangColumns.tsx](</D:/Repository/seva-agency-cms/src/config/columns/emailCabangColumns.tsx>) menyimpan definisi kolom dan callback tindakan tabel.

**Koreksi terhadap penjelasan sebelumnya:** repo SEVA yang sekarang diperiksa tidak memiliki folder `services/mutation/` dalam inventori source. Query dan mutation dipisahkan sebagai fungsi, tetapi ditempatkan bersama dalam file domain di `services/query/`. Folder mutation terpisah sebelumnya berasal dari template lain.

### 2.2 BE product-service-accone

```text
product-service-accone/
├── src/
│   ├── app.ts
│   ├── configs/
│   ├── constants/
│   ├── controllers/
│   ├── interfaces/
│   ├── jobs/
│   ├── middlewares/
│   ├── prisma/
│   │   ├── clients/
│   │   └── schemas/           master, trn, user
│   ├── routes/
│   ├── services/             termasuk autosync
│   ├── test/
│   ├── types/
│   ├── utils/
│   ├── validators/
│   └── views/                Pug
└── bin/
```

Alur nyata yang ditelusuri:

- [routes/index.ts](</D:/Repository/product-service-accone/src/routes/index.ts>) memasang validator dan controller untuk search/suggestion.
- [elastic.controller.ts](</D:/Repository/product-service-accone/src/controllers/elastic.controller.ts>) memanggil fungsi pencarian dari `utils/es.util.ts`, lalu membentuk respons HTTP.
- [user.service.ts](</D:/Repository/product-service-accone/src/services/user.service.ts>) memperlihatkan service yang mengakses Prisma.
- [prisma/clients/index.ts](</D:/Repository/product-service-accone/src/prisma/clients/index.ts>) membuat tiga client: master, transaction, dan user.
- [app.ts](</D:/Repository/product-service-accone/src/app.ts>) sekaligus memasang Express, menjalankan sync/Kafka, dan membuka listener.

**Folder layer sudah tersedia, tetapi batas tanggung jawab belum selalu konsisten:** search melewati controller → utils, bukan controller → service. Karena itu, FinLens mengikuti struktur foldernya sambil memperjelas pemilik business logic.

### 2.3 FinLens sekarang: desain berbeda dengan source

| Area | Desain pada dokumen 04 | Source FinLens yang diperiksa sekarang |
|---|---|---|
| Repository | Monorepo web/API/packages/worker | Dua repo: `finlens-ai-fe` dan `finlens-ai-be` |
| FE halaman | `apps/web/src/app` | `finlens-ai-fe/src/app` |
| FE komponen | Atomic folders + `features/` | Komponen bersama masih terkumpul di `src/components/shared.tsx` |
| FE API | Services, query keys, mutations | `src/services/api.ts`: typed fetch client; belum ada query/mutation layer |
| BE domain | `apps/api/src/modules/` | Flat foundation files dalam `apps/api/src/`, seperti `security.ts`, `analysis.ts`, `events.ts` |
| Database | PostgreSQL + Prisma | Schema/migration di `packages/db/prisma`; fondasi runtime juga memakai `pg` dan SQL transaksi langsung |
| Fitur bisnis | Rencana seluruh Phase 1 | Foundation route memasang guard, tetapi handler domain yang belum dikerjakan masih 501 |

Sumber diperiksa langsung: [FE src](</D:/Repository/finlens-ai-fe/src>), [BE src](</D:/Repository/finlens-ai-be/apps/api/src>), [FE package.json](</D:/Repository/finlens-ai-fe/package.json>), dan [BE package.json](</D:/Repository/finlens-ai-be/package.json>). Laporan historis tersedia di [tahap 2](../../implementation-progress/stage-2-2026-09-06/README.md). Tidak menjalankan ulang build atau acceptance test dalam analisis dokumentasi ini.

## 3. Perbandingan dan plus-minus

| Aspek | Struktur awal FinLens: per fitur | Mengikuti repo acuan: per layer | Keputusan untuk FinLens |
|---|---|---|---|
| Mencari seluruh kode satu fitur | Mudah: sebagian besar berdekatan | Harus melintasi app/hooks/API atau routes/controller/service | Ikuti layer; gunakan nama domain konsisten |
| Familiaritas tim | Perlu mengenal `features/` dan `modules/` | Sesuai kebiasaan SEVA dan product service | Nilai utama mengikuti repo acuan |
| Komponen UI bersama | Atomic tetap bisa digunakan | Atomic sudah nyata dan banyak contoh | Pertahankan atomic dan contracts komponen FinLens |
| Batas UI dan data | Bisa jelas jika disiplin | Hook, API, dan query layer memberi tempat eksplisit | Gunakan page → hook → query → API → satellite |
| Kepemilikan fitur | Mudah didelegasikan sebagai folder domain | File domain tersebar; perubahan mudah terlewat | Sertakan daftar file per fitur dalam task/review |
| Pertumbuhan folder | Banyak folder domain kecil | `hooks`, `services`, `utils` bisa padat | Pecah subfolder per domain hanya ketika perlu |
| File pusat | Risiko registry besar tetap ada | `index.ts` mudah jadi tempat semua handler | Index hanya registrasi/export, implementasi per file |
| Pengujian | Mudah mengikuti modul | Mudah menguji service jika tidak tergantung Express | Service menerima input/actor/transaction, bukan req/res |
| Biaya penyesuaian saat ini | Tetap perlu membangun struktur target | FE perlu pecah shared; BE perlu pindah path dan pecah fondasi | Migrasi bertahap, jangan rewrite logic yang sudah teruji |
| Kesesuaian runtime | Tidak ditentukan foldering | Tidak otomatis lebih cepat/lambat | Nilai dari kejelasan dan maintainability, bukan klaim performa |

Kesimpulan analisis: **mengikuti repo acuan masuk akal untuk konsistensi tim**. Kerugiannya adalah satu fitur tersebar ke lebih banyak folder. Kerugian ini dapat dikurangi dengan penamaan seragam, indeks task per fitur, dan pembatasan import antarlayer.

## 4. Struktur FE yang menjadi acuan baru

```text
finlens-ai-fe/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── (auth)/login/page.tsx
│   │   └── (dashboard)/
│   │       ├── layout.tsx
│   │       └── documents/page.tsx
│   ├── assets/                      styles, icons, images
│   ├── components/
│   │   ├── atoms/                   Button/index.tsx, Input, Badge, Spinner
│   │   ├── molecules/               Field, FilterRow, ConfirmDialog
│   │   ├── organisms/               DataTable, DocumentForm, AppShell
│   │   └── providers/               ContainerProvider/index.tsx
│   ├── config/columns/              documentColumns.tsx
│   ├── constants/                   pagination.ts, documentStatus.ts
│   ├── hooks/                       useDocuments.ts, useDocumentForm.ts
│   ├── interfaces/                  document.ts: alias DTO + tipe view/form
│   ├── services/
│   │   ├── api/                     document.ts
│   │   ├── config/                  queryClient.ts
│   │   ├── query/                   document.ts: query + mutation hooks
│   │   ├── satellite/               index.ts: typed transport bersama
│   │   └── contracts.ts             generated/re-export kontrak API
│   ├── types/                       tipe UI lintas domain
│   └── utils/
│       ├── helper/                  formatting dan fungsi murni
│       └── validation/              documentSchema.ts untuk form
├── public/                          aset publik aplikasi
├── tests/                           termasuk E2E yang sudah ada
├── scripts/
└── package.json
```

Ini adalah pohon target, bukan perintah membuat seluruh folder kosong. Tambahkan file ketika ada kebutuhan fitur.

Penyesuaian terarah terhadap SEVA:

- Gunakan `config/` singular pada FE dan `configs/` plural pada BE, sesuai repo masing-masing.
- `services/query/document.ts` menyimpan query dan mutation bersama. Pisahkan file di dalam domain itu bila ukurannya mulai sulit dirawat; jangan membuat dua konvensi bersamaan tanpa alasan.
- `satellite` berarti transport bersama, **tidak wajib Axios**. Pindahkan/re-export typed fetch client FinLens yang sudah ada, beserta `ApiError`, abort, token memory, dan idempotency header.
- Pola TanStack Query diadopsi ketika query layer dibangun. Paket tersebut belum ada pada manifest FE FinLens yang diperiksa; pemasangan/version compatibility dan provider adalah pekerjaan implementasi berikutnya.
- `store/` hanya dibuat ketika ada state UI global nyata yang perlu dibagikan. Jangan menyalin Redux, reducer counter, atau menyimpan salinan respons API di sana hanya untuk menyerupai repo SEVA.
- `services/session/` dan `app/api/` tidak ditambahkan sekadar meniru SEVA. FinLens tetap memakai kontrak access token di memory, refresh HttpOnly cookie, serta core Express sebagai pemilik sesi/MFA. Tambahkan boundary server hanya jika diperlukan oleh flow yang disepakati.
- Alias `@components`, `@hooks`, `@services`, `@interfaces`, `@config` mengikuti gaya SEVA. Konfigurasi alias perlu ditambahkan dan diverifikasi karena tsconfig FE FinLens saat ini belum mendefinisikannya.
- `data/` boleh untuk fixture sintetis yang jelas, bukan fallback diam-diam ketika API gagal. PDF bisnis tidak masuk `public/`.

### Pemisahan tanggung jawab FE

| Lokasi | Boleh / menjadi pemilik | Hindari |
|---|---|---|
| `app/.../page.tsx` | Merangkai UI dan membaca hasil custom hook | URL endpoint, token handling, transformasi bisnis panjang |
| `components/atoms` | Props, tampilan, accessibility, interaksi lokal | Import API/query/store domain |
| `components/molecules` | Kombinasi atom dan callback | Membuka koneksi API sendiri untuk CRUD domain |
| `components/organisms` | Tabel/form/panel lengkap, menggabungkan UI | Duplikasi request yang sudah dimiliki page hook |
| `hooks/useDocuments.ts` | State filter/dialog, callback, orkestrasi query, `{ state, actions }` | Menulis SQL, URL HTTP, atau menyalin server state ke state lain tanpa kebutuhan |
| `services/query/document.ts` | Query key, useQuery/useMutation, invalidation, polling | JSX, navigasi/global toast sebagai side effect yang tidak diminta pemakai |
| `services/api/document.ts` | Endpoint, parameter, payload, return DTO | Hook React, dialog, formatting tampilan |
| `services/satellite` | Base URL, headers, token, transport errors | Business permission atau mapping field khusus dokumen |
| `config/columns` | Label kolom, renderer, callback action | Menjalankan query atau mutation sendiri |
| `interfaces` / `types` | Form/view types; alias dari generated API types | Mengetik ulang DTO API hingga menjadi kontrak kedua |
| `utils` | Fungsi murni: format waktu/angka, mapping tampilan | Tempat semua side effect dan business workflow |

Atomic design mengatur komposisi UI, sedangkan hook/query/API mengatur aliran data. Keduanya saling melengkapi. Jangan membuat atom/molecule yang hanya menjadi pembungkus kosong demi memenuhi tingkatan.

## 5. Struktur BE yang menjadi acuan baru

```text
finlens-ai-be/
├── src/
│   ├── app.ts                       Express assembly tanpa listen/start jobs
│   ├── server.ts                    startup API dan graceful shutdown
│   ├── worker.ts                    startup background jobs/internal listener
│   ├── configs/                     env, database, broker, storage, mail
│   ├── constants/                   status dan event names
│   ├── routes/                      index.ts, document.routes.ts
│   ├── middlewares/                 session, permission, validation, errors
│   ├── controllers/                 document.controller.ts
│   ├── services/
│   │   ├── document.service.ts
│   │   ├── analysis.service.ts
│   │   ├── audit.service.ts
│   │   ├── idempotency.service.ts
│   │   └── integrations/            MFA, storage, scanner, broker, mail adapters
│   ├── validators/                  OpenAPI validation dan domain validation
│   ├── interfaces/                  actor, command, typed result
│   ├── types/express/               deklarasi context Express bila diperlukan
│   ├── prisma/
│   │   ├── clients/                 akses client yang dikonfigurasi
│   │   ├── schemas/schema.prisma    satu schema FinLens
│   │   ├── migrations/             history SQL yang dilacak Git
│   │   └── seeds/                   seed lokal yang sudah ada
│   ├── jobs/                        outbox, scan, notification, retry/sweeper
│   └── utils/                       hash, redaction, pagination, error primitive
├── packages/contracts/              sumber kontrak dan output generated
├── workers/ai/                      Python engine, adapters, consumer
├── infra/                           Compose dan konfigurasi lokal
├── scripts/                         bootstrap, contracts, migration, replay
├── tests/                           suite regresi yang sudah ada
└── package.json
```

Penyesuaian terarah terhadap product-service-accone:

- Entry point aplikasi dipindah dari `apps/api/src` ke root `src`, mengikuti struktur acuan. Ini membutuhkan pembaruan script/build/import; bukan hanya rename folder.
- `app.ts`, `server.ts`, dan `worker.ts` dipisahkan agar mengimpor aplikasi untuk test tidak langsung menjalankan broker, scanning, atau listener.
- `services/integrations` merupakan tambahan untuk memperjelas side effect eksternal yang pada repo acuan sebagian berada di `utils`/`configs`. `configs` membentuk konfigurasi/client; service adapter menjalankan operasi eksternal.
- `packages/contracts` dan `workers/ai` dipertahankan karena sudah diperlukan FinLens. Repo BE boleh tetap memiliki package kontrak tanpa menjadikan FE+BE satu monorepo.
- `src/prisma/schemas` mengikuti nama folder acuan, tetapi tetap satu schema FinLens. Jangan menyalin tiga database/client master/trn/user dari product service.
- Target history adalah `src/prisma/migrations`, sejajar dengan `schemas`. Saat dipindahkan, konfigurasi migration runner harus secara eksplisit menunjuk lokasi ini; jangan mengasumsikan tool akan menemukannya otomatis. Pertahankan SQL, urutan, checksum, dan pencatatan history database.
- Tidak mengganti `pg` menjadi Prisma query secara massal dalam refactor folder. Transaksi/lock/privilege fondasi yang sudah bekerja dipertahankan; pemilihan API query baru harus menjaga satu transaction context.
- `tests/` tetap memakai lokasi suite FinLens saat ini. Perbedaan dari `src/test` acuan disengaja untuk mengurangi perubahan tanpa manfaat.
- `views/`, Pug, `bin/www`, Elasticsearch, Kafka, dan autosync produk tidak menjadi bagian target hanya karena tersedia di reference. FinLens tetap memakai RabbitMQ dan JSON API sesuai desainnya.

### Pemisahan tanggung jawab BE

| Lokasi | Boleh / menjadi pemilik | Hindari |
|---|---|---|
| Routes | HTTP method/path, susunan middleware, controller | SQL, transaksi, aturan lifecycle |
| Middlewares | Authenticated actor, Origin, permission, validasi HTTP, error envelope | Menjalankan OCR atau finalize business state |
| Controllers | Input tervalidasi, actor, pemanggilan service, DTO/status HTTP | Query DB langsung atau menyimpan seluruh aturan bisnis |
| Services | Business rules, tenant scope, transaksi, audit/outbox, state/version checks | Import Express req/res, bergantung UI |
| Validators | Bentuk/batas input; predicate domain bila perlu | Menjadi salinan OpenAPI yang tidak disinkronkan |
| Prisma / database config | Client, schema, migration, pengelolaan transaction context | Mengganti tenant dari payload atau membuat client per request |
| Jobs | Claim/lease, jadwal, delivery/ACK, retry, memanggil service | Menduplikasi aturan bisnis dari service |
| Integrations | Protocol MFA, object storage, scanner, broker, SMTP | Menentukan permission user atau mengambil alih lifecycle dokumen |
| Utils | Fungsi umum kecil dan jelas, sebisa mungkin murni | Semua logic yang tidak tahu harus diletakkan di mana |
| Python worker | OCR, anomaly, similarity, transport hasil | Memfinalisasi CHECKED, membuat migration tandingan, otorisasi user |

Service dapat langsung menggunakan Prisma/SQL; repository layer baru tidak diwajibkan. Bila akses data yang sama benar-benar dipakai ulang, baru ekstrak bagian tersebut. Satu transaksi bisnis harus memakai client/connection transaksi yang sama untuk perubahan data, audit, dan outbox; transaksi `pg` dan Prisma yang terpisah tidak menjadi atomik hanya karena menuju database yang sama.

## 6. Contoh satu fitur dari FE sampai BE

Contoh domain: **Bucket Document**, endpoint existing contract `GET /api/v1/documents`, permission `document.view`.

```text
FE app/(dashboard)/documents/page.tsx
  → hooks/useDocuments.ts
  → services/query/document.ts
  → services/api/document.ts
  → services/satellite/index.ts
  → HTTP GET /api/v1/documents
BE routes/document.routes.ts
  → session + permission + request validation middleware
  → controllers/document.controller.ts
  → services/document.service.ts
  → PostgreSQL melalui client transaksi/query yang sesuai
  → Document DTO + meta → UI
```

### Contoh bentuk kode FE

Contoh ini menunjukkan penempatan konsep setelah query layer/provider dipasang. `DocumentListParams` adalah alias parameter dari kontrak generated. `SessionScope` berasal dari sesi FinLens dan berisi tenantId/userId; bukan tenant selector bebas.

```ts
// services/api/document.ts
import { api } from '@services/satellite';
import type { DocumentListParams } from '@interfaces/document';

export function apiGetDocuments(params: DocumentListParams, signal?: AbortSignal) {
  return api.request('/documents', 'get', { query: params, signal });
}
```

```ts
// services/query/document.ts
import { useQuery } from '@tanstack/react-query';
import { apiGetDocuments } from '@services/api/document';
import type { DocumentListParams } from '@interfaces/document';
import type { SessionScope } from '@interfaces/session';

export function useGetDocuments(scope: SessionScope, params: DocumentListParams) {
  return useQuery({
    queryKey: [scope.tenantId, scope.userId, 'documents', params],
    queryFn: ({ signal }) => apiGetDocuments(params, signal),
    retry: false,
  });
}
```

```ts
// hooks/useDocuments.ts
import { useState } from 'react';
import { useGetDocuments } from '@services/query/document';
import type { SessionScope } from '@interfaces/session';

export function useDocuments(scope: SessionScope) {
  const [page, setPage] = useState(1);
  const query = useGetDocuments(scope, { page, perPage: 20 });

  return {
    state: {
      rows: query.data?.data ?? [],
      meta: query.data?.meta,
      page,
      isLoading: query.isPending,
      error: query.error,
    },
    actions: { setPage, retry: query.refetch },
  };
}
```

Page menggunakan `{ state, actions }` untuk merangkai table dan feedback. Parent hanya memasang halaman terautentikasi setelah sesi tersedia. UI harus membedakan error dari empty state; array kosong di atas bukan alasan menyembunyikan error. Query key tenant/user mengisolasi cache, tetapi otorisasi tetap dilakukan BE. Bersihkan cache saat logout/perubahan sesi; jangan membawa previous data lintas identitas. Saat mutation ditambahkan pada file query yang sama, invalidation harus memakai scope yang sama dan tidak otomatis mengulang upload/finalize dengan key baru.

### Contoh pembagian kode BE

Pseudocode berikut sengaja menekankan boundary, bukan mengklaim nama helper ini sudah tersedia:

```text
document.routes.ts:
  register GET /documents
  chain: session → permit(document.view) → validate(listDocuments) → controller

document.controller.ts:
  actor = authenticated context
  input = validated query
  result = documentService.list(actor, input)
  respond 200 with final Document DTO and pagination/correlation metadata

document.service.ts:
  filter = actor.tenantId + non-deleted + validated filters
  query rows and count using the same filter
  apply allowed sorting and pagination
  map database rows to the final Document DTO
  return rows and metadata
```

Pada service tulis, pola ditambah state/version/idempotency checks serta transaksi data+audit+outbox. Upload/finalize bukan CRUD generik. Contohnya, CHECKED tetap terminal dan event tidak boleh diterbitkan langsung dari controller sebelum transaksi berhasil. DTO dokumen tetap mencakup scanStatus dan currentAnalysis.processingStatus sesuai spec; row database tidak dikirim mentah.

## 7. Do dan don't yang spesifik terhadap repo acuan

| Area | Do: ambil/pertahankan | Don't: jangan disalin otomatis | Alasan/bukti |
|---|---|---|---|
| FE page/hook | `{ state, actions }`, page merangkai UI | Semua state dan HTTP dipindahkan ke page | Pola nyata useEmailCabang sudah membantu pemisahan |
| FE API | Satu transport, fungsi per domain, typed DTO | Memanggil fetch/Axios di tiap atom/dialog | Mencegah aturan header/error bercabang |
| FE query/mutation | Cache/invalidation per domain dan identitas | Semua query memakai key global tanpa user/tenant | Query keys emailCabang acuan belum mencantumkan scope FinLens |
| FE feedback | Page hook menentukan field error dan feedback kontekstual | Service query selalu mengimpor Toast/navigasi | Acuan mencampur toast di query; FinLens perlu reuse lintas tampilan |
| FE permission | Menu/action dari permission sesi | Menyalin ROLE_MENU_ACCESS berbasis nama role | [RBAC acuan](</D:/Repository/seva-agency-cms/src/utils/rbac/config.ts>) berbasis role; FinLens berbasis permission dinamis |
| FE auth | Pertahankan core session/MFA FinLens dan error 401/403 yang tepat | Menyalin get-session/delete-session/redirect policy tanpa evaluasi | Auth SEVA adalah flow aplikasi lain; 403 aksi tidak selalu perlu meninggalkan halaman |
| FE field errors | Gunakan error.details field dari kontrak | Menebak field dengan substring message | useEmailCabang acuan memiliki mapApiErrorToField; kontrak FinLens sudah lebih terstruktur |
| BE service | Tempatkan aturan bisnis dan data access di services | Query bisnis di route/controller atau utils raksasa | Search controller acuan memanggil utils langsung |
| BE lifecycle | app assembly terpisah dari startup | syncDocs/listenKafka berjalan saat app di-import | Terlihat pada [app.ts](</D:/Repository/product-service-accone/src/app.ts:21>) |
| BE HTTP | GET untuk membaca; mutation mengikuti method kontrak | GET untuk delete atau hanya set status tanpa send/end | Ada [GET /delete](</D:/Repository/product-service-accone/src/routes/index.ts:90>) yang menjalankan delete dan hanya res.status(200) |
| BE errors | JSON error envelope FinLens dan correlationId | Menyalin Pug error rendering / bentuk status-message-data | Express acuan merender error HTML; FE FinLens membutuhkan kontrak JSON |
| BE database | Satu schema FinLens, tenant scope, FK/check/trigger | Tiga database/client atau query by ID tanpa tenant | Acuan memiliki tiga client dan service user by numeric ID |
| BE migration | History SQL di Git, perubahan schema melalui migration | Menyalin ignore migrations atau menjalankan db push untuk melewati history | [.gitignore acuan](</D:/Repository/product-service-accone/.gitignore>) mengabaikan src/prisma/migrations |
| BE contracts | Sumber kontrak tunggal dan generated types | Menjadikan Swagger generated lokal sebagai kontrak kedua | Acuan mengabaikan swagger-docs.json; startup membacanya |
| Runtime dependency | Pertahankan dependency FinLens yang sudah terverifikasi | Menyalin package.json atau menjalankan upgrade karena folder berubah | Refactor folder tidak memerlukan pergantian framework/ORM |
| Infra/worker | RabbitMQ, outbox/inbox, quarantine, Python worker | Kafka/Elasticsearch/autosync produk sebagai default baru | FinLens sudah mempunyai kebutuhan dan protokol sendiri |

Temuan di atas adalah alasan adaptasi untuk FinLens, bukan audit menyeluruh atas keamanan atau operasional repository acuan. Tidak menilai status dukungan versi, menjalankan dependency audit, atau menguji aplikasi acuan.

## 8. Pemetaan source FinLens ke struktur baru

### FE

| Source sekarang | Target | Ketentuan |
|---|---|---|
| `src/components/shared.tsx`: Button, Badge | `components/atoms/<Name>/index.tsx` | Pertahankan API props dan perilaku |
| `shared.tsx`: Field, FilterRow, ConfirmDialog | `components/molecules/<Name>/index.tsx` | Tetap label/error association, focus trap, Escape, return focus |
| `shared.tsx`: DataTable, Shell | `components/organisms/DataTable`, `AppShell` | Jangan sekalian mengganti kontrak props dengan tabel SEVA |
| `shared.tsx`: PermissionGate | `components/molecules/PermissionGate` | UI gate berbasis permission, BE tetap authoritative |
| `shared.tsx`: Feedback, ErrorFeedback | `components/molecules/Feedback`, `ErrorFeedback` | State 403/409/loading/empty/error tetap jelas |
| `src/services/api.ts` | `src/services/satellite/index.ts` | Pindahkan implementasi yang sama; re-export sementara dari path lama bila perlu |
| `src/services/contracts.ts` | Tetap di tempatnya | Update relative import transport setelah dipindah; generated file bukan edit manual |
| `src/app/globals.css` | `src/assets/styles/globals.css` | Update import layout; SCSS/Tailwind tidak wajib akibat foldering |
| `src/app/page.tsx` galeri | Tetap sebagai galeri development sampai route bisnis tersedia | Jangan menampilkan galeri seolah halaman bisnis selesai |

### BE

| Source sekarang dalam `apps/api/src` | Target dalam `src` | Ketentuan |
|---|---|---|
| `server.ts` | `app.ts` + `server.ts` + configs yang diperlukan | Pisahkan assembly dari startup/stop |
| `security.ts` | `middlewares/session.middleware.ts`, `permission.middleware.ts`, `origin.middleware.ts`; service scoped lookup; helper version/date | Pecah berdasarkan tanggung jawab, pertahankan enforcement |
| `core.ts` | Error/correlation middleware; audit service; util hash/redact/error; database transaction helper | Jangan letakkan audit bisnis dalam logger biasa |
| `validation.ts` | `validators/contract.validator.ts` + `middlewares/validation.middleware.ts` | Tetap Ajv/OpenAPI, jangan tambah Joi duplikat hanya meniru reference |
| `foundation.ts` | `routes/foundation.routes.ts` | Pertahankan guard coverage dan 501 selama domain belum diimplementasikan |
| `idempotency.ts` | `services/idempotency.service.ts` | Jangan mengubah durable transaction semantics |
| `events.ts` | Event/inbox service, broker adapter, outbox job, notification service | Publisher-confirm, dedup dan retry dipertahankan |
| `storage.ts` | Storage/scan services + adapters + scan job | CLEAN-only access dan recovery lease dipertahankan |
| `analysis.ts` | `services/analysis.service.ts` | Input snapshot, fencing, timeout dan hasil atomik dipertahankan |
| `internal.ts` | Internal route/controller assembly | Listener private tetap terpisah dari public API |
| `email.ts` | Email service + SMTP adapter + delivery job | Rahasia tidak masuk payload durable/log |
| `workers.ts` | `worker.ts` + `jobs/` | Startup/shutdown worker tetap terkontrol |
| `readiness.ts` | `services/readiness.service.ts` + konfigurasi dependency | Health checks dan cleanup tetap berjalan |
| `packages/db/prisma` dan seed | `src/prisma/schemas`, `migrations`, `seeds` | Update path runner; SQL/checksum tidak berubah |

Mapping ini menentukan tujuan tanggung jawab, bukan kewajiban satu file lama dipecah sekaligus menjadi banyak file. Pindahkan secara mekanis dahulu, lalu pecah bagian yang jelas terpisah. Jangan menyisakan dua implementasi aktif dari service yang sama.

## 9. Urutan penerapan yang disarankan

1. Catat baseline Git dan hasil verification repo implementasi. Inventaris import/entrypoint sebelum memindahkan file. Repository acuan hanya dibaca.
2. Rapikan FE: atomic components, satellite, alias, dan import layout. Pertahankan props, CSS behavior, dan typed contracts agar hasil browser tetap sama.
3. Pindahkan BE dari `apps/api/src` ke `src`. Update tsconfig root/output, dev/worker/test entrypoints, bootstrap/verify scripts, imports, serta workspace/dependency yang sebelumnya dimiliki `apps/api/package.json`.
4. Pindahkan Prisma secara terpisah. Update `db:generate`, migration runner, seed path, schema relation ke migration folder, generated-client imports, dan pemeriksaan schema parity. Jangan reset database development untuk refactor folder.
5. Pertahankan `packages/contracts` agar dependency lokal FE `file:../finlens-ai-be/packages/contracts` tetap berlaku. Jika packaging berubah, buktikan generate/install FE tetap memperoleh kontrak yang sama.
6. Pecah fondasi menjadi layer sesuai mapping. Pindahkan middleware, service, adapter, dan job tanpa mengubah behavior dalam perubahan yang sama.
7. Saat fitur pertama dikerjakan, tambahkan TanStack Query/provider dan pola `use<Domain> → services/query/<domain> → services/api/<domain>`. Gunakan generated DTO serta scoped keys sejak awal.
8. Daftarkan handler bisnis sebelum fallback 501 atau keluarkan operasi tersebut dari fallback registry. Jangan membiarkan route lama menangkap request lebih dahulu.
9. Jalankan verification yang relevan dan perbarui README task/progress setelah source benar-benar berpindah. Jangan mengubah bukti historis tahap 1/2 menjadi seolah menguji struktur baru.

Perubahan package scripts, output `dist/apps/api/src/...`, import test, workspace membership, migration path, serta contract relative paths merupakan bagian refactor yang wajib diperiksa. Folder yang terlihat rapi tetapi bootstrap/worker tidak bisa berjalan belum dianggap selesai.

## 10. Acceptance untuk refactor berikutnya

- FE typecheck/build dan E2E existing tetap lulus, termasuk keyboard, tablet, dialog focus, loading/error/empty/conflict.
- Typed API client tetap menjaga token memory, HttpOnly refresh cookie, abort, 401 handling, dan tidak mengulang mutation otomatis.
- BE build/typecheck/verify tetap lulus; bootstrap dan worker entrypoints menemukan file di path baru.
- Import app untuk test tidak menjalankan listen, jobs, atau integrasi background sebagai side effect.
- Tenant/permission/session/version guards tetap berlaku; foreign resource, stale version, dan CHECKED terminal tidak berubah.
- Baseline schema tetap 26 tabel / 308 kolom / 3 migration menurut evidence tahap 2; pemindahan file saja tidak mengubah SQL atau menambah migration bisnis.
- Outbox/inbox, idempotency, scanning, AI lease/fencing, notification, dan email retry tetap memenuhi regresi existing.
- FE/BE tetap memakai kontrak final yang sama; route method, permission key, request/response DTO, dan event protocol tidak berubah akibat penamaan folder.
- Tambahkan pengujian baru hanya bila boundary baru menciptakan risiko yang belum tercakup; jangan membuat test yang sekadar mengecek nama folder.

## 11. Panduan singkat untuk developer berikutnya

**FE:** ikuti foldering SEVA; page merangkai komponen, hook mengatur state/actions, query mengatur server state, API mengatur endpoint, satellite mengatur transport. Atomic components mempertahankan accessibility dan tidak menjadi tempat business authorization.

**BE:** ikuti foldering product-service-accone; route merangkai middleware, controller mengelola HTTP, service mengelola business rule/transaksi, adapter menghubungi integrasi, job mengatur delivery/retry. FinLens tetap memiliki satu schema, permission dinamis, isolasi tenant, dan worker Python terpisah.

**Batas adopsi:** gunakan konvensi folder dan pemisahan konsep kedua repo, dengan penyesuaian eksplisit di dokumen ini. Dependency, endpoint, sesi, database, dan workflow bisnis tetap milik FinLens.
