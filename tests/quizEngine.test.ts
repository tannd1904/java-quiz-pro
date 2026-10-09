import { describe, it, expect } from 'vitest';
import {
  shuffleArray,
  filterQuestionsByTopics,
  prepareExamSession,
  calculateExamResult
} from '../src/services/quizEngine';
import { Question } from '../src/types/question';

const mockQuestions: Question[] = [
  {
    id: 'test-1',
    topicId: 'polymorphism',
    category: { vi: 'Đa Hình', en: 'Polymorphism' },
    question: { vi: 'Câu 1', en: 'Question 1' },
    codeSnippet: null,
    image: null,
    options: {
      vi: ['A', 'B', 'C', 'D'],
      en: ['A', 'B', 'C', 'D']
    },
    correctIndex: 1, // 'B'
    explanation: { vi: 'Giải thích 1', en: 'Explanation 1' }
  },
  {
    id: 'test-2',
    topicId: 'constructor',
    category: { vi: 'Hàm Tạo', en: 'Constructors' },
    question: { vi: 'Câu Constructor', en: 'Constructor Question' },
    codeSnippet: null,
    image: null,
    options: {
      vi: ['X', 'Y', 'Z'],
      en: ['X', 'Y', 'Z']
    },
    correctIndex: 0, // 'X'
    explanation: { vi: 'Giải thích 2', en: 'Explanation 2' }
  }
];

