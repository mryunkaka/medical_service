import { useEffect, useMemo } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { createDraftKey } from '@/state/draft/draft-keys';
import { clearDraft, readDraft, saveDraft, type DraftEnvelope } from '@/state/draft/draft-storage';
import { DRAFT_SCHEMA_VERSION } from '@/state/draft/draft-version';

interface DraftOptions<T extends FieldValues> {
  module: string;
  recordId?: string | number;
  form: UseFormReturn<T>;
}

export function useDraftForm<T extends FieldValues>({ module, recordId, form }: DraftOptions<T>) {
  const draftKey = useMemo(() => createDraftKey(module, recordId), [module, recordId]);

  useEffect(() => {
    const draft = readDraft<T>(draftKey);
    if (draft?.values) {
      form.reset({ ...form.getValues(), ...draft.values });
    }
  }, [draftKey, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      const envelope: DraftEnvelope<T> = {
        schemaVersion: DRAFT_SCHEMA_VERSION,
        updatedAt: new Date().toISOString(),
        values: values as T,
      };
      saveDraft(draftKey, envelope);
    });

    return () => subscription.unsubscribe();
  }, [draftKey, form]);

  return {
    draftKey,
    clearStoredDraft: () => clearDraft(draftKey),
  };
}
