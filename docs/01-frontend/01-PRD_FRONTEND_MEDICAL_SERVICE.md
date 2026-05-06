# PRD Frontend Medical Service

## 1. Identitas Dokumen

- Nama project: `medical_service`
- Area: frontend
- Tujuan fase: redesign dan standardisasi frontend
- Status: active draft
- Basis sistem lama: `D:\Project\Web\ems2`
- Acuan legacy utama: [ems2](</D:/Project/Web/ems2>)
- Dokumen terkait:
  - `02-backend/01-PRD_BACKEND_MEDICAL_SERVICE.md`
  - `03-integration/01-PRD_INTEGRATION_MEDICAL_SERVICE.md`
  - `04-testing/01-PRD_TESTING_MEDICAL_SERVICE.md`

## 1.1 Aturan Acuan Legacy

Sebelum membuat halaman, komponen, flow form, atau adapter data baru, AI/developer wajib meninjau project legacy di [ems2](</D:/Project/Web/ems2>) agar:

- perilaku bisnis lama tidak hilang
- field yang dipakai tetap kompatibel
- alur halaman lama bisa dipetakan ke halaman baru
- migrasi tidak menebak-nebak struktur data dan flow user

Aturan:

- legacy adalah acuan perilaku bisnis, bukan acuan struktur kode baru
- tampilan lama boleh diganti total
- nama field frontend baru boleh lebih bersih, tetapi mapping ke legacy wajib jelas

## 2. Ringkasan Eksekutif

Frontend `medical_service` adalah wajah baru dari EMS lama. Frontend ini tidak boleh memaksa perubahan besar di database atau proses save legacy. Tujuan utamanya adalah merapikan struktur UI, interaksi, dan komponen agar sistem:

- lebih konsisten
- lebih ringan dipakai
- lebih mudah dirawat
- mobile-friendly
- aman untuk migrasi bertahap

Frontend dibangun lebih dulu sebagai fondasi project baru. Backend menyesuaikan kebutuhan frontend melalui adapter layer, bukan sebaliknya.

## 3. Masalah yang Harus Diselesaikan

Masalah sistem lama yang menjadi alasan redesign frontend:

- halaman besar bercampur antara markup, script, dan perilaku business-specific
- komponen UI tidak seragam antar modul
- banyak pola input, modal, tabel, upload, dan feedback yang berbeda-beda
- autosave/draft sudah ada di beberapa halaman tetapi belum menjadi pola baku
- user experience pada tablet dan handphone belum menjadi standar utama
- reuse komponen belum cukup kuat untuk skala project yang kompleks

## 4. Tujuan Produk Frontend

Frontend baru harus:

- mempertahankan alur bisnis lama
- mengurangi keruwetan tampilan dan struktur komponen
- menstandarkan semua pola interaksi user
- siap diintegrasikan ke backend Laravel 13 adapter
- tetap cocok untuk shared hosting karena hasil frontend berupa asset build statis

## 5. Non-Goals

Frontend fase ini tidak bertujuan untuk:

- mengganti struktur SQL besar-besaran
- memindahkan semua modul sekaligus
- membuat mobile app native
- membuat chat realtime penuh di fase awal
- membuat SPA publik multi-tenant

## 6. Stack Final Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- TailAdmin Free React sebagai fondasi admin shell
- React Hook Form
- Zod
- TanStack Query
- TanStack Table
- Zustand persist
- localStorage untuk draft field umum
- localForage untuk draft file/gambar
- Sonner untuk toast kanan atas
- browser-image-compression untuk kompresi gambar client-side

## 7. Alasan Pemilihan Stack

### 7.1 React + TypeScript + Vite

Dipilih karena:

- umum, matang, dan mudah dicari referensinya
- cocok untuk UI kompleks dan form-heavy
- hasil build statis cocok untuk shared hosting
- TypeScript membantu menjaga konsistensi struktur data

### 7.2 Tailwind + TailAdmin

Dipilih karena:

- cepat dipakai untuk admin shell
- mudah dipecah menjadi design system internal
- lebih fleksibel untuk custom component dibanding layout yang terlalu opinionated

### 7.3 React Hook Form + Zod

Dipilih karena:

- cocok untuk form besar
- efisien dalam performa
- validasi mudah distandarkan
- mudah dipakai bersama draft persistence

### 7.4 TanStack Query + Table

Dipilih karena:

- mendukung model API-first
- memudahkan invalidation, caching, mutation, dan optimistic UI
- table bisa dibungkus ke komponen internal tanpa terkunci vendor tertentu

## 8. Constraint Wajib

### 8.1 Hosting

- target deploy adalah shared hosting
- tidak ada SSH
- tidak ada terminal
- tidak ada Node.js di server
- tidak ada build step di server

### 8.2 Arsitektur

- frontend harus dibuild di lokal atau CI
- hasil build harus siap langsung dipasang
- frontend tidak boleh memaksa backend mengubah database lama secara besar

### 8.3 Operasional

- aplikasi harus usable oleh user kantor
- desktop tetap prioritas utama operasional
- tablet dan handphone tetap wajib rapi dan usable

## 9. Aturan Desain Global

### 9.1 Aturan Layout

- desktop memakai shell sidebar + topbar + content
- tablet memakai shell adaptif yang tetap nyaman untuk form dan tabel
- mobile memakai navigasi dan layout yang disederhanakan tanpa merusak flow inti

### 9.2 Aturan Feedback

