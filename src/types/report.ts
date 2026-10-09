export type ReportReason =
  | 'WRONG_ANSWER'
  | 'DUPLICATE_QUESTION'
  | 'TYPO_TRANSLATION'
  | 'UNCLEAR_EXPLANATION'
  | 'OUTDATED_OR_OTHER';

export interface QuestionReport {
  id: string;
  questionId: string;
  questionTitle: string;
  reason: ReportReason;
  comment?: string;
  reportedAt: number;
  userLanguage?: 'vi' | 'en';
  status: 'PENDING' | 'RESOLVED';
}
