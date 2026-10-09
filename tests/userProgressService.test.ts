import { describe, it, expect, beforeEach } from 'vitest';
import { userProgressService } from '../src/services/userProgressService';
import { ExamHistoryItem, ActiveExamSession } from '../src/types/quiz';
import { Question } from '../src/types/question';

// In-memory mock for Node.js test environment
const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, String(value)),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
};
// @ts-ignore
globalThis.localStorage = localStorageMock;

describe('userProgressService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Exam History', () => {
    it('returns empty array when no history exists', () => {
      expect(userProgressService.getExamHistory()).toEqual([]);
    });

    it('saves and retrieves exam history sorted by newest timestamp', () => {
      const item1: ExamHistoryItem = {
        id: 'exam-1',
        timestamp: 1000,
        config: {
          selectedTopicIds: ['encapsulation'],
          questionCount: 10,
          timeMinutes: 15,
          shuffleOptions: true,
          shuffleQuestions: true,
        },
        result: {
          total: 10,
          correctCount: 8,
          wrongCount: 2,
          skippedCount: 0,
          score10: 8,
          percentage: 80,
          isPassed: true,
          timeSpentSeconds: 300,
          timeSpentFormatted: '05:00',
          reviewList: [],
          selectedTopicIds: ['encapsulation'],
        },
      };

      const item2: ExamHistoryItem = {
        id: 'exam-2',
        timestamp: 2000,
        config: {
          selectedTopicIds: ['inheritance'],
          questionCount: 5,
          timeMinutes: 10,
          shuffleOptions: true,
          shuffleQuestions: true,
        },
        result: {
          total: 5,
          correctCount: 4,
          wrongCount: 1,
          skippedCount: 0,
          score10: 8,
          percentage: 80,
          isPassed: true,
          timeSpentSeconds: 200,
          timeSpentFormatted: '03:20',
          reviewList: [],
          selectedTopicIds: ['inheritance'],
        },
      };

      userProgressService.saveExamHistory(item1);
      userProgressService.saveExamHistory(item2);

      const history = userProgressService.getExamHistory();
      expect(history.length).toBe(2);
      expect(history[0].id).toBe('exam-2'); // Newest first
      expect(history[1].id).toBe('exam-1');
    });

    it('deletes an individual exam history item', () => {
      const item: ExamHistoryItem = {
        id: 'exam-del',
        timestamp: 1500,
        config: {
          selectedTopicIds: ['exception'],
          questionCount: 5,
          timeMinutes: 5,
          shuffleOptions: false,
          shuffleQuestions: false,
        },
        result: {
          total: 5,
          correctCount: 5,
          wrongCount: 0,
          skippedCount: 0,
          score10: 10,
          percentage: 100,
          isPassed: true,
          timeSpentSeconds: 120,
          timeSpentFormatted: '02:00',
          reviewList: [],
          selectedTopicIds: ['exception'],
        },
      };

      userProgressService.saveExamHistory(item);
      expect(userProgressService.getExamHistory().length).toBe(1);

      userProgressService.deleteExamHistoryItem('exam-del');
      expect(userProgressService.getExamHistory().length).toBe(0);
    });

    it('clears all exam history', () => {
      const item: ExamHistoryItem = {
        id: 'exam-clear',
        timestamp: 1500,
        config: {
          selectedTopicIds: ['interface'],
          questionCount: 5,
          timeMinutes: 5,
          shuffleOptions: false,
          shuffleQuestions: false,
        },
        result: {
          total: 5,
          correctCount: 3,
          wrongCount: 2,
          skippedCount: 0,
          score10: 6,
          percentage: 60,
          isPassed: false,
          timeSpentSeconds: 150,
          timeSpentFormatted: '02:30',
          reviewList: [],
          selectedTopicIds: ['interface'],
        },
      };

      userProgressService.saveExamHistory(item);
      userProgressService.clearExamHistory();
      expect(userProgressService.getExamHistory()).toEqual([]);
    });
  });

  describe('Active Exam Session (Resume Feature)', () => {
    it('returns null when no active session exists', () => {
      expect(userProgressService.getActiveExamSession()).toBeNull();
    });

    it('saves and restores active exam session', () => {
      const mockSession: ActiveExamSession = {
        id: 'active-1',
        items: [
          {
            question: {
              id: 'q-1',
              topicId: 'encapsulation',
              category: { vi: 'OOP', en: 'OOP' },
              question: { vi: 'Hỏi', en: 'Question' },
              codeSnippet: null,
              image: null,
              options: { vi: ['A', 'B', 'C', 'D'], en: ['A', 'B', 'C', 'D'] },
              correctIndex: 0,
              explanation: { vi: 'Giải', en: 'Explanation' },
            },
            shuffledIndices: [0, 1, 2, 3],
            originalCorrectIndex: 0,
          },
        ],
        config: {
          selectedTopicIds: ['encapsulation'],
          questionCount: 1,
          timeMinutes: 10,
          shuffleOptions: true,
          shuffleQuestions: true,
        },
        answers: { 'q-1': 0 },
        currentIndex: 0,
        remainingSeconds: 450,
        startedAt: 1000,
        lastSavedAt: 1050,
      };

      userProgressService.saveActiveExamSession(mockSession);
      const restored = userProgressService.getActiveExamSession();
      expect(restored).not.toBeNull();
      expect(restored?.answers['q-1']).toBe(0);
      expect(restored?.remainingSeconds).toBe(450);
    });

    it('discards expired active session when remainingSeconds <= 0', () => {
      const expiredSession: ActiveExamSession = {
        id: 'active-expired',
        items: [
          {
            question: {
              id: 'q-1',
              topicId: 'encapsulation',
              category: { vi: 'OOP', en: 'OOP' },
              question: { vi: 'Hỏi', en: 'Question' },
              codeSnippet: null,
              image: null,
              options: { vi: ['A', 'B'], en: ['A', 'B'] },
              correctIndex: 0,
              explanation: { vi: 'Giải', en: 'Explanation' },
            },
            shuffledIndices: [0, 1],
            originalCorrectIndex: 0,
          },
        ],
        config: {
          selectedTopicIds: ['encapsulation'],
          questionCount: 1,
          timeMinutes: 5,
          shuffleOptions: false,
          shuffleQuestions: false,
        },
        answers: {},
        currentIndex: 0,
        remainingSeconds: 0,
        startedAt: 1000,
        lastSavedAt: 1300,
      };

      userProgressService.saveActiveExamSession(expiredSession);
      expect(userProgressService.getActiveExamSession()).toBeNull();
    });

    it('clears active exam session', () => {
      const session: ActiveExamSession = {
        id: 'active-clear',
        items: [
          {
            question: {
              id: 'q-2',
              topicId: 'polymorphism',
              category: { vi: 'OOP', en: 'OOP' },
              question: { vi: 'Hỏi', en: 'Question' },
              codeSnippet: null,
              image: null,
              options: { vi: ['A', 'B'], en: ['A', 'B'] },
              correctIndex: 0,
              explanation: { vi: 'Giải', en: 'Explanation' },
            },
            shuffledIndices: [0, 1],
            originalCorrectIndex: 0,
          },
        ],
        config: {
          selectedTopicIds: ['polymorphism'],
          questionCount: 1,
          timeMinutes: 5,
          shuffleOptions: false,
          shuffleQuestions: false,
        },
        answers: {},
        currentIndex: 0,
        remainingSeconds: 200,
        startedAt: 1000,
        lastSavedAt: 1050,
      };

      userProgressService.saveActiveExamSession(session);
      userProgressService.clearActiveExamSession();
      expect(userProgressService.getActiveExamSession()).toBeNull();
    });
  });

  describe('Practice Progress', () => {
    it('saves and retrieves practice answer records', () => {
      userProgressService.savePracticeAnswer('midterm-obj-001', 1, true);
      userProgressService.savePracticeAnswer('midterm-obj-002', 2, false);

      const progress = userProgressService.getPracticeProgress();
      expect(progress['midterm-obj-001']).toBeDefined();
      expect(progress['midterm-obj-001'].isCorrect).toBe(true);
      expect(progress['midterm-obj-002'].isCorrect).toBe(false);
    });

    it('computes completed topic stats correctly', () => {
      const mockQuestions: Question[] = [
        {
          id: 'q-a',
          topicId: 'objects_classes',
          category: { vi: 'OOP', en: 'OOP' },
          question: { vi: 'Q1', en: 'Q1' },
          codeSnippet: null,
          image: null,
          options: { vi: ['A', 'B'], en: ['A', 'B'] },
          correctIndex: 0,
          explanation: { vi: 'E', en: 'E' },
        },
        {
          id: 'q-b',
          topicId: 'objects_classes',
          category: { vi: 'OOP', en: 'OOP' },
          question: { vi: 'Q2', en: 'Q2' },
          codeSnippet: null,
          image: null,
          options: { vi: ['A', 'B'], en: ['A', 'B'] },
          correctIndex: 0,
          explanation: { vi: 'E', en: 'E' },
        },
        {
          id: 'q-c',
          topicId: 'lambda',
          category: { vi: 'OOP', en: 'OOP' },
          question: { vi: 'Q3', en: 'Q3' },
          codeSnippet: null,
          image: null,
          options: { vi: ['A', 'B'], en: ['A', 'B'] },
          correctIndex: 0,
          explanation: { vi: 'E', en: 'E' },
        },
      ];

      userProgressService.savePracticeAnswer('q-a', 0, true);

      const progress = userProgressService.getPracticeProgress();
      const topicStats = userProgressService.computeTopicProgress(mockQuestions, progress);

      expect(topicStats['objects_classes'].completed).toBe(1);
      expect(topicStats['objects_classes'].total).toBe(2);
      expect(topicStats['objects_classes'].correct).toBe(1);

      expect(topicStats['lambda'].completed).toBe(0);
      expect(topicStats['lambda'].total).toBe(1);
    });

    it('clears all practice progress', () => {
      userProgressService.savePracticeAnswer('q-x', 0, true);
      userProgressService.clearPracticeProgress();
      expect(userProgressService.getPracticeProgress()).toEqual({});
    });
  });
});
