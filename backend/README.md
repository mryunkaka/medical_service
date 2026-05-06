# Medical Service Backend

Backend ini adalah adapter Laravel 13 untuk project `medical_service`. Fokusnya bukan rewrite schema, tetapi membungkus database legacy `fouf9972_ems` dan meniru alur operasional lama dari [ems2](</D:/Project/Web/ems2>).

## Stack

- Laravel 13
- PHP 8.4
- MySQL / MariaDB legacy
- session auth
- SSE + delta polling

## Aturan Penting

- jangan ubah schema SQL legacy
- jangan pakai migration baru untuk tabel operasional lama
- sebelum ubah flow save/update, audit dulu implementasi di `D:/Project/Web/ems2`
- perubahan style atau kontrak frontend harus tetap mengikuti docs repo

## Instalasi

Jalankan dari root repo:

```powershell
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan storage:link
```

Edit `.env` backend agar sesuai server MySQL lokal Anda:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fouf9972_ems
DB_USERNAME=root
DB_PASSWORD=
```

Lalu jalankan:

```powershell
php artisan route:list
php artisan test
php artisan serve
```

## Endpoint Aktif

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/session`
- `GET /api/auth/status`
- `GET /api/dashboard`
- `GET /api/lookups/users`
- `GET /api/medical-records`
- `GET /api/medical-records/{id}`
- `POST /api/medical-records`
- `PUT /api/medical-records/{id}`
- `DELETE /api/medical-records/{id}`
- `GET /api/ems-services`
- `POST /api/ems-services`
- `GET /api/pharmacy-recap`
- `POST /api/pharmacy-recap`
- `GET /api/secretary`
- `POST /api/secretary/file-records`
- `GET /api/realtime/stream`
- `GET /api/realtime/delta`

## Struktur Utama

- `app/Http` controller, request, middleware
- `app/Domain` service dan query per modul
- `app/Support` response, auth session, helper legacy
- `app/Realtime` SSE, delta polling, publisher
- `app/Uploads` validator, path, processor upload
- `routes/` dipisah ke `web.php`, `api.php`, `auth.php`, `realtime.php`

## Verifikasi Terakhir

- `composer dump-autoload` lulus
- `php artisan route:list` lulus
- `php artisan test` lulus