- semua aksi utama menampilkan toast kanan atas
- toast dipakai untuk success, error, warning, dan info
- validation error field tetap tampil di field terkait
- jangan pakai `alert()` browser native untuk flow utama

### 9.3 Aturan Form

- semua form penting memakai React Hook Form + Zod
- semua form besar memiliki autosave draft
- draft harus bisa dipulihkan otomatis
- draft hanya hilang jika user clear manual atau submit final sukses sesuai aturan modul

### 9.4 Aturan Table

- semua tabel penting memakai wrapper internal TanStack Table
- state search, sort, filter, pagination harus konsisten
- di layar kecil, tabel harus punya strategi khusus, bukan sekadar dipaksa mengecil

### 9.5 Arah Visual dan Warna

Logo acuan di [logo.png](</D:/Project/Web/medical_service/docs/logo.png>) memakai:

- simbol coral-merah terang
- wordmark hitam
- latar terang bersih

Keputusan desain resmi:

- UI tidak memakai merah sebagai warna dominan seluruh aplikasi
- UI memakai basis netral klinis dan modern
- coral-merah logo dipakai sebagai aksen terbatas untuk identitas brand, highlight penting, dan elemen pilihan

Palet rekomendasi:

- `bg`: `#F7F8FA`
- `surface`: `#FFFFFF`
- `text`: `#111827`
- `muted`: `#6B7280`
- `primary`: `#1F2937`
- `accentBrand`: `#FF4A43`
- `accentBrandSoft`: `#FFE9E7`
- `border`: `#E5E7EB`
- `success`: `#0F766E`
- `warning`: `#B45309`

Aturan visual:

- sidebar dan shell utama gunakan tone gelap netral, bukan merah
- tombol primary boleh memakai `primary`
- status penting, selected item, badge brand, dan hero accent boleh memakai `accentBrand`
- halaman harus tetap terasa klinis, rapi, dan profesional, bukan seperti ecommerce atau promo page
- jangan gunakan kombinasi merah pekat untuk area besar karena melelahkan secara visual

## 10. Realtime Final

- primary realtime: `SSE`
- fallback: `smart polling`
- future chat: `WebSocket adapter`

Aturan:

- future chat dikerjakan paling akhir
- realtime phase awal hanya untuk notifikasi, invalidasi data, activity ringan, dan update antar-user
- polling agresif bukan strategi utama

## 11. Draft Persistence Final

### 11.1 Yang disimpan di localStorage

- text
- number
- radio
- checkbox
- select
- textarea
- date
- state ringan lain yang aman

### 11.2 Yang disimpan di localForage

- file draft
- image draft
- preview blob yang dibutuhkan ulang

### 11.3 Aturan Draft

- setiap draft punya namespace modul
- jika edit record existing, draft harus punya key per record
- draft harus punya schema version
- draft harus punya timestamp pembaruan
- harus ada tombol clear draft

## 12. Upload dan Media

### 12.1 Tujuan

Upload harus:

- ringan
- cepat
- konsisten
- tidak membuat user kehilangan data

### 12.2 Aturan Kompresi

- gunakan `browser-image-compression` client-side
- target operasional umum: 200KB sampai 500KB
- dimensi jangan diperkecil terlalu agresif
- kualitas harus tetap layak dibaca dan di-zoom normal

### 12.3 Aturan UI Upload

- preview wajib ada
- validasi ukuran dan tipe file wajib ada
- status upload wajib jelas
- error upload wajib tampil jelas

## 13. Modul Prioritas Frontend

Urutan resmi:

1. auth dan app shell
2. dashboard dasar
3. rekam medis
4. EMS services
5. rekap farmasi
6. setting akun
7. secretary modules

Aturan:

- jangan kerjakan banyak modul berat paralel sebelum fondasi shared UI stabil
- modul pertama implementatif direkomendasikan `rekam medis`

## 14. Struktur Implementasi yang Diharapkan

Frontend harus dipisah minimal ke area:

- app shell
- routes
- shared ui
- shared forms
- shared tables
- shared upload
- shared realtime
- features
- api client
- state
- utilities

Komponen dari template admin tidak boleh dipakai mentah. Semua yang dipakai di aplikasi harus lewat wrapper internal project.

## 15. Definition of Done Frontend Phase Awal

Frontend phase awal dianggap selesai bila:

- app shell siap
- design system dasar siap
- toast global siap
- form engine dan draft persistence siap
- realtime client dasar siap
- fallback polling siap
- minimal satu modul prioritas selesai end-to-end
- lolos uji desktop, tablet, dan mobile dasar

## 16. Aturan Update Dokumen

Jika ada perubahan keputusan frontend:

- ubah PRD hanya jika keputusan final berubah
- perubahan kecil operasional masuk ke TODO atau PROGRESS
- semua perubahan arah stack harus dicatat juga di `04-HISTORY_FRONTEND_MEDICAL_SERVICE.md`

## 17. Hirarki Sumber Kebenaran

Urutan sumber kebenaran area frontend:

1. PRD frontend
2. HISTORY frontend
3. TODO frontend
4. PROGRESS frontend

Aturan:

- jika `TODO` bertentangan dengan `PRD`, ikuti `PRD`
- jika `PROGRESS` bertentangan dengan `PRD`, ikuti `PRD`
- jika keputusan berubah, update `HISTORY` dulu, lalu sesuaikan `PRD`, `TODO`, dan `PROGRESS`
