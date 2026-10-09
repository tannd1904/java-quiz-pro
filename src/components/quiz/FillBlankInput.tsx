import React from 'react';
import { CheckCircle2, XCircle, Send } from 'lucide-react';

interface FillBlankInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  placeholder?: string;
  isRevealed?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  acceptedAnswers?: string[];
  submitButtonText?: string;
}

export const FillBlankInput: React.FC<FillBlankInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Nhập câu trả lời hoặc output tại đây...',
  isRevealed = false,
  isCorrect = false,
  isWrong = false,
  acceptedAnswers,
  submitButtonText = 'Kiểm tra',
}) => {
  let borderColor = 'var(--border-default)';
  let bg = 'var(--bg-surface-elevated)';

  if (isRevealed || isCorrect || isWrong) {
    if (isCorrect) {
      borderColor = 'var(--state-success)';
      bg = 'var(--state-success-subtle)';
    } else if (isWrong || (isRevealed && !isCorrect)) {
      borderColor = 'var(--state-error)';
      bg = 'var(--state-error-subtle)';
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          border: `2px solid ${borderColor}`,
          backgroundColor: bg,
          transition: 'all var(--transition-fast)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            padding: '4px 8px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-xs)',
            flexShrink: 0,
          }}
        >
          Đáp án:
        </span>

        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            padding: '8px 4px',
          }}
        />

        {/* Status icons when revealed */}
        {isRevealed && isCorrect && (
          <CheckCircle2 size={22} color="var(--state-success)" style={{ flexShrink: 0 }} />
        )}
        {isRevealed && !isCorrect && (
          <XCircle size={22} color="var(--state-error)" style={{ flexShrink: 0 }} />
        )}

        {/* Optional quick submit button for Practice Mode */}
        {onSubmit && !disabled && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!value.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              fontWeight: 700,
              backgroundColor: value.trim() ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
              color: value.trim() ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              cursor: value.trim() ? 'pointer' : 'not-allowed',
              transition: 'all var(--transition-fast)',
              flexShrink: 0,
            }}
          >
            <span>{submitButtonText}</span>
            <Send size={13} />
          </button>
        )}
      </div>

      {/* Show accepted answers when revealed */}
      {isRevealed && acceptedAnswers && acceptedAnswers.length > 0 && (
        <div
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontWeight: 600 }}>Đáp án chuẩn:</span>
          {acceptedAnswers.map((ans, aIdx) => (
            <code
              key={aIdx}
              style={{
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                padding: '2px 6px',
                color: 'var(--brand-primary)',
                fontWeight: 700,
              }}
            >
              {ans}
            </code>
          ))}
        </div>
      )}
    </div>
  );
};
