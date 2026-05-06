# History Backend Medical Service

## 1. Fungsi Dokumen

Histori resmi keputusan backend.

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
  - backend docs terlalu singkat untuk migrasi panjang
- Keputusan lama:
  - docs backend masih ringkas
- Keputusan baru:
  - PRD, TODO, PROGRESS, HISTORY backend dibuat detail
- Alasan:
  - mengurangi ambiguitas implementasi
- Consequences:
  - AI lain punya pedoman kerja yang lebih jelas
- File yang harus ikut diupdate:
  - seluruh file di `02-backend`

### 2026-05-02

- Status:
  - accepted
- Context:
  - shared hosting tidak mendukung fondasi realtime resident yang aman
- Keputusan lama:
  - realtime belum dikunci final
- Keputusan baru:
  - primary: SSE
  - fallback: smart polling
  - future chat: WebSocket adapter paling akhir
- Alasan:
  - shared hosting tidak cocok untuk fondasi resident realtime
- Consequences:
  - backend wajib punya SSE dan delta polling endpoint
- File yang harus ikut diupdate:
  - PRD backend
  - TODO backend
  - docs integration
  - docs testing
