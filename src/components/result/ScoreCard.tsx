import React from 'react';
import { Award, AlertTriangle, User } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { examTelemetryService } from '../../services/examTelemetryService';

interface ScoreCardProps {
  score10: number; // 0..10
  percentage: number; // 0..100
  isPassed: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score10, percentage, isPassed }) => {
  const { t } = useI18n();
  const candidateName = examTelemetryService.getCandidateName();

  return (
    <div
      style={{
        backgroundColor: isPassed ? 'var(--state-success-subtle)' : 'var(--state-error-subtle)',
        border: `2px solid ${isPassed ? 'var(--state-success-border)' : 'var(--state-error-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '32px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: isPassed ? 'var(--state-success)' : 'var(--state-error)',
          color: '#ffffff',
          marginBottom: '16px',
        }}
      >
        {isPassed ? <Award size={36} /> : <AlertTriangle size={36} />}
      </div>

      {candidateName && (
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '10px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <User size={14} color="var(--brand-primary)" />
            <span>{candidateName}</span>
          </div>
        </div>
      )}

      <h2
        style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: isPassed ? 'var(--state-success)' : 'var(--state-error)',
          marginBottom: '8px',
        }}
      >
        {isPassed ? t('result.passedTitle') : t('result.failedTitle')}
      </h2>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 24px' }}>
        {isPassed
          ? `${t('result.passedMsg')} ${percentage}%!`
          : t('result.failedMsg')}
      </p>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '8px',
          padding: '12px 28px',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-default)',
        }}
      >
        <span
          style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: isPassed ? 'var(--state-success)' : 'var(--state-error)',
            lineHeight: 1,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {score10.toFixed(1)}
        </span>
        <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {t('result.scoreOutOf10')} ({percentage}%)
        </span>
      </div>
    </div>
  );
};
