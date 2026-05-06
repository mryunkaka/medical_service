import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { generateFileId } from '@/lib/utils';
import type { UploadAsset } from '@/types/medical-record';

interface UploadOptions {
  maxSizeMb?: number;
  accept?: string[];
}

export function useUploadField(options: UploadOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function processFile(file: File): Promise<UploadAsset> {
    setIsProcessing(true);
    setError(null);

    try {
      if (options.accept && !options.accept.includes(file.type)) {
        throw new Error('Tipe file tidak didukung untuk field ini.');
      }

      if (file.size > (options.maxSizeMb ?? 0.4) * 1024 * 1024 * 3) {
        throw new Error('Ukuran file terlalu besar untuk diproses aman di browser.');
      }

      const compressed = await imageCompression(file, {
        maxSizeMB: options.maxSizeMb ?? 0.4,
        maxWidthOrHeight: 1800,
        useWebWorker: true,
      });

      return {
        fileId: generateFileId(),
        fileName: compressed.name,
        fileSize: compressed.size,
        mimeType: compressed.type,
        fileUrl: URL.createObjectURL(compressed),
      };
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Gagal memproses file upload.';
      setError(message);
      throw caughtError;
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    error,
    isProcessing,
    processFile,
  };
}
