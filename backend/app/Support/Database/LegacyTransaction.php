<?php

namespace App\Support\Database;

use Closure;
use Illuminate\Support\Facades\DB;

class LegacyTransaction
{
    public static function run(Closure $callback): mixed
    {
        return DB::connection()->transaction($callback);
    }
}