describe('quizEngine', () => {
  it('filters questions by topics including constructor topic', () => {
    const filtered = filterQuestionsByTopics(mockQuestions, ['constructor']);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('test-2');
  });

  it('prepares exam session with question slice and option indices', () => {
    const session = prepareExamSession(mockQuestions, {
      selectedTopicIds: ['polymorphism', 'constructor'],
      questionCount: 1,
      timeMinutes: 10,
      shuffleOptions: true,
      shuffleQuestions: false
    });

    expect(session.length).toBe(1);
    expect(session[0].shuffledIndices.length).toBe(mockQuestions[0].options.vi.length);
  });

  it('gracefully handles non-finite or NaN questionCount without returning empty', () => {
    const session = prepareExamSession(mockQuestions, {
      selectedTopicIds: ['constructor'],
      questionCount: NaN,
      timeMinutes: 10,
      shuffleOptions: false,
      shuffleQuestions: false
    });

    expect(session.length).toBe(1);
    expect(session[0].question.id).toBe('test-2');
  });

  it('calculates score correctly when user selects correct shuffled option', () => {
    const session = prepareExamSession(mockQuestions, {
      selectedTopicIds: ['polymorphism'],
      questionCount: 1,
      timeMinutes: 10,
      shuffleOptions: false,
      shuffleQuestions: false
    });

    // Option B is at index 1
    const result = calculateExamResult(session, { 'test-1': 1 }, 600, 500, ['polymorphism']);
    expect(result.correctCount).toBe(1);
    expect(result.wrongCount).toBe(0);
    expect(result.score10).toBe(10);
    expect(result.isPassed).toBe(true);
  });

  describe('new question types evaluation', () => {
    it('evaluates MULTIPLE_CHOICE questions correctly', () => {
      const multiQ: Question = {
        id: 'multi-1',
        topicId: 'interface',
        type: 'MULTIPLE_CHOICE',
        category: { vi: 'Interface', en: 'Interface' },
        question: { vi: 'Chọn các đáp án đúng', en: 'Select all correct answers' },
        codeSnippet: null,
        image: null,
        options: {
          vi: ['Opt 0', 'Opt 1', 'Opt 2', 'Opt 3'],
          en: ['Opt 0', 'Opt 1', 'Opt 2', 'Opt 3']
        },
        correctIndices: [0, 2], // 0 and 2 are correct
        explanation: { vi: 'Giải thích', en: 'Explanation' }
      };

      const sessionItem = {
        question: multiQ,
        shuffledIndices: [2, 0, 1, 3] // shuffled 0 -> orig 2, shuffled 1 -> orig 0
      };

      // Shuffled indices [0, 1] map to original [2, 0] -> matches [0, 2]
      const resCorrect = calculateExamResult([sessionItem], { 'multi-1': [0, 1] }, 600, 500, ['interface']);
      expect(resCorrect.correctCount).toBe(1);
      expect(resCorrect.reviewList[0].isCorrect).toBe(true);
      expect(resCorrect.reviewList[0].selectedOriginalIndices).toEqual([2, 0]);

      // Only partial selection [0] -> maps to orig [2] -> wrong
      const resPartial = calculateExamResult([sessionItem], { 'multi-1': [0] }, 600, 500, ['interface']);
      expect(resPartial.correctCount).toBe(0);
      expect(resPartial.wrongCount).toBe(1);
      expect(resPartial.reviewList[0].isCorrect).toBe(false);

      // Extra incorrect selection [0, 1, 2] -> wrong
      const resExtra = calculateExamResult([sessionItem], { 'multi-1': [0, 1, 2] }, 600, 500, ['interface']);
      expect(resExtra.correctCount).toBe(0);
      expect(resExtra.wrongCount).toBe(1);
    });

    it('evaluates FILL_BLANK questions with case-insensitivity and whitespace trimming', () => {
      const blankQ: Question = {
        id: 'blank-1',
        topicId: 'polymorphism',
        type: 'FILL_BLANK',
        category: { vi: 'Đa Hình', en: 'Polymorphism' },
        question: { vi: 'Output của đoạn code là gì?', en: 'What is the output?' },
        codeSnippet: 'System.out.println("Hello");',
        image: null,
        options: { vi: [], en: [] },
        acceptedAnswers: ['Hello', 'hello'],
        explanation: { vi: 'In ra Hello', en: 'Prints Hello' }
      };

      const sessionItem = {
        question: blankQ,
        shuffledIndices: []
      };

      // Exact match
      const resExact = calculateExamResult([sessionItem], { 'blank-1': 'Hello' }, 600, 500, ['polymorphism']);
      expect(resExact.correctCount).toBe(1);
      expect(resExact.reviewList[0].isCorrect).toBe(true);

      // Case-insensitive & trimmed match
      const resTrimmed = calculateExamResult([sessionItem], { 'blank-1': '  HELLO  ' }, 600, 500, ['polymorphism']);
      expect(resTrimmed.correctCount).toBe(1);
      expect(resTrimmed.reviewList[0].isCorrect).toBe(true);

      // Wrong text
      const resWrong = calculateExamResult([sessionItem], { 'blank-1': 'World' }, 600, 500, ['polymorphism']);
      expect(resWrong.correctCount).toBe(0);
      expect(resWrong.wrongCount).toBe(1);
      expect(resWrong.reviewList[0].isCorrect).toBe(false);

      // Empty text is counted as skipped
      const resEmpty = calculateExamResult([sessionItem], { 'blank-1': '   ' }, 600, 500, ['polymorphism']);
      expect(resEmpty.skippedCount).toBe(1);
    });

    it('evaluates TRUE_FALSE questions and ensures prepareExamSession does not shuffle them', () => {
      const tfQ: Question = {
        id: 'tf-1',
        topicId: 'objects_classes',
        type: 'TRUE_FALSE',
        category: { vi: 'Objects & Classes', en: 'Objects & Classes' },
        question: { vi: 'Java có hỗ trợ đa kế thừa lớp hay không?', en: 'Does Java support multiple class inheritance?' },
        codeSnippet: null,
        image: null,
        options: {
          vi: ['Đúng', 'Sai'],
          en: ['True', 'False']
        },
        correctIndex: 1, // 'Sai' / 'False'
        explanation: { vi: 'Java không hỗ trợ đa kế thừa lớp', en: 'Java does not support multiple class inheritance' }
      };

      const session = prepareExamSession([tfQ], {
        selectedTopicIds: ['objects_classes'],
        questionCount: 1,
        timeMinutes: 10,
        shuffleOptions: true,
        shuffleQuestions: false
      });

      // Shuffled indices for TRUE_FALSE must remain [0, 1]
      expect(session[0].shuffledIndices).toEqual([0, 1]);

      const res = calculateExamResult(session, { 'tf-1': 1 }, 600, 500, ['objects_classes']);
      expect(res.correctCount).toBe(1);
      expect(res.reviewList[0].isCorrect).toBe(true);
    });

    it('guarantees balanced representation of new question types in prepareExamSession', () => {
      const mixedPool: Question[] = [
        ...mockQuestions, // 2 single choice in polymorphism & constructor
        {
          id: 'multi-x',
          topicId: 'constructor',
          type: 'MULTIPLE_CHOICE',
          category: { vi: 'C', en: 'C' },
          question: { vi: 'Q1', en: 'Q1' },
          codeSnippet: null,
          image: null,
          options: { vi: ['A', 'B'], en: ['A', 'B'] },
          correctIndices: [0, 1],
          explanation: { vi: 'E', en: 'E' }
        },
        {
          id: 'fb-x',
          topicId: 'constructor',
          type: 'FILL_BLANK',
          category: { vi: 'C', en: 'C' },
          question: { vi: 'Q2', en: 'Q2' },
          codeSnippet: null,
          image: null,
          options: { vi: [], en: [] },
          acceptedAnswers: ['ans'],
          explanation: { vi: 'E', en: 'E' }
        }
      ];

      const session = prepareExamSession(mixedPool, {
        selectedTopicIds: ['constructor'],
        questionCount: 2,
        timeMinutes: 10,
        shuffleOptions: false,
        shuffleQuestions: false
      });

      expect(session.length).toBe(2);
      const specialCount = session.filter(s => s.question.type && s.question.type !== 'SINGLE_CHOICE').length;
      expect(specialCount).toBeGreaterThanOrEqual(1);
    });
  });
});
