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
        [$contents, $extension] = $this->optimizeImage($file);
        $filename = Str::uuid()->toString().'.'.$extension;
        $path = $directory.'/'.$filename;
        Storage::disk('public')->put($path, $contents);

        return new UploadedFilePayload(
            disk: 'public',
            path: $path,
            url: Storage::disk('public')->url($path),
        );
    }

    protected function optimizeImage(UploadedFile $file): array
    {
        $originalContents = file_get_contents($file->getRealPath());
        $originalExtension = strtolower($file->getClientOriginalExtension());

        if ($originalContents === false || !function_exists('imagecreatefromstring')) {
            return [(string) $originalContents, $originalExtension];
        }

        $image = @imagecreatefromstring($originalContents);
        $imageInfo = @getimagesize($file->getRealPath());

        if (!$image || !$imageInfo) {
            return [$originalContents, $originalExtension];
        }

        [$width, $height] = $imageInfo;
        $mime = $imageInfo['mime'] ?? $file->getMimeType();
        $target = $this->resizeIfNeeded($image, $width, $height, 1800);

        try {
            return $this->encodeOptimizedImage($target, $mime, $originalExtension, $originalContents);
        } finally {
            imagedestroy($image);
            if ($target !== $image) {
                imagedestroy($target);
            }
        }
    }

    protected function resizeIfNeeded(\GdImage $image, int $width, int $height, int $maxSize): \GdImage
    {
        if ($width <= $maxSize && $height <= $maxSize) {
            return $image;
        }

        $scale = min($maxSize / max($width, 1), $maxSize / max($height, 1));
        $targetWidth = max((int) round($width * $scale), 1);
        $targetHeight = max((int) round($height * $scale), 1);
        $canvas = imagecreatetruecolor($targetWidth, $targetHeight);

        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);
        $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
        imagefilledrectangle($canvas, 0, 0, $targetWidth, $targetHeight, $transparent);
        imagecopyresampled($canvas, $image, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

        return $canvas;
    }

    protected function encodeOptimizedImage(\GdImage $image, ?string $mime, string $originalExtension, string $fallbackContents): array
    {
        ob_start();

        $extension = $originalExtension;
        $encoded = match ($mime) {
            'image/png' => imagepng($image, null, 6),
            'image/webp' => function_exists('imagewebp') ? imagewebp($image, null, 82) : imagejpeg($image, null, 82),
            default => imagejpeg($image, null, 82),
        };

        if ($mime === 'image/webp' && !function_exists('imagewebp')) {
            $extension = 'jpg';
        }

        if ($mime === 'image/jpeg' || $mime === 'image/jpg' || !in_array($mime, ['image/png', 'image/webp'], true)) {
            $extension = 'jpg';
        }

        $contents = ob_get_clean();

        if (!$encoded || $contents === false) {
            return [$fallbackContents, $originalExtension];
        }

        return [$contents, $extension];
    }
}
