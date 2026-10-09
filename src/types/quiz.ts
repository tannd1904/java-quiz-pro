import { Question } from './question';

export type AppView = 'HOME' | 'PRACTICE' | 'EXAM' | 'RESULT';

export interface ExamSetupConfig {
  selectedTopicIds: string[];
  questionCount: number;
  timeMinutes: number;
  shuffleOptions: boolean;
  shuffleQuestions: boolean;
}

export interface ExamQuestionItem {
  question: Question;
  shuffledIndices: number[]; // maps shuffled option index -> original option index (0..n-1)
  originalCorrectIndex: number;
}

export interface ExamReviewItem {
  num: number;
  question: Question;
  selectedShuffledIndex: number | null;
  selectedOriginalIndex: number | null;
  correctOriginalIndex: number;
  isCorrect: boolean;
}

export interface ExamResult {
  total: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  score10: number;
  percentage: number;
  isPassed: boolean;
  timeSpentSeconds: number;
  timeSpentFormatted: string;
  reviewList: ExamReviewItem[];
  selectedTopicIds: string[];
}

export interface ExamHistoryItem {
  id: string;
  timestamp: number;
  config: ExamSetupConfig;
  result: ExamResult;
}

export interface ActiveExamSession {
  id: string;
  items: ExamQuestionItem[];
  config: ExamSetupConfig;
  answers: Record<string, number>;
  currentIndex: number;
  remainingSeconds: number;
  startedAt: number;
  lastSavedAt: number;
}

export interface PracticeProgressItem {
  questionId: string;
  selectedOptionIdx: number;
  isCorrect: boolean;
  answeredAt: number;
}
