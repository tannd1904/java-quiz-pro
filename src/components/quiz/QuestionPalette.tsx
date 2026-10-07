import React from 'react';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, number>;
  questionIds: string[];
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
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
        const isAnswered = qId !== undefined && answers[qId] !== undefined;
        const isCurrent = idx === currentIndex;

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
            title={`Câu ${idx + 1}${isAnswered ? ' (Đã làm)' : ' (Chưa làm)'}`}
            style={{
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border,
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
          </button>
        );
      })}
    </div>
  );
};
