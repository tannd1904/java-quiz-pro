import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

interface MetricsGridProps {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeSpentFormatted: string;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  total,
  correct,
  wrong,
  skipped,
  timeSpentFormatted,
}) => {
  const { t } = useI18n();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        margin: '24px 0',
      }}
    >
      {/* Correct */}
      <div style={cardStyle('var(--state-success-subtle)', 'var(--state-success-border)')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--state-success)' }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t('result.metricCorrect')}</span>
        </div>
        <div style={numberStyle('var(--state-success)')}>
          {correct} <span style={subNumberStyle}>/ {total}</span>
        </div>
      </div>

      {/* Wrong */}
      <div style={cardStyle('var(--state-error-subtle)', 'var(--state-error-border)')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--state-error)' }}>
          <XCircle size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t('result.metricWrong')}</span>
        </div>
        <div style={numberStyle('var(--state-error)')}>
          {wrong} <span style={subNumberStyle}>/ {total}</span>
        </div>
      </div>

      {/* Skipped */}
      <div style={cardStyle('var(--state-warning-subtle)', 'var(--state-warning-border)')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--state-warning)' }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t('result.metricSkipped')}</span>
        </div>
        <div style={numberStyle('var(--state-warning)')}>
          {skipped} <span style={subNumberStyle}>/ {total}</span>
        </div>
      </div>

      {/* Duration */}
      <div style={cardStyle('var(--bg-surface-subtle)', 'var(--border-default)')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)' }}>
          <Clock size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t('result.metricTime')}</span>
        </div>
        <div style={numberStyle('var(--text-primary)')}>{timeSpentFormatted}</div>
      </div>
    </div>
  );
};

const cardStyle = (bg: string, border: string): React.CSSProperties => ({
  backgroundColor: bg,
  border: `1px solid ${border}`,
  borderRadius: 'var(--radius-md)',
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const numberStyle = (color: string): React.CSSProperties => ({
  fontSize: '1.75rem',
  fontWeight: 800,
  color,
  fontFamily: 'var(--font-mono)',
  lineHeight: 1.1,
});

const subNumberStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 500,
  color: 'var(--text-muted)',
};
