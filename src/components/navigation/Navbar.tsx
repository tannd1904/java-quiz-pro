import React from 'react';
import { Coffee, History, Flag } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface NavbarProps {
  onNavigateHome: () => void;
  onOpenExamHistory?: () => void;
  historyCount?: number;
  onOpenReports?: () => void;
  pendingReportCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onOpenExamHistory,
  historyCount = 0,
  onOpenReports,
  pendingReportCount = 0,
}) => {
  const { language, t } = useI18n();

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
          height: '62px',
          gap: '8px',
        }}
      >
        {/* Brand */}
        <div
          onClick={onNavigateHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
              flexShrink: 0,
            }}
          >
            <Coffee size={20} />
          </div>
          <div>
            <div
              style={{
                fontSize: 'clamp(1rem, 3.2vw, 1.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {t('nav.brandTitle')}
            </div>
            <div
              className="hide-on-mobile"
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {t('nav.brandSubtitle')}
            </div>
          </div>
        </div>

        {/* Right Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

          {/* Exam History Button */}
          {onOpenExamHistory && (
            <button
              type="button"
              onClick={onOpenExamHistory}
              title={language === 'en' ? 'View Exam History' : 'Xem lịch sử làm bài thi'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <History size={15} />
              <span className="hide-on-mobile">{language === 'en' ? 'History' : 'Lịch sử thi'}</span>
              {historyCount > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--brand-primary-subtle)',
                    color: 'var(--brand-primary)',
                    fontWeight: 700,
                  }}
                >
                  {historyCount}
                </span>
              )}
            </button>
          )}

          {/* Admin Reports Button */}
          {onOpenReports && (
            <button
              type="button"
              onClick={onOpenReports}
              title={
                language === 'en'
                  ? 'Question Issue Reports (Admin)'
                  : 'Quản lý Báo cáo câu hỏi sai (Quản trị viên)'
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor:
                  pendingReportCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface-subtle)',
                border: `1px solid ${
                  pendingReportCount > 0 ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-default)'
                }`,
                color: pendingReportCount > 0 ? '#ef4444' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Flag size={14} />
              <span className="hide-on-mobile">{language === 'en' ? 'Reports' : 'Báo lỗi'}</span>
              {pendingReportCount > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  {pendingReportCount}
                </span>
              )}
            </button>
          )}


          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
