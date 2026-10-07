import React from 'react';
import { TopicConfig } from '../../types/question';
import { useI18n } from '../../hooks/useI18n';

interface TopicChipProps {
  topic: TopicConfig;
  selected: boolean;
  onToggle: (id: string) => void;
  count?: number;
}

export const TopicChip: React.FC<TopicChipProps> = ({
  topic,
  selected,
  onToggle,
  count,
}) => {
  const { language } = useI18n();
  const displayName = language === 'en' ? topic.name.en : topic.name.vi;

  return (
    <button
      type="button"
      onClick={() => onToggle(topic.id)}
      aria-pressed={selected}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 14px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.86rem',
        fontWeight: selected ? 600 : 500,
        backgroundColor: selected ? 'var(--brand-primary-subtle)' : 'var(--bg-surface-elevated)',
        border: `1px solid ${selected ? 'var(--brand-primary)' : 'var(--border-default)'}`,
        color: selected ? 'var(--brand-primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: '1rem' }}>{topic.icon}</span>
      <span>{displayName}</span>
      {count !== undefined && (
        <span
          style={{
            fontSize: '0.72rem',
            padding: '2px 6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: selected ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
            color: selected ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 700,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
