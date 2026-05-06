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
