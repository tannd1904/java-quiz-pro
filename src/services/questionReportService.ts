import { QuestionReport, ReportReason } from '../types/report';

const STORAGE_KEY_REPORTS = 'java_quiz_reported_questions';
export const EVENT_REPORTS_UPDATED = 'java_quiz_reports_updated';

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

  private notifyUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_REPORTS_UPDATED));
    }
  }
}

export const questionReportService = new QuestionReportService();
