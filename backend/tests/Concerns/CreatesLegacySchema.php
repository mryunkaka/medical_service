<?php

namespace Tests\Concerns;

use App\Models\LegacyUser;
use App\Support\Auth\LegacySession;
use App\Support\Legacy\LegacySchema;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use PDO;

trait CreatesLegacySchema
{
    protected function bootLegacyTestDatabaseConnection(): void
    {
        if (in_array('sqlite', PDO::getAvailableDrivers(), true)) {
            return;
        }

        $env = $this->readRootEnv();
        $host = $env['DB_HOST'] ?? '127.0.0.1';
        $port = $env['DB_PORT'] ?? '3306';
        $username = $env['DB_USERNAME'] ?? 'root';
        $password = $env['DB_PASSWORD'] ?? '';
        $database = 'medical_service_test';

        $pdo = new PDO("mysql:host={$host};port={$port}", $username, $password);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        Config::set('database.default', 'mysql_legacy_test');
        Config::set('database.connections.mysql_legacy_test', [
            'driver' => 'mysql',
            'host' => $host,
            'port' => $port,
            'database' => $database,
            'username' => $username,
            'password' => $password,
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ]);

        DB::purge('mysql_legacy_test');
        DB::reconnect('mysql_legacy_test');
    }

    protected function createLegacyUserTables(): void
    {
        Schema::dropIfExists('remember_tokens');
        Schema::dropIfExists('user_rh');

        Schema::create('user_rh', function (Blueprint $table) {
            $table->increments('id');
            $table->string('full_name');
            $table->string('pin')->nullable();
            $table->string('role')->default('Staff');
            $table->string('position')->default('Staff');
            $table->string('division')->default('Medis');
            $table->string('unit_code')->default('roxwood');
            $table->boolean('can_view_all_units')->default(false);
            $table->boolean('is_verified')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('remember_tokens', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->dateTime('expired_at')->nullable();
            $table->timestamps();
        });
    }

    protected function createMedicalRecordTables(): void
    {
        Schema::dropIfExists('medical_record_assistants');
        Schema::dropIfExists('medical_records');

        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->string('record_code')->nullable();
            $table->string('patient_name');
            $table->string('patient_citizen_id')->nullable();
            $table->string('patient_occupation')->nullable();
            $table->date('patient_dob')->nullable();
            $table->string('patient_phone')->nullable();
            $table->string('patient_gender')->nullable();
            $table->text('patient_address')->nullable();
            $table->string('patient_status')->nullable();
            $table->string('ktp_file_path')->nullable();
            $table->string('mri_file_path')->nullable();
            $table->longText('medical_result_html')->nullable();
            $table->unsignedInteger('doctor_id')->nullable();
            $table->unsignedInteger('assistant_id')->nullable();
            $table->string('operasi_type')->default('minor');
            $table->string('visibility_scope')->default('standard');
            $table->unsignedInteger('created_by')->default(0);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });

        Schema::create('medical_record_assistants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medical_record_id');
            $table->unsignedInteger('assistant_user_id');
            $table->unsignedInteger('sort_order')->default(1);
        });
    }

    protected function createSecretaryTables(): void
    {
        Schema::dropIfExists('secretary_file_records');
        Schema::dropIfExists('secretary_confidential_letters');
        Schema::dropIfExists('secretary_internal_coordinations');
        Schema::dropIfExists('secretary_visit_agendas');

        Schema::create('secretary_visit_agendas', function (Blueprint $table) {
            $table->id();
            $table->string('agenda_code');
            $table->string('visitor_name');
            $table->string('origin_name');
            $table->text('visit_purpose');
            $table->date('visit_date');
            $table->time('visit_time');
            $table->string('location');
            $table->unsignedInteger('pic_user_id');
            $table->string('status');
            $table->text('notes')->nullable();
            $table->unsignedInteger('created_by')->default(0);
            $table->unsignedInteger('updated_by')->default(0);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });

        Schema::create('secretary_internal_coordinations', function (Blueprint $table) {
            $table->id();
            $table->string('coordination_code');
            $table->string('title');
            $table->string('division_scope');
            $table->unsignedInteger('host_user_id');
            $table->date('coordination_date');
            $table->time('start_time');
            $table->string('status');
            $table->text('summary_notes')->nullable();
            $table->text('follow_up_notes')->nullable();
            $table->unsignedInteger('created_by')->default(0);
            $table->unsignedInteger('updated_by')->default(0);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });

        Schema::create('secretary_confidential_letters', function (Blueprint $table) {
            $table->id();
            $table->string('register_code');
            $table->string('reference_number');
            $table->string('letter_direction');
            $table->string('subject');
            $table->string('counterparty_name');
            $table->string('confidentiality_level');
            $table->date('letter_date');
            $table->string('status');
            $table->text('notes')->nullable();
            $table->unsignedInteger('created_by')->default(0);
            $table->unsignedInteger('updated_by')->default(0);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });

        Schema::create('secretary_file_records', function (Blueprint $table) {
            $table->id();
            $table->string('file_code');
            $table->string('file_category');
            $table->string('reference_number');
            $table->string('title');
            $table->string('counterparty_name');
            $table->date('document_date');
            $table->string('status');
            $table->string('keywords')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('created_by')->default(0);
            $table->unsignedInteger('updated_by')->default(0);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    protected function seedLegacyUsers(): array
    {
        $actor = [
            'id' => 2,
            'full_name' => 'AHMAD MILLER',
            'pin' => bcrypt('1122'),
            'role' => 'Staff',
            'position' => 'co_asst',
            'division' => 'Medis',
            'unit_code' => 'roxwood',
            'can_view_all_units' => 0,
            'is_verified' => 1,
            'is_active' => 1,
        ];

        $doctor = [
            'id' => 11,
            'full_name' => 'Dr. Ollie Hexagonal',
            'pin' => bcrypt('1111'),
            'role' => 'Doctor',
            'position' => 'doctor',
            'division' => 'Medis',
            'unit_code' => 'roxwood',
            'can_view_all_units' => 0,
            'is_verified' => 1,
            'is_active' => 1,
        ];

        $assistant = [
            'id' => 21,
            'full_name' => 'Nurse Dinda Pratama',
            'pin' => bcrypt('2121'),
            'role' => 'Assistant',
            'position' => 'assistant',
            'division' => 'Medis',
            'unit_code' => 'roxwood',
            'can_view_all_units' => 0,
            'is_verified' => 1,
            'is_active' => 1,
        ];

        DB::table('user_rh')->insert([$actor, $doctor, $assistant]);

        return [
          'actor' => $actor,
          'doctor' => $doctor,
          'assistant' => $assistant,
        ];
    }

    protected function withLegacySession(array $user): array
    {
        return [
            LegacySession::SESSION_KEY => LegacyUser::fromRow($user)->toArray(),
        ];
    }

    protected function resetLegacySchemaCache(): void
    {
        LegacySchema::resetCache();
    }

    protected function readRootEnv(): array
    {
        $values = [];
        $envPath = base_path('.env');

        foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $trimmed = trim($line);

            if ($trimmed === '' || str_starts_with($trimmed, '#') || !str_contains($trimmed, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $trimmed, 2);
            $values[$key] = trim($value, " \t\n\r\0\x0B\"'");
        }

        return $values;
    }
}
