# History Frontend Medical Service

## 1. Fungsi Dokumen

Dokumen ini adalah histori resmi perubahan keputusan frontend. Jika ada perubahan arah, file ini wajib diupdate sebelum implementasi lanjut.

## 2. Format Catatan

Gunakan format:

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
  - struktur docs awal terlalu datar dan rawan ambigu
- Keputusan lama:
  - docs masih tersebar dan datar
- Keputusan baru:
  - docs frontend dipisah jadi PRD, PROGRESS, TODO, HISTORY
- Alasan:
  - memudahkan AI lain mengikuti alur kerja
- Consequences:
  - struktur docs frontend menjadi stabil
- File yang harus ikut diupdate:
  - seluruh file di `01-frontend`

### 2026-05-02

- Status:
  - accepted
- Context:
  - shared hosting membatasi pendekatan realtime resident
- Keputusan lama:
  - realtime sempat dipertimbangkan lebih luas
- Keputusan baru:
  - primary realtime: SSE
  - fallback: smart polling
  - future chat: WebSocket adapter paling akhir
- Alasan:
  - shared hosting tidak cocok untuk proses resident sebagai fondasi awal
- Consequences:
  - frontend harus punya abstraction realtime dan fallback
- File yang harus ikut diupdate:
  - PRD frontend
  - TODO frontend
  - docs integration
  - docs testing

### 2026-05-02

- Status:
  - accepted
- Context:
  - arah visual sebelumnya belum mengunci hubungan antara desain baru dan identitas logo rumah sakit
- Keputusan lama:
  - aturan desain global belum punya palet warna resmi yang mengacu ke logo
- Keputusan baru:
  - frontend memakai basis netral klinis dengan aksen coral-merah dari logo secara terbatas
- Alasan:
  - menjaga UI tetap profesional, ringan, dan tetap terkait dengan identitas visual brand
- Consequences:
  - shell, button, badge, dan accent state harus mengikuti palet resmi di PRD frontend
- File yang harus ikut diupdate:
  - `01-PRD_FRONTEND_MEDICAL_SERVICE.md`

### 2026-05-04

- Status:
  - accepted
- Context:
  - frontend perlu bisa dicek langsung sebelum backend adapter tersedia
- Keputusan lama:
  - frontend belum punya basis implementasi dan belum ada cara aman untuk menguji flow utama
- Keputusan baru:
  - fase awal frontend dibangun penuh dengan mock adapter lokal yang mengikuti kontrak integration dan audit legacy `ems2`
- Alasan:
  - mempercepat validasi shell, auth, dashboard, rekam medis, draft, upload, dan realtime abstraction tanpa menunggu backend
- Consequences:
  - frontend bisa diuji langsung lewat `npm run dev`, `npm run build`, dan `npm run test`
  - integrasi nyata berikutnya wajib mempertahankan field contract yang sudah dipakai frontend
- File yang harus ikut diupdate:
  - `02-PROGRESS_FRONTEND_MEDICAL_SERVICE.md`
  - `03-integration/02-PROGRESS_INTEGRATION_MEDICAL_SERVICE.md`
  - `04-testing/02-PROGRESS_TESTING_MEDICAL_SERVICE.md`
