# PRD Testing Medical Service

## 1. Tujuan

Testing phase dibuat agar migrasi tidak hanya "jalan", tetapi stabil, konsisten, dan bisa diulang.

## 1.1 Acuan Legacy Untuk Testing

Pengujian hasil migrasi harus membandingkan perilaku baru terhadap project legacy di [ems2](</D:/Project/Web/ems2>) bila flow lama masih relevan.

Tujuannya:

- memastikan perilaku inti tidak hilang
- memastikan field penting tetap cocok
- memastikan migrasi benar-benar setara atau lebih baik dari legacy

## 2. Prinsip Testing

- setiap flow penting harus punya checklist
- success path dan error path sama pentingnya
- mobile, tablet, dan desktop wajib diuji
- realtime SSE dan fallback polling wajib diuji
- draft persistence wajib diuji

## 3. Scope Testing

### 3.1 Auth

- login valid
- login invalid
- logout
- session expired
- unauthorized access

### 3.2 App Shell

- sidebar
- topbar
- breadcrumb
- mobile shell
- tablet shell

### 3.3 Form

- save success
- save fail
- validation error
- autosave draft
- restore draft
- clear draft

### 3.4 Upload

- preview
- validation
- compression
- upload success
- upload fail

### 3.5 Realtime

- SSE connect
- SSE reconnect
- smart polling fallback
- event masuk ke user lain

### 3.6 Responsive

- desktop
- tablet
- mobile

## 4. Aturan Testing

- jangan tandai selesai jika hanya diuji sekali
- semua bug penting harus dicatat di progress/testing log
- jika flow berubah, update HISTORY testing

## 5. Definition of Done

- auth flow stabil
- shell stabil
- form dan draft stabil
- upload stabil
- realtime dan fallback stabil
- responsive dasar stabil

## 6. Aturan Bukti Uji

Setiap pengujian sebaiknya menghasilkan bukti minimal berupa:

- flow yang diuji
- hasil lulus/gagal
- bug yang ditemukan
- tindak lanjut yang dibutuhkan

Jika memungkinkan, tambahkan:

- device class
- kondisi jaringan
- jalur success
- jalur error

## 7. Hirarki Sumber Kebenaran

Urutan sumber kebenaran area testing:

1. PRD testing
2. HISTORY testing
3. TODO testing
4. PROGRESS testing
