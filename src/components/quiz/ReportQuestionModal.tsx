import React, { useState } from 'react';
import { Question } from '../../types/question';
import { ReportReason, QuestionReport } from '../../types/report';
import { questionReportService } from '../../services/questionReportService';
import { useI18n } from '../../hooks/useI18n';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle, CheckCircle2, Flag, Mail, Send, XCircle } from 'lucide-react';

interface ReportQuestionModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onReportSubmitted?: (report: QuestionReport) => void;
}

export const ReportQuestionModal: React.FC<ReportQuestionModalProps> = ({
  isOpen,
  question,
  onClose,
  onReportSubmitted,
}) => {
  const { language } = useI18n();

  const [selectedReason, setSelectedReason] = useState<ReportReason>('WRONG_ANSWER');
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastReport, setLastReport] = useState<QuestionReport | null>(null);

  if (!isOpen || !question) return null;

  const questionTitle =
    language === 'en' && question.question.en ? question.question.en : question.question.vi;

  const reasonOptions: Array<{
    id: ReportReason;
    title: { vi: string; en: string };
    desc: { vi: string; en: string };
  }> = [
    {
      id: 'WRONG_ANSWER',
      title: { vi: 'Sai đáp án đúng', en: 'Incorrect correct answer' },
      desc: {
        vi: 'Hệ thống chấm sai, hoặc đáp án chỉ định không chính xác theo chuẩn Java.',
        en: 'The marked correct answer is wrong according to standard Java specification.',
      },
    },
    {
      id: 'TYPO_TRANSLATION',
      title: { vi: 'Lỗi chính tả / dịch thuật', en: 'Typo or translation error' },
      desc: {
        vi: 'Nội dung câu hỏi hoặc đáp án có lỗi gõ phím, ngữ pháp hoặc dịch chưa chuẩn.',
        en: 'Question or option text has typos, grammatical flaws, or improper translation.',
      },
    },
    {
      id: 'UNCLEAR_EXPLANATION',
      title: { vi: 'Giải thích chưa chuẩn / khó hiểu', en: 'Confusing explanation' },
      desc: {
        vi: 'Phần giải thích chi tiết chưa đúng trọng tâm hoặc gây nhầm lẫn.',
        en: 'The detailed explanation is misleading, incomplete, or hard to follow.',
      },
    },
    {
      id: 'OUTDATED_OR_OTHER',
      title: { vi: 'Lỗi hiển thị / Vấn đề khác', en: 'Display issue or other' },
      desc: {
        vi: 'Lỗi đoạn code snippet, hình ảnh không load hoặc câu hỏi bị trùng lặp.',
        en: 'Code snippet formatting issue, missing asset, or duplicate question.',
      },
    },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const report = questionReportService.submitReport({
      questionId: question.id,
      questionTitle: questionTitle.substring(0, 140),
      reason: selectedReason,
      comment: comment.trim(),
      userLanguage: language as 'vi' | 'en',
    });

    // Silently send email in the background to admin
    questionReportService.sendReportEmailSilent(report);

    setLastReport(report);
    setIsSubmitted(true);
    if (onReportSubmitted) {
      onReportSubmitted(report);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setComment('');
    setSelectedReason('WRONG_ANSWER');
    setLastReport(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flag size={20} color="var(--brand-primary)" />
          <span>
            {language === 'en'
              ? `Report Issue: #${question.id}`
              : `Báo lỗi câu hỏi: #${question.id}`}
          </span>
        </div>
      }
      maxWidth="560px"
    >
      {isSubmitted ? (
        <div style={{ textAlign: 'center', padding: '16px 8px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--state-success-subtle)',
              color: 'var(--state-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            {language === 'en' ? 'Report Received!' : 'Đã ghi nhận báo lỗi thành công!'}
          </h3>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: '420px',
              margin: '0 auto 20px',
            }}
          >
            {language === 'en'
              ? 'Thank you for your feedback! This question has been marked on your device. The administrator will review and update it promptly.'
              : 'Cảm ơn bạn đã đóng góp! Câu hỏi này đã được đánh dấu báo lỗi trên máy của bạn. Quản trị viên sẽ kiểm tra và cập nhật sớm nhất.'}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button variant="primary" onClick={handleResetAndClose}>
              {language === 'en' ? 'Close' : 'Đóng'}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Question snippet preview */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              {language === 'en' ? 'Question Preview' : 'Xem trước câu hỏi'}
            </div>
            <div
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                fontWeight: 500,
                lineHeight: 1.45,
                maxHeight: '75px',
                overflowY: 'auto',
              }}
            >
              {questionTitle}
            </div>
          </div>

          {/* Reason options */}
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '10px',
              }}
            >
              {language === 'en' ? 'Select Issue Type:' : 'Chọn loại lỗi bạn phát hiện:'}
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reasonOptions.map((opt) => {
                const isSelected = selectedReason === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedReason(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${
                        isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'
                      }`,
                      backgroundColor: isSelected
                        ? 'var(--brand-primary-subtle)'
                        : 'var(--bg-surface)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <input
                      type="radio"
                      id={`reason-${opt.id}`}
                      name="reportReason"
                      checked={isSelected}
                      onChange={() => setSelectedReason(opt.id)}
                      style={{ marginTop: '3px', accentColor: 'var(--brand-primary)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                        }}
                      >
                        {opt.title[language as 'vi' | 'en'] || opt.title.vi}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '2px',
                          lineHeight: 1.35,
                        }}
                      >
                        {opt.desc[language as 'vi' | 'en'] || opt.desc.vi}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comment / Note textarea */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="report-comment"
              style={{
                display: 'block',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              {language === 'en' ? 'Detailed Note (Optional):' : 'Mô tả chi tiết lỗi (tùy chọn):'}
            </label>
            <textarea
              id="report-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'E.g., option C should be correct because Java 8 allows default methods...'
                  : 'Ví dụ: Đáp án B mới đúng vì theo Java 8 interface đã cho phép default method...'
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                lineHeight: 1.45,
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={handleResetAndClose} type="button">
              {language === 'en' ? 'Cancel' : 'Hủy bỏ'}
            </Button>
            <Button variant="primary" type="submit">
              <Send size={15} style={{ marginRight: '6px' }} />
              <span>{language === 'en' ? 'Submit Report' : 'Gửi báo cáo'}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
