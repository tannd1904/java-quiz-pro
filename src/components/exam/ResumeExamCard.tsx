import React from 'react';
import { ActiveExamSession } from '../../types/quiz';
import { useI18n } from '../../hooks/useI18n';
import { Button } from '../common/Button';
import { Play, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResumeExamCardProps {
  session: ActiveExamSession;
  onResume: () => void;
  onDiscard: () => void;
}

export const ResumeExamCard: React.FC<ResumeExamCardProps> = ({
  session,
  onResume,
  onDiscard,
}) => {
  const { language } = useI18n();

  const totalQuestions = session.items.length;
  const answeredCount = Object.keys(session.answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const mins = Math.floor(session.remainingSeconds / 60);
  const secs = session.remainingSeconds % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--brand-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.18)',
        marginBottom: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--brand-primary-subtle)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertCircle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {language === 'en'
                ? 'You have an exam in progress!'
                : 'Bạn đang có một bài thi đang làm dở dang!'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {language === 'en'
                ? 'Your answers and remaining time are preserved. You can resume anytime.'
                : 'Các câu đã chọn và thời gian làm bài còn lại đã được lưu tự động. Bạn có thể tiếp tục làm ngay.'}
            </div>
          </div>
        </div>

        {/* Quick Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--brand-primary-subtle)',
              color: 'var(--brand-primary)',
            }}
          >
            <CheckCircle2 size={13} />
            {answeredCount} / {totalQuestions} ({progressPercent}%)
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--state-error)',
            }}
          >
            <Clock size={13} />
            {timeFormatted}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-surface-subtle)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--brand-primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 size={14} />}
          onClick={() => {
            if (
              window.confirm(
                language === 'en'
                  ? 'Discard this unfinished exam and start over?'
                  : 'Bạn có chắc chắn muốn hủy bỏ bài thi dở dang này?'
              )
            ) {
              onDiscard();
            }
          }}
          style={{ color: 'var(--state-error)' }}
        >
          {language === 'en' ? 'Discard Exam' : 'Hủy bài thi này'}
        </Button>

        <Button
          variant="primary"
          size="sm"
          icon={<Play size={15} />}
          onClick={onResume}
          style={{ fontWeight: 700 }}
        >
          {language === 'en' ? 'Resume Exam Now' : 'Tiếp tục làm bài ngay 🚀'}
        </Button>
      </div>
    </div>
  );
};
