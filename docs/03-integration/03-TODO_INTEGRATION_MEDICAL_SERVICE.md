# TODO Integration Medical Service

## 1. Aturan Eksekusi

- jangan integrasi modul sebelum response contract jelas
- jangan integrasi banyak modul sebelum auth dan lookup stabil
- setiap mismatch harus dicatat
- sebelum mapping modul, cek flow legacy di [ems2](</D:/Project/Web/ems2>)

## 2. Phase 01 - Response Contract

Checklist:

- [ ] success response
- [ ] error response
- [ ] validation error response
- [ ] pagination response
- [ ] toast message convention
- [ ] meta.toastType convention

## 3. Phase 02 - Auth Integration

Checklist:

- [ ] login request/response
- [ ] logout flow
- [ ] current user
- [ ] session expired handling
- [ ] unauthorized redirect/response

Acuan operasional:

- `03-integration/05-DATA_CONTRACT_AND_FIELD_MAPPING_MEDICAL_SERVICE.md`

## 4. Phase 03 - Shared Lookup Integration

Checklist:

- [ ] option list
- [ ] autocomplete
- [ ] shared filter/search

## 5. Phase 04 - Realtime Integration

Checklist:

- [ ] frontend SSE ke backend stream
- [ ] smart polling fallback
- [ ] query invalidation selektif
- [ ] realtime toast jika relevan
- [ ] delta update flow

## 6. Phase 05 - First Module Integration

Rekomendasi:

- rekam medis

Checklist:

- [ ] mapping field frontend ke kolom lama
- [ ] mapping validation
- [ ] mapping upload
- [ ] mapping save
- [ ] mapping realtime event
- [ ] uji gagal save tanpa kehilangan draft

Acuan operasional:

- `03-integration/05-DATA_CONTRACT_AND_FIELD_MAPPING_MEDICAL_SERVICE.md`

## 7. Definition of Done Integration

- [ ] phase 01 sampai 04 selesai
- [ ] satu modul pertama selesai
- [ ] lulus testing dasar
