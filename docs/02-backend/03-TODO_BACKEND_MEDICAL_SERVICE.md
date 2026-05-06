# TODO Backend Medical Service

## 1. Aturan Eksekusi

- backend mengikuti kebutuhan frontend
- jangan migrasi banyak modul sekaligus
- jika ada konflik, PRD backend menang atas TODO backend
- jika pola integrasi berubah, update HISTORY
- sebelum membuat adapter backend baru, audit dulu acuan legacy di [ems2](</D:/Project/Web/ems2>)

## 2. Phase 01 - Bootstrap Laravel

Checklist:

- [ ] buat project Laravel 13
- [ ] konfigurasi `.env`
- [ ] koneksi database lama
- [ ] konfigurasi logging
- [ ] struktur route web/api
- [ ] bootstrap auth dasar

## 3. Phase 02 - Response Contract

Checklist:

- [ ] success response helper
- [ ] error response helper
- [ ] validation error response helper
- [ ] pagination response helper
- [ ] message convention
- [ ] meta.toastType convention

## 4. Phase 03 - Auth dan Authorization

Checklist:

- [ ] login endpoint
- [ ] logout endpoint
- [ ] current user endpoint
- [ ] session check endpoint
- [ ] role/division/position guard
- [ ] unauthorized response pattern

## 5. Phase 04 - Validation dan Service Layer

Checklist:

- [ ] form request pattern
- [ ] service layer pattern
- [ ] query/repository layer pattern
- [ ] transaction helper
- [ ] business rule exception pattern

## 6. Phase 05 - Upload Foundation

Checklist:

- [ ] file validator
- [ ] image validator
- [ ] naming strategy
- [ ] storage path strategy
- [ ] file response contract
- [ ] fallback server-side compression jika perlu

## 7. Phase 06 - Realtime Foundation

Checklist:

- [ ] SSE stream endpoint
- [ ] auth strategy untuk stream
- [ ] heartbeat/keepalive
- [ ] publisher service
- [ ] delta endpoint untuk smart polling
- [ ] event payload schema

## 8. Phase 07 - Shared Lookup

Checklist:

- [ ] generic lookup option pattern
- [ ] autocomplete pattern
- [ ] filter source pattern

## 9. Phase 08 - Modul Prioritas

Urutan:

1. rekam medis
2. EMS services
3. rekap farmasi
4. setting akun
5. secretary

Checklist per modul:

- [ ] audit query lama
- [ ] audit field save
- [ ] audit response kebutuhan frontend
- [ ] buat list endpoint
- [ ] buat detail endpoint
- [ ] buat save endpoint
- [ ] buat realtime event publish

## 10. Definition of Done Backend

- [ ] phase 01 sampai 07 selesai
- [ ] minimal satu modul prioritas stabil
- [ ] realtime dan fallback polling siap
- [ ] lulus testing dasar
