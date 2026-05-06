# PRD Backend Medical Service

## 1. Identitas Dokumen

- Nama project: `medical_service`
- Area: backend
- Tujuan fase: membangun adapter backend di atas sistem legacy
- Status: active draft
- Basis sistem lama: `D:\Project\Web\ems2`
- Acuan legacy utama: [ems2](</D:/Project/Web/ems2>)

## 1.1 Aturan Acuan Legacy

Sebelum membuat endpoint, query, service, request validation, atau adapter backend baru, AI/developer wajib memeriksa project legacy di [ems2](</D:/Project/Web/ems2>) untuk memahami:

- query lama yang sudah berjalan
- nama tabel dan kolom existing
- alur save/update lama
- validasi dan aturan bisnis yang sudah dipakai operasional

Aturan:

- backend baru boleh merapikan struktur kode
- backend baru tidak boleh mengasumsikan ulang perilaku bisnis tanpa mengecek legacy

## 2. Ringkasan Eksekutif

Backend `medical_service` dibangun dengan Laravel 13 sebagai adapter layer. Backend ini bukan rewrite total, tetapi fondasi resmi baru untuk:

- auth
- authorization
- validation
- API response standar
- upload
- realtime ringan

Backend harus memelihara kompatibilitas dengan database lama dan alur save lama, sambil memberi struktur yang rapi untuk frontend baru.

## 3. Tujuan Backend

Backend harus:

- menjadi gateway resmi frontend baru
- mengurangi ketergantungan pada file procedural lama
- membungkus logic lama secara bertahap
- menjaga performa save tetap aman
- tetap realistis untuk shared hosting

## 4. Non-Goals

Backend fase ini tidak bertujuan untuk:

- memigrasikan semua query ke Eloquent
- mendesain ulang seluruh skema database
- memecah sistem menjadi microservices
- memaksa websocket resident server sebagai fondasi awal

## 5. Stack Final Backend

- Laravel 13
- PHP 8.4
- database lama existing
- session-based auth
- Query Builder
- raw SQL untuk query legacy kompleks
- Eloquent selektif untuk area yang cocok
- logging berbasis file

## 6. Constraint Wajib

- shared hosting
- tanpa SSH
- tanpa daemon resident
- tanpa Node.js di server
- tanpa requirement worker resident sebagai fondasi

## 7. Prinsip Arsitektur Backend

- database lama tetap source of truth
- backend baru membungkus, bukan merusak
- controller harus tipis
- service memegang orchestration
- query kompleks tidak boleh berserakan di controller
- response harus seragam di semua modul

## 8. Kontrak Respons Standar

Semua endpoint baru harus mengarah ke pola:

- `success`
- `message`
- `data`
- `errors`
- `meta`

Tambahan:

- `message` harus siap dipakai untuk toast frontend
- `meta.toastType` dipakai bila relevan
- validation error harus dapat dipetakan ke field frontend

## 9. Realtime Final Backend

- primary realtime: `SSE`
- fallback: `smart polling`
- future chat: `WebSocket adapter`

Aturan:

- WebSocket tidak dipakai di phase awal
- chat tidak boleh masuk sebelum migrasi inti selesai
- fallback polling harus memakai delta, bukan reload penuh

## 10. Peran Backend Per Domain

### 10.1 Auth

- login
- logout
- current user
- session status
- unauthorized handling

### 10.2 Shared Lookup

- option list
- autocomplete
- filter source

### 10.3 Transactional Module

- list
- detail
- create
- update
- delete bila diizinkan
- approval/reject flow bila ada

### 10.4 Upload

- validasi tipe
- validasi ukuran
- path generation
- server-side fallback bila perlu

## 11. Strategi Query

Gunakan:

- Query Builder untuk query normal dan fleksibel
- raw SQL untuk query lama kompleks yang sudah benar
- Eloquent hanya bila benar-benar memberi nilai dan tidak menambah kerumitan

Aturan:

- jangan memaksakan ORM pada query legacy kompleks
- semua query penting harus ditempatkan di layer yang konsisten

## 12. Strategi Upload

Aturan upload backend:

- backend wajib memvalidasi ulang file
- backend tidak mengasumsikan frontend selalu mengirim file ideal
- upload harus aman untuk shared hosting
- server-side fallback compression boleh dipakai bila diperlukan

## 13. Modul Prioritas Backend

Urutan resmi:

1. auth dan session
2. lookup umum
3. rekam medis
4. EMS services
5. rekap farmasi
6. setting akun
7. secretary

## 14. Definition of Done Backend Phase Awal

Backend phase awal dianggap selesai bila:

- Laravel bootstrap siap
- auth/session siap
- response contract standar siap
- validation pattern siap
- upload foundation siap
- realtime SSE siap
- fallback smart polling siap
- minimal satu modul prioritas stabil

## 15. Aturan Update Dokumen

- perubahan keputusan final update PRD
- perubahan kerja harian update PROGRESS
- perubahan urutan implementasi update TODO
- perubahan arah stack atau keputusan besar update HISTORY

## 16. Hirarki Sumber Kebenaran

Urutan sumber kebenaran area backend:

1. PRD backend
2. HISTORY backend
3. TODO backend
4. PROGRESS backend

Aturan:

- `PRD` menentukan arah akhir backend
- `HISTORY` mencatat perubahan dan alasannya
- `TODO` memecah pekerjaan ke phase implementasi
- `PROGRESS` hanya merekam status nyata, bukan mengubah arah
