<?php

namespace App\Uploads\Responses;

class UploadedFilePayload
{
    public function __construct(
        public readonly string $disk,
        public readonly string $path,
        public readonly string $url,
    ) {
    }

    public function toArray(): array
    {
        return [
            'disk' => $this->disk,
            'path' => $this->path,
            'url' => $this->url,
        ];
    }
}
