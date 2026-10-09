import React from 'react';
import { useI18n } from '../../hooks/useI18n';

interface FooterProps {
  isAdmin?: boolean;
  onToggleAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isAdmin = false, onToggleAdmin }) => {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Java SE 8 / 11 / 17 / 21 Standard</span>
          <span>•</span>
          <span>Open Source</span>
          {onToggleAdmin && (
            <>
              <span>•</span>
              <button
                type="button"
                onClick={onToggleAdmin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isAdmin ? 'var(--brand-primary)' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: isAdmin ? 700 : 400,
                  cursor: 'pointer',
                  padding: 0,
                  opacity: isAdmin ? 1 : 0.6,
                }}
                title={isAdmin ? 'Thoát chế độ Quản trị viên' : 'Kích hoạt chế độ Quản trị viên'}
              >
                {isAdmin ? '🛡️ Quản trị viên (Đang bật)' : 'Quản trị viên'}
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
