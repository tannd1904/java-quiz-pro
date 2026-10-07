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
    topicId: 'encapsulation',
    category: { vi: 'Đóng Gói', en: 'Encapsulation' },
    question: { vi: 'Câu 2', en: 'Question 2' },
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
  it('filters questions by topics', () => {
    const filtered = filterQuestionsByTopics(mockQuestions, ['polymorphism']);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('test-1');
  });

  it('prepares exam session with question slice and option indices', () => {
    const session = prepareExamSession(mockQuestions, {
      selectedTopicIds: ['polymorphism', 'encapsulation'],
      questionCount: 1,
      timeMinutes: 10,
      shuffleOptions: true,
      shuffleQuestions: false
    });

    expect(session.length).toBe(1);
    expect(session[0].shuffledIndices.length).toBe(mockQuestions[0].options.vi.length);
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
});
