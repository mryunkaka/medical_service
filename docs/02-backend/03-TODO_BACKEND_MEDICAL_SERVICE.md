# TODO Backend Medical Service

## 1. Aturan Eksekusi

- backend mengikuti kebutuhan frontend
- jangan migrasi banyak modul sekaligus
- jika ada konflik, PRD backend menang atas TODO backend
- jika pola integrasi berubah, update HISTORY
- sebelum membuat adapter backend baru, audit dulu acuan legacy di [ems2](</D:/Project/Web/ems2>)

## 2. Phase 01 - Bootstrap Laravel

Checklist:

- [x] buat project Laravel 13
- [x] konfigurasi `.env`
- [x] koneksi database lama
- [x] konfigurasi logging
- [x] struktur route web/api
- [x] bootstrap auth dasar

## 3. Phase 02 - Response Contract

Checklist:

- [x] success response helper
- [x] error response helper
- [x] validation error response helper
- [x] pagination response helper
- [x] message convention
- [x] meta.toastType convention

## 4. Phase 03 - Auth dan Authorization

Checklist:

- [x] login endpoint
- [x] logout endpoint
- [x] current user endpoint
- [x] session check endpoint
- [x] role/division/position guard
- [x] unauthorized response pattern

## 5. Phase 04 - Validation dan Service Layer

Checklist:

- [x] form request pattern
- [x] service layer pattern
- [x] query/repository layer pattern
- [x] transaction helper
- [x] business rule exception pattern

## 6. Phase 05 - Upload Foundation

Checklist:

- [x] file validator
- [x] image validator
- [x] naming strategy
- [x] storage path strategy
- [x] file response contract
- [x] fallback server-side compression jika perlu

## 7. Phase 06 - Realtime Foundation

Checklist:

- [x] SSE stream endpoint
- [x] auth strategy untuk stream
- [x] heartbeat/keepalive
- [x] publisher service
- [x] delta endpoint untuk smart polling
- [x] event payload schema

## 8. Phase 07 - Shared Lookup

Checklist:

- [x] generic lookup option pattern
- [x] autocomplete pattern
- [x] filter source pattern

## 9. Phase 08 - Modul Prioritas

Urutan:

1. rekam medis
2. EMS services
3. rekap farmasi
4. setting akun
5. secretary

Checklist per modul:

- [x] audit query lama
- [x] audit field save
- [x] audit response kebutuhan frontend
- [x] buat list endpoint
- [x] buat detail endpoint
- [x] buat save endpoint
- [x] buat realtime event publish

## 10. Definition of Done Backend

- [x] phase 01 sampai 07 selesai
- [x] minimal satu modul prioritas stabil
- [x] realtime dan fallback polling siap
- [x] lulus testing dasar

## 11. Sisa Pekerjaan Nyata Setelah Bootstrap

- [x] verifikasi koneksi MySQL legacy pada environment target lokal
- [x] tambahkan endpoint account settings khusus selain session user
- [x] tambah feature test yang benar-benar memakai schema legacy
- [x] tambahkan compression / resize server-side bila shared hosting membutuhkan
- [x] sinkronkan upload frontend ke multipart bila mode API produksi diaktifkan penuh
