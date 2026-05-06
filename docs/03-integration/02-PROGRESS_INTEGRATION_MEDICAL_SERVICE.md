# Progress Integration Medical Service

## 1. Fungsi Dokumen

Status resmi integrasi frontend-backend.

## 2. Status Global

- Status umum: in progress
- Implementasi integrasi: mock adapter frontend sudah jalan
- Prioritas aktif: mengganti adapter mock menjadi API backend nyata

## 3. Keputusan Final

- integrasi mengikuti urutan resmi di PRD integration
- realtime integrasi:
  - primary: SSE
  - fallback: smart polling
  - future chat: WebSocket adapter paling akhir
- contract dan mapping wajib merujuk ke [ems2](</D:/Project/Web/ems2>)

## 4. Tracker

- [x] PRD integration dibuat
- [x] TODO integration dibuat
- [x] HISTORY integration dibuat
- [x] struktur docs integration dirapikan
- [x] field mapping auth/session diringkas ke dokumen mapping inti
- [x] field mapping rekam medis diringkas ke dokumen mapping inti
- [x] response contract implementation pada mock adapter frontend
- [x] auth integration mock
- [x] lookup integration mock
- [x] realtime integration mock
- [x] first module integration mock

## 5. Blocker

- backend adapter Laravel belum dibootstrap
- endpoint SSE dan smart polling nyata belum tersedia
- endpoint list/detail/save rekam medis nyata belum tersedia

## 6. Update 2026-05-06

- frontend sekarang sudah punya adapter switch `mock`/`api` berbasis env
- auth, dashboard, lookup user, rekam medis, dan delta polling sudah punya jalur client menuju endpoint backend baru
- session bootstrap frontend sudah disiapkan agar sinkron dengan `GET /api/auth/session`
- realtime frontend sudah punya konektor `SSE` dan fallback `smart polling` pada level client
- EMS services, rekap farmasi, dan secretary juga sudah masuk ke jalur adapter frontend yang sama
- integrasi end-to-end tetap belum selesai karena backend nyata belum ada di workspace
