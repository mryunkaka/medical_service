import { DRAFT_SCHEMA_VERSION } from './draft-version';

export function createDraftKey(module: string, recordId?: string | number) {
  return recordId
    ? `${module}:edit:${recordId}:draft:${DRAFT_SCHEMA_VERSION}`
    : `${module}:create:draft:${DRAFT_SCHEMA_VERSION}`;
}
