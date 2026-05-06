# Progress Testing Medical Service

## 1. Fungsi Dokumen

Status resmi testing. File ini menunjukkan apa yang sudah diuji dan apa yang belum.

## 2. Status Global

- Status umum: in progress
- Implementasi testing: baseline frontend sudah dijalankan
- Prioritas aktif: menambah checklist manual responsive dan integrasi backend nanti

## 3. Tracker

- [x] PRD testing dibuat
- [x] TODO testing dibuat
- [x] HISTORY testing dibuat
- [x] struktur docs testing dirapikan
- [x] auth dan rekam medis case inti diringkas ke TODO testing
- [x] baseline perilaku legacy dari [ems2](</D:/Project/Web/ems2>) dicatat untuk modul pertama
- [x] auth checklist dijalankan secara mock
- [x] shell checklist dijalankan secara build run
- [x] form checklist dijalankan untuk validasi schema dan save flow mock
- [x] upload checklist dijalankan untuk preview/compression client-side mock
- [x] realtime checklist dijalankan pada abstraction mock
- [ ] responsive checklist dijalankan manual lintas device

## 4. Blocker

- belum ada backend nyata untuk uji integrasi
- belum ada bukti uji manual desktop/tablet/mobile yang terdokumentasi

## 5. Hasil Uji 2026-05-04

- `npm run test`: lulus
- `npm run build`: lulus
- Flow yang tervalidasi:
  - schema validasi rekam medis mewajibkan MRI untuk `forensic_private`
  - login mock menolak PIN invalid
  - list rekam medis mock tersedia dan dapat dimuat

## 6. Hasil Uji 2026-05-06

- `npm run lint`: lulus
- `npm run test`: lulus
- `npm run build`: lulus
- Flow yang tervalidasi:
  - adapter frontend tetap berjalan setelah pemindahan ke `appApi`
  - session bootstrap dan query auth tetap lolos build
  - realtime client frontend dengan jalur SSE dan delta polling lolos typecheck/build
  - modul tambahan frontend `EMS services`, `rekap farmasi`, dan `secretary` lolos lint/build pada jalur mock
