import React, { useState, useEffect } from 'react';
import { Coffee, History, User, Terminal } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { examTelemetryService, EVENT_CANDIDATE_NAME_UPDATED } from '../../services/examTelemetryService';

interface NavbarProps {
  onNavigateHome: () => void;
  onOpenExamHistory?: () => void;
  historyCount?: number;
  onEditCandidateName?: () => void;
  onOpenSandbox?: () => void;
  isExamActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onOpenExamHistory,
  historyCount = 0,
  onEditCandidateName,
  onOpenSandbox,
  isExamActive = false,
}) => {
  const { language, t } = useI18n();
  const [candidateName, setCandidateName] = useState<string>(() =>
    examTelemetryService.getCandidateName()
  );

  useEffect(() => {
    const handleNameUpdate = (e: any) => {
      setCandidateName(e.detail || examTelemetryService.getCandidateName());
    };
    window.addEventListener(EVENT_CANDIDATE_NAME_UPDATED, handleNameUpdate);
    return () => window.removeEventListener(EVENT_CANDIDATE_NAME_UPDATED, handleNameUpdate);
  }, []);

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
          {/* Candidate Name Badge */}
          {candidateName && (
            <button
              type="button"
              onClick={onEditCandidateName}
              title={language === 'en' ? 'Click to change candidate name' : 'Bấm để đổi tên thí sinh'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: 'var(--brand-primary-subtle)',
                border: '1px solid var(--brand-primary)',
                color: 'var(--brand-primary)',
                cursor: 'pointer',
                maxWidth: '140px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <User size={13} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidateName}</span>
            </button>
          )}

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

          {/* Quick Java Sandbox Runner Button (hidden in exam mode to prevent cheating) */}
          {onOpenSandbox && !isExamActive && (
            <button
              type="button"
              onClick={onOpenSandbox}
              title={language === 'en' ? 'Open Java Sandbox & Runner' : 'Mở trình chạy thử code Java nhanh (Playground)'}
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
                color: 'var(--brand-primary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Terminal size={15} />
              <span className="hide-on-mobile">{language === 'en' ? 'Sandbox ⚡' : 'Chạy code ⚡'}</span>
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
