import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Chuyển sang giao diện Sáng' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-surface-subtle)',
        border: '1px solid var(--border-default)',
        color: isDark ? '#facc15' : '#475569',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
};
