const fs = require('fs');
const path = require('path');

// Ensure tasks directory exists
if (!fs.existsSync('tasks')) fs.mkdirSync('tasks', { recursive: true });

const raw = fs.readFileSync('final/FinLens_Phase1_2026-09-05/03_TASK.md', 'utf8');
const lines = raw.split(/\r?\n/);

const tasks = [];
let currentTask = null;
for (const line of lines) {
  const m = line.match(/^(?:##|###) ([A-Z]{2,3}-\d{2})\s*[\u2013\u2014\-]\s*(.*)$/);
  if (m) {
    if (currentTask) tasks.push(currentTask);
    currentTask = { code: m[1], title: m[2].trim(), lines: [] };
  } else if (currentTask) {
    currentTask.lines.push(line);
  }
}
if (currentTask) tasks.push(currentTask);

function parseTask(t) {
  const text = t.lines.join('\n');
  const getField = (name) => {
    const m = text.match(new RegExp('\\|\\s*' + name + '\\s*\\|\\s*([^\\|\\r\\n]+)\\|', 'i'));
    return m ? m[1].trim() : '';
  };
  const getSection = (heading) => {
    const m = text.match(new RegExp('###?\\s*' + heading + '[^\\r\\n]*\\r?\\n([\\s\\S]*?)(?=(?:###?\\s*|$))', 'i'));
    return m ? m[1].trim() : '';
  };

  const spRaw = getField('Story Point') || text.match(/\*\*SP:\*\*\s*([^\s•]+)/)?.[1] || '1';
  const dependsOnRaw = getField('Depends On') || text.match(/\*\*Depends On:\*\*\s*([^\r\n•]+)/)?.[1] || '—';
  
  let feSp = 0;
  let beSp = 0;
  const spMatch = spRaw.match(/FE\s*([\d\.]+)\s*\+\s*BE(?:\/shared)?\s*([\d\.]+)/i);
  if (spMatch) {
    feSp = parseFloat(spMatch[1]);
    beSp = parseFloat(spMatch[2]);
  } else if (t.code.startsWith('FND') || t.code.startsWith('QA')) {
    beSp = parseFloat(spRaw) || 2;
  }

  return {
    code: t.code,
    title: t.title,
    group: getField('Group') || (t.code.startsWith('FND') ? 'FONDASE' : 'QA'),
    status: getField('Status') || 'OPEN',
    spRaw,
    feSp,
    beSp,
    dependsOn: dependsOnRaw.trim(),
    blocks: getField('Blocks') || '—',
    criticalPath: getField('Critical Path') || 'Tidak',
    risk: getField('Risk') || 'Sedang',
    filesScope: getField('Files Scope') || 'apps/web/src/features/, apps/api/src/modules/, packages/db/',
    specRef: getField('Spec Ref') || '02_SPEC_API.md',
    erdRef: getField('ERD Ref') || 'mst_..., trn_...',
    requirementRef: getField('Requirement Ref') || '',
    context: getSection('Context dan deskripsi') || text.match(/\*\*Context \/ Scope:\*\*\s*([^\r\n]+(?:\r?\n[^\r\n#]+)*)/)?.[1] || '',
    goals: getSection('Goals'),
    scopeFE: getSection('Scope Frontend'),
    scopeBE: getSection('Scope Backend'),
    outOfScope: getSection('Out of scope'),
    acceptance: getSection('Acceptance Criteria') || getSection('Acceptance / QC'),
    flowLogic: getSection('Flow Logic'),
    qcKhusus: getSection('QC khusus') || getSection('Acceptance / QC'),
    reqRes: getSection('Request / response')
  };
}

const allTasks = tasks.map(parseTask);

const moduleGroups = [
  { prefix: 'FND', file: 'tasks/00_FONDASI.md', name: 'Fondasi Sistem (FND)' },
  { prefix: 'LGN', file: 'tasks/01_LOGIN.md', name: 'Login & Authentication (LGN)' },
  { prefix: 'TEN', file: 'tasks/02_TENANT.md', name: 'Master Tenant (TEN)' },
  { prefix: 'USR', file: 'tasks/03_USER.md', name: 'Master User (USR)' },
  { prefix: 'ROL', file: 'tasks/04_ROLE.md', name: 'Master Role (ROL)' },
  { prefix: 'ANO', file: 'tasks/05_ANOMALI.md', name: 'Master Anomali (ANO)' },
  { prefix: 'KAT', file: 'tasks/06_KATEGORI.md', name: 'Master Kategori File (KAT)' },
  { prefix: 'SUB', file: 'tasks/07_SUBMIT_DOCUMENT.md', name: 'Submit Document (SUB)' },
  { prefix: 'BUC', file: 'tasks/08_BUCKET_DOCUMENT.md', name: 'Bucket Document (BUC)' },
  { prefix: 'REV', file: 'tasks/09_REVIEW_DOCUMENT.md', name: 'Review & History Document (REV)' },
  { prefix: 'LOG', file: 'tasks/10_ACTIVITY_LOG.md', name: 'Activity Log (LOG)' },
  { prefix: 'DSH', file: 'tasks/11_DASHBOARD.md', name: 'Dashboard (DSH)' },
  { prefix: 'NOT', file: 'tasks/12_NOTIFIKASI.md', name: 'Notifikasi (NOT)' },
  { prefix: 'PRO', file: 'tasks/13_PROFILE.md', name: 'Profile & Setting (PRO)' },
  { prefix: 'QA',  file: 'tasks/14_QA_INTEGRASI.md', name: 'QA Integrasi End-to-End (QA)' }
];

function formatBusinessTask(t) {
  const feDuration = (t.feSp * 4) + ' jam';
  const beDuration = (t.beSp * 4) + ' jam';
  
  const fileParts = t.filesScope.split(',').map(s => s.trim());
  const feFiles = fileParts.filter(p => p.includes('apps/web') || p.includes('features'));
  const beFiles = fileParts.filter(p => !p.includes('apps/web'));
  
  const feScopeFiles = feFiles.length > 0 ? feFiles.map(f => '* `' + f + '`').join('\n') : '* `apps/web/src/features/' + t.code.split('-')[0].toLowerCase() + '/`';
  
  return `## 📌 [${t.code}] ${t.title}

### [${t.code}-FE] ${t.title} — Frontend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | \`${t.code}-FE\` |
| Modul | ${t.group} |
| Service | FE — FinLens Web App |
| Method | UI View / Interaction |
| Status | ${t.status} |
| Story Point | ${t.feSp} SP |
| Durasi | ${feDuration} (1 SP = 4 jam bersih) |
| Depends On | \`${t.code}-BE\` |
| Blocks | ${t.blocks ? t.blocks.split(',').map(b => '`' + b.trim() + '-FE`').join(', ') : '—'} |
| Critical Path | ${t.criticalPath} |
| Risk Level | ${t.risk} |
| FSD Ref | ${t.requirementRef ? t.requirementRef + ' • ' : ''}${t.group} |

#### Deskripsi
${t.context || 'Implementasi antarmuka pengguna untuk ' + t.title + ' sesuai ketentuan FSD FinLens.'}

#### Goals
${t.goals || '- Menyediakan interaksi UI dan visual yang intuitif.\n- Validasi input sisi klien dan penanganan error state.'}

#### Scope File
${feScopeFiles}

#### Out of Scope
${t.outOfScope || '- Pengaturan modul lain di luar kartu ini.'}

#### Acceptance Criteria
${t.acceptance || '- [ ] UI dan fungsionalitas bekerja sesuai FSD.'}

#### Flow Logic (Step by Step)
1. **Inisialisasi & Validasi Klien:**
   * Load data dependensi dan render komponen.
   * Validasi mandatory input dan format sebelum memanggil backend.
2. **Submit & Payload Dispatch:**
   * Kunci tombol submit (loading spinner, disabled).
   * Kirim payload data ke endpoint \`${t.code}-BE\`.
3. **Handling Response & Feedback:**
   * Tangkap respon sukses: tutup modal / tampilkan alert sukses / trigger refresh query.
   * Tangkap respon error (4xx): tampilkan inline error message atau banner alert.

#### Request & Response (Kontrak FE)
${t.reqRes || 'Mengikuti spesifikasi pada ' + t.specRef}

#### Notes
* Pastikan penanganan loading, empty state, dan error state terakomodasi dengan baik.

#### QC Checklist (FE Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Buka tampilan / form ${t.title} | Tampilan bersih, data/komponen ter-render sesuai state |
| 2 | Submit form dengan input kosong/invalid | Muncul validasi inline pada field terkait |
| 3 | Submit dengan data valid | Tombol loading spinner aktif, request terkirim ke backend |
| 4 | Respon backend error (4xx) | Pesan error tampil jelas pada antarmuka |
| 5 | Respon backend sukses (2xx) | Tampil alert sukses, form/tabel ter-update |

---

### [${t.code}-BE] ${t.title} — Backend

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | \`${t.code}-BE\` |
| Modul | ${t.group} |
| Service | ${t.specRef ? t.specRef.replace(/\\[|\\]/g, '') : 'Backend Service'} |
| Status | ${t.status} |
| Permission | Mengikuti hak akses ${t.group} |
| Story Point | ${t.beSp} SP |
| Durasi | ${beDuration} (1 SP = 4 jam bersih) |
| Depends On | ${t.dependsOn ? t.dependsOn.split(',').map(d => '`' + d.trim() + '`').join(', ') : '—'} |
| Blocks | \`${t.code}-FE\`${t.blocks && t.blocks !== '—' ? ', ' + t.blocks.split(',').map(b => '`' + b.trim() + '-BE`').join(', ') : ''} |
| Critical Path | ${t.criticalPath} |
| Risk Level | ${t.risk} |
| Target Database | ${t.erdRef || 'Tabel database terkait'} |
| FSD / Spec Ref | ${t.specRef || 'Spec API'} |

#### Deskripsi
${t.context || 'Implementasi layanan backend, API endpoint, transaksi database, dan audit trail untuk ' + t.title + '.'}

#### Flow Logic (Step by Step)
${t.flowLogic || '1. Validasi request & otentikasi/otorisasi.\n2. Cek integritas data & keunikan.\n3. Eksekusi transaksi database.\n4. Rekam audit trail.\n5. Kembalikan response DTO.'}

#### Parameter Input & Response
${t.reqRes || 'Lihat kontrak di 02_SPEC_API.md'}

#### Notes
* Pastikan isolasi multi-tenant terjaga (inject tenant_id server-side).
* Rekam aktivitas ke \`trn_audit_log\` secara atomik.

#### QC Checklist (BE / API Tester)
| # | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| 1 | Hit tanpa header Authorization | 401 Unauthorized |
| 2 | Hit dengan role tanpa permission | 403 Forbidden |
| 3 | Hit dengan payload tidak valid | 400 / 422 Unprocessable Entity + detail error |
| 4 | Hit data duplikat / konflik | 409 Conflict |
| 5 | Hit data valid | 200 / 201 OK, data tersimpan di DB, audit log terekam |
`;
}

function formatFoundationTask(t) {
  const duration = (t.beSp * 4) + ' jam';
  return `## 📌 [${t.code}] ${t.title}

#### Metadata Task
| Field | Detail |
|---|---|
| Task ID | \`${t.code}\` |
| Modul | ${t.group} |
| Service | Backend / DevOps / Architecture Foundation |
| Status | ${t.status} |
| Story Point | ${t.beSp} SP |
| Durasi | ${duration} (1 SP = 4 jam bersih) |
| Depends On | ${t.dependsOn ? t.dependsOn.split(',').map(d => '`' + d.trim() + '`').join(', ') : '—'} |
| Blocks | ${t.blocks ? t.blocks.split(',').map(b => '`' + b.trim() + '`').join(', ') : '—'} |
| Critical Path | ${t.criticalPath} |
| Risk Level | ${t.risk} |
| Target Scope | ${t.filesScope} |

#### Context & Deskripsi
${t.context}

#### Flow Logic (Step by Step)
${t.flowLogic || '1. Setup struktur kode dan konfigurasi.\n2. Implementasi adapter dan komponen dasar.\n3. Uji coba fungsionalitas dan integrasi.'}

#### Acceptance & QC Checklist
${t.acceptance || '- [ ] Setup berhasil dijalankan dan diverifikasi.'}
`;
}

// Generate files for each group
for (const grp of moduleGroups) {
  const groupTasks = allTasks.filter(t => t.code.startsWith(grp.prefix));
  if (groupTasks.length === 0) continue;

  // Don't overwrite tasks/01_LOGIN.md if it already has rich manual details, or write it cleanly
  if (grp.prefix === 'LGN' && fs.existsSync('tasks/01_LOGIN.md')) {
    console.log('Skipping overwrite of 01_LOGIN.md (preserves rich manual details)');
    continue;
  }

  let content = `# FinLens — Spesifikasi Teknis: ${grp.name}\n\n`;
  content += `Dokumen ini memuat spesifikasi teknis lengkap yang siap disalin ke Monday.com sesuai format standar \`TASK_CREATOR.md\`.\n\n`;
  content += `Total Task dalam modul ini: **${groupTasks.length} subitem**\n\n`;
  content += `---\n\n`;

  for (const t of groupTasks) {
    if (t.code.startsWith('FND') || t.code.startsWith('QA')) {
      content += formatFoundationTask(t) + '\n\n---\n\n';
    } else {
      content += formatBusinessTask(t) + '\n\n---\n\n';
    }
  }

  fs.writeFileSync(grp.file, content, 'utf8');
  console.log('Created file:', grp.file, 'with', groupTasks.length, 'tasks.');
}

// Generate Master INDEX.md
let indexContent = `# FinLens — Master Index Spesifikasi Task (54 Unit Eksekusi)

Baseline resmi implementasi lokal FinLens Phase 1. Setiap subitem telah di-breakdown menjadi **Frontend (\`*-FE\`)** dan **Backend (\`*-BE\`)** lengkap dengan tabel metadata, alur flow logic, dan QC checklist sesuai acuan [TASK_CREATOR.md](../TASK_CREATOR.md).

| Modul | File Spesifikasi | Kode Task | Jumlah Subitem | Total SP |
|---|---|---|---:|---:|
`;

let totalSpSum = 0;
let totalTasksSum = 0;

for (const grp of moduleGroups) {
  const groupTasks = allTasks.filter(t => t.code.startsWith(grp.prefix));
  if (groupTasks.length === 0) continue;
  
  let groupSp = 0;
  for (const t of groupTasks) {
    groupSp += (t.feSp + t.beSp);
  }
  totalSpSum += groupSp;
  totalTasksSum += groupTasks.length;
  
  const codes = groupTasks.map(t => t.code).join(', ');
  indexContent += `| **${grp.name}** | [${path.basename(grp.file)}](${path.basename(grp.file)}) | \`${codes}\` | ${groupTasks.length} | ${groupSp} SP |\n`;
}

indexContent += `| **TOTAL KESELURUHAN** | — | **54 Unit Eksekusi** | **${totalTasksSum} Task** | **${totalSpSum} SP (470 jam)** |\n\n`;
indexContent += `\n## Petunjuk Penggunaan untuk Monday.com
1. Buka file modul yang diinginkan di folder \`tasks/\`.
2. Sorot / blok teks pada subitem yang dituju (misal: \`[TEN-01-FE]\` atau \`[TEN-01-BE]\`).
3. Tekan \`Ctrl + C\`, lalu paste (\`Ctrl + V\`) ke kolom Update atau Monday Doc pada board Anda.
4. Tabel metadata di bagian atas akan otomatis ter-render rapi dan konsisten.
`;

fs.writeFileSync('tasks/INDEX.md', indexContent, 'utf8');
console.log('Created tasks/INDEX.md successfully! Total SP:', totalSpSum);
