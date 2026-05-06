<?php

namespace App\Uploads\Processors;

use App\Uploads\Paths\StoragePathFactory;
use App\Uploads\Responses\UploadedFilePayload;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    public function __construct(
        protected StoragePathFactory $paths,
    ) {
    }

    public function storeMedicalRecordFile(UploadedFile $file, string $type): UploadedFilePayload
    {
        $directory = $this->paths->medicalRecordPath($type);
        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs($directory, $filename, ['disk' => 'public']);

        return new UploadedFilePayload(
            disk: 'public',
            path: $path,
            url: Storage::disk('public')->url($path),
        );
    }
}
