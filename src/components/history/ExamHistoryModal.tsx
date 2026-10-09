import React from 'react';
import { ExamHistoryItem } from '../../types/quiz';
import { useI18n } from '../../hooks/useI18n';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Award, Clock, Calendar, CheckCircle2, XCircle, Trash2, Eye, History } from 'lucide-react';

interface ExamHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: ExamHistoryItem[];
  onSelectReview: (item: ExamHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const ExamHistoryModal: React.FC<ExamHistoryModalProps> = ({
  isOpen,
  onClose,
  historyList,
  onSelectReview,
  onDeleteItem,
  onClearAll,
}) => {
  const { language } = useI18n();

  const formatDate = (timestamp: number) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleString(language === 'en' ? 'en-US' : 'vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={20} color="var(--brand-primary)" />
          <span>{language === 'en' ? 'Exam History' : 'Lịch Sử Làm Bài Thi'}</span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--brand-primary-subtle)',
              color: 'var(--brand-primary)',
            }}
          >
            {historyList.length}
          </span>
        </div>
      }
      maxWidth="760px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          {historyList.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={() => {
                if (
                  window.confirm(
                    language === 'en'
                      ? 'Are you sure you want to clear all exam history?'
                      : 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử các bài thi đã làm?'
                  )
                ) {
                  onClearAll();
                }
              }}
              style={{ color: 'var(--state-error)', borderColor: 'var(--state-error-border)' }}
            >
              {language === 'en' ? 'Clear All History' : 'Xóa toàn bộ lịch sử'}
            </Button>
          ) : (
            <div />
          )}
          <Button variant="primary" size="sm" onClick={onClose}>
            {language === 'en' ? 'Close' : 'Đóng'}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '65vh', overflowY: 'auto' }}>
        {historyList.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <History size={26} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {language === 'en' ? 'No Exam Attempts Yet' : 'Chưa có lịch sử bài thi'}
            </div>
            <p style={{ fontSize: '0.85rem', maxWidth: '380px' }}>
              {language === 'en'
                ? 'Complete an exam test to see your performance results, scores, and review answers here.'
                : 'Hãy hoàn thành một bài thi thử để kết quả điểm số, thời gian làm bài và chi tiết lời giải được lưu trữ tại đây.'}
            </p>
          </div>
        ) : (
          historyList.map((item, index) => {
            const res = item.result;
            const isPassed = res.isPassed;

            return (
              <div
                key={item.id || index}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                {/* Header row: Date & Passed Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: isPassed ? 'var(--state-success-subtle)' : 'var(--state-error-subtle)',
                      color: isPassed ? 'var(--state-success)' : 'var(--state-error)',
                      border: `1px solid ${isPassed ? 'var(--state-success-border)' : 'var(--state-error-border)'}`,
                    }}
                  >
                    {isPassed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    <span>{isPassed ? (language === 'en' ? 'PASSED' : 'ĐẠT') : (language === 'en' ? 'FAILED' : 'CHƯA ĐẠT')}</span>
                  </div>
                </div>

                {/* Score & Metric Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '10px',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {language === 'en' ? 'Score' : 'Điểm số'}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isPassed ? 'var(--state-success)' : 'var(--state-error)' }}>
                      {res.percentage}%{' '}
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        ({res.score10}/10)
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {language === 'en' ? 'Correct / Total' : 'Số câu đúng'}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {res.correctCount} / {res.total}{' '}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ({Math.round((res.correctCount / res.total) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {language === 'en' ? 'Time Taken' : 'Thời gian làm'}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      <span>{res.timeSpentFormatted}</span>
                    </div>
                  </div>
                </div>

                {/* Footer row: Topics count and Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                    paddingTop: '4px',
                  }}
                >
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {language === 'en'
                      ? `${item.config.selectedTopicIds.length} topics included`
                      : `Gồm ${item.config.selectedTopicIds.length} chủ đề`}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye size={14} />}
                      onClick={() => onSelectReview(item)}
                    >
                      {language === 'en' ? 'Review Answers' : 'Xem lại bài thi'}
                    </Button>
                    <button
                      type="button"
                      title={language === 'en' ? 'Delete this attempt' : 'Xóa bài thi này'}
                      onClick={() => onDeleteItem(item.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-default)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--state-error)';
                        e.currentTarget.style.borderColor = 'var(--state-error-border)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
