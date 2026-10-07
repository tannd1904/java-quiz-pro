import React from 'react';
import { useI18n } from '../../hooks/useI18n';

export const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useI18n();

  return (
    <button
      onClick={toggleLanguage}
      title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      aria-label="Switch language"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-surface-subtle)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-primary)',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{language === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
      <span>{language === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  );
};
