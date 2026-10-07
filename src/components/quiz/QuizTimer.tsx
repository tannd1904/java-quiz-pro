import React from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  formattedTime: string;
  isWarning: boolean;
  isCritical: boolean;
  progressPercent: number;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  formattedTime,
  isWarning,
  isCritical,
}) => {
  let color = 'var(--text-primary)';
  let bg = 'var(--bg-surface-subtle)';
  let borderColor = 'var(--border-default)';

  if (isCritical) {
    color = 'var(--state-error)';
    bg = 'var(--state-error-subtle)';
    borderColor = 'var(--state-error-border)';
  } else if (isWarning) {
    color = 'var(--state-warning)';
    bg = 'var(--state-warning-subtle)';
    borderColor = 'var(--state-warning-border)';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: bg,
        border: `1.5px solid ${borderColor}`,
        color,
        fontWeight: 700,
        fontSize: '1.05rem',
        fontFamily: 'var(--font-mono)',
        boxShadow: isCritical ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none',
        transition: 'all var(--transition-fast)',
      }}
    >
      <Clock size={18} />
      <span>{formattedTime}</span>
    </div>
  );
};
