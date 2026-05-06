# Data Contract And Field Mapping Medical Service

## 1. Tujuan Dokumen

Dokumen ini adalah acuan integrasi data resmi agar frontend baru, backend adapter, dan database lama tidak saling menebak struktur.

## 1.1 Sumber Acuan Mapping

Sumber utama mapping adalah project legacy di [ems2](</D:/Project/Web/ems2>).

Sebelum mengisi mapping field untuk modul mana pun, wajib cek:

- file halaman lama
- action/save file lama
- helper yang terkait
- query atau migration SQL yang relevan

Aturan:

- jangan mengisi mapping hanya dari ingatan atau asumsi
- jika nama field lama membingungkan, catat notes di tabel mapping

Fungsi dokumen:

- mendefinisikan response contract resmi
- mendefinisikan request contract resmi
- mendefinisikan mapping nama field frontend ke field backend/database lama
- mendefinisikan aturan naming agar tidak berubah-ubah di tengah jalan

## 2. Prinsip Utama

- frontend boleh memakai nama field yang lebih bersih
- backend bertanggung jawab memetakan ke field legacy
- database lama tidak diubah hanya demi membuat nama field frontend terlihat modern
- mapping harus terdokumentasi, bukan diingat di kepala

## 3. Response Envelope Resmi

Semua endpoint baru harus mengarah ke struktur:

```json
{
  "success": true,
  "message": "Data berhasil disimpan.",
  "data": {},
  "errors": null,
  "meta": {
    "toastType": "success"
  }
}
```

## 4. Aturan Tiap Key

### 4.1 `success`

- tipe: boolean
- wajib selalu ada

### 4.2 `message`

- tipe: string
- wajib selalu ada
- harus ramah user
- harus cukup jelas untuk dipakai langsung di toast

### 4.3 `data`

- tipe: object | array | null
- isi payload utama

### 4.4 `errors`

- tipe: object | array | null
- untuk validation error dan field-specific error

### 4.5 `meta`

- tipe: object
- boleh kosong tetapi key `meta` tetap disarankan ada

## 5. `meta` Contract Minimum

Field `meta` yang direkomendasikan:

- `toastType`
- `pagination`
- `realtime`
- `version`

Contoh:

```json
{
  "meta": {
    "toastType": "success",
    "version": "v1"
  }
}
```

## 6. Validation Error Contract

Contoh:

```json
{
  "success": false,
  "message": "Validasi gagal.",
  "data": null,
  "errors": {
    "patientName": ["Nama pasien wajib diisi."],
    "patientPhone": ["Nomor telepon tidak valid."]
  },
  "meta": {
    "toastType": "error"
  }
}
```

Aturan:

- key di `errors` sebisa mungkin mengikuti naming field frontend
- backend bertugas memetakan field DB/legacy ke field form frontend bila perlu

## 7. Pagination Contract

Contoh:

```json
{
  "success": true,
  "message": "Data berhasil dimuat.",
  "data": [],
  "errors": null,
  "meta": {
    "toastType": "info",
    "pagination": {
      "page": 1,
      "perPage": 20,
      "total": 120,
      "totalPages": 6
    }
  }
}
```

## 8. Lookup / Autocomplete Contract

Contoh:

```json
{
  "success": true,
  "message": "Lookup berhasil dimuat.",
  "data": [
    {
      "value": "123",
      "label": "Dr. John Doe",
      "meta": {
        "position": "DPJP"
      }
    }
  ],
  "errors": null,
  "meta": {
    "toastType": "info"
  }
}
```

## 9. Upload Response Contract

Contoh:

```json
{
  "success": true,
  "message": "File berhasil diunggah.",
  "data": {
    "fileId": "abc123",
    "fileName": "ktp.jpg",
    "fileUrl": "/storage/medical_records/ktp/ktp.jpg",
    "fileSize": 245000,
    "mimeType": "image/jpeg"
  },
  "errors": null,
  "meta": {
    "toastType": "success"
  }
}
```

## 10. Realtime Event Contract

Contoh event SSE:

```json
{
  "event": "medical-record.updated",
  "data": {
    "module": "medical-records",
    "recordId": "145",
    "action": "updated",
    "actorId": "22"
  },
  "meta": {
    "toastType": "info",
    "invalidate": [
      "medical-records:list",
      "medical-records:detail:145"
    ]
  }
}
```

## 11. Smart Polling Delta Contract

Contoh:

