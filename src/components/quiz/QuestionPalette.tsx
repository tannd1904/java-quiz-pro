import React from 'react';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, any>;
  questionIds: string[];
  bookmarkedQuestionIds?: string[];
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
  bookmarkedQuestionIds = [],
  onSelectQuestion,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(38px, 1fr))',
        gap: '6px',
        maxHeight: '340px',
        overflowY: 'auto',
        padding: '4px',
      }}
    >
      {Array.from({ length: totalQuestions }).map((_, idx) => {
        const qId = questionIds[idx];
        const ans = qId !== undefined ? answers[qId] : undefined;
        const isAnswered =
          ans !== undefined &&
          ans !== null &&
          (Array.isArray(ans) ? ans.length > 0 : typeof ans === 'string' ? ans.trim().length > 0 : true);
        const isCurrent = idx === currentIndex;
        const isBookmarked = Boolean(qId && bookmarkedQuestionIds.includes(qId));

        let bg = 'var(--bg-surface-subtle)';
        let border = 'var(--border-default)';
        let text = 'var(--text-secondary)';

        if (isCurrent) {
          border = '2px solid var(--brand-primary)';
          bg = 'var(--brand-primary-subtle)';
          text = 'var(--brand-primary)';
        } else if (isAnswered) {
          border = '1px solid var(--brand-primary)';
          bg = 'var(--brand-primary)';
          text = '#ffffff';
        }

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(idx)}
            title={`Câu ${idx + 1}${isAnswered ? ' (Đã làm)' : ' (Chưa làm)'}${
              isBookmarked ? ' ⭐ (Đã đánh dấu)' : ''
            }`}
            style={{
              position: 'relative',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border: isBookmarked && !isCurrent ? '1.5px solid #f59e0b' : border,
              backgroundColor: bg,
              color: text,
              fontWeight: isCurrent || isAnswered ? 700 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)',
            }}
          >
            {idx + 1}
            {isBookmarked && (
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b',
                  boxShadow: '0 0 4px #f59e0b',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
