export type Language = 'vi' | 'en';

export interface LocalizedString {
  vi: string;
  en: string;
}

export interface LocalizedOptions {
  vi: string[];
  en: string[];
}

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRUE_FALSE';

export interface Question {
  id: string;
  topicId: string;
  category: LocalizedString;
  question: LocalizedString;
  codeSnippet: string | null;
  image: string | null;
  type?: QuestionType;
  options: LocalizedOptions;
  correctIndex?: number;
  correctIndices?: number[];
  acceptedAnswers?: string[];
  blankPlaceholder?: LocalizedString;
  explanation: LocalizedString;
}

export interface TopicConfig {
  id: string;
  name: LocalizedString;
  shortName: LocalizedString;
  icon: string;
}