```json
{
  "success": true,
  "message": "Delta berhasil dimuat.",
  "data": {
    "hasChanges": true,
    "latestCursor": "2026-05-02T09:30:12Z",
    "events": [
      {
        "module": "medical-records",
        "recordId": "145",
        "action": "updated"
      }
    ]
  },
  "errors": null,
  "meta": {
    "toastType": "info"
  }
}
```

## 12. Naming Convention Resmi

### 12.1 Frontend Request/Response Field

- gunakan `camelCase`
- contoh: `patientName`, `patientPhone`, `medicalResultHtml`

### 12.2 Database Legacy Field

- tetap mengikuti nama existing
- contoh: `patient_name`, `patient_phone`, `medical_result_html`

### 12.3 Mapping Rule

- frontend `camelCase`
- backend internal dapat memakai `camelCase`
- DB/SQL tetap legacy original

## 13. Mapping Table Template

Gunakan format tabel berikut saat mulai mapping modul:

| Frontend Field | Backend DTO Field | Legacy DB Field | Required | Notes |
|---|---|---|---|---|
| `patientName` | `patientName` | `patient_name` | Yes | Nama pasien |
| `patientPhone` | `patientPhone` | `patient_phone` | No | Nomor telepon |

## 14. Modul Pertama yang Harus Diisi

Saat implementasi dimulai, dokumen ini harus diperluas minimal untuk:

1. auth/session
2. current user/profile
3. shared lookup
4. rekam medis

## 15. Aturan Perubahan Contract

Jika field frontend berubah:

- update dokumen ini dulu
- update HISTORY integration
- baru update frontend/backend implementation

Jika field DB berubah:

- dokumentasikan dampaknya ke seluruh contract yang terkait
- pastikan backward compatibility dipertimbangkan

## 16. Checklist Kesiapan Mapping

Sebelum mulai modul baru, pastikan:

- field frontend sudah didaftar
- field DB lama sudah dipetakan
- response list/detail/save sudah jelas
- validation error key sudah jelas
- realtime event untuk modul itu sudah jelas

## 17. Mapping Auth dan Session

### 17.1 Request Login Resmi

| Frontend Field | Backend DTO | Legacy Request | Legacy Source | Notes |
|---|---|---|---|---|
| `fullName` | `fullName` | `full_name` | `auth/login_process.php` | cari ke `user_rh.full_name` |
| `pin` | `pin` | `pin` | `auth/login_process.php` | verifikasi ke hash `user_rh.pin` |
| `loginUnit` | `loginUnit` | `login_unit` | `auth/login_process.php` | wajib dinormalisasi |
| `forceLogin` | `forceLogin` | `force_login` | `auth/login_process.php` | hanya saat konflik active login |

### 17.2 Session User Shape Resmi

| Frontend Field | Legacy Session/DB Source | Notes |
|---|---|---|
| `id` | `$_SESSION['user_rh']['id']` | integer |
| `fullName` | `$_SESSION['user_rh']['name']` / `full_name` | backend normalkan ke satu field |
| `role` | `$_SESSION['user_rh']['role']` | role lama tetap dipakai |
| `position` | `$_SESSION['user_rh']['position']` | hasil normalisasi helper |
| `division` | `$_SESSION['user_rh']['division']` | hasil resolve helper |
| `unitCode` | `$_SESSION['user_rh']['unit_code']` | sinkron dengan `ems_active_unit` |
| `canViewAllUnits` | `$_SESSION['user_rh']['can_view_all_units']` | boolean frontend |
| `cutiStatus` | `$_SESSION['user_rh']['cuti_status']` | optional |
| `cutiStartDate` | `$_SESSION['user_rh']['cuti_start_date']` | optional |
| `cutiEndDate` | `$_SESSION['user_rh']['cuti_end_date']` | optional |

### 17.3 Aturan Auth Legacy yang Harus Tetap Hidup

- validasi `is_verified`
- validasi `is_active`
- force login via konflik `remember_tokens`
- restore session dari cookie `remember_login`
- active unit logic

