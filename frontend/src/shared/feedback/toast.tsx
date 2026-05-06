import { toast } from 'sonner';
import type { ToastType } from '@/types/api';

export function showToast(type: ToastType, message: string) {
  toast[type](message);
}
