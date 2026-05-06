# Project Structure Frontend Medical Service

## 1. Tujuan Dokumen

Dokumen ini adalah struktur resmi frontend yang harus diikuti sejak awal implementasi sampai akhir migrasi. Tujuannya agar:

- struktur folder konsisten
- AI atau developer lain tidak membuat struktur sendiri-sendiri
- komponen shared tidak bercampur dengan feature-specific code
- modul dapat dimigrasikan bertahap tanpa mengacaukan fondasi

## 1.1 Acuan Legacy Sebelum Implementasi

Setiap implementasi halaman atau feature baru wajib memeriksa project legacy di [ems2](</D:/Project/Web/ems2>) terlebih dahulu.

Minimal yang harus dicek:

- halaman lama yang setara
- field input lama
- aksi save/list/detail lama
- perilaku interaksi user yang penting

## 2. Prinsip Struktur

- pisahkan `shared` dari `features`
- pisahkan `layout/shell` dari `screen/page`
- pisahkan `API client` dari `UI`
- pisahkan `realtime` dari `data fetching`
- semua komponen reusable harus punya rumah yang jelas
- semua kode dari template pihak ketiga harus diserap dan dibungkus ke struktur internal project

## 3. Root Frontend yang Direkomendasikan

Contoh struktur level atas:

```text
medical_service/
  frontend/
    public/
    src/
    package.json
    tsconfig.json
    vite.config.ts
    tailwind.config.ts
    postcss.config.js
    .env
    .env.example
```

## 4. Struktur `src/` Resmi

```text
src/
  app/
  routes/
  layouts/
  pages/
  features/
  shared/
  api/
  state/
  realtime/
  hooks/
  lib/
  styles/
  types/
  constants/
  assets/
  tests/
```

## 5. Penjelasan Tiap Folder

### 5.1 `app/`

Isi:

- bootstrap app
- provider global
- router provider
- query provider
- theme provider
- toast provider
- auth/session bootstrap

Aturan:

- jangan taruh feature logic berat di sini
- hanya inisialisasi tingkat aplikasi

### 5.2 `routes/`

Isi:

- definisi route
- route guard
- route metadata
- route grouping

Aturan:

- route declaration jangan dicampur dengan implementasi page
- path route harus konsisten dengan domain bisnis

### 5.3 `layouts/`

Isi:

- app shell
- auth layout
- dashboard layout
- responsive layout helpers

Aturan:

- layout hanya mengatur frame dan struktur
- jangan taruh business logic modul di layout

### 5.4 `pages/`

Isi:

- page-level container
- route entry pages

Aturan:

- `pages/` hanya menjadi entry page
- logic berat dipecah ke `features/`

### 5.5 `features/`

Isi:

- module-specific UI
- module-specific hooks
- module-specific schema
- module-specific API binding
- module-specific types

Contoh:

```text
features/
  auth/
  dashboard/
  medical-records/
  ems-services/
  pharmacy-recap/
  account-settings/
  secretary/
```

Aturan:

- satu feature mewakili satu domain bisnis
- shared component tidak boleh lahir di feature lalu dipakai global tanpa dipindah ke `shared/`

### 5.6 `shared/`

Isi:

- reusable UI
- reusable form
- reusable table
- reusable upload
- reusable feedback

Contoh:

```text
shared/
  ui/
  forms/
  tables/
  upload/
  feedback/
  navigation/
  data-display/
```

Aturan:

- jika dipakai lebih dari satu feature dan sudah stabil, pindah ke `shared/`
- jangan taruh logic bisnis spesifik divisi/modul di `shared/`

### 5.7 `api/`

Isi:

- HTTP client
- request helpers
- response parser
- auth-aware fetch wrapper
- query key helpers

Aturan:

- `api/` tidak boleh berisi komponen UI
- jangan panggil `fetch` langsung tersebar di page/feature bila sudah ada wrapper resmi

### 5.8 `state/`

Isi:

- global state ringan
- draft persistence
- app preferences

Aturan:

- gunakan hanya untuk state global yang benar-benar lintas feature
- state khusus modul taruh di feature jika tidak dipakai global

### 5.9 `realtime/`

Isi:

- abstraction realtime client
- SSE client
- smart polling fallback
- event parser
- reconnect strategy
- realtime bridge ke TanStack Query dan Sonner

Aturan:

