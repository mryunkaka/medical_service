# History Testing Medical Service

## 1. Fungsi Dokumen

Histori resmi perubahan strategi testing.

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
  - testing butuh jalur sendiri agar tidak tenggelam di docs implementasi
- Keputusan lama:
  - testing belum dipisah jelas
- Keputusan baru:
  - testing dipisah ke PRD, PROGRESS, TODO, HISTORY
- Alasan:
  - memudahkan uji per flow
- Consequences:
  - AI lain tahu titik uji apa yang wajib dijalankan
- File yang harus ikut diupdate:
  - seluruh file di `04-testing`

### 2026-05-02

- Status:
  - accepted
- Context:
  - realtime bisa berbeda perilaku tergantung hosting
- Keputusan lama:
  - realtime testing belum final
- Keputusan baru:
  - realtime testing wajib mencakup SSE dan smart polling fallback
- Alasan:
  - shared hosting bisa membatasi streaming
- Consequences:
  - testing tidak boleh mengandalkan satu jalur realtime saja
- File yang harus ikut diupdate:
  - PRD testing
  - TODO testing

### 2026-05-02

- Status:
  - accepted
- Context:
  - test case auth rinci sempat dipisah ke file tambahan dan jumlah markdown mulai bertambah terlalu cepat
- Keputusan lama:
  - detail auth testing berada di file test case terpisah
- Keputusan baru:
  - case inti auth dan rekam medis diringkas ke `03-TODO_TESTING_MEDICAL_SERVICE.md`
- Alasan:
  - menjaga struktur docs tetap padat dan mudah dibaca AI lain
- Consequences:
  - `TODO testing` sekarang menjadi acuan operasional utama untuk eksekusi test case inti
- File yang harus ikut diupdate:
  - `03-TODO_TESTING_MEDICAL_SERVICE.md`
  - `02-PROGRESS_TESTING_MEDICAL_SERVICE.md`

### 2026-05-04

- Status:
  - accepted
- Context:
  - frontend awal sudah dapat dijalankan sebelum backend nyata tersedia
- Keputusan lama:
  - testing menunggu implementasi penuh frontend/backend
- Keputusan baru:
  - baseline testing dimulai dari build produksi dan unit test pada mock adapter frontend
- Alasan:
  - memastikan fondasi frontend tidak berhenti di level visual saja
- Consequences:
  - hasil `npm run test` dan `npm run build` menjadi bukti uji minimum fase frontend awal
- File yang harus ikut diupdate:
  - `02-PROGRESS_TESTING_MEDICAL_SERVICE.md`
