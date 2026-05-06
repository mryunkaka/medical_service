# PRD Integration Medical Service

## 1. Tujuan

Dokumen ini mengatur bagaimana frontend dan backend bertemu secara aman, bertahap, dan konsisten.

## 1.1 Acuan Legacy Wajib

Seluruh keputusan integrasi harus merujuk ke project legacy di [ems2](</D:/Project/Web/ems2>) sebagai sumber perilaku sistem lama.

Yang wajib dicek dari legacy:

- field form lama
- endpoint/action lama
- query save/list/detail lama
- perilaku halaman lama
- upload flow lama

Aturan:

- integration contract tidak boleh dibuat hanya dari asumsi dokumen
- bila perilaku legacy dan docs berbeda, legacy harus diaudit lalu ketidaksesuaian dicatat di history

## 2. Prinsip Integrasi

- frontend-first
- API-first
- backend membuka adapter minimum sesuai kebutuhan frontend aktif
- database lama tetap dipakai
- response contract tidak boleh berubah-ubah per modul

## 3. Kontrak Wajib

Response minimal:

- `success`
- `message`
- `data`
- `errors`
- `meta`
- `meta.toastType` bila relevan

## 4. Tujuan Integrasi Phase Awal

- auth frontend-backend stabil
- current user/profile stabil
- lookup umum stabil
- realtime SSE dan fallback polling stabil
- satu modul prioritas selesai end-to-end

## 5. Realtime Final

- primary realtime: SSE
- fallback: smart polling
- future chat: WebSocket adapter paling akhir

## 6. Urutan Integrasi Resmi

1. response contract
2. auth/session
3. current user/profile
4. shared lookup
5. realtime foundation
6. rekam medis sebagai modul pertama
7. modul berikutnya bertahap

## 7. Aturan Integrasi

- frontend tidak boleh mengasumsikan field name tanpa mapping jelas
- backend tidak boleh mengubah shape response seenaknya
- semua mismatch field harus dicatat
- semua perubahan kontrak harus update HISTORY integration

## 8. Definition of Done

- kontrak respons final dipakai
- auth dan lookup stabil
- realtime dasar stabil
- satu modul prioritas selesai
- testing dasar lulus

## 9. Strategi Modernisasi Resmi

Strategi modernisasi yang dipakai adalah **gradual migration / strangler approach**.

Artinya:

- frontend baru hidup berdampingan dengan sistem lama
- backend adapter membungkus perilaku lama sedikit demi sedikit
- modul dipindah bertahap, bukan sekaligus
- transitional architecture dianggap bagian resmi dari migrasi

Aturan:

- jangan lakukan big-bang rewrite
- setiap perpindahan modul harus punya seam atau batas integrasi yang jelas
- setiap adapter penting harus terdokumentasi

## 10. Hirarki Sumber Kebenaran

Urutan sumber kebenaran area integration:

1. PRD integration
2. HISTORY integration
3. TODO integration
4. PROGRESS integration
