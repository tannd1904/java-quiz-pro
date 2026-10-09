import React from 'react';
import { useI18n } from '../../hooks/useI18n';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        padding: '24px 0',
        fontSize: '0.84rem',
        color: 'var(--text-muted)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>{t('footer.copyright')}</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Java SE 8 / 11 / 17 / 21 Standard</span>
          <span>•</span>
          <span>Open Source</span>
        </div>
      </div>
    </footer>
  );
};
