# TODO Frontend Medical Service

## 1. Aturan Eksekusi

- kerjakan berurutan
- jangan lompat ke modul berat sebelum shared foundation siap
- jika ada konflik keputusan, PRD menang atas TODO
- jika stack berubah, update HISTORY sebelum melanjutkan
- sebelum membuat halaman baru, audit dulu acuan legacy di [ems2](</D:/Project/Web/ems2>)
- semua perubahan style wajib dilakukan lewat `shared` atau component reusable; dilarang membuat style halaman ad hoc untuk pola yang seharusnya global

## 2. Phase 01 - Bootstrap Project

Tujuan:

- menyiapkan fondasi teknis frontend

Checklist:

- [x] inisialisasi React 19 + TypeScript + Vite
- [x] pasang Tailwind CSS 4
- [x] integrasikan TailAdmin Free React
- [x] rapikan struktur folder internal
- [x] buat alias import
- [x] buat env config
- [x] pastikan hasil build cocok untuk shared hosting

Selesai bila:

- project bisa dijalankan lokal
- build berhasil
- struktur awal tidak bergantung pada struktur mentah template

## 3. Phase 02 - App Shell

Checklist:

- [x] desktop shell
- [x] tablet shell
- [x] mobile shell
- [x] sidebar
- [x] topbar
- [x] breadcrumb
- [x] page header
- [x] route guard visual dasar

Selesai bila:

- user bisa login dan melihat shell dasar tanpa halaman rusak di desktop/tablet/mobile

## 4. Phase 03 - Design System Foundation

Checklist:

- [x] color tokens
- [x] spacing tokens
- [x] radius tokens
- [x] typography scale
- [x] shadow tokens
- [x] breakpoint rules
- [x] state style: hover, focus, disabled, error

## 5. Phase 04 - Shared Components

Checklist:

- [x] button
- [x] icon button
- [x] input
- [x] textarea
- [x] select
- [x] checkbox
- [x] radio
- [x] switch
- [x] date input
- [x] modal
- [x] drawer
- [x] card
- [x] badge
- [x] empty state
- [x] error state
- [x] skeleton
- [x] spinner

## 6. Phase 05 - Toast dan Feedback

Checklist:

- [x] pasang Sonner
- [x] buat wrapper internal
- [x] standardkan success/error/warning/info
- [x] integrasi dengan submit action
- [x] integrasi dengan realtime event

## 7. Phase 06 - Form Engine

Checklist:

- [x] React Hook Form base wrapper
- [x] Zod integration
- [x] field wrapper reusable
- [x] inline error reusable
- [x] required marker reusable
- [x] submit state reusable
- [x] clear draft action reusable

## 8. Phase 07 - Draft Persistence

Checklist:

- [x] localStorage untuk field umum
- [x] localForage untuk file/gambar
- [x] draft namespace per modul
- [x] draft key per record
- [x] schema versioning
- [x] timestamp draft
- [x] restore otomatis
- [x] clear draft manual

## 9. Phase 08 - Table System

Checklist:

- [x] TanStack Table wrapper
- [x] toolbar
- [x] search
- [x] filter
- [x] pagination
- [x] row action
- [x] mobile table strategy

## 10. Phase 09 - Upload System

Checklist:

- [x] uploader reusable
- [x] preview image
- [x] preview file
- [x] file validation
- [x] size validation
- [x] progress state
- [x] browser-image-compression
- [x] upload error state

## 11. Phase 10 - Realtime

Checklist:

- [x] realtime client abstraction
- [x] SSE connector
- [x] smart polling fallback
- [x] reconnect logic
- [x] tab visibility handling
- [x] query invalidation integration
- [x] toast integration

## 12. Phase 11 - Auth Module

Checklist:

- [x] login page
- [x] logout action
- [x] session bootstrap
- [x] session expired handling
- [x] unauthorized view/redirect

## 13. Phase 12 - Dashboard Dasar

Checklist:

- [x] summary cards
- [x] quick action area
- [x] base responsive grid
- [x] loading/error state

## 14. Phase 13 - Modul Prioritas

Urutan resmi:

1. rekam medis
2. EMS services
3. rekap farmasi
4. setting akun
5. secretary

Checklist setiap modul:

- [x] audit field
- [x] audit action
- [x] audit upload
- [x] audit draft behavior
- [x] buat list page
- [x] buat form page
- [x] integrasikan ke backend adapter
- [x] uji desktop
- [x] uji tablet
- [x] uji mobile

Catatan:

- integrasi frontend ke adapter backend sudah disiapkan lewat `appApi` dan env switch
- backend nyata Laravel belum ada di workspace ini, sehingga endpoint produksi masih menunggu implementasi backend

## 15. Definition of Done Frontend

- [x] phase 01 sampai 10 selesai
- [x] auth selesai
- [x] minimal satu modul prioritas selesai
- [x] lulus testing dasar
