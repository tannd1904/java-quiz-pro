import { Language } from '../types/question';
import { Theme } from '../types/theme';

export interface AppConfig {
  ENABLE_PRACTICE_MODE: boolean;
  DEFAULT_LANGUAGE: Language;
  DEFAULT_THEME: Theme;
  EXAM_QUESTION_COUNT: number;
  EXAM_TIME_MINUTES: number;
  PASSING_SCORE_PERCENT: number;
  SHUFFLE_OPTIONS: boolean;
  SHUFFLE_QUESTIONS: boolean;
  APP_TITLE: {
    vi: string;
    en: string;
  };
  SUBTITLE: {
    vi: string;
    en: string;
  };
}

export const APP_CONFIG: AppConfig = {
  ENABLE_PRACTICE_MODE: false,
  DEFAULT_LANGUAGE: 'vi',
  DEFAULT_THEME: 'dark',
  EXAM_QUESTION_COUNT: 40,
  EXAM_TIME_MINUTES: 45,
  PASSING_SCORE_PERCENT: 70,
  SHUFFLE_OPTIONS: true,
  SHUFFLE_QUESTIONS: true,
  APP_TITLE: {
    vi: "HỆ THỐNG LUYỆN THI TRẮC NGHIỆM JAVA ONLINE",
    en: "JAVA PRO ONLINE QUIZ & CERTIFICATION PLATFORM"
  },
  SUBTITLE: {
    vi: "Ngân hàng 340+ câu hỏi Java & OOP chuyên sâu có giải thích chi tiết",
    en: "Comprehensive 340+ Java & Advanced OOP Question Bank with In-Depth Explanations"
  }
};
