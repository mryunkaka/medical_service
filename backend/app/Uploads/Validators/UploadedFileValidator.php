<?php

namespace App\Uploads\Validators;

use App\Exceptions\BusinessRuleException;
use Illuminate\Http\UploadedFile;

class UploadedFileValidator
{
    public function validateImage(?UploadedFile $file, string $label, bool $required = false): ?UploadedFile
    {
        if (!$file) {
            if ($required) {
                throw new BusinessRuleException("{$label} wajib diupload.");
            }

            return null;
        }

        if (!in_array(strtolower((string) $file->getClientOriginalExtension()), ['jpg', 'jpeg', 'png', 'webp'], true)) {
            throw new BusinessRuleException("Format {$label} tidak valid.");
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            throw new BusinessRuleException("Ukuran {$label} melebihi 5MB.");
        }

        return $file;
    }
}
