# Project Structure Backend Medical Service

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan struktur backend resmi agar implementasi Laravel 13 tetap rapi, modular, dan kompatibel dengan database lama.

## 1.1 Acuan Legacy Sebelum Implementasi

Setiap service, query, request, atau endpoint baru wajib mengaudit project legacy di [ems2](</D:/Project/Web/ems2>) sebelum ditulis.

Minimal yang harus dicek:

- query lama
- nama field lama
- perilaku save/update lama
- flow halaman atau action yang terkait

## 2. Prinsip Struktur

- controller tipis
- service memegang orchestration
- query lama tidak tersebar di controller
- request validation terpisah
- auth, upload, realtime, dan domain module punya rumah yang jelas

## 3. Root Backend yang Direkomendasikan

```text
medical_service/
  backend/
    app/
    bootstrap/
    config/
    database/
    public/
    resources/
    routes/
    storage/
    tests/
```

## 4. Struktur `app/` Resmi

```text
app/
  Http/
  Services/
  Queries/
  Repositories/
  DTOs/
  Actions/
  Support/
  Realtime/
  Uploads/
  Domain/
  Models/
  Policies/
  Exceptions/
```

## 5. Penjelasan Tiap Folder

### 5.1 `Http/`

Isi:

- Controllers
- Requests
- Middleware
- Resources

Aturan:

- controller hanya mapping request ke service
- jangan taruh query SQL panjang di controller

### 5.2 `Services/`

Isi:

- orchestration business flow
- transaction handling
- save flow
- integrasi upload
- integrasi realtime publish

### 5.3 `Queries/`

Isi:

- query read-heavy
- list builder
- filter query
- autocomplete query

Aturan:

- cocok untuk query legacy kompleks
- read concern dipisah dari orchestration

### 5.4 `Repositories/`

Isi:

- write concern atau persistence helper bila dipilih

Catatan:

- repository tidak wajib untuk semua hal
- gunakan hanya jika memberi nilai nyata

### 5.5 `DTOs/`

Isi:

- data transfer object internal
- payload normalization object

### 5.6 `Actions/`

Isi:

- unit aksi yang jelas dan reusable bila service mulai terlalu besar

### 5.7 `Support/`

Isi:

- helper internal backend
- response helper
- pagination helper
- formatter

### 5.8 `Realtime/`

Isi:

- SSE publisher
- stream helpers
- smart polling delta generator
- event taxonomy

### 5.9 `Uploads/`

Isi:

- upload validator
- path generator
- image processor helper

### 5.10 `Domain/`

Isi:

- domain modules

Contoh:

```text
Domain/
  Auth/
  MedicalRecords/
  EmsServices/
  PharmacyRecap/
  AccountSettings/
  Secretary/
```

Aturan:

- jika modul sudah cukup besar, grouping domain di sini lebih aman daripada menyebar semua ke `Services/`

### 5.11 `Models/`

Isi:

- model Eloquent selektif

Aturan:

- jangan paksa semua tabel lama menjadi model kompleks

### 5.12 `Policies/`

Isi:

- authorization policy

### 5.13 `Exceptions/`

Isi:

- custom exception
- business rule exception
- not found exception bila dibutuhkan

## 6. Struktur `routes/`

```text
routes/
  web.php
  api.php
  auth.php
  realtime.php
```

Aturan:

- route auth dipisah jelas
- route realtime dipisah agar mudah diaudit

## 7. Struktur `Http/`

```text
Http/
  Controllers/
    Api/
    Web/
    Auth/
    Realtime/
  Requests/
    Auth/
    MedicalRecords/
    EmsServices/
  Middleware/
  Resources/
    Common/
    MedicalRecords/
```

## 8. Struktur Domain yang Direkomendasikan

Setiap domain besar boleh memakai pola:

```text
Domain/<Module>/
  Services/
  Queries/
  DTOs/
  Actions/
  Policies/
  Resources/
```

## 9. Naming Convention

### 9.1 Controller

- `MedicalRecordController`
- `AuthSessionController`

### 9.2 Request

- `StoreMedicalRecordRequest`
- `UpdateMedicalRecordRequest`

### 9.3 Service

- `MedicalRecordService`
- `AuthSessionService`

### 9.4 Query

- `MedicalRecordListQuery`
- `MedicLookupQuery`

### 9.5 Realtime

- `RealtimeEventPublisher`
- `MedicalRecordEventStream`

## 10. Boundary Rules

- Controller boleh import Request, Service, Resource
- Service boleh import Query, Action, DTO, Realtime, Upload
- Query tidak boleh bergantung pada Controller
- Realtime tidak boleh mengandung business rule berat
- Upload tidak boleh mengandung UI concern

## 11. Struktur Realtime Backend

```text
Realtime/
  Streams/
    SseStreamResponder.php
  Publishers/
    RealtimeEventPublisher.php
  Polling/
    DeltaPollingResponder.php
  Contracts/
    EventNames.php
    EventPayload.php
```

## 12. Struktur Upload Backend

```text
Uploads/
  Validators/
  Paths/
  Processors/
  Responses/
```

## 13. Struktur Testing Backend

```text
tests/
  Feature/
    Auth/
    MedicalRecords/
    Realtime/
  Unit/
    Services/
    Queries/
    Support/
```

## 14. Aturan Evolusi Struktur

- jika modul masih kecil, cukup gunakan Services + Queries
- jika modul membesar, pindahkan ke `Domain/<Module>/`
- perubahan struktur root harus dicatat di History backend

## 15. Checklist Kepatuhan Struktur

- tidak ada query SQL besar di controller
- tidak ada business flow berat di route file
- response helper dipakai konsisten
- realtime dan upload punya rumah terpisah
- domain besar tidak tercampur acak
