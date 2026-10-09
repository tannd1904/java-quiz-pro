import React from 'react';
import { CheckCircle2, XCircle, CheckSquare, Square } from 'lucide-react';

interface AnswerOptionProps {
  letter: string;
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  isRevealed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  isCheckbox?: boolean;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  letter,
  text,
  isSelected,
  isCorrect = false,
  isWrong = false,
  isRevealed = false,
  disabled = false,
  onClick,
  isCheckbox = false,
}) => {
  let borderColor = 'var(--border-default)';
  let bg = 'var(--bg-surface-elevated)';
  let textColor = 'var(--text-primary)';
  let letterBg = 'var(--bg-surface-subtle)';
  let letterColor = 'var(--text-secondary)';

  if (isRevealed) {
    if (isCorrect) {
      borderColor = 'var(--state-success)';
      bg = 'var(--state-success-subtle)';
      textColor = 'var(--state-success)';
      letterBg = 'var(--state-success)';
      letterColor = '#ffffff';
    } else if (isWrong) {
      borderColor = 'var(--state-error)';
      bg = 'var(--state-error-subtle)';
      textColor = 'var(--state-error)';
      letterBg = 'var(--state-error)';
      letterColor = '#ffffff';
    }
  } else if (isSelected) {
    borderColor = 'var(--brand-primary)';
    bg = 'var(--brand-primary-subtle)';
    textColor = 'var(--brand-primary)';
    letterBg = 'var(--brand-primary)';
    letterColor = '#ffffff';
  }

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 18px',
        borderRadius: 'var(--radius-md)',
        border: `1.5px solid ${borderColor}`,
        backgroundColor: bg,
        color: textColor,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Checkbox Icon if MULTIPLE_CHOICE */}
      {isCheckbox && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)',
            flexShrink: 0,
          }}
        >
          {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
        </span>
      )}

      {/* Letter badge (A, B, C, D) */}
      <span
        style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: letterBg,
          color: letterColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.85rem',
          flexShrink: 0,
          transition: 'all var(--transition-fast)',
        }}
      >
        {letter}
      </span>

      {/* Option Text */}
      <span
        style={{
          flex: 1,
          fontSize: '0.94rem',
          lineHeight: 1.45,
          fontWeight: isSelected ? 600 : 400,
        }}
      >
        {text}
      </span>

      {/* Status icons when revealed */}
      {isRevealed && isCorrect && (
        <CheckCircle2 size={20} color="var(--state-success)" style={{ flexShrink: 0 }} />
      )}
      {isRevealed && isWrong && (
        <XCircle size={20} color="var(--state-error)" style={{ flexShrink: 0 }} />
      )}
    </div>
  );
};
