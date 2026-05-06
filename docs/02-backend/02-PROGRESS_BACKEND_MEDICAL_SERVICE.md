# Progress Backend Medical Service

## 1. Fungsi Dokumen

Status resmi backend. AI lain harus membaca file ini sebelum mengubah area backend.

## 2. Status Global

- Status umum: planning
- Phase aktif: belum ada implementasi
- Prioritas aktif: menyiapkan struktur backend adapter
- Tanggal update terakhir: 2026-05-02

## 3. Keputusan Final Saat Ini

- backend adalah adapter layer
- database lama tetap source of truth
- response standar wajib dipakai lintas modul
- realtime backend:
  - primary: SSE
  - fallback: smart polling
  - future chat: WebSocket adapter paling akhir
- query, save flow, dan aturan bisnis lama wajib dicek di [ems2](</D:/Project/Web/ems2>)

## 4. Tracker High-Level

- [x] PRD backend dibuat
- [x] TODO backend dibuat
- [x] HISTORY backend dibuat
- [x] struktur docs backend dirapikan
- [ ] bootstrap Laravel project
- [ ] response contract
- [ ] auth/session foundation
- [ ] validation foundation
- [ ] upload foundation
- [ ] realtime foundation
- [ ] modul backend pertama

## 5. Modul Tracker

- auth/session: belum mulai
- lookup umum: belum mulai
- rekam medis: belum mulai
- EMS services: belum mulai
- rekap farmasi: belum mulai
- setting akun: belum mulai
- secretary: belum mulai

## 6. Blocker

- project Laravel belum dibootstrap
- belum ada struktur implementasi nyata
- belum ada mapping endpoint lama ke endpoint baru

## 7. Aturan Update

Wajib update:

- phase aktif
- pekerjaan selesai
- file/folder berubah
- blocker
- keputusan baru
- next step
