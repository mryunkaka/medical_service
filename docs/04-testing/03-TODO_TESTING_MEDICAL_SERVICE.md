# TODO Testing Medical Service

## 1. Aturan Eksekusi

- uji per flow, bukan asal klik
- catat hasil penting ke progress testing
- jika ada perubahan strategi testing, update history
- sebelum menyatakan flow lulus, bandingkan dengan acuan legacy di [ems2](</D:/Project/Web/ems2>) bila flow lama masih berlaku

## 2. Phase 01 - Auth Testing

Checklist:

- [ ] login success
- [ ] login invalid
- [ ] logout
- [ ] session expired
- [ ] unauthorized redirect/response

Acuan operasional:

- dokumen ini

## 3. Phase 02 - Shell Testing

Checklist:

- [ ] sidebar desktop
- [ ] sidebar mobile
- [ ] topbar
- [ ] breadcrumb
- [ ] toast kanan atas

## 4. Phase 03 - Form Testing

Checklist:

- [ ] save success
- [ ] save error
- [ ] validation error
- [ ] autosave draft
- [ ] restore draft
- [ ] clear draft

## 5. Phase 04 - Upload Testing

Checklist:

- [ ] preview image/file
- [ ] compression target
- [ ] upload gagal
- [ ] upload sukses

## 6. Phase 05 - Realtime Testing

Checklist:

- [ ] SSE success
- [ ] SSE reconnect
- [ ] smart polling fallback
- [ ] event masuk ke user lain

## 7. Phase 06 - Responsive Testing

Checklist:

- [ ] desktop
- [ ] tablet
- [ ] mobile

## 8. Definition of Done Testing

- [ ] semua phase inti diuji
- [ ] bug penting tercatat
- [ ] satu modul prioritas lolos uji dasar

## 9. Case Inti Auth

Auth minimum yang wajib diuji:

- login success user aktif verified
- login gagal nama/PIN salah
- login gagal akun belum verified
- login gagal akun inactive
- konflik active login lalu force login
- restore session dari remember token valid
- invalid remember token dibersihkan
- logout success
- session expired pada protected page
- CSRF invalid pada request write
- login throttling
- redirect trainee dan non-trainee
- login page usable di desktop, tablet, mobile

## 10. Case Inti Rekam Medis

Rekam medis minimum yang wajib diuji:

- create success dengan data lengkap standard scope
- create gagal tanpa `patientName`
- create gagal tanpa `patientCitizenId`
- create gagal tanpa `patientDob`
- create gagal tanpa `doctorId`
- create gagal tanpa `assistantIds`
- create gagal tanpa `ktpFile`
- create forensic gagal tanpa `mriFile`
- edit success tanpa mengganti file lama
- edit success dengan replace `ktpFile`
- edit gagal jika user tidak berhak
- draft autosave berjalan saat isi form
- draft restore berjalan setelah reload
- clear draft benar-benar menghapus draft
- upload preview dan compression berjalan
- save gagal tidak menghapus draft
- SSE invalidation masuk ke user lain setelah create/update
- fallback smart polling bekerja jika SSE gagal
- layout form tetap usable di tablet dan mobile
