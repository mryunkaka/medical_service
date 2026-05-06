export interface SecretaryVisitAgenda {
  id: number;
  agendaCode: string;
  visitorName: string;
  originName: string;
  visitPurpose: string;
  visitDate: string;
  visitTime: string;
  location: string;
  picName: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface SecretaryCoordination {
  id: number;
  coordinationCode: string;
  title: string;
  divisionScope: string;
  hostName: string;
  coordinationDate: string;
  startTime: string;
  status: 'draft' | 'scheduled' | 'done' | 'cancelled';
  summaryNotes: string;
  followUpNotes: string;
}

export interface SecretaryConfidentialLetter {
  id: number;
  registerCode: string;
  referenceNumber: string;
  subject: string;
  counterpartyName: string;
  letterDirection: 'incoming' | 'outgoing';
  confidentialityLevel: 'confidential' | 'secret' | 'top_secret';
  letterDate: string;
  status: 'logged' | 'sealed' | 'distributed' | 'archived';
}

export interface SecretaryFileRecord {
  id: number;
  recordCode: string;
  fileCategory: 'proposal' | 'cooperation' | 'contract' | 'report' | 'other';
  title: string;
  counterpartyName: string;
  documentDate: string;
  status: 'draft' | 'review' | 'active' | 'archived';
  keywordSummary: string;
}

export interface SecretaryFileRecordFormValues {
  fileCategory: 'proposal' | 'cooperation' | 'contract' | 'report' | 'other';
  title: string;
  counterpartyName: string;
  documentDate: string;
  status: 'draft' | 'review' | 'active' | 'archived';
  keywordSummary: string;
}

export interface SecretaryPayload {
  visitAgendas: SecretaryVisitAgenda[];
  internalCoordinations: SecretaryCoordination[];
  confidentialLetters: SecretaryConfidentialLetter[];
  fileRecords: SecretaryFileRecord[];
}