- code realtime tidak boleh tersebar di banyak feature tanpa wrapper
- semua feature konsumsi realtime lewat abstraction yang sama

### 5.10 `hooks/`

Isi:

- shared custom hooks lintas feature

Aturan:

- hook yang sangat spesifik modul taruh di feature masing-masing

### 5.11 `lib/`

Isi:

- helper murni
- utility murni
- formatter
- parser

Aturan:

- `lib/` tidak boleh berisi stateful service UI
- hanya utility yang bisa diuji dan dipakai ulang

### 5.12 `styles/`

Isi:

- entry css
- tokens binding
- layer utility tambahan

### 5.13 `types/`

Isi:

- shared types global
- response envelope type
- pagination type
- common option type

### 5.14 `constants/`

Isi:

- shared enums
- constant route names
- toast keys
- realtime event names

### 5.15 `assets/`

Isi:

- static images
- icons tambahan
- local mock illustrations bila dibutuhkan

### 5.16 `tests/`

Isi:

- frontend-level unit/integration tests bila nanti ditambahkan

## 6. Struktur Shared yang Direkomendasikan

```text
shared/
  ui/
    button/
    input/
    select/
    textarea/
    checkbox/
    radio/
    switch/
    modal/
    drawer/
    card/
    badge/
    tabs/
    spinner/
    skeleton/
  forms/
    field-wrapper/
    error-text/
    form-section/
    draft-tools/
  tables/
    data-table/
    table-toolbar/
    pagination/
    row-actions/
  upload/
    uploader/
    image-preview/
    file-preview/
  feedback/
    toast/
    inline-error/
    empty-state/
    error-state/
```

## 7. Struktur Feature yang Direkomendasikan

Setiap feature sebaiknya memakai pola:

```text
features/<feature-name>/
  components/
  pages/
  hooks/
  api/
  schema/
  types/
  utils/
  constants/
```

Contoh:

```text
features/medical-records/
  components/
  pages/
  hooks/
  api/
  schema/
  types/
  utils/
  constants/
```

## 8. Naming Convention

### 8.1 Folder

- gunakan lowercase kebab-case
- contoh: `medical-records`, `account-settings`

### 8.2 Component

- gunakan PascalCase
- contoh: `MedicalRecordForm.tsx`

### 8.3 Hook

- gunakan awalan `use`
- contoh: `useMedicalRecordDraft.ts`

### 8.4 State Store

- gunakan nama jelas dan domain-oriented
- contoh: `useDraftStore.ts`, `useAppShellStore.ts`

### 8.5 Constants

- gunakan UPPER_SNAKE_CASE untuk nilai konstan
- gunakan nama domain jelas

## 9. Boundary Rules

- `pages/` boleh import dari `features/` dan `shared/`
- `features/` boleh import dari `shared/`, `api/`, `state/`, `lib/`, `types/`
- `shared/` tidak boleh import dari `features/`
- `api/` tidak boleh import dari `pages/` atau `features/`
- `realtime/` tidak boleh berisi logic bisnis modul tertentu

## 10. Struktur Realtime Frontend

```text
realtime/
  client/
    event-source-client.ts
    smart-polling-client.ts
    realtime-client.ts
  handlers/
    event-dispatcher.ts
    toast-handler.ts
    query-invalidation-handler.ts
  contracts/
    event-types.ts
    payload-types.ts
```

## 11. Struktur Draft Persistence Frontend

```text
state/
  draft/
    draft-keys.ts
    draft-storage.ts
    draft-version.ts
    use-draft-store.ts
```

## 12. Struktur API Frontend

```text
api/
  client/
    http-client.ts
    auth-client.ts
    response-parser.ts
  contracts/
    response-envelope.ts
    pagination.ts
  query/
    query-keys.ts
```

## 13. Aturan Evolusi Struktur

- jangan menambah folder baru jika bisa memakai rumah yang sudah ada
- kalau satu feature mulai terlalu besar, pecah di dalam feature, bukan mengubah root structure sembarangan
- perubahan struktur root wajib dicatat di History frontend

## 14. Checklist Kepatuhan Struktur

Sebelum merge atau lanjut phase besar, cek:

- apakah shared benar-benar shared
- apakah tidak ada import balik dari shared ke feature
- apakah realtime tidak menyebar acak
- apakah page hanya entry point
- apakah kode template pihak ketiga sudah dibungkus internal
