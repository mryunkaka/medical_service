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

### 2026-05-06

- Status:
  - accepted
- Context:
  - masih ada tiga sisa pekerjaan backend sebelum integrasi bisa dianggap siap: feature test schema legacy, fallback compression server-side, dan sinkronisasi multipart upload frontend
- Keputusan lama:
  - backend sudah hidup pada DB nyata, tetapi upload produksi dan regression coverage belum ditutup
- Keputusan baru:
  - feature test backend dipindahkan ke schema legacy nyata pada jalur rekam medis dan secretary
  - test DB otomatis fallback ke MySQL lokal jika `pdo_sqlite` tidak tersedia
  - upload frontend mode API resmi memakai `FormData` multipart
  - update multipart memakai `_method=PUT` agar aman di jalur PHP/Laravel shared hosting
  - backend upload menambahkan resize/compression server-side berbasis GD bila tersedia
- Alasan:
  - memastikan jalur produksi upload dan test regresi sesuai kondisi server lokal yang nyata
- Consequences:
  - backend sekarang punya coverage lebih relevan terhadap tabel/kolom legacy
  - frontend tidak lagi bergantung pada JSON-only untuk form yang punya file
  - integrasi siap dinaikkan ke fase `03-integration`
- File yang harus ikut diupdate:
  - `backend/app/Uploads/Processors/ImageUploadService.php`
  - `backend/app/Domain/MedicalRecords/Services/MedicalRecordService.php`
  - `backend/app/Support/Legacy/LegacySchema.php`
  - `backend/tests/Concerns/CreatesLegacySchema.php`
  - `backend/tests/Feature/MedicalRecords/MedicalRecordApiLegacySchemaTest.php`
  - `backend/tests/Feature/Secretary/SecretaryApiLegacySchemaTest.php`
  - `frontend/src/api/client/form-data.ts`
  - `frontend/src/api/client/http-client.ts`
  - `frontend/src/api/client/backend-api.ts`
  - `frontend/src/hooks/use-upload-field.ts`
  - `frontend/src/hooks/use-draft-form.ts`
  - `docs/02-backend/02-PROGRESS_BACKEND_MEDICAL_SERVICE.md`
  - `docs/02-backend/03-TODO_BACKEND_MEDICAL_SERVICE.md`

- Status:
  - accepted
- Context:
  - integrasi lokal sempat belum final karena frontend `apiMode=api` belum tervalidasi penuh pada DB nyata, endpoint `secretary` gagal pada schema real, dan account settings masih hidup dari mock payload
- Keputusan lama:
  - validasi backend masih sebatas bootstrap, route, dan test dasar
- Keputusan baru:
  - koneksi DB nyata `farmasi_ems` divalidasi langsung dari runtime Laravel
  - CORS, CSRF API, dan kontrak login disesuaikan agar session browser Laravel berjalan dari frontend `localhost:5173`
  - endpoint `secretary` diperbaiki agar join ke `user_rh` sesuai kolom real `pic_user_id` dan `host_user_id`
  - endpoint `GET /api/account/settings` ditambahkan untuk menutup gap modul setting akun
  - frontend `apiMode=api` divalidasi end-to-end untuk login, list, add, edit, delete rekam medis
- Alasan:
  - memastikan backend bukan hanya siap secara struktur, tetapi benar-benar operasional terhadap schema legacy tanpa modifikasi SQL
- Consequences:
  - backend sekarang bisa dipakai sebagai adapter lokal nyata untuk frontend
  - sisa TODO backend tinggal hardening non-blocking seperti feature test schema nyata, multipart upload production, dan compression server-side
- File yang harus ikut diupdate:
  - `docs/02-backend/02-PROGRESS_BACKEND_MEDICAL_SERVICE.md`
  - `docs/02-backend/03-TODO_BACKEND_MEDICAL_SERVICE.md`
  - `backend/routes/api.php`
  - `backend/app/Http/Controllers/Api/SecretaryController.php`
  - `backend/app/Http/Controllers/Api/AccountSettingsController.php`
  - `frontend/.env`
  - `frontend/src/state/session-store.ts`
  - `frontend/src/routes/route-guard.tsx`
  - `frontend/src/shared/tables/data-table.tsx`
  - `frontend/src/pages/medical-records-page.tsx`

- Status:
  - accepted
- Context:
  - backend belum ada implementasi nyata, sementara frontend sudah punya kontrak endpoint
- Keputusan lama:
  - backend masih planning-only dan belum ada struktur Laravel
- Keputusan baru:
  - backend dibootstrap dengan Laravel 13 di folder `backend`
  - session auth legacy dibuat manual tanpa memaksa migrasi auth Laravel bawaan
  - route dipisah ke `web.php`, `api.php`, `auth.php`, dan `realtime.php`
  - response kontrak backend diseragamkan ke `success/message/data/errors/meta`
  - realtime memakai SSE + delta polling sederhana berbasis cache
  - modul awal yang dihidupkan: auth, dashboard, lookup, rekam medis, EMS services, rekap farmasi, secretary
- Alasan:
  - mempercepat handoff frontend ke backend tanpa mengubah SQL legacy
  - menjaga flow lama tetap dekat dengan `ems2`
  - menghindari ketergantungan pada migration/schema baru
- Consequences:
  - `.env` backend diarahkan ke MySQL legacy
  - session/cache/queue dipindah ke mode file/sync agar aman untuk shared hosting
  - backend siap dikoneksikan ke frontend `apiMode=api`
- File yang harus ikut diupdate:
  - `docs/02-backend/02-PROGRESS_BACKEND_MEDICAL_SERVICE.md`
  - `docs/02-backend/03-TODO_BACKEND_MEDICAL_SERVICE.md`
  - `backend/`

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
