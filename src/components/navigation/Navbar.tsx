import React from 'react';
import { Coffee, FileText, Lock, Unlock } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface NavbarProps {
  isPracticeEnabled: boolean;
  onTogglePracticeLock: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPracticeEnabled,
  onTogglePracticeLock,
  onNavigateHome,
}) => {
  const { t } = useI18n();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}
      >
        {/* Brand */}
        <div
          onClick={onNavigateHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
            }}
          >
            <Coffee size={22} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {t('nav.brandTitle')}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {t('nav.brandSubtitle')}
            </div>
          </div>
        </div>

        {/* Right Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Admin Practice Lock Toggle Badge */}
          <button
            onClick={onTogglePracticeLock}
            title={t('nav.practiceLockTooltip')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              border: `1px solid ${isPracticeEnabled ? 'var(--state-success-border)' : 'var(--state-warning-border)'}`,
              backgroundColor: isPracticeEnabled ? 'var(--state-success-subtle)' : 'var(--state-warning-subtle)',
              color: isPracticeEnabled ? 'var(--state-success)' : 'var(--state-warning)',
            }}
          >
            {isPracticeEnabled ? <Unlock size={14} /> : <Lock size={14} />}
            <span>{isPracticeEnabled ? t('nav.practiceUnlocked') : t('nav.practiceLocked')}</span>
          </button>

          {/* PDF Summary Document Link */}
          <a
            href="./bang_tong_hop_cau_hoi.html"
            target="_blank"
            rel="noopener noreferrer"
            title="Mở tài liệu bảng tổng hợp 340+ câu hỏi"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <FileText size={15} />
            <span className="hide-on-mobile">{t('nav.pdfSummary')}</span>
          </a>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
