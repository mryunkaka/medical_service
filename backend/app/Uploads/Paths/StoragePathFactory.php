<?php

namespace App\Uploads\Paths;

class StoragePathFactory
{
    public function medicalRecordPath(string $type): string
    {
        return 'medical_records/'.$type.'/'.now()->format('Y/m');
    }
}
