import localforage from 'localforage';
import { readJson, writeJson } from '@/lib/storage';

export interface DraftEnvelope<T> {
  schemaVersion: string;
  updatedAt: string;
  values: T;
}

const fileStore = localforage.createInstance({
  name: 'medical-service-files',
});

export function saveDraft<T>(key: string, draft: DraftEnvelope<T>) {
  writeJson(key, draft);
}

export function readDraft<T>(key: string) {
  return readJson<DraftEnvelope<T> | null>(key, null);
}

export function clearDraft(key: string) {
  if (globalThis.window?.localStorage) {
    globalThis.window.localStorage.removeItem(key);
  } else if (globalThis.localStorage && typeof globalThis.localStorage.removeItem === 'function') {
    globalThis.localStorage.removeItem(key);
  }
}

export async function saveDraftFile(key: string, file: File) {
  await fileStore.setItem(key, file);
}

export async function readDraftFile(key: string) {
  return fileStore.getItem<File>(key);
}

export async function clearDraftFile(key: string) {
  await fileStore.removeItem(key);
}