### 17.4 Endpoint Auth Minimum

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/session`

## 18. Shared Lookup Doctor dan Assistant

### 18.1 Sumber Legacy

Acuan lookup legacy:

- [ajax/search_user_rh.php](</D:/Project/Web/ems2/ajax/search_user_rh.php:7>)
- [assets/js/app.js](</D:/Project/Web/ems2/assets/js/app.js:441>)
- [dashboard/rekam_medis.php](</D:/Project/Web/ems2/dashboard/rekam_medis.php:182>)

### 18.2 Contract Lookup Resmi

Request:

- `GET /api/lookups/users?q={query}&scope={scope}`

`scope` resmi:

- `doctor`
- `assistant`
- `all`

Response item:

```json
{
  "value": "12",
  "label": "Dr. John Doe",
  "meta": {
    "fullName": "Dr. John Doe",
    "position": "Specialist",
    "division": "medical",
    "batch": 4
  }
}
```

### 18.3 Rule Scope Legacy

Legacy `doctor`:

- hanya user aktif
- posisi dokter/co-asst/specialist yang relevan

Legacy `assistant`:

- hanya user aktif
- boleh paramedic, co-asst, general practitioner, specialist

### 18.4 Mapping Lookup

| Frontend Field | Backend DTO | Legacy Source | Notes |
|---|---|---|---|
| `value` | `id` | `user_rh.id` | hidden selected id |
| `label` | `fullName` | `user_rh.full_name` | text yang terlihat |
| `meta.position` | `positionLabel` | `user_rh.position` | pakai label helper |
| `meta.division` | `division` | `user_rh.division` | normalized |
| `meta.batch` | `batch` | `user_rh.batch` | optional |

## 19. Mapping Rekam Medis

### 19.1 Field Utama

| Frontend Field | Backend DTO | Legacy Request | Legacy DB Field | Create | Update | Notes |
|---|---|---|---|---|---|---|
| `id` | `id` | `id` | `medical_records.id` | No | Yes | hanya edit |
| `patientName` | `patientName` | `patient_name` | `patient_name` | Yes | Yes | wajib |
| `patientCitizenId` | `patientCitizenId` | `patient_citizen_id` | `patient_citizen_id` | Yes | Yes | wajib |
| `patientOccupation` | `patientOccupation` | `patient_occupation` | `patient_occupation` | No | No | default `Civilian` |
| `patientDob` | `patientDob` | `patient_dob` | `patient_dob` | Yes | Yes | `YYYY-MM-DD` |
| `patientPhone` | `patientPhone` | `patient_phone` | `patient_phone` | No | No | optional |
| `patientGender` | `patientGender` | `patient_gender` | `patient_gender` | Yes | Yes | wajib |
| `patientAddress` | `patientAddress` | `patient_address` | `patient_address` | No | No | default `INDONESIA` |
| `patientStatus` | `patientStatus` | `patient_status` | `patient_status` | No | No | optional |
| `doctorId` | `doctorId` | `doctor_id` | `doctor_id` | Yes | Yes | wajib |
| `assistantIds` | `assistantIds` | `assistant_ids[]` | relation + `assistant_id` | Yes | Yes | minimal 1 |
| `operasiType` | `operasiType` | `operasi_type` | `operasi_type` | Yes | Yes | `major` / `minor` |
| `visibilityScope` | `visibilityScope` | `visibility_scope` | `visibility_scope` | Yes | Yes | `standard` / `forensic_private` |
| `medicalResultHtml` | `medicalResultHtml` | `medical_result_html` | `medical_result_html` | No | No | wajib sanitasi |
| `ktpFile` | `ktpFile` | `ktp_file` | `ktp_file_path` | Yes | No | create wajib |
| `mriFile` | `mriFile` | `mri_file` | `mri_file_path` | Conditional | No | wajib jika forensic private |

### 19.2 Field Server

| Server Field | Legacy DB Field | Notes |
|---|---|---|
| `recordCode` | `record_code` | dibuat server saat create |
| `createdBy` | `created_by` | dari session user |
| `updatedAt` | `updated_at` | saat update |
| `assistantId` | `assistant_id` | first assistant untuk backward compatibility |

### 19.3 Validation Inti

- `patientDob` wajib valid dan masuk akal
- `doctorId` harus integer > 0
- `assistantIds` minimal 1
- `operasiType` hanya `major` atau `minor`
- `visibilityScope` hanya `standard` atau `forensic_private`
- `ktpFile` wajib saat create
- `mriFile` wajib bila `visibilityScope = forensic_private`

### 19.4 Draft Inti

Draft key resmi:

- create: `medical-record:create:draft:v1`
- edit: `medical-record:edit:{id}:draft:v1`

Draft minimal simpan:

- field teks utama
- `doctorId`
- `doctorName`
- `assistantIds`
- `medicalResultHtml`
- metadata upload draft aman

### 19.5 Endpoint Minimum

- `GET /api/medical-records`
- `GET /api/medical-records/{id}`
- `POST /api/medical-records`
- `PUT /api/medical-records/{id}`

### 19.6 Realtime Minimum

Event minimal:

- `medical-record.created`
- `medical-record.updated`
