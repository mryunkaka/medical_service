# History Integration Medical Service

## 1. Fungsi Dokumen

Histori resmi keputusan integrasi frontend-backend.

## 2. Format Catatan

- Tanggal:
- Status:
- Context:
- Keputusan lama:
- Keputusan baru:
- Alasan:
- Consequences:
- File yang harus ikut diupdate:

## 3. Riwayat

### 2026-05-07

- Status:
  - accepted
- Context:
  - backend lokal sudah tervalidasi terhadap DB legacy nyata dan frontend mode API sudah bisa dipakai, tetapi beberapa item checklist integrasi masih belum ditutup formal
- Keputusan lama:
  - progress integration masih menyatakan backend nyata belum ada dan checklist auth/lookup/realtime/module pertama belum selesai penuh
- Keputusan baru:
  - integrasi lokal dinyatakan menyelesaikan core phase `03-integration`
  - modul pertama yang dianggap selesai end-to-end adalah rekam medis
  - upload frontend-backend resmi memakai multipart `FormData`
  - lookup dokter dan asisten dinaikkan ke autocomplete berbasis query backend
  - session expired handling dipaksa clear session, clear query cache, toast warning, dan redirect ke login
  - realtime delta memakai payload invalidation yang sama dengan SSE event
  - regression test integrasi ditopang oleh feature test schema legacy, frontend test draft failure, dan QA browser session nyata
- Alasan:
  - menyelaraskan dokumen dengan implementasi dan validasi terbaru
- Consequences:
  - fokus berikutnya bergeser dari core integration ke hardening lintas modul non-prioritas dan kebutuhan deploy/hosting
- File yang harus ikut diupdate:
  - `02-PROGRESS_INTEGRATION_MEDICAL_SERVICE.md`
  - `03-TODO_INTEGRATION_MEDICAL_SERVICE.md`
  - `docs/02-backend/*` terkait status backend
  - `frontend/.env`
  - `frontend/src/api/client/form-data.ts`
  - `frontend/src/api/client/backend-api.ts`
  - `frontend/src/api/client/http-client.ts`
  - `frontend/src/shared/forms/autocomplete.tsx`
  - `frontend/src/realtime/client/realtime-client.ts`
  - `frontend/src/realtime/handlers/use-realtime-bridge.ts`
  - `frontend/src/app/providers.tsx`
  - `frontend/src/features/medical-records/components/medical-record-form.tsx`

### 2026-05-02

- Status:
  - accepted
- Context:
  - tanpa docs integration, kontrak data mudah tercecer
- Keputusan lama:
  - integrasi belum dipisahkan jelas dari docs umum
- Keputusan baru:
  - docs integrasi dipisah jadi PRD, PROGRESS, TODO, HISTORY
- Alasan:
  - memudahkan handoff AI
- Consequences:
  - kontrak integrasi lebih mudah ditelusuri
- File yang harus ikut diupdate:
  - seluruh file di `03-integration`

### 2026-05-02

- Status:
  - accepted
- Context:
  - integrasi harus cocok dengan shared hosting dan migration-first
- Keputusan lama:
  - pola realtime belum final
- Keputusan baru:
  - primary: SSE
  - fallback: smart polling
  - future chat: WebSocket adapter paling akhir
- Alasan:
  - shared hosting constraint
- Consequences:
  - integrasi harus mendukung dua jalur realtime awal: SSE dan fallback delta polling
- File yang harus ikut diupdate:
  - PRD integration
  - TODO integration
  - docs frontend
  - docs backend

### 2026-05-02

- Status:
  - accepted
- Context:
  - detail mapping mulai terlalu tersebar ke file tambahan dan berisiko membuat handoff AI makin bercabang
- Keputusan lama:
  - auth mapping dan rekam medis mapping sempat dipisah ke file detail terpisah
- Keputusan baru:
  - detail penting dikonsolidasikan kembali ke `05-DATA_CONTRACT_AND_FIELD_MAPPING_MEDICAL_SERVICE.md`
- Alasan:
  - menjaga jumlah markdown tetap ramping tanpa kehilangan kontrak inti
- Consequences:
  - semua mapping inti sekarang dicari di satu file utama integration
- File yang harus ikut diupdate:
  - `05-DATA_CONTRACT_AND_FIELD_MAPPING_MEDICAL_SERVICE.md`
  - `02-PROGRESS_INTEGRATION_MEDICAL_SERVICE.md`
  - `03-TODO_INTEGRATION_MEDICAL_SERVICE.md`
