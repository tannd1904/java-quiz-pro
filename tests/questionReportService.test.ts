import { describe, it, expect, beforeEach } from 'vitest';
import { questionReportService } from '../src/services/questionReportService';

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

describe('QuestionReportService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no reports exist', () => {
    expect(questionReportService.getReports()).toEqual([]);
    expect(questionReportService.getPendingCount()).toBe(0);
  });

  it('submits a report and retrieves it', () => {
    const report = questionReportService.submitReport({
      questionId: 'oop-01',
      questionTitle: 'Tính chất OOP là gì?',
      reason: 'WRONG_ANSWER',
      comment: 'Đáp án đúng phải là tính đóng gói',
      userLanguage: 'vi',
    });

    expect(report.id).toBeDefined();
    expect(report.status).toBe('PENDING');
    expect(report.questionId).toBe('oop-01');

    const list = questionReportService.getReports();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(report.id);
    expect(questionReportService.getPendingCount()).toBe(1);
  });

  it('resolves and reopens a report', () => {
    const r = questionReportService.submitReport({
      questionId: 'oop-02',
      questionTitle: 'Câu hỏi test',
      reason: 'TYPO_TRANSLATION',
    });

    questionReportService.resolveReport(r.id);
    expect(questionReportService.getPendingCount()).toBe(0);
    expect(questionReportService.getReports()[0].status).toBe('RESOLVED');

    questionReportService.unresolveReport(r.id);
    expect(questionReportService.getPendingCount()).toBe(1);
    expect(questionReportService.getReports()[0].status).toBe('PENDING');
  });

  it('deletes a report', () => {
    const r = questionReportService.submitReport({
      questionId: 'oop-03',
      questionTitle: 'Test delete',
      reason: 'UNCLEAR_EXPLANATION',
    });

    questionReportService.deleteReport(r.id);
    expect(questionReportService.getReports()).toEqual([]);
  });

  it('generates mailto link correctly', () => {
    const r = questionReportService.submitReport({
      questionId: 'oop-04',
      questionTitle: 'Test mailto',
      reason: 'WRONG_ANSWER',
      comment: 'Cần sửa',
      userLanguage: 'vi',
    });

    const link = questionReportService.createMailtoLink(r, 'admin@example.com');
    expect(link.startsWith('mailto:admin@example.com')).toBe(true);
    expect(link.includes('oop-04')).toBe(true);
  });

  it('tracks user reported question IDs on the client device', () => {
    expect(questionReportService.getUserReportedQuestionIds()).toEqual([]);
    expect(questionReportService.isQuestionReportedByUser('q-101')).toBe(false);

    questionReportService.submitReport({
      questionId: 'q-101',
      questionTitle: 'Question 101',
      reason: 'WRONG_ANSWER',
    });

    expect(questionReportService.getUserReportedQuestionIds()).toContain('q-101');
    expect(questionReportService.isQuestionReportedByUser('q-101')).toBe(true);
  });

  it('supports DUPLICATE_QUESTION reason correctly', () => {
    const report = questionReportService.submitReport({
      questionId: 'q-dup-1',
      questionTitle: 'Question duplicate',
      reason: 'DUPLICATE_QUESTION',
      comment: 'Trùng với câu khác',
    });

    expect(report.reason).toBe('DUPLICATE_QUESTION');
    expect(questionReportService.getReasonLabel('DUPLICATE_QUESTION', 'vi')).toBe('Câu hỏi bị trùng lặp');
    expect(questionReportService.getReasonLabel('DUPLICATE_QUESTION', 'en')).toBe('Duplicate question');
  });
});

