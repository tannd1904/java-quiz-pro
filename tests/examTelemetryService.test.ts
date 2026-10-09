import { describe, it, expect, beforeEach } from 'vitest';
import { examTelemetryService } from '../src/services/examTelemetryService';
import { ExamResult, ExamSetupConfig } from '../src/types/quiz';

// In-memory localStorage mock for Node.js test environment
const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, String(value)),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
};
// @ts-ignore
globalThis.localStorage = localStorageMock;

describe('ExamTelemetryService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates and persists a unique device ID', () => {
    const devId1 = examTelemetryService.getDeviceId();
    expect(devId1.startsWith('DEV-')).toBe(true);

    // Subsequent calls return the same ID
    const devId2 = examTelemetryService.getDeviceId();
    expect(devId2).toBe(devId1);
  });

  it('handles candidate name correctly', () => {
    expect(examTelemetryService.getCandidateName()).toBe('');
    expect(examTelemetryService.getEffectiveCandidateName().startsWith('Thí sinh ẩn danh')).toBe(true);

    examTelemetryService.setCandidateName('Nguyễn Văn A');
    expect(examTelemetryService.getCandidateName()).toBe('Nguyễn Văn A');
    expect(examTelemetryService.getEffectiveCandidateName()).toBe('Nguyễn Văn A');
  });

  it('manages Google Sheet webhook URL', () => {
    expect(examTelemetryService.getSheetWebhookUrl().startsWith('https://script.google.com/macros/s/')).toBe(true);

    examTelemetryService.setSheetWebhookUrl('https://script.google.com/macros/s/xyz/exec');
    expect(examTelemetryService.getSheetWebhookUrl()).toBe('https://script.google.com/macros/s/xyz/exec');
  });

  it('detects device and environment metadata', () => {
    const device = examTelemetryService.getDeviceInfo();
    expect(device).toHaveProperty('deviceType');
    expect(device).toHaveProperty('os');
    expect(device).toHaveProperty('browser');
    expect(device).toHaveProperty('screen');
  });

  it('does not throw when sending exam result without configured webhook', async () => {
    const mockResult: ExamResult = {
      total: 10,
      correctCount: 8,
      wrongCount: 2,
      skippedCount: 0,
      score10: 8.0,
      percentage: 80,
      isPassed: true,
      timeSpentSeconds: 600,
      timeSpentFormatted: '10:00',
      reviewList: [],
      selectedTopicIds: ['encapsulation'],
    };

    const mockConfig: ExamSetupConfig = {
      selectedTopicIds: ['encapsulation'],
      questionCount: 10,
      timeMinutes: 10,
      shuffleOptions: true,
      shuffleQuestions: true,
    };

    // Test when webhook is explicitly disabled/empty
    examTelemetryService.setSheetWebhookUrl('   ');
    const res = await examTelemetryService.sendExamResult(mockResult, mockConfig);
    expect(res).toBe(false); // Returns false cleanly when no webhook URL is set
  });
});
