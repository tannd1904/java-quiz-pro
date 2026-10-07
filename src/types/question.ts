export type Language = 'vi' | 'en';

export interface LocalizedString {
  vi: string;
  en: string;
}

export interface LocalizedOptions {
  vi: string[];
  en: string[];
}

export interface Question {
  id: string;
  topicId: string;
  category: LocalizedString;
  question: LocalizedString;
  codeSnippet: string | null;
  image: string | null;
  options: LocalizedOptions;
  correctIndex: number;
  explanation: LocalizedString;
}

export interface TopicConfig {
  id: string;
  name: LocalizedString;
  shortName: LocalizedString;
  icon: string;
}
