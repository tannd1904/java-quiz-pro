import { QuestionReport, ReportReason } from '../types/report';

const STORAGE_KEY_REPORTS = 'java_quiz_reported_questions';
const STORAGE_KEY_USER_REPORTED = 'java_quiz_user_reported_questions';
export const EVENT_REPORTS_UPDATED = 'java_quiz_reports_updated';
export const ADMIN_NOTIFICATION_EMAIL = 'tan.nguyenduy@sai-digital.com';

class QuestionReportService {
  public getReports(): QuestionReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => (b.reportedAt || 0) - (a.reportedAt || 0));
      }
    } catch (err) {
      console.warn('Failed to load question reports from localStorage:', err);
    }
    return [];
  }

  public getPendingCount(): number {
    return this.getReports().filter((r) => r.status === 'PENDING').length;
  }

  /**
   * Returns list of question IDs that the current user has reported on this device.
   */
  public getUserReportedQuestionIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER_REPORTED);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load user-reported questions from localStorage:', err);
    }
    return [];
  }

  public isQuestionReportedByUser(questionId: string): boolean {
    const list = this.getUserReportedQuestionIds();
    return list.includes(questionId);
  }

  public submitReport(params: {
    questionId: string;
    questionTitle: string;
    reason: ReportReason;
    comment?: string;
    userLanguage?: 'vi' | 'en';
  }): QuestionReport {
    const newReport: QuestionReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      questionId: params.questionId,
      questionTitle: params.questionTitle,
      reason: params.reason,
      comment: params.comment ? params.comment.trim() : undefined,
      reportedAt: Date.now(),
      userLanguage: params.userLanguage || 'vi',
      status: 'PENDING',
    };

    try {
      const current = this.getReports();
      const updated = [newReport, ...current];
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));

      // Mark this question as reported on the current user's device
      const userReported = this.getUserReportedQuestionIds();
      if (!userReported.includes(params.questionId)) {
        localStorage.setItem(
          STORAGE_KEY_USER_REPORTED,
          JSON.stringify([...userReported, params.questionId])
        );
      }

      this.notifyUpdate();
    } catch (err) {
      console.warn('Failed to save question report to localStorage:', err);
    }

    return newReport;
  }

  public resolveReport(reportId: string): void {
    try {
      const current = this.getReports();
      const updated = current.map((r) =>
        r.id === reportId ? { ...r, status: 'RESOLVED' as const } : r
      );
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
      this.notifyUpdate();
    } catch (err) {
      console.warn('Failed to resolve question report in localStorage:', err);
    }
  }

  public unresolveReport(reportId: string): void {
    try {
      const current = this.getReports();
      const updated = current.map((r) =>
        r.id === reportId ? { ...r, status: 'PENDING' as const } : r
      );
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
      this.notifyUpdate();
    } catch (err) {
      console.warn('Failed to reopen question report in localStorage:', err);
    }
  }

  public deleteReport(reportId: string): void {
    try {
      const current = this.getReports();
      const updated = current.filter((r) => r.id !== reportId);
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
      this.notifyUpdate();
    } catch (err) {
      console.warn('Failed to delete question report in localStorage:', err);
    }
  }

  public clearAllReports(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_REPORTS);
      this.notifyUpdate();
    } catch (err) {
      console.warn('Failed to clear question reports in localStorage:', err);
    }
  }

  public exportReportsJson(): string {
    return JSON.stringify(this.getReports(), null, 2);
  }

  public createMailtoLink(
    report: QuestionReport,
    adminEmail: string = 'admin@javaquizpro.com'
  ): string {
    const subject = encodeURIComponent(`[Java Quiz Report] Báo lỗi câu hỏi #${report.questionId}`);
    const body = encodeURIComponent(
      `Chào Quản trị viên,\n\nTôi muốn báo lỗi câu hỏi sau:\n` +
      `- Mã câu hỏi: ${report.questionId}\n` +
      `- Nội dung: ${report.questionTitle}\n` +
      `- Lý do báo cáo: ${this.getReasonLabel(report.reason, report.userLanguage || 'vi')}\n` +
      (report.comment ? `- Ghi chú chi tiết: ${report.comment}\n` : '') +
      `- Thời gian: ${new Date(report.reportedAt).toLocaleString('vi-VN')}\n\n` +
      `Trân trọng!`
    );
    return `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  }

  public getReasonLabel(reason: ReportReason, lang: 'vi' | 'en' = 'vi'): string {
    const labels: Record<ReportReason, { vi: string; en: string }> = {
      WRONG_ANSWER: {
        vi: 'Sai đáp án được chỉ định',
        en: 'Incorrect marked answer',
      },
      TYPO_TRANSLATION: {
        vi: 'Lỗi chính tả / dịch thuật',
        en: 'Typo / translation error',
      },
      UNCLEAR_EXPLANATION: {
        vi: 'Giải thích chưa chuẩn / khó hiểu',
        en: 'Unclear or inaccurate explanation',
      },
      OUTDATED_OR_OTHER: {
        vi: 'Lỗi hiển thị / nội dung khác',
        en: 'Display or other content issue',
      },
    };
    return labels[reason]?.[lang] || reason;
  }

  /**
   * Silently sends the report payload to the administrator's email in the background
   * using a serverless endpoint without user interaction or popup.
   */
  public async sendReportEmailSilent(report: QuestionReport): Promise<boolean> {
    try {
      const reasonLabel = this.getReasonLabel(report.reason, report.userLanguage || 'vi');
      const payload = {
        _subject: `[Java Quiz Pro] Báo lỗi câu hỏi #${report.questionId} (${reasonLabel})`,
        _template: 'table',
        _captcha: 'false',
        'Mã câu hỏi': report.questionId,
        'Nội dung tóm tắt': report.questionTitle,
        'Lý do báo lỗi': reasonLabel,
        'Ghi chú của người dùng': report.comment || '(Không có)',
        'Ngôn ngữ': report.userLanguage === 'en' ? 'English' : 'Tiếng Việt',
        'Thời gian gửi': new Date(report.reportedAt).toLocaleString('vi-VN'),
        'Đường dẫn web': typeof window !== 'undefined' ? window.location.href : 'Java Quiz Pro',
      };

      const res = await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return res.ok;
    } catch (err) {
      console.warn('Silent email delivery failed, report is stored locally:', err);
      return false;
    }
  }

  private notifyUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_REPORTS_UPDATED));
    }
  }
}

export const questionReportService = new QuestionReportService();
