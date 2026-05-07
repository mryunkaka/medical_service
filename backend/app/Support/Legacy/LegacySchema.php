<?php

namespace App\Support\Legacy;

use Illuminate\Support\Facades\DB;

class LegacySchema
{
    protected static array $columnCache = [];
    protected static array $tableCache = [];

    public static function hasTable(string $table): bool
    {
        if (array_key_exists($table, self::$tableCache)) {
            return self::$tableCache[$table];
        }

        return self::$tableCache[$table] = DB::connection()->getSchemaBuilder()->hasTable($table);
    }

    public static function hasColumn(string $table, string $column): bool
    {
        $key = $table.'.'.$column;

        if (array_key_exists($key, self::$columnCache)) {
            return self::$columnCache[$key];
        }

        return self::$columnCache[$key] = self::hasTable($table)
            && DB::connection()->getSchemaBuilder()->hasColumn($table, $column);
    }

    public static function resetCache(): void
    {
        self::$columnCache = [];
        self::$tableCache = [];
    }
}
