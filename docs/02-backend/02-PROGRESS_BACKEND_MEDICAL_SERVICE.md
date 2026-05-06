# Progress Backend Medical Service

## 1. Fungsi Dokumen

Status resmi backend. AI lain harus membaca file ini sebelum mengubah area backend.

## 2. Status Global

- Status umum: validated on real legacy DB
- Phase aktif: hardening akhir backend + integrasi frontend `apiMode=api`
- Prioritas aktif: tidak ada blocker teknis lokal, fokus berikutnya opsional ke deploy/hosting hardening
- Tanggal update terakhir: 2026-05-06

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
- [x] bootstrap Laravel project
- [x] response contract
- [x] auth/session foundation
- [x] validation foundation
- [x] upload foundation
- [x] realtime foundation
- [x] modul backend pertama

## 5. Modul Tracker

- auth/session: foundation selesai
- lookup umum: foundation selesai
- rekam medis: list/detail/save/update/delete adapter selesai
- EMS services: list/save adapter awal selesai
- rekap farmasi: list/save adapter awal selesai
- setting akun: endpoint khusus `GET /api/account/settings` selesai
- secretary: read payload + save file record adapter selesai dan tervalidasi pada DB nyata

## 6. Blocker

- tidak ada blocker teknis lokal untuk integrasi backend-frontend
- upload backend saat ini menerima file nyata atau metadata asset frontend, tetapi kompresi server-side belum diaktifkan
- test otomatis backend masih dasar, belum mencakup integrasi DB legacy nyata

## 7. Implementasi Nyata Saat Ini

- Laravel 13 dibootstrap di folder [backend](</D:/Project/Web/medical_service/backend>)
- route backend dipisah ke `web.php`, `api.php`, `auth.php`, `realtime.php`
- response contract standar tersedia di [ApiResponse.php](</D:/Project/Web/medical_service/backend/app/Support/Http/ApiResponse.php>)
- auth/session legacy tersedia:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `GET /api/auth/session`
  - `GET /api/auth/status`
- account settings tersedia:
  - `GET /api/account/settings`
- lookup umum tersedia:
  - `GET /api/lookups/users`
  - `GET /api/lookups/medical-users`
- realtime foundation tersedia:
  - `GET /api/realtime/stream`
  - `GET /api/realtime/delta`
- dashboard adapter tersedia:
  - `GET /api/dashboard`
- rekam medis adapter tersedia:
  - `GET /api/medical-records`
  - `GET /api/medical-records/{id}`
  - `POST /api/medical-records`
  - `PUT /api/medical-records/{id}`
  - `DELETE /api/medical-records/{id}`
- EMS services adapter awal tersedia:
  - `GET /api/ems-services`
  - `POST /api/ems-services`
- rekap farmasi adapter awal tersedia:
  - `GET /api/pharmacy-recap`
  - `POST /api/pharmacy-recap`
- secretary adapter awal tersedia:
  - `GET /api/secretary`
  - `POST /api/secretary/file-records`

## 8. Verifikasi

- `composer dump-autoload` lulus
- `php artisan route:list` lulus
- `php artisan test` lulus
- koneksi DB nyata tervalidasi pada database `farmasi_ems`
- frontend `VITE_API_MODE=api` tervalidasi
- login, list, add, edit, delete rekam medis tervalidasi end-to-end
- endpoint `secretary` tervalidasi setelah penyesuaian schema real

## 9. Aturan Update

Wajib update:

- phase aktif
- pekerjaan selesai
- file/folder berubah
- blocker
- keputusan baru
- next step
