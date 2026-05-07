# TODO Integration Medical Service

## 1. Aturan Eksekusi

- jangan integrasi modul sebelum response contract jelas
- jangan integrasi banyak modul sebelum auth dan lookup stabil
- setiap mismatch harus dicatat
- sebelum mapping modul, cek flow legacy di [ems2](</D:/Project/Web/ems2>)

## 2. Phase 01 - Response Contract

Checklist:

- [x] success response
- [x] error response
- [x] validation error response
- [x] pagination response
- [x] toast message convention
- [x] meta.toastType convention

## 3. Phase 02 - Auth Integration

Checklist:

- [x] login request/response
- [x] logout flow
- [x] current user
- [x] session expired handling
- [x] unauthorized redirect/response

Acuan operasional:

- `03-integration/05-DATA_CONTRACT_AND_FIELD_MAPPING_MEDICAL_SERVICE.md`

## 4. Phase 03 - Shared Lookup Integration

Checklist:

- [x] option list
- [x] autocomplete
- [x] shared filter/search

## 5. Phase 04 - Realtime Integration

Checklist:

- [x] frontend SSE ke backend stream
- [x] smart polling fallback
- [x] query invalidation selektif
- [x] realtime toast jika relevan
- [x] delta update flow

## 6. Phase 05 - First Module Integration

Rekomendasi:

- rekam medis

Checklist:

- [x] mapping field frontend ke kolom lama
- [x] mapping validation
- [x] mapping upload
- [x] mapping save
- [x] mapping realtime event
- [x] uji gagal save tanpa kehilangan draft

Acuan operasional:

- `03-integration/05-DATA_CONTRACT_AND_FIELD_MAPPING_MEDICAL_SERVICE.md`

## 7. Definition of Done Integration

- [x] phase 01 sampai 04 selesai
- [x] satu modul pertama selesai
- [x] lulus testing dasar
