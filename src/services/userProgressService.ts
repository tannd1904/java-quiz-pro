import { ExamHistoryItem, ActiveExamSession, PracticeProgressItem, UserAnswer } from '../types/quiz';
import { Question } from '../types/question';

const STORAGE_KEY_EXAM_HISTORY = 'java_quiz_exam_history';
const STORAGE_KEY_ACTIVE_EXAM = 'java_quiz_active_exam_session';
const STORAGE_KEY_PRACTICE_PROGRESS = 'java_quiz_practice_progress';
const STORAGE_KEY_BOOKMARKS = 'java_quiz_bookmarked_questions';

const MAX_HISTORY_ITEMS = 50;

class UserProgressService {
  // =========================================================================
  // 1. EXAM HISTORY
  // =========================================================================

  public getExamHistory(): ExamHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EXAM_HISTORY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }
    } catch (err) {
      console.warn('Failed to load exam history from localStorage:', err);
    }
    return [];
  }

  public saveExamHistory(item: ExamHistoryItem): void {
    try {
      const current = this.getExamHistory();
      // Remove any existing with same id if any, prepend new item
      const updated = [item, ...current.filter((h) => h.id !== item.id)].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY_EXAM_HISTORY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save exam history to localStorage:', err);
    }
  }

  public deleteExamHistoryItem(id: string): void {
    try {
      const current = this.getExamHistory();
      const updated = current.filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEY_EXAM_HISTORY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete exam history item from localStorage:', err);
    }
  }

  public clearExamHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_EXAM_HISTORY);
    } catch (err) {
      console.warn('Failed to clear exam history in localStorage:', err);
    }
  }

  // =========================================================================
  // 2. IN-PROGRESS ACTIVE EXAM SESSION (RESUME FEATURE)
  // =========================================================================

  public getActiveExamSession(): ActiveExamSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACTIVE_EXAM);
      if (!data) return null;
      const parsed: ActiveExamSession = JSON.parse(data);
      if (
        parsed &&
        parsed.items &&
        Array.isArray(parsed.items) &&
        parsed.items.length > 0 &&
        parsed.config &&
        typeof parsed.remainingSeconds === 'number'
      ) {
        // If remaining time has elapsed, discard expired session
        if (parsed.remainingSeconds <= 0) {
          this.clearActiveExamSession();
          return null;
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load active exam session from localStorage:', err);
    }
    return null;
  }

  public saveActiveExamSession(session: ActiveExamSession): void {
    try {
      session.lastSavedAt = Date.now();
      localStorage.setItem(STORAGE_KEY_ACTIVE_EXAM, JSON.stringify(session));
    } catch (err) {
      console.warn('Failed to save active exam session to localStorage:', err);
    }
  }

  public clearActiveExamSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_EXAM);
    } catch (err) {
      console.warn('Failed to clear active exam session from localStorage:', err);
    }
  }

  // =========================================================================
  // 3. PRACTICE PROGRESS (TRACK COMPLETED QUESTIONS)
  // =========================================================================

  public getPracticeProgress(): Record<string, PracticeProgressItem> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PRACTICE_PROGRESS);
      if (!data) return {};
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load practice progress from localStorage:', err);
    }
    return {};
  }

  public savePracticeAnswer(
    questionId: string,
    userAnswer: UserAnswer,
    isCorrect: boolean,
    wrongAttempts?: number[]
  ): PracticeProgressItem {
    const record: PracticeProgressItem = {
      questionId,
      userAnswer,
      selectedOptionIdx: typeof userAnswer === 'number' ? userAnswer : undefined,
      isCorrect,
      answeredAt: Date.now(),
      wrongAttempts,
    };

    try {
      const progress = this.getPracticeProgress();
      progress[questionId] = record;
      localStorage.setItem(STORAGE_KEY_PRACTICE_PROGRESS, JSON.stringify(progress));
    } catch (err) {
      console.warn('Failed to save practice answer to localStorage:', err);
    }

    return record;
  }

  public deletePracticeAnswer(questionId: string): void {
    try {
      const progress = this.getPracticeProgress();
      delete progress[questionId];
      localStorage.setItem(STORAGE_KEY_PRACTICE_PROGRESS, JSON.stringify(progress));
    } catch (err) {
      console.warn('Failed to delete practice answer in localStorage:', err);
    }
  }

  public clearPracticeProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_PRACTICE_PROGRESS);
    } catch (err) {
      console.warn('Failed to clear practice progress from localStorage:', err);
    }
  }

  /**
   * Computes completed count and breakdown by topic.
   */
  public computeTopicProgress(
    questions: Question[],
    progress: Record<string, PracticeProgressItem>
  ): Record<string, { completed: number; total: number; correct: number; wrong: number }> {
    const topicStats: Record<
      string,
      { completed: number; total: number; correct: number; wrong: number }
    > = Object.create(null);

    questions.forEach((q) => {
      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { completed: 0, total: 0, correct: 0, wrong: 0 };
      }
      topicStats[q.topicId].total += 1;

      const p = progress[q.id];
      if (p !== undefined) {
        topicStats[q.topicId].completed += 1;
        if (p.isCorrect) {
          topicStats[q.topicId].correct += 1;
        } else {
          topicStats[q.topicId].wrong += 1;
        }
      }
    });

    return topicStats;
  }

  // =========================================================================
  // 4. BOOKMARKS (FLAGGED QUESTIONS)
  // =========================================================================

  public getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load bookmarks from localStorage:', err);
    }
    return [];
  }

  public isBookmarked(questionId: string): boolean {
    const list = this.getBookmarks();
    return list.includes(questionId);
  }

  public toggleBookmark(questionId: string): boolean {
    try {
      const current = this.getBookmarks();
      const exists = current.includes(questionId);
      const updated = exists
        ? current.filter((id) => id !== questionId)
        : [...current, questionId];
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
      return !exists;
    } catch (err) {
      console.warn('Failed to toggle bookmark in localStorage:', err);
      return false;
    }
  }

  public clearBookmarks(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
    } catch (err) {
      console.warn('Failed to clear bookmarks from localStorage:', err);
    }
  }
}

export const userProgressService = new UserProgressService();
