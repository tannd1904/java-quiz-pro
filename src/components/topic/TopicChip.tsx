import React, { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

  const shortTitle = language === 'en' ? topic.shortName.en : topic.shortName.vi;
  const fullDescription = language === 'en' ? topic.name.en : topic.name.vi;

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={() => onToggle(topic.id)}
        aria-pressed={selected}
        title={fullDescription}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.84rem',
          fontWeight: selected ? 600 : 500,
          backgroundColor: selected ? 'var(--brand-primary-subtle)' : 'var(--bg-surface-elevated)',
          border: `1px solid ${selected ? 'var(--brand-primary)' : 'var(--border-default)'}`,
          color: selected ? 'var(--brand-primary)' : 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: '0.95rem' }}>{topic.icon}</span>
        <span>{shortTitle}</span>
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

      {/* Modern Floating Hover Tooltip */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{topic.icon}</span>
            <span>{fullDescription}</span>
          </div>
          {/* Subtle triangle arrow */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid var(--bg-surface-elevated)',
            }}
          />
        </div>
      )}
    </div>
  );
};
